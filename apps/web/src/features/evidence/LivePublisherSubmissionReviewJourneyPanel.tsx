import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PublisherSubmissionLiveReviewJourney,
  PublisherSubmissionLiveReviewJourneyGate,
} from "@living-textbook/content-model";

export function LivePublisherSubmissionReviewJourneyPanel({
  journey,
  validationErrors = [],
}: {
  journey: PublisherSubmissionLiveReviewJourney;
  validationErrors?: string[];
}) {
  const passed = journey.gates.filter((gate) => gate.status === "passed").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Live publisher review journey</p>
          <h2 className="mt-1 text-lg font-bold">One tenant-bound path from quarantine to teacher rehearsal</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This journey is derived from the submitted source and current review records. It shows what is complete and what remains before a reviewed package can be considered for delivery.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Live metadata" tone="neutral" />
          <StatusPill label="Release blocked" tone="warning" />
          <StatusPill label={`${passed}/${journey.gates.length} gates passed`} tone={passed > 0 ? "success" : "warning"} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={journey.tenantId} />
        <Fact label="Quarantine" value={journey.quarantineId} />
        <Fact label="Package" value={journey.packageId} />
        <Fact label="Unit" value={journey.unitKey ?? "Not assigned"} />
        <Fact label="Source" value={journey.sourceId} />
        <Fact label="Checksum" value={journey.checksumSha256} />
        <Fact label="Package assembly" value="Blocked" />
        <Fact label="No student-facing use" value="Blocked" />
      </dl>

      {validationErrors.length > 0 ? (
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {validationErrors.map((error, index) => <li key={`live-review-journey-error-${index}-${error}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{error}</li>)}
        </ul>
      ) : null}

      <div className="mt-5 grid gap-3">
        {journey.gates.map((gate) => <JourneyGate key={gate.gateId} gate={gate} />)}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Next gates" items={journey.nextGates} />
        <ListBlock title="Protected actions" items={journey.blockedActions} tone="warning" />
      </div>

      <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
        Teacher-led student rehearsal remains blocked until release review closes. This live journey records review state only. It does not assemble files, promote assets, print QR codes, activate hosted persistence, or start students.
      </p>
    </Card>
  );
}

function JourneyGate({ gate }: { gate: PublisherSubmissionLiveReviewJourneyGate }) {
  const tone = gate.status === "passed" ? "success" : "warning";
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.gateId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{gate.label}</h3>
        </div>
        <StatusPill label={gate.status} tone={tone} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{gate.evidence}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">Next action: {gate.nextAction}</p>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function ListBlock({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold">{title}</h3><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>;
}
