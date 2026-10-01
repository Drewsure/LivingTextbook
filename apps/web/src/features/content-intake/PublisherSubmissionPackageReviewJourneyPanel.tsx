import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherSubmissionPackageReviewJourney, PublisherSubmissionReviewJourneyGate } from "@living-textbook/content-model";

export function PublisherSubmissionPackageReviewJourneyPanel({
  journey,
  validationErrors,
}: {
  journey: PublisherSubmissionPackageReviewJourney;
  validationErrors: string[];
}) {
  const passed = journey.gates.filter((gate) => gate.status === "passed").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Controlled sample package journey</p>
          <h2 className="mt-1 text-lg font-bold">Publisher source to reviewed package, with every gate visible</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This sample demonstrates the intended publisher workflow using synthetic identities only. It is a traceable
            review journey, not a release approval or a substitute for the publisher's real evidence.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Sample data only" tone="neutral" />
          <StatusPill label="Release blocked" tone="warning" />
          <StatusPill label={`${passed}/${journey.gates.length} gates passed`} tone={passed > 0 ? "success" : "warning"} />
          <StatusPill label={validationErrors.length === 0 ? "Contract valid" : `${validationErrors.length} finding(s)`} tone={validationErrors.length === 0 ? "success" : "warning"} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={journey.tenantId} />
        <Fact label="Package" value={journey.packageId} />
        <Fact label="Quarantine identity" value={journey.quarantineId} />
        <Fact label="QR print" value="Blocked" />
      </dl>
      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Publisher evidence request lineage</p>
        <p className="mt-1 break-words text-sm leading-6 text-[var(--tenant-muted)]">{journey.publisherEvidenceRequestIds.join(", ")}</p>
      </div>

      {validationErrors.length > 0 ? (
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {validationErrors.map((error, index) => <li key={`publisher-review-journey-error-${index}-${error}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{error}</li>)}
        </ul>
      ) : null}

      <div className="mt-5 grid gap-3">
        {journey.gates.map((gate) => <JourneyGate key={gate.gateId} gate={gate} />)}
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Teacher-led student rehearsal</p>
        <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
          Rehearse the reviewed package with a teacher before any QR delivery, persistence activation, or student-facing use is allowed.
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <RouteFact label="Evidence index" route={journey.evidenceIndexRoute} />
        <RouteFact label="Evidence handoff" route={journey.evidenceHandoffRoute} />
        <Fact label="Student use" value="Blocked" />
      </div>
    </Card>
  );
}

function JourneyGate({ gate }: { gate: PublisherSubmissionReviewJourneyGate }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.gateId}</p><h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{gate.label}</h3></div>
        <StatusPill label={gate.status} tone={gate.status === "passed" ? "success" : "warning"} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{gate.evidence}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">Next action: {gate.nextAction}</p>
    </article>
  );
}

function RouteFact({ label, route }: { label: string; route: string }) {
  return <a href={route} className="rounded-lg border border-[var(--tenant-border)] p-3 text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"><span className="block text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</span><span className="mt-1 block break-words text-sm font-bold">{route}</span></a>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}
