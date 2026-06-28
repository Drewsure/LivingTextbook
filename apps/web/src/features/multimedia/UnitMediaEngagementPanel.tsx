"use client";

import { useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ContentPackage,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  MediaAsset,
  StudentProgressionState,
} from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import {
  createBackgroundMediaEvent,
  createMediaProgressEvent,
} from "@/features/progression/localProgressionAdapter";

interface UnitMediaEngagementPanelProps {
  contentPackage: ContentPackage;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  activeGameMode?: GameModeId;
  onEvent: (event: GameProgressEvent) => void;
}

export function UnitMediaEngagementPanel({
  contentPackage,
  launchSession,
  progression,
  activeGameMode,
  onEvent,
}: UnitMediaEngagementPanelProps) {
  const [startedMediaIds, setStartedMediaIds] = useState<string[]>([]);
  const [completedMediaIds, setCompletedMediaIds] = useState<string[]>([]);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const mediaAssets = contentPackage.mediaAssets ?? [];
  const playlist = contentPackage.playlists?.[0];
  const multimediaPlan = contentPackage.multimediaPlans?.[0];
  const playlistTitle = playlist?.title ?? "Unit media";
  const playlistAssets = playlist
    ? playlist.mediaAssetIds.map((assetId) => mediaAssets.find((asset) => asset.mediaAssetId === assetId)).filter(isMediaAsset)
    : mediaAssets;
  const backgroundAsset = mediaAssets.find((asset) => asset.mediaAssetId === multimediaPlan?.backgroundMediaAssetId);
  const backgroundAllowed = Boolean(
    backgroundAsset &&
      activeGameMode &&
      multimediaPlan?.allowedBackgroundGameModes?.includes(activeGameMode),
  );

  function recordMediaEvent(type: "media_started" | "media_completed", mediaAsset: MediaAsset) {
    const event = createMediaProgressEvent({
      type,
      progression,
      launchSession,
      mediaAsset,
      occurredAt: new Date().toISOString(),
    });

    if (type === "media_started") {
      setStartedMediaIds((ids) => Array.from(new Set([...ids, mediaAsset.mediaAssetId])));
    }

    if (type === "media_completed") {
      setCompletedMediaIds((ids) => Array.from(new Set([...ids, mediaAsset.mediaAssetId])));
    }

    onEvent(event);
  }

  function toggleBackgroundMedia() {
    if (!backgroundAsset || !activeGameMode || !multimediaPlan) {
      return;
    }

    const nextEnabled = !backgroundEnabled;
    const event = createBackgroundMediaEvent({
      type: nextEnabled ? "background_media_enabled" : "background_media_disabled",
      progression,
      launchSession,
      mediaAsset: backgroundAsset,
      gameMode: activeGameMode,
      volumePercent: multimediaPlan.defaultVolumePercent ?? 0,
      occurredAt: new Date().toISOString(),
    });

    setBackgroundEnabled(nextEnabled);
    onEvent(event);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Unit playlist</p>
          <h3 className="text-lg font-bold">
            <AudioCueText text={playlistTitle} className="font-bold" />
          </h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            These buttons record media engagement events. Real playback comes after this route contract is verified.
          </p>
        </div>
        <StatusPill label={`${playlistAssets.length} assets`} />
      </div>

      <div className="mt-4 grid gap-3">
        {playlistAssets.map((asset) => (
          <article key={asset.mediaAssetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold">
                  <AudioCueText text={asset.title} className="font-bold" />
                </h4>
                <p className="mt-1 text-sm text-[var(--tenant-muted)]">
                  {asset.kind} / {asset.type} / {asset.durationSeconds ?? 0}s
                </p>
              </div>
              <StatusPill
                label={completedMediaIds.includes(asset.mediaAssetId) ? "Completed" : startedMediaIds.includes(asset.mediaAssetId) ? "Started" : "Ready"}
                tone={completedMediaIds.includes(asset.mediaAssetId) ? "success" : "neutral"}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <AudioSupportedAction
                type="button"
                variant="secondary"
                audioText="Start media"
                onClick={() => recordMediaEvent("media_started", asset)}
                disabled={startedMediaIds.includes(asset.mediaAssetId)}
              >
                Start media
              </AudioSupportedAction>
              <AudioSupportedAction
                type="button"
                audioText="Mark complete"
                onClick={() => recordMediaEvent("media_completed", asset)}
                disabled={!startedMediaIds.includes(asset.mediaAssetId) || completedMediaIds.includes(asset.mediaAssetId)}
              >
                Mark complete
              </AudioSupportedAction>
            </div>
          </article>
        ))}
      </div>

      {backgroundAsset && multimediaPlan && (
        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm font-semibold">Optional background media</p>
              <p className="mt-1 text-sm text-[var(--tenant-muted)]">
                <AudioCueText text={backgroundAsset.title} /> can support {multimediaPlan.allowedBackgroundGameModes?.join(", ") ?? "selected games"} at {multimediaPlan.defaultVolumePercent ?? 0}% volume.
              </p>
              <p className="mt-1 text-xs text-[var(--tenant-muted)]">
                {backgroundAllowed ? "Available for the active game mode." : "Start the matching game before enabling this support media."}
              </p>
            </div>
            <AudioSupportedAction
              type="button"
              audioText={backgroundEnabled ? "Disable media" : "Enable media"}
              onClick={toggleBackgroundMedia}
              disabled={!backgroundAllowed}
              variant={backgroundEnabled ? "secondary" : "primary"}
            >
              {backgroundEnabled ? "Disable media" : "Enable media"}
            </AudioSupportedAction>
          </div>
        </section>
      )}
    </Card>
  );
}

function isMediaAsset(asset: MediaAsset | undefined): asset is MediaAsset {
  return Boolean(asset);
}