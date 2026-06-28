"use client";

import { useState } from "react";

interface AudioCueButtonProps {
  text: string;
  language?: string;
  label?: string;
  compact?: boolean;
}

export function AudioCueButton({ text, language = "en", label, compact = false }: AudioCueButtonProps) {
  const [status, setStatus] = useState<"ready" | "playing" | "unavailable">("ready");

  function handlePlay() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("unavailable");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.88;
    utterance.onend = () => setStatus("ready");
    utterance.onerror = () => setStatus("ready");

    setStatus("playing");
    window.speechSynthesis.speak(utterance);
  }

  const buttonLabel = label ?? `Listen to ${text}`;

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={buttonLabel}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
        compact ? "min-w-20" : "min-w-24"
      }`}
    >
      {status === "playing" ? "Playing" : status === "unavailable" ? "No audio" : "Listen"}
    </button>
  );
}
