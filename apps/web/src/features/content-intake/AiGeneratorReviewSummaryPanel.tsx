import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratorReviewSummaryCollectionWarnings,
  validateAiGeneratorReviewSummaries,
} from "@living-textbook/content-model/src/aiGeneratorReviewSummary";

import type {
  AiGeneratorReviewSummary,
  AiGeneratorReviewSummarySection,
  AiGeneratorReviewSummaryStatus,
} from "@/data/sampleAiGeneratorReviewSummary";

interface AiGeneratorReviewSummaryPanelProps {
  summaries: AiGeneratorReviewSummary[];
}

const statusTone: Record<AiGeneratorReviewSummaryStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
  missing: "warning",
};

const statusLabel: Record<AiGeneratorReviewSummaryStatus, string> = {
  "review-only": "Review only",
  blocked: "Blocked",
  missing: "Missing",
};

export function AiGeneratorReviewSummaryPanel({ summaries }: AiGeneratorReviewSummaryPanelProps) {
  const guardBlocks = validateAiGeneratorReviewSummaries(summaries);
  const guardWarnings = getAiGeneratorReviewSummaryCollectionWarnings(summaries);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generator review summary</p>
          <h2 className="mt-1 text-lg font-bold">Section readiness rollup</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This rollup keeps the generator route readable by showing what each section can review, what still blocks
            movement, and which record must exist before generated work can advance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review summary guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No live generation" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <SummaryList
          title="Review summary guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared review summary guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <SummaryList
          title="Review summary guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared review summary guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-4">
        {summaries.map((summary) => (
          <article key={summary.summaryId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{summary.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{summary.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                  {summary.currentBoundary}
                </p>
              </div>
              <StatusPill label={statusLabel[summary.status]} tone={statusTone[summary.status]} />
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-5">
              {summary.sections.map((section) => (
                <ReviewSummarySectionCard key={`${summary.summaryId}-${section.sectionId}`} section={section} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ReviewSummarySectionCard({ section }: { section: AiGeneratorReviewSummarySection }) {
  return (
    <article className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex items-start justify-between gap-2">
        <a
          href={`#${section.sectionId}`}
          className="text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--tenant-primary)]"
        >
          {section.label}
        </a>
        <StatusPill label={statusLabel[section.status]} tone={statusTone[section.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{section.summary}</p>

      <dl className="mt-3 grid gap-2 text-sm leading-6">
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Primary blocker</dt>
          <dd className="mt-1 text-[var(--tenant-muted)]">{section.primaryBlocker}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Next required record</dt>
          <dd className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">{section.nextRequiredRecord}</dd>
        </div>
      </dl>

      <div className="mt-3 space-y-3">
        <SummaryList title="Blocked actions" items={section.blockedActions} tone="warning" />
        <SummaryList title="Source records" items={section.sourceRecords} tone="neutral" />
      </div>
    </article>
  );
}

function SummaryList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section>
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
