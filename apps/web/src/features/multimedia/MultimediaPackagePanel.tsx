import { Card, StatusPill } from "@living-textbook/ui";
import type { ContentPackage, MediaAsset, UnitMultimediaPlan } from "@living-textbook/content-model";

interface MultimediaPackagePanelProps {
  contentPackage: ContentPackage;
  permanentQrPath: string;
  frontDoorPath: string;
  validationErrors: string[];
}

export function MultimediaPackagePanel({
  contentPackage,
  permanentQrPath,
  frontDoorPath,
  validationErrors,
}: MultimediaPackagePanelProps) {
  const mediaAssets = contentPackage.mediaAssets ?? [];
  const playlists = contentPackage.playlists ?? [];
  const multimediaPlan = contentPackage.multimediaPlans?.[0];
  const audioCount = mediaAssets.filter((asset) => asset.kind === "audio").length;
  const videoCount = mediaAssets.filter((asset) => asset.kind === "video").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Living textbook package</p>
          <h2 className="mt-1 text-lg font-bold">Games + multimedia + QR entry</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            A single reviewed unit package can carry the learning payload, games, audio, video, playlist, optional game-background media, and permanent/front-door route concepts.
          </p>
        </div>
        <StatusPill label={validationErrors.length === 0 ? "Package valid" : "Needs review"} tone={validationErrors.length === 0 ? "success" : "warning"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <Metric label="Units" value={String(contentPackage.units.length)} />
        <Metric label="Audio" value={String(audioCount)} />
        <Metric label="Video" value={String(videoCount)} />
        <Metric label="Playlists" value={String(playlists.length)} />
      </dl>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <h3 className="text-sm font-bold">Hybrid QR concept</h3>
          <dl className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)]">
            <RouteRow label="Printed QR" value={permanentQrPath} />
            <RouteRow label="Front door" value={frontDoorPath} />
            <RouteRow label="Fallback" value="local app/content package" />
          </dl>
          <a
            href={frontDoorPath}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
          >
            Open front door
          </a>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <h3 className="text-sm font-bold">Optional game media</h3>
          {multimediaPlan ? <BackgroundPlanSummary plan={multimediaPlan} assets={mediaAssets} /> : null}
        </section>
      </div>

      <div className="mt-5 grid gap-3">
        {mediaAssets.map((asset) => (
          <MediaAssetRow key={asset.mediaAssetId} asset={asset} />
        ))}
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function RouteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="break-words">{value}</dd>
    </div>
  );
}

function BackgroundPlanSummary({ plan, assets }: { plan: UnitMultimediaPlan; assets: MediaAsset[] }) {
  const backgroundAsset = assets.find((asset) => asset.mediaAssetId === plan.backgroundMediaAssetId);
  const allowedModes = plan.allowedBackgroundGameModes?.join(", ") ?? "None";

  return (
    <dl className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)]">
      <RouteRow label="Background asset" value={backgroundAsset?.title ?? "Not configured"} />
      <RouteRow label="Allowed mode" value={allowedModes} />
      <RouteRow label="Default" value={plan.backgroundEnabledByDefault ? "On" : "Off"} />
      <RouteRow label="Teacher control" value={plan.requiresTeacherEnablement ? "Required" : "Optional"} />
      <RouteRow label="Volume" value={`${plan.defaultVolumePercent ?? 0}%`} />
    </dl>
  );
}

function MediaAssetRow({ asset }: { asset: MediaAsset }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">{asset.title}</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            {asset.kind} / {asset.type} / {asset.durationSeconds ?? 0}s
          </p>
        </div>
        <StatusPill label={asset.rightsStatus} />
      </div>
      <p className="mt-3 break-words text-xs text-[var(--tenant-muted)]">Local bundle: {asset.localBundlePath ?? "Not configured"}</p>
    </article>
  );
}
