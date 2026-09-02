import { Card, StatusPill } from "@living-textbook/ui";
import type { PwaOfflineReadinessGate, PwaOfflineReadinessStatus } from "@/data/samplePwaOfflineReadiness";
import { countPwaOfflineReadinessLanes } from "@/data/samplePwaOfflineReadiness";

interface PwaOfflineReadinessPanelProps {
  gate: PwaOfflineReadinessGate;
}

const statusTone: Record<PwaOfflineReadinessStatus, "neutral" | "success" | "warning"> = {
  pass: "success",
  "manual-review": "neutral",
  blocked: "warning",
};

export function PwaOfflineReadinessPanel({ gate }: PwaOfflineReadinessPanelProps) {
  const manualReviewCount = countPwaOfflineReadinessLanes(gate, "manual-review");
  const blockedCount = countPwaOfflineReadinessLanes(gate, "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Hosted and closed companion boundary</p>
          <h2 className="mt-1 text-lg font-bold">{gate.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
        </div>
        <StatusPill label="No offline-ready claim" tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Installability rule</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{gate.installabilityRule}</p>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Offline honesty rule</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{gate.offlineHonestyRule}</p>
        </section>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <ReadinessMetric label="Readiness lanes" value={String(gate.lanes.length)} />
        <ReadinessMetric label="Manual review" value={String(manualReviewCount)} />
        <ReadinessMetric label="Blocked" value={String(blockedCount)} />
      </dl>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {gate.lanes.map((lane) => (
          <article key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.owner}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h3>
              </div>
              <StatusPill label={lane.status} tone={statusTone[lane.status]} />
            </div>
            <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">{lane.currentState}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.purpose}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ReadinessList gateId={gate.gateId} laneId={lane.laneId} title="Required before live" items={lane.requiredBeforeLive} />
              <ReadinessList gateId={gate.gateId} laneId={lane.laneId} title="Blocked actions" items={lane.blockedActions} />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ReadinessList gateId={gate.gateId} laneId="hard-requirements" title="Hard requirements" items={gate.hardRequirements} />
        <ReadinessList gateId={gate.gateId} laneId="global-blocks" title="Globally blocked actions" items={gate.globallyBlockedActions} />
      </div>
    </Card>
  );
}

function ReadinessMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function ReadinessList({
  gateId,
  laneId,
  title,
  items,
}: {
  gateId: string;
  laneId: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${gateId}-${laneId}-${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
