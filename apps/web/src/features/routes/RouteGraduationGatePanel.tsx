import { Card, StatusPill } from "@living-textbook/ui";
import type { RouteGraduationGate, RouteGraduationStatus } from "@/data/sampleRouteGraduationGate";

interface RouteGraduationGatePanelProps {
  gate: RouteGraduationGate;
}

const statusTone: Record<RouteGraduationStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "manual-review": "neutral",
  pass: "success",
};

export function RouteGraduationGatePanel({ gate }: RouteGraduationGatePanelProps) {
  const blockedCount = gate.lanes.filter((lane) => lane.status === "blocked").length;
  const reviewCount = gate.lanes.filter((lane) => lane.status === "manual-review").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Route release control</p>
          <h2 className="mt-1 text-lg font-bold">{gate.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
        </div>
        <StatusPill label="Scaffold is not production" tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{gate.standingRule}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <GraduationMetric label="Route states" value={String(gate.lanes.length)} />
        <GraduationMetric label="Manual review" value={String(reviewCount)} />
        <GraduationMetric label="Blocked states" value={String(blockedCount)} />
      </dl>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {gate.lanes.map((lane) => (
          <article key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.routeState}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h3>
              </div>
              <StatusPill label={lane.status} tone={statusTone[lane.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{lane.purpose}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <GraduationList laneId={lane.laneId} title="Required evidence" items={lane.requiredEvidence} />
              <GraduationList laneId={lane.laneId} title="Blocked actions" items={lane.blockedActions} />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <GraduationList laneId={gate.gateId} title="Hard requirements before graduation" items={gate.hardRequirements} />
        <GraduationList laneId={gate.gateId} title="Globally blocked actions" items={gate.blockedActions} />
      </div>
    </Card>
  );
}

function GraduationMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function GraduationList({ laneId, title, items }: { laneId: string; title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${laneId}-${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
