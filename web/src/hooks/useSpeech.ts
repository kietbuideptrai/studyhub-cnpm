import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Language } from "../../../shared/types";

const ttsLocales: Record<Language, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
};

export type SpeechStatus = "idle" | "playing" | "paused";

export interface UseSpeechResult {
  status: SpeechStatus;
  unavailable: boolean;
  error: string | null;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useSpeech(text: string, language: Language): UseSpeechResult {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceQueue = useRef<string[]>([]);
  const currentIndex = useRef(0);
  const requestId = useRef(0);
  const locale = ttsLocales[language];

  const sentences = useMemo(() => splitIntoSentences(text), [text]);

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
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setUnavailable(true);
      return;
    }

    const speechSynthesis = window.speechSynthesis;

    function updateVoiceAvailability() {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        return;
      }

      const normalizedLocale = locale.toLowerCase();
      const hasMatchingVoice = voices.some((voice) => {
        const voiceLocale = voice.lang.toLowerCase();
        return (
          voiceLocale === normalizedLocale ||
          voiceLocale.startsWith(`${normalizedLocale}-`)
        );
      });
      setUnavailable(!hasMatchingVoice);
    }

    updateVoiceAvailability();
    speechSynthesis.addEventListener("voiceschanged", updateVoiceAvailability);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", updateVoiceAvailability);
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
      unavailable
    ) {
      setUnavailable(true);
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
  }, [sentences, speakNextSentence, unavailable]);

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

  return { status, unavailable, error, play, pause, resume, stop };
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?。！？])\s*/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}
