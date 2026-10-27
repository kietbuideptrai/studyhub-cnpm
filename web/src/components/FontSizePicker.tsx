import { FONT_SIZE_OPTIONS, useFontSize } from "../context/FontSizeContext";
import type { FontSize } from "../context/FontSizeContext";

const fontSizeLabels: Record<FontSize, string> = {
  normal: "Bình thường",
  large: "Lớn",
  largest: "Rất lớn",
};

function isFontSize(value: string): value is FontSize {
  return FONT_SIZE_OPTIONS.some((option) => option === value);
}

export function FontSizePicker() {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className="font-size-picker">
      <label htmlFor="font-size-select">Cỡ chữ</label>
      <select
        aria-label="Chọn cỡ chữ"
        id="font-size-select"
        value={fontSize}
        onChange={(event) => {
          const value = event.currentTarget.value;
          if (isFontSize(value)) {
            setFontSize(value);
          }
        }}
      >
        {FONT_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {fontSizeLabels[option]}
          </option>
        ))}
      </select>
    </div>
  );
}
