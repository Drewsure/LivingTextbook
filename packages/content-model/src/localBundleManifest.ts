export type LocalBundleAssetKind = "audio" | "video" | "image" | "font" | "source-document";

export interface LocalBundleManifestAsset {
  asset_id: string;
  kind: LocalBundleAssetKind;
  local_path: string;
  checksum: string;
  rights_status: string;
  source_uri?: string;
  poster_path?: string;
  transcript_path?: string;
}

export interface LocalBundleManifestRoute {
  qr_id: string;
  target_type: string;
  target_id: string;
  local_fallback_path: string;
}

export interface LocalBundleManifest {
  bundle_id: string;
  tenant_id: string;
  curriculum_id?: string;
  series_id?: string;
  book_id?: string;
  unit_ids?: string[];
  version: string;
  created_at: string;
  content_package_path: string;
  media_root: string;
  offline_ready: boolean;
  requires_hosted_redirect: boolean;
  assets: LocalBundleManifestAsset[];
  routes: LocalBundleManifestRoute[];
}

export interface LocalBundleManifestValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const localBundleAssetKinds = new Set<LocalBundleAssetKind>([
  "audio",
  "video",
  "image",
  "font",
  "source-document",
]);
const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const sha256Pattern = /^sha256-[a-f0-9]{64}$/;

export function validateLocalBundleManifest(value: unknown): LocalBundleManifestValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isRecord(value)) {
    return { valid: false, errors: ["Local bundle manifest must be an object."], warnings: [] };
  }

  for (const field of ["bundle_id", "tenant_id", "version", "created_at", "content_package_path", "media_root"] as const) {
    if (!readString(value[field])) errors.push(`Local bundle manifest ${field} is required.`);
  }
  for (const field of ["bundle_id", "tenant_id"] as const) {
    const candidate = readString(value[field]);
    if (candidate && !safeIdentifierPattern.test(candidate)) {
      errors.push(`Local bundle manifest ${field} contains unsafe identifier characters.`);
    }
  }
  if (readString(value.created_at) && Number.isNaN(Date.parse(readString(value.created_at)))) {
    errors.push("Local bundle manifest created_at must be an ISO-compatible timestamp.");
  }
  if (typeof value.offline_ready !== "boolean") errors.push("Local bundle manifest offline_ready must be a boolean.");
  if (typeof value.requires_hosted_redirect !== "boolean") errors.push("Local bundle manifest requires_hosted_redirect must be a boolean.");
  if (!isSafeRelativePath(readString(value.content_package_path))) errors.push("Local bundle content_package_path must be a safe relative path.");
  if (!isSafeRelativePath(readString(value.media_root), true)) errors.push("Local bundle media_root must be a safe relative path.");

  if (value.unit_ids !== undefined) {
    if (!Array.isArray(value.unit_ids) || value.unit_ids.some((item) => typeof item !== "string" || !item.trim())) {
      errors.push("Local bundle manifest unit_ids must contain non-empty strings.");
    }
  }

  const assets = Array.isArray(value.assets) ? value.assets : [];
  if (!Array.isArray(value.assets)) errors.push("Local bundle manifest assets must be an array.");
  const assetIds = new Set<string>();
  const assetPaths = new Set<string>();
  assets.forEach((asset, index) => {
    if (!isRecord(asset)) {
      errors.push(`Local bundle asset ${index + 1} must be an object.`);
      return;
    }
    const assetId = readString(asset.asset_id);
    const localPath = readString(asset.local_path);
    const checksum = readString(asset.checksum);
    const rightsStatus = readString(asset.rights_status);
    if (!assetId) errors.push(`Local bundle asset ${index + 1} requires asset_id.`);
    else if (assetIds.has(assetId)) errors.push(`Local bundle asset id ${assetId} must be unique.`);
    else assetIds.add(assetId);
    if (!localPath) errors.push(`Local bundle asset ${assetId || index + 1} requires local_path.`);
    else if (assetPaths.has(localPath)) errors.push(`Local bundle asset path ${localPath} must be unique.`);
    else assetPaths.add(localPath);
    if (!localBundleAssetKinds.has(asset.kind as LocalBundleAssetKind)) {
      errors.push(`Local bundle asset ${assetId || index + 1} has an unsupported kind.`);
    }
    if (!isSafeRelativePath(localPath)) errors.push(`Local bundle asset ${assetId || index + 1} local_path must be safe and relative.`);
    if (!checksum) warnings.push(`Local bundle asset ${assetId || index + 1} is missing a checksum.`);
    else if (!sha256Pattern.test(checksum)) warnings.push(`Local bundle asset ${assetId || index + 1} does not have a final sha256 checksum.`);
    if (!rightsStatus || rightsStatus === "unknown") warnings.push(`Local bundle asset ${assetId || index + 1} needs rights evidence.`);
    for (const pathField of ["poster_path", "transcript_path"] as const) {
      const pathValue = readString(asset[pathField]);
      if (pathValue && !isSafeRelativePath(pathValue)) errors.push(`Local bundle asset ${assetId || index + 1} ${pathField} must be safe and relative.`);
    }
  });

  const routes = Array.isArray(value.routes) ? value.routes : [];
  if (!Array.isArray(value.routes)) errors.push("Local bundle manifest routes must be an array.");
  const qrIds = new Set<string>();
  routes.forEach((route, index) => {
    if (!isRecord(route)) {
      errors.push(`Local bundle route ${index + 1} must be an object.`);
      return;
    }
    const qrId = readString(route.qr_id);
    if (!qrId) errors.push(`Local bundle route ${index + 1} requires qr_id.`);
    else if (qrIds.has(qrId)) errors.push(`Local bundle route id ${qrId} must be unique.`);
    else qrIds.add(qrId);
    if (!readString(route.target_type)) errors.push(`Local bundle route ${qrId || index + 1} requires target_type.`);
    if (!readString(route.target_id)) errors.push(`Local bundle route ${qrId || index + 1} requires target_id.`);
    if (!isSafeRelativePath(readString(route.local_fallback_path), false, true)) {
      errors.push(`Local bundle route ${qrId || index + 1} local_fallback_path must be a safe application path.`);
    }
  });

  if (value.offline_ready === true) {
    if (value.requires_hosted_redirect === true) errors.push("Offline-ready bundles cannot require a hosted redirect.");
    assets.forEach((asset, index) => {
      if (!isRecord(asset) || !sha256Pattern.test(readString(asset.checksum))) {
        errors.push(`Offline-ready bundle asset ${readString(isRecord(asset) ? asset.asset_id : undefined) || index + 1} requires a final sha256 checksum.`);
      }
      if (!isRecord(asset) || !readString(asset.rights_status) || readString(asset.rights_status) === "unknown") {
        errors.push(`Offline-ready bundle asset ${readString(isRecord(asset) ? asset.asset_id : undefined) || index + 1} requires rights evidence.`);
      }
    });
  }

  return { valid: errors.length === 0, errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isSafeRelativePath(value: string, allowDirectory = false, allowApplicationPath = false): boolean {
  if (!value || value.includes("\\") || /^[A-Za-z]:/.test(value)) return false;
  if (allowApplicationPath && !value.startsWith("/")) return false;
  if (!allowApplicationPath && value.startsWith("/")) return false;
  const segments = value.split("/");
  if (segments.some((segment, index) => segment === ".." || segment === "." || (segment === "" && !allowDirectory && !(allowApplicationPath && index === 0)))) return false;
  if (!allowDirectory && value.endsWith("/")) return false;
  return true;
}
