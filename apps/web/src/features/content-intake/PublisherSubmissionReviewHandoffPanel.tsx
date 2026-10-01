import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherSubmissionReviewHandoff } from "@living-textbook/content-model";

export function PublisherSubmissionReviewHandoffPanel({
  handoff,
  validationErrors,
}: {
  handoff: PublisherSubmissionReviewHandoff;
  validationErrors: string[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher review handoff</p>
          <h2 className="mt-1 text-lg font-bold">Every submission item has a named evidence lane</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This bridge carries the publisher manifest into the existing quarantine and evidence review surfaces. It is
            a review-only map, so a complete checklist still cannot promote files, print QR codes, or activate students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review only" tone="neutral" />
          <StatusPill label="Evidence pending" tone="warning" />
          <StatusPill label={validationErrors.length === 0 ? "Contract valid" : `${validationErrors.length} finding(s)`} tone={validationErrors.length === 0 ? "success" : "warning"} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={handoff.tenantId} />
        <Fact label="Package" value={handoff.packageId} />
        <Fact label="Evidence lanes" value={String(handoff.lanes.length)} />
        <Fact label="Student use" value="Blocked" />
      </dl>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <RouteFact label="Manifest" route={handoff.sourceManifestRoute} />
        <RouteFact label="Evidence index" route={handoff.evidenceIndexRoute} />
        <RouteFact label="Evidence handoff" route={handoff.evidenceHandoffRoute} />
      </div>

      {validationErrors.length > 0 ? (
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {validationErrors.map((error, index) => (
            <li key={`publisher-submission-handoff-error-${index}-${error}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{error}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 grid gap-3">
        {handoff.lanes.map((lane) => (
          <article key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.assetId}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h3>
              </div>
              <StatusPill label="Awaiting evidence" tone="warning" />
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <li className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-2">
                Evidence records: {lane.evidenceRequestIds.length > 0 ? lane.evidenceRequestIds.join(", ") : "none mapped"}
              </li>
              {lane.requiredEvidence.map((item, index) => (
                <li key={`${lane.laneId}-evidence-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ListBlock title="Blocked actions" items={handoff.blockedActions} />
        <ListBlock title="Next gate" items={handoff.nextGate} />
      </div>
    </Card>
  );
}

function RouteFact({ label, route }: { label: string; route: string }) {
  return (
    <a href={route} className="rounded-lg border border-[var(--tenant-border)] p-3 text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4">
      <span className="block text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</span>
      <span className="mt-1 block break-words text-sm font-bold">{route}</span>
    </a>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>
        ))}
      </ul>
    </section>
  );
}
