import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeCodexPatchApprovalDecisionCollectionWarnings,
  validateAiPrototypeCodexPatchApprovalDecisions,
} from "@living-textbook/content-model/src/aiPrototypeCodexPatchApprovalDecision";

import type {
  AiPrototypeCodexPatchApprovalDecision,
  AiPrototypeCodexPatchApprovalDecisionCheck,
  AiPrototypeCodexPatchApprovalDecisionCheckStatus,
  AiPrototypeCodexPatchApprovalDecisionStatus,
} from "@/data/sampleAiPrototypeCodexPatchApprovalDecision";

interface AiPrototypeCodexPatchApprovalDecisionPanelProps {
  decisions: AiPrototypeCodexPatchApprovalDecision[];
}

const decisionTone: Record<AiPrototypeCodexPatchApprovalDecisionStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-codex-approval-review": "success",
};

const checkTone: Record<AiPrototypeCodexPatchApprovalDecisionCheckStatus, "neutral" | "warning" | "success"> = {
  missing: "warning",
  blocked: "warning",
  "pending-review": "neutral",
  reviewed: "success",
};

const decisionLabel: Record<AiPrototypeCodexPatchApprovalDecisionStatus, string> = {
  blocked: "Patch approval blocked",
  "review-only": "Review only",
  "ready-for-codex-approval-review": "Ready for Codex approval review",
};

const checkLabel: Record<AiPrototypeCodexPatchApprovalDecisionCheckStatus, string> = {
  missing: "Missing",
  blocked: "Blocked",
  "pending-review": "Pending review",
  reviewed: "Reviewed",
};

export function AiPrototypeCodexPatchApprovalDecisionPanel({
  decisions,
}: AiPrototypeCodexPatchApprovalDecisionPanelProps) {
  const guardBlocks = validateAiPrototypeCodexPatchApprovalDecisions(decisions);
  const guardWarnings = getAiPrototypeCodexPatchApprovalDecisionCollectionWarnings(decisions);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI prototype Codex patch approval decision
          </p>
          <h2 className="mt-1 text-lg font-bold">Codex approval before patch work</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview separates evidence review from actual patch approval. It records no approval, writes no app
            files, and keeps routes, scoring, rewards, audio manifests, packages, and assignments unchanged.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Codex patch approval decision guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No patch approval recorded" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListPanel
          title="Codex patch approval decision guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared Codex patch approval decision guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ListPanel
          title="Codex patch approval decision guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared Codex patch approval decision guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {decisions.map((decision) => (
          <article key={decision.decisionId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{decision.proposalId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{decision.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{decision.summary}</p>
              </div>
              <StatusPill label={decisionLabel[decision.status]} tone={decisionTone[decision.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Approval evidence checks</p>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {decision.checks.map((check) => (
                    <DecisionCheckCard key={`${decision.decisionId}-${check.label}`} check={check} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <ListPanel title="Decision options" items={decision.decisionOptions} />
                <ListPanel title="Required before decision" items={decision.requiredBeforeDecision} />
                <ListPanel title="Next required records" items={decision.nextRequiredRecords} />
                <ListPanel title="Blocked actions" items={decision.blockedActions} tone="warning" />
                <ListPanel title="Source records" items={decision.sourceRecords} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function DecisionCheckCard({ check }: { check: AiPrototypeCodexPatchApprovalDecisionCheck }) {
  return (
    <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">{check.label}</p>
        <StatusPill label={checkLabel[check.status]} tone={checkTone[check.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.evidenceNeeded}</p>
      <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">{check.requiredRecord}</p>
    </section>
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
