import {
  AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS,
  PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS,
  PHASER_CANDIDATE_REQUIRED_RETURN_ARTIFACT_NAMES,
  validatePhaserCandidateEvidenceReturnPacket,
  type AiPrototypeReturnedPackageManifest,
  type PhaserCandidateEvidenceReturnPacket,
} from "@living-textbook/content-model";
import { sampleAiPrototypeReturnedPackageManifests } from "@/data/sampleAiPrototypeReturnedPackageManifest";
import { samplePhaserCandidateIntegrationEligibility } from "@/data/samplePhaserCandidateIntegrationEligibility";
import { sampleMemoryMatchEvidenceHandoffPacket } from "@/data/sampleMemoryMatchEvidenceHandoffPacket";

const eligibility = samplePhaserCandidateIntegrationEligibility.find((item) => item.gameMode === "memory-match");
const manifest: AiPrototypeReturnedPackageManifest = {
  manifestId: "returned-package-manifest-intake-ministar-memory-match-phaser",
  tenantId: "ministar",
  requestId: sampleMemoryMatchEvidenceHandoffPacket.requestId,
  queueItemId: eligibility?.queueItemId ?? "",
  status: "not-returned",
  sourceRepository: "Drewsure/ministar-lab",
  sourceSnapshotId: "not-returned",
  prototypeFolder: "not-returned",
  targetMode: "memory-match",
  parentEngine: "pairing",
  targetSurface: "phaser",
  artifacts: [],
  blockedActions: [...AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS],
};

if (!manifest || !eligibility) {
  throw new Error("Memory Match evidence return packet requires its returned manifest and eligibility record.");
}

export const samplePhaserCandidateEvidenceReturnPackets: PhaserCandidateEvidenceReturnPacket[] = [
  {
    packetId: "memory-match-evidence-return-ministar-v1",
    manifestId: manifest.manifestId,
    eligibilityId: eligibility.eligibilityId,
    tenantId: manifest.tenantId,
    requestId: manifest.requestId,
    queueItemId: manifest.queueItemId,
    gameMode: eligibility.gameMode,
    parentEngine: eligibility.parentEngine,
    sourceRepository: manifest.sourceRepository,
    sourceSnapshotId: eligibility.sourceSnapshotId,
    sourceCommitSha: eligibility.sourceCommitSha,
    status: "awaiting-return",
    requiredArtifactNames: [...PHASER_CANDIDATE_REQUIRED_RETURN_ARTIFACT_NAMES],
    receipts: PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS.map((laneId) => ({
      laneId,
      artifactIds: [],
      status: "missing" as const,
    })),
    importAllowed: false,
    routeReplacementAllowed: false,
    studentAssignmentAllowed: false,
    codexReviewRequired: true,
    note: "No Z.ai files have been returned. This preflight records the expected evidence shape without reading, copying, or activating external source.",
  },
];

export const samplePhaserCandidateEvidenceReturnPacketErrors = samplePhaserCandidateEvidenceReturnPackets.flatMap(
  (packet) => {
    const packetManifest = packet.manifestId === manifest.manifestId
      ? manifest
      : sampleAiPrototypeReturnedPackageManifests.find((item) => item.manifestId === packet.manifestId);
    const packetEligibility = samplePhaserCandidateIntegrationEligibility.find((item) => item.eligibilityId === packet.eligibilityId);
    if (!packetManifest || !packetEligibility) return [`${packet.packetId}: source records are missing.`];
    return validatePhaserCandidateEvidenceReturnPacket(packet, packetManifest, packetEligibility).map(
      (error) => `${packet.packetId}: ${error}`,
    );
  },
);
