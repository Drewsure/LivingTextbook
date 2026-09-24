import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotReviewDecision } from "@/data/samplePilotReviewDecision";

interface PilotReviewDecisionPanelProps {
  decision: PilotReviewDecision;
  validationErrors: string[];
}

export function PilotReviewDecisionPanel({ decision, validationErrors }: PilotReviewDecisionPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Canonical teacher review decision</p>
          <h2 className="mt-1 text-xl font-bold">Demo allowed, pilot launch blocked</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            One review-only decision reconciles the pilot handoff, evidence handoff, approval ledger, release-control, persistence, report, and activation boundaries. It gives teachers and partners a clear answer without creating a live action.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Demo allowed" tone="success" />
          <StatusPill label="Pilot blocked" tone="warning" />
          <StatusPill label="No live action" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DecisionMetric label="Blocking reasons" value={String(decision.blockingReasons.length)} tone="warning" />
        <DecisionMetric label="Next steps" value={String(decision.requiredNextSteps.length)} tone="warning" />
        <DecisionMetric label="Evidence bindings" value={String(decision.evidenceBindings.length)} tone="success" />
        <DecisionMetric label="Student data" value={decision.studentDataCollectionAllowed ? "Allowed" : "Blocked"} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision identity</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{decision.decisionId}</h3>
          </div>
          <StatusPill label={validationErrors.length === 0 ? "Contract valid" : `${validationErrors.length} finding(s)`} tone={validationErrors.length === 0 ? "success" : "warning"} />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DecisionFact label="Tenant" value={decision.tenantId} />
          <DecisionFact label="Package" value={decision.packageId} />
          <DecisionFact label="Pilot launch" value="Blocked" />
          <DecisionFact label="Promotion" value="Blocked" />
        </dl>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Storage policy carried into pilot decision</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Provider selection remains blocked</h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
              The canonical decision preserves the exact provider-neutral storage review identities. It does not choose, activate, or authorize a storage provider.
            </p>
          </div>
          <StatusPill label="Storage selection blocked" tone="warning" />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DecisionFact label="Storage preflight" value={decision.storageSelectionPreflightId} />
          <DecisionFact label="Storage gate" value={decision.storageSelectionGateId} />
          <DecisionFact label="Selection status" value={decision.storageSelectionStatus} />
          <DecisionFact label="Provider allowed" value={decision.storageSelectionAllowed ? "Allowed" : "Blocked"} />
        </dl>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <DecisionList title="Blocking reasons" items={decision.blockingReasons} tone="warning" />
        <DecisionList title="Required next steps" items={decision.requiredNextSteps} tone="neutral" />
      </div>

      {validationErrors.length > 0 ? <DecisionList title="Contract findings" items={validationErrors} tone="warning" /> : null}
    </Card>
  );
}

function DecisionMetric({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "neutral" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 flex items-center justify-between gap-2 text-sm font-bold text-[var(--tenant-text)]">
        {value}
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </p>
    </section>
  );
}

function DecisionFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function DecisionList({ title, items, tone }: { title: string; items: string[]; tone: "success" | "warning" | "neutral" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">{item}</li>)}
      </ul>
    </section>
  );
}
