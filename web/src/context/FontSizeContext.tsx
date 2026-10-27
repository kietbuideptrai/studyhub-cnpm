import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export const FONT_SIZE_OPTIONS = ["normal", "large", "largest"] as const;
export type FontSize = (typeof FONT_SIZE_OPTIONS)[number];

const FONT_SIZE_STORAGE_KEY = "fontSize";
const FONT_SIZE_SCALE: Record<FontSize, number> = {
  normal: 1,
  large: 1.25,
  largest: 1.5,
};

interface FontSizeContextValue {
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

interface FontSizeProviderProps {
  children: ReactNode;
}

function isFontSize(value: string | null): value is FontSize {
  return FONT_SIZE_OPTIONS.some((option) => option === value);
}

function getInitialFontSize(): FontSize {
  const savedFontSize = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
  return isFontSize(savedFontSize) ? savedFontSize : "normal";
}

export function getFontScale(fontSize: FontSize): number {
  return FONT_SIZE_SCALE[fontSize];
}

export function FontSizeProvider({ children }: FontSizeProviderProps) {
  const [fontSize, setFontSize] = useState<FontSize>(getInitialFontSize);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-scale", String(FONT_SIZE_SCALE[fontSize]));
    root.dataset.fontSize = fontSize;
    window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
  }, [fontSize]);

  const value = useMemo(
    () => ({ fontSize, setFontSize }),
    [fontSize],
  );

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize(): FontSizeContextValue {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }

  return context;
}
