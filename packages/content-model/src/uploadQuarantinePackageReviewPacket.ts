import type { UploadQuarantinePackageHandoffPreview } from "./uploadQuarantinePackageHandoff";
import type { UploadQuarantineReviewDecisionRecord } from "./uploadQuarantineReviewDecision";
import type { UploadQuarantinePromotionAdapterDecision } from "./uploadQuarantinePromotionAdapterDecision";
import { isUploadQuarantineSafeTenantId } from "./uploadQuarantineIntake";

export type UploadQuarantinePackageReviewPacketStatus = "blocked" | "ready-for-next-gate";

export interface UploadQuarantinePackageReviewPacket {
  recordVersion: 1;
  packetId: string;
  packetRevision?: number;
  supersedesPacketId?: string;
  tenantId: string;
  quarantineId: string;
  sourceId: string;
  packageId: string;
  unitKey?: string;
  admissionId: string;
  evidencePacketId: string;
  checksumSha256: string;
  payloadPresent: boolean;
  reviewDecisionId?: string;
  reviewDecision: UploadQuarantineReviewDecisionRecord["decision"] | "not-recorded";
  status: UploadQuarantinePackageReviewPacketStatus;
  blockers: string[];
  nextGate: string[];
  includedRecords: string[];
  capturedAt: string;
  storageMode: "local-quarantine-package-review-metadata";
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantinePackageReviewPacket(input: {
  handoff: UploadQuarantinePackageHandoffPreview;
  reviewDecision?: UploadQuarantineReviewDecisionRecord;
  promotionAdapterDecision?: UploadQuarantinePromotionAdapterDecision | null;
  packetRevision?: number;
  supersedesPacketId?: string;
  capturedAt: string;
}): UploadQuarantinePackageReviewPacket {
  const { handoff, reviewDecision, promotionAdapterDecision } = input;
  const packetRevision = input.packetRevision ?? 1;
  if (!Number.isSafeInteger(packetRevision) || packetRevision < 1) throw new Error("Upload quarantine package review packet packetRevision must be a positive integer.");
  if (packetRevision > 1 && !isNonEmptyString(input.supersedesPacketId)) throw new Error("A revised upload quarantine package review packet must identify the packet it supersedes.");
  const blockers = [...handoff.blockers];
  if (!reviewDecision) blockers.push("A human review decision must be recorded before this packet can enter the next gate.");
  if (reviewDecision?.decision === "changes-required") blockers.push("The recorded review decision requires changes before package review can continue.");
  const packet: UploadQuarantinePackageReviewPacket = {
    recordVersion: 1,
    packetId: packetRevision === 1
      ? `${handoff.packageId}:${handoff.quarantineId}:package-review-packet`
      : `${handoff.packageId}:${handoff.quarantineId}:package-review-packet:v${packetRevision}`,
    ...(packetRevision > 1 ? { packetRevision, supersedesPacketId: input.supersedesPacketId } : {}),
    tenantId: handoff.tenantId,
    quarantineId: handoff.quarantineId,
    sourceId: handoff.sourceId,
    packageId: handoff.packageId,
    ...(handoff.unitKey ? { unitKey: handoff.unitKey } : {}),
    admissionId: handoff.admissionId,
    evidencePacketId: handoff.evidencePacketId,
    checksumSha256: handoff.checksumSha256,
    payloadPresent: handoff.payloadPresent,
    ...(reviewDecision ? { reviewDecisionId: reviewDecision.decisionId } : {}),
    reviewDecision: reviewDecision?.decision ?? "not-recorded",
    status: blockers.length === 0 ? "ready-for-next-gate" : "blocked",
    blockers: [...new Set(blockers)],
    nextGate: [
      "Human operator selects and activates an approved evidence storage provider.",
      "A reviewed evidence record is written and reconciled against this packet checksum.",
      "Package assembly, release, QR print, and student activation remain separate gates.",
    ],
    includedRecords: [
      "upload_quarantine_intake_record",
      "upload_quarantine_review_summary",
      "upload_quarantine_admission_preview",
      "upload_quarantine_package_handoff_preview",
      ...(reviewDecision ? ["upload_quarantine_review_decision"] : []),
      ...(promotionAdapterDecision ? ["upload_quarantine_promotion_adapter_decision"] : []),
    ],
    capturedAt: input.capturedAt,
    storageMode: "local-quarantine-package-review-metadata",
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateUploadQuarantinePackageReviewPacket(packet);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return packet;
}

export function validateUploadQuarantinePackageReviewPacket(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine package review packet must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine package review packet recordVersion must be 1.");
  for (const field of ["packetId", "tenantId", "quarantineId", "sourceId", "packageId", "admissionId", "evidencePacketId", "checksumSha256", "capturedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine package review packet ${field} must be non-empty.`);
  }
  if (value.unitKey !== undefined && !isNonEmptyString(value.unitKey)) errors.push("Upload quarantine package review packet unitKey must be non-empty when present.");
  if (value.packetRevision !== undefined && (!Number.isSafeInteger(value.packetRevision) || Number(value.packetRevision) < 2)) errors.push("Upload quarantine package review packet packetRevision must be an integer greater than 1 when present.");
  if (value.packetRevision !== undefined && !isNonEmptyString(value.supersedesPacketId)) errors.push("A revised upload quarantine package review packet must identify the packet it supersedes.");
  if (value.reviewDecisionId !== undefined && !isNonEmptyString(value.reviewDecisionId)) errors.push("Upload quarantine package review packet reviewDecisionId must be non-empty when present.");
  if (!isUploadQuarantineSafeTenantId(value.tenantId)) errors.push("Upload quarantine package review packet tenant identity is unsafe.");
  if (!/^q-[0-9a-f-]{36}$/.test(String(value.quarantineId ?? ""))) errors.push("Upload quarantine package review packet quarantine identity is not opaque.");
  if (value.reviewDecision !== "not-recorded" && value.reviewDecision !== "accepted-for-package-review" && value.reviewDecision !== "changes-required") errors.push("Upload quarantine package review packet review decision is unsupported.");
  if (value.status !== "blocked" && value.status !== "ready-for-next-gate") errors.push("Upload quarantine package review packet status is unsupported.");
  if (!/^[a-f0-9]{64}$/.test(String(value.checksumSha256 ?? ""))) errors.push("Upload quarantine package review packet checksum must be lowercase SHA-256.");
  if (typeof value.payloadPresent !== "boolean") errors.push("Upload quarantine package review packet payloadPresent must be boolean.");
  for (const [field, label] of [["blockers", "blockers"], ["nextGate", "next gate"], ["includedRecords", "included records"]] as const) {
    if (!Array.isArray(value[field]) || value[field].length === 0 || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Upload quarantine package review packet ${label} must contain non-empty strings.`);
  }
  if (value.status === "ready-for-next-gate" && Array.isArray(value.blockers) && value.blockers.length > 0) errors.push("A ready package review packet cannot contain blockers.");
  if (value.packageAssemblyAllowed !== false) errors.push("Upload quarantine package review packet package assembly must remain blocked.");
  if (value.promotionAllowed !== false) errors.push("Upload quarantine package review packet promotion must remain blocked.");
  if (value.studentFacingUseAllowed !== false) errors.push("Upload quarantine package review packet student use must remain blocked.");
  if (value.storageMode !== "local-quarantine-package-review-metadata") errors.push("Upload quarantine package review packet storageMode must remain local metadata only.");
  if (value.mode !== "review-only") errors.push("Upload quarantine package review packet must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Upload quarantine package review packet must remain side-effect-free.");
  if (typeof value.capturedAt === "string" && Number.isNaN(Date.parse(value.capturedAt))) errors.push("Upload quarantine package review packet capturedAt must be a valid timestamp.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
