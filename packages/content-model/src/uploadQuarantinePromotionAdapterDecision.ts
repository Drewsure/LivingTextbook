export type UploadQuarantinePromotionAdapter =
  | "closed-local-package"
  | "hosted-pwa-package"
  | "hybrid-package";

export interface UploadQuarantinePromotionAdapterDecision {
  recordVersion: 1;
  decisionId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedAdapter: UploadQuarantinePromotionAdapter;
  reviewerId: string;
  reviewerNote: string;
  reviewedAt: string;
  status: "selected-review-only";
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
  hostedPersistenceActivated: false;
  blockers: string[];
  nextSteps: string[];
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantinePromotionAdapterDecision(input: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedAdapter: UploadQuarantinePromotionAdapter;
  reviewerId: string;
  reviewerNote: string;
  reviewedAt: string;
}): UploadQuarantinePromotionAdapterDecision {
  return {
    recordVersion: 1,
    decisionId: `${input.packageId}:${input.quarantineId}:promotion-adapter-decision`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    sourceChecksumSha256: input.sourceChecksumSha256,
    selectedAdapter: input.selectedAdapter,
    reviewerId: input.reviewerId,
    reviewerNote: input.reviewerNote,
    reviewedAt: input.reviewedAt,
    status: "selected-review-only",
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
    hostedPersistenceActivated: false,
    blockers: [
      "Promotion adapter selection is review-only and does not authorize package promotion.",
      "Release, QR print, policy, rollback, and student gates remain separate.",
    ],
    nextSteps: [
      "Complete the reviewed package packet and named release receipt.",
      "Verify the adapter against tenant policy, asset evidence, and recovery requirements.",
      "Authorize assembly, QR printing, and student use only through their separate gates.",
    ],
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateUploadQuarantinePromotionAdapterDecision(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine promotion adapter decision must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine promotion adapter decision recordVersion must be 1.");
  for (const field of ["decisionId", "tenantId", "quarantineId", "packageId", "sourceChecksumSha256", "reviewerId", "reviewerNote", "reviewedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine promotion adapter decision ${field} must be non-empty.`);
  }
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Upload quarantine promotion adapter decision checksum must be lowercase SHA-256.");
  if (!["closed-local-package", "hosted-pwa-package", "hybrid-package"].includes(String(value.selectedAdapter))) errors.push("Upload quarantine promotion adapter decision selectedAdapter is unsupported.");
  if (value.status !== "selected-review-only") errors.push("Upload quarantine promotion adapter decision status must remain selected-review-only.");
  for (const field of ["packageAssemblyAllowed", "promotionAllowed", "qrPrintAllowed", "studentFacingUseAllowed", "hostedPersistenceActivated"] as const) if (value[field] !== false) errors.push(`Upload quarantine promotion adapter decision ${field} must remain false.`);
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Upload quarantine promotion adapter decision must remain review-only and side-effect-free.");
  if (!isSafeIdentifier(value.decisionId) || !isSafeIdentifier(value.tenantId) || !isSafeIdentifier(value.quarantineId) || !isSafeIdentifier(value.packageId) || !isSafeReviewerId(value.reviewerId)) errors.push("Upload quarantine promotion adapter decision identities must be bounded and safe.");
  if (typeof value.reviewerNote === "string" && (value.reviewerNote.length > 2000 || value.reviewerNote.trim().length === 0)) errors.push("Upload quarantine promotion adapter decision reviewerNote must be between 1 and 2000 characters.");
  if (typeof value.reviewedAt === "string" && Number.isNaN(Date.parse(value.reviewedAt))) errors.push("Upload quarantine promotion adapter decision reviewedAt must be a valid timestamp.");
  for (const field of ["blockers", "nextSteps"] as const) if (!Array.isArray(value[field]) || value[field].length === 0 || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Upload quarantine promotion adapter decision ${field} must contain non-empty strings.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeIdentifier(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value); }
function isSafeReviewerId(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 160 && /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(value); }
