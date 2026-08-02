import { Card, StatusPill } from "@living-textbook/ui";

import type {
  AiPrototypePatchHarnessSection,
  AiPrototypePatchHarnessSectionStatus,
  AiPrototypePatchTestHarnessPlan,
  AiPrototypePatchTestHarnessPlanStatus,
} from "@/data/sampleAiPrototypePatchTestHarnessPlan";

interface AiPrototypePatchTestHarnessPlanPanelProps {
  plans: AiPrototypePatchTestHarnessPlan[];
}

const statusTone: Record<AiPrototypePatchTestHarnessPlanStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-harness-design": "success",
};

const statusLabel: Record<AiPrototypePatchTestHarnessPlanStatus, string> = {
  blocked: "Harness blocked",
  "review-only": "Review only",
  "ready-for-harness-design": "Ready for harness design",
};

const sectionTone: Record<AiPrototypePatchHarnessSectionStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "needs-record": "warning",
  planned: "success",
};

const sectionLabel: Record<AiPrototypePatchHarnessSectionStatus, string> = {
  blocked: "Blocked",
  "needs-record": "Needs record",
  planned: "Planned",
};

export function AiPrototypePatchTestHarnessPlanPanel({ plans }: AiPrototypePatchTestHarnessPlanPanelProps) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype patch test harness plan</p>
          <h2 className="mt-1 text-lg font-bold">Harness design before tests</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The future harness is planned as a review artifact first. It names coverage lanes and blocked actions
            without running tests, writing files, or changing routes.
          </p>
        </div>
        <StatusPill label="No runnable harness" tone="warning" />
      </div>

      <div className="space-y-3">
        {plans.map((plan) => (
          <article key={plan.planId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.readinessGateId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
              </div>
              <StatusPill label={statusLabel[plan.status]} tone={statusTone[plan.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <ListPanel title="Runtime policy" items={plan.runtimePolicy} tone="warning" />
              <ListPanel title="Required inputs" items={plan.requiredInputs} />
              <ListPanel title="Non-execution outputs" items={plan.nonExecutionOutputs} />
            </div>

            <section className="mt-4 rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Harness sections</p>
                <StatusPill label={String(plan.harnessSections.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {plan.harnessSections.map((section) => (
                  <HarnessSectionCard key={`${plan.planId}-${section.sectionId}`} section={section} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ListPanel title="Next required records" items={plan.nextRequiredRecords} />
              <ListPanel title="Blocked actions" items={plan.blockedActions} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function HarnessSectionCard({ section }: { section: AiPrototypePatchHarnessSection }) {
  return (
    <article className="rounded-md border border-[var(--tenant-border)] bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{section.requiredInput}</p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{section.label}</h4>
        </div>
        <StatusPill label={sectionLabel[section.status]} tone={sectionTone[section.status]} />
      </div>
      <ListPanel title="Planned checks" items={section.plannedChecks} />
      <ListPanel title="Blocked" items={section.blockedActions} tone="warning" />
    </article>
  );
}

function ListPanel({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
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
