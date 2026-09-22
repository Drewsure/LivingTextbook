import type { PhaserCandidateEvidenceReturnStatus } from "./phaserCandidateEvidenceReturnPacket";
import type { PhaserCandidateIntegrationEligibility } from "./phaserCandidateIntegrationEligibility";

export type PhaserCandidateEvidenceAdjudicationStatus =
  | "awaiting-external-return"
  | "returned-awaiting-codex-review"
  | "blocked";

export type PhaserCandidateEvidenceAdjudicationOwner = "external-builder" | "Codex" | "platform-owner";

export interface PhaserCandidateEvidenceAdjudication {
  adjudicationId: string;
  packetId: string;
  eligibilityId: string;
  tenantId: string;
  requestId: string;
  gameMode: string;
  status: PhaserCandidateEvidenceAdjudicationStatus;
  owner: PhaserCandidateEvidenceAdjudicationOwner;
  nextAction: string;
  wrapperProposalAllowed: false;
  integrationApprovalAllowed: false;
  routeWriteAllowed: false;
  studentAssignmentAllowed: false;
  blockedActions: string[];
  note: string;
}

export const PHASER_CANDIDATE_EVIDENCE_ADJUDICATION_BLOCKED_ACTIONS = [
  "No wrapper proposal execution",
  "No integration approval",
  "No source import",
  "No route write",
  "No scoring mutation",
  "No persistence ownership",
  "No package promotion",
  "No student assignment",
] as const;

export function derivePhaserCandidateEvidenceAdjudicationStatus(
  packetStatus: PhaserCandidateEvidenceReturnStatus,
  packetErrors: string[],
): PhaserCandidateEvidenceAdjudicationStatus {
  if (packetErrors.length > 0 || packetStatus === "blocked") return "blocked";
  if (packetStatus === "received-review-only") return "returned-awaiting-codex-review";
  return "awaiting-external-return";
}

export function validatePhaserCandidateEvidenceAdjudication(
  adjudication: PhaserCandidateEvidenceAdjudication,
  eligibility: PhaserCandidateIntegrationEligibility,
  packetStatus: PhaserCandidateEvidenceReturnStatus,
  packetErrors: string[],
): string[] {
  const errors: string[] = [];
  for (const field of ["adjudicationId", "packetId", "eligibilityId", "tenantId", "requestId", "gameMode", "nextAction", "note"] as const) {
    if (typeof adjudication[field] !== "string" || adjudication[field].trim().length === 0) {
      errors.push(`Phaser candidate evidence adjudication ${field} must be non-empty.`);
    }
  }
  if (adjudication.eligibilityId !== eligibility.eligibilityId) errors.push("Phaser candidate evidence adjudication must bind the eligibility record.");
  if (adjudication.tenantId !== eligibility.tenantId) errors.push("Phaser candidate evidence adjudication must preserve tenant scope.");
  if (adjudication.gameMode !== eligibility.gameMode) errors.push("Phaser candidate evidence adjudication must preserve game mode.");
  if (!["awaiting-external-return", "returned-awaiting-codex-review", "blocked"].includes(adjudication.status)) {
    errors.push("Phaser candidate evidence adjudication status is unsupported.");
  }
  if (!["external-builder", "Codex", "platform-owner"].includes(adjudication.owner)) {
    errors.push("Phaser candidate evidence adjudication owner is unsupported.");
  }
  const expectedStatus = derivePhaserCandidateEvidenceAdjudicationStatus(packetStatus, packetErrors);
  if (adjudication.status !== expectedStatus) {
    errors.push(`Phaser candidate evidence adjudication status must match packet state: expected ${expectedStatus}, received ${adjudication.status}.`);
  }
  const expectedOwner = adjudication.status === "awaiting-external-return" ? "external-builder" : adjudication.status === "returned-awaiting-codex-review" ? "Codex" : "platform-owner";
  if (adjudication.owner !== expectedOwner) errors.push(`Phaser candidate evidence adjudication owner must be ${expectedOwner} for this state.`);
  for (const field of ["wrapperProposalAllowed", "integrationApprovalAllowed", "routeWriteAllowed", "studentAssignmentAllowed"] as const) {
    if (adjudication[field] !== false) errors.push(`Phaser candidate evidence adjudication ${field} must remain false.`);
  }
  for (const action of PHASER_CANDIDATE_EVIDENCE_ADJUDICATION_BLOCKED_ACTIONS) {
    if (!adjudication.blockedActions.includes(action)) errors.push(`Phaser candidate evidence adjudication must block: ${action}.`);
  }
  if (adjudication.status === "returned-awaiting-codex-review" && packetErrors.length > 0) {
    errors.push("A returned-awaiting-codex-review adjudication cannot contain packet validation errors.");
  }
  return [...new Set(errors)];
}
