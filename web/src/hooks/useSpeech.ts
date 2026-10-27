import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Language } from "../../../shared/types";

const ttsLocales: Record<Language, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
};

export function getTtsLocale(language: Language): string {
  return ttsLocales[language];
}

export type SpeechStatus = "idle" | "playing" | "paused";
export type VoiceStatus =
  | "loading"
  | "available"
  | "unavailable"
  | "unknown";

export interface UseSpeechResult {
  status: SpeechStatus;
  voiceStatus: VoiceStatus;
  error: string | null;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function getVoiceStatus(
  ttsLang: string,
): Exclude<VoiceStatus, "unknown"> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return "unavailable";
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    return "loading";
  }

  const normalizedTtsLang = ttsLang.toLowerCase();
  return voices.some((voice) =>
    voice.lang.toLowerCase().startsWith(normalizedTtsLang),
  )
    ? "available"
    : "unavailable";
}

export function useSpeech(text: string, language: Language): UseSpeechResult {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const utteranceQueue = useRef<string[]>([]);
  const currentIndex = useRef(0);
  const requestId = useRef(0);
  const locale = getTtsLocale(language);

  const sentences = useMemo(() => splitSentences(text), [text]);

  const stop = useCallback(() => {
    requestId.current += 1;
    utteranceQueue.current = [];
    currentIndex.current = 0;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
    setError(null);
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setVoiceStatus("unavailable");
      return;
    }

    const speechSynthesis = window.speechSynthesis;
    let voicesLoadTimeout: number | undefined;
    let voicesLoadTimedOut = false;

    function updateVoiceAvailability() {
      const nextStatus = getVoiceStatus(locale);
      if (nextStatus === "loading") {
        if (voicesLoadTimedOut) {
          setVoiceStatus("unknown");
        } else {
          setVoiceStatus("loading");
        }
        return;
      }

      if (voicesLoadTimeout !== undefined) {
        window.clearTimeout(voicesLoadTimeout);
      }
      setVoiceStatus(nextStatus);
    }

    speechSynthesis.addEventListener("voiceschanged", updateVoiceAvailability);
    const initialStatus = getVoiceStatus(locale);
    setVoiceStatus(initialStatus);
    if (initialStatus === "loading") {
      voicesLoadTimeout = window.setTimeout(() => {
        voicesLoadTimedOut = true;
        updateVoiceAvailability();
      }, 2_000);
    }

    return () => {
      speechSynthesis.removeEventListener(
        "voiceschanged",
        updateVoiceAvailability,
      );
      if (voicesLoadTimeout !== undefined) {
        window.clearTimeout(voicesLoadTimeout);
      }
    };
  }, [locale]);

  useEffect(() => {
    stop();
    return stop;
  }, [text, language, stop]);

  const speakNextSentence = useCallback(
    (activeRequestId: number) => {
      if (
        activeRequestId !== requestId.current ||
        currentIndex.current >= utteranceQueue.current.length
      ) {
        if (activeRequestId === requestId.current) {
          setStatus("idle");
        }
        return;
      }

      const utterance = new SpeechSynthesisUtterance(
        utteranceQueue.current[currentIndex.current],
      );
      utterance.lang = locale;
      utterance.onend = () => {
        if (activeRequestId !== requestId.current) {
          return;
        }
        currentIndex.current += 1;
        window.setTimeout(() => speakNextSentence(activeRequestId), 0);
      };
      utterance.onerror = (event) => {
        if (activeRequestId !== requestId.current || event.error === "canceled") {
          return;
        }
        setStatus("idle");
        setError("Không thể phát thuyết minh trên thiết bị này.");
      };

      window.speechSynthesis.speak(utterance);
    },
    [locale],
  );

  const play = useCallback(() => {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window) ||
      voiceStatus === "unavailable"
    ) {
      setVoiceStatus("unavailable");
      return;
    }

    if (sentences.length === 0) {
      setError("Không có nội dung để đọc.");
      return;
    }

    window.speechSynthesis.cancel();
    requestId.current += 1;
    const activeRequestId = requestId.current;
    utteranceQueue.current = sentences;
    currentIndex.current = 0;
    setError(null);
    setStatus("playing");
    speakNextSentence(activeRequestId);
  }, [sentences, speakNextSentence, voiceStatus]);

  const pause = useCallback(() => {
    if (status === "playing") {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  }, [status]);

  const resume = useCallback(() => {
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
    }
  }, [status]);

  return { status, voiceStatus, error, play, pause, resume, stop };
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?。！？])\s*/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}
