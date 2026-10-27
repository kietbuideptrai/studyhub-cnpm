import { useCallback, useRef, useState } from "react";

const VIEW_HISTORY_STORAGE_KEY = "viewHistory";
const MAX_VIEW_HISTORY_ITEMS = 20;

export function normalizeViewHistory(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const slugs: string[] = [];
  const seenSlugs = new Set<string>();

  for (const valueItem of value) {
    if (
      typeof valueItem !== "string" ||
      valueItem.trim().length === 0 ||
      seenSlugs.has(valueItem)
    ) {
      continue;
    }

    seenSlugs.add(valueItem);
    slugs.push(valueItem);
    if (slugs.length === MAX_VIEW_HISTORY_ITEMS) {
      break;
    }
  }

  return slugs;
}

export function addViewToHistory(slugs: string[], slug: string): string[] {
  return [slug, ...slugs.filter((currentSlug) => currentSlug !== slug)].slice(
    0,
    MAX_VIEW_HISTORY_ITEMS,
  );
}

function readViewHistory(): string[] {
  try {
    const storedHistory = window.localStorage.getItem(VIEW_HISTORY_STORAGE_KEY);
    if (!storedHistory) {
      return [];
    }

    return normalizeViewHistory(JSON.parse(storedHistory) as unknown);
  } catch {
    return [];
  }
}

function persistViewHistory(slugs: string[]): void {
  try {
    window.localStorage.setItem(
      VIEW_HISTORY_STORAGE_KEY,
      JSON.stringify(slugs),
    );
  } catch {
    // Keep in-memory history usable when storage is unavailable or full.
  }
}

export interface UseViewHistoryResult {
  slugs: string[];
  recordView: (slug: string) => void;
  clearHistory: () => void;
}

export function useViewHistory(): UseViewHistoryResult {
  const [slugs, setSlugs] = useState<string[]>(readViewHistory);
  const slugsRef = useRef(slugs);

  const recordView = useCallback((slug: string) => {
    if (slug.trim().length === 0) {
      return;
    }

    const nextSlugs = addViewToHistory(slugsRef.current, slug);
    slugsRef.current = nextSlugs;
    setSlugs(nextSlugs);
    persistViewHistory(nextSlugs);
  }, []);

  const clearHistory = useCallback(() => {
    slugsRef.current = [];
    setSlugs([]);
    try {
      window.localStorage.removeItem(VIEW_HISTORY_STORAGE_KEY);
    } catch {
      // The in-memory history is still cleared when storage is unavailable.
    }
  }, []);

  return { slugs, recordView, clearHistory };
}
