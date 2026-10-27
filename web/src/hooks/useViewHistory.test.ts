import { describe, expect, it } from "vitest";
import { addViewToHistory, normalizeViewHistory } from "./useViewHistory";

describe("view history helpers", () => {
  it("normalizes persisted values, removing invalid and duplicate slugs", () => {
    expect(
      normalizeViewHistory([
        "first",
        "",
        "second",
        "first",
        null,
        "third",
      ]),
    ).toEqual(["first", "second", "third"]);
    expect(normalizeViewHistory({ slugs: ["artifact"] })).toEqual([]);
  });

  it("keeps the most recently viewed slug first without duplicates", () => {
    expect(addViewToHistory(["first", "second"], "second")).toEqual([
      "second",
      "first",
    ]);
  });

  it("keeps at most 20 unique recent slugs", () => {
    const history = Array.from({ length: 20 }, (_, index) => `item-${index}`);

    expect(addViewToHistory(history, "newest")).toHaveLength(20);
    expect(addViewToHistory(history, "newest")).toEqual([
      "newest",
      ...history.slice(0, 19),
    ]);
  });
});
