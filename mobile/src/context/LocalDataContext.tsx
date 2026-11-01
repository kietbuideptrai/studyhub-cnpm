import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

export type FontSize = "small" | "medium" | "large";

interface LocalDataContextValue {
  isLoading: boolean;
  favoriteSlugs: string[];
  historySlugs: string[];
  fontSize: FontSize;
  fontScale: number;
  storageError: string | null;
  toggleFavorite: (slug: string) => void;
  recordViewed: (slug: string) => void;
  setFontSize: (fontSize: FontSize) => void;
}

const FAVORITES_KEY = "artifact-guide.favorites";
const HISTORY_KEY = "artifact-guide.history";
const FONT_SIZE_KEY = "artifact-guide.font-size";
const MAX_HISTORY_ITEMS = 20;
const fontScales: Record<FontSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.2,
};

const LocalDataContext = createContext<LocalDataContextValue | null>(null);

interface LocalDataProviderProps {
  children: ReactNode;
}

export function LocalDataProvider({ children }: LocalDataProviderProps) {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [historySlugs, setHistorySlugs] = useState<string[]>([]);
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const favoriteSlugsRef = useRef<string[]>([]);
  const historySlugsRef = useRef<string[]>([]);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let isMounted = true;

    async function loadLocalData() {
      try {
        const values = await AsyncStorage.multiGet([
          FAVORITES_KEY,
          HISTORY_KEY,
          FONT_SIZE_KEY,
        ]);
        const storedValues = new Map(values);
        const nextFavorites = parseSlugList(storedValues.get(FAVORITES_KEY));
        const nextHistory = parseSlugList(storedValues.get(HISTORY_KEY)).slice(
          0,
          MAX_HISTORY_ITEMS,
        );
        const savedFontSize = storedValues.get(FONT_SIZE_KEY);
        const nextFontSize = isFontSize(savedFontSize) ? savedFontSize : "medium";

        if (isMounted) {
          favoriteSlugsRef.current = nextFavorites;
          historySlugsRef.current = nextHistory;
          setFavoriteSlugs(nextFavorites);
          setHistorySlugs(nextHistory);
          setFontSizeState(nextFontSize);
        }
      } catch {
        if (isMounted) {
          setStorageError("Không thể đọc dữ liệu đã lưu trên thiết bị.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadLocalData();
    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback((key: string, value: string) => {
    writeQueue.current = writeQueue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(key, value))
      .then(() => setStorageError(null))
      .catch(() => {
        setStorageError("Không thể lưu dữ liệu cá nhân trên thiết bị.");
      });
  }, []);

  const toggleFavorite = useCallback(
    (slug: string) => {
      const nextFavorites = favoriteSlugsRef.current.includes(slug)
        ? favoriteSlugsRef.current.filter((favoriteSlug) => favoriteSlug !== slug)
        : [slug, ...favoriteSlugsRef.current];

      favoriteSlugsRef.current = nextFavorites;
      setFavoriteSlugs(nextFavorites);
      persist(FAVORITES_KEY, JSON.stringify(nextFavorites));
    },
    [persist],
  );

  const recordViewed = useCallback(
    (slug: string) => {
      const nextHistory = [
        slug,
        ...historySlugsRef.current.filter((historySlug) => historySlug !== slug),
      ].slice(0, MAX_HISTORY_ITEMS);

      historySlugsRef.current = nextHistory;
      setHistorySlugs(nextHistory);
      persist(HISTORY_KEY, JSON.stringify(nextHistory));
    },
    [persist],
  );

  const setFontSize = useCallback(
    (nextFontSize: FontSize) => {
      setFontSizeState(nextFontSize);
      persist(FONT_SIZE_KEY, nextFontSize);
    },
    [persist],
  );

  const value = useMemo(
    () => ({
      isLoading,
      favoriteSlugs,
      historySlugs,
      fontSize,
      fontScale: fontScales[fontSize],
      storageError,
      toggleFavorite,
      recordViewed,
      setFontSize,
    }),
    [
      favoriteSlugs,
      fontSize,
      historySlugs,
      isLoading,
      recordViewed,
      setFontSize,
      storageError,
      toggleFavorite,
    ],
  );

  return (
    <LocalDataContext.Provider value={value}>
      {children}
    </LocalDataContext.Provider>
  );
}

export function useLocalData(): LocalDataContextValue {
  const context = useContext(LocalDataContext);
  if (!context) {
    throw new Error("useLocalData must be used within a LocalDataProvider");
  }

  return context;
}

function parseSlugList(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return [...new Set(parsed.filter(isArtifactSlug))];
  } catch {
    return [];
  }
}

function isArtifactSlug(value: unknown): value is string {
  return (
    typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value)
  );
}

function isFontSize(value: string | null | undefined): value is FontSize {
  return value === "small" || value === "medium" || value === "large";
}