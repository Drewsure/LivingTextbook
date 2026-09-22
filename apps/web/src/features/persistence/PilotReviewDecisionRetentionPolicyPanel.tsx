import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotReviewDecisionRetentionPolicy } from "@living-textbook/content-model";

interface PilotReviewDecisionRetentionPolicyPanelProps {
  policy: PilotReviewDecisionRetentionPolicy;
  errors: string[];
  warnings: string[];
}

export function PilotReviewDecisionRetentionPolicyPanel({ policy, errors, warnings }: PilotReviewDecisionRetentionPolicyPanelProps) {
  const valid = errors.length === 0;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Retention and audit policy</p>
          <h2 className="mt-1 text-lg font-bold">Provider implementation waits for policy acceptance</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">The policy names retention, deletion, audit, school approval, and hosted/local recovery requirements without enabling a real write path.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={valid ? "Policy shape valid" : "Policy review"} tone={valid ? "success" : "warning"} />
          <StatusPill label={policy.readiness} tone="warning" />
          <StatusPill label={policy.snapshotWriteAllowed ? "Writes open" : "Writes blocked"} tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Snapshot retention" value={`${policy.reviewDecisionSnapshotRetentionDays} days`} />
        <Fact label="Audit retention" value={`${policy.auditTrailRetentionDays} days`} />
        <Fact label="Deletion" value={policy.deletionRequired ? "Required" : "Needs review"} />
        <Fact label="Policy owner" value="School or tenant administrator" />
      </dl>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Required evidence" values={policy.requiredEvidence} />
        <List title="Blocked actions" values={policy.blockedActions} />
        <List title="Next steps" values={policy.nextSteps} />
      </div>

      {warnings.length > 0 && <List title="Policy warnings" values={warnings} tone="warning" />}
      {errors.length > 0 && <List title="Policy errors" values={errors} tone="warning" />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-2 text-sm font-bold">{value}</p></section>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`mt-5 rounded-lg border border-[var(--tenant-border)] p-4 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h3 className="text-sm font-bold">{title}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
