import { useLanguage } from "../context/LanguageContext";
import { languages } from "../utils/language";
import { isLanguageCode } from "../utils/language";

function handleLanguageChange(
  value: string,
  setLanguage: (language: (typeof languages)[number]["code"]) => void,
): void {
  if (isLanguageCode(value)) {
    setLanguage(value);
  }
}

export function LanguagePicker() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-picker">
      <label htmlFor="language-select">Ngôn ngữ</label>
      <select
        id="language-select"
        value={language}
        onChange={(event) =>
          handleLanguageChange(event.currentTarget.value, setLanguage)
        }
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}
