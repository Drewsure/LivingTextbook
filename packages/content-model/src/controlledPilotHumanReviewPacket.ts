import type { ControlledPilotApprovalReadiness } from "./controlledPilotApprovalReadiness";

export type ControlledPilotHumanReviewPacketStatus = "blocked" | "awaiting-human-review";

export interface ControlledPilotHumanReviewPacket {
  recordVersion: 1;
  packetId: string;
  readinessId: string;
  releaseBindingId: string;
  pilotDecisionId: string;
  reviewerGateId: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionStatus: "blocked";
  storageSelectionAllowed: false;
  tenantId: string;
  packageId: string;
  status: ControlledPilotHumanReviewPacketStatus;
  mode: "review-only";
  reviewerIdentityRequired: true;
  approvalIntentCaptured: false;
  signedApprovalCaptured: false;
  packetFreezeAllowed: false;
  approvalCaptureAllowed: false;
  releaseMutationAllowed: false;
  studentLaunchAllowed: false;
  evidenceReferences: string[];
  requiredHumanRecords: string[];
  blockedActions: string[];
  nextGate: string;
}

const BLOCKED_ACTIONS = [
  "No approval intent capture",
  "No signed approval capture",
  "No packet version freeze",
  "No release-state mutation",
  "No assignment activation",
  "No student launch",
] as const;

export function createControlledPilotHumanReviewPacket(
  readiness: ControlledPilotApprovalReadiness,
): ControlledPilotHumanReviewPacket {
  const status: ControlledPilotHumanReviewPacketStatus = readiness.status === "ready-for-human-review"
    ? "awaiting-human-review"
    : "blocked";

  return {
    recordVersion: 1,
    packetId: `controlled-pilot-human-review-packet-v1:${readiness.readinessId}`,
    readinessId: readiness.readinessId,
    releaseBindingId: readiness.releaseBindingId,
    pilotDecisionId: readiness.pilotDecisionId,
    reviewerGateId: readiness.reviewerGateId,
    storageSelectionPreflightId: readiness.storageSelectionPreflightId,
    storageSelectionGateId: readiness.storageSelectionGateId,
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
    tenantId: readiness.tenantId,
    packageId: readiness.packageId,
    status,
    mode: "review-only",
    reviewerIdentityRequired: true,
    approvalIntentCaptured: false,
    signedApprovalCaptured: false,
    packetFreezeAllowed: false,
    approvalCaptureAllowed: false,
    releaseMutationAllowed: false,
    studentLaunchAllowed: false,
    evidenceReferences: [
      readiness.readinessId,
      readiness.releaseBindingId,
      readiness.pilotDecisionId,
      readiness.reviewerGateId,
      readiness.storageSelectionPreflightId,
      readiness.storageSelectionGateId,
    ],
    requiredHumanRecords: [...readiness.requiredHumanRecords, "human review decision record", "approval scope and revocation record"],
    blockedActions: [...BLOCKED_ACTIONS],
    nextGate: status === "awaiting-human-review"
      ? "A separately authorized reviewer may inspect this packet; approval capture remains disabled."
      : "Resolve controlled-pilot readiness blockers before human review can begin.",
  };
}

export function validateControlledPilotHumanReviewPacket(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Controlled pilot human review packet must be a JSON object."];
  if (value.recordVersion !== 1) errors.push("Controlled pilot human review packet recordVersion must be 1.");
  for (const field of ["packetId", "readinessId", "releaseBindingId", "pilotDecisionId", "reviewerGateId", "storageSelectionPreflightId", "storageSelectionGateId", "tenantId", "packageId", "nextGate"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Controlled pilot human review packet ${field} must be non-empty.`);
  }
  if (value.status !== "blocked" && value.status !== "awaiting-human-review") errors.push("Controlled pilot human review packet status is unsupported.");
  if (value.mode !== "review-only") errors.push("Controlled pilot human review packet must remain review-only.");
  if (value.storageSelectionStatus !== "blocked") errors.push("Controlled pilot human review packet storage selection must remain blocked.");
  if (value.storageSelectionAllowed !== false) errors.push("Controlled pilot human review packet storage selection must remain false.");
  if (value.reviewerIdentityRequired !== true) errors.push("Controlled pilot human review packet must require reviewer identity.");
  for (const field of ["approvalIntentCaptured", "signedApprovalCaptured", "packetFreezeAllowed", "approvalCaptureAllowed", "releaseMutationAllowed", "studentLaunchAllowed"] as const) {
    if (value[field] !== false) errors.push(`Controlled pilot human review packet ${field} must remain false.`);
  }
  const evidenceReferences = readStringArray(value, "evidenceReferences");
  if (evidenceReferences.length !== 6) errors.push("Controlled pilot human review packet must carry six exact evidence references.");
  if (new Set(evidenceReferences).size !== evidenceReferences.length) errors.push("Controlled pilot human review packet evidence references must be unique.");
  for (const field of ["readinessId", "releaseBindingId", "pilotDecisionId", "reviewerGateId", "storageSelectionPreflightId", "storageSelectionGateId"] as const) {
    const reference = readString(value, field);
    if (reference && !evidenceReferences.includes(reference)) errors.push(`Controlled pilot human review packet evidence references must include ${field}.`);
  }
  const requiredHumanRecords = readStringArray(value, "requiredHumanRecords");
  if (requiredHumanRecords.length < 2) errors.push("Controlled pilot human review packet must list human review records.");
  if (new Set(requiredHumanRecords).size !== requiredHumanRecords.length) errors.push("Controlled pilot human review packet human records must be unique.");
  const blockedActions = readStringArray(value, "blockedActions");
  for (const action of BLOCKED_ACTIONS) if (!blockedActions.includes(action)) errors.push(`Controlled pilot human review packet must block: ${action}.`);
  if (value.status === "blocked" && !String(value.nextGate ?? "").toLowerCase().includes("blocker")) errors.push("Blocked human review packet must direct the reviewer to resolve blockers.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: Record<string, unknown>, key: string): string {
  return typeof value[key] === "string" ? value[key].trim() : "";
}

function readStringArray(value: Record<string, unknown>, key: string): string[] {
  return Array.isArray(value[key]) ? value[key].filter((item): item is string => isNonEmptyString(item)).map((item) => item.trim()) : [];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
