import type { LocalBundlePackageManifestRollbackDryRun } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundlePackageManifestRollbackDryRunPanelProps {
  dryRun: LocalBundlePackageManifestRollbackDryRun;
  errors: string[];
}

export function LocalBundlePackageManifestRollbackDryRunPanel({ dryRun, errors }: LocalBundlePackageManifestRollbackDryRunPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package manifest and rollback dry-run</p>
          <h2 className="mt-1 text-lg font-bold">Versioned local package evidence with a safe fallback</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview binds content, media, routes, games, and reports to one tenant-scoped version and shows the
            impact of a future rollback. It cannot activate a bundle, replace media, delete learner data, or change QR routes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Preview-only" tone="warning" />
          <StatusPill label="Rollback blocked" tone="warning" />
          <StatusPill label="QR mutation blocked" tone="warning" />
          <StatusPill label="No side effect" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Fact label="Tenant" value={dryRun.tenantId} />
        <Fact label="Bundle" value={dryRun.bundleId} />
        <Fact label="Current" value={dryRun.currentVersion} />
        <Fact label="Fallback" value={dryRun.previousVersion ?? "Policy required"} />
        <Fact label="Artifacts" value={`${dryRun.artifacts.length}`} />
      </dl>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {dryRun.artifacts.map((artifact) => (
          <section key={artifact.artifactId} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold">{artifact.label}</h3>
              <StatusPill label={artifact.readiness} tone={artifact.readiness === "ready-preview" ? "success" : "warning"} />
            </div>
            <p className="mt-2 break-words text-xs leading-5 text-[var(--tenant-muted)]">{artifact.relativePath}</p>
            <p className="mt-1 text-xs text-[var(--tenant-muted)]">Checksum: {artifact.checksumStatus}</p>
          </section>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <h3 className="text-sm font-bold">Rollback impact matrix</h3>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
          {dryRun.rollbackImpacts.map((impact) => (
            <li key={impact.impactId}>
              <span className="font-semibold">{impact.domain}:</span> {impact.currentVersion} to {impact.fallbackVersion} remains blocked; {impact.fallbackTarget}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-semibold text-[var(--tenant-muted)]">{dryRun.qrFallbackRule}</p>
      </section>

      {errors.length > 0 && (
        <ul className="mt-5 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`manifest-rollback-error-${index}-${error}`}>{error}</li>)}
        </ul>
      )}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
