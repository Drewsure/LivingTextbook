"use client";

import { useEffect, useState } from "react";

interface SpeechOptions {
  text: string;
  language?: string;
  onStatusChange?: (status: AudioPlaybackStatus) => void;
}

type AudioPlaybackStatus = "ready" | "playing" | "unavailable";

interface AudioCueButtonProps {
  text: string;
  language?: string;
  label?: string;
  compact?: boolean;
  onPlay?: () => void;
}

interface AudioCueTextProps {
  text: string;
  language?: string;
  label?: string;
  className?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export function playAudioCueText({ text, language = "en", onStatusChange }: SpeechOptions) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onStatusChange?.("unavailable");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.88;
  utterance.onend = () => onStatusChange?.("ready");
  utterance.onerror = () => onStatusChange?.("ready");

  onStatusChange?.("playing");
  window.speechSynthesis.speak(utterance);
}

export function AudioCueText({ text, language = "en", label, className = "", autoPlay = false, onPlay }: AudioCueTextProps) {
  const [status, setStatus] = useState<AudioPlaybackStatus>("ready");
  const buttonLabel = label ?? `Listen to ${text}`;

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    playAudioCueText({ text, language, onStatusChange: setStatus });
  }, [autoPlay, language, text]);

  function handlePlay() {
    onPlay?.();
    playAudioCueText({ text, language, onStatusChange: setStatus });
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={buttonLabel}
      data-audio-status={status}
      className={`rounded-lg px-2 py-1 text-[var(--tenant-text)] underline decoration-[var(--tenant-primary)] decoration-2 underline-offset-4 transition hover:bg-[var(--tenant-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${className}`}
    >
      {text}
      <span className="sr-only"> {status === "playing" ? "Playing audio" : status === "unavailable" ? "Audio unavailable" : "Tap to hear audio"}</span>
    </button>
  );
}

export function AudioCueButton({ text, language = "en", label, compact = false, onPlay }: AudioCueButtonProps) {
  const [status, setStatus] = useState<AudioPlaybackStatus>("ready");
  const buttonLabel = label ?? `Listen to ${text}`;

  function handlePlay() {
    onPlay?.();
    playAudioCueText({ text, language, onStatusChange: setStatus });
  }

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
