import {
  validateAssetEvidencePacket,
  type AssetEvidencePacket,
} from "./assetEvidencePacket";
import { validateAssetRuntimeFileMetadata, type AssetRuntimeKind } from "./assetRuntime";

export type AssetManifestTarget = "game-asset-manifest" | "media-manifest" | "source-document-manifest";
export type AssetManifestDecision = "blocked" | "needs-review" | "evidence-ready";

export interface AssetManifestPreview {
  manifestId: string;
  evidencePacketId: string;
  releaseGateId: string;
  tenantId: string;
  packageId: string;
  assetId: string;
  kind: AssetRuntimeKind;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  sourceLineageRef: string;
  target: AssetManifestTarget;
  decision: AssetManifestDecision;
  blockers: string[];
  blockedActions: string[];
  storageWriteAllowed: false;
  promotionAllowed: false;
  studentFacingAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export interface AssetManifestPreviewOptions {
  releaseGateId: string;
  target: AssetManifestTarget;
  targetMappingReviewed: boolean;
  rightsEvidenceReady: boolean;
  accessibilityEvidenceReady: boolean;
  releaseGateReady: boolean;
}

const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const maxIdentifierLength = 160;
const requiredBlockedActions = [
  "No manifest write",
  "No object storage write",
  "No asset promotion",
  "No student-facing asset use",
] as const;

export function deriveAssetManifestPreviews(
  packet: AssetEvidencePacket,
  options: AssetManifestPreviewOptions,
): AssetManifestPreview[] {
  const packetErrors = validateAssetEvidencePacket(packet);
  const packetBlockers = packetErrors.length > 0
    ? ["Asset evidence packet validation failed."]
    : packet.missingEvidence.map((item) => `Missing evidence: ${item}.`);

  return packet.attachments.map((attachment) => {
    const blockers = [
      ...packetBlockers,
      ...(options.targetMappingReviewed ? [] : ["Target mapping review is incomplete."]),
      ...(options.rightsEvidenceReady ? [] : ["Rights evidence is incomplete."]),
      ...(options.accessibilityEvidenceReady ? [] : ["Accessibility evidence is incomplete."]),
      ...(options.releaseGateReady ? [] : ["Release-control approval is incomplete."]),
      "Manifest persistence provider is not selected.",
    ];
    const decision: AssetManifestDecision = packetErrors.length > 0
      ? "blocked"
      : blockers.length > 1
        ? "needs-review"
        : "evidence-ready";

    return {
      manifestId: `${packet.packageId}:${attachment.assetId}:manifest-preview`,
      evidencePacketId: packet.packetId,
      releaseGateId: options.releaseGateId,
      tenantId: packet.tenantId,
      packageId: packet.packageId,
      assetId: attachment.assetId,
      kind: attachment.file.kind,
      mimeType: attachment.file.mimeType,
      sizeBytes: attachment.file.sizeBytes,
      checksum: attachment.checksum,
      sourceLineageRef: attachment.sourceLineageRef,
      target: options.target,
      decision,
      blockers: [...new Set(blockers)],
      blockedActions: [...new Set([...packet.blockedActions, ...requiredBlockedActions])],
      storageWriteAllowed: false,
      promotionAllowed: false,
      studentFacingAllowed: false,
      mode: "review-only",
      sideEffect: "none",
    };
  });
}

export function validateAssetManifestPreview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["asset manifest preview must be a JSON object"];

  for (const field of ["manifestId", "evidencePacketId", "releaseGateId", "tenantId", "packageId", "assetId", "checksum", "sourceLineageRef"] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue !== "string" || fieldValue.trim().length === 0 || fieldValue.length > maxIdentifierLength) {
      errors.push(`asset manifest preview ${field} must be bounded`);
    }
  }
  for (const field of ["manifestId", "evidencePacketId", "releaseGateId", "tenantId", "packageId", "assetId"] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string" && !safeIdentifierPattern.test(fieldValue.trim())) errors.push(`asset manifest preview ${field} must be a safe identifier`);
  }
  if (validateAssetRuntimeFileMetadata({ kind: value.kind, mimeType: value.mimeType, sizeBytes: value.sizeBytes }).length > 0) {
    errors.push("asset manifest preview file metadata must pass the asset runtime boundary");
  }
  if (!(Array.from(["game-asset-manifest", "media-manifest", "source-document-manifest"]) as string[]).includes(String(value.target))) errors.push("asset manifest preview target is unsupported");
  if (!(Array.from(["blocked", "needs-review", "evidence-ready"]) as string[]).includes(String(value.decision))) errors.push("asset manifest preview decision is unsupported");
  if (!Array.isArray(value.blockers) || value.blockers.length === 0) errors.push("asset manifest preview must expose blockers");
  if (value.storageWriteAllowed !== false || value.promotionAllowed !== false || value.studentFacingAllowed !== false) errors.push("asset manifest preview must block storage, promotion, and student-facing use");
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("asset manifest preview must remain review-only with no side effect");
  if (!Array.isArray(value.blockedActions)) errors.push("asset manifest preview must expose blocked actions");
  else for (const action of requiredBlockedActions) if (!value.blockedActions.includes(action)) errors.push(`asset manifest preview must block ${action}`);

  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
