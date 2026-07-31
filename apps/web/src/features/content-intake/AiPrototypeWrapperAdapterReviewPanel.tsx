import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiPrototypeModeWrapperAdapterReview,
  AiPrototypeWrapperAdapterReview,
  AiPrototypeWrapperAdapterReviewStatus,
} from "@/data/sampleAiPrototypeWrapperAdapterReview";

interface AiPrototypeWrapperAdapterReviewPanelProps {
  reviews: AiPrototypeWrapperAdapterReview[];
}

const statusTone: Record<AiPrototypeWrapperAdapterReviewStatus, "neutral" | "warning"> = {
  "not-started": "warning",
  "review-only": "neutral",
  blocked: "warning",
};

const statusLabel: Record<AiPrototypeWrapperAdapterReviewStatus, string> = {
  "not-started": "Not started",
  "review-only": "Review only",
  blocked: "Blocked",
};

export function AiPrototypeWrapperAdapterReviewPanel({ reviews }: AiPrototypeWrapperAdapterReviewPanelProps) {
  const modeReviewCount = reviews.reduce((total, review) => total + review.modeReviews.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype wrapper adapter review</p>
          <h2 className="mt-1 text-lg font-bold">Parent-engine adapter boundary</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review defines whether a returned prototype can become a removable wrapper around an approved parent
            engine. The wrapper may handle local interaction and animation state, but the platform keeps routes, scores,
            audio manifests, mastery, rewards, tenant config, and assignments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${modeReviewCount} mode adapter(s)`} tone="success" />
          <StatusPill label="No event contract bypass" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {reviews.map((review) => (
          <article key={review.reviewId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{review.integrationPlanId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{review.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{review.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={statusLabel[review.status]} tone={statusTone[review.status]} />
                <StatusPill label="No direct app import" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <AdapterList title="Source records" items={review.sourceRecords} />
              <AdapterList title="Adapter boundary" items={review.parentEngineAdapterBoundary} />
              <AdapterList title="Acceptance checks" items={review.wrapperAcceptanceChecks} />
              <AdapterList title="Blocked actions" items={review.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Mode wrapper reviews</h4>
                <StatusPill label={String(review.modeReviews.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {review.modeReviews.map((modeReview) => (
                  <ModeWrapperReviewCard key={`${review.reviewId}-${modeReview.modeId}`} review={modeReview} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeWrapperReviewCard({ review }: { review: AiPrototypeModeWrapperAdapterReview }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{review.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{review.proposedSurface}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{review.adapterEntryPoint}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={review.parentEngine} tone="success" />
          <StatusPill label="Fixture input contract" tone="neutral" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <AdapterList title="Fixture input contract" items={review.fixtureInputContract} />
        <AdapterList title="Standard event output contract" items={review.standardEventOutputContract} />
        <AdapterList title="State ownership" items={review.stateOwnershipRules} />
        <AdapterList title="Wrapper evidence" items={review.wrapperEvidence} />
        <AdapterList title="Rejection triggers" items={review.rejectionTriggers} tone="warning" />
      </div>
    </article>
  );
}

function AdapterList({
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
