
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TranslationHistoryItem = {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  originalText: string;
  translatedText: string;
  createdAt: string;
};

const HISTORY_KEY = '@studyhub/translation_history';

export async function getTranslationHistory(): Promise<
  TranslationHistoryItem[]
> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data) as TranslationHistoryItem[];
  } catch (error) {
    console.error('Failed to load translation history:', error);
    return [];
  }
}

export async function saveTranslationHistory(
  item: TranslationHistoryItem,
): Promise<void> {
  const history = await getTranslationHistory();

  const updatedHistory = [item, ...history];

  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(updatedHistory),
  );
}

export async function clearTranslationHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
