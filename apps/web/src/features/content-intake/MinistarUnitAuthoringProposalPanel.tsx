import { Card, StatusPill } from "@living-textbook/ui";
import type { MinistarUnitAuthoringProposal } from "@/data/sampleMinistarUnitAuthoringProposal";

export function MinistarUnitAuthoringProposalPanel({ proposal }: { proposal: MinistarUnitAuthoringProposal }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Proposed authoring packet</p>
          <h3 className="mt-1 text-lg font-bold">{proposal.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet turns the extracted terms into two conservative sentence candidates for teacher review. It is not
            source text, not an approved draft, and cannot be assigned to students.
          </p>
        </div>
        <StatusPill label="Proposed / review-only" tone="warning" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[var(--tenant-text)]">Two proposed sentence structures</h4>
            <StatusPill label="2 required" tone="warning" />
          </div>
          <ol className="mt-3 grid gap-2 text-base font-semibold text-[var(--tenant-text)]">
            {proposal.targetSentenceDrafts.map((sentence, index) => (
              <li key={`${proposal.proposalId}-sentence-${index}`} className="rounded-md bg-[var(--tenant-primary-soft)] px-3 py-2">
                <span className="mr-2 text-sm text-[var(--tenant-muted)]">{index + 1}.</span>
                {sentence}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{proposal.sentenceProvenance}</p>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">Requested curated pathway</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {proposal.requestedActivityPath.map((mode) => (
              <StatusPill key={`${proposal.proposalId}-${mode}`} label={mode} tone="neutral" />
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
            These are a review proposal only. They do not create routes, unlock activities, or replace the current rehearsal package.
          </p>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">Open review gates</h4>
          <ul className="mt-3 grid gap-3">
            {proposal.reviewGates.map((gate) => (
              <li key={gate.gateId} className="rounded-md border border-[var(--tenant-border)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--tenant-text)]">{gate.label}</span>
                  <StatusPill label={gate.status} tone={gate.status === "pass" ? "success" : "warning"} />
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{gate.evidence}</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {gate.nextStep}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">Promotion blockers</h4>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {proposal.blockers.map((blocker, index) => (
              <li key={`${proposal.proposalId}-blocker-${index}`}>{blocker}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill label="Student assignment blocked" tone="warning" />
            <StatusPill label="Release package blocked" tone="warning" />
            <StatusPill label="QR printing blocked" tone="warning" />
          </div>
        </section>
      </div>
    </Card>
  );
}
