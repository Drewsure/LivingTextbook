export type LocalBundleMediaEvidenceBindingStatus = "blocked" | "review-only";
export type LocalBundleMediaEvidenceKind = "audio" | "video" | "image";
export type LocalBundleMediaRightsStatus = "owned" | "licensed" | "partner-provided" | "unknown";
export type LocalBundleMediaScanStatus = "pending" | "passed" | "failed";

export interface LocalBundleMediaEvidenceEntry {
  assetId: string;
  label: string;
  kind: LocalBundleMediaEvidenceKind;
  relativePath: string;
  sourceRef: string;
  rightsStatus: LocalBundleMediaRightsStatus;
  rightsEvidenceRef: string;
  checksum: string;
  scanStatus: LocalBundleMediaScanStatus;
  targetMappingReviewed: boolean;
  transcriptOrCaptionRef: string | null;
  posterRef: string | null;
  altTextReady: boolean;
  localEligibility: "review-required" | "blocked";
  blockers: string[];
}

export interface LocalBundleMediaEvidenceBinding {
  bindingId: string;
  manifestId: string;
  tenantId: string;
  bundleId: string;
  packageId: string;
  packageVersion: string;
  mode: "review-only";
  status: "blocked";
  assets: LocalBundleMediaEvidenceEntry[];
  assetCopyAllowed: false;
  packageWriteAllowed: false;
  studentFacingAllowed: false;
  localActivationAllowed: false;
  blockedActions: string[];
  sideEffect: "none";
}

const REQUIRED_BLOCKED_ACTIONS = [
  "file-upload",
  "media-copy",
  "package-write",
  "local-activation",
  "student-promotion",
  "qr-mutation",
] as const;
const SHA256_PATTERN = /^sha256-[a-f0-9]{64}$/;

export function validateLocalBundleMediaEvidenceBinding(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local bundle media evidence binding must be a JSON object."];
  for (const field of ["bindingId", "manifestId", "tenantId", "bundleId", "packageId", "packageVersion"] as const) {
    if (!readString(value, field)) errors.push(`Local bundle media evidence binding requires ${field}.`);
  }
  if (readString(value, "mode") !== "review-only") errors.push("Local bundle media evidence binding must remain review-only.");
  if (readString(value, "status") !== "blocked") errors.push("Local bundle media evidence binding must remain blocked.");
  if (readString(value, "sideEffect") !== "none") errors.push("Local bundle media evidence binding must have no side effect.");
  for (const field of ["assetCopyAllowed", "packageWriteAllowed", "studentFacingAllowed", "localActivationAllowed"] as const) {
    if (value[field] !== false) errors.push(`Local bundle media evidence binding must keep ${field}: false.`);
  }

  const assets = readArray(value, "assets");
  if (assets.length === 0) errors.push("Local bundle media evidence binding must include at least one media asset.");
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const asset of assets) {
    if (!isRecord(asset)) {
      errors.push("Local bundle media evidence entries must be objects.");
      continue;
    }
    const assetId = readString(asset, "assetId");
    const relativePath = readString(asset, "relativePath");
    const kind = readString(asset, "kind");
    if (!assetId || ids.has(assetId)) errors.push(`Local bundle media asset id must be unique: ${assetId || "(missing)"}.`);
    ids.add(assetId);
    if (!relativePath || !isSafeRelativePath(relativePath) || paths.has(relativePath)) errors.push(`Local bundle media asset ${assetId || "(missing)"} must use a unique safe relative path.`);
    paths.add(relativePath);
    if (!["audio", "video", "image"].includes(kind)) errors.push(`Local bundle media asset ${assetId || "(missing)"} has an unsupported kind.`);
    for (const field of ["label", "sourceRef", "rightsEvidenceRef"] as const) if (!readString(asset, field)) errors.push(`Local bundle media asset ${assetId || "(missing)"} requires ${field}.`);
    if (!["owned", "licensed", "partner-provided", "unknown"].includes(readString(asset, "rightsStatus"))) errors.push(`Local bundle media asset ${assetId || "(missing)"} has an unsupported rights status.`);
    const checksum = readString(asset, "checksum");
    if (checksum && checksum !== "missing" && !SHA256_PATTERN.test(checksum)) errors.push(`Local bundle media asset ${assetId || "(missing)"} checksum must be sha256 or missing.`);
    if (!["pending", "passed", "failed"].includes(readString(asset, "scanStatus"))) errors.push(`Local bundle media asset ${assetId || "(missing)"} requires scan status.`);
    if (typeof asset.targetMappingReviewed !== "boolean") errors.push(`Local bundle media asset ${assetId || "(missing)"} requires target mapping state.`);
    if (!["review-required", "blocked"].includes(readString(asset, "localEligibility"))) errors.push(`Local bundle media asset ${assetId || "(missing)"} must remain review-required or blocked.`);
    if (readString(asset, "localEligibility") !== "blocked" && readString(asset, "localEligibility") !== "review-required") errors.push(`Local bundle media asset ${assetId || "(missing)"} local eligibility is invalid.`);
    if (kind === "audio" && !readString(asset, "transcriptOrCaptionRef")) errors.push(`Local bundle audio asset ${assetId || "(missing)"} requires transcript evidence reference.`);
    if (kind === "video" && (!readString(asset, "transcriptOrCaptionRef") || !readString(asset, "posterRef"))) errors.push(`Local bundle video asset ${assetId || "(missing)"} requires caption and poster references.`);
    if (kind === "image" && typeof asset.altTextReady !== "boolean") errors.push(`Local bundle image asset ${assetId || "(missing)"} requires an explicit alt-text readiness state.`);
    if (!Array.isArray(asset.blockers) || asset.blockers.length === 0) errors.push(`Local bundle media asset ${assetId || "(missing)"} must expose blockers in review-only mode.`);
  }

  const blockedActions = readStringArray(value, "blockedActions");
  for (const action of REQUIRED_BLOCKED_ACTIONS) if (!blockedActions.includes(action)) errors.push(`Local bundle media evidence binding must block ${action}.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readString(source: Record<string, any>, key: string): string {
  return typeof source[key] === "string" ? source[key].trim() : "";
}
function readArray(source: Record<string, any>, key: string): unknown[] {
  return Array.isArray(source[key]) ? source[key] : [];
}
function readStringArray(source: Record<string, any>, key: string): string[] {
  return readArray(source, key).filter((value): value is string => typeof value === "string").map((value) => value.trim());
}
function isSafeRelativePath(value: string): boolean {
  return Boolean(value) && !value.startsWith("/") && !value.startsWith("file:") && !value.includes("\\") && !value.split("/").some((part) => part === ".." || part === "." || part === "");
}
