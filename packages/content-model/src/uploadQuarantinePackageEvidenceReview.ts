import {
  CANONICAL_GAME_DERIVED_EVIDENCE_RECORD_IDS,
  hasCompleteCanonicalGameEvidenceRecordIds,
} from "./publisherSubmissionPackageEvidenceReconciliation";

export type UploadQuarantinePackageEvidenceLane = "content" | "game" | "audio" | "video" | "image" | "font" | "accessibility" | "rights";
export type UploadQuarantinePackageEvidenceReviewStatus = "incomplete" | "reviewed-package-evidence";
export type UploadQuarantinePackageEvidenceReferenceOrigin = "publisher-asset" | "platform-derived";

export interface UploadQuarantinePackageEvidenceReference {
  lane: UploadQuarantinePackageEvidenceLane;
  referenceId: string;
  origin: UploadQuarantinePackageEvidenceReferenceOrigin;
}

export const UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES: readonly UploadQuarantinePackageEvidenceLane[] = [
  "content",
  "game",
  "audio",
  "video",
  "image",
  "font",
  "accessibility",
  "rights",
] as const;

export interface UploadQuarantinePackageEvidenceReview {
  recordVersion: 1;
  reviewId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  reviewerId: string;
  reviewerNote: string;
  reviewedAt: string;
  requiredLanes: UploadQuarantinePackageEvidenceLane[];
  reviewedLanes: UploadQuarantinePackageEvidenceLane[];
  evidenceReferences: UploadQuarantinePackageEvidenceReference[];
  canonicalGameDerivedEvidenceRecordIds: string[];
  status: UploadQuarantinePackageEvidenceReviewStatus;
  blockers: string[];
  nextSteps: string[];
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantinePackageEvidenceReview(input: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  reviewerId: string;
  reviewerNote: string;
  reviewedLanes: UploadQuarantinePackageEvidenceLane[];
  evidenceReferences: UploadQuarantinePackageEvidenceReference[];
  canonicalGameDerivedEvidenceRecordIds?: string[];
  reviewedAt: string;
}): UploadQuarantinePackageEvidenceReview {
  const reviewedLanes = [...new Set(input.reviewedLanes)];
  const evidenceReferences = [...input.evidenceReferences]
    .map((reference) => ({
      ...reference,
      origin: reference.origin ?? (reference.lane === "game" ? "platform-derived" : "publisher-asset"),
    }))
    .filter((reference, index, references) => references.findIndex((candidate) => candidate.lane === reference.lane) === index)
    .sort((left, right) => UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.indexOf(left.lane) - UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.indexOf(right.lane));
  const missingLanes = UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.filter((lane) => {
    const reference = evidenceReferences.find((candidate) => candidate.lane === lane);
    return !reviewedLanes.includes(lane) || !reference?.referenceId.trim();
  });
  const canonicalGameDerivedEvidenceRecordIds = [...new Set(input.canonicalGameDerivedEvidenceRecordIds ?? [])];
  if (reviewedLanes.includes("game") && !hasCompleteCanonicalGameEvidenceRecordIds(canonicalGameDerivedEvidenceRecordIds)) missingLanes.push("game");
  const uniqueMissingLanes = [...new Set(missingLanes)];
  const complete = uniqueMissingLanes.length === 0;
  return {
    recordVersion: 1,
    reviewId: `${input.packageId}:${input.quarantineId}:package-evidence-review`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    sourceChecksumSha256: input.sourceChecksumSha256,
    reviewerId: input.reviewerId,
    reviewerNote: input.reviewerNote,
    reviewedAt: input.reviewedAt,
    requiredLanes: [...UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES],
    reviewedLanes,
    evidenceReferences,
    canonicalGameDerivedEvidenceRecordIds,
    status: complete ? "reviewed-package-evidence" : "incomplete",
    blockers: complete ? [] : uniqueMissingLanes.map((lane) => `${lane} evidence has not been reviewed or is incomplete.`),
    nextSteps: [
      ...(complete ? ["Keep package assembly, release, and QR authorization as separate gates."] : ["Review every content, game, audio, video, image, font, accessibility, and rights lane."]),
      "Attach the final release receipt only after the reviewed package is assembled and rehearsed.",
    ],
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateUploadQuarantinePackageEvidenceReview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine package evidence review must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine package evidence review recordVersion must be 1.");
  for (const field of ["reviewId", "tenantId", "quarantineId", "packageId", "sourceChecksumSha256", "reviewerId", "reviewerNote", "reviewedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine package evidence review ${field} must be non-empty.`);
  }
  if (!/^q-[0-9a-f-]{36}$/.test(String(value.quarantineId ?? ""))) errors.push("Upload quarantine package evidence review quarantine identity is not opaque.");
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Upload quarantine package evidence review checksum must be lowercase SHA-256.");
  if (!isSafeIdentifier(value.reviewId) || !isSafeIdentifier(value.tenantId) || !isSafeIdentifier(value.quarantineId) || !isSafeIdentifier(value.packageId) || !isSafeReviewerId(value.reviewerId)) errors.push("Upload quarantine package evidence review identities must be bounded and safe.");
  if (typeof value.reviewerNote === "string" && (value.reviewerNote.trim().length === 0 || value.reviewerNote.length > 2000)) errors.push("Upload quarantine package evidence review reviewerNote must be between 1 and 2000 characters.");
  if (typeof value.reviewedAt === "string" && Number.isNaN(Date.parse(value.reviewedAt))) errors.push("Upload quarantine package evidence review reviewedAt must be a valid timestamp.");
  for (const field of ["requiredLanes", "reviewedLanes"] as const) {
    if (!Array.isArray(value[field]) || value[field].some((lane) => !UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.includes(lane as UploadQuarantinePackageEvidenceLane))) errors.push(`Upload quarantine package evidence review ${field} contains an unsupported lane.`);
    if (Array.isArray(value[field]) && new Set(value[field]).size !== value[field].length) errors.push(`Upload quarantine package evidence review ${field} must contain unique lanes.`);
  }
  const canonicalGameDerivedEvidenceRecordIds = value.canonicalGameDerivedEvidenceRecordIds;
  if (!Array.isArray(canonicalGameDerivedEvidenceRecordIds) || canonicalGameDerivedEvidenceRecordIds.some((recordId) => !isSafeIdentifier(recordId))) errors.push("Upload quarantine package evidence review canonical game evidence IDs must be safe strings.");
  if (Array.isArray(canonicalGameDerivedEvidenceRecordIds) && new Set(canonicalGameDerivedEvidenceRecordIds).size !== canonicalGameDerivedEvidenceRecordIds.length) errors.push("Upload quarantine package evidence review canonical game evidence IDs must be unique.");
  if (Array.isArray(canonicalGameDerivedEvidenceRecordIds) && canonicalGameDerivedEvidenceRecordIds.some((recordId) => !CANONICAL_GAME_DERIVED_EVIDENCE_RECORD_IDS.includes(recordId as typeof CANONICAL_GAME_DERIVED_EVIDENCE_RECORD_IDS[number]))) errors.push("Upload quarantine package evidence review canonical game evidence IDs must use the canonical derived record set.");
  if (JSON.stringify(value.requiredLanes) !== JSON.stringify([...UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES])) errors.push("Upload quarantine package evidence review requiredLanes must use the canonical lane order.");
  const reviewedLanes = Array.isArray(value.reviewedLanes) ? value.reviewedLanes as string[] : [];
  const evidenceReferences = Array.isArray(value.evidenceReferences) ? value.evidenceReferences : [];
  if (!Array.isArray(value.evidenceReferences)) errors.push("Upload quarantine package evidence review evidenceReferences must be an array.");
  const referenceLanes: string[] = [];
  for (const reference of evidenceReferences) {
    if (!isRecord(reference) || !UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.includes(reference.lane as UploadQuarantinePackageEvidenceLane) || !isSafeIdentifier(reference.referenceId) || !["publisher-asset", "platform-derived"].includes(String(reference.origin))) {
      errors.push("Upload quarantine package evidence review evidenceReferences must contain safe lane and referenceId pairs.");
      continue;
    }
    if (reference.lane === "game" && reference.origin !== "platform-derived") errors.push("Upload quarantine package evidence review game evidence must be platform-derived.");
    if (reference.lane !== "game" && reference.origin !== "publisher-asset") errors.push(`Upload quarantine package evidence review ${reference.lane} evidence must be publisher-asset.`);
    referenceLanes.push(String(reference.lane));
  }
  if (new Set(referenceLanes).size !== referenceLanes.length) errors.push("Upload quarantine package evidence review evidenceReferences must contain unique lanes.");
  const missing = UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.filter((lane) => !reviewedLanes.includes(lane) || !referenceLanes.includes(lane));
  if (reviewedLanes.includes("game") && referenceLanes.includes("game") && !hasCompleteCanonicalGameEvidenceRecordIds(Array.isArray(canonicalGameDerivedEvidenceRecordIds) ? canonicalGameDerivedEvidenceRecordIds : [])) missing.push("game");
  const uniqueMissing = [...new Set(missing)];
  if (value.status !== (uniqueMissing.length === 0 ? "reviewed-package-evidence" : "incomplete")) errors.push("Upload quarantine package evidence review status does not match reviewed lanes and canonical game evidence.");
  if (!Array.isArray(value.blockers) || value.blockers.some((item) => !isNonEmptyString(item)) || (uniqueMissing.length > 0 && value.blockers.length === 0) || (uniqueMissing.length === 0 && value.blockers.length > 0)) errors.push("Upload quarantine package evidence review blockers must match lane and canonical game completeness.");
  if (!Array.isArray(value.nextSteps) || value.nextSteps.length === 0 || value.nextSteps.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine package evidence review nextSteps must contain non-empty strings.");
  for (const field of ["packageAssemblyAllowed", "promotionAllowed", "qrPrintAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`Upload quarantine package evidence review ${field} must remain false.`);
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Upload quarantine package evidence review must remain review-only and side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeIdentifier(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value); }
function isSafeReviewerId(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 160 && /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(value); }
