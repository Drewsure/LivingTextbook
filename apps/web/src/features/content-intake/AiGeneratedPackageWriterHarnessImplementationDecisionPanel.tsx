import { Card, StatusPill } from "@living-textbook/ui";

import type {
  AiGeneratedPackageWriterHarnessDecisionOption,
  AiGeneratedPackageWriterHarnessImplementationDecision,
  AiGeneratedPackageWriterHarnessImplementationDecisionStatus,
} from "@/data/sampleAiGeneratedPackageWriterHarnessImplementationDecision";

interface AiGeneratedPackageWriterHarnessImplementationDecisionPanelProps {
  decisions: AiGeneratedPackageWriterHarnessImplementationDecision[];
}

const statusTone: Record<
  AiGeneratedPackageWriterHarnessImplementationDecisionStatus,
  "neutral" | "warning" | "success"
> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-codex-review": "success",
};

const statusLabel: Record<AiGeneratedPackageWriterHarnessImplementationDecisionStatus, string> = {
  blocked: "Decision blocked",
  "review-only": "Review only",
  "ready-for-codex-review": "Ready for Codex review",
};

export function AiGeneratedPackageWriterHarnessImplementationDecisionPanel({
  decisions,
}: AiGeneratedPackageWriterHarnessImplementationDecisionPanelProps) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer harness implementation decision
          </p>
          <h2 className="mt-1 text-lg font-bold">Codex decision before harness code</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This decision preview keeps package writer harness code blocked until Codex accepts evidence, file scope,
            rollback, storage, route, playlist, local companion, assignment, and support-language boundaries.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="No decision recorded" tone="warning" />
          <StatusPill label="No harness code" tone="warning" />
        </div>
      </div>

      <div className="space-y-3">
        {decisions.map((decision) => (
          <article key={decision.decisionId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {decision.proposalId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{decision.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{decision.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={statusLabel[decision.status]} tone={statusTone[decision.status]} />
                <StatusPill label={decision.decisionState} tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <DecisionList title="Required evidence" items={decision.requiredEvidence} />
              <DecisionList title="File scope rules" items={decision.fileScopeRules} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Reviewer decision options</h4>
                <StatusPill label={String(decision.decisionOptions.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                {decision.decisionOptions.map((option) => (
                  <DecisionOptionCard key={option.optionId} option={option} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <DecisionList title="Blocked actions" items={decision.blockedActions} tone="warning" />
              <DecisionList title="Next required records" items={decision.nextRequiredRecords} />
              <DecisionList title="Support-language boundary" items={decision.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function DecisionOptionCard({ option }: { option: AiGeneratedPackageWriterHarnessDecisionOption }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision option</p>
      <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{option.label}</h5>
      <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{option.effect}</p>
      <div className="mt-3 grid gap-3">
        <DecisionList title="Required before selection" items={option.requiredBeforeSelection} />
        <DecisionList title="Still blocked" items={option.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function DecisionList({
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
