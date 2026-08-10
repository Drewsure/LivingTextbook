import { Card, StatusPill } from "@living-textbook/ui";

import type {
  AiGeneratedPackageWriterTestHarnessImplementationProposal,
  AiGeneratedPackageWriterTestHarnessImplementationProposalStatus,
} from "@/data/sampleAiGeneratedPackageWriterTestHarnessImplementationProposal";

interface AiGeneratedPackageWriterTestHarnessImplementationProposalPanelProps {
  proposals: AiGeneratedPackageWriterTestHarnessImplementationProposal[];
}

const statusTone: Record<
  AiGeneratedPackageWriterTestHarnessImplementationProposalStatus,
  "neutral" | "warning" | "success"
> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-implementation-review": "success",
};

const statusLabel: Record<AiGeneratedPackageWriterTestHarnessImplementationProposalStatus, string> = {
  blocked: "Implementation blocked",
  "review-only": "Review only",
  "ready-for-implementation-review": "Ready for implementation review",
};

export function AiGeneratedPackageWriterTestHarnessImplementationProposalPanel({
  proposals,
}: AiGeneratedPackageWriterTestHarnessImplementationProposalPanelProps) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer test harness implementation proposal
          </p>
          <h2 className="mt-1 text-lg font-bold">Harness implementation scope before code</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This proposal names future harness module scope and review gates without creating files, invoking test
            runners, mutating routes, writing playlists, packaging local bundles, or activating assignments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="No harness code" tone="warning" />
          <StatusPill label="No runner" tone="warning" />
        </div>
      </div>

      <div className="space-y-3">
        {proposals.map((proposal) => (
          <article key={proposal.proposalId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {proposal.harnessPlanId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{proposal.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{proposal.summary}</p>
              </div>
              <StatusPill label={statusLabel[proposal.status]} tone={statusTone[proposal.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ProposalList title="Proposed module scope" items={proposal.proposedModuleScope} />
              <ProposalList title="Implementation boundaries" items={proposal.implementationBoundaries} tone="warning" />
              <ProposalList title="Required review gates" items={proposal.requiredReviewGates} />
              <ProposalList title="Dry-run-only checks" items={proposal.dryRunOnlyChecks} />
              <ProposalList title="Next required records" items={proposal.nextRequiredRecords} />
              <ProposalList title="Blocked actions" items={proposal.blockedActions} tone="warning" />
              <ProposalList title="Support-language boundary" items={proposal.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ProposalList({
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
