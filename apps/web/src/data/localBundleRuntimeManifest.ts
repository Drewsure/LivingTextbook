import type { LocalBundleManifest } from "@living-textbook/content-model";
import type { LocalBundleManifestSummary } from "./sampleLocalBundlePlan";

const PREVIEW_CREATED_AT = "2026-09-18T00:00:00.000Z";

export function createLocalBundleRuntimeManifest(
  summary: LocalBundleManifestSummary,
  tenantId: string,
): LocalBundleManifest {
  return {
    bundle_id: summary.bundleId,
    tenant_id: tenantId,
    curriculum_id: summary.curriculumId,
    series_id: summary.seriesId,
    book_id: summary.bookId,
    unit_ids: summary.unitIds,
    version: summary.version,
    created_at: PREVIEW_CREATED_AT,
    content_package_path: summary.contentPackagePath,
    media_root: summary.mediaRoot,
    offline_ready: summary.offlineReady,
    requires_hosted_redirect: summary.requiresHostedRedirect,
    assets: summary.assets.map((asset) => ({
      asset_id: asset.assetId,
      unit_id: asset.unitId,
      kind: asset.kind,
      local_path: asset.localPath,
      checksum: asset.checksumReady ? `sha256-${"a".repeat(64)}` : "sha256-placeholder-not-ready",
      rights_status: asset.rightsStatus,
      poster_path: asset.posterPath,
      transcript_path: asset.transcriptPath,
      scan_status: asset.scanStatus,
      target_mapping_reviewed: asset.targetMappingReviewed,
      alt_text_ready: asset.altTextReady,
    })),
    routes: summary.routes.map((route) => ({
      qr_id: route.qrId,
      unit_id: route.unitId,
      target_type: route.targetType,
      target_id: route.targetId,
      local_fallback_path: route.localFallbackPath,
    })),
  };
}
