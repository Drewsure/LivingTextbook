import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypePatchHarnessImplementationProposalCollectionWarnings,
  validateAiPrototypePatchHarnessImplementationProposals,
} from "@living-textbook/content-model/src/aiPrototypePatchHarnessImplementationProposal";

import type {
  AiPrototypePatchHarnessImplementationProposal,
  AiPrototypePatchHarnessImplementationProposalStatus,
} from "@/data/sampleAiPrototypePatchHarnessImplementationProposal";

interface AiPrototypePatchHarnessImplementationProposalPanelProps {
  proposals: AiPrototypePatchHarnessImplementationProposal[];
}

const statusTone: Record<AiPrototypePatchHarnessImplementationProposalStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-implementation-review": "success",
};

const statusLabel: Record<AiPrototypePatchHarnessImplementationProposalStatus, string> = {
  blocked: "Implementation blocked",
  "review-only": "Review only",
  "ready-for-implementation-review": "Ready for implementation review",
};

export function AiPrototypePatchHarnessImplementationProposalPanel({
  proposals,
}: AiPrototypePatchHarnessImplementationProposalPanelProps) {
  const guardBlocks = validateAiPrototypePatchHarnessImplementationProposals(proposals);
  const guardWarnings = getAiPrototypePatchHarnessImplementationProposalCollectionWarnings(proposals);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI prototype patch harness implementation proposal
          </p>
          <h2 className="mt-1 text-lg font-bold">Implementation scope before code</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This proposal names future harness file scope and review gates without creating files, invoking test
            runners, or changing app behavior.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Harness implementation proposal guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No code generation" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListPanel
          title="Harness implementation proposal guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared harness implementation proposal guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ListPanel
          title="Harness implementation proposal guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared harness implementation proposal guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {proposals.map((proposal) => (
          <article key={proposal.proposalId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{proposal.harnessPlanId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{proposal.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{proposal.summary}</p>
              </div>
              <StatusPill label={statusLabel[proposal.status]} tone={statusTone[proposal.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ListPanel title="Proposed file scope" items={proposal.proposedFileScope} />
              <ListPanel title="Implementation boundaries" items={proposal.implementationBoundaries} tone="warning" />
              <ListPanel title="Required review gates" items={proposal.requiredReviewGates} />
              <ListPanel title="Dry-run-only checks" items={proposal.dryRunOnlyChecks} />
              <ListPanel title="Next required records" items={proposal.nextRequiredRecords} />
              <ListPanel title="Blocked actions" items={proposal.blockedActions} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
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
