import { Card, StatusPill } from "@living-textbook/ui";
import type { ControlledPilotHumanReviewNextGateHandoff } from "@living-textbook/content-model";

export function ControlledPilotHumanReviewNextGateHandoffPanel({ handoff, errors }: { handoff: ControlledPilotHumanReviewNextGateHandoff; errors: string[] }) {
  const ready = handoff.status === "ready-for-next-gate";
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Controlled-pilot next-gate handoff</p>
          <h2 className="mt-1 text-lg font-bold">Evidence handoff with no approval authority</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This surface carries the adjudication outcome to the next adult review lane. It is not an approval,
            persistence operation, release mutation, package promotion, or student-launch permission.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={handoff.status} tone={ready ? "success" : "warning"} />
          <StatusPill label={`Recipient: ${handoff.recipientRole}`} tone="neutral" />
          <StatusPill label="Review only" tone="warning" />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={handoff.tenantId} />
        <Fact label="Package" value={handoff.packageId} />
        <Fact label="Source adjudication" value={handoff.adjudicationId} />
        <Fact label="Evidence refs" value={String(handoff.evidenceReferences.length)} />
      </dl>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Blocking reasons" items={handoff.blockingReasons} tone="warning" />
        <List title="Required next records" items={handoff.requiredNextRecords} />
        <List title="Next gate" items={handoff.nextGate} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Boundary label="Approval capture" />
        <Boundary label="Release mutation" />
        <Boundary label="Persistence write" />
        <Boundary label="Package promotion" />
        <Boundary label="Student launch" />
      </div>
      {errors.length > 0 ? <List title="Contract findings" items={errors} tone="warning" /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function Boundary({ label }: { label: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">Blocked</p></div>;
}

function List({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`rounded-lg border border-[var(--tenant-border)] p-4 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)}</ul></section>;
}
