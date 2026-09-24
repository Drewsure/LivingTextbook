import { createReadOnlyLocalBundleResolver, type LocalBundleManifest } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";
import { Children } from "react";
import type { LocalBundleManifestSummary } from "@/data/sampleLocalBundlePlan";

interface LocalBundleResolutionPanelProps {
  manifest: LocalBundleManifestSummary;
  tenantId: string;
}

export function LocalBundleResolutionPanel({ manifest, tenantId }: LocalBundleResolutionPanelProps) {
  const runtimeManifest = createPreviewRuntimeManifest(manifest, tenantId);
  const result = createReadOnlyLocalBundleResolver(runtimeManifest);
  const routeResolutions = manifest.routes.map((route) => ({
    route,
    resolution: result.resolver?.resolveRoute(tenantId, route.qrId),
  }));
  const assetResolutions = manifest.assets.map((asset) => ({
    asset,
    resolution: result.resolver?.resolveAsset(tenantId, asset.assetId),
  }));
  const resolvedRoutes = routeResolutions.filter((item) => item.resolution).length;
  const resolvedAssets = assetResolutions.filter((item) => item.resolution).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Read-only local bundle resolution rehearsal</p>
          <h3 className="mt-1 text-lg font-bold">Manifest-declared routes and assets resolve safely</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview exercises the shared resolver against the reviewed manifest shape. It proves tenant scope and route/asset mapping without opening files, writing a bundle, activating offline mode, or collecting learner data.
          </p>
        </div>
        <StatusPill label={result.valid ? "Valid" : "Blocked"} tone={result.valid ? "success" : "warning"} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResolutionFact label="Resolver mode" value={result.mode} />
        <ResolutionFact label="Delivery status" value={result.resolver?.deliveryStatus ?? "blocked"} />
        <ResolutionFact label="Tenant scope" value={tenantId} />
        <ResolutionFact label="Curriculum / series" value={`${manifest.curriculumId} / ${manifest.seriesId}`} />
        <ResolutionFact label="Book / units" value={`${manifest.bookId} / ${manifest.unitIds.join(", ")}`} />
        <ResolutionFact label="Bundle identity" value={manifest.bundleId} />
        <ResolutionFact label="Routes resolved" value={`${resolvedRoutes}/${routeResolutions.length}`} />
        <ResolutionFact label="Assets resolved" value={`${resolvedAssets}/${assetResolutions.length}`} />
      </dl>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ResolutionList title="Manifest-declared QR fallbacks" emptyLabel="No routes declared.">
          {routeResolutions.map(({ route, resolution }) => (
            <li key={route.qrId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[var(--tenant-text)]">{route.qrId}</p>
                  <p className="mt-1 text-xs text-[var(--tenant-muted)]">{route.targetType} / {route.targetId}</p>
                </div>
                <StatusPill label={resolution ? formatResolutionLabel(resolution.deliveryStatus) : "Blocked"} tone={resolution ? "success" : "warning"} />
              </div>
              <p className="mt-2 break-all font-mono text-xs font-semibold text-[var(--tenant-text)]">
                {resolution?.localFallbackPath ?? route.localFallbackPath}
              </p>
            </li>
          ))}
        </ResolutionList>

        <ResolutionList title="Manifest-declared local assets" emptyLabel="No assets declared.">
          {assetResolutions.map(({ asset, resolution }) => (
            <li key={asset.assetId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[var(--tenant-text)]">{asset.label}</p>
                  <p className="mt-1 text-xs uppercase text-[var(--tenant-muted)]">{asset.kind} / {asset.rightsStatus}</p>
                </div>
                <StatusPill label={resolution ? formatResolutionLabel(resolution.deliveryStatus) : "Blocked"} tone={resolution ? "success" : "warning"} />
              </div>
              <p className="mt-2 break-all font-mono text-xs font-semibold text-[var(--tenant-text)]">
                {resolution?.localPath ?? asset.localPath}
              </p>
            </li>
          ))}
        </ResolutionList>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <BoundaryFact label="No file access" />
        <BoundaryFact label="No bundle write" />
        <BoundaryFact label="No offline activation" />
        <BoundaryFact label="No learner-data persistence" />
      </div>

      {(result.errors.length > 0 || result.warnings.length > 0) && (
        <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-sm font-bold text-[var(--tenant-text)]">Resolver evidence requiring follow-up</p>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {[...result.errors, ...result.warnings].map((message, index) => (
              <li key={`${message}-${index}`}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function ResolutionList({ title, emptyLabel, children }: { title: string; emptyLabel: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
      <ul className="mt-3 grid gap-3">{Children.count(children) > 0 ? children : <li className="text-sm text-[var(--tenant-muted)]">{emptyLabel}</li>}</ul>
    </section>
  );
}

function ResolutionFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function BoundaryFact({ label }: { label: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3 text-sm font-semibold text-[var(--tenant-text)]">{label}</div>;
}

function formatResolutionLabel(status: "planning" | "offline-ready") {
  return status === "offline-ready" ? "Resolved / offline-ready" : "Resolved / rehearsal";
}

function createPreviewRuntimeManifest(summary: LocalBundleManifestSummary, tenantId: string): LocalBundleManifest {
  return {
    bundle_id: summary.bundleId,
    tenant_id: tenantId,
    curriculum_id: summary.curriculumId,
    series_id: summary.seriesId,
    book_id: summary.bookId,
    unit_ids: summary.unitIds,
    version: summary.version,
    created_at: "2026-09-18T00:00:00.000Z",
    content_package_path: summary.contentPackagePath,
    media_root: summary.mediaRoot,
    offline_ready: summary.offlineReady,
    requires_hosted_redirect: summary.requiresHostedRedirect,
    assets: summary.assets.map((asset) => ({
      asset_id: asset.assetId,
      kind: asset.kind,
      local_path: asset.localPath,
      checksum: asset.checksumReady ? `sha256-${"a".repeat(64)}` : "sha256-placeholder-not-ready",
      rights_status: asset.rightsStatus,
      poster_path: asset.posterPath,
      transcript_path: asset.transcriptPath,
      scan_status: asset.scanStatus,
      target_mapping_reviewed: asset.targetMappingReviewed,
      alt_text_ready: asset.altTextReady,
    })),
    routes: summary.routes.map((route) => ({
      qr_id: route.qrId,
      target_type: route.targetType,
      target_id: route.targetId,
      local_fallback_path: route.localFallbackPath,
    })),
  };
}
