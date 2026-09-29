export type HostedPersistenceOptInDecisionStatus = "blocked" | "ready-for-human-opt-in";
export type HostedPersistenceOptInDeliveryMode = "hosted-managed" | "hybrid-registry-local-media";
export type HostedPersistenceOptInCheckStatus = "passed" | "open" | "blocked";
export type HostedPersistenceOptInCheckOwner = "platform" | "tenant" | "joint";

export interface HostedPersistenceOptInDecisionCheck {
  checkId: string;
  label: string;
  owner: HostedPersistenceOptInCheckOwner;
  status: HostedPersistenceOptInCheckStatus;
  evidence: string;
  nextAction: string;
}

export interface HostedPersistenceOptInDecisionPacket {
  recordVersion: 1;
  packetId: string;
  tenantId: string;
  packageId: string;
  quarantineId: string;
  reviewPacketId: string;
  sourceChecksumSha256: string;
  providerSelectionPreflightId: string;
  persistenceActivationPreflightId: string;
  policyRecordId: string;
  releaseDecisionId: string;
  rollbackRehearsalId: string;
  deliveryMode: HostedPersistenceOptInDeliveryMode;
  providerCandidateId: string;
  status: HostedPersistenceOptInDecisionStatus;
  summary: string;
  decision: "not-recorded";
  reviewOnly: true;
  providerSelected: false;
  optInRecorded: false;
  writesAllowed: false;
  activationAllowed: false;
  learnerRecordsIncluded: false;
  checks: HostedPersistenceOptInDecisionCheck[];
  blockedReasons: string[];
  requiredDecisions: string[];
  nextSteps: string[];
  sideEffect: "none";
}

const REQUIRED_CHECKS = [
  "package-review-lineage",
  "provider-selection",
  "policy-retention",
  "release-deployment",
  "cost-usage",
  "rollback-export",
  "write-boundary",
] as const;

export function validateHostedPersistenceOptInDecisionPacket(
  packet: HostedPersistenceOptInDecisionPacket,
): string[] {
  const errors: string[] = [];
  if (packet.recordVersion !== 1) errors.push("Hosted persistence opt-in packet recordVersion must be 1.");
  for (const field of [
    "packetId", "tenantId", "packageId", "quarantineId", "reviewPacketId", "sourceChecksumSha256",
    "providerSelectionPreflightId", "persistenceActivationPreflightId", "policyRecordId", "releaseDecisionId",
    "rollbackRehearsalId", "providerCandidateId", "summary",
  ] as const) {
    if (typeof packet[field] !== "string" || packet[field].trim().length === 0) errors.push(`Hosted persistence opt-in packet ${field} must be non-empty.`);
  }
  if (!/^[a-f0-9]{64}$/i.test(packet.sourceChecksumSha256)) errors.push("Hosted persistence opt-in packet sourceChecksumSha256 must be a SHA-256 value.");
  if (packet.deliveryMode !== "hosted-managed" && packet.deliveryMode !== "hybrid-registry-local-media") errors.push("Hosted persistence opt-in packet deliveryMode is unsupported.");
  if (packet.status !== "blocked" && packet.status !== "ready-for-human-opt-in") errors.push("Hosted persistence opt-in packet status is unsupported.");
  if (packet.decision !== "not-recorded") errors.push("Hosted persistence opt-in packet decision must remain not-recorded.");
  for (const field of ["reviewOnly", "providerSelected", "optInRecorded", "writesAllowed", "activationAllowed", "learnerRecordsIncluded"] as const) {
    if (packet[field] !== (field === "reviewOnly")) errors.push(`Hosted persistence opt-in packet ${field} must remain ${field === "reviewOnly" ? "true" : "false"}.`);
  }
  if (packet.sideEffect !== "none") errors.push("Hosted persistence opt-in packet sideEffect must remain none.");
  if (!Array.isArray(packet.checks) || packet.checks.length === 0) errors.push("Hosted persistence opt-in packet checks must be non-empty.");
  for (const [field, label] of [["blockedReasons", "blocked reasons"], ["requiredDecisions", "required decisions"], ["nextSteps", "next steps"]] as const) {
    if (!Array.isArray(packet[field]) || packet[field].length === 0 || packet[field].some((value) => typeof value !== "string" || value.trim().length === 0)) errors.push(`Hosted persistence opt-in packet ${label} must contain non-empty strings.`);
  }
  const checksById = new Map<string, HostedPersistenceOptInDecisionCheck>();
  for (const check of packet.checks) {
    if (!check || typeof check !== "object") { errors.push("Hosted persistence opt-in packet checks must be objects."); continue; }
    if (checksById.has(check.checkId)) errors.push(`Hosted persistence opt-in packet contains duplicate check ${check.checkId}.`);
    checksById.set(check.checkId, check);
    for (const field of ["checkId", "label", "evidence", "nextAction"] as const) if (typeof check[field] !== "string" || check[field].trim().length === 0) errors.push(`Hosted persistence opt-in packet check ${field} must be non-empty.`);
    if (!(check.owner === "platform" || check.owner === "tenant" || check.owner === "joint")) errors.push(`Hosted persistence opt-in packet check ${check.checkId} owner is unsupported.`);
    if (!(check.status === "passed" || check.status === "open" || check.status === "blocked")) errors.push(`Hosted persistence opt-in packet check ${check.checkId} status is unsupported.`);
  }
  for (const checkId of REQUIRED_CHECKS) if (!checksById.has(checkId)) errors.push(`Hosted persistence opt-in packet is missing required check ${checkId}.`);
  if (packet.status === "blocked" && packet.blockedReasons.length === 0) errors.push("Blocked hosted persistence opt-in packet must list blocked reasons.");
  if (packet.status === "ready-for-human-opt-in" && packet.checks.some((check) => check.status === "blocked" || check.status === "open")) errors.push("Ready hosted persistence opt-in packet cannot contain open or blocked checks.");
  return [...new Set(errors)];
}
