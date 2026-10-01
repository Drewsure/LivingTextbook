import type { PublisherSubmissionAssetKind } from "./publisherSubmissionManifest";

export type PublisherPilotDeliveryMode = "hosted-pwa" | "closed-local" | "hybrid";

export interface PublisherPilotMediaRequest {
  kind: PublisherSubmissionAssetKind;
  relativePath: string;
  unitKey: string;
  required: boolean;
  purpose: string;
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
  deliveryMode: PublisherPilotDeliveryMode;
  hostedPersistenceOptIn: boolean;
  qrPageReferences: string[];
  retentionPolicy: string;
  reportingPolicy: string;
  reviewOnly: true;
  packageAssemblyAllowed: false;
  studentFacingUseAllowed: false;
}

export function validatePublisherPilotIntakeBrief(brief: PublisherPilotIntakeBrief): string[] {
  const errors: string[] = [];
  if (brief.recordVersion !== 1) errors.push("recordVersion must be 1.");

  for (const [field, value] of Object.entries(brief)) {
    if (["recordVersion", "supportLanguages", "sourceFiles", "mediaRequests", "qrPageReferences", "hostedPersistenceOptIn", "reviewOnly", "packageAssemblyAllowed", "studentFacingUseAllowed"].includes(field)) continue;
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`${field} is required.`);
  }

  if (!Array.isArray(brief.supportLanguages) || brief.supportLanguages.some((language) => !language.trim())) {
    errors.push("supportLanguages must contain only non-blank language ids.");
  }
  if (!Array.isArray(brief.sourceFiles) || brief.sourceFiles.length === 0) errors.push("At least one source file is required.");
  if (!Array.isArray(brief.qrPageReferences) || brief.qrPageReferences.length === 0) errors.push("At least one QR page reference is required.");
  if (!Array.isArray(brief.mediaRequests) || brief.mediaRequests.length === 0) errors.push("At least one media request is required.");
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
  if (brief.hostedPersistenceOptIn && brief.deliveryMode === "closed-local") {
    errors.push("closed-local delivery cannot opt in to hosted persistence.");
  }
  return errors;
}

function isSafeRelativePath(value: string): boolean {
  const normalized = String(value).replaceAll("\\", "/");
  return Boolean(normalized) && !normalized.startsWith("/") && !normalized.includes("//") && !normalized.split("/").includes("..") && !/[<>:"|?*]/.test(normalized);
}
