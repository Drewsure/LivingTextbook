import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PhaserCandidateContractFinding,
  PhaserCandidateContractReview,
} from "@living-textbook/content-model";

interface PhaserCandidateContractReviewPanelProps {
  reviews: PhaserCandidateContractReview[];
}

export function PhaserCandidateContractReviewPanel({ reviews }: PhaserCandidateContractReviewPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Phaser contract review</p>
          <h2 className="mt-1 text-lg font-bold">Frozen scenes mapped against canonical game contracts</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This evidence-only comparison records what the frozen scene does, what the platform must own, and what is still
            missing. It does not import source, approve a wrapper, replace a route, or change scoring.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${reviews.length} mapped`} tone="neutral" />
          <StatusPill label="Promotion blocked" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {reviews.map((review) => (
          <article key={review.reviewId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {review.tenantId} / {review.sourceRepository} / {review.parentEngine}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{review.gameMode}</h3>
                <p className="mt-1 break-words text-xs text-[var(--tenant-muted)]">Snapshot: {review.sourceSnapshotId}</p>
                <p className="mt-1 break-all text-xs text-[var(--tenant-muted)]">Frozen commit: {review.sourceCommitSha}</p>
                <p className="mt-1 text-xs text-[var(--tenant-muted)]">Reviewed files: {review.sourceFiles.length}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label="Mapped, review-only" tone="warning" />
                <StatusPill label={`Wrapper: ${review.approval.status}`} tone="warning" />
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{review.summary}</p>

            {(() => {
              const profile = getCandidateProfile(review.gameMode, review.parentEngine);
              if (!profile) return null;

              return (
                <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Candidate profile gate</p>
                      <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{profile.label}</h4>
                    </div>
                    <StatusPill label={`Parent engine: ${profile.parentEngine}`} tone="neutral" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                    Required deterministic scoring cases are listed here before a returned package can be reviewed.
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-[var(--tenant-text)]">
                    {profile.scenarios.map((scenario) => (
                      <li key={`${review.reviewId}-profile-${scenario}`} className="rounded-md border border-[var(--tenant-border)] px-2 py-1">
                        {scenario}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })()}

            <details className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <summary className="cursor-pointer text-sm font-bold text-[var(--tenant-text)]">Source evidence manifest</summary>
              <ul className="mt-3 grid gap-2 text-xs leading-5 text-[var(--tenant-muted)]">
                {review.sourceFiles.map((sourceFile) => (
                  <li key={`${review.reviewId}-${sourceFile.path}`} className="break-all">
                    {sourceFile.path} / SHA-256 {sourceFile.sha256}
                  </li>
                ))}
              </ul>
            </details>

            <div className="mt-4 grid gap-3">
              {review.findings.map((finding) => (
                <FindingRow key={finding.findingId} finding={finding} />
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ReviewList title="Missing evidence" items={review.missingEvidence} tone="warning" ownerId={review.reviewId} />
              <ReviewList title="Blocked actions" items={review.blockedActions} tone="warning" ownerId={`${review.reviewId}-blocked`} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function getCandidateProfile(gameMode: string, parentEngine: string) {
  const profiles = {
    "memory-match": {
      label: "Memory Match profile",
      parentEngine: "pairing",
      scenarios: ["correct", "incorrect", "retry", "completion"],
    },
    "balloon-pop": {
      label: "Balloon Pop profile",
      parentEngine: "selection",
      scenarios: ["correct", "incorrect", "miss", "retry", "completion"],
    },
  } as const;

  const profile = profiles[gameMode as keyof typeof profiles];
  return profile?.parentEngine === parentEngine ? profile : undefined;
}

function FindingRow({ finding }: { finding: PhaserCandidateContractFinding }) {
  const tone = finding.status === "observed" ? "success" : "warning";

  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{finding.area}</p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">Observed source behavior</h4>
        </div>
        <StatusPill label={finding.status} tone={tone} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{finding.observedBehavior}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
        <span className="font-bold">Platform requirement:</span> {finding.platformRequirement}
      </p>
      <p className="mt-2 break-words text-xs text-[var(--tenant-muted)]">Evidence: {finding.evidenceReference}</p>
    </section>
  );
}

function ReviewList({
  title,
  items,
  tone,
  ownerId,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
  ownerId: string;
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${ownerId}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
