import type { AssetManifestDecision, AssetManifestPreview } from "./assetManifestRuntime";

export type AssetDeploymentMode = "hosted" | "local" | "hybrid";

export interface AssetManifestReleaseControlBinding {
  bindingId: string;
  manifestId: string;
  evidencePacketId: string;
  releaseGateId: string;
  tenantId: string;
  packageId: string;
  packageVersion: string;
  target: AssetManifestPreview["target"];
  deploymentMode: AssetDeploymentMode;
  manifestDecision: AssetManifestDecision;
  releaseDecision: AssetManifestDecision;
  decision: AssetManifestDecision;
  blockers: string[];
  requiredApprovals: string[];
  blockedActions: string[];
  storageWriteAllowed: false;
  promotionAllowed: false;
  studentFacingAllowed: false;
  localActivationAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export interface AssetManifestReleaseControlOptions {
  packageVersion: string;
  deploymentMode: AssetDeploymentMode;
  releaseDecision: AssetManifestDecision;
  releaseBlockingReasons: string[];
  requiredApprovals: string[];
  deploymentPolicyReviewed: boolean;
  hostedStorageReviewed: boolean;
  localBundleReviewed: boolean;
}

const requiredBlockedActions = [
  "No asset release",
  "No package publish",
  "No hosted storage write",
  "No local bundle activation",
  "No student-facing promotion",
  "No QR mutation",
] as const;

export function deriveAssetManifestReleaseControlBinding(
  preview: AssetManifestPreview,
  options: AssetManifestReleaseControlOptions,
): AssetManifestReleaseControlBinding {
  const blockers = [
    ...preview.blockers,
    ...options.releaseBlockingReasons.map((reason) => `Release control: ${reason}`),
    ...(options.deploymentPolicyReviewed ? [] : ["Deployment policy review is incomplete."]),
    ...(options.deploymentMode !== "hosted" && options.localBundleReviewed ? [] : options.deploymentMode === "hosted" ? [] : ["Local bundle readiness is incomplete."]),
    ...(options.deploymentMode !== "local" && options.hostedStorageReviewed ? [] : options.deploymentMode === "local" ? [] : ["Hosted storage readiness is incomplete."]),
    "Asset release adapter is not selected.",
  ];
  const identityMatches = Boolean(preview.tenantId && preview.packageId && preview.releaseGateId);
  const decision: AssetManifestDecision = !identityMatches || preview.decision === "blocked" || options.releaseDecision === "blocked"
    ? "blocked"
    : blockers.length > 1 || options.releaseDecision === "needs-review"
      ? "needs-review"
      : "evidence-ready";

  return {
    bindingId: `${preview.releaseGateId}:${preview.manifestId}`,
    manifestId: preview.manifestId,
    evidencePacketId: preview.evidencePacketId,
    releaseGateId: preview.releaseGateId,
    tenantId: preview.tenantId,
    packageId: preview.packageId,
    packageVersion: options.packageVersion,
    target: preview.target,
    deploymentMode: options.deploymentMode,
    manifestDecision: preview.decision,
    releaseDecision: options.releaseDecision,
    decision,
    blockers: [...new Set(blockers)],
    requiredApprovals: [...new Set(options.requiredApprovals.map((approval) => approval.trim()).filter(Boolean))],
    blockedActions: [...new Set([...preview.blockedActions, ...requiredBlockedActions])],
    storageWriteAllowed: false,
    promotionAllowed: false,
    studentFacingAllowed: false,
    localActivationAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateAssetManifestReleaseControlBinding(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["asset manifest release-control binding must be a JSON object"];
  for (const field of ["bindingId", "manifestId", "evidencePacketId", "releaseGateId", "tenantId", "packageId", "packageVersion"] as const) {
    if (!readText(value[field])) errors.push(`asset manifest release-control binding requires ${field}`);
  }
  if (!(Array.from(["game-asset-manifest", "media-manifest", "source-document-manifest"]) as string[]).includes(String(value.target))) errors.push("asset manifest release-control target is unsupported");
  if (!(Array.from(["hosted", "local", "hybrid"]) as string[]).includes(String(value.deploymentMode))) errors.push("asset manifest release-control deployment mode is unsupported");
  for (const field of ["manifestDecision", "releaseDecision", "decision"] as const) {
    if (!(Array.from(["blocked", "needs-review", "evidence-ready"]) as string[]).includes(String(value[field]))) errors.push(`asset manifest release-control ${field} is unsupported`);
  }
  if (!Array.isArray(value.blockers) || value.blockers.length === 0) errors.push("asset manifest release-control must expose blockers");
  if (!Array.isArray(value.requiredApprovals) || value.requiredApprovals.length === 0) errors.push("asset manifest release-control must list required approvals");
  if (value.storageWriteAllowed !== false || value.promotionAllowed !== false || value.studentFacingAllowed !== false || value.localActivationAllowed !== false) errors.push("asset manifest release-control must block all activation side effects");
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("asset manifest release-control must remain review-only with no side effect");
  if (!Array.isArray(value.blockedActions)) errors.push("asset manifest release-control must expose blocked actions");
  else for (const action of requiredBlockedActions) if (!value.blockedActions.includes(action)) errors.push(`asset manifest release-control must block ${action}`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
