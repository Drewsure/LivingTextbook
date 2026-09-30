export type PublisherSubmissionAssetKind =
  | "textbook-source"
  | "image"
  | "audio"
  | "video"
  | "transcript"
  | "font"
  | "background-media";

export type PublisherSubmissionAssetStatus = "missing" | "provided" | "reviewed";

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
  reviewOnly: true;
  filePromotionAllowed: false;
  studentFacingUseAllowed: false;
}

export function validatePublisherSubmissionManifest(manifest: PublisherSubmissionManifest): string[] {
  const errors: string[] = [];
  for (const [field, value] of Object.entries(manifest)) {
    if (["assets", "supportLanguages", "reviewOnly", "filePromotionAllowed", "studentFacingUseAllowed"].includes(field)) continue;
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

  const assetIds = new Set<string>();
  for (const asset of manifest.assets) {
    if (!asset.assetId.trim()) errors.push("Each submission asset needs an assetId.");
    if (assetIds.has(asset.assetId)) errors.push(`Duplicate submission asset id: ${asset.assetId}.`);
    assetIds.add(asset.assetId);
    if (!asset.label.trim() || !asset.unitKey.trim() || !asset.nextGate.trim()) errors.push(`Submission asset ${asset.assetId} has blank identity or gate text.`);
    if (!Array.isArray(asset.acceptedTypes) || asset.acceptedTypes.length === 0) errors.push(`Submission asset ${asset.assetId} needs accepted types.`);
    if (asset.status === "reviewed" && (!asset.rightsEvidenceRequired || !asset.accessibilityEvidenceRequired)) {
      errors.push(`Reviewed submission asset ${asset.assetId} must retain rights and accessibility evidence requirements.`);
    }
  }
  if (!manifest.assets.some((asset) => asset.kind === "textbook-source" && asset.required)) {
    errors.push("A required textbook-source asset is mandatory.");
  }
  return errors;
}
