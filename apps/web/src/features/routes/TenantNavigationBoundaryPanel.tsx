import { Card, StatusPill } from "@living-textbook/ui";
import type { TenantNavigationBoundaryPlan, TenantNavigationBoundaryStatus } from "@/data/sampleTenantNavigationBoundary";

interface TenantNavigationBoundaryPanelProps {
  plan: TenantNavigationBoundaryPlan;
}

const statusTone: Record<TenantNavigationBoundaryStatus, "neutral" | "success" | "warning"> = {
  shared: "success",
  "tenant-scoped": "success",
  "sample-only": "warning",
  "not-created-yet": "neutral",
};

const statusLabel: Record<TenantNavigationBoundaryStatus, string> = {
  shared: "Shared",
  "tenant-scoped": "Tenant scoped",
  "sample-only": "Sample only",
  "not-created-yet": "Not created yet",
};

export function TenantNavigationBoundaryPanel({ plan }: TenantNavigationBoundaryPanelProps) {
  const tenantScopedCount = plan.lanes.filter((lane) => lane.status === "tenant-scoped").length;
  const sampleOnlyCount = plan.lanes.filter((lane) => lane.status === "sample-only").length;
  const notCreatedCount = plan.lanes.filter((lane) => lane.status === "not-created-yet").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">{plan.label}</p>
          <h2 className="mt-1 text-lg font-bold">Tenant navigation boundary</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label="Review shortcut only" tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Boundary rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.reviewRule}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <BoundaryMetric label="Tenant-scoped lanes" value={String(tenantScopedCount)} />
        <BoundaryMetric label="Sample-only lanes" value={String(sampleOnlyCount)} />
        <BoundaryMetric label="MiniStar pending lanes" value={String(notCreatedCount)} />
      </dl>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {plan.lanes.map((lane) => (
          <article key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.scope}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h3>
              </div>
              <StatusPill label={statusLabel[lane.status]} tone={statusTone[lane.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{lane.purpose}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <BoundaryList laneId={lane.laneId} title="Route examples" items={lane.routeExamples} mono />
              <BoundaryList laneId={lane.laneId} title="Required before expansion" items={lane.requiredBeforeExpansion} />
              <BoundaryList laneId={lane.laneId} title="Blocked actions" items={lane.blockedActions} />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <BoundaryList laneId={plan.planId} title="Cross-tenant guardrails" items={plan.guardrails} />
        <BoundaryList laneId={plan.planId} title="Blocked navigation actions" items={plan.blockedActions} />
      </div>
    </Card>
  );
}

function BoundaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function BoundaryList({ laneId, title, items, mono = false }: { laneId: string; title: string; items: string[]; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <ul className={`mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)] ${mono ? "font-mono text-xs" : ""}`}>
        {items.map((item, index) => (
          <li key={`${laneId}-${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
