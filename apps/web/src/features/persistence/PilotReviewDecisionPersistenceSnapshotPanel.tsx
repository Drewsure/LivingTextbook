import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotReviewDecisionPersistenceSnapshot } from "@living-textbook/content-model";

interface PilotReviewDecisionPersistenceSnapshotPanelProps {
  snapshots: PilotReviewDecisionPersistenceSnapshot[];
  errors: string[];
}

export function PilotReviewDecisionPersistenceSnapshotPanel({
  snapshots,
  errors,
}: PilotReviewDecisionPersistenceSnapshotPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Review decision snapshot</p>
          <h2 className="mt-1 text-lg font-bold">Provider-neutral recovery without activation authority</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Hosted and closed-local deployments use the same versioned, fingerprinted review snapshot. It preserves review continuity while keeping restore, export, writes, and activation disabled.
          </p>
        </div>
        <StatusPill label={errors.length === 0 ? "Snapshots valid" : "Snapshot review"} tone={errors.length === 0 ? "success" : "warning"} />
      </div>

      {errors.length > 0 && (
        <ul className="mt-4 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`pilot-review-snapshot-error-${index}-${error}`}>{error}</li>)}
        </ul>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {snapshots.map((snapshot) => (
          <article key={snapshot.snapshotId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{snapshot.persistenceMode}</p>
                <h3 className="mt-1 text-base font-bold">{snapshot.snapshotId}</h3>
              </div>
              <StatusPill label="Review-only" tone="warning" />
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold">Decision</dt><dd className="mt-1 break-words text-[var(--tenant-muted)]">{snapshot.decisionId}</dd></div>
              <div><dt className="font-semibold">Fingerprint</dt><dd className="mt-1 break-words text-[var(--tenant-muted)]">{snapshot.decisionFingerprint}</dd></div>
              <div><dt className="font-semibold">Restore / export</dt><dd className="mt-1 text-[var(--tenant-muted)]">Blocked / blocked</dd></div>
              <div><dt className="font-semibold">Activation</dt><dd className="mt-1 text-[var(--tenant-muted)]">Blocked by contract</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </Card>
  );
}
