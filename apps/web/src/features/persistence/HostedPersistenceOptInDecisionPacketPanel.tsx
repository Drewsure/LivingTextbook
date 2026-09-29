import { Card, StatusPill } from "@living-textbook/ui";
import type { HostedPersistenceOptInCheckStatus, HostedPersistenceOptInDecisionCheck, HostedPersistenceOptInDecisionPacket } from "@living-textbook/content-model";

const toneByStatus: Record<HostedPersistenceOptInCheckStatus, "neutral" | "success" | "warning"> = { passed: "success", open: "neutral", blocked: "warning" };

export function HostedPersistenceOptInDecisionPacketPanel({ packet, errors }: { packet: HostedPersistenceOptInDecisionPacket; errors: string[] }) {
  const passed = packet.checks.filter((check) => check.status === "passed").length;
  const unresolved = packet.checks.length - passed;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">White-label pilot decision packet</p>
          <h2 className="mt-1 text-lg font-bold">Hosted persistence opt-in, package-scoped</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={packet.status === "blocked" ? "Blocked" : "Ready for human opt-in"} tone={packet.status === "blocked" ? "warning" : "success"} />
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="No writes" tone="success" />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={packet.tenantId} />
        <Fact label="Package" value={packet.packageId} />
        <Fact label="Delivery" value={packet.deliveryMode} />
        <Fact label="Checks" value={`${passed} passed / ${unresolved} unresolved`} />
      </dl>
      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold">Human decision boundary</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">This packet prepares a commercial hosted option. It does not select a vendor, record opt-in, create learner records, or activate a persistence adapter.</p>
          </div>
          <StatusPill label="No activation control" tone="success" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Provider selected" value="No" />
          <Fact label="Opt-in recorded" value="No" />
          <Fact label="Writes allowed" value="No" />
          <Fact label="Learner records" value="Excluded" />
        </div>
      </section>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">{packet.checks.map((check) => <CheckCard key={check.checkId} check={check} />)}</div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Blocked reasons" values={packet.blockedReasons} warning />
        <List title="Required human decisions" values={packet.requiredDecisions} />
        <List title="Next steps" values={packet.nextSteps} />
      </div>
      {errors.length > 0 && <List title="Packet validation errors" values={errors} warning />}
    </Card>
  );
}

function CheckCard({ check }: { check: HostedPersistenceOptInDecisionCheck }) {
  return <article className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.owner} / {check.checkId}</p><h3 className="mt-1 text-base font-bold">{check.label}</h3></div><StatusPill label={check.status} tone={toneByStatus[check.status]} /></div><p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{check.evidence}</p><p className="mt-3 text-sm leading-6"><strong>Next action:</strong> {check.nextAction}</p></article>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-2 break-words text-sm font-bold">{value}</p></section>;
}

function List({ title, values, warning = false }: { title: string; values: string[]; warning?: boolean }) {
  return <section className={`rounded-lg border border-[var(--tenant-border)] p-4 ${warning ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h3 className="text-sm font-bold">{title}</h3><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
