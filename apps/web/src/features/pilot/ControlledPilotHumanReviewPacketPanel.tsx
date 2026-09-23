import { Card, StatusPill } from "@living-textbook/ui";
import type { ControlledPilotHumanReviewPacket } from "@living-textbook/content-model";

export function ControlledPilotHumanReviewPacketPanel({ packet, errors }: { packet: ControlledPilotHumanReviewPacket; errors: string[] }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Controlled-pilot human review packet</p>
          <h2 className="mt-1 text-lg font-bold">Exact review scope, no approval side effects</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">This packet carries the four exact evidence references into a future human review. It is not a signature, approval, frozen release packet, or student-launch permission.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={packet.status} tone="warning" />
          <StatusPill label="Signed approval captured: No" tone="warning" />
          <StatusPill label="Packet freeze blocked" tone="warning" />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={packet.tenantId} />
        <Fact label="Package" value={packet.packageId} />
        <Fact label="Evidence refs" value={String(packet.evidenceReferences.length)} />
        <Fact label="Human records" value={String(packet.requiredHumanRecords.length)} />
      </dl>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Exact evidence references" values={packet.evidenceReferences} />
        <List title="Required human records" values={packet.requiredHumanRecords} />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Blocked actions" values={packet.blockedActions} tone="warning" />
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next gate</p><p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{packet.nextGate}</p>{errors.length > 0 ? <List title="Contract findings" values={errors} tone="warning" /> : null}</section>
      </div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`rounded-lg border border-[var(--tenant-border)] p-4 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
