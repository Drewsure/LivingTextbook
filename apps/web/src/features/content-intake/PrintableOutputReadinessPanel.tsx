import { Card, StatusPill } from "@living-textbook/ui";
import type { PrintableOutputPlan, PrintableOutputStatus } from "@/data/samplePrintableOutputPlan";

interface PrintableOutputReadinessPanelProps {
  plan: PrintableOutputPlan;
}

const statusTone: Record<PrintableOutputStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  planned: "neutral",
  ready: "success",
};

export function PrintableOutputReadinessPanel({ plan }: PrintableOutputReadinessPanelProps) {
  const blockedGateCount = plan.gates.filter((gate) => gate.blocksExport && gate.status !== "ready").length;
  const plannedOutputCount = plan.outputs.filter((output) => output.status === "planned").length;
  const blockedOutputCount = plan.outputs.filter((output) => output.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Printable output readiness</p>
          <h3 className="mt-1 text-lg font-bold">{plan.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={blockedGateCount > 0 ? "PDF export blocked" : "Export ready"} tone={blockedGateCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Export decision</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.exportDecision}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <PrintableMetric label="Planned outputs" value={String(plannedOutputCount)} />
        <PrintableMetric label="Blocked outputs" value={String(blockedOutputCount)} />
        <PrintableMetric label="Export blockers" value={String(blockedGateCount)} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {plan.outputs.map((output) => (
          <section key={output.outputId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{output.audience} / {output.format}</p>
                <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{output.label}</h4>
              </div>
              <StatusPill label={output.status} tone={statusTone[output.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Source:</span> {output.sourceData}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Audio bridge:</span> {output.audioBridge}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Reporting:</span> {output.reportingBoundary}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Blocked by:</span> {output.blocker}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {plan.gates.map((gate) => (
          <section key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h4>
              <StatusPill label={gate.status} tone={statusTone[gate.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{gate.evidence}</p>
            <p className="mt-2 text-xs font-semibold uppercase text-[var(--tenant-muted)]">
              {gate.blocksExport ? "Blocks printable export" : "Does not block export"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{gate.nextStep}</p>
          </section>
        ))}
      </div>
    </Card>
  );
}

function PrintableMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
