export type PublisherSubmissionAssetKind =
  | "textbook-source"
  | "teacher-answer-key"
  | "image"
  | "audio"
  | "video"
  | "transcript"
  | "font"
  | "background-media";

export type PublisherSubmissionAssetStatus = "missing" | "provided" | "reviewed";
export type PublisherSubmissionEvidenceKind = "rights" | "accessibility" | "scan";

export interface PublisherSubmissionAsset {
  assetId: string;
  kind: PublisherSubmissionAssetKind;
  label: string;
  required: boolean;
  unitKey: string;
  acceptedTypes: string[];
  rightsEvidenceRequired: boolean;
  accessibilityEvidenceRequired: boolean;
  status: PublisherSubmissionAssetStatus;
  nextGate: string;
  teacherOnly?: boolean;
}

export interface PublisherSubmissionEvidenceRequest {
  referenceId: string;
  kind: PublisherSubmissionEvidenceKind;
  relativePath: string;
  appliesToAssetIds: string[];
  required: boolean;
  status: "missing" | "provided" | "reviewed";
}

export interface PublisherSubmissionManifest {
  manifestId: string;
  tenantId: string;
  packageId: string;
  edition: string;
  version: string;
  targetLanguage: string;
  supportLanguages: string[];
  assets: PublisherSubmissionAsset[];
  evidenceRequests: PublisherSubmissionEvidenceRequest[];
  reviewOnly: true;
  filePromotionAllowed: false;
  studentFacingUseAllowed: false;
}

export function validatePublisherSubmissionManifest(manifest: PublisherSubmissionManifest): string[] {
  const errors: string[] = [];
  for (const [field, value] of Object.entries(manifest)) {
    if (["assets", "evidenceRequests", "supportLanguages", "reviewOnly", "filePromotionAllowed", "studentFacingUseAllowed"].includes(field)) continue;
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`${field} is required.`);
  }
  if (manifest.reviewOnly !== true) errors.push("reviewOnly must remain true.");
  if (manifest.filePromotionAllowed !== false) errors.push("filePromotionAllowed must remain false.");
  if (manifest.studentFacingUseAllowed !== false) errors.push("studentFacingUseAllowed must remain false.");
  if (!Array.isArray(manifest.supportLanguages) || manifest.supportLanguages.some((language) => !language.trim())) {
    errors.push("supportLanguages must contain only non-blank language ids.");
  }
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    errors.push("At least one publisher submission asset is required.");
    return errors;
  }
  if (!Array.isArray(manifest.evidenceRequests) || manifest.evidenceRequests.length === 0) {
    errors.push("At least one publisher submission evidence request is required.");
  }

  const assetIds = new Set<string>();
  for (const asset of manifest.assets) {
    if (!asset.assetId.trim()) errors.push("Each submission asset needs an assetId.");
    if (assetIds.has(asset.assetId)) errors.push(`Duplicate submission asset id: ${asset.assetId}.`);
    assetIds.add(asset.assetId);
    if (!asset.label.trim() || !asset.unitKey.trim() || !asset.nextGate.trim()) errors.push(`Submission asset ${asset.assetId} has blank identity or gate text.`);
    if (asset.kind === "teacher-answer-key" && asset.teacherOnly !== true) errors.push(`Teacher answer-key asset ${asset.assetId} must be teacher-only.`);
    if (asset.kind !== "teacher-answer-key" && asset.teacherOnly === true) errors.push(`Only teacher-answer-key assets may be teacher-only (${asset.assetId}).`);
    if (!Array.isArray(asset.acceptedTypes) || asset.acceptedTypes.length === 0) errors.push(`Submission asset ${asset.assetId} needs accepted types.`);
    if (asset.status === "reviewed" && (!asset.rightsEvidenceRequired || !asset.accessibilityEvidenceRequired)) {
      errors.push(`Reviewed submission asset ${asset.assetId} must retain rights and accessibility evidence requirements.`);
    }
  }
  if (!manifest.assets.some((asset) => asset.kind === "textbook-source" && asset.required)) {
    errors.push("A required textbook-source asset is mandatory.");
  }
  const evidenceIds = new Set<string>();
  for (const evidence of manifest.evidenceRequests ?? []) {
    if (!evidence.referenceId.trim() || !evidence.relativePath.trim()) errors.push("Each submission evidence request needs an id and relative path.");
    if (evidenceIds.has(evidence.referenceId)) errors.push(`Duplicate submission evidence id: ${evidence.referenceId}.`);
    evidenceIds.add(evidence.referenceId);
    if (!["rights", "accessibility", "scan"].includes(evidence.kind)) errors.push(`Unsupported submission evidence kind: ${evidence.kind}.`);
    if (!isSafeRelativePath(evidence.relativePath)) errors.push(`Submission evidence path must be safe: ${evidence.relativePath}.`);
    if (!Array.isArray(evidence.appliesToAssetIds) || evidence.appliesToAssetIds.length === 0) errors.push(`Submission evidence ${evidence.referenceId} needs asset coverage.`);
    for (const assetId of evidence.appliesToAssetIds ?? []) if (!assetIds.has(assetId)) errors.push(`Submission evidence ${evidence.referenceId} references unknown asset ${assetId}.`);
    if (!["missing", "provided", "reviewed"].includes(evidence.status)) errors.push(`Submission evidence ${evidence.referenceId} has an unsupported status.`);
  }
  for (const kind of ["rights", "accessibility", "scan"] as const) {
    if (!(manifest.evidenceRequests ?? []).some((evidence) => evidence.kind === kind && evidence.required)) errors.push(`A required ${kind} submission evidence request is mandatory.`);
  }
  return errors;
}

function isSafeRelativePath(value: string): boolean {
  const normalized = String(value).replaceAll("\\", "/");
  return Boolean(normalized) && !normalized.startsWith("/") && !normalized.includes("//") && !normalized.split("/").includes("..") && !/[<>:"|?*]/.test(normalized);
}
