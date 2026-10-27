import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getTtsLocale,
  getVoiceStatus,
  splitSentences,
} from "./useSpeech";

describe("getVoiceStatus", () => {
  const getVoices = vi.fn<() => SpeechSynthesisVoice[]>();

  afterEach(() => {
    vi.unstubAllGlobals();
    getVoices.mockReset();
  });

  describe("speech language and sentence helpers", () => {
    it.each([
      ["vi", "vi-VN"],
      ["en", "en-US"],
      ["zh", "zh-CN"],
      ["ja", "ja-JP"],
      ["ko", "ko-KR"],
    ] as const)("maps %s to the %s TTS locale", (language, locale) => {
      expect(getTtsLocale(language)).toBe(locale);
    });

    it("splits sentences, trims whitespace, and omits empty sentences", () => {
      expect(
        splitSentences("  First sentence.  Second sentence! ?  Third sentence。"),
      ).toEqual([
        "First sentence.",
        "Second sentence!",
        "?",
        "Third sentence。",
      ]);
    });

    it("splits CJK sentence terminators without requiring spaces", () => {
      expect(splitSentences("第一句。第二句！第三句？")).toEqual([
        "第一句。",
        "第二句！",
        "第三句？",
      ]);
    });
  });

  it.each([
    ["vi-VN", "vi-VN"],
    ["en-US", "en-US"],
    ["zh-CN", "zh-CN"],
    ["ja-JP", "ja-JP"],
    ["ko-KR", "ko-KR"],
  ])("returns available for a matching %s voice", (ttsLang, voiceLang) => {
    getVoices.mockReturnValue([{ lang: voiceLang } as SpeechSynthesisVoice]);
    vi.stubGlobal("window", {
      speechSynthesis: { getVoices },
    });

    expect(getVoiceStatus(ttsLang)).toBe("available");
    expect(getVoices).toHaveBeenCalledOnce();
  });

  it("matches language codes case-insensitively when the voice has a locale suffix", () => {
    getVoices.mockReturnValue([
      { lang: "EN-us-x-variant" } as SpeechSynthesisVoice,
    ]);
    vi.stubGlobal("window", {
      speechSynthesis: { getVoices },
    });

    expect(getVoiceStatus("en-US")).toBe("available");
  });

  it("returns loading while the browser has not loaded any voices", () => {
    getVoices.mockReturnValue([]);
    vi.stubGlobal("window", {
      speechSynthesis: { getVoices },
    });

    expect(getVoiceStatus("ja-JP")).toBe("loading");
  });

  it("returns unavailable when voices exist but none match the TTS locale", () => {
    getVoices.mockReturnValue([
      { lang: "en-US" } as SpeechSynthesisVoice,
      { lang: "fr-FR" } as SpeechSynthesisVoice,
    ]);
    vi.stubGlobal("window", {
      speechSynthesis: { getVoices },
    });

    expect(getVoiceStatus("ko-KR")).toBe("unavailable");
  });
});
