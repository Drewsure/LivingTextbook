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

export function createReviewOnlyHostedPersistenceOptInDecisionPacket(input: {
  tenantId: string;
  packageId: string;
  quarantineId: string;
  reviewPacketId: string;
  sourceChecksumSha256: string;
  deliveryMode: HostedPersistenceOptInDeliveryMode;
  packageReviewLineageStatus: HostedPersistenceOptInCheckStatus;
  packageReviewLineageEvidence: string;
}): HostedPersistenceOptInDecisionPacket {
  const packetId = `${input.packageId}:${input.quarantineId}:hosted-persistence-opt-in`;
  const checks: HostedPersistenceOptInDecisionCheck[] = [
    { checkId: "package-review-lineage", label: "Reviewed package lineage", owner: "platform", status: input.packageReviewLineageStatus, evidence: input.packageReviewLineageEvidence, nextAction: "Keep the packet, source checksum, package evidence, and tenant identity bound together." },
    { checkId: "provider-selection", label: "Provider and deployment choice", owner: "joint", status: "blocked", evidence: "No provider-specific hosted implementation is selected for this live package.", nextAction: "Record a named provider only after capability, privacy, and cost review." },
    { checkId: "policy-retention", label: "School policy, retention, and deletion", owner: "tenant", status: "open", evidence: "School data scope, retention duration, deletion owner, and export policy are not recorded in the live packet.", nextAction: "Approve the tenant policy and deletion responsibility." },
    { checkId: "release-deployment", label: "Release and deployment approval", owner: "joint", status: "blocked", evidence: "Hosted release and deployment continuity remain separate review-only gates.", nextAction: "Complete release, environment, QR, and rollback evidence." },
    { checkId: "cost-usage", label: "Provider cost and usage limits", owner: "joint", status: "open", evidence: "A pilot budget, usage ceiling, and escalation owner are not recorded.", nextAction: "Set a cost ceiling and usage policy for this tenant." },
    { checkId: "rollback-export", label: "Hosted/local export and rollback", owner: "platform", status: "open", evidence: "A matching hosted export, deletion, provider-loss, and return-to-local rehearsal is not attached.", nextAction: "Complete the hosted/local recovery rehearsal." },
    { checkId: "write-boundary", label: "Learner-write boundary", owner: "platform", status: "passed", evidence: "This preview contains no provider credential, learner record, write capability, or activation control.", nextAction: "Keep hosted writes disabled until a separate human opt-in and provider approval are recorded." },
  ];
  const packet: HostedPersistenceOptInDecisionPacket = {
    recordVersion: 1,
    packetId,
    tenantId: input.tenantId,
    packageId: input.packageId,
    quarantineId: input.quarantineId,
    reviewPacketId: input.reviewPacketId,
    sourceChecksumSha256: input.sourceChecksumSha256,
    providerSelectionPreflightId: `${packetId}:provider-selection-preflight`,
    persistenceActivationPreflightId: `${packetId}:persistence-activation-preflight`,
    policyRecordId: `${packetId}:policy-not-recorded`,
    releaseDecisionId: `${packetId}:release-not-recorded`,
    rollbackRehearsalId: `${packetId}:rollback-not-rehearsed`,
    deliveryMode: input.deliveryMode,
    providerCandidateId: "hosted-provider-not-selected",
    status: "blocked",
    summary: "A package-scoped, review-only hosted persistence preview derived from the live publisher intake lineage.",
    decision: "not-recorded",
    reviewOnly: true,
    providerSelected: false,
    optInRecorded: false,
    writesAllowed: false,
    activationAllowed: false,
    learnerRecordsIncluded: false,
    checks,
    blockedReasons: [
      "Human hosted-persistence opt-in has not been recorded for this tenant and package.",
      "Provider selection, school policy, cost limits, release approval, and rollback evidence remain incomplete.",
    ],
    requiredDecisions: [
      "Select a hosted provider or retain closed-local delivery.",
      "Accept school data, retention, deletion, export, and cost policy.",
      "Approve release ownership and hosted/local rollback rehearsal.",
    ],
    nextSteps: [
      "Complete the publisher and school decision packet without enabling writes.",
      "Create provider-specific implementation work only after the decision gates pass.",
      "Run a controlled teacher/student rehearsal before any learner record is retained.",
    ],
    sideEffect: "none",
  };
  const errors = validateHostedPersistenceOptInDecisionPacket(packet);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return packet;
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
