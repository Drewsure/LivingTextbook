import type { UploadQuarantineAdmissionPreview } from "./uploadQuarantineAdmission";
import type { UploadQuarantineReviewSummary } from "./uploadQuarantineReview";

export type UploadQuarantinePackageHandoffStatus = "package-handoff-preview-only";

export interface UploadQuarantinePackageHandoffPreview {
  handoffId: string;
  tenantId: string;
  quarantineId: string;
  sourceId: string;
  packageId: string;
  unitKey?: string;
  admissionId: string;
  evidencePacketId: string;
  channelId: UploadQuarantineReviewSummary["record"]["channelId"];
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  payloadPresent: boolean;
  reviewStatus: UploadQuarantinePackageHandoffStatus;
  admissionDecision: UploadQuarantineAdmissionPreview["decision"];
  includedRecords: string[];
  requiredReview: string[];
  blockers: string[];
  nextGate: string[];
  blockedActions: string[];
  writeAllowed: false;
  promotionAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantinePackageHandoffPreview(input: {
  summary: UploadQuarantineReviewSummary;
  admission: UploadQuarantineAdmissionPreview;
  sourceId: string;
  packageId: string;
}): UploadQuarantinePackageHandoffPreview {
  const record = input.summary.record;
  const preview: UploadQuarantinePackageHandoffPreview = {
    handoffId: `${input.packageId}:${input.summary.quarantineId}:package-handoff-preview`,
    tenantId: record.tenantId,
    quarantineId: input.summary.quarantineId,
    sourceId: input.sourceId,
    packageId: input.packageId,
    ...(record.unitKey ? { unitKey: record.unitKey } : {}),
    admissionId: input.admission.admissionId,
    evidencePacketId: input.admission.evidencePacketId,
    channelId: record.channelId,
    fileName: record.fileName,
    mimeType: record.mimeType,
    sizeBytes: record.sizeBytes,
    checksumSha256: record.checksumSha256,
    payloadPresent: input.summary.payloadPresent,
    reviewStatus: "package-handoff-preview-only",
    admissionDecision: input.admission.decision,
    includedRecords: [
      "upload_quarantine_intake_record",
      "upload_quarantine_review_summary",
      "upload_quarantine_admission_preview",
      "upload_quarantine_admission_handoff_binding",
    ],
    requiredReview: [
      "Confirm the publisher source belongs to the selected tenant.",
      "Confirm the source is mapped to the intended textbook unit and candidate package.",
      "Complete scan, rights, source review, accessibility, and release-control evidence.",
      "Choose and activate an approved evidence storage provider before durable records exist.",
    ],
    blockers: [
      ...input.admission.blockers,
      ...(record.unitKey ? [] : ["A textbook unit key is required before package mapping can be reviewed."]),
      ...(input.summary.payloadPresent ? [] : ["The quarantine payload is not present; package handoff remains incomplete."]),
    ],
    nextGate: [
      "Human reviewer confirms tenant, source, unit, and package mapping.",
      "Evidence attachment storage provider is selected and activated through the deployment gate.",
      "Reviewed evidence record is durably written before any package writer can run.",
    ],
    blockedActions: [
      "No evidence record write",
      "No package JSON write",
      "No route, playlist, game, assignment, or QR write",
      "No quarantine payload promotion",
      "No student-facing use",
    ],
    writeAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateUploadQuarantinePackageHandoffPreview(preview);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return preview;
}

export function validateUploadQuarantinePackageHandoffPreview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine package handoff preview must be an object."];
  for (const field of [
    "handoffId", "tenantId", "quarantineId", "sourceId", "packageId", "admissionId",
    "evidencePacketId", "channelId", "fileName", "mimeType", "checksumSha256",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine package handoff ${field} must be non-empty.`);
  }
  if (value.unitKey !== undefined && !isNonEmptyString(value.unitKey)) errors.push("Upload quarantine package handoff unitKey must be non-empty when present.");
  if (value.reviewStatus !== "package-handoff-preview-only") errors.push("Upload quarantine package handoff must remain preview-only.");
  if (!["blocked", "needs-review", "evidence-ready"].includes(String(value.admissionDecision))) errors.push("Upload quarantine package handoff admission decision is unsupported.");
  if (!Number.isSafeInteger(value.sizeBytes) || Number(value.sizeBytes) <= 0) errors.push("Upload quarantine package handoff sizeBytes must be a positive safe integer.");
  if (!/^[a-f0-9]{64}$/.test(String(value.checksumSha256 ?? ""))) errors.push("Upload quarantine package handoff checksum must be a lowercase SHA-256 value.");
  for (const [field, label] of [["includedRecords", "included records"], ["requiredReview", "required review"], ["blockers", "blockers"], ["nextGate", "next gate"], ["blockedActions", "blocked actions"]] as const) {
    if (!Array.isArray(value[field]) || value[field].length === 0 || value[field].some((item) => !isNonEmptyString(item))) {
      errors.push(`Upload quarantine package handoff ${label} must contain non-empty strings.`);
    }
  }
  if (value.writeAllowed !== false) errors.push("Upload quarantine package handoff write must remain blocked.");
  if (value.promotionAllowed !== false) errors.push("Upload quarantine package handoff promotion must remain blocked.");
  if (value.studentFacingUseAllowed !== false) errors.push("Upload quarantine package handoff student use must remain blocked.");
  if (value.mode !== "review-only") errors.push("Upload quarantine package handoff must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Upload quarantine package handoff must remain side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
