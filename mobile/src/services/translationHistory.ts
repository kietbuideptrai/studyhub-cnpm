import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TranslationLanguage } from "@/utils/translation";

export interface TranslationHistoryItem {
  id: string;
  sourceLanguage: TranslationLanguage;
  targetLanguage: TranslationLanguage;
  originalText: string;
  translatedText: string;
  createdAt: string;
}

const HISTORY_KEY = "@studyhub/translation_history";
const MAX_HISTORY_ITEMS = 100;

export async function getTranslationHistory(): Promise<
  TranslationHistoryItem[]
> {
  const storedHistory = await AsyncStorage.getItem(HISTORY_KEY);
  if (!storedHistory) {
    return [];
  }

  let parsedHistory: unknown;
  try {
    parsedHistory = JSON.parse(storedHistory);
  } catch {
    throw new Error("Dữ liệu lịch sử bản dịch không đọc được.");
  }

  if (!Array.isArray(parsedHistory)) {
    throw new Error("Dữ liệu lịch sử bản dịch không hợp lệ.");
  }

  const historyItems = parsedHistory.map(normalizeTranslationHistoryItem);
  const validItems = historyItems.filter(
    (item): item is TranslationHistoryItem => item !== null,
  );
  if (validItems.length !== historyItems.length) {
    throw new Error("Dữ liệu lịch sử bản dịch không hợp lệ.");
  }

  return validItems.slice(0, MAX_HISTORY_ITEMS);
}

export async function saveTranslationHistory(
  item: TranslationHistoryItem,
): Promise<void> {
  const history = await getTranslationHistory();
  const updatedHistory = [
    item,
    ...history.filter((historyItem) => historyItem.id !== item.id),
  ].slice(0, MAX_HISTORY_ITEMS);

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}

export async function clearTranslationHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

function normalizeTranslationHistoryItem(
  value: unknown,
): TranslationHistoryItem | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const item = value as Record<string, unknown>;
  const sourceLanguage = normalizeTranslationLanguage(item.sourceLanguage);
  const targetLanguage = normalizeTranslationLanguage(item.targetLanguage);
  if (
    typeof item.id !== "string" ||
    sourceLanguage === null ||
    targetLanguage === null ||
    typeof item.originalText !== "string" ||
    typeof item.translatedText !== "string" ||
    typeof item.createdAt !== "string" ||
    Number.isNaN(Date.parse(item.createdAt))
  ) {
    return null;
  }

  return {
    id: item.id,
    sourceLanguage,
    targetLanguage,
    originalText: item.originalText,
    translatedText: item.translatedText,
    createdAt: item.createdAt,
  };
}

function normalizeTranslationLanguage(
  value: unknown,
): TranslationLanguage | null {
  if (value === "en" || value === "English") {
    return "en";
  }
  if (value === "vi" || value === "Vietnamese") {
    return "vi";
  }

  return null;
}
