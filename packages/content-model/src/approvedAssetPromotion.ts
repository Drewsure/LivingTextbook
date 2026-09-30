import type { UploadQuarantineChannel } from "./uploadQuarantineIntake";

export type ApprovedAssetPromotionKind = "image" | "audio" | "video" | "source-document";

export interface ApprovedAssetPromotionEntry {
  assetId: string;
  sourceQuarantineId: string;
  evidenceReferenceId: string;
  destinationPath: string;
  kind: ApprovedAssetPromotionKind;
  channelId: UploadQuarantineChannel;
  mimeType: string;
  checksumSha256: string;
  unitKey?: string;
}

export interface ApprovedAssetPromotionRequest {
  recordVersion: 1;
  tenantId: string;
  packageId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  quarantineId: string;
  reviewPacketId: string;
  entries: ApprovedAssetPromotionEntry[];
  operatorId: string;
  promotedAt: string;
}

export interface ApprovedAssetPromotionRecord {
  recordVersion: 1;
  promotionId: string;
  tenantId: string;
  packageId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  quarantineId: string;
  reviewPacketId: string;
  entries: ApprovedAssetPromotionEntry[];
  operatorId: string;
  promotedAt: string;
  status: "approved-assets-promoted";
  promotionAllowed: true;
  learnerRecordsIncluded: false;
  studentFacingUseAllowed: false;
  sideEffect: "approved-asset-promotion";
}

const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/;
const checksumPattern = /^[a-f0-9]{64}$/;
const safeQuarantinePattern = /^q-[0-9a-f-]{36}$/;
const safeVersionPattern = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const safeRelativePathPattern = /^(?![\\/])(?!.*(?:^|[\\/])\.\.?([\\/]|$))[A-Za-z0-9._/-]+$/;
const channelKinds: Record<UploadQuarantineChannel, ApprovedAssetPromotionKind> = {
  "source-pdf-text-upload": "source-document",
  "labelled-diagram-image-upload": "image",
  "audio-music-upload": "audio",
  "video-upload": "video",
};

export function getApprovedAssetPromotionKind(channelId: UploadQuarantineChannel): ApprovedAssetPromotionKind {
  return channelKinds[channelId];
}

export function validateApprovedAssetPromotionRequest(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Approved asset promotion request must be an object."];
  if (value.recordVersion !== 1) errors.push("Approved asset promotion request recordVersion must be 1.");
  for (const field of ["tenantId", "packageId", "version", "manifestId", "receiptId", "reviewPacketId", "operatorId", "promotedAt"] as const) {
    if (!isSafeIdentifier(String(value[field] ?? ""))) errors.push(`Approved asset promotion ${field} must be a bounded safe identifier.`);
  }
  if (!safeQuarantinePattern.test(String(value.quarantineId ?? ""))) errors.push("Approved asset promotion quarantineId must be an opaque quarantine identifier.");
  if (!safeVersionPattern.test(String(value.version ?? ""))) errors.push("Approved asset promotion version must be a safe path segment.");
  if (typeof value.promotedAt === "string" && Number.isNaN(Date.parse(value.promotedAt))) errors.push("Approved asset promotion promotedAt must be a valid timestamp.");
  if (!Array.isArray(value.entries) || value.entries.length === 0) errors.push("Approved asset promotion must include at least one asset entry.");
  const entries = Array.isArray(value.entries) ? value.entries : [];
  const assetIds = new Set<string>();
  const sourceIds = new Set<string>();
  const destinationPaths = new Set<string>();
  const evidenceIds = new Set<string>();
  entries.forEach((entry, index) => {
    const label = `Approved asset promotion entry ${index + 1}`;
    if (!isRecord(entry)) { errors.push(`${label} must be an object.`); return; }
    for (const field of ["assetId", "evidenceReferenceId", "mimeType"] as const) if (!isNonEmptyString(entry[field])) errors.push(`${label} ${field} must be non-empty.`);
    if (!isSafeIdentifier(String(entry.assetId ?? ""))) errors.push(`${label} assetId must be safe.`);
    if (!isSafeIdentifier(String(entry.evidenceReferenceId ?? ""))) errors.push(`${label} evidenceReferenceId must be safe.`);
    if (!safeQuarantinePattern.test(String(entry.sourceQuarantineId ?? ""))) errors.push(`${label} sourceQuarantineId must be opaque.`);
    if (!safeRelativePathPattern.test(String(entry.destinationPath ?? ""))) errors.push(`${label} destinationPath must be a safe relative path.`);
    if (!checksumPattern.test(String(entry.checksumSha256 ?? ""))) errors.push(`${label} checksumSha256 must be lowercase SHA-256.`);
    if (!(entry.channelId in channelKinds)) errors.push(`${label} channelId is unsupported.`);
    if (entry.channelId in channelKinds && entry.kind !== channelKinds[entry.channelId as UploadQuarantineChannel]) errors.push(`${label} kind must match its quarantine channel.`);
    if (entry.unitKey !== undefined && !isSafeIdentifier(String(entry.unitKey))) errors.push(`${label} unitKey must be safe when present.`);
    for (const [set, key, message] of [[assetIds, entry.assetId, "assetId"], [sourceIds, entry.sourceQuarantineId, "sourceQuarantineId"], [destinationPaths, entry.destinationPath, "destinationPath"], [evidenceIds, entry.evidenceReferenceId, "evidenceReferenceId"]] as const) {
      if (typeof key === "string" && set.has(key)) errors.push(`${label} duplicates ${message}.`);
      if (typeof key === "string") set.add(key);
    }
  });
  return [...new Set(errors)];
}

export function createApprovedAssetPromotionRecord(request: ApprovedAssetPromotionRequest): ApprovedAssetPromotionRecord {
  const errors = validateApprovedAssetPromotionRequest(request);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return {
    ...request,
    promotionId: `${request.tenantId}:${request.packageId}:${request.version}:approved-assets-promotion`,
    entries: request.entries.map((entry) => ({ ...entry })),
    status: "approved-assets-promoted",
    promotionAllowed: true,
    learnerRecordsIncluded: false,
    studentFacingUseAllowed: false,
    sideEffect: "approved-asset-promotion",
  };
}

export function validateApprovedAssetPromotionRecord(value: unknown): string[] {
  const errors = validateApprovedAssetPromotionRequest(value);
  if (!isRecord(value)) return errors;
  if (!isSafeIdentifier(String(value.promotionId ?? ""))) errors.push("Approved asset promotion promotionId must be safe.");
  if (value.status !== "approved-assets-promoted") errors.push("Approved asset promotion status is unsupported.");
  if (value.promotionAllowed !== true) errors.push("Approved asset promotion promotionAllowed must be true.");
  if (value.learnerRecordsIncluded !== false) errors.push("Approved asset promotion must not include learner records.");
  if (value.studentFacingUseAllowed !== false) errors.push("Approved asset promotion must not activate student-facing use.");
  if (value.sideEffect !== "approved-asset-promotion") errors.push("Approved asset promotion sideEffect is unsupported.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeIdentifier(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 240 && safeIdentifierPattern.test(value); }
