"use client";

import { useEffect, useState } from "react";
import type { AudioCue } from "@living-textbook/content-model";

interface SpeechOptions {
  text: string;
  language: string;
  sourceUri?: string;
  onStatusChange?: (status: AudioPlaybackStatus) => void;
}

type AudioPlaybackStatus = "ready" | "playing" | "unavailable";

interface AudioCueButtonProps {
  text: string;
  language: string;
  cue?: Pick<AudioCue, "sourceUri">;
  label?: string;
  compact?: boolean;
  onPlay?: () => void;
}

interface AudioCueTextProps {
  text: string;
  language: string;
  cue?: Pick<AudioCue, "sourceUri">;
  label?: string;
  className?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
}

let activeAudio: HTMLAudioElement | undefined;

export function playAudioCueText({ text, language, sourceUri, onStatusChange }: SpeechOptions) {
  if (typeof window === "undefined") {
    onStatusChange?.("unavailable");
    return;
  }

  window.speechSynthesis?.cancel();
  activeAudio?.pause();
  activeAudio = undefined;

  if (sourceUri) {
    const audio = new Audio(sourceUri);
    activeAudio = audio;
    audio.onended = () => {
      activeAudio = undefined;
      onStatusChange?.("ready");
    };
    audio.onerror = () => {
      activeAudio = undefined;
      speakText({ text, language, onStatusChange });
    };
    onStatusChange?.("playing");
    audio.play().catch(() => {
      activeAudio = undefined;
      speakText({ text, language, onStatusChange });
    });
    return;
  }

  speakText({ text, language, onStatusChange });
}

function speakText({ text, language, onStatusChange }: SpeechOptions) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onStatusChange?.("unavailable");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.88;
  utterance.onend = () => onStatusChange?.("ready");
  utterance.onerror = () => onStatusChange?.("ready");

  onStatusChange?.("playing");
  window.speechSynthesis.speak(utterance);
}

export function AudioCueText({ text, language, cue, label, className = "", autoPlay = false, onPlay }: AudioCueTextProps) {
  const [status, setStatus] = useState<AudioPlaybackStatus>("ready");
  const buttonLabel = label ?? `Listen to ${text}`;

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    playAudioCueText({ text, language, sourceUri: cue?.sourceUri, onStatusChange: setStatus });
  }, [autoPlay, cue?.sourceUri, language, text]);

  function handlePlay() {
    onPlay?.();
    playAudioCueText({ text, language, sourceUri: cue?.sourceUri, onStatusChange: setStatus });
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={buttonLabel}
      data-audio-status={status}
      data-audio-source={cue?.sourceUri ? "reviewed-asset" : "speech-fallback"}
      className={`rounded-lg px-2 py-1 text-[var(--tenant-text)] underline decoration-[var(--tenant-primary)] decoration-2 underline-offset-4 transition hover:bg-[var(--tenant-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${className}`}
    >
      {text}
      <span className="sr-only"> {status === "playing" ? "Playing audio" : status === "unavailable" ? "Audio unavailable" : "Tap to hear audio"}</span>
    </button>
  );
}

export function AudioCueButton({ text, language, cue, label, compact = false, onPlay }: AudioCueButtonProps) {
  const [status, setStatus] = useState<AudioPlaybackStatus>("ready");
  const buttonLabel = label ?? `Listen to ${text}`;

  function handlePlay() {
    onPlay?.();
    playAudioCueText({ text, language, sourceUri: cue?.sourceUri, onStatusChange: setStatus });
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={buttonLabel}
      data-audio-source={cue?.sourceUri ? "reviewed-asset" : "speech-fallback"}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
        compact ? "min-w-20" : "min-w-24"
      }`}
    >
      {status === "playing" ? "Playing" : status === "unavailable" ? "No audio" : "Listen"}
    </button>
  );
}
