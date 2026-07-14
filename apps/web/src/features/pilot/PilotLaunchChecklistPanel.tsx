import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotLaunchChecklist,
  PilotLaunchChecklistStage,
  PilotLaunchChecklistStageStatus,
} from "@/data/samplePilotLaunchChecklist";

interface PilotLaunchChecklistPanelProps {
  checklist: PilotLaunchChecklist;
}

const statusLabel: Record<PilotLaunchChecklistStageStatus, string> = {
  "ready-for-demo": "Demo-ready",
  open: "Open",
  blocked: "Blocked",
};

const statusTone: Record<PilotLaunchChecklistStageStatus, "neutral" | "success" | "warning"> = {
  "ready-for-demo": "success",
  open: "warning",
  blocked: "warning",
};

export function PilotLaunchChecklistPanel({ checklist }: PilotLaunchChecklistPanelProps) {
  const demoReadyCount = checklist.stages.filter((stage) => stage.status === "ready-for-demo").length;
  const openCount = checklist.stages.filter((stage) => stage.status === "open").length;
  const blockedCount = checklist.stages.filter((stage) => stage.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Partner pilot launch planning</p>
          <h2 className="mt-1 text-lg font-bold">{checklist.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{checklist.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={checklist.launchActionStatus} tone="neutral" />
          <StatusPill label={blockedCount > 0 ? "Go/no-go blocked" : "Go/no-go open"} tone={blockedCount > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ChecklistMetric label="Release candidate" value={checklist.releaseCandidate} tone="neutral" />
        <ChecklistMetric label="Demo-ready stages" value={String(demoReadyCount)} tone={demoReadyCount > 0 ? "success" : "warning"} />
        <ChecklistMetric label="Open stages" value={String(openCount)} tone={openCount > 0 ? "warning" : "success"} />
        <ChecklistMetric label="Blocked stages" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{checklist.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              This checklist organizes existing release-control evidence. It cannot launch students, capture approvals, upload evidence, or mark the package pilot-ready.
            </p>
          </div>
          <StatusPill label="Preview only" tone="neutral" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {checklist.stages.map((stage) => (
          <ChecklistStageCard key={stage.stageId} stage={stage} />
        ))}
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Operating rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">How the team should talk about pilot status</h3>
          </div>
          <StatusPill label="Partner-safe" tone="success" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
          {checklist.operatingRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function ChecklistMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function ChecklistStageCard({ stage }: { stage: PilotLaunchChecklistStage }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {stage.owner} / {stage.source}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{stage.label}</h3>
        </div>
        <StatusPill label={statusLabel[stage.status]} tone={statusTone[stage.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{stage.evidence}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {stage.nextStep}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <ChecklistMiniList title="Required before classroom pilot" items={stage.requiredBeforeClassroomPilot} tone="neutral" />
        <ChecklistMiniList title="Still blocked" items={stage.stillBlocked} tone="warning" />
      </div>
    </article>
  );
}

function ChecklistMiniList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
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
