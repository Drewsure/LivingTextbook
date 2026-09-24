export type LocalBundleAssetKind = "audio" | "video" | "image" | "font" | "source-document";
export type LocalBundleAssetScanStatus = "pending" | "passed";

export interface LocalBundleManifestAsset {
  asset_id: string;
  kind: LocalBundleAssetKind;
  local_path: string;
  checksum: string;
  rights_status: string;
  scan_status?: LocalBundleAssetScanStatus;
  target_mapping_reviewed?: boolean;
  alt_text_ready?: boolean;
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

export interface LocalBundlePackageIdentity {
  tenant_id: string;
  bundle_id: string;
  curriculum_id: string;
  series_id: string;
  book_id: string;
  unit_ids: string[];
}

export interface LocalBundleManifestValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateLocalBundlePackageIdentity(value: LocalBundleManifest): string[] {
  const errors: string[] = [];
  const requiredFields = ["curriculum_id", "series_id", "book_id"] as const;

  for (const field of requiredFields) {
    const candidate = value[field];
    if (typeof candidate !== "string" || !candidate.trim()) {
      errors.push(`Local bundle package identity ${field} is required for resolver activation.`);
    } else if (!safeIdentifierPattern.test(candidate.trim())) {
      errors.push(`Local bundle package identity ${field} contains unsafe identifier characters.`);
    }
  }

  if (!Array.isArray(value.unit_ids) || value.unit_ids.length === 0) {
    errors.push("Local bundle package identity unit_ids must contain at least one unit.");
  } else {
    const seenUnitIds = new Set<string>();
    value.unit_ids.forEach((unitId, index) => {
      if (typeof unitId !== "string" || !unitId.trim()) {
        errors.push(`Local bundle package identity unit_ids[${index}] must be a non-empty string.`);
        return;
      }
      const normalizedUnitId = unitId.trim();
      if (!safeIdentifierPattern.test(normalizedUnitId)) {
        errors.push(`Local bundle package identity unit ${normalizedUnitId} contains unsafe identifier characters.`);
      }
      if (seenUnitIds.has(normalizedUnitId)) {
        errors.push(`Local bundle package identity unit ${normalizedUnitId} must be unique.`);
      }
      seenUnitIds.add(normalizedUnitId);
    });
  }

  return [...new Set(errors)];
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
    if (asset.scan_status !== undefined && asset.scan_status !== "pending" && asset.scan_status !== "passed") {
      errors.push(`Local bundle asset ${assetId || index + 1} scan_status must be pending or passed.`);
    }
    if (asset.target_mapping_reviewed !== undefined && typeof asset.target_mapping_reviewed !== "boolean") {
      errors.push(`Local bundle asset ${assetId || index + 1} target_mapping_reviewed must be a boolean.`);
    }
    if (asset.alt_text_ready !== undefined && typeof asset.alt_text_ready !== "boolean") {
      errors.push(`Local bundle asset ${assetId || index + 1} alt_text_ready must be a boolean.`);
    }
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
      if (!isRecord(asset) || asset.scan_status !== "passed") {
        errors.push(`Offline-ready bundle asset ${readString(isRecord(asset) ? asset.asset_id : undefined) || index + 1} requires a passed scan.`);
      }
      if (!isRecord(asset) || asset.target_mapping_reviewed !== true) {
        errors.push(`Offline-ready bundle asset ${readString(isRecord(asset) ? asset.asset_id : undefined) || index + 1} requires reviewed target mapping.`);
      }
      if (isRecord(asset)) {
        const assetLabel = readString(asset.asset_id) || String(index + 1);
        if (asset.kind === "audio" && !readString(asset.transcript_path)) {
          errors.push(`Offline-ready audio asset ${assetLabel} requires transcript evidence.`);
        }
        if (asset.kind === "video" && (!readString(asset.poster_path) || !readString(asset.transcript_path))) {
          errors.push(`Offline-ready video asset ${assetLabel} requires poster and transcript/caption evidence.`);
        }
        if (asset.kind === "image" && asset.alt_text_ready !== true) {
          errors.push(`Offline-ready image asset ${assetLabel} requires alt-text evidence.`);
        }
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
