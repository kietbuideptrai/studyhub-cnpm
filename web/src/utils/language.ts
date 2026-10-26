export const languages = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

export function isLanguageCode(value: string | null): value is LanguageCode {
  return languages.some((language) => language.code === value);
}

export function getSelectedLanguage(requestedLanguage: string | null): LanguageCode {
  if (isLanguageCode(requestedLanguage)) {
    return requestedLanguage;
  }

  const savedLanguage = window.localStorage.getItem("language");
  return isLanguageCode(savedLanguage) ? savedLanguage : "vi";
}

export function getLanguageLabel(languageCode: LanguageCode): string {
  return languages.find((language) => language.code === languageCode)?.label ?? languageCode;
}
