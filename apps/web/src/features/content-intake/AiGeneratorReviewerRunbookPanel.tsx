import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratorReviewerRunbookCollectionWarnings,
  validateAiGeneratorReviewerRunbooks,
} from "@living-textbook/content-model/src/aiGeneratorReviewerRunbook";

import type {
  AiGeneratorReviewerRunbook,
  AiGeneratorReviewerRunbookStep,
} from "@/data/sampleAiGeneratorReviewerRunbook";

interface AiGeneratorReviewerRunbookPanelProps {
  runbooks: AiGeneratorReviewerRunbook[];
}

export function AiGeneratorReviewerRunbookPanel({ runbooks }: AiGeneratorReviewerRunbookPanelProps) {
  const guardBlocks = validateAiGeneratorReviewerRunbooks(runbooks);
  const guardWarnings = getAiGeneratorReviewerRunbookCollectionWarnings(runbooks);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generator reviewer runbook</p>
          <h2 className="mt-1 text-lg font-bold">Human review order</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Reviewers get an ordered path through the generator evidence without creating live model calls, app
            patches, packages, routes, playlists, or assignments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Reviewer runbook guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="Review only" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <RunbookList
          title="Reviewer runbook guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared reviewer runbook guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <RunbookList
          title="Reviewer runbook guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared reviewer runbook guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-4">
        {runbooks.map((runbook) => (
          <article key={runbook.runbookId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{runbook.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{runbook.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{runbook.summary}</p>
              </div>
              <StatusPill label={runbook.status} tone="warning" />
            </div>

            <section className="mt-4 rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing rules</h4>
                <StatusPill label={String(runbook.standingRules.length)} tone="warning" />
              </div>
              <ul className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--tenant-muted)]">
                {runbook.standingRules.map((rule) => (
                  <li key={rule} className="rounded-full bg-white px-3 py-1 font-semibold">
                    {rule}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-5">
              {runbook.steps.map((step) => (
                <RunbookStepCard key={step.stepId} step={step} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function RunbookStepCard({ step }: { step: AiGeneratorReviewerRunbookStep }) {
  return (
    <article className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Step {step.order}</p>
          <a
            href={`#${step.sectionId}`}
            className="mt-1 block text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--tenant-primary)]"
          >
            {step.label}
          </a>
        </div>
        <StatusPill label="Gate" tone="neutral" />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{step.objective}</p>
      <dl className="mt-3 grid gap-2 text-sm leading-6">
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Required record</dt>
          <dd className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">{step.requiredRecord}</dd>
        </div>
      </dl>
      <RunbookList title="Evidence to review" items={step.evidenceToReview} />
      <RunbookList title="Blocked shortcuts" items={step.blockedShortcuts} tone="warning" />
    </article>
  );
}

function RunbookList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
