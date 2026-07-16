import { Card, StatusPill } from "@living-textbook/ui";
import type {
  SchoolPolicyRevocationRollbackPlan,
  SchoolPolicyRollbackLane,
  SchoolPolicyRollbackLaneStatus,
} from "@/data/sampleSchoolPolicyRevocationRollbackPlan";

interface SchoolPolicyRevocationRollbackPanelProps {
  plan: SchoolPolicyRevocationRollbackPlan;
}

const statusLabel: Record<SchoolPolicyRollbackLaneStatus, string> = {
  blocked: "Blocked",
  "needs-policy": "Needs policy",
  "future-required": "Future required",
};

const statusTone: Record<SchoolPolicyRollbackLaneStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "needs-policy": "warning",
  "future-required": "neutral",
};

export function SchoolPolicyRevocationRollbackPanel({ plan }: SchoolPolicyRevocationRollbackPanelProps) {
  const blockedLaneCount = plan.lanes.filter((lane) => lane.status !== "future-required").length;
  const blockedEffectCount = plan.lanes.reduce((count, lane) => count + lane.blockedEffects.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">School policy revocation and rollback preview</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={plan.statusLabel} tone="warning" />
          <StatusPill label="Review only" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RollbackMetric label="Rollback lanes" value={String(plan.lanes.length)} tone="neutral" />
        <RollbackMetric label="Blocked lanes" value={String(blockedLaneCount)} tone="warning" />
        <RollbackMetric label="Blocked effects" value={String(blockedEffectCount)} tone="warning" />
        <RollbackMetric label="Minimum fields" value={String(plan.minimumRollbackRecordFields.length)} tone="neutral" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Rollback and revocation rules are visible for school review only. This preview cannot revoke consent,
              mutate release state, redirect production QR codes, delete learner data, or deactivate local packages.
            </p>
          </div>
          <StatusPill label="No rollback action" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {plan.lanes.map((lane) => (
          <RollbackLaneCard key={lane.laneId} lane={lane} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <RollbackList title="Minimum rollback record fields" items={plan.minimumRollbackRecordFields} badge={String(plan.minimumRollbackRecordFields.length)} />
        <RollbackList title="Blocked actions" items={plan.blockedActions} badge="Blocked" />
        <RollbackList title="Review rules" items={plan.reviewRules} badge="Rules" />
      </div>
    </Card>
  );
}

function RollbackLaneCard({ lane }: { lane: SchoolPolicyRollbackLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.owner}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.trigger}</p>
        </div>
        <StatusPill label={statusLabel[lane.status]} tone={statusTone[lane.status]} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <RollbackMiniList title="Required policy" items={lane.requiredPolicy} tone="neutral" />
        <RollbackMiniList title="Blocked effects" items={lane.blockedEffects} tone="warning" />
      </div>
    </article>
  );
}

function RollbackMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function RollbackMiniList({
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
      <RollbackBullets items={items} />
    </section>
  );
}

function RollbackList({ title, items, badge }: { title: string; items: string[]; badge: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={badge} tone="warning" />
      </div>
      <RollbackBullets items={items} />
    </section>
  );
}

function RollbackBullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
      {items.map((item) => (
        <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">
          {item}
        </li>
      ))}
    </ul>
  );
}
