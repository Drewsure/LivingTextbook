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
  const candidate = review ?? ({} as PhaserCandidateContractReview);
  const errors: string[] = [];
  const sourceFiles = Array.isArray(candidate.sourceFiles) ? candidate.sourceFiles : [];
  const missingEvidence = Array.isArray(candidate.missingEvidence) ? candidate.missingEvidence : [];
  const findings = Array.isArray(candidate.findings) ? candidate.findings : [];
  const blockedActions = Array.isArray(candidate.blockedActions) ? candidate.blockedActions : [];
  const approvalBlockers = Array.isArray(candidate.approval?.blockers) ? candidate.approval.blockers : [];

  if (
    !candidate.reviewId ||
    !candidate.tenantId ||
    !candidate.queueItemId ||
    !candidate.sourceRepository ||
    !candidate.sourceSnapshotId ||
    !candidate.sourceCommitSha
  ) {
    errors.push(
      "Phaser candidate contract reviews require review, tenant, queue, source repository, snapshot, and commit identifiers.",
    );
  }

  if (candidate.sourceCommitSha && !/^[0-9a-f]{40}$/i.test(candidate.sourceCommitSha)) {
    errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} requires a 40-character source commit SHA.`);
  }

  if (sourceFiles.length === 0) {
    errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} requires hashed source-file evidence.`);
  }

  const sourcePaths = new Set<string>();
  for (const sourceFile of sourceFiles) {
    if (!sourceFile || typeof sourceFile !== "object") {
      errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} requires hashed source-file evidence.`);
      continue;
    }
    if (!isSafeRepositoryRelativePath(sourceFile.path) || sourcePaths.has(sourceFile.path)) {
      errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} must use unique repository-relative source paths.`);
    }
    sourcePaths.add(sourceFile.path);

    if (!/^[0-9a-f]{64}$/i.test(sourceFile.sha256)) {
      errors.push(`Phaser candidate source file ${sourceFile.path || "(unnamed)"} requires a 64-character SHA-256 hash.`);
    }
  }

  if (!candidate.gameMode || !candidate.parentEngine || !candidate.summary) {
    errors.push("Phaser candidate contract reviews require game mode, parent engine, and summary fields.");
  }

  if (candidate.gameMode && candidate.parentEngine) {
    const modeProfile = getPhaserCandidateProfile(candidate.gameMode);
    if (!modeProfile) {
      errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} must use an approved candidate profile for ${candidate.gameMode}.`);
    } else if (modeProfile.parentEngine !== candidate.parentEngine) {
      errors.push(
        `Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} must use parent engine ${modeProfile.parentEngine} for ${candidate.gameMode}; found ${candidate.parentEngine}.`,
      );
    }
  }

  if (!candidate.approval?.decisionId || !candidate.approval?.decidedAt) {
    errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} requires a wrapper approval decision record.`);
  }

  if (candidate.approval && !["blocked", "approved-for-wrapper"].includes(candidate.approval.status)) {
    errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} has an invalid wrapper approval status.`);
  }

  if (candidate.approval?.decidedAt && Number.isNaN(Date.parse(candidate.approval.decidedAt))) {
    errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} requires an ISO wrapper approval timestamp.`);
  }

  if (candidate.approval?.status === "blocked" && approvalBlockers.length === 0) {
    errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} cannot be wrapper-blocked without blockers.`);
  }

  if (candidate.approval?.status === "approved-for-wrapper" && (approvalBlockers.length > 0 || missingEvidence.length > 0)) {
    errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} cannot approve a wrapper with blockers or missing evidence.`);
  }

  if (candidate.status !== "mapped-review-only" && candidate.status !== "blocked") {
    errors.push("Phaser candidate contract reviews must remain mapped-review-only or blocked.");
  }

  if (findings.length === 0) {
    errors.push("Phaser candidate contract reviews require observed contract findings.");
  }

  const findingIds = new Set<string>();
  for (const finding of findings) {
    if (!finding || typeof finding !== "object") {
      errors.push(`Phaser candidate contract review ${candidate.reviewId || "(unnamed)"} requires observed contract findings.`);
      continue;
    }
    if (!finding.findingId || findingIds.has(finding.findingId)) {
      errors.push(`Phaser candidate contract review ${candidate.reviewId} must not repeat finding ids.`);
    }
    findingIds.add(finding.findingId);

    if (
      typeof finding.observedBehavior !== "string" ||
      typeof finding.platformRequirement !== "string" ||
      typeof finding.evidenceReference !== "string" ||
      !finding.observedBehavior ||
      !finding.platformRequirement ||
      !finding.evidenceReference
    ) {
      errors.push(`Phaser candidate finding ${finding.findingId || "(unnamed)"} requires observed behavior, platform requirement, and evidence reference.`);
    }

    const evidencePath = typeof finding.evidenceReference === "string" ? finding.evidenceReference.split(":", 1)[0] : "";
    if (evidencePath && !sourcePaths.has(evidencePath)) {
      errors.push(
        `Phaser candidate finding ${finding.findingId || "(unnamed)"} must reference a file in the hashed source manifest.`,
      );
    }
  }

  for (const blockedAction of requiredBlockedActions) {
    if (!blockedActions.includes(blockedAction)) {
      errors.push(`Phaser candidate contract review ${candidate.reviewId} must block: ${blockedAction}.`);
    }
  }

  if (candidate.status === "mapped-review-only" && missingEvidence.length === 0) {
    errors.push(`Phaser candidate contract review ${candidate.reviewId} cannot be review-only without missing evidence.`);
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
  if (!Array.isArray(reviews)) {
    return ["Phaser candidate contract reviews must be provided as an array."];
  }

  const errors = reviews.flatMap((review) => validatePhaserCandidateContractReview(review));
  const reviewIds = reviews.map((review) => review?.reviewId);
  const queueItemIds = reviews.map((review) => review?.queueItemId);

  if (new Set(reviewIds).size !== reviewIds.length) {
    errors.push("Phaser candidate contract reviews must not repeat review ids.");
  }
  if (new Set(queueItemIds).size !== queueItemIds.length) {
    errors.push("Phaser candidate contract reviews must not repeat queue item ids.");
  }

  return errors;
}
