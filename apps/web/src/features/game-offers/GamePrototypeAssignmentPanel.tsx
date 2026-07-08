import { Card, StatusPill } from "@living-textbook/ui";
import type {
  GamePrototypeAssignment,
  GamePrototypeAssignmentPlan,
  PrototypeAssignmentStatus,
  PrototypeBuildSurface,
  PrototypeIntegrationRisk,
} from "@/data/sampleGamePrototypeAssignmentPlan";

interface GamePrototypeAssignmentPanelProps {
  plan: GamePrototypeAssignmentPlan;
}

const surfaceTone: Record<PrototypeBuildSurface, "neutral" | "success" | "warning"> = {
  "dom-reference": "success",
  phaser: "warning",
  hybrid: "neutral",
  defer: "neutral",
};

const surfaceLabel: Record<PrototypeBuildSurface, string> = {
  "dom-reference": "DOM reference",
  phaser: "Phaser",
  hybrid: "Hybrid",
  defer: "Defer",
};

const statusTone: Record<PrototypeAssignmentStatus, "neutral" | "success" | "warning"> = {
  "ready-to-brief": "success",
  "in-prototype": "warning",
  "needs-contract": "warning",
  defer: "neutral",
};

const statusLabel: Record<PrototypeAssignmentStatus, string> = {
  "ready-to-brief": "Ready brief",
  "in-prototype": "Prototype",
  "needs-contract": "Needs contract",
  defer: "Defer",
};

const riskTone: Record<PrototypeIntegrationRisk, "neutral" | "success" | "warning"> = {
  low: "success",
  medium: "warning",
  high: "warning",
};

export function GamePrototypeAssignmentPanel({ plan }: GamePrototypeAssignmentPanelProps) {
  const phaserCount = plan.assignments.filter((assignment) => assignment.recommendedSurface === "phaser").length;
  const domCount = plan.assignments.filter((assignment) => assignment.recommendedSurface === "dom-reference").length;
  const activeCount = plan.assignments.filter((assignment) => assignment.status === "ready-to-brief" || assignment.status === "in-prototype").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Prototype assignments</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${activeCount} active`} tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.decisionRule}</p>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <AssignmentMetric label="DOM reference" value={String(domCount)} tone="success" />
        <AssignmentMetric label="Phaser" value={String(phaserCount)} tone="warning" />
        <AssignmentMetric label="Assignments" value={String(plan.assignments.length)} tone="neutral" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Mode assignments</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Which games Z.ai should prototype in which surface</h3>
            </div>
            <StatusPill label="Codex gate" tone="warning" />
          </div>
          <div className="mt-3 grid gap-3">
            {plan.assignments.map((assignment) => (
              <AssignmentCard key={assignment.assignmentId} assignment={assignment} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing rules</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Phaser is powerful, not universal</h3>
            </div>
            <StatusPill label="Required" tone="success" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {plan.standingRules.map((rule) => (
              <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                {rule}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}

function AssignmentMetric({
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
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Watch" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function AssignmentCard({ assignment }: { assignment: GamePrototypeAssignment }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {assignment.gameMode} / {assignment.parentEngine}
          </p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{assignment.label}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={surfaceLabel[assignment.recommendedSurface]} tone={surfaceTone[assignment.recommendedSurface]} />
          <StatusPill label={statusLabel[assignment.status]} tone={statusTone[assignment.status]} />
          <StatusPill label={`${assignment.integrationRisk} risk`} tone={riskTone[assignment.integrationRisk]} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{assignment.whyThisSurface}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Z.ai:</span> {assignment.zaiInstruction}
      </p>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <AssignmentList title="Acceptance gate" items={assignment.acceptanceGate} tone="success" />
        <AssignmentList title="Not allowed yet" items={assignment.notAllowedYet} tone="warning" />
      </div>
    </article>
  );
}

function AssignmentList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h5>
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
