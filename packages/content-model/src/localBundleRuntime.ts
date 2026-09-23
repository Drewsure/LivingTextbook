import {
  validateLocalBundleManifest,
  type LocalBundleManifest,
  type LocalBundleManifestAsset,
  type LocalBundleManifestRoute,
} from "./localBundleManifest";

export type LocalBundleResolverMode = "read-only-rehearsal";
export type LocalBundleDeliveryStatus = "planning" | "offline-ready";

export interface LocalBundleRouteResolution {
  qrId: string;
  tenantId: string;
  targetType: string;
  targetId: string;
  localFallbackPath: string;
  deliveryStatus: LocalBundleDeliveryStatus;
}

export interface LocalBundleAssetResolution {
  assetId: string;
  tenantId: string;
  kind: LocalBundleManifestAsset["kind"];
  localPath: string;
  checksum: string;
  rightsStatus: string;
  deliveryStatus: LocalBundleDeliveryStatus;
}

export interface ReadOnlyLocalBundleResolver {
  readonly mode: LocalBundleResolverMode;
  readonly deliveryStatus: LocalBundleDeliveryStatus;
  readonly manifest: LocalBundleManifest;
  resolveRoute(tenantId: string, qrId: string): LocalBundleRouteResolution | undefined;
  resolveAsset(tenantId: string, assetId: string): LocalBundleAssetResolution | undefined;
}

export interface ReadOnlyLocalBundleResolverResult {
  valid: boolean;
  mode: LocalBundleResolverMode;
  deliveryStatus?: LocalBundleDeliveryStatus;
  errors: string[];
  warnings: string[];
  resolver?: ReadOnlyLocalBundleResolver;
}

export function createReadOnlyLocalBundleResolver(value: unknown): ReadOnlyLocalBundleResolverResult {
  const validation = validateLocalBundleManifest(value);
  const mode: LocalBundleResolverMode = "read-only-rehearsal";
  if (!validation.valid || !isManifest(value)) {
    return { valid: false, mode, errors: validation.errors, warnings: validation.warnings };
  }

  const manifest = value;
  const routes = new Map(manifest.routes.map((route) => [route.qr_id, route]));
  const assets = new Map(manifest.assets.map((asset) => [asset.asset_id, asset]));
  const deliveryStatus: LocalBundleDeliveryStatus = manifest.offline_ready ? "offline-ready" : "planning";
  return {
    valid: true,
    mode,
    deliveryStatus,
    errors: [],
    warnings: validation.warnings,
    resolver: {
      mode,
      deliveryStatus,
      manifest,
      resolveRoute(tenantId, qrId) {
        if (tenantId !== manifest.tenant_id) return undefined;
        const route = routes.get(qrId);
        return route ? toRouteResolution(manifest.tenant_id, route, deliveryStatus) : undefined;
      },
      resolveAsset(tenantId, assetId) {
        if (tenantId !== manifest.tenant_id) return undefined;
        const asset = assets.get(assetId);
        return asset ? toAssetResolution(manifest.tenant_id, asset, deliveryStatus) : undefined;
      },
    },
  };
}

function isManifest(value: unknown): value is LocalBundleManifest {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toRouteResolution(tenantId: string, route: LocalBundleManifestRoute, deliveryStatus: LocalBundleDeliveryStatus): LocalBundleRouteResolution {
  return {
    qrId: route.qr_id,
    tenantId,
    targetType: route.target_type,
    targetId: route.target_id,
    localFallbackPath: route.local_fallback_path,
    deliveryStatus,
  };
}

function toAssetResolution(tenantId: string, asset: LocalBundleManifestAsset, deliveryStatus: LocalBundleDeliveryStatus): LocalBundleAssetResolution {
  return {
    assetId: asset.asset_id,
    tenantId,
    kind: asset.kind,
    localPath: asset.local_path,
    checksum: asset.checksum,
    rightsStatus: asset.rights_status,
    deliveryStatus,
  };
}
