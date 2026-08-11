import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGamificationMappingPlanWarnings,
  validateAiGamificationMappingPlan,
} from "@living-textbook/content-model/src/aiGamificationMapping";
import type { AiGamificationMappingPlan, AiGamificationMappingStatus } from "@/data/sampleAiGamificationMappingPlan";

interface AiGamificationMappingPanelProps {
  plans: AiGamificationMappingPlan[];
}

const statusTone: Record<AiGamificationMappingStatus, "neutral" | "success" | "warning"> = {
  "draft-only": "neutral",
  blocked: "warning",
  "ready-for-review": "success",
};

export function AiGamificationMappingPanel({ plans }: AiGamificationMappingPanelProps) {
  const planValidation = plans.map((plan) => ({
    plan,
    errors: validateAiGamificationMappingPlan(plan),
    warnings: getAiGamificationMappingPlanWarnings(plan),
  }));
  const blockedActionCount = plans.reduce((total, plan) => total + plan.blockedActions.length, 0);
  const validationBlockCount = planValidation.reduce((total, item) => total + item.errors.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI gamification mapping preview</p>
          <h2 className="mt-1 text-lg font-bold">Deterministic reward plan</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Generated activity drafts must map standard game events to transparent scoring, mastery thresholds, and earned
            collection unlocks before they can move toward student use.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Gamification guard active" tone="success" />
          <StatusPill
            label={`${validationBlockCount} guard block(s)`}
            tone={validationBlockCount > 0 ? "warning" : "success"}
          />
          <StatusPill label="Mastery unlocks only" tone="success" />
          <StatusPill label="No random rewards" tone="success" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {planValidation.map(({ plan, errors, warnings }) => (
          <article key={plan.mappingId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
              </div>
              <StatusPill label={plan.rewardCurrency} tone="neutral" />
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <GamificationMetric label="Unit maximum" value={`${plan.unitMaxStarDust} ${plan.rewardCurrency}`} />
              <GamificationMetric label="Unit mastery threshold" value={`${plan.unitMasteryThreshold} ${plan.rewardCurrency}`} />
              <GamificationMetric label="Module mastery threshold" value={`${plan.moduleMasteryThreshold} ${plan.rewardCurrency}`} />
            </dl>

            <div className="mt-4 grid gap-3">
              <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[var(--tenant-text)]">Star Dust allocation</h4>
                  <StatusPill label={`${plan.scoringLanes.length} lane(s)`} tone="neutral" />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-3">
                  {plan.scoringLanes.map((lane) => (
                    <ScoringLaneCard key={lane.laneId} lane={lane} rewardCurrency={plan.rewardCurrency} />
                  ))}
                </div>
              </section>

              <div className="grid gap-3 lg:grid-cols-3">
                <GamificationList
                  title="Collection unlock bindings"
                  items={plan.rewardBindings.map((binding) => `${binding.label}: ${binding.deterministicRule}`)}
                  tone="success"
                />
                <GamificationList title="Required gamification records" items={plan.requiredRecords} />
                <GamificationList title="Blocked gamification actions" items={plan.blockedActions} tone="warning" />
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <GamificationList
                  title="Gamification guard blocks"
                  items={errors}
                  tone={errors.length > 0 ? "warning" : "neutral"}
                  emptyLabel="Reward map has no structural blockers."
                />
                <GamificationList
                  title="Gamification guard warnings"
                  items={warnings}
                  tone={warnings.length > 0 ? "warning" : "neutral"}
                  emptyLabel="Reward map has no review warnings."
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ScoringLaneCard({
  lane,
  rewardCurrency,
}: {
  lane: AiGamificationMappingPlan["scoringLanes"][number];
  rewardCurrency: string;
}) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {lane.maxStarDust} {rewardCurrency}
          </p>
        </div>
        <StatusPill label={lane.status} tone={statusTone[lane.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{lane.progressTrigger}</p>
      <p className="mt-3 text-xs font-semibold uppercase text-[var(--tenant-muted)]">Accepted events</p>
      <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
        {lane.acceptedEvents.map((event) => (
          <li key={event}>{event}</li>
        ))}
      </ul>
    </article>
  );
}

function GamificationMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function GamificationList({
  title,
  items,
  tone = "neutral",
  emptyLabel = "No items.",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "success" | "warning";
  emptyLabel?: string;
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.length === 0 ? <li>{emptyLabel}</li> : items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
