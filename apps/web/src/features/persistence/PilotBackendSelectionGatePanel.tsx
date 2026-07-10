import { Card, StatusPill } from "@living-textbook/ui";
import type {
  BackendGateCriterion,
  BackendGateStatus,
  PilotBackendSelectionGate,
} from "@/data/samplePilotBackendSelectionGate";

interface PilotBackendSelectionGatePanelProps {
  gate: PilotBackendSelectionGate;
}

const statusTone: Record<BackendGateStatus, "neutral" | "success" | "warning"> = {
  passed: "success",
  open: "neutral",
  blocked: "warning",
};

const statusLabel: Record<BackendGateStatus, string> = {
  passed: "Passed",
  open: "Open",
  blocked: "Blocked",
};

export function PilotBackendSelectionGatePanel({ gate }: PilotBackendSelectionGatePanelProps) {
  const blockedCount = gate.criteria.filter((criterion) => criterion.status === "blocked").length;
  const openCount = gate.criteria.filter((criterion) => criterion.status === "open").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Backend selection gate</p>
          <h2 className="mt-1 text-lg font-bold">{gate.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.decision}</p>
        </div>
        <StatusPill label={blockedCount > 0 || openCount > 0 ? "Not selected" : "Ready"} tone={blockedCount > 0 || openCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <GateSummary label="Selection rule" value={gate.rule} tone="neutral" />
        <GateSummary label="Cost control" value={gate.costControl} tone="success" />
        <GateSummary label="Local compatibility" value={gate.localCompatibility} tone="neutral" />
      </div>

      <div className="mt-5 grid gap-3">
        {gate.criteria.map((criterion) => (
          <CriterionCard key={criterion.criterionId} criterion={criterion} />
        ))}
      </div>
    </Card>
  );
}

function GateSummary({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{label}</h3>
        <StatusPill label={tone === "success" ? "Cost aware" : "Required"} tone={tone} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{value}</p>
    </section>
  );
}

function CriterionCard({ criterion }: { criterion: BackendGateCriterion }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{criterion.owner} owner</p>
          <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{criterion.label}</h3>
        </div>
        <StatusPill label={statusLabel[criterion.status]} tone={statusTone[criterion.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{criterion.requirement}</p>
      <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next action</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{criterion.nextAction}</p>
      </section>
    </article>
  );
}
