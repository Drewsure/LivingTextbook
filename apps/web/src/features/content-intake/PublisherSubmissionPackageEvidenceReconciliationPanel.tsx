import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherSubmissionPackageEvidenceReconciliation } from "@living-textbook/content-model";

export function PublisherSubmissionPackageEvidenceReconciliationPanel({
  reconciliation,
  validationErrors,
}: {
  reconciliation: PublisherSubmissionPackageEvidenceReconciliation;
  validationErrors: string[];
}) {
  const missing = reconciliation.lanes.filter((lane) => lane.status === "missing").length;
  const pending = reconciliation.lanes.filter((lane) => lane.status === "review-pending").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package evidence reconciliation</p>
          <h2 className="mt-1 text-lg font-bold">Manifest coverage against the canonical review packet</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview translates publisher-submitted material into the shared content, game, audio, video, image,
            font, accessibility, and rights lanes. It identifies what is missing or awaiting evidence before package review.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Assembly blocked" tone="warning" />
          <StatusPill label={`${missing} missing`} tone="warning" />
          <StatusPill label={`${pending} review-pending`} tone="neutral" />
          <StatusPill label={validationErrors.length === 0 ? "Contract valid" : `${validationErrors.length} finding(s)`} tone={validationErrors.length === 0 ? "success" : "warning"} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={reconciliation.tenantId} />
        <Fact label="Package" value={reconciliation.packageId} />
        <Fact label="Review record" value={reconciliation.packageEvidenceReviewRecord} />
        <Fact label="QR print" value="Blocked" />
      </dl>

      {validationErrors.length > 0 ? (
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {validationErrors.map((error, index) => (
            <li key={`package-evidence-reconciliation-error-${index}-${error}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{error}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {reconciliation.lanes.map((lane) => (
          <article key={lane.lane} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Canonical lane</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.lane}</h3>
              </div>
              <StatusPill label={lane.status} tone={lane.status === "review-pending" ? "neutral" : "warning"} />
            </div>
            <p className="mt-3 text-sm text-[var(--tenant-muted)]">Manifest assets: {lane.sourceAssetIds.length > 0 ? lane.sourceAssetIds.join(", ") : "none mapped"}</p>
            {lane.derivedEvidenceRecordIds.length > 0 ? <p className="mt-2 text-sm text-[var(--tenant-muted)]">Derived evidence: {lane.derivedEvidenceRecordIds.join(", ")}</p> : null}
            <ListBlock title="Required evidence" items={lane.requiredEvidence} />
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ListBlock title="Unresolved requirements" items={reconciliation.unresolvedRequirements} />
        <ListBlock title="Next gate" items={reconciliation.nextGate} />
      </div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4><ul className="mt-3 grid max-h-64 gap-2 overflow-auto text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>;
}
