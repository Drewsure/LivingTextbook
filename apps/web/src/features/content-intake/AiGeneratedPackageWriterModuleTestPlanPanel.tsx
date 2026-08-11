import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageWriterModuleTestPlanCollectionWarnings,
  validateAiGeneratedPackageWriterModuleTestPlans,
} from "@living-textbook/content-model/src/aiPackageWriterModuleTestPlan";
import type {
  AiGeneratedPackageWriterModuleTestPlan,
  AiGeneratedPackageWriterModuleTestPlanStatus,
  AiGeneratedPackageWriterModuleTestSuite,
} from "@/data/sampleAiGeneratedPackageWriterModuleTestPlan";

interface AiGeneratedPackageWriterModuleTestPlanPanelProps {
  plans: AiGeneratedPackageWriterModuleTestPlan[];
}

const statusTone: Record<AiGeneratedPackageWriterModuleTestPlanStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

export function AiGeneratedPackageWriterModuleTestPlanPanel({
  plans,
}: AiGeneratedPackageWriterModuleTestPlanPanelProps) {
  const suiteCount = plans.reduce((total, plan) => total + plan.moduleTestSuites.length, 0);
  const guardBlocks = validateAiGeneratedPackageWriterModuleTestPlans(plans);
  const guardWarnings = getAiGeneratedPackageWriterModuleTestPlanCollectionWarnings(plans);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer module test plan
          </p>
          <h2 className="mt-1 text-lg font-bold">Package writer module test plan</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This gate defines the fixture, route, audio, local export, rollback, and support-language assertions needed
            before package writer tests or writer implementation can exist.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Module test plan guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="Test execution blocked" tone="warning" />
          <StatusPill label={`${suiteCount} suite(s)`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <TestPlanList
          title="Module test plan guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared module test plan guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <TestPlanList
          title="Module test plan guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared module test plan guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <article key={plan.testPlanId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={plan.status} tone={statusTone[plan.status]} />
                <StatusPill label={plan.testPlanState} tone="warning" />
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Module test suites</h4>
                <StatusPill label={plan.packageIdPreview} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {plan.moduleTestSuites.map((suite) => (
                  <ModuleTestSuiteCard key={suite.suiteId} suite={suite} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <TestPlanList title="Required evidence" items={plan.requiredEvidence} />
              <TestPlanList title="Next required records" items={plan.nextRequiredRecords} />
              <TestPlanList title="Blocked test actions" items={plan.blockedTestActions} tone="warning" />
              <TestPlanList title="Support-language boundary" items={plan.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModuleTestSuiteCard({ suite }: { suite: AiGeneratedPackageWriterModuleTestSuite }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Module suite</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{suite.label}</h5>
          <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{suite.moduleId}</p>
        </div>
        <StatusPill label={suite.suiteId} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-3">
        <TestPlanList title="Required fixtures" items={suite.requiredFixtures} />
        <TestPlanList title="Required assertions" items={suite.requiredAssertions} />
        <TestPlanList title="Blocked execution" items={suite.blockedExecution} tone="warning" />
      </div>
    </article>
  );
}

function TestPlanList({
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
