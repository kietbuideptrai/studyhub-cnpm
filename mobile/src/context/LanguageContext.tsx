import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Language } from "../../../shared/types";
import { isLanguage } from "@/utils/languages";

interface LanguageContextValue {
  isLoading: boolean;
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  storageError: string | null;
}

const LANGUAGE_STORAGE_KEY = "artifact-guide.language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("vi");
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (isMounted && isLanguage(savedLanguage)) {
          setLanguageState(savedLanguage);
        }
      } catch {
        if (isMounted) {
          setStorageError(
            "Không thể đọc ngôn ngữ đã lưu. Ứng dụng sẽ dùng tiếng Việt.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSavedLanguage();
    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    setStorageError(null);

    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      setStorageError(
        "Không thể lưu ngôn ngữ. Lựa chọn này chỉ được giữ đến khi đóng ứng dụng.",
      );
    }
  }, []);

  const value = useMemo(
    () => ({ isLoading, language, setLanguage, storageError }),
    [isLoading, language, setLanguage, storageError],
  );

  return (
    <LanguageContext.Provider value={value}>
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
