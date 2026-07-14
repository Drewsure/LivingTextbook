import { Card, StatusPill } from "@living-textbook/ui";
import type {
  TeacherDryRunRehearsal,
  TeacherDryRunStage,
  TeacherDryRunStageStatus,
} from "@/data/sampleTeacherDryRunRehearsal";

interface TeacherDryRunRehearsalPanelProps {
  rehearsal: TeacherDryRunRehearsal;
}

const statusLabel: Record<TeacherDryRunStageStatus, string> = {
  "ready-for-rehearsal": "Ready for rehearsal",
  "needs-review": "Needs review",
  blocked: "Blocked",
};

const statusTone: Record<TeacherDryRunStageStatus, "neutral" | "success" | "warning"> = {
  "ready-for-rehearsal": "success",
  "needs-review": "warning",
  blocked: "warning",
};

export function TeacherDryRunRehearsalPanel({ rehearsal }: TeacherDryRunRehearsalPanelProps) {
  const readyCount = rehearsal.stages.filter((stage) => stage.status === "ready-for-rehearsal").length;
  const reviewCount = rehearsal.stages.filter((stage) => stage.status === "needs-review").length;
  const blockedCount = rehearsal.stages.filter((stage) => stage.status === "blocked").length;
  const routeCount = new Set(rehearsal.stages.map((stage) => stage.routePath)).size;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher-only rehearsal</p>
          <h2 className="mt-1 text-lg font-bold">{rehearsal.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{rehearsal.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={rehearsal.studentLaunchStatus} tone="neutral" />
          <StatusPill label="Teacher-only rehearsal" tone="success" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DryRunMetric label="Routes to rehearse" value={String(routeCount)} tone="neutral" />
        <DryRunMetric label="Ready stages" value={String(readyCount)} tone={readyCount > 0 ? "success" : "warning"} />
        <DryRunMetric label="Review stages" value={String(reviewCount)} tone={reviewCount > 0 ? "warning" : "success"} />
        <DryRunMetric label="Blocked stages" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{rehearsal.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Dry-run evidence only. Do not collect real learner data, store live progress, export reports, upload evidence, or describe the package as pilot-ready from this dry run.
            </p>
          </div>
          <StatusPill label={rehearsal.evidenceStatus} tone="neutral" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {rehearsal.stages.map((stage) => (
          <DryRunStageCard key={stage.stageId} stage={stage} />
        ))}
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Operating rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What a dry run can and cannot prove</h3>
          </div>
          <StatusPill label="No live workflow" tone="neutral" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
          {rehearsal.operatingRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function DryRunMetric({
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

function DryRunStageCard({ stage }: { stage: TeacherDryRunStage }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {stage.category} / Owner: {stage.owner}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{stage.label}</h3>
        </div>
        <StatusPill label={statusLabel[stage.status]} tone={statusTone[stage.status]} />
      </div>
      <p className="mt-2 break-words rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-2 text-sm font-semibold text-[var(--tenant-text)]">
        {stage.routePath}
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Teacher action:</span> {stage.teacherAction}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Expected evidence:</span> {stage.expectedEvidence}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <DryRunMiniList title="Must confirm" items={stage.mustConfirm} tone="neutral" />
        <DryRunMiniList title="Blocked actions" items={stage.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function DryRunMiniList({
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
