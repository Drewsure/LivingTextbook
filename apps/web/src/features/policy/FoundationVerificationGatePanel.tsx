import { Card, StatusPill } from "@living-textbook/ui";
import type {
  FoundationVerificationGate,
  FoundationVerificationStatus,
} from "@/data/sampleFoundationVerificationGate";

interface FoundationVerificationGatePanelProps {
  gate: FoundationVerificationGate;
}

const statusTone: Record<FoundationVerificationStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "manual-review": "neutral",
  pass: "success",
};

export function FoundationVerificationGatePanel({ gate }: FoundationVerificationGatePanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Foundation verification gate</p>
          <h3 className="mt-1 text-lg font-bold">{gate.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
        </div>
        <StatusPill label={gate.lastKnownStatus} tone={statusTone[gate.lastKnownStatus]} />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Canonical local command</p>
        <p className="mt-1 break-words font-mono text-sm font-bold text-[var(--tenant-text)]">{gate.canonicalCommand}</p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {gate.checks.map((check) => (
          <section key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.command}</p>
                <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{check.label}</h4>
              </div>
              <StatusPill label={check.status} tone={statusTone[check.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Protects:</span> {check.protects}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Evidence:</span> {check.evidence}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {check.nextStep}
            </p>
          </section>
        ))}
      </div>
    </Card>
  );
}
