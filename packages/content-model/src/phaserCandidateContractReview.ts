export type PhaserCandidateReviewStatus = "mapped-review-only" | "blocked";
export type PhaserCandidateFindingStatus = "observed" | "gap" | "blocked";

export interface PhaserCandidateContractFinding {
  findingId: string;
  area: "payload" | "events" | "audio" | "scoring" | "persistence" | "identity" | "replay" | "accessibility";
  status: PhaserCandidateFindingStatus;
  observedBehavior: string;
  platformRequirement: string;
  evidenceReference: string;
}

export interface PhaserCandidateContractReview {
  reviewId: string;
  tenantId: string;
  queueItemId: string;
  sourceRepository: string;
  sourceSnapshotId: string;
  sourceCommitSha: string;
  gameMode: string;
  parentEngine: string;
  status: PhaserCandidateReviewStatus;
  summary: string;
  findings: PhaserCandidateContractFinding[];
  missingEvidence: string[];
  blockedActions: string[];
}

const requiredBlockedActions = [
  "No direct source import",
  "No route replacement",
  "No scene-owned scoring",
  "No browser persistence ownership",
  "No package promotion",
  "No student assignment",
];

export function validatePhaserCandidateContractReview(
  review: PhaserCandidateContractReview,
): string[] {
  const errors: string[] = [];

  if (
    !review.reviewId ||
    !review.tenantId ||
    !review.queueItemId ||
    !review.sourceRepository ||
    !review.sourceSnapshotId ||
    !review.sourceCommitSha
  ) {
    errors.push(
      "Phaser candidate contract reviews require review, tenant, queue, source repository, snapshot, and commit identifiers.",
    );
  }

  if (review.sourceCommitSha && !/^[0-9a-f]{40}$/i.test(review.sourceCommitSha)) {
    errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} requires a 40-character source commit SHA.`);
  }

  if (!review.gameMode || !review.parentEngine || !review.summary) {
    errors.push("Phaser candidate contract reviews require game mode, parent engine, and summary fields.");
  }

  if (review.status !== "mapped-review-only" && review.status !== "blocked") {
    errors.push("Phaser candidate contract reviews must remain mapped-review-only or blocked.");
  }

  if (review.findings.length === 0) {
    errors.push("Phaser candidate contract reviews require observed contract findings.");
  }

  const findingIds = new Set<string>();
  for (const finding of review.findings) {
    if (!finding.findingId || findingIds.has(finding.findingId)) {
      errors.push(`Phaser candidate contract review ${review.reviewId} must not repeat finding ids.`);
    }
    findingIds.add(finding.findingId);

    if (!finding.observedBehavior || !finding.platformRequirement || !finding.evidenceReference) {
      errors.push(`Phaser candidate finding ${finding.findingId || "(unnamed)"} requires observed behavior, platform requirement, and evidence reference.`);
    }
  }

  for (const blockedAction of requiredBlockedActions) {
    if (!review.blockedActions.includes(blockedAction)) {
      errors.push(`Phaser candidate contract review ${review.reviewId} must block: ${blockedAction}.`);
    }
  }

  if (review.status === "mapped-review-only" && review.missingEvidence.length === 0) {
    errors.push(`Phaser candidate contract review ${review.reviewId} cannot be review-only without missing evidence.`);
  }

  return errors;
}

export function validatePhaserCandidateContractReviews(
  reviews: PhaserCandidateContractReview[],
): string[] {
  const errors = reviews.flatMap((review) => validatePhaserCandidateContractReview(review));
  const reviewIds = reviews.map((review) => review.reviewId);
  const queueItemIds = reviews.map((review) => review.queueItemId);

  if (new Set(reviewIds).size !== reviewIds.length) {
    errors.push("Phaser candidate contract reviews must not repeat review ids.");
  }
  if (new Set(queueItemIds).size !== queueItemIds.length) {
    errors.push("Phaser candidate contract reviews must not repeat queue item ids.");
  }

  return errors;
}
