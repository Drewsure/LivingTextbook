import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageWriterTestHarnessPlanCollectionWarnings,
  validateAiGeneratedPackageWriterTestHarnessPlans,
} from "@living-textbook/content-model/src/aiPackageWriterTestHarnessPlan";
import type {
  AiGeneratedPackageWriterTestHarnessAdapter,
  AiGeneratedPackageWriterTestHarnessPhase,
  AiGeneratedPackageWriterTestHarnessPlan,
  AiGeneratedPackageWriterTestHarnessPlanStatus,
} from "@/data/sampleAiGeneratedPackageWriterTestHarnessPlan";

interface AiGeneratedPackageWriterTestHarnessPlanPanelProps {
  plans: AiGeneratedPackageWriterTestHarnessPlan[];
}

const statusTone: Record<AiGeneratedPackageWriterTestHarnessPlanStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

export function AiGeneratedPackageWriterTestHarnessPlanPanel({
  plans,
}: AiGeneratedPackageWriterTestHarnessPlanPanelProps) {
  const phaseCount = plans.reduce((total, plan) => total + plan.harnessPhases.length, 0);
  const guardBlocks = validateAiGeneratedPackageWriterTestHarnessPlans(plans);
  const guardWarnings = getAiGeneratedPackageWriterTestHarnessPlanCollectionWarnings(plans);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer test harness plan
          </p>
          <h2 className="mt-1 text-lg font-bold">Package writer test harness plan</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This gate names future dry-run harness phases and adapters before any writer test runner or mutation
            workflow can exist.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Test harness plan guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="Plan only" tone="neutral" />
          <StatusPill label="Harness implementation blocked" tone="warning" />
          <StatusPill label={`${phaseCount} phase(s)`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <HarnessList
          title="Test harness plan guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared test harness plan guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <HarnessList
          title="Test harness plan guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared test harness plan guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <article key={plan.harnessPlanId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={plan.status} tone={statusTone[plan.status]} />
                <StatusPill label={plan.harnessState} tone="warning" />
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Future dry-run harness phases</h4>
                <StatusPill label={plan.packageIdPreview} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {plan.harnessPhases.map((phase) => (
                  <HarnessPhaseCard key={phase.phaseId} phase={phase} />
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">Environment adapters</h4>
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                {plan.environmentAdapters.map((adapter) => (
                  <HarnessAdapterCard key={adapter.adapterId} adapter={adapter} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <HarnessList title="Required before harness" items={plan.requiredBeforeHarness} />
              <HarnessList title="Blocked harness actions" items={plan.blockedHarnessActions} tone="warning" />
              <HarnessList title="Support-language boundary" items={plan.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function HarnessPhaseCard({ phase }: { phase: AiGeneratedPackageWriterTestHarnessPhase }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Harness phase</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{phase.label}</h5>
          <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{phase.purpose}</p>
        </div>
        <StatusPill label={phase.phaseId} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-3">
        <HarnessList title="Required inputs" items={phase.requiredInputs} />
        <HarnessList title="Planned checks" items={phase.plannedChecks} />
        <HarnessList title="Blocked execution" items={phase.blockedExecution} tone="warning" />
      </div>
    </article>
  );
}

function HarnessAdapterCard({ adapter }: { adapter: AiGeneratedPackageWriterTestHarnessAdapter }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Adapter</p>
      <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{adapter.label}</h5>
      <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{adapter.target}</p>
      <div className="mt-3 grid gap-3">
        <HarnessList title="Command scope" items={adapter.commandScope} />
        <HarnessList title="Blocked adapters" items={adapter.blockedAdapters} tone="warning" />
      </div>
    </article>
  );
}

function HarnessList({
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
