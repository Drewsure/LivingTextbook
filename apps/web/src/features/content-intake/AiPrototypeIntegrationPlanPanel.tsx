import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiPrototypeIntegrationPlan,
  AiPrototypeIntegrationPlanStatus,
  AiPrototypeModeIntegrationPlan,
} from "@/data/sampleAiPrototypeIntegrationPlan";

interface AiPrototypeIntegrationPlanPanelProps {
  plans: AiPrototypeIntegrationPlan[];
}

const statusTone: Record<AiPrototypeIntegrationPlanStatus, "neutral" | "warning"> = {
  "needs-return-review": "warning",
  "wrapper-review-only": "neutral",
  blocked: "warning",
};

const statusLabel: Record<AiPrototypeIntegrationPlanStatus, string> = {
  "needs-return-review": "Needs return review",
  "wrapper-review-only": "Wrapper review only",
  blocked: "Blocked",
};

export function AiPrototypeIntegrationPlanPanel({ plans }: AiPrototypeIntegrationPlanPanelProps) {
  const modePlanCount = plans.reduce((total, plan) => total + plan.modePlans.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype integration plan</p>
          <h2 className="mt-1 text-lg font-bold">Wrapper-first integration path</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This plan shows what must happen after a prototype return review and before any returned game work can touch
            app routes. The default path is quarantine, wrapper adapter, replay tests, audio and scoring checks, mobile
            review, and a Codex integration decision.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${modePlanCount} mode plan(s)`} tone="success" />
          <StatusPill label="No direct import" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <article key={plan.planId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.returnReviewId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={statusLabel[plan.status]} tone={statusTone[plan.status]} />
                <StatusPill label="Codex review required" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-5">
              <PlanList title="Source records" items={plan.sourceRecords} />
              <PlanList title="Integration lanes" items={plan.integrationLanes} />
              <PlanList title="Test harness" items={plan.testHarnessRequirements} />
              <PlanList title="Next records" items={plan.nextReviewRecords} />
              <PlanList title="Blocked actions" items={plan.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Mode integration plans</h4>
                <StatusPill label={String(plan.modePlans.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {plan.modePlans.map((modePlan) => (
                  <ModeIntegrationPlanCard key={`${plan.planId}-${modePlan.modeId}`} plan={modePlan} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeIntegrationPlanCard({ plan }: { plan: AiPrototypeModeIntegrationPlan }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{plan.proposedSurface}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{plan.adapterBoundary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={plan.parentEngine} tone="success" />
          <StatusPill label="Fixture-driven" tone="neutral" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <PlanList title="Integration sequence" items={plan.integrationSequence} />
        <PlanList title="Required tests" items={plan.requiredTests} />
        <PlanList title="Acceptance evidence" items={plan.acceptanceEvidence} />
        <PlanList title="Blocked shortcuts" items={plan.blockedShortcuts} tone="warning" />
      </div>
    </article>
  );
}

function PlanList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
