import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeCodexIntegrationDecisionCollectionWarnings,
  validateAiPrototypeCodexIntegrationDecisions,
} from "@living-textbook/content-model/src/aiPrototypeCodexIntegrationDecision";

import type {
  AiPrototypeCodexIntegrationDecision,
  AiPrototypeCodexIntegrationDecisionCheck,
  AiPrototypeCodexIntegrationDecisionCheckStatus,
  AiPrototypeCodexIntegrationDecisionStatus,
} from "@/data/sampleAiPrototypeCodexIntegrationDecision";

interface AiPrototypeCodexIntegrationDecisionPanelProps {
  decisions: AiPrototypeCodexIntegrationDecision[];
}

const decisionTone: Record<AiPrototypeCodexIntegrationDecisionStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-review": "success",
};

const checkTone: Record<AiPrototypeCodexIntegrationDecisionCheckStatus, "neutral" | "warning" | "success"> = {
  missing: "warning",
  blocked: "warning",
  "pending-review": "neutral",
  reviewed: "success",
};

const decisionLabel: Record<AiPrototypeCodexIntegrationDecisionStatus, string> = {
  blocked: "Decision blocked",
  "review-only": "Review only",
  "ready-for-review": "Ready for Codex review",
};

const checkLabel: Record<AiPrototypeCodexIntegrationDecisionCheckStatus, string> = {
  missing: "Missing",
  blocked: "Blocked",
  "pending-review": "Pending review",
  reviewed: "Reviewed",
};

export function AiPrototypeCodexIntegrationDecisionPanel({
  decisions,
}: AiPrototypeCodexIntegrationDecisionPanelProps) {
  const guardBlocks = validateAiPrototypeCodexIntegrationDecisions(decisions);
  const guardWarnings = getAiPrototypeCodexIntegrationDecisionCollectionWarnings(decisions);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Codex integration review decision</p>
          <h2 className="mt-1 text-lg font-bold">Manual decision before app patch</h2>
          <p className="mt-2 max-w-3xl text-sm text-[var(--tenant-muted)]">
            Returned prototypes cannot become app code until Codex records a manual decision after wrapper, fixture,
            event, audio, mobile, scoring, and readiness-gate evidence is reviewed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Codex decision guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No decision recorded" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DecisionList
          title="Codex decision guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared Codex decision guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <DecisionList
          title="Codex decision guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared Codex decision guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {decisions.map((decision) => (
          <div key={decision.decisionId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold">{decision.label}</p>
                <p className="mt-1 text-sm text-[var(--tenant-muted)]">{decision.summary}</p>
              </div>
              <StatusPill label={decisionLabel[decision.status]} tone={decisionTone[decision.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Evidence required before decision</p>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {decision.checks.map((check) => (
                    <DecisionCheckCard key={`${decision.decisionId}-${check.label}`} check={check} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Reviewer decision preview</p>
                  <p className="mt-1 text-sm font-semibold">{decision.selectedDecision}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {decision.decisionOptions.map((option) => (
                      <StatusPill key={option} label={option} tone="neutral" />
                    ))}
                  </div>
                </div>

                <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Required before decision</p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--tenant-muted)]">
                    {decision.requiredBeforeDecision.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Blocked actions</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {decision.blockedActions.map((action) => (
                      <StatusPill key={action} label={action} tone="warning" />
                    ))}
                  </div>
                </div>

                <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Source records</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {decision.sourceRecords.map((record) => (
                      <StatusPill key={record} label={record} tone="neutral" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
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
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
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

function DecisionCheckCard({ check }: { check: AiPrototypeCodexIntegrationDecisionCheck }) {
  return (
    <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">{check.label}</p>
        <StatusPill label={checkLabel[check.status]} tone={checkTone[check.status]} />
      </div>
      <p className="mt-2 text-sm text-[var(--tenant-muted)]">{check.evidence}</p>
      <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">{check.requiredRecord}</p>
    </div>
  );
}
