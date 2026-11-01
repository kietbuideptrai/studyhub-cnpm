import { describe, expect, it } from "vitest";
import { getFontScale } from "./FontSizeContext";

describe("font size scale", () => {
  it("maps each supported size to its CSS scale", () => {
    expect(getFontScale("normal")).toBe(1);
    expect(getFontScale("large")).toBe(1.25);
    expect(getFontScale("largest")).toBe(1.5);
  });
});
