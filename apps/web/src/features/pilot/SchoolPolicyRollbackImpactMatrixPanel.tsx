import { Card, StatusPill } from "@living-textbook/ui";
import type {
  RollbackImpactStatus,
  SchoolPolicyRollbackImpactMatrix,
  SchoolPolicyRollbackImpactRow,
} from "@/data/sampleSchoolPolicyRollbackImpactMatrix";

interface SchoolPolicyRollbackImpactMatrixPanelProps {
  matrix: SchoolPolicyRollbackImpactMatrix;
}

const statusLabel: Record<RollbackImpactStatus, string> = {
  blocked: "Blocked",
  "needs-policy": "Needs policy",
  "future-required": "Future required",
};

const statusTone: Record<RollbackImpactStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "needs-policy": "warning",
  "future-required": "neutral",
};

export function SchoolPolicyRollbackImpactMatrixPanel({ matrix }: SchoolPolicyRollbackImpactMatrixPanelProps) {
  const affectedRecordCount = countUnique(matrix.rows.flatMap((row) => row.affectedRecords));
  const blockedActionCount = countUnique(matrix.rows.flatMap((row) => row.blockedActions));
  const policyGateCount = matrix.rows.filter((row) => row.status !== "future-required").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">School rollback impact matrix</p>
          <h2 className="mt-1 text-lg font-bold">{matrix.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{matrix.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={matrix.statusLabel} tone="warning" />
          <StatusPill label="Review only" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ImpactMetric label="Impact rows" value={String(matrix.rows.length)} tone="neutral" />
        <ImpactMetric label="Affected records" value={String(affectedRecordCount)} tone="neutral" />
        <ImpactMetric label="Blocked actions" value={String(blockedActionCount)} tone="warning" />
        <ImpactMetric label="Policy gates" value={String(policyGateCount)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Source rollback plan</p>
            <p className="mt-2 break-words font-mono text-xs font-semibold text-[var(--tenant-text)]">{matrix.sourcePlanId}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              Impact rows are evidence requirements only. They do not provide a revocation action, rollback button,
              release-state mutation, production QR redirect mutation, learner-data deletion workflow, media
              replacement, AI Tutor entitlement change, or live classroom shutdown workflow.
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">
              No release-state mutation, no production QR redirect mutation, no learner-data deletion workflow, no
              media replacement, and no AI Tutor entitlement change.
            </p>
          </div>
          <StatusPill label="No live workflow" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {matrix.rows.map((row) => (
          <ImpactRowCard key={row.rowId} row={row} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Impact matrix rules</h3>
          <StatusPill label="Rules" tone="warning" />
        </div>
        <ImpactBullets items={matrix.matrixRules} />
      </section>
    </Card>
  );
}

function ImpactRowCard({ row }: { row: SchoolPolicyRollbackImpactRow }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{`${row.scope} / ${row.owner}`}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{row.label}</h3>
        </div>
        <StatusPill label={statusLabel[row.status]} tone={statusTone[row.status]} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <ImpactMiniList title="Affected records" items={row.affectedRecords} tone="neutral" />
        <ImpactMiniList title="Required evidence" items={row.requiredEvidence} tone="neutral" />
        <ImpactMiniList title="Blocked actions" items={row.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function ImpactMetric({
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

function ImpactMiniList({
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
      <ImpactBullets items={items} />
    </section>
  );
}

function ImpactBullets({ items }: { items: string[] }) {
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

function countUnique(items: string[]) {
  return new Set(items).size;
}
