"use client";

import { useState } from "react";
import { StatusPill } from "@living-textbook/ui";
import type { MediaAsset } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";

interface UnitMediaPlaybackCardProps {
  asset: MediaAsset;
  started: boolean;
  completed: boolean;
  onStart: () => void;
  onComplete: () => void;
}

export function UnitMediaPlaybackCard({
  asset,
  started,
  completed,
  onStart,
  onComplete,
}: UnitMediaPlaybackCardProps) {
  const [playbackError, setPlaybackError] = useState(false);
  const sourceUri = asset.sourceUri ?? asset.localBundlePath;
  const statusLabel = completed ? "Completed" : started ? "Started" : "Ready";

  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold">
            <AudioCueText text={asset.title} className="font-bold" />
          </h4>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            {asset.kind} / {asset.type} / {asset.durationSeconds ?? 0}s
          </p>
        </div>
        <StatusPill label={statusLabel} tone={completed ? "success" : "neutral"} />
      </div>

      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        {sourceUri ? (
          asset.kind === "audio" ? (
            <audio
              className="w-full"
              controls
              preload="metadata"
              src={sourceUri}
              onPlay={onStart}
              onEnded={onComplete}
              onError={() => setPlaybackError(true)}
            />
          ) : (
            <video
              className="aspect-video w-full rounded-lg bg-black"
              controls
              preload="metadata"
              src={sourceUri}
              poster={asset.posterImageUri}
              onPlay={onStart}
              onEnded={onComplete}
              onError={() => setPlaybackError(true)}
            >
              {asset.transcriptUri && <track kind="captions" src={asset.transcriptUri} srcLang={asset.language ?? "en"} label="Captions" />}
            </video>
          )
        ) : (
          <p className="text-sm text-[var(--tenant-muted)]">No media source is attached to this sample asset yet.</p>
        )}
        {playbackError && (
          <p className="mt-2 text-sm font-semibold text-amber-800">
            Playback source is not available in this local sample yet. The progress controls still demonstrate the reporting contract.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <AudioSupportedAction
          type="button"
          variant="secondary"
          audioText="Start media"
          onClick={onStart}
          disabled={started}
        >
          Start media
        </AudioSupportedAction>
        <AudioSupportedAction
          type="button"
          audioText="Mark complete"
          onClick={onComplete}
          disabled={!started || completed}
        >
          Mark complete
        </AudioSupportedAction>
      </div>
    </article>
  );
}
