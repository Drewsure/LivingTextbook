import {
  validatePhaserCandidateIntegrationEligibility,
  type PhaserCandidateIntegrationEligibility,
  type PhaserCandidateContractReview,
} from "@living-textbook/content-model";
import { samplePhaserCandidateContractReviews } from "@/data/samplePhaserCandidateContractReview";

const memoryMatch = samplePhaserCandidateContractReviews.find((review) => review.gameMode === "memory-match");
const balloonPop = samplePhaserCandidateContractReviews.find((review) => review.gameMode === "balloon-pop");

if (!memoryMatch || !balloonPop) throw new Error("Phaser integration eligibility requires the Memory Match and Balloon Pop review records.");

function buildEligibility(
  review: PhaserCandidateContractReview,
  canonicalRoute: string,
  canonicalComponent: string,
  scoringProfile: string,
): PhaserCandidateIntegrationEligibility {
  return {
    eligibilityId: `${review.reviewId}-integration-eligibility`,
    tenantId: review.tenantId,
    queueItemId: review.queueItemId,
    gameMode: review.gameMode,
    parentEngine: review.parentEngine,
    sourceSnapshotId: review.sourceSnapshotId,
    sourceCommitSha: review.sourceCommitSha,
    canonicalRoute,
    canonicalComponent,
    scoringProfile,
    status: "blocked",
    sourceIsolationRequired: true,
    evidenceLanes: review.findings.map((finding) => ({
      laneId: finding.findingId,
      label: `${finding.area} contract evidence`,
      status: finding.status === "observed" ? "reviewed" : finding.status === "blocked" ? "blocked" : "pending-review",
      sourceRecord: finding.evidenceReference,
      requirement: finding.platformRequirement,
    })),
    wrapperAllowed: false,
    directImportAllowed: false,
    routeReplacementAllowed: false,
    sceneScoringAllowed: false,
    browserPersistenceAllowed: false,
    packagePromotionAllowed: false,
    studentAssignmentAllowed: false,
    blockedActions: [
      "No direct source import",
      "No wrapper approval",
      "No route replacement",
      "No scene-owned scoring",
      "No browser persistence ownership",
      "No package promotion",
      "No student assignment",
    ],
    nextRequiredEvidence: review.missingEvidence,
    note: "This eligibility record is derived from the frozen candidate contract review. It is not permission to import or activate the source game.",
  };
}

export const samplePhaserCandidateIntegrationEligibility: PhaserCandidateIntegrationEligibility[] = [
  buildEligibility(
    memoryMatch,
    "/memory/[code]",
    "apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx",
    "pairing-reinforcement-v1",
  ),
  buildEligibility(
    balloonPop,
    "/balloon/[code]",
    "apps/web/src/features/game-shell/selection/SelectionBalloonPopGame.tsx",
    "arcade-reinforcement-v1",
  ),
];

export const samplePhaserCandidateIntegrationEligibilityErrors = samplePhaserCandidateIntegrationEligibility.flatMap(
  (eligibility) => validatePhaserCandidateIntegrationEligibility(eligibility),
);
