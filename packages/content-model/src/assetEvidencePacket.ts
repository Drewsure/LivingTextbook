import {
  validateAssetRuntimeFileMetadata,
  type AssetRuntimeFileMetadata,
  type AssetRuntimeKind,
} from "./assetRuntime";

export type AssetEvidenceAttachmentStatus = "metadata-captured" | "review-blocked" | "review-ready";

export interface AssetEvidenceAttachment {
  attachmentId: string;
  tenantId: string;
  assetId: string;
  sourceLineageRef: string;
  file: AssetRuntimeFileMetadata;
  checksum: string;
  status: AssetEvidenceAttachmentStatus;
  storageWriteAllowed: false;
  downloadAllowed: false;
  studentFacingAllowed: false;
  blockedActions: string[];
}

export interface AssetEvidencePacket {
  packetId: string;
  tenantId: string;
  packageId: string;
  reviewStatus: "review-only";
  attachments: AssetEvidenceAttachment[];
  missingEvidence: string[];
  blockedActions: string[];
}

const attachmentStatuses = new Set<AssetEvidenceAttachmentStatus>(["metadata-captured", "review-blocked", "review-ready"]);
const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const maxIdentifierLength = 160;
const maxReferenceLength = 240;
const maxChecksumLength = 256;
const requiredAttachmentBlocks = ["No attachment upload", "No object storage write", "No attachment download", "No student-facing attachment"] as const;
const requiredPacketBlocks = ["No evidence upload", "No object storage write", "No asset promotion", "No student-facing attachment"] as const;

export function validateAssetEvidencePacket(packet: AssetEvidencePacket): string[] {
  const errors: string[] = [];

  for (const field of ["packetId", "tenantId", "packageId"] as const) {
    const value = packet?.[field];
    if (typeof value !== "string" || value.trim().length === 0 || value.length > maxIdentifierLength || !safeIdentifierPattern.test(value.trim())) {
      errors.push(`asset evidence packet ${field} must be a bounded safe identifier`);
    }
  }

  if (packet?.reviewStatus !== "review-only") errors.push("asset evidence packet must remain review-only");
  if (!Array.isArray(packet?.attachments) || packet.attachments.length === 0) errors.push("asset evidence packet must include attachments");
  if (!Array.isArray(packet?.missingEvidence) || packet.missingEvidence.length === 0) errors.push("asset evidence packet must state missing evidence");
  requireBlockedActions(packet?.blockedActions, requiredPacketBlocks, "asset evidence packet", errors);

  const attachments = Array.isArray(packet?.attachments) ? packet.attachments : [];
  const seenIds = new Set<string>();
  for (const attachment of attachments) {
    if (typeof attachment?.attachmentId !== "string" || attachment.attachmentId.trim().length === 0) {
      errors.push("asset evidence attachment attachmentId must be non-empty");
    } else if (seenIds.has(attachment.attachmentId)) {
      errors.push(`asset evidence packet contains duplicate attachment ${attachment.attachmentId}`);
    } else {
      seenIds.add(attachment.attachmentId);
    }

    if (attachment?.tenantId !== packet?.tenantId) errors.push(`asset evidence attachment ${attachment?.attachmentId ?? "unknown"} must match packet tenant`);
    for (const field of ["assetId", "sourceLineageRef"] as const) {
      const value = attachment?.[field];
      if (typeof value !== "string" || value.trim().length === 0 || value.length > maxReferenceLength) {
        errors.push(`asset evidence attachment ${attachment?.attachmentId ?? "unknown"} ${field} must be bounded`);
      }
    }

    errors.push(...validateAssetRuntimeFileMetadata(attachment?.file as AssetRuntimeFileMetadata).map((error) => `asset evidence attachment ${attachment?.attachmentId ?? "unknown"}: ${error}`));
    if (typeof attachment?.checksum !== "string" || attachment.checksum.trim().length === 0 || attachment.checksum.length > maxChecksumLength) {
      errors.push(`asset evidence attachment ${attachment?.attachmentId ?? "unknown"} checksum must be bounded`);
    }
    if (!attachmentStatuses.has(attachment?.status as AssetEvidenceAttachmentStatus)) errors.push(`asset evidence attachment ${attachment?.attachmentId ?? "unknown"} status is unsupported`);
    if (attachment?.storageWriteAllowed !== false) errors.push(`asset evidence attachment ${attachment?.attachmentId ?? "unknown"} must block storage writes`);
    if (attachment?.downloadAllowed !== false) errors.push(`asset evidence attachment ${attachment?.attachmentId ?? "unknown"} must block downloads`);
    if (attachment?.studentFacingAllowed !== false) errors.push(`asset evidence attachment ${attachment?.attachmentId ?? "unknown"} must block student-facing use`);
    requireBlockedActions(attachment?.blockedActions, requiredAttachmentBlocks, `asset evidence attachment ${attachment?.attachmentId ?? "unknown"}`, errors);
  }

  return [...new Set(errors)];
}

function requireBlockedActions(actions: unknown, required: readonly string[], label: string, errors: string[]): void {
  if (!Array.isArray(actions)) {
    errors.push(`${label} must include blocked actions`);
    return;
  }
  for (const action of required) {
    if (!actions.includes(action)) errors.push(`${label} must block ${action}`);
  }
}

export function createReviewOnlyAssetEvidencePacket(packet: AssetEvidencePacket): AssetEvidencePacket {
  return {
    ...packet,
    reviewStatus: "review-only",
    blockedActions: [...new Set([...packet.blockedActions, ...requiredPacketBlocks])],
    attachments: packet.attachments.map((attachment) => ({
      ...attachment,
      storageWriteAllowed: false,
      downloadAllowed: false,
      studentFacingAllowed: false,
      blockedActions: [...new Set([...attachment.blockedActions, ...requiredAttachmentBlocks])],
    })),
  };
}

export type AssetEvidenceKind = AssetRuntimeKind;
