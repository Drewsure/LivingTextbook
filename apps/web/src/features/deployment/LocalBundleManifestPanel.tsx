import { Card, StatusPill } from "@living-textbook/ui";
import type { LocalBundleManifestSummary, LocalBundleReadiness } from "@/data/sampleLocalBundlePlan";

interface LocalBundleManifestPanelProps {
  manifests: LocalBundleManifestSummary[];
}

const readinessTone: Record<LocalBundleReadiness, "neutral" | "success" | "warning"> = {
  planning: "neutral",
  "media-missing": "warning",
  "offline-ready": "success",
};

export function LocalBundleManifestPanel({ manifests }: LocalBundleManifestPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local bundle manifests</p>
          <h2 className="mt-1 text-lg font-bold">Closed textbook companion package shape</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Local bundles make audio, video, content packages, QR fallback routes, and optional premium features portable for closed classroom or packaged textbook deployments. These examples are planning manifests, not offline-ready builds.
          </p>
        </div>
        <StatusPill label={`${manifests.length} manifests`} tone="success" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {manifests.map((manifest) => (
          <article key={manifest.bundleId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{manifest.tenantName}</p>
                <h3 className="mt-1 text-base font-bold">{manifest.bundleId}</h3>
                <p className="mt-1 text-sm text-[var(--tenant-muted)]">v{manifest.version} / {manifest.contentPackagePath}</p>
              </div>
              <StatusPill label={manifest.readiness} tone={readinessTone[manifest.readiness]} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <BundleMetric label="Offline" value={manifest.offlineReady ? "Ready" : "No"} />
              <BundleMetric label="Redirect" value={manifest.requiresHostedRedirect ? "Needed" : "No"} />
              <BundleMetric label="AI Tutor" value={manifest.aiTutorEnabled ? "Enabled" : "Off"} />
            </dl>

            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{manifest.notes}</p>

            <div className="mt-4 grid gap-3">
              <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <h4 className="text-sm font-bold">Assets</h4>
                <div className="mt-2 grid gap-2">
                  {manifest.assets.map((asset) => (
                    <div key={asset.assetId} className="rounded-lg border border-[var(--tenant-border)] bg-white/70 p-3 text-sm">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="font-semibold">{asset.label}</p>
                        <StatusPill label={asset.checksumReady ? "Checksum ready" : "Checksum pending"} tone={asset.checksumReady ? "success" : "warning"} />
                      </div>
                      <p className="mt-1 text-[var(--tenant-muted)]">{asset.kind} / {asset.localPath} / rights: {asset.rightsStatus}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <h4 className="text-sm font-bold">QR fallback routes</h4>
                <div className="mt-2 grid gap-2">
                  {manifest.routes.map((route) => (
                    <div key={route.qrId} className="rounded-lg border border-[var(--tenant-border)] bg-white/70 p-3 text-sm">
                      <p className="font-semibold">{route.qrId}</p>
                      <p className="mt-1 text-[var(--tenant-muted)]">{route.targetType} / {route.targetId} / {route.localFallbackPath}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function BundleMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
