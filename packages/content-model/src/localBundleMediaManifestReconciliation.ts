import {
  validateLocalBundleMediaEvidenceBinding,
  type LocalBundleMediaEvidenceBinding,
} from "./localBundleMediaEvidenceBinding";
import type { LocalBundlePackageManifestRollbackDryRun } from "./localBundlePackageManifestRollbackDryRun";

export type LocalBundleMediaManifestReconciliationStatus = "aligned" | "needs-evidence" | "mismatch";

export interface LocalBundleMediaManifestReconciliation {
  reconciliationId: string;
  manifestId: string;
  bindingId: string;
  tenantId: string;
  bundleId: string;
  packageId: string;
  packageVersion: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionMatches: boolean;
  status: LocalBundleMediaManifestReconciliationStatus;
  identityMatches: boolean;
  mediaArtifactFound: boolean;
  mediaArtifactPath: string | null;
  pathMatches: boolean;
  versionMatches: boolean;
  bindingErrors: string[];
  openEvidenceChecks: string[];
  mismatchChecks: string[];
  blockedActions: string[];
  localActivationAllowed: false;
  studentFacingAllowed: false;
  sideEffect: "none";
  reasons: string[];
}

const REQUIRED_BLOCKED_ACTIONS = [
  "media-copy",
  "package-write",
  "local-activation",
  "student-promotion",
  "qr-mutation",
] as const;

export function reconcileLocalBundleMediaManifest(
  manifest: LocalBundlePackageManifestRollbackDryRun,
  binding: LocalBundleMediaEvidenceBinding,
): LocalBundleMediaManifestReconciliation {
  const bindingErrors = validateLocalBundleMediaEvidenceBinding(binding);
  const mediaArtifact = manifest.artifacts.find((artifact) => artifact.kind === "media");
  const identityMatches = ["manifestId", "tenantId", "bundleId", "packageId"] .every(
    (field) => manifest[field as keyof typeof manifest] === binding[field as keyof typeof binding],
  );
  const storageSelectionMatches = manifest.storageSelectionPreflightId === binding.storageSelectionPreflightId
    && manifest.storageSelectionGateId === binding.storageSelectionGateId;
  const versionMatches = manifest.currentVersion === binding.packageVersion && mediaArtifact?.version === binding.packageVersion;
  const mediaArtifactPath = mediaArtifact?.relativePath ?? null;
  const mediaRoot = mediaArtifactPath ? mediaArtifactPath.slice(0, mediaArtifactPath.lastIndexOf("/")) : "";
  const pathMatches = Boolean(mediaArtifact && mediaRoot && binding.assets.every((asset) => asset.relativePath.startsWith(`${mediaRoot}/`)));
  const openEvidenceChecks = binding.assets.flatMap((asset) => {
    const checks: string[] = [];
    if (asset.rightsStatus === "unknown") checks.push(`${asset.assetId}: rights evidence`);
    if (asset.checksum === "missing") checks.push(`${asset.assetId}: checksum`);
    if (asset.scanStatus !== "passed") checks.push(`${asset.assetId}: security scan`);
    if (!asset.targetMappingReviewed) checks.push(`${asset.assetId}: target mapping`);
    if (asset.localEligibility !== "review-required") checks.push(`${asset.assetId}: local eligibility`);
    if (asset.kind === "image" && !asset.altTextReady) checks.push(`${asset.assetId}: alt text`);
    return checks;
  });
  const mismatchChecks = [
    ...(identityMatches ? [] : ["tenant, bundle, package, or manifest identity"]),
    ...(storageSelectionMatches ? [] : ["storage selection identity"]),
    ...(mediaArtifact ? [] : ["media manifest artifact"]),
    ...(versionMatches ? [] : ["package or media artifact version"]),
    ...(pathMatches ? [] : ["media asset path root"]),
  ];
  const blockedActions = [...new Set([
    ...binding.blockedActions,
    ...REQUIRED_BLOCKED_ACTIONS,
  ])];
  const reasons = [
    ...bindingErrors,
    ...(mismatchChecks.length > 0 ? [`Manifest reconciliation mismatch: ${mismatchChecks.join(", ")}.`] : []),
    ...(openEvidenceChecks.length > 0 ? [`Media evidence remains open: ${openEvidenceChecks.join(", ")}.`] : []),
    "Media copy, package writes, local activation, student promotion, and QR mutation remain blocked.",
  ];
  const hasMismatch = bindingErrors.length > 0 || mismatchChecks.length > 0;
  const status = hasMismatch ? "mismatch" : openEvidenceChecks.length > 0 ? "needs-evidence" : "aligned";

  return {
    reconciliationId: `${binding.bindingId}:${manifest.manifestId}`,
    manifestId: manifest.manifestId,
    bindingId: binding.bindingId,
    tenantId: binding.tenantId,
    bundleId: binding.bundleId,
    packageId: binding.packageId,
    packageVersion: binding.packageVersion,
    storageSelectionPreflightId: binding.storageSelectionPreflightId,
    storageSelectionGateId: binding.storageSelectionGateId,
    storageSelectionMatches,
    status,
    identityMatches,
    mediaArtifactFound: Boolean(mediaArtifact),
    mediaArtifactPath,
    pathMatches,
    versionMatches,
    bindingErrors,
    openEvidenceChecks: [...new Set(openEvidenceChecks)],
    mismatchChecks,
    blockedActions,
    localActivationAllowed: false,
    studentFacingAllowed: false,
    sideEffect: "none",
    reasons: [...new Set(reasons)],
  };
}
