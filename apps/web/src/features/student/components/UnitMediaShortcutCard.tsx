import { Card, StatusPill } from "@living-textbook/ui";
import { getUnitKey } from "@living-textbook/content-model";
import type { ContentPackage, UnitPayload } from "@living-textbook/content-model";
import { getMediaPlaylistPath } from "@/features/routes/routeContracts";

interface UnitMediaShortcutCardProps {
  contentPackage: ContentPackage;
  unit: UnitPayload;
}

export function UnitMediaShortcutCard({ contentPackage, unit }: UnitMediaShortcutCardProps) {
  const unitKey = getUnitKey(unit.unitMeta);
  const playlist = contentPackage.playlists?.find((candidate) => candidate.unitKey === unitKey);
  const multimediaPlan = playlist
    ? contentPackage.multimediaPlans?.find((plan) => plan.primaryPlaylistId === playlist.playlistId)
    : undefined;
  const assetCount = playlist?.mediaAssetIds.length ?? 0;

  if (!playlist) {
    return null;
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Unit media</p>
          <h2 className="mt-1 text-lg font-bold">{playlist.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            Open the reviewed audio/video playlist for this unit. Media supports learning, but it does not unlock games or replace target-language practice.
          </p>
        </div>
        <StatusPill label={`${assetCount} assets`} tone="success" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          <p>
            Background media is {multimediaPlan?.backgroundEnabledByDefault ? "on by default" : "off by default"} and{" "}
            {multimediaPlan?.requiresTeacherEnablement ? "teacher-controlled" : "tenant-controlled"}.
          </p>
          <p className="mt-1">Playlist engagement is separate from Star Dust and mastery unlocks.</p>
        </div>
        <a
          href={getMediaPlaylistPath(playlist.playlistId)}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open unit media
        </a>
      </div>
    </Card>
  );
}
