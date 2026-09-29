export type UploadQuarantineDeliveryMode = "closed-local" | "hosted-pwa" | "hybrid";

export interface UploadQuarantineDeliveryModeDecision {
  recordVersion: 1;
  decisionId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedMode: UploadQuarantineDeliveryMode;
  reviewerId: string;
  reviewerNote: string;
  reviewedAt: string;
  status: "selected-review-only";
  hostedPersistenceDecisionPacketId: null;
  policyAccepted: false;
  providerSelected: false;
  persistenceActivationAllowed: false;
  packageAssemblyAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
  blockers: string[];
  nextSteps: string[];
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantineDeliveryModeDecision(input: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedMode: UploadQuarantineDeliveryMode;
  reviewerId: string;
  reviewerNote: string;
  reviewedAt: string;
}): UploadQuarantineDeliveryModeDecision {
  const hosted = input.selectedMode === "hosted-pwa" || input.selectedMode === "hybrid";
  return {
    recordVersion: 1,
    decisionId: `${input.packageId}:${input.quarantineId}:delivery-mode-decision`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    sourceChecksumSha256: input.sourceChecksumSha256,
    selectedMode: input.selectedMode,
    reviewerId: input.reviewerId,
    reviewerNote: input.reviewerNote,
    reviewedAt: input.reviewedAt,
    status: "selected-review-only",
    hostedPersistenceDecisionPacketId: null,
    policyAccepted: false,
    providerSelected: false,
    persistenceActivationAllowed: false,
    packageAssemblyAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
    blockers: [
      "Delivery mode selection is review-only and does not authorize package assembly.",
      "Release, QR print, teacher policy, and rollback evidence remain separate gates.",
      ...(hosted ? ["Hosted persistence provider, cost, policy, and opt-in approval remain separate gates."] : []),
    ],
    nextSteps: [
      "Attach the reviewed multimedia and game package evidence.",
      "Complete the delivery manifest and named release receipt.",
      ...(hosted ? ["Complete hosted persistence provider and school-policy review while preserving local fallback."] : ["Complete local bundle, device, update, backup, and recovery review."]),
      "Authorize QR printing only after release checksum and rollback evidence pass.",
    ],
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateUploadQuarantineDeliveryModeDecision(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine delivery mode decision must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine delivery mode decision recordVersion must be 1.");
  for (const field of ["decisionId", "tenantId", "quarantineId", "packageId", "sourceChecksumSha256", "reviewerId", "reviewerNote", "reviewedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine delivery mode decision ${field} must be non-empty.`);
  }
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Upload quarantine delivery mode decision checksum must be lowercase SHA-256.");
  if (!["closed-local", "hosted-pwa", "hybrid"].includes(String(value.selectedMode))) errors.push("Upload quarantine delivery mode decision selectedMode is unsupported.");
  if (value.status !== "selected-review-only") errors.push("Upload quarantine delivery mode decision status must remain selected-review-only.");
  if (value.hostedPersistenceDecisionPacketId !== null) errors.push("Delivery mode selection cannot carry hosted persistence opt-in packet identity.");
  for (const field of ["policyAccepted", "providerSelected", "persistenceActivationAllowed", "packageAssemblyAllowed", "qrPrintAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`Upload quarantine delivery mode decision ${field} must remain false.`);
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Upload quarantine delivery mode decision must remain review-only and side-effect-free.");
  if (!isSafeIdentifier(value.decisionId) || !isSafeIdentifier(value.tenantId) || !isSafeIdentifier(value.quarantineId) || !isSafeIdentifier(value.packageId) || !isSafeReviewerId(value.reviewerId)) errors.push("Upload quarantine delivery mode decision identities must be bounded and safe.");
  if (typeof value.reviewerNote === "string" && (value.reviewerNote.length > 2000 || value.reviewerNote.trim().length === 0)) errors.push("Upload quarantine delivery mode decision reviewerNote must be between 1 and 2000 characters.");
  if (typeof value.reviewedAt === "string" && Number.isNaN(Date.parse(value.reviewedAt))) errors.push("Upload quarantine delivery mode decision reviewedAt must be a valid timestamp.");
  for (const field of ["blockers", "nextSteps"] as const) if (!Array.isArray(value[field]) || value[field].length === 0 || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Upload quarantine delivery mode decision ${field} must contain non-empty strings.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeIdentifier(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value); }
function isSafeReviewerId(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 160 && /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(value); }
