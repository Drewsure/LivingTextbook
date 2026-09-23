import { ASSET_RUNTIME_MAX_BYTES } from "./assetRuntime";

export type UploadQuarantineChannel =
  | "source-pdf-text-upload"
  | "labelled-diagram-image-upload"
  | "audio-music-upload"
  | "video-upload";

export interface UploadQuarantineIntakeRecord {
  recordVersion: 1;
  intakeId: string;
  tenantId: string;
  channelId: UploadQuarantineChannel;
  unitKey?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  storageMode: "quarantine-only";
  scanStatus: "pending";
  rightsStatus: "unknown";
  sourceReviewStatus: "unreviewed";
  targetMappingReviewed: false;
  promotionAllowed: false;
  studentFacingUseAllowed: false;
  learnerMediaIncluded: false;
  nextGate: string;
}

const CHANNEL_MIME_TYPES: Record<UploadQuarantineChannel, readonly string[]> = {
  "source-pdf-text-upload": [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "text/csv",
  ],
  "labelled-diagram-image-upload": ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  "audio-music-upload": ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg"],
  "video-upload": ["video/mp4", "video/webm", "video/quicktime"],
};

const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const safeUnitKeyPattern = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/;
const checksumPattern = /^[a-f0-9]{64}$/;

export function createUploadQuarantineIntakeRecord(input: Omit<UploadQuarantineIntakeRecord, "recordVersion" | "storageMode" | "scanStatus" | "rightsStatus" | "sourceReviewStatus" | "targetMappingReviewed" | "promotionAllowed" | "studentFacingUseAllowed" | "learnerMediaIncluded" | "nextGate">): UploadQuarantineIntakeRecord {
  const record: UploadQuarantineIntakeRecord = {
    ...input,
    recordVersion: 1,
    storageMode: "quarantine-only",
    scanStatus: "pending",
    rightsStatus: "unknown",
    sourceReviewStatus: "unreviewed",
    targetMappingReviewed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    learnerMediaIncluded: false,
    nextGate: "Complete scan, rights, source review, target mapping, and release checks before any promotion can be considered.",
  };
  const errors = validateUploadQuarantineIntakeRecord(record);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return record;
}

export function validateUploadQuarantineIntakeRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine intake record must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine intake recordVersion must be 1.");
  for (const field of ["intakeId", "tenantId", "channelId", "fileName", "mimeType", "checksumSha256", "nextGate"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine intake ${field} must be non-empty.`);
  }
  if (!isSafeIdentifier(value.intakeId)) errors.push("Upload quarantine intake intakeId must be a safe identifier.");
  if (!isSafeIdentifier(value.tenantId)) errors.push("Upload quarantine intake tenantId must be a safe identifier.");
  if (value.unitKey !== undefined && (!isNonEmptyString(value.unitKey) || value.unitKey.length > 240 || !safeUnitKeyPattern.test(value.unitKey))) {
    errors.push("Upload quarantine intake unitKey must be a bounded safe identifier when present.");
  }
  if (!isChannel(value.channelId)) errors.push("Upload quarantine intake channelId is unsupported.");
  if (isChannel(value.channelId) && !CHANNEL_MIME_TYPES[value.channelId].includes(String(value.mimeType))) {
    errors.push("Upload quarantine MIME type is not allowed for the selected channel.");
  }
  if (!Number.isSafeInteger(value.sizeBytes) || Number(value.sizeBytes) <= 0 || Number(value.sizeBytes) > ASSET_RUNTIME_MAX_BYTES) {
    errors.push(`Upload quarantine sizeBytes must be between 1 and ${ASSET_RUNTIME_MAX_BYTES}.`);
  }
  if (!checksumPattern.test(String(value.checksumSha256 ?? ""))) errors.push("Upload quarantine checksumSha256 must be a lowercase SHA-256 checksum.");
  if (value.storageMode !== "quarantine-only") errors.push("Upload quarantine storageMode must remain quarantine-only.");
  if (value.scanStatus !== "pending") errors.push("Upload quarantine scanStatus must remain pending until an external scan passes.");
  if (value.rightsStatus !== "unknown") errors.push("Upload quarantine rightsStatus must remain unknown until rights review.");
  if (value.sourceReviewStatus !== "unreviewed") errors.push("Upload quarantine sourceReviewStatus must remain unreviewed until teacher review.");
  for (const field of ["targetMappingReviewed", "promotionAllowed", "studentFacingUseAllowed", "learnerMediaIncluded"] as const) {
    if (value[field] !== false) errors.push(`Upload quarantine ${field} must remain false.`);
  }
  return [...new Set(errors)];
}

export function getUploadQuarantineChannelMimeTypes(channelId: UploadQuarantineChannel): readonly string[] {
  return CHANNEL_MIME_TYPES[channelId];
}

function isChannel(value: unknown): value is UploadQuarantineChannel {
  return typeof value === "string" && value in CHANNEL_MIME_TYPES;
}

function isSafeIdentifier(value: unknown): value is string {
  return isNonEmptyString(value) && value.length <= 160 && safeIdentifierPattern.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
