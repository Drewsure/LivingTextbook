import { Card, StatusPill } from "@living-textbook/ui";
import type { TenantLibraryPlan, TenantLibraryStageStatus } from "@/data/sampleTenantLibraryPlan";

interface TenantLibraryPlanPanelProps {
  plan: TenantLibraryPlan;
}

const statusTone: Record<TenantLibraryStageStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  planned: "neutral",
  ready: "success",
};

export function TenantLibraryPlanPanel({ plan }: TenantLibraryPlanPanelProps) {
  const blockedCount = [...plan.stages, ...plan.gates].filter((item) => item.status === "blocked").length;
  const plannedCount = [...plan.stages, ...plan.gates].filter((item) => item.status === "planned").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Private tenant library</p>
          <h3 className="mt-1 text-lg font-bold">{plan.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Public community decision</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.publicLibraryDecision}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <LibraryMetric label="Library stages" value={String(plan.stages.length)} />
        <LibraryMetric label="Planned" value={String(plannedCount)} />
        <LibraryMetric label="Blocked" value={String(blockedCount)} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {plan.stages.map((stage) => (
          <section key={stage.stageId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{stage.visibility} / {stage.owner}</p>
                <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{stage.label}</h4>
              </div>
              <StatusPill label={stage.status} tone={statusTone[stage.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{stage.purpose}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <LibraryList title="Allowed" items={stage.allowedActions} />
              <LibraryList title="Guardrails" items={stage.guardrails} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Blocked by:</span> {stage.blocker}
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
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Protects:</span> {gate.protects}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Evidence:</span> {gate.evidence}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {gate.nextStep}
            </p>
          </section>
        ))}
      </div>
    </Card>
  );
}

function LibraryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function LibraryList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
