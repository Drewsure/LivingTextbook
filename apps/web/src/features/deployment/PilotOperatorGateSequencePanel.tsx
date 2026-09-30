import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotOperatorGate,
  PilotOperatorGateStatus,
  PilotOperatorGateSequenceSnapshot,
} from "@/server/delivery/pilotOperatorGateSequence";

const statusTone: Record<PilotOperatorGateStatus, "neutral" | "success" | "warning"> = {
  "ready-for-review": "success",
  blocked: "warning",
  manual: "neutral",
};

const statusLabel: Record<PilotOperatorGateStatus, string> = {
  "ready-for-review": "Ready for review",
  blocked: "Blocked",
  manual: "Human gate",
};

export function PilotOperatorGateSequencePanel({
  snapshot,
}: {
  snapshot: PilotOperatorGateSequenceSnapshot;
}) {
  const readyCount = snapshot.gates.filter((gate) => gate.status === "ready-for-review").length;
  const blockedCount = snapshot.gates.filter((gate) => gate.status === "blocked").length;
  const nextGate = snapshot.gates.find((gate) => gate.gateId === snapshot.nextGateId) ?? snapshot.gates[0];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot operator gate sequence</p>
          <h2 className="mt-1 text-lg font-bold">The next human action is explicit</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This ordered worklist binds tenant, package, and delivery mode before a publisher pilot is considered. It is
            a read-only handoff guide: it cannot accept evidence, enable writes, print QR codes, or activate students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={snapshot.status === "blocked" ? "Blocked" : "Awaiting human review"} tone="warning" />
          <StatusPill label={`${readyCount}/${snapshot.gates.length} shaped`} tone={readyCount > 0 ? "success" : "neutral"} />
          <StatusPill label="No side effects" tone="success" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SequenceFact label="Tenant" value={snapshot.tenantId || "Missing"} />
        <SequenceFact label="Package" value={snapshot.packageId || "Missing"} />
        <SequenceFact label="Delivery mode" value={snapshot.mode} />
        <SequenceFact label="Open configuration blockers" value={String(blockedCount + snapshot.blockers.length)} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <SequenceFact label="Writes enabled" value={snapshot.writesEnabled ? "Yes" : "No"} />
        <SequenceFact label="Student activation allowed" value={snapshot.studentActivationAllowed ? "Yes" : "No"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next gate</p>
        <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{nextGate.label}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{nextGate.nextAction}</p>
      </section>

      {snapshot.blockers.length > 0 ? (
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {snapshot.blockers.map((blocker, index) => (
            <li key={`${snapshot.sequenceId}-blocker-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              {blocker}
            </li>
          ))}
        </ul>
      ) : null}

      <ol className="mt-5 grid gap-3">
        {snapshot.gates.map((gate) => (
          <GateRow key={`${snapshot.sequenceId}-${gate.gateId}`} gate={gate} />
        ))}
      </ol>
    </Card>
  );
}

function GateRow({ gate }: { gate: PilotOperatorGate }) {
  return (
    <li className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--tenant-primary-soft)] text-sm font-bold text-[var(--tenant-text)]">
            {gate.order}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Owner: {gate.owner}</p>
            <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h3>
          </div>
        </div>
        <StatusPill label={statusLabel[gate.status]} tone={statusTone[gate.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{gate.evidence}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">Next: {gate.nextAction}</p>
    </li>
  );
}

function SequenceFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}
