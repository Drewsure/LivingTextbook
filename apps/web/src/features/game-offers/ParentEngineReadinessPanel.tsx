import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ParentEngineReadinessPlan,
  ParentEngineReadinessRecord,
  ParentEngineReadinessStatus,
} from "@/data/sampleParentEngineReadiness";

interface ParentEngineReadinessPanelProps {
  plan: ParentEngineReadinessPlan;
}

const statusTone: Record<ParentEngineReadinessStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "review-only": "neutral",
  blocked: "warning",
};

export function ParentEngineReadinessPanel({ plan }: ParentEngineReadinessPanelProps) {
  const readyCount = plan.records.filter((record) => record.status === "ready").length;
  const activeModeCount = plan.records.reduce((total, record) => total + record.activeModes.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Parent engine readiness</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${readyCount} engines ready`} tone={readyCount >= 3 ? "success" : "warning"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision rule</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.decisionRule}</p>
          </div>
          <StatusPill label={`${activeModeCount} active modes`} tone="success" />
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Outside prototype gate</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{plan.zAiIntakeRule}</p>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {plan.records.map((record) => (
          <ParentEngineCard key={record.engineId} record={record} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[var(--tenant-text)]">Hard rules</h3>
          <StatusPill label={String(plan.hardRules.length)} tone="success" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {plan.hardRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function ParentEngineCard({ record }: { record: ParentEngineReadinessRecord }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.engineId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.label}</h3>
        </div>
        <StatusPill label={record.status} tone={statusTone[record.status]} />
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{record.contractSummary}</p>

      <div className="mt-4 grid gap-3">
        <EngineList
          title="Active modes"
          items={record.activeModes.length > 0 ? record.activeModes : ["No active route yet"]}
          tone={record.activeModes.length > 0 ? "success" : "warning"}
        />
        <EngineList title="Ready evidence" items={record.readyEvidence} tone="success" />
        <EngineList title="Remaining work" items={record.remainingWork} tone="neutral" />
        <EngineList title="Blocked actions" items={record.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function EngineList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
