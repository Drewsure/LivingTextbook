"use client";

import { useState } from "react";
import { StatusPill } from "@living-textbook/ui";
import type {
  GameProgressEvent,
  LaunchSession,
  MediaAsset,
  StudentProgressionState,
  UnitMediaPlaylist,
} from "@living-textbook/content-model";
import { createMediaProgressEvent } from "@/features/progression/localProgressionAdapter";
import { UnitMediaPlaybackCard } from "./UnitMediaPlaybackCard";

interface MediaPlaylistEventPreviewProps {
  playlist: UnitMediaPlaylist;
  assets: MediaAsset[];
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function MediaPlaylistEventPreview({
  playlist,
  assets,
  launchSession,
  progression,
}: MediaPlaylistEventPreviewProps) {
  const [events, setEvents] = useState<GameProgressEvent[]>([]);
  const [startedMediaIds, setStartedMediaIds] = useState<string[]>([]);
  const [pausedMediaIds, setPausedMediaIds] = useState<string[]>([]);
  const [completedMediaIds, setCompletedMediaIds] = useState<string[]>([]);

  function recordMediaEvent(type: "media_started" | "media_paused" | "media_completed", mediaAsset: MediaAsset) {
    const mediaIsStarted = startedMediaIds.includes(mediaAsset.mediaAssetId);
    const mediaIsCompleted = completedMediaIds.includes(mediaAsset.mediaAssetId);

    if (type === "media_started" && mediaIsStarted) {
      setPausedMediaIds((ids) => ids.filter((id) => id !== mediaAsset.mediaAssetId));
      return;
    }

    if (type === "media_paused" && (!mediaIsStarted || mediaIsCompleted)) {
      return;
    }

    if (type === "media_completed" && mediaIsCompleted) {
      return;
    }

    const event = createMediaProgressEvent({
      type,
      progression,
      launchSession,
      mediaAsset,
      occurredAt: new Date().toISOString(),
    });

    if (type === "media_started") {
      setStartedMediaIds((ids) => Array.from(new Set([...ids, mediaAsset.mediaAssetId])));
      setPausedMediaIds((ids) => ids.filter((id) => id !== mediaAsset.mediaAssetId));
    }

    if (type === "media_paused") {
      setPausedMediaIds((ids) => Array.from(new Set([...ids, mediaAsset.mediaAssetId])));
    }

    if (type === "media_completed") {
      setCompletedMediaIds((ids) => Array.from(new Set([...ids, mediaAsset.mediaAssetId])));
      setPausedMediaIds((ids) => ids.filter((id) => id !== mediaAsset.mediaAssetId));
    }

    setEvents((currentEvents) => [...currentEvents, event]);
  }

  return (
    <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Demo media controls</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{playlist.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            These controls demonstrate local media telemetry only. They do not write production reports, unlock games, or award mastery.
          </p>
        </div>
        <StatusPill label={`${events.length} local events`} tone={events.length > 0 ? "success" : "neutral"} />
      </div>

      <div className="mt-4 grid gap-3">
        {assets.map((asset) => (
          <UnitMediaPlaybackCard
            key={asset.mediaAssetId}
            asset={asset}
            started={startedMediaIds.includes(asset.mediaAssetId)}
            paused={pausedMediaIds.includes(asset.mediaAssetId)}
            completed={completedMediaIds.includes(asset.mediaAssetId)}
            onStart={() => recordMediaEvent("media_started", asset)}
            onPause={() => recordMediaEvent("media_paused", asset)}
            onComplete={() => recordMediaEvent("media_completed", asset)}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[var(--tenant-muted)]">
        {events.length === 0 ? (
          <p className="rounded-lg border border-[var(--tenant-border)] p-3">Use the media controls to preview reportable support-only events.</p>
        ) : (
          events.map((event, index) => (
            <p key={`${event.type}-${event.occurredAt}-${index}`} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <span className="font-semibold text-[var(--tenant-text)]">{event.type}</span> / {event.metadata?.mediaAssetId}
              <span className="mt-1 block text-xs leading-5">
                Support-only event stream: unlock {String(event.metadata?.progressionUnlockAllowed)}, mastery {String(event.metadata?.masteryCreditAllowed)}, Star Dust {String(event.metadata?.starDustAwarded ?? 0)}
              </span>
            </p>
          ))
        )}
      </div>
    </section>
  );
}
