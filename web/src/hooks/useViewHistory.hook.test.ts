import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useViewHistory } from "./useViewHistory";

beforeEach(() => {
  window.localStorage.clear();
});

describe("useViewHistory", () => {
  it("stores no more than 20 recently viewed slugs", () => {
    const { result } = renderHook(() => useViewHistory());

    act(() => {
      for (let index = 0; index < 25; index += 1) {
        result.current.recordView(`artifact-${index}`);
      }
    });

    expect(result.current.slugs).toHaveLength(20);
    expect(result.current.slugs[0]).toBe("artifact-24");
    expect(result.current.slugs.at(-1)).toBe("artifact-5");
    expect(JSON.parse(window.localStorage.getItem("viewHistory") ?? "[]")).toEqual(
      result.current.slugs,
    );
  });

  it("moves an already viewed slug to the front without duplicating it", () => {
    const { result } = renderHook(() => useViewHistory());

    act(() => {
      result.current.recordView("artifact-a");
      result.current.recordView("artifact-b");
      result.current.recordView("artifact-a");
    });

    expect(result.current.slugs).toEqual(["artifact-a", "artifact-b"]);
  });
});
