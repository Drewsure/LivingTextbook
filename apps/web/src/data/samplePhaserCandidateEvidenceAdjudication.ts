import {
  PHASER_CANDIDATE_EVIDENCE_ADJUDICATION_BLOCKED_ACTIONS,
  derivePhaserCandidateEvidenceAdjudicationStatus,
  validatePhaserCandidateEvidenceAdjudication,
  type PhaserCandidateEvidenceAdjudication,
} from "@living-textbook/content-model";
import { samplePhaserCandidateEvidenceReturnPackets, samplePhaserCandidateEvidenceReturnPacketErrors } from "@/data/samplePhaserCandidateEvidenceReturnPacket";
import { samplePhaserCandidateIntegrationEligibility } from "@/data/samplePhaserCandidateIntegrationEligibility";

const packet = samplePhaserCandidateEvidenceReturnPackets[0];
const eligibility = samplePhaserCandidateIntegrationEligibility.find((item) => item.eligibilityId === packet.eligibilityId);

if (!eligibility) throw new Error("Evidence adjudication requires the packet eligibility record.");

const packetErrors = samplePhaserCandidateEvidenceReturnPacketErrors;
const status = derivePhaserCandidateEvidenceAdjudicationStatus(packet.status, packetErrors);

export const samplePhaserCandidateEvidenceAdjudication: PhaserCandidateEvidenceAdjudication = {
  adjudicationId: "memory-match-evidence-adjudication-ministar-v1",
  packetId: packet.packetId,
  eligibilityId: packet.eligibilityId,
  tenantId: packet.tenantId,
  requestId: packet.requestId,
  gameMode: packet.gameMode,
  status,
  owner: status === "awaiting-external-return" ? "external-builder" : status === "returned-awaiting-codex-review" ? "Codex" : "platform-owner",
  nextAction: "Await the evidence-only return packet before any Codex wrapper review.",
  wrapperProposalAllowed: false,
  integrationApprovalAllowed: false,
  routeWriteAllowed: false,
  studentAssignmentAllowed: false,
  blockedActions: [...PHASER_CANDIDATE_EVIDENCE_ADJUDICATION_BLOCKED_ACTIONS],
  note: "This state describes ownership and next action only. It is not a wrapper approval or integration work order.",
};

export const samplePhaserCandidateEvidenceAdjudicationErrors = validatePhaserCandidateEvidenceAdjudication(
  samplePhaserCandidateEvidenceAdjudication,
  eligibility,
  packet.status,
  packetErrors,
);
