import type { PublisherSubmissionAssetKind } from "./publisherSubmissionManifest";

export type PublisherPilotDeliveryMode = "hosted-pwa" | "closed-local" | "hybrid";
export type PublisherPilotQrTargetType = "front-door" | "unit-launch" | "game-mode" | "media-playlist";

export interface PublisherPilotQrReference {
  referenceId: string;
  pageReference: string;
  unitId: string;
  activitySlug: string;
  targetType: PublisherPilotQrTargetType;
  language: string;
}

export interface PublisherPilotMediaRequest {
  kind: PublisherSubmissionAssetKind;
  relativePath: string;
  unitKey: string;
  required: boolean;
  purpose: string;
}

export type PublisherPilotEvidenceKind = "rights" | "accessibility" | "scan";

export interface PublisherPilotEvidenceRequest {
  referenceId: string;
  kind: PublisherPilotEvidenceKind;
  relativePath: string;
  appliesTo: string[];
  required: boolean;
}

export interface PublisherPilotIntakeBrief {
  recordVersion: 1;
  briefId: string;
  tenantId: string;
  publisherName: string;
  seriesName: string;
  bookTitle: string;
  edition: string;
  version: string;
  targetLanguage: string;
  supportLanguages: string[];
  unitKey: string;
  sourceOwner: string;
  sourceFiles: string[];
  mediaRequests: PublisherPilotMediaRequest[];
  evidenceRequests: PublisherPilotEvidenceRequest[];
  deliveryMode: PublisherPilotDeliveryMode;
  hostedPersistenceOptIn: boolean;
  qrPageReferences: string[];
  qrReferences: PublisherPilotQrReference[];
  retentionPolicy: string;
  reportingPolicy: string;
  reviewOnly: true;
  packageAssemblyAllowed: false;
  studentFacingUseAllowed: false;
}

export function validatePublisherPilotIntakeBrief(brief: PublisherPilotIntakeBrief): string[] {
  const errors: string[] = [];
  if (brief.recordVersion !== 1) errors.push("recordVersion must be 1.");
  if (JSON.stringify(brief).includes("REPLACE_WITH_")) errors.push("The intake brief still contains unresolved REPLACE_WITH_* placeholders.");

  for (const [field, value] of Object.entries(brief)) {
    if (["recordVersion", "supportLanguages", "sourceFiles", "mediaRequests", "evidenceRequests", "qrPageReferences", "qrReferences", "hostedPersistenceOptIn", "reviewOnly", "packageAssemblyAllowed", "studentFacingUseAllowed"].includes(field)) continue;
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`${field} is required.`);
  }

  if (!Array.isArray(brief.supportLanguages) || brief.supportLanguages.some((language) => !language.trim())) {
    errors.push("supportLanguages must contain only non-blank language ids.");
  }
  if (!Array.isArray(brief.sourceFiles) || brief.sourceFiles.length === 0) errors.push("At least one source file is required.");
  if (!Array.isArray(brief.qrPageReferences) || brief.qrPageReferences.length === 0) errors.push("At least one QR page reference is required.");
  if (!Array.isArray(brief.qrReferences) || brief.qrReferences.length === 0) errors.push("At least one structured QR reference is required.");
  if (!Array.isArray(brief.mediaRequests) || brief.mediaRequests.length === 0) errors.push("At least one media request is required.");
  if (!Array.isArray(brief.evidenceRequests) || brief.evidenceRequests.length === 0) errors.push("At least one structured evidence request is required.");
  if (!("hosted-pwa" === brief.deliveryMode || "closed-local" === brief.deliveryMode || "hybrid" === brief.deliveryMode)) errors.push("deliveryMode is unsupported.");
  if (brief.reviewOnly !== true) errors.push("reviewOnly must remain true.");
  if (brief.packageAssemblyAllowed !== false) errors.push("packageAssemblyAllowed must remain false.");
  if (brief.studentFacingUseAllowed !== false) errors.push("studentFacingUseAllowed must remain false.");

  for (const path of [...(brief.sourceFiles ?? []), ...(brief.mediaRequests ?? []).map((request) => request.relativePath)]) {
    if (!isSafeRelativePath(path)) errors.push(`Unsafe relative path: ${path}.`);
  }
  for (const request of brief.mediaRequests ?? []) {
    if (!request.unitKey.trim() || !request.purpose.trim()) errors.push("Every media request needs a unitKey and purpose.");
    if (!request.kind) errors.push("Every media request needs a supported kind.");
  }
  const evidenceIds = new Set<string>();
  for (const request of brief.evidenceRequests ?? []) {
    if (!request.referenceId.trim() || !request.relativePath.trim() || !Array.isArray(request.appliesTo) || request.appliesTo.length === 0 || request.appliesTo.some((value) => !value.trim())) {
      errors.push("Every evidence request needs an id, safe path, and at least one appliesTo identity.");
    }
    if (evidenceIds.has(request.referenceId)) errors.push(`Duplicate evidence request id: ${request.referenceId}.`);
    evidenceIds.add(request.referenceId);
    if (!("rights" === request.kind || "accessibility" === request.kind || "scan" === request.kind)) errors.push(`Unsupported evidence request kind: ${request.kind}.`);
    if (!isSafeRelativePath(request.relativePath)) errors.push(`Unsafe evidence relative path: ${request.relativePath}.`);
  }
  const qrIds = new Set<string>();
  for (const reference of brief.qrReferences ?? []) {
    if (!reference.referenceId.trim() || !reference.pageReference.trim() || !reference.unitId.trim() || !reference.activitySlug.trim() || !reference.language.trim()) errors.push("Every QR reference needs identity, page, unit, activity, and language metadata.");
    if (qrIds.has(reference.referenceId)) errors.push(`Duplicate QR reference id: ${reference.referenceId}.`);
    qrIds.add(reference.referenceId);
    if (!("front-door" === reference.targetType || "unit-launch" === reference.targetType || "game-mode" === reference.targetType || "media-playlist" === reference.targetType)) errors.push(`Unsupported QR target type: ${reference.targetType}.`);
  }
  if (brief.hostedPersistenceOptIn && brief.deliveryMode === "closed-local") {
    errors.push("closed-local delivery cannot opt in to hosted persistence.");
  }
  return errors;
}

function isSafeRelativePath(value: string): boolean {
  const normalized = String(value).replaceAll("\\", "/");
  return Boolean(normalized) && !normalized.startsWith("/") && !normalized.includes("//") && !normalized.split("/").includes("..") && !/[<>:"|?*]/.test(normalized);
}
