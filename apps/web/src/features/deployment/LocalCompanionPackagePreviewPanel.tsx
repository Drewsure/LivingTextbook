import { Card, StatusPill } from "@living-textbook/ui";
import type { LocalBundleManifestSummary, LocalBundleReadiness } from "@/data/sampleLocalBundlePlan";
import type {
  LocalDeploymentPreflightPlan,
  LocalDeploymentPreflightStatus,
} from "@/data/sampleLocalDeploymentPreflight";
import { countLocalDeploymentChecks } from "@/data/sampleLocalDeploymentPreflight";

interface LocalCompanionPackagePreviewPanelProps {
  manifest: LocalBundleManifestSummary;
  preflight: LocalDeploymentPreflightPlan;
}

const readinessTone: Record<LocalBundleReadiness, "neutral" | "success" | "warning"> = {
  planning: "neutral",
  "media-missing": "warning",
  "offline-ready": "success",
};

const preflightTone: Record<LocalDeploymentPreflightStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  pass: "success",
  warning: "warning",
};

export function LocalCompanionPackagePreviewPanel({ manifest, preflight }: LocalCompanionPackagePreviewPanelProps) {
  const blockedCount = countLocalDeploymentChecks(preflight, "blocked");
  const warningCount = countLocalDeploymentChecks(preflight, "warning");

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local companion package preview</p>
            <h2 className="mt-1 text-2xl font-bold">Closed local companion</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This preview shows how a publisher-owned textbook unit can travel as a closed companion package with content, games, audio, video, local QR fallback, and reporting/export preflight rules. It is a planning package, not an offline-ready installer.
            </p>
          </div>
          <StatusPill label={manifest.readiness} tone={readinessTone[manifest.readiness]} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          <a className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-[var(--tenant-text)]" href="/teacher/intake">
            Back to intake review
          </a>
          <a className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-4 py-2 text-[var(--tenant-text)]" href="/enter/sample-publisher">
            Open publisher front door
          </a>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">{manifest.tenantName}</p>
            <h3 className="mt-1 text-lg font-bold">{manifest.bundleId}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{manifest.notes}</p>
          </div>
          <StatusPill label={`v${manifest.version}`} tone="neutral" />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <BundleFact label="Content package" value={manifest.contentPackagePath} />
          <BundleFact label="Media root" value={manifest.mediaRoot} />
          <BundleFact label="Offline ready" value={manifest.offlineReady ? "Yes" : "No"} />
          <BundleFact label="Hosted redirect" value={manifest.requiresHostedRedirect ? "Required" : "Not required"} />
        </dl>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Bundled media</p>
              <h3 className="mt-1 text-lg font-bold">Audio and video assets</h3>
            </div>
            <StatusPill label={`${manifest.assets.length} assets`} tone="warning" />
          </div>
          <div className="mt-4 grid gap-3">
            {manifest.assets.map((asset) => (
              <section key={asset.assetId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{asset.kind} / rights: {asset.rightsStatus}</p>
                    <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{asset.label}</h4>
                  </div>
                  <StatusPill label={asset.checksumReady ? "Checksum ready" : "Checksum pending"} tone={asset.checksumReady ? "success" : "warning"} />
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-[var(--tenant-muted)]">{asset.localPath}</p>
              </section>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local QR fallback</p>
              <h3 className="mt-1 text-lg font-bold">Stable route targets</h3>
            </div>
            <StatusPill label={`${manifest.routes.length} routes`} tone="neutral" />
          </div>
          <div className="mt-4 grid gap-3">
            {manifest.routes.map((route) => (
              <section key={route.qrId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <p className="text-sm font-bold text-[var(--tenant-text)]">{route.qrId}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{route.targetType} / {route.targetId}</p>
                <p className="mt-2 break-all font-mono text-xs font-semibold text-[var(--tenant-text)]">{route.localFallbackPath}</p>
              </section>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local deployment preflight</p>
            <h3 className="mt-1 text-lg font-bold">{preflight.label}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preflight.recommendation}</p>
          </div>
          <StatusPill label={`${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "success"} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <BundleFact label="Warnings" value={String(warningCount)} />
          <BundleFact label="Blocked" value={String(blockedCount)} />
          <BundleFact label="AI Tutor" value={manifest.aiTutorEnabled ? "Enabled" : "Off"} />
        </dl>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {preflight.checks.map((check) => (
            <section key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.owner}</p>
                  <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{check.label}</h4>
                </div>
                <StatusPill label={check.status} tone={preflightTone[check.status]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.note}</p>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BundleFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
