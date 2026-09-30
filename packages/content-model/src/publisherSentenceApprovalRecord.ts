export type PublisherSentenceApprovalDecision = "approved" | "changes-required";

export interface PublisherSentenceApprovalRecord {
  recordVersion: 1;
  approvalId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  proposalId: string;
  sourceChecksumSha256: string;
  targetLanguage: "en";
  targetSentences: [string, string];
  reviewerId: string;
  reviewerNote: string;
  decision: PublisherSentenceApprovalDecision;
  capturedAt: string;
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createPublisherSentenceApprovalRecord(input: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  proposalId: string;
  sourceChecksumSha256: string;
  targetSentences: [string, string];
  reviewerId: string;
  reviewerNote: string;
  decision: PublisherSentenceApprovalDecision;
  capturedAt: string;
}): PublisherSentenceApprovalRecord {
  return {
    recordVersion: 1,
    approvalId: `${input.packageId}:${input.quarantineId}:sentence-approval`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    proposalId: input.proposalId,
    sourceChecksumSha256: input.sourceChecksumSha256,
    targetLanguage: "en",
    targetSentences: [input.targetSentences[0].trim(), input.targetSentences[1].trim()],
    reviewerId: input.reviewerId,
    reviewerNote: input.reviewerNote.trim(),
    decision: input.decision,
    capturedAt: input.capturedAt,
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validatePublisherSentenceApprovalRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher sentence approval record must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher sentence approval recordVersion must be 1.");
  for (const field of ["approvalId", "tenantId", "quarantineId", "packageId", "proposalId", "sourceChecksumSha256", "reviewerId", "reviewerNote", "capturedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Publisher sentence approval ${field} must be non-empty.`);
  }
  if (!isSafeIdentifier(value.approvalId) || !isSafeIdentifier(value.tenantId) || !isSafeIdentifier(value.quarantineId) || !isSafeIdentifier(value.packageId) || !isSafeIdentifier(value.proposalId) || !isSafeReviewerId(value.reviewerId)) {
    errors.push("Publisher sentence approval identities must be bounded and safe.");
  }
  if (!/^q-[0-9a-f-]{36}$/.test(String(value.quarantineId ?? ""))) errors.push("Publisher sentence approval quarantine identity is not opaque.");
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Publisher sentence approval checksum must be lowercase SHA-256.");
  if (value.targetLanguage !== "en") errors.push("Publisher sentence approval must approve English target sentences; support language is separate.");
  if (!Array.isArray(value.targetSentences) || value.targetSentences.length !== 2 || value.targetSentences.some((sentence) => !isNonEmptyString(sentence) || sentence.length > 500)) {
    errors.push("Publisher sentence approval must contain exactly two bounded, non-empty target sentences.");
  } else if (value.targetSentences[0].trim().toLowerCase() === value.targetSentences[1].trim().toLowerCase()) {
    errors.push("Publisher sentence approval target sentences must be distinct.");
  }
  if (typeof value.reviewerNote === "string" && (value.reviewerNote.trim().length === 0 || value.reviewerNote.length > 2000)) errors.push("Publisher sentence approval reviewerNote must be between 1 and 2000 characters.");
  if (typeof value.capturedAt === "string" && Number.isNaN(Date.parse(value.capturedAt))) errors.push("Publisher sentence approval capturedAt must be a valid timestamp.");
  if (value.decision !== "approved" && value.decision !== "changes-required") errors.push("Publisher sentence approval decision is unsupported.");
  if (value.decision === "approved" && (!Array.isArray(value.targetSentences) || value.targetSentences.length !== 2)) errors.push("An approved sentence decision requires exactly two target sentences.");
  for (const field of ["packageAssemblyAllowed", "promotionAllowed", "qrPrintAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false for sentence approval.`);
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Publisher sentence approval must remain review-only and side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeIdentifier(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value); }
function isSafeReviewerId(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 160 && /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(value); }
