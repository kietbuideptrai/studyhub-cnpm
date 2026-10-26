import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useLocation, useSearchParams } from "react-router";
import type { Language } from "../../../shared/types";
import { isLanguageCode } from "../utils/language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const STORAGE_KEY = "language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

function getInitialLanguage(): Language {
  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  if (isLanguageCode(urlLanguage)) {
    return urlLanguage;
  }

  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return isLanguageCode(savedLanguage) ? savedLanguage : "vi";
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const urlLanguage = searchParams.get("lang");
    if (isLanguageCode(urlLanguage)) {
      setLanguageState(urlLanguage);
      window.localStorage.setItem(STORAGE_KEY, urlLanguage);
      return;
    }

    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    const nextLanguage = isLanguageCode(savedLanguage) ? savedLanguage : "vi";
    setLanguageState(nextLanguage);

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("lang", nextLanguage);
    setSearchParams(nextSearchParams, { replace: true });
  }, [location.pathname, location.search, searchParams, setSearchParams]);

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      setLanguageState(nextLanguage);
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);

      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set("lang", nextLanguage);
      setSearchParams(nextSearchParams);
    },
    [searchParams, setSearchParams],
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
