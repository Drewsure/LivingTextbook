import { Card, StatusPill } from "@living-textbook/ui";
import type {
  TeacherAuthoringReadinessPlan,
  TeacherAuthoringStatus,
} from "@/data/sampleTeacherAuthoringReadiness";

interface TeacherAuthoringReadinessPanelProps {
  plan: TeacherAuthoringReadinessPlan;
}

const statusTone: Record<TeacherAuthoringStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  planned: "neutral",
  ready: "success",
};

export function TeacherAuthoringReadinessPanel({ plan }: TeacherAuthoringReadinessPanelProps) {
  const blockedLaneCount = plan.lanes.filter((lane) => lane.status === "blocked").length;
  const assignmentBlockerCount = plan.gates.filter((gate) => gate.blocksStudentAssignment && gate.status !== "ready").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher authoring readiness</p>
          <h3 className="mt-1 text-lg font-bold">{plan.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={assignmentBlockerCount > 0 ? "Assignment blocked" : "Review path ready"} tone={assignmentBlockerCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.releaseRule}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <AuthoringMetric label="Authoring lanes" value={String(plan.lanes.length)} />
        <AuthoringMetric label="Blocked lanes" value={String(blockedLaneCount)} />
        <AuthoringMetric label="Assignment blockers" value={String(assignmentBlockerCount)} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {plan.lanes.map((lane) => (
          <section key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.owner}</p>
                <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h4>
              </div>
              <StatusPill label={lane.status} tone={statusTone[lane.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{lane.purpose}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <AuthoringList title="Allowed" items={lane.allowedActions} />
              <AuthoringList title="Blocked" items={lane.blockedActions} />
            </div>
            <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Required before student use</p>
              <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
                {lane.requiredBeforeStudentUse.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </section>
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
            <p className="mt-2 text-xs font-semibold uppercase text-[var(--tenant-muted)]">
              {gate.blocksStudentAssignment ? "Blocks student assignment" : "Does not block assignment"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{gate.nextStep}</p>
          </section>
        ))}
      </div>
    </Card>
  );
}

function AuthoringMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function AuthoringList({ title, items }: { title: string; items: string[] }) {
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
