import type { Language } from "../../../shared/types";

export const languages: { code: Language; label: string }[] = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
];

export function isLanguage(value: string | null): value is Language {
  return languages.some((language) => language.code === value);
}

export function getLanguageLabel(language: Language): string {
  return languages.find((item) => item.code === language)?.label ?? language;
}
