export type PhaserCandidateIntegrationEligibilityStatus = "blocked" | "review-only";
export type PhaserCandidateIntegrationEvidenceStatus = "reviewed" | "pending-review" | "blocked";

export interface PhaserCandidateIntegrationEvidenceLane {
  laneId: string;
  label: string;
  status: PhaserCandidateIntegrationEvidenceStatus;
  sourceRecord: string;
  requirement: string;
}

export const PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS = [
  "source-provenance",
  "wrapper-approval",
  "payload",
  "events",
  "audio",
  "scoring",
  "privacy",
  "persistence",
  "replay",
  "accessibility",
  "integration-decision",
] as const;

export interface PhaserCandidateIntegrationEligibility {
  eligibilityId: string;
  tenantId: string;
  queueItemId: string;
  gameMode: string;
  parentEngine: string;
  sourceSnapshotId: string;
  sourceCommitSha: string;
  canonicalRoute: string;
  canonicalComponent: string;
  scoringProfile: string;
  status: PhaserCandidateIntegrationEligibilityStatus;
  sourceIsolationRequired: true;
  evidenceLanes: PhaserCandidateIntegrationEvidenceLane[];
  wrapperAllowed: false;
  directImportAllowed: false;
  routeReplacementAllowed: false;
  sceneScoringAllowed: false;
  browserPersistenceAllowed: false;
  packagePromotionAllowed: false;
  studentAssignmentAllowed: false;
  blockedActions: string[];
  nextRequiredEvidence: string[];
  note: string;
}

const REQUIRED_BLOCKED_ACTIONS = [
  "No direct source import",
  "No wrapper approval",
  "No route replacement",
  "No scene-owned scoring",
  "No browser persistence ownership",
  "No package promotion",
  "No student assignment",
] as const;

export function validatePhaserCandidateIntegrationEligibility(
  eligibility: PhaserCandidateIntegrationEligibility,
): string[] {
  const errors: string[] = [];
  const evidenceLanes = Array.isArray(eligibility?.evidenceLanes) ? eligibility.evidenceLanes : [];
  const blockedActions = Array.isArray(eligibility?.blockedActions) ? eligibility.blockedActions : [];
  for (const field of [
    "eligibilityId",
    "tenantId",
    "queueItemId",
    "gameMode",
    "parentEngine",
    "sourceSnapshotId",
    "sourceCommitSha",
    "canonicalRoute",
    "canonicalComponent",
    "scoringProfile",
    "note",
  ] as const) {
    if (typeof eligibility[field] !== "string" || eligibility[field].trim().length === 0) {
      errors.push(`Phaser candidate integration eligibility ${field} must be non-empty.`);
    }
  }
  if (!/^[0-9a-f]{40}$/i.test(eligibility.sourceCommitSha)) {
    errors.push("Phaser candidate integration eligibility requires a 40-character source commit SHA.");
  }
  if (eligibility.sourceIsolationRequired !== true) errors.push("Phaser candidate integration eligibility must require source isolation.");
  for (const field of [
    "wrapperAllowed",
    "directImportAllowed",
    "routeReplacementAllowed",
    "sceneScoringAllowed",
    "browserPersistenceAllowed",
    "packagePromotionAllowed",
    "studentAssignmentAllowed",
  ] as const) {
    if (eligibility[field] !== false) errors.push(`Phaser candidate integration eligibility ${field} must remain false.`);
  }
  if (!Array.isArray(eligibility?.evidenceLanes) || evidenceLanes.length < PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS.length) {
    errors.push("Phaser candidate integration eligibility requires all canonical evidence lanes.");
  }
  const laneIds = new Set<string>();
  for (const lane of evidenceLanes) {
    if (!lane || typeof lane !== "object") {
      errors.push("Phaser candidate integration eligibility requires valid evidence lanes.");
      continue;
    }
    if (!lane.laneId || laneIds.has(lane.laneId)) errors.push("Phaser candidate integration evidence lane ids must be unique.");
    laneIds.add(lane.laneId);
    for (const field of ["label", "sourceRecord", "requirement"] as const) {
      if (typeof lane[field] !== "string" || lane[field].trim().length === 0) errors.push(`Phaser candidate integration evidence ${field} must be non-empty.`);
    }
    if (!["reviewed", "pending-review", "blocked"].includes(lane.status)) errors.push(`Phaser candidate integration evidence ${lane.laneId} has an invalid status.`);
  }
  for (const requiredLaneId of PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS) {
    if (!laneIds.has(requiredLaneId)) errors.push(`Phaser candidate integration eligibility must include evidence lane ${requiredLaneId}.`);
  }
  if (!Array.isArray(eligibility?.blockedActions)) errors.push("Phaser candidate integration eligibility blockedActions must be an array.");
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) errors.push(`Phaser candidate integration eligibility must block: ${action}.`);
  }
  if (!Array.isArray(eligibility.nextRequiredEvidence) || eligibility.nextRequiredEvidence.length === 0) errors.push("Phaser candidate integration eligibility must list next required evidence.");
  if (eligibility.status === "blocked" && !evidenceLanes.some((lane) => lane.status === "blocked")) errors.push("Blocked Phaser candidate integration eligibility must expose a blocked evidence lane.");
  return [...new Set(errors)];
}
