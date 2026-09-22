import {
  PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS,
  validatePhaserCandidateIntegrationEligibility,
  type PhaserCandidateIntegrationEligibility,
} from "./phaserCandidateIntegrationEligibility";
import { validatePhaserCandidateSourceIdentity } from "./phaserCandidateSourceIdentity";
import {
  validateAiPrototypeReturnedPackageManifest,
  type AiPrototypeReturnedPackageManifest,
} from "./aiPrototypeReturnedPackageManifest";

export type PhaserCandidateEvidenceReturnStatus = "awaiting-return" | "received-review-only" | "blocked";
export type PhaserCandidateEvidenceReceiptStatus = "missing" | "received" | "reviewed";

export interface PhaserCandidateEvidenceReceipt {
  laneId: string;
  artifactIds: string[];
  status: PhaserCandidateEvidenceReceiptStatus;
}

export interface PhaserCandidateEvidenceReturnPacket {
  packetId: string;
  manifestId: string;
  eligibilityId: string;
  tenantId: string;
  requestId: string;
  queueItemId: string;
  gameMode: string;
  parentEngine: string;
  sourceRepository: string;
  sourceSnapshotId: string;
  sourceCommitSha: string;
  status: PhaserCandidateEvidenceReturnStatus;
  requiredArtifactNames: string[];
  receipts: PhaserCandidateEvidenceReceipt[];
  importAllowed: false;
  routeReplacementAllowed: false;
  studentAssignmentAllowed: false;
  codexReviewRequired: true;
  note: string;
}

export const PHASER_CANDIDATE_REQUIRED_RETURN_ARTIFACT_NAMES = [
  "return-package-manifest.json",
  "reviewed-unit-fixture.json",
  "standard-event-replay.json",
  "audio-coverage-report.json",
  "deterministic-scoring-replay.json",
  "mobile-accessibility-report.json",
  "wrapper-adapter-review.md",
  "source-manifest.sha256",
  "README.md",
] as const;

export function validatePhaserCandidateEvidenceReturnPacket(
  packet: PhaserCandidateEvidenceReturnPacket,
  manifest: AiPrototypeReturnedPackageManifest,
  eligibility: PhaserCandidateIntegrationEligibility,
): string[] {
  const errors: string[] = [];
  const requiredStrings = [
    "packetId",
    "manifestId",
    "eligibilityId",
    "tenantId",
    "requestId",
    "queueItemId",
    "gameMode",
    "parentEngine",
    "sourceRepository",
    "sourceSnapshotId",
    "sourceCommitSha",
    "note",
  ] as const;

  for (const field of requiredStrings) {
    if (typeof packet[field] !== "string" || packet[field].trim().length === 0) {
      errors.push(`Phaser candidate evidence return packet ${field} must be non-empty.`);
    }
  }

  if (!Array.isArray(packet.requiredArtifactNames) || packet.requiredArtifactNames.length !== PHASER_CANDIDATE_REQUIRED_RETURN_ARTIFACT_NAMES.length) {
    errors.push("Phaser candidate evidence return packet must list the nine required return artifacts.");
  } else {
    for (const artifactName of PHASER_CANDIDATE_REQUIRED_RETURN_ARTIFACT_NAMES) {
      if (!packet.requiredArtifactNames.includes(artifactName)) {
        errors.push(`Phaser candidate evidence return packet must require ${artifactName}.`);
      }
    }
  }

  if (!['awaiting-return', 'received-review-only', 'blocked'].includes(packet.status)) {
    errors.push("Phaser candidate evidence return packet status is unsupported.");
  }
  if (packet.importAllowed !== false || packet.routeReplacementAllowed !== false || packet.studentAssignmentAllowed !== false) {
    errors.push("Phaser candidate evidence return packet must keep import, route replacement, and student assignment disabled.");
  }
  if (packet.codexReviewRequired !== true) {
    errors.push("Phaser candidate evidence return packet must require Codex review.");
  }

  const identityErrors = validatePhaserCandidateSourceIdentity(packet);
  errors.push(...identityErrors.map((error) => `Evidence return packet ${error.toLowerCase()}`));
  errors.push(...validateAiPrototypeReturnedPackageManifest(manifest));
  errors.push(...validatePhaserCandidateIntegrationEligibility(eligibility));

  const references: Array<[string, string]> = [
    ["manifestId", manifest.manifestId],
    ["eligibilityId", eligibility.eligibilityId],
    ["tenantId", manifest.tenantId],
    ["requestId", manifest.requestId],
    ["queueItemId", manifest.queueItemId],
    ["gameMode", manifest.targetMode],
    ["parentEngine", manifest.parentEngine],
    ["sourceRepository", manifest.sourceRepository],
    ["sourceSnapshotId", manifest.status === "not-returned" ? packet.sourceSnapshotId : manifest.sourceSnapshotId],
    ["sourceCommitSha", eligibility.sourceCommitSha],
  ];
  for (const [field, expected] of references) {
    const actual = packet[field as keyof PhaserCandidateEvidenceReturnPacket];
    if (actual !== expected) errors.push(`Phaser candidate evidence return packet ${field} does not match its source record.`);
  }
  if (packet.gameMode !== eligibility.gameMode || packet.parentEngine !== eligibility.parentEngine) {
    errors.push("Phaser candidate evidence return packet mode and parent engine do not match eligibility.");
  }

  if (!Array.isArray(packet.receipts) || packet.receipts.length !== PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS.length) {
    errors.push("Phaser candidate evidence return packet must contain one receipt for every canonical evidence lane.");
  }
  const laneIds = new Set<string>();
  for (const receipt of Array.isArray(packet.receipts) ? packet.receipts : []) {
    if (!receipt || typeof receipt !== "object" || !receipt.laneId) {
      errors.push("Phaser candidate evidence receipts must identify a lane.");
      continue;
    }
    if (laneIds.has(receipt.laneId)) errors.push(`Phaser candidate evidence receipt lane ${receipt.laneId} is duplicated.`);
    laneIds.add(receipt.laneId);
    if (!PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS.includes(receipt.laneId as (typeof PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS)[number])) {
      errors.push(`Phaser candidate evidence receipt lane ${receipt.laneId} is not canonical.`);
    }
    if (!Array.isArray(receipt.artifactIds)) errors.push(`Phaser candidate evidence receipt ${receipt.laneId} must list artifact ids.`);
    if (!["missing", "received", "reviewed"].includes(receipt.status)) errors.push(`Phaser candidate evidence receipt ${receipt.laneId} has an unsupported status.`);
    if (packet.status === "awaiting-return" && receipt.status !== "missing") {
      errors.push(`Awaiting-return evidence receipt ${receipt.laneId} must remain missing.`);
    }
    if (packet.status === "received-review-only" && (receipt.status !== "reviewed" || receipt.artifactIds.length === 0)) {
      errors.push(`Received evidence receipt ${receipt.laneId} must be reviewed and cite an artifact.`);
    }
  }
  for (const laneId of PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS) {
    if (!laneIds.has(laneId)) errors.push(`Phaser candidate evidence return packet is missing lane ${laneId}.`);
  }

  if (packet.status === "awaiting-return" && manifest.status !== "not-returned") {
    errors.push("Awaiting-return evidence packet must reference a not-returned manifest.");
  }
  if (packet.status === "received-review-only" && manifest.status !== "review-only") {
    errors.push("Received evidence packet must reference a review-only returned manifest.");
  }

  return [...new Set(errors)];
}
