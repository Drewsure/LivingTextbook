import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeReturnReviewPacketCollectionWarnings,
  validateAiPrototypeReturnReviewPackets,
} from "@living-textbook/content-model/src/aiPrototypeReturnReview";
import type {
  AiPrototypeModeReturnReview,
  AiPrototypeReturnReviewPacket,
  AiPrototypeReturnReviewStatus,
} from "@/data/sampleAiPrototypeReturnReview";

interface AiPrototypeReturnReviewPanelProps {
  packets: AiPrototypeReturnReviewPacket[];
}

const statusTone: Record<AiPrototypeReturnReviewStatus, "neutral" | "warning"> = {
  "not-submitted": "warning",
  "returned-review-only": "neutral",
  blocked: "warning",
};

const statusLabel: Record<AiPrototypeReturnReviewStatus, string> = {
  "not-submitted": "Not submitted",
  "returned-review-only": "Review only",
  blocked: "Blocked",
};

export function AiPrototypeReturnReviewPanel({ packets }: AiPrototypeReturnReviewPanelProps) {
  const guardBlocks = validateAiPrototypeReturnReviewPackets(packets);
  const guardWarnings = getAiPrototypeReturnReviewPacketCollectionWarnings(packets);
  const modeReviewCount = packets.reduce((total, packet) => total + packet.modeReviews.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype return review</p>
          <h2 className="mt-1 text-lg font-bold">Returned prototype intake gate</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview defines how a Z.ai or outside prototype comes back for review. Returned code stays outside the
            student app until Codex checks parent-engine wrapping, JSON fixture use, events, audio, scoring, mobile
            accessibility, and white-label fit.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Return review guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${modeReviewCount} mode review(s)`} tone="success" />
          <StatusPill label="No production merge" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ReviewList
          title="Return review guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared return review guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ReviewList
          title="Return review guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared return review guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet) => (
          <article key={packet.reviewId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.buildBriefPacketId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={statusLabel[packet.status]} tone={statusTone[packet.status]} />
                <StatusPill label={packet.submittedBy} tone="neutral" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <ReviewList title="Returned artifacts" items={packet.returnedArtifacts} />
              <ReviewList title="Required evidence" items={packet.requiredEvidence} />
              <ReviewList title="Integration gates" items={packet.integrationReviewGates} />
              <ReviewList title="Blocked actions" items={packet.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Mode return reviews</h4>
                <StatusPill label={String(packet.modeReviews.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {packet.modeReviews.map((review) => (
                  <ModeReturnReviewCard key={`${packet.reviewId}-${review.modeId}`} review={review} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeReturnReviewCard({ review }: { review: AiPrototypeModeReturnReview }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{review.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{review.title}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{review.reviewFocus}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={review.parentEngine} tone="success" />
          <StatusPill label={review.prototypeSurface} tone="neutral" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <ReviewList title="Wrapper requirements" items={review.wrapperRequirements} />
        <ReviewList title="Event evidence" items={review.eventEvidence} />
        <ReviewList title="Audio evidence" items={review.audioEvidence} />
        <ReviewList title="Scoring evidence" items={review.scoringEvidence} />
        <ReviewList title="Accessibility evidence" items={review.accessibilityEvidence} />
      </div>

      <div className="mt-3">
        <ReviewList title="Prototype blockers" items={review.blockers} tone="warning" />
      </div>
    </article>
  );
}

function ReviewList({
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
