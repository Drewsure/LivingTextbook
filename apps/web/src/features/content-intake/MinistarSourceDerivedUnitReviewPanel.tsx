import { Card, StatusPill } from "@living-textbook/ui";
import type { SourceDerivedUnitReview } from "@/data/sampleMinistarSourceDerivedUnitReview";

export function MinistarSourceDerivedUnitReviewPanel({ review }: { review: SourceDerivedUnitReview }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source-derived Unit 1 review</p>
          <h3 className="mt-1 text-lg font-bold">{review.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is the first real MiniStar source reading from the supplied curriculum DOCX. It is provenance evidence for
            authoring review, not a replacement for the current demo package and not a student-facing unit.
          </p>
        </div>
        <StatusPill label="Review-only" tone="warning" />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <ReviewFact label="Unit" value={`Level ${review.level} / Module ${review.module} / Unit ${review.unit}`} />
        <ReviewFact label="Source" value={review.sourceReference} />
        <ReviewFact label="Extraction" value={review.extractionMethod} />
        <ReviewFact label="Source size" value={`${review.sourceByteLength.toLocaleString()} bytes`} />
      </dl>

      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Provenance</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{review.sourceLocation}</p>
        <p className="mt-2 break-all font-mono text-xs text-[var(--tenant-muted)]">{review.sourceChecksum}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ReviewList title="Eight extracted source terms" items={review.vocabularyTerms} tone="neutral" />
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[var(--tenant-text)]">Target sentence structures</h4>
            <StatusPill label={`${review.targetSentenceReview.requiredCount} required`} tone="warning" />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{review.targetSentenceReview.note}</p>
          <p className="mt-3 text-sm font-semibold text-[var(--tenant-text)]">No candidate sentences are promoted.</p>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Existing demo comparison</p>
          <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">{review.demoComparison.packageId}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{review.demoComparison.mismatchSummary}</p>
        </section>
        <ReviewList title="Open blockers" items={review.blockers} tone="warning" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--tenant-muted)]">
        <StatusPill label="Draft creation blocked" tone="warning" />
        <StatusPill label="Student payload blocked" tone="warning" />
        <StatusPill label="Promotion blocked" tone="warning" />
      </div>
    </Card>
  );
}

function ReviewFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </section>
  );
}

function ReviewList({ title, items, tone }: { title: string; items: string[]; tone: "neutral" | "warning" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
      </ul>
    </section>
  );
}
