import { Card, StatusPill } from "@living-textbook/ui";
import type { ContentPackage, MediaAsset, UnitMediaPlaylist, UnitMultimediaPlan } from "@living-textbook/content-model";

interface MediaPlaylistRoutePanelProps {
  playlist: UnitMediaPlaylist;
  contentPackage: ContentPackage;
  returnPath?: string;
}

export function MediaPlaylistRoutePanel({ playlist, contentPackage, returnPath }: MediaPlaylistRoutePanelProps) {
  const assets = playlist.mediaAssetIds
    .map((mediaAssetId) => contentPackage.mediaAssets?.find((asset) => asset.mediaAssetId === mediaAssetId))
    .filter((asset): asset is MediaAsset => Boolean(asset));
  const multimediaPlan = contentPackage.multimediaPlans?.find((plan) => plan.primaryPlaylistId === playlist.playlistId);
  const unit = contentPackage.units.find((packageUnit) => packageUnit.unitMeta.contentPackageId === contentPackage.meta.packageId);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media playlist route</p>
          <h2 className="mt-1 text-2xl font-bold">{playlist.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This scaffold proves that music and video live inside the content package, alongside games and teacher reports. It is a reviewed package route, not a loose file browser.
          </p>
        </div>
        <StatusPill label={`${assets.length} assets`} tone={assets.length > 0 ? "success" : "warning"} />
      </div>

      {returnPath && (
        <a
          href={returnPath}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Return to unit
        </a>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <PlaylistFact label="Tenant" value={playlist.tenantId} />
        <PlaylistFact label="Unit" value={unit?.unitMeta.theme ?? playlist.unitKey} />
        <PlaylistFact label="Role" value={playlist.usageRole ?? "Not configured"} />
        <PlaylistFact label="Context" value={playlist.playbackContext ?? "Not configured"} />
      </div>

      {multimediaPlan && <BackgroundMediaPolicy plan={multimediaPlan} assets={contentPackage.mediaAssets ?? []} />}

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--tenant-text)]">Package boundaries</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This route can preview reviewed media metadata, but production playback still depends on media rights, local bundle availability, and tenant deployment policy.
            </p>
          </div>
          <StatusPill label="Policy gated" tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          <li>Media files stay in tenant media storage or local bundles, not inside learner progress records.</li>
          <li>Game background media remains teacher-controlled and off by default.</li>
          <li>Raw learner recordings and transcripts are not stored by this playlist route.</li>
        </ul>
      </section>

      <div className="mt-5 grid gap-3">
        {assets.map((asset) => (
          <MediaPlaylistAssetCard key={asset.mediaAssetId} asset={asset} />
        ))}
      </div>
    </Card>
  );
}

function PlaylistFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function BackgroundMediaPolicy({ plan, assets }: { plan: UnitMultimediaPlan; assets: MediaAsset[] }) {
  const backgroundAsset = assets.find((asset) => asset.mediaAssetId === plan.backgroundMediaAssetId);

  return (
    <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Optional game background media</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{backgroundAsset?.title ?? "Not configured"}</h3>
        </div>
        <StatusPill label={plan.requiresTeacherEnablement ? "Teacher controlled" : "Tenant controlled"} tone="warning" />
      </div>
      <div className="mt-3 grid gap-3 text-sm text-[var(--tenant-muted)] sm:grid-cols-3">
        <PlaylistFact label="Allowed modes" value={plan.allowedBackgroundGameModes?.join(", ") ?? "None"} />
        <PlaylistFact label="Default" value={plan.backgroundEnabledByDefault ? "On" : "Off"} />
        <PlaylistFact label="Volume" value={`${plan.defaultVolumePercent ?? 0}%`} />
      </div>
    </section>
  );
}

function MediaPlaylistAssetCard({ asset }: { asset: MediaAsset }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{asset.kind} / {asset.type}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{asset.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {asset.durationSeconds ? `${asset.durationSeconds} seconds` : "Duration not configured"} / {asset.language ?? "language not configured"}
          </p>
        </div>
        <StatusPill label={asset.rightsStatus} tone={asset.rightsStatus === "unknown" ? "warning" : "success"} />
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-[var(--tenant-muted)] md:grid-cols-2">
        <PlaylistFact label="Source path" value={asset.sourceUri ?? "Not configured"} />
        <PlaylistFact label="Local bundle" value={asset.localBundlePath ?? "Not configured"} />
        {asset.posterImageUri && <PlaylistFact label="Poster" value={asset.posterImageUri} />}
        {asset.transcriptUri && <PlaylistFact label="Transcript" value={asset.transcriptUri} />}
      </dl>
    </article>
  );
}
