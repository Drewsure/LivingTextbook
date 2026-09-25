import {
  createReadOnlyLocalBundleResolver,
} from "./localBundleRuntime";
import type { LocalBundleManifest } from "./localBundleManifest";
import {
  evaluateLocalBundleAssetEvidenceSet,
} from "./localBundleAssetEvidence";
import {
  validateLocalBundleHandoffPacket,
  type LocalBundleHandoffPacket,
} from "./localBundleHandoff";
import {
  validateLocalBundleHandoffPersistencePreview,
  type LocalBundleHandoffPersistencePreview,
} from "./localBundleHandoffPersistence";
import {
  validatePersistenceHandoffPacket,
  type PersistenceHandoffPacket,
} from "./persistenceHandoff";

export type LocalBundleReadinessAssessmentDecision =
  | "blocked"
  | "review-ready"
  | "offline-ready-candidate";

export type LocalBundleReadinessCheckStatus = "pass" | "warning" | "blocked";

export interface LocalBundleReadinessAssessmentCheck {
  checkId: string;
  status: LocalBundleReadinessCheckStatus;
  detail: string;
}

export interface LocalBundleReadinessAssessment {
  assessmentId: string;
  tenantId: string;
  bundleId: string;
  mode: "review-only";
  decision: LocalBundleReadinessAssessmentDecision;
  checks: LocalBundleReadinessAssessmentCheck[];
  blockers: string[];
  warnings: string[];
  identityMatches: boolean;
  routeResolutionReady: boolean;
  assetEvidenceReady: boolean;
  exportAllowed: false;
  offlineActivationAllowed: false;
  studentFacingAllowed: false;
  sideEffect: "none";
}

export interface LocalBundleReadinessAssessmentInput {
  manifest: unknown;
  expectedTenantId: string;
  handoffPacket: LocalBundleHandoffPacket;
  persistencePreview: LocalBundleHandoffPersistencePreview;
  persistencePacket: PersistenceHandoffPacket;
  deploymentChecks: ReadinessCheckInput[];
  releaseChecks: ReadinessCheckInput[];
}

export interface ReadinessCheckInput {
  checkId: string;
  status: LocalBundleReadinessCheckStatus;
}

export function assessLocalBundleReadiness(
  input: LocalBundleReadinessAssessmentInput,
): LocalBundleReadinessAssessment {
  const resolverResult = createReadOnlyLocalBundleResolver(input.manifest);
  const manifest = resolverResult.resolver?.manifest;
  const manifestErrors = resolverResult.errors;
  const identityErrors = manifest
    ? validateIdentity(manifest, input.expectedTenantId, input.handoffPacket, input.persistencePreview)
    : ["Local bundle manifest cannot be reconciled until read-only resolver validation passes."];
  const handoffErrors = validateLocalBundleHandoffPacket(input.handoffPacket);
  const persistenceErrors = validateLocalBundleHandoffPersistencePreview(
    input.persistencePreview,
    input.handoffPacket,
    input.persistencePacket,
  );
  const assetEvidence = manifest
    ? evaluateLocalBundleAssetEvidenceSet(manifest.assets)
    : { handoffReady: false, blockers: ["Asset evidence cannot be evaluated before manifest validation passes."] };
  const routeResolutionReady = Boolean(
    manifest &&
    manifest.routes.length > 0 &&
    resolverResult.resolver &&
    manifest.routes.every((route) => resolverResult.resolver?.resolveRoute(input.expectedTenantId, route.qr_id)),
  );

  const checks: LocalBundleReadinessAssessmentCheck[] = [
    {
      checkId: "manifest-validation",
      status: manifestErrors.length === 0 ? "pass" : "blocked",
      detail: manifestErrors.length === 0 ? "Manifest shape and package identity can be read by the shared resolver." : manifestErrors.join(" "),
    },
    {
      checkId: "tenant-identity",
      status: identityErrors.length === 0 ? "pass" : "blocked",
      detail: identityErrors.length === 0 ? "Tenant, bundle, and persistence handoff identities agree." : identityErrors.join(" "),
    },
    {
      checkId: "route-resolution",
      status: routeResolutionReady ? "pass" : "blocked",
      detail: routeResolutionReady ? "Every declared QR route resolves through the tenant-scoped read-only resolver." : "Every package must declare at least one QR route that resolves through the tenant-scoped read-only resolver.",
    },
    {
      checkId: "asset-evidence",
      status: assetEvidence.handoffReady ? "pass" : "blocked",
      detail: assetEvidence.handoffReady ? "Every declared asset has rights, checksum, scan, mapping, and accessibility evidence." : assetEvidence.blockers.join(" "),
    },
    {
      checkId: "handoff-persistence",
      status: handoffErrors.length === 0 && persistenceErrors.length === 0 ? "pass" : "blocked",
      detail: handoffErrors.length === 0 && persistenceErrors.length === 0 ? "Review handoff and provider-neutral persistence admission agree." : [...handoffErrors, ...persistenceErrors].join(" "),
    },
    ...summarizeOperationalChecks("deployment", input.deploymentChecks),
    ...summarizeOperationalChecks("release", input.releaseChecks),
  ];

  const blockers = unique([
    ...manifestErrors,
    ...identityErrors,
    ...(routeResolutionReady ? [] : ["QR route resolution remains blocked."]),
    ...assetEvidence.blockers,
    ...handoffErrors,
    ...persistenceErrors,
    ...operationalBlockers("deployment", input.deploymentChecks),
    ...operationalBlockers("release", input.releaseChecks),
  ]);
  const warnings = unique([
    ...(resolverResult.warnings ?? []),
    ...operationalWarnings("deployment", input.deploymentChecks),
    ...operationalWarnings("release", input.releaseChecks),
    ...(manifest?.offline_ready === true ? [] : ["The package is review-ready only until a final offline-ready manifest is produced."]),
  ]);
  const decision: LocalBundleReadinessAssessmentDecision = blockers.length > 0
    ? "blocked"
    : manifest?.offline_ready === true
      ? "offline-ready-candidate"
      : "review-ready";

  return {
    assessmentId: `${input.handoffPacket.bundleId}-readiness-assessment`,
    tenantId: input.expectedTenantId,
    bundleId: manifest?.bundle_id ?? input.handoffPacket.bundleId,
    mode: "review-only",
    decision,
    checks,
    blockers,
    warnings,
    identityMatches: identityErrors.length === 0,
    routeResolutionReady,
    assetEvidenceReady: assetEvidence.handoffReady,
    exportAllowed: false,
    offlineActivationAllowed: false,
    studentFacingAllowed: false,
    sideEffect: "none",
  };
}

function validateIdentity(
  manifest: LocalBundleManifest,
  expectedTenantId: string,
  handoffPacket: LocalBundleHandoffPacket,
  persistencePreview: LocalBundleHandoffPersistencePreview,
): string[] {
  return unique([
    ...(manifest.tenant_id === expectedTenantId ? [] : ["Local bundle manifest tenant does not match the requested tenant."]),
    ...(handoffPacket.tenantId === expectedTenantId ? [] : ["Local bundle handoff tenant does not match the requested tenant."]),
    ...(handoffPacket.bundleId === manifest.bundle_id ? [] : ["Local bundle handoff bundle does not match the manifest."]),
    ...(persistencePreview.tenantId === expectedTenantId ? [] : ["Local bundle persistence preview tenant does not match the requested tenant."]),
    ...(persistencePreview.bundleId === manifest.bundle_id ? [] : ["Local bundle persistence preview bundle does not match the manifest."]),
  ]);
}

function summarizeOperationalChecks(prefix: string, checks: ReadinessCheckInput[]): LocalBundleReadinessAssessmentCheck[] {
  const blocked = checks.filter((check) => check.status === "blocked").length;
  const warnings = checks.filter((check) => check.status === "warning").length;
  return [{
    checkId: `${prefix}-gates`,
    status: blocked > 0 ? "blocked" : warnings > 0 ? "warning" : "pass",
    detail: blocked > 0 ? `${blocked} ${prefix} gate(s) remain blocked.` : warnings > 0 ? `${warnings} ${prefix} gate(s) remain warnings.` : `All ${prefix} gates passed.`,
  }];
}

function operationalBlockers(prefix: string, checks: ReadinessCheckInput[]): string[] {
  return checks.filter((check) => check.status === "blocked").map((check) => `${prefix} check ${check.checkId} remains blocked.`);
}

function operationalWarnings(prefix: string, checks: ReadinessCheckInput[]): string[] {
  return checks.filter((check) => check.status === "warning").map((check) => `${prefix} check ${check.checkId} remains a warning.`);
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.trim()))];
}
