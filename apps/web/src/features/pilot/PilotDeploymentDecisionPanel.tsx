import { Card, StatusPill } from "@living-textbook/ui";
import type { DeploymentDecisionGuide } from "@/data/sampleDeploymentDecisionGuide";
import type { PilotDeploymentDecision } from "@living-textbook/content-model";

interface PilotDeploymentDecisionPanelProps {
  decision: PilotDeploymentDecision;
  guide: DeploymentDecisionGuide;
  validationErrors: string[];
}

export function PilotDeploymentDecisionPanel({ decision, guide, validationErrors }: PilotDeploymentDecisionPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot deployment decision record</p>
          <h2 className="mt-1 text-xl font-bold">Choose the pilot posture before enabling storage</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This tenant- and package-bound record turns the deployment comparison into an explicit human decision. It recommends the lowest-cost hosted route, but no option is selected or activated from this review surface.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Selection required" tone="warning" />
          <StatusPill label="Review-only" tone="neutral" />
          <StatusPill label="No activation" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DecisionFact label="Tenant" value={decision.tenantId} />
        <DecisionFact label="Package" value={decision.packageId} />
        <DecisionFact label="Recommendation" value={labelForOption(guide, decision.recommendedOptionId)} />
        <DecisionFact label="Selected" value={decision.selectedOptionId ? labelForOption(guide, decision.selectedOptionId) : "Not selected"} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {guide.options.map((option) => (
          <section key={option.optionId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[var(--tenant-text)]">{option.label}</h3>
              <StatusPill label={option.status} tone={option.optionId === decision.recommendedOptionId ? "success" : "neutral"} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{option.commercialFit}</p>
            <p className="mt-3 text-xs font-semibold uppercase text-[var(--tenant-muted)]">Cost profile</p>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{option.costProfile}</p>
          </section>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <DecisionList title="Open blockers" items={decision.blockers} tone="warning" />
        <DecisionList title="Bound evidence" items={decision.evidenceBindings} tone="neutral" />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
        <p><strong className="text-[var(--tenant-text)]">Guard:</strong> choosing a deployment model later will not authorize persistence, package promotion, QR mutation, report export, or classroom launch.</p>
        <p className="mt-2"><strong className="text-[var(--tenant-text)]">Current effects:</strong> policy accepted: no; persistence activation: no; classroom launch: no; side effect: none.</p>
      </div>

      {validationErrors.length > 0 ? <DecisionList title="Contract findings" items={validationErrors} tone="warning" /> : null}
    </Card>
  );
}

function labelForOption(guide: DeploymentDecisionGuide, optionId: string): string {
  return guide.options.find((option) => option.optionId === optionId)?.label ?? optionId;
}

function DecisionFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function DecisionList({ title, items, tone }: { title: string; items: string[]; tone: "warning" | "neutral" }) {
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
