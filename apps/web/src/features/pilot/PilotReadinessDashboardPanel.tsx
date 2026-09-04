import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotDashboardLaneStatus, PilotReadinessDashboard } from "@/data/samplePilotReadinessDashboard";
import { countPilotDashboardLanes } from "@/data/samplePilotReadinessDashboard";

interface PilotReadinessDashboardPanelProps {
  dashboard: PilotReadinessDashboard;
}

const statusTone: Record<PilotDashboardLaneStatus, "neutral" | "success" | "warning"> = {
  "demo-ready": "success",
  "needs-decision": "neutral",
  blocked: "warning",
};

const statusLabel: Record<PilotDashboardLaneStatus, string> = {
  "demo-ready": "Demo-ready",
  "needs-decision": "Needs decision",
  blocked: "Blocked",
};

export function PilotReadinessDashboardPanel({ dashboard }: PilotReadinessDashboardPanelProps) {
  const demoReadyCount = countPilotDashboardLanes(dashboard, "demo-ready");
  const decisionCount = countPilotDashboardLanes(dashboard, "needs-decision");
  const blockedCount = countPilotDashboardLanes(dashboard, "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot readiness dashboard</p>
          <h2 className="mt-1 text-lg font-bold">{dashboard.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{dashboard.summary}</p>
        </div>
        <StatusPill label={dashboard.statusStatement} tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1.5fr_0.75fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">First conversation position</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{dashboard.firstConversationPosition}</p>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Target window</p>
          <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{dashboard.targetPilotWindow}</p>
        </section>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <PilotMetric label="Demo-ready" value={String(demoReadyCount)} tone="success" />
        <PilotMetric label="Needs decision" value={String(decisionCount)} tone="neutral" />
        <PilotMetric label="Blocked" value={String(blockedCount)} tone="warning" />
      </dl>

      <div className="mt-5 grid gap-4">
        {dashboard.lanes.map((lane) => (
          <article key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Owner: {lane.owner}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h3>
              </div>
              <StatusPill label={statusLabel[lane.status]} tone={statusTone[lane.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <PilotText title="Visible evidence" value={lane.visibleEvidence} />
              <PilotText title="Pilot risk" value={lane.pilotRisk} />
              <PilotText title="Next action" value={lane.nextAction} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[0.85fr_1.15fr]">
              <a
                href={lane.sourceRoute}
                className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
              >
                Evidence route
                <span className="mt-1 block break-words font-mono text-xs font-semibold text-[var(--tenant-muted)]">
                  {lane.sourceRoute}
                </span>
              </a>
              <PilotList dashboardId={dashboard.dashboardId} laneId={lane.laneId} title="Dependent gates" items={lane.dependentGates} />
            </div>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Hard blocks</p>
          <StatusPill label="No launch button" tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-5 text-[var(--tenant-muted)] sm:grid-cols-2 lg:grid-cols-4">
          {dashboard.hardBlocks.map((block, index) => (
            <li key={`${dashboard.dashboardId}-hard-block-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              {block}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function PilotMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 flex items-center justify-between gap-3 text-lg font-bold text-[var(--tenant-text)]">
        {value}
        <StatusPill label={tone === "success" ? "Show" : tone === "warning" ? "Stop" : "Decide"} tone={tone} />
      </dd>
    </div>
  );
}

function PilotText({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function PilotList({
  dashboardId,
  laneId,
  title,
  items,
}: {
  dashboardId: string;
  laneId: string;
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${dashboardId}-${laneId}-${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
