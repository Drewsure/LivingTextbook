import { Card, StatusPill } from "@living-textbook/ui";
import type { ControlledPilotHumanReviewAdjudication } from "@living-textbook/content-model";

export function ControlledPilotHumanReviewAdjudicationPanel({ adjudication, errors }: { adjudication: ControlledPilotHumanReviewAdjudication; errors: string[] }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Controlled-pilot evidence adjudication</p>
          <h2 className="mt-1 text-lg font-bold">Human review outcome without release authority</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">This record states whether the current evidence is blocked or may advance to the next review gate. It never captures approval, writes persistence, promotes a package, activates a route, or launches students.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={adjudication.status} tone="warning" />
          <StatusPill label="Review only" tone="neutral" />
          <StatusPill label="No release authority" tone="warning" />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Reviewer" value={adjudication.reviewerRef} />
        <Fact label="Decision" value={adjudication.decision} />
        <Fact label="Tenant" value={adjudication.tenantId} />
        <Fact label="Package" value={adjudication.packageId} />
        <Fact label="Packet" value={adjudication.packetId} />
        <Fact label="Snapshot" value={adjudication.snapshotId} />
        <Fact label="Blocking reasons" value={String(adjudication.blockingReasons.length)} />
        <Fact label="Recorded" value={adjudication.recordedAt} />
      </dl>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Blocking reasons" items={adjudication.blockingReasons} tone="warning" />
        <List title="Blocked actions" items={adjudication.blockedActions} tone="warning" />
        <List title="Next gate" items={adjudication.nextGate} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Boundary label="Approval capture" value="Blocked" />
        <Boundary label="Release mutation" value="Blocked" />
        <Boundary label="Persistence write" value="Blocked" />
        <Boundary label="Promotion" value="Blocked" />
        <Boundary label="Student launch" value="Blocked" />
      </div>
      {errors.length > 0 ? <List title="Contract findings" items={errors} tone="warning" /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function Boundary({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p></div>;
}

function List({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`rounded-lg border border-[var(--tenant-border)] p-4 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)}</ul></section>;
}
