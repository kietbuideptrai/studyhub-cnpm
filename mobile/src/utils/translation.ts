export type TranslationLanguage = "en" | "vi";

export const translationLanguages: Record<TranslationLanguage, string> = {
  en: "Tiếng Anh",
  vi: "Tiếng Việt",
};

const translations: Record<TranslationLanguage, Record<string, string>> = {
  en: {
    hello: "Xin chào",
    "thank you": "Cảm ơn",
    "good morning": "Chào buổi sáng",
    goodbye: "Tạm biệt",
    welcome: "Chào mừng",
    "how are you?": "Bạn khỏe không?",
    "good night": "Chúc ngủ ngon",
    "i love you": "Tôi yêu bạn",
    "see you later": "Hẹn gặp lại",
    sorry: "Xin lỗi",
  },
  vi: {
    "xin chào": "Hello",
    "cảm ơn": "Thank you",
    "chào buổi sáng": "Good morning",
    "tạm biệt": "Goodbye",
    "chào mừng": "Welcome",
    "bạn khỏe không?": "How are you?",
    "chúc ngủ ngon": "Good night",
    "tôi yêu bạn": "I love you",
    "hẹn gặp lại": "See you later",
    "xin lỗi": "Sorry",
  },
};

export function translatePhrase(
  text: string,
  sourceLanguage: TranslationLanguage,
): string | null {
  const phrase = text.trim().toLocaleLowerCase();
  if (!phrase) {
    return null;
  }

  if (sourceLanguage === "en") {
    return translations.en[phrase] ?? null;
  }

  return translations.vi[phrase] ?? null;
}
