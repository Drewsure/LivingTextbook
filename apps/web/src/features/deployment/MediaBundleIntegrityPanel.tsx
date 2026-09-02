import { Card, StatusPill } from "@living-textbook/ui";
import type { MediaBundleIntegrityPlan, MediaBundleIntegrityStatus } from "@/data/sampleMediaBundleIntegrity";
import { countMediaBundleIntegrityLanes } from "@/data/sampleMediaBundleIntegrity";

interface MediaBundleIntegrityPanelProps {
  plan: MediaBundleIntegrityPlan;
}

const statusTone: Record<MediaBundleIntegrityStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-proof": "neutral",
  blocked: "warning",
};

export function MediaBundleIntegrityPanel({ plan }: MediaBundleIntegrityPanelProps) {
  const readyCount = countMediaBundleIntegrityLanes(plan, "ready");
  const needsProofCount = countMediaBundleIntegrityLanes(plan, "needs-proof");
  const blockedCount = countMediaBundleIntegrityLanes(plan, "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media package engineering gate</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Bundle size rule</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.packageBudgetRule}</p>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Checksum rule</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.checksumRule}</p>
        </section>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <IntegrityMetric label="Ready" value={String(readyCount)} />
        <IntegrityMetric label="Needs proof" value={String(needsProofCount)} />
        <IntegrityMetric label="Blocked" value={String(blockedCount)} />
      </dl>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {plan.lanes.map((lane) => (
          <article key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {lane.owner} / {lane.targetRecord}
                </p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h3>
              </div>
              <StatusPill label={lane.status} tone={statusTone[lane.status]} />
            </div>
            <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">{lane.currentState}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.packageImpact}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <IntegrityList planId={plan.planId} laneId={lane.laneId} title="Required before bundle" items={lane.requiredBeforeBundle} />
              <IntegrityList planId={plan.planId} laneId={lane.laneId} title="Blocked actions" items={lane.blockedActions} />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <IntegrityList planId={plan.planId} laneId="rules" title="Package readiness rules" items={plan.packageReadinessRules} />
        <IntegrityList planId={plan.planId} laneId="blocks" title="Globally blocked actions" items={plan.globallyBlockedActions} />
      </div>
    </Card>
  );
}

function IntegrityMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function IntegrityList({
  planId,
  laneId,
  title,
  items,
}: {
  planId: string;
  laneId: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${planId}-${laneId}-${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
