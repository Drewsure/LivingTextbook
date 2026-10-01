export type PublisherDeliveryClosureCheckStatus = "passed" | "open" | "blocked";

export interface PublisherDeliveryClosureCheck {
  checkId: string;
  label: string;
  status: PublisherDeliveryClosureCheckStatus;
  evidence: string;
  nextAction: string;
}

export interface PublisherDeliveryClosurePacket {
  recordVersion: 1;
  packetId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceId: string;
  sourceChecksumSha256: string;
  publisherEvidenceRequestIds: string[];
  selectedMode: "unselected" | "closed-local" | "hosted-pwa" | "hybrid";
  status: "blocked";
  checks: PublisherDeliveryClosureCheck[];
  requiredHumanInputs: string[];
  blockedActions: string[];
  releaseWriteAllowed: false;
  packageAssemblyAllowed: false;
  qrPrintAllowed: false;
  persistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const requiredCheckIds = [
  "source-review",
  "sentence-approval",
  "package-evidence",
  "canonical-game-evidence",
  "review-packet",
  "assembly-preflight",
  "delivery-mode",
  "release-receipt",
  "qr-authorization",
  "package-index",
  "rollback-and-policy",
] as const;

const blockedActions = [
  "No release receipt write",
  "No package assembly",
  "No QR print",
  "No hosted persistence activation",
  "No student-facing use",
] as const;

export function createPublisherDeliveryClosurePacket(input: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceId: string;
  sourceChecksumSha256: string;
  publisherEvidenceRequestIds: string[];
  selectedMode: PublisherDeliveryClosurePacket["selectedMode"];
  sourceReviewPassed: boolean;
  sentenceApprovalPassed: boolean;
  packageEvidencePassed: boolean;
  canonicalGameEvidencePassed: boolean;
  reviewPacketPassed: boolean;
  assemblyPreflightPassed: boolean;
  deliveryModePassed: boolean;
  releaseReceiptPassed: boolean;
  qrAuthorizationPassed: boolean;
  packageIndexPassed: boolean;
  rollbackAndPolicyPassed: boolean;
}): PublisherDeliveryClosurePacket {
  const check = (checkId: string, label: string, passed: boolean, evidence: string, nextAction: string): PublisherDeliveryClosureCheck => ({
    checkId,
    label,
    status: passed ? "passed" : "blocked",
    evidence,
    nextAction,
  });
  const checks = [
    check("source-review", "Source review", input.sourceReviewPassed, input.sourceReviewPassed ? "The source review decision is accepted for package review." : "The source review decision is not accepted for package release.", "Record an accepted source review decision against this quarantine."),
    check("sentence-approval", "English sentence approval", input.sentenceApprovalPassed, input.sentenceApprovalPassed ? "Exactly two approved English target sentences are bound to this package checksum." : "The checksum-bound approval for the two English target sentences is missing or mismatched.", "Approve exactly two distinct English target sentences before release review."),
    check("package-evidence", "Content, game, and multimedia evidence", input.packageEvidencePassed, input.packageEvidencePassed ? "The reviewed content, game, audio, video, image, font, accessibility, and rights lanes are recorded." : "One or more content, game, audio, media, accessibility, or rights lanes remain incomplete.", "Complete and bind every reviewed package evidence lane."),
    check("canonical-game-evidence", "Canonical game evidence", input.canonicalGameEvidencePassed, input.canonicalGameEvidencePassed ? "The curated pathway, canonical game integration, and package game-audio evidence records are complete." : "The complete canonical game evidence set is missing or incomplete.", "Confirm all canonical game-derived evidence records before package closure."),
    check("review-packet", "Immutable review packet", input.reviewPacketPassed, input.reviewPacketPassed ? "The package review packet is ready for the next gate." : "The package review packet is missing or blocked.", "Record and reconcile the immutable package review packet."),
    check("assembly-preflight", "Package assembly preflight", input.assemblyPreflightPassed, input.assemblyPreflightPassed ? "Assembly inputs are reconciled for human release review." : "Package assembly preflight still has blockers or missing inputs.", "Resolve the preflight blockers without treating preflight as approval."),
    check("delivery-mode", "Delivery mode and adapter", input.deliveryModePassed, input.deliveryModePassed ? `The ${input.selectedMode} delivery shape is selected.` : "No complete delivery mode and adapter decision is recorded.", "Choose closed-local, hosted PWA, or hybrid and record its policy evidence."),
    check("release-receipt", "Named release receipt", input.releaseReceiptPassed, input.releaseReceiptPassed ? "A named release receipt is available for closure review." : "No approved release receipt is linked to this packet.", "A named reviewer must approve the exact manifest checksum and rollback reference."),
    check("qr-authorization", "QR registry and print authorization", input.qrAuthorizationPassed, input.qrAuthorizationPassed ? "QR registry and print evidence are reconciled." : "QR registry or production print authorization is incomplete.", "Verify stable aliases, local fallback, checksum, and human print authorization."),
    check("package-index", "Package index and integrity", input.packageIndexPassed, input.packageIndexPassed ? "The package index and integrity identity are reconciled." : "No approved package index and integrity readback are linked.", "Create and read back the index only after release approval."),
    check("rollback-and-policy", "Rollback, school policy, and support", input.rollbackAndPolicyPassed, input.rollbackAndPolicyPassed ? "Rollback, teacher policy, retention, and support evidence are recorded." : "Rollback, policy, retention, or support evidence remains incomplete.", "Attach the human policy and recovery decision before release."),
  ];
  return {
    recordVersion: 1,
    packetId: `${input.packageId}:${input.quarantineId}:delivery-closure`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    sourceId: input.sourceId,
    sourceChecksumSha256: input.sourceChecksumSha256,
    publisherEvidenceRequestIds: [...new Set(input.publisherEvidenceRequestIds)],
    selectedMode: input.selectedMode,
    status: "blocked",
    checks,
    requiredHumanInputs: [
      "Named publisher or school release owner",
      "Approved textbook source and rights owner",
      "Approved multimedia, game, audio, accessibility, and font evidence",
      "Chosen closed-local, hosted, or hybrid delivery policy",
      "Rollback, retention, privacy, and support decision",
      "Human QR print authorization and teacher rehearsal receipt",
    ],
    blockedActions: [...blockedActions],
    releaseWriteAllowed: false,
    packageAssemblyAllowed: false,
    qrPrintAllowed: false,
    persistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validatePublisherDeliveryClosurePacket(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher delivery closure packet must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher delivery closure packet recordVersion must be 1.");
  for (const field of ["packetId", "tenantId", "quarantineId", "packageId", "sourceId"] as const) if (!isNonEmptyString(value[field])) errors.push(`Publisher delivery closure packet ${field} must be non-empty.`);
  if (!Array.isArray(value.publisherEvidenceRequestIds) || value.publisherEvidenceRequestIds.length === 0 || value.publisherEvidenceRequestIds.some((referenceId) => !isNonEmptyString(referenceId)) || new Set(value.publisherEvidenceRequestIds).size !== value.publisherEvidenceRequestIds.length) errors.push("Publisher delivery closure packet publisher evidence request IDs must be unique and non-empty.");
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Publisher delivery closure packet checksum must be lowercase SHA-256.");
  if (!["unselected", "closed-local", "hosted-pwa", "hybrid"].includes(String(value.selectedMode))) errors.push("Publisher delivery closure packet selectedMode is unsupported.");
  if (value.status !== "blocked" || value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Publisher delivery closure packet must remain blocked, review-only, and side-effect-free.");
  if (!Array.isArray(value.checks) || value.checks.length !== requiredCheckIds.length) errors.push("Publisher delivery closure packet must contain all required closure checks.");
  const seen = new Set<string>();
  for (const check of Array.isArray(value.checks) ? value.checks : []) {
    if (!isRecord(check)) { errors.push("Publisher delivery closure checks must be objects."); continue; }
    if (!isNonEmptyString(check.checkId) || seen.has(String(check.checkId))) errors.push("Publisher delivery closure check ids must be unique and non-empty.");
    seen.add(String(check.checkId));
    if (!isNonEmptyString(check.label) || !isNonEmptyString(check.evidence) || !isNonEmptyString(check.nextAction)) errors.push("Publisher delivery closure checks require label, evidence, and nextAction.");
    if (!["passed", "open", "blocked"].includes(String(check.status))) errors.push("Publisher delivery closure check status is unsupported.");
  }
  for (const checkId of requiredCheckIds) if (!seen.has(checkId)) errors.push(`Publisher delivery closure packet is missing check ${checkId}.`);
  if (!Array.isArray(value.requiredHumanInputs) || value.requiredHumanInputs.length === 0 || value.requiredHumanInputs.some((item) => !isNonEmptyString(item))) errors.push("Publisher delivery closure packet requiredHumanInputs must be non-empty.");
  if (!Array.isArray(value.blockedActions) || value.blockedActions.length === 0) errors.push("Publisher delivery closure packet blockedActions must be non-empty.");
  for (const action of blockedActions) if (!Array.isArray(value.blockedActions) || !value.blockedActions.includes(action)) errors.push(`Publisher delivery closure packet must block action: ${action}.`);
  for (const field of ["releaseWriteAllowed", "packageAssemblyAllowed", "qrPrintAllowed", "persistenceActivationAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
