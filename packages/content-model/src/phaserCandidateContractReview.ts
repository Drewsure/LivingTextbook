import { getPhaserCandidateProfile } from "./index";

export type PhaserCandidateReviewStatus = "mapped-review-only" | "blocked";
export type PhaserCandidateFindingStatus = "observed" | "gap" | "blocked";
export type PhaserCandidateWrapperApprovalStatus = "blocked" | "approved-for-wrapper";

export interface PhaserCandidateContractFinding {
  findingId: string;
  area: "payload" | "events" | "audio" | "scoring" | "persistence" | "identity" | "replay" | "accessibility";
  status: PhaserCandidateFindingStatus;
  observedBehavior: string;
  platformRequirement: string;
  evidenceReference: string;
}

export interface PhaserCandidateSourceFileEvidence {
  path: string;
  sha256: string;
}

export interface PhaserCandidateWrapperApproval {
  decisionId: string;
  status: PhaserCandidateWrapperApprovalStatus;
  decidedAt: string;
  blockers: string[];
}

export interface PhaserCandidateContractReview {
  reviewId: string;
  tenantId: string;
  queueItemId: string;
  sourceRepository: string;
  sourceSnapshotId: string;
  sourceCommitSha: string;
  sourceFiles: PhaserCandidateSourceFileEvidence[];
  gameMode: string;
  parentEngine: string;
  status: PhaserCandidateReviewStatus;
  approval: PhaserCandidateWrapperApproval;
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

  if (!review.sourceFiles || review.sourceFiles.length === 0) {
    errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} requires hashed source-file evidence.`);
  }

  const sourcePaths = new Set<string>();
  for (const sourceFile of review.sourceFiles ?? []) {
    if (!isSafeRepositoryRelativePath(sourceFile.path) || sourcePaths.has(sourceFile.path)) {
      errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} must use unique repository-relative source paths.`);
    }
    sourcePaths.add(sourceFile.path);

    if (!/^[0-9a-f]{64}$/i.test(sourceFile.sha256)) {
      errors.push(`Phaser candidate source file ${sourceFile.path || "(unnamed)"} requires a 64-character SHA-256 hash.`);
    }
  }

  if (!review.gameMode || !review.parentEngine || !review.summary) {
    errors.push("Phaser candidate contract reviews require game mode, parent engine, and summary fields.");
  }

  if (review.gameMode && review.parentEngine) {
    const modeProfile = getPhaserCandidateProfile(review.gameMode);
    if (!modeProfile) {
      errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} must use an approved candidate profile for ${review.gameMode}.`);
    } else if (modeProfile.parentEngine !== review.parentEngine) {
      errors.push(
        `Phaser candidate contract review ${review.reviewId || "(unnamed)"} must use parent engine ${modeProfile.parentEngine} for ${review.gameMode}; found ${review.parentEngine}.`,
      );
    }
  }

  if (!review.approval?.decisionId || !review.approval?.decidedAt) {
    errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} requires a wrapper approval decision record.`);
  }

  if (review.approval && !["blocked", "approved-for-wrapper"].includes(review.approval.status)) {
    errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} has an invalid wrapper approval status.`);
  }

  if (review.approval?.decidedAt && Number.isNaN(Date.parse(review.approval.decidedAt))) {
    errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} requires an ISO wrapper approval timestamp.`);
  }

  if (review.approval?.status === "blocked" && review.approval.blockers.length === 0) {
    errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} cannot be wrapper-blocked without blockers.`);
  }

  if (review.approval?.status === "approved-for-wrapper" && (review.approval.blockers.length > 0 || review.missingEvidence.length > 0)) {
    errors.push(`Phaser candidate contract review ${review.reviewId || "(unnamed)"} cannot approve a wrapper with blockers or missing evidence.`);
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

    const evidencePath = finding.evidenceReference.split(":", 1)[0];
    if (evidencePath && !sourcePaths.has(evidencePath)) {
      errors.push(
        `Phaser candidate finding ${finding.findingId || "(unnamed)"} must reference a file in the hashed source manifest.`,
      );
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

function isSafeRepositoryRelativePath(value: string): boolean {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !value.startsWith("/") &&
    !value.startsWith("\\") &&
    !value.includes("\\") &&
    !value.includes(":") &&
    !value.split("/").includes("..")
  );
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
