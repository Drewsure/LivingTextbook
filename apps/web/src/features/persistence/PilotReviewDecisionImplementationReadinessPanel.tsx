import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotReviewDecisionImplementationReadiness } from "@living-textbook/content-model";

interface PilotReviewDecisionImplementationReadinessPanelProps {
  readiness: PilotReviewDecisionImplementationReadiness;
  errors: string[];
}

export function PilotReviewDecisionImplementationReadinessPanel({ readiness, errors }: PilotReviewDecisionImplementationReadinessPanelProps) {
  const valid = errors.length === 0;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Provider implementation handoff</p>
          <h2 className="mt-1 text-lg font-bold">Persistence evidence is complete enough to plan, not to activate</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This reconciles snapshot, adapter, retention, audit, and school-policy evidence into one provider-neutral handoff. The current sample remains blocked.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={valid ? "Handoff shape valid" : "Handoff review"} tone={valid ? "success" : "warning"} />
          <StatusPill label={readiness.status} tone="warning" />
          <StatusPill label={readiness.providerNeutral ? "Provider-neutral" : "Provider-bound"} tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={readiness.tenantId} />
        <Fact label="Package" value={readiness.packageId} />
        <Fact label="Storage preflight" value={readiness.storageSelectionPreflightId} />
        <Fact label="Storage gate" value={readiness.storageSelectionGateId} />
        <Fact label="Storage selection" value={readiness.storageSelectionAllowed ? "Allowed" : "Blocked"} />
        <Fact label="Provider selection" value={readiness.providerSelectionAllowed ? "Allowed" : "Blocked"} />
        <Fact label="Implementation" value={readiness.implementationAllowed ? "Allowed" : "Blocked"} />
      </dl>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Required evidence" values={readiness.requiredEvidence} />
        <List title="Blocked actions" values={readiness.blockedActions} tone="warning" />
        <List title="Next steps" values={readiness.nextSteps} />
      </div>

      {errors.length > 0 && <List title="Handoff errors" values={errors} tone="warning" />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-2 break-words text-sm font-bold">{value}</p></section>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`mt-5 rounded-lg border border-[var(--tenant-border)] p-4 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h3 className="text-sm font-bold">{title}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
