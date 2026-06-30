"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@living-textbook/ui";

export type MicrophonePracticeEvent =
  | "recording_started"
  | "recording_stopped"
  | "recording_replayed"
  | "recording_cleared"
  | "recording_unavailable"
  | "recording_error";

type RecorderStatus = "idle" | "requesting" | "recording" | "ready" | "playing" | "unavailable" | "error";

interface MicrophonePracticeControlProps {
  promptLabel: string;
  disabled?: boolean;
  onRecordingEvent?: (
    eventType: MicrophonePracticeEvent,
    metadata?: Record<string, string | number | boolean>,
  ) => void;
}

export function MicrophonePracticeControl({
  promptLabel,
  disabled = false,
  onRecordingEvent,
}: MicrophonePracticeControlProps) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [message, setMessage] = useState("Optional: record yourself, then replay before confirming.");
  const [audioUrl, setAudioUrl] = useState<string>();
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string>();
  const chunksRef = useRef<Blob[]>([]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopActiveStream();
      recorderRef.current = null;
      revokeAudioUrl();
    };
  }, []);

  function stopActiveStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function revokeAudioUrl() {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = undefined;
    }
  }

  function replaceAudioUrl(nextAudioUrl: string) {
    revokeAudioUrl();
    audioUrlRef.current = nextAudioUrl;
    setAudioUrl(nextAudioUrl);
  }

  async function handleRecord() {
    if (disabled || status === "requesting" || status === "recording") {
      return;
    }

    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setStatus("unavailable");
      setMessage("Microphone practice is not available in this browser.");
      onRecordingEvent?.("recording_unavailable", {
        promptLabel,
        microphoneUsed: false,
        uploadUsed: false,
        aiTutorRequired: false,
      });
      return;
    }

    try {
      setStatus("requesting");
      setMessage("Waiting for microphone permission.");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopActiveStream();

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        chunksRef.current = [];

        if (blob.size === 0) {
          setStatus("idle");
          setMessage("No audio was captured. Try recording again.");
          onRecordingEvent?.("recording_error", {
            promptLabel,
            microphoneUsed: true,
            uploadUsed: false,
            audioStored: false,
            errorReason: "empty-recording",
          });
          return;
        }

        replaceAudioUrl(URL.createObjectURL(blob));
        setStatus("ready");
        setMessage("Recording ready. Replay it, then tap I said it.");
        onRecordingEvent?.("recording_stopped", {
          promptLabel,
          microphoneUsed: true,
          uploadUsed: false,
          audioStored: false,
          transcriptGenerated: false,
          aiTutorRequired: false,
          recordingSizeBytes: blob.size,
        });
      };

      recorder.onerror = () => {
        stopActiveStream();
        setStatus("error");
        setMessage("Recording stopped unexpectedly. You can still speak and tap I said it.");
        onRecordingEvent?.("recording_error", {
          promptLabel,
          microphoneUsed: true,
          uploadUsed: false,
          audioStored: false,
          errorReason: "media-recorder-error",
        });
      };

      recorder.start();
      setStatus("recording");
      setMessage("Recording. Say the English prompt now.");
      onRecordingEvent?.("recording_started", {
        promptLabel,
        microphoneUsed: true,
        uploadUsed: false,
        audioStored: false,
        transcriptGenerated: false,
        aiTutorRequired: false,
      });
    } catch (error) {
      stopActiveStream();
      recorderRef.current = null;
      const errorName = error instanceof DOMException ? error.name : "unknown-error";
      setStatus(errorName === "NotAllowedError" ? "unavailable" : "error");
      setMessage("Microphone was not started. You can still speak and tap I said it.");
      onRecordingEvent?.("recording_error", {
        promptLabel,
        microphoneUsed: false,
        uploadUsed: false,
        audioStored: false,
        errorReason: errorName,
      });
    }
  }

  function handleStop() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      setMessage("Preparing your recording.");
    }
  }

  async function handleReplay() {
    if (!audioElementRef.current || !audioUrl || disabled) {
      return;
    }

    try {
      audioElementRef.current.currentTime = 0;
      setStatus("playing");
      await audioElementRef.current.play();
      onRecordingEvent?.("recording_replayed", {
        promptLabel,
        microphoneUsed: true,
        uploadUsed: false,
        audioStored: false,
        aiTutorRequired: false,
      });
    } catch {
      setStatus("error");
      setMessage("Replay was blocked by the browser. The recording can be cleared and tried again.");
      onRecordingEvent?.("recording_error", {
        promptLabel,
        microphoneUsed: true,
        uploadUsed: false,
        audioStored: false,
        errorReason: "replay-blocked",
      });
    }
  }

  function handleClear() {
    audioElementRef.current?.pause();
    revokeAudioUrl();
    setAudioUrl(undefined);
    chunksRef.current = [];
    setStatus("idle");
    setMessage("Optional: record yourself, then replay before confirming.");
    onRecordingEvent?.("recording_cleared", {
      promptLabel,
      microphoneUsed: true,
      uploadUsed: false,
      audioStored: false,
      aiTutorRequired: false,
    });
  }

  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleRecord}
          disabled={disabled || status === "requesting" || status === "recording"}
        >
          {status === "requesting" ? "Opening mic" : status === "recording" ? "Recording" : "Record"}
        </Button>
        <Button type="button" variant="secondary" onClick={handleStop} disabled={disabled || status !== "recording"}>
          Stop
        </Button>
        <Button type="button" variant="secondary" onClick={handleReplay} disabled={disabled || !audioUrl || status === "recording"}>
          Replay
        </Button>
        <Button type="button" variant="quiet" onClick={handleClear} disabled={disabled || !audioUrl || status === "recording"}>
          Clear
        </Button>
      </div>
      <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]" aria-live="polite">
        {message}
      </p>
      {audioUrl && (
        <audio
          ref={audioElementRef}
          src={audioUrl}
          onEnded={() => {
            setStatus("ready");
            setMessage("Recording ready. Replay it, then tap I said it.");
          }}
        />
      )}
    </div>
  );
}
