import type { LocalBundleManifestAsset } from "./localBundleManifest";

export interface LocalBundleAssetEvidenceResult {
  assetId: string;
  rightsReady: boolean;
  checksumReady: boolean;
  scanReady: boolean;
  targetMappingReady: boolean;
  accessibilityReady: boolean;
  handoffReady: boolean;
  blockers: string[];
}

const finalChecksumPattern = /^sha256-[a-f0-9]{64}$/;

export function evaluateLocalBundleAssetEvidence(asset: LocalBundleManifestAsset): LocalBundleAssetEvidenceResult {
  const rightsReady = asset.rights_status === "owned" || asset.rights_status === "licensed";
  const checksumReady = finalChecksumPattern.test(asset.checksum);
  const scanReady = asset.scan_status === "passed";
  const targetMappingReady = asset.target_mapping_reviewed === true;
  const accessibilityReady = getAccessibilityReadiness(asset);
  const blockers: string[] = [];

  if (!rightsReady) blockers.push("Rights evidence is incomplete.");
  if (!checksumReady) blockers.push("Final SHA-256 checksum is missing.");
  if (!scanReady) blockers.push("Security scan has not passed.");
  if (!targetMappingReady) blockers.push("Target mapping review is incomplete.");
  if (!accessibilityReady) blockers.push(getAccessibilityBlocker(asset));

  return {
    assetId: asset.asset_id,
    rightsReady,
    checksumReady,
    scanReady,
    targetMappingReady,
    accessibilityReady,
    handoffReady: blockers.length === 0,
    blockers,
  };
}

function getAccessibilityReadiness(asset: LocalBundleManifestAsset): boolean {
  if (asset.kind === "audio") return Boolean(asset.transcript_path);
  if (asset.kind === "video") return Boolean(asset.poster_path && asset.transcript_path);
  if (asset.kind === "image") return asset.alt_text_ready === true;
  return true;
}

function getAccessibilityBlocker(asset: LocalBundleManifestAsset): string {
  if (asset.kind === "audio") return "Transcript evidence is required.";
  if (asset.kind === "video") return "Poster and transcript/caption evidence are required.";
  if (asset.kind === "image") return "Alt-text evidence is required for image assets.";
  return "Accessibility evidence is incomplete.";
}
