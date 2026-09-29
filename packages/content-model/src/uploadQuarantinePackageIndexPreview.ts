import type { UploadQuarantineDeliveryManifestPreview } from "./uploadQuarantineDeliveryManifestPreview";
import type { UploadQuarantinePackageEvidenceReview } from "./uploadQuarantinePackageEvidenceReview";

export type UploadQuarantinePackageIndexPreviewStatus = "reviewed" | "open" | "blocked";
export type UploadQuarantinePackageIndexPreviewCategory = "content" | "game" | "audio" | "video" | "image" | "font" | "accessibility" | "rights" | "qr" | "local";

export interface UploadQuarantinePackageIndexPreviewEntry {
  entryId: string;
  category: UploadQuarantinePackageIndexPreviewCategory;
  label: string;
  status: UploadQuarantinePackageIndexPreviewStatus;
  evidence: string;
  nextAction: string;
}

export interface UploadQuarantinePackageIndexPreview {
  recordVersion: 1;
  previewId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  manifestId: string;
  releaseReceiptId: string;
  packageIndexId: string;
  sourceChecksumSha256: string;
  selectedMode: "unselected" | "closed-local" | "hosted-pwa" | "hybrid";
  status: "blocked";
  entries: UploadQuarantinePackageIndexPreviewEntry[];
  gameRoutePaths: [];
  mediaKinds: [];
  qrAliasPaths: [];
  localFallbackPaths: [];
  unresolvedRequirements: string[];
  blockedActions: string[];
  packageAssemblyAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
  rawPayloadIncluded: false;
  learnerRecordsIncluded: false;
  mode: "review-only";
  sideEffect: "metadata-only";
}

const requiredCategories: UploadQuarantinePackageIndexPreviewCategory[] = ["content", "game", "audio", "video", "image", "font", "accessibility", "rights", "qr", "local"];

const blockedActions = [
  "No package index write from this preview",
  "No game route or media path creation from this preview",
  "No QR alias mutation or production print from this preview",
  "No local bundle or hosted persistence activation from this preview",
  "No student-facing use from this preview",
] as const;

export function createReviewOnlyUploadQuarantinePackageIndexPreview(input: {
  deliveryManifestPreview: UploadQuarantineDeliveryManifestPreview;
  packageEvidenceReview: UploadQuarantinePackageEvidenceReview | null;
}): UploadQuarantinePackageIndexPreview {
  const { deliveryManifestPreview, packageEvidenceReview } = input;
  const laneStatus = (category: UploadQuarantinePackageIndexPreviewCategory): UploadQuarantinePackageIndexPreviewStatus => {
    if (category === "qr" || category === "local") return "blocked";
    if (!packageEvidenceReview) return "open";
    return packageEvidenceReview.reviewedLanes.includes(category as never) ? "reviewed" : "open";
  };
  const entries = requiredCategories.map((category) => {
    const status = laneStatus(category);
    const evidence = category === "qr"
      ? "No approved manifest or durable QR alias registry is linked to this quarantine."
      : category === "local"
        ? "No approved local bundle, fallback test, or recovery record is linked to this quarantine."
        : packageEvidenceReview
          ? packageEvidenceReview.reviewedLanes.includes(category as never) ? `The ${category} evidence lane is recorded in ${packageEvidenceReview.reviewId}.` : `The ${category} evidence lane is not recorded in ${packageEvidenceReview.reviewId}.`
          : `No reviewed ${category} evidence record is linked.`;
    const nextAction = category === "qr"
      ? "Complete alias, release checksum, rollback, and human print authorization."
      : category === "local"
        ? "Complete closed-local bundle, media, update, backup, and recovery evidence."
        : status === "reviewed" ? "Keep this lane bound to the final package checksum." : `Review the ${category} lane before assembly.`;
    return { entryId: `${deliveryManifestPreview.packageIndexId}:${category}`, category, label: category === "qr" ? "QR aliases and print map" : category === "local" ? "Closed-local fallback" : `${category[0].toUpperCase()}${category.slice(1)} evidence`, status, evidence, nextAction };
  });
  return {
    recordVersion: 1,
    previewId: `${deliveryManifestPreview.previewId}:package-index-preview`,
    tenantId: deliveryManifestPreview.tenantId,
    quarantineId: deliveryManifestPreview.quarantineId,
    packageId: deliveryManifestPreview.packageId,
    manifestId: deliveryManifestPreview.manifestId,
    releaseReceiptId: deliveryManifestPreview.releaseReceiptId,
    packageIndexId: deliveryManifestPreview.packageIndexId,
    sourceChecksumSha256: deliveryManifestPreview.sourceChecksumSha256,
    selectedMode: deliveryManifestPreview.selectedMode,
    status: "blocked",
    entries,
    gameRoutePaths: [],
    mediaKinds: [],
    qrAliasPaths: [],
    localFallbackPaths: [],
    unresolvedRequirements: entries.filter((entry) => entry.status !== "reviewed").map((entry) => `${entry.label}: ${entry.evidence}`),
    blockedActions: [...blockedActions],
    packageAssemblyAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
    rawPayloadIncluded: false,
    learnerRecordsIncluded: false,
    mode: "review-only",
    sideEffect: "metadata-only",
  };
}

export function validateUploadQuarantinePackageIndexPreview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine package index preview must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine package index preview recordVersion must be 1.");
  for (const field of ["previewId", "tenantId", "quarantineId", "packageId", "manifestId", "releaseReceiptId", "packageIndexId"] as const) if (!isSafeIdentifier(value[field])) errors.push(`Upload quarantine package index preview ${field} must be a bounded safe identifier.`);
  if (!/^([a-f0-9]{64})$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Upload quarantine package index preview checksum must be lowercase SHA-256.");
  if (!["unselected", "closed-local", "hosted-pwa", "hybrid"].includes(String(value.selectedMode))) errors.push("Upload quarantine package index preview selectedMode is unsupported.");
  if (value.status !== "blocked" || value.mode !== "review-only" || value.sideEffect !== "metadata-only") errors.push("Upload quarantine package index preview must remain blocked, review-only, and metadata-only.");
  for (const field of ["packageAssemblyAllowed", "qrPrintAllowed", "studentFacingUseAllowed", "rawPayloadIncluded", "learnerRecordsIncluded"] as const) if (value[field] !== false) errors.push(`Upload quarantine package index preview ${field} must remain false.`);
  for (const field of ["gameRoutePaths", "mediaKinds", "qrAliasPaths", "localFallbackPaths"] as const) if (!Array.isArray(value[field]) || value[field].length !== 0) errors.push(`Upload quarantine package index preview ${field} must remain empty before an approved package index exists.`);
  if (!Array.isArray(value.entries) || value.entries.length !== requiredCategories.length) errors.push("Upload quarantine package index preview must contain one entry for every required category.");
  const entries = Array.isArray(value.entries) ? value.entries : [];
  const seen = new Set<string>();
  for (const entry of entries) {
    if (!isRecord(entry)) { errors.push("Upload quarantine package index preview entries must be objects."); continue; }
    if (!isSafeIdentifier(entry.entryId) || !isNonEmptyString(entry.label) || !isNonEmptyString(entry.evidence) || !isNonEmptyString(entry.nextAction)) errors.push("Upload quarantine package index preview entries require safe identity, label, evidence, and nextAction.");
    if (!requiredCategories.includes(entry.category as UploadQuarantinePackageIndexPreviewCategory)) errors.push("Upload quarantine package index preview entry category is unsupported.");
    if (seen.has(String(entry.category))) errors.push(`Upload quarantine package index preview contains duplicate category ${String(entry.category)}.`);
    seen.add(String(entry.category));
    if (!["reviewed", "open", "blocked"].includes(String(entry.status))) errors.push("Upload quarantine package index preview entry status is unsupported.");
  }
  for (const category of requiredCategories) if (!seen.has(category)) errors.push(`Upload quarantine package index preview is missing category ${category}.`);
  if (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine package index preview unresolvedRequirements must contain strings.");
  for (const action of blockedActions) if (!Array.isArray(value.blockedActions) || !value.blockedActions.includes(action)) errors.push(`Upload quarantine package index preview must block action: ${action}.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeIdentifier(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value); }
