import { existsSync, statSync } from "node:fs";
import { isAbsolute } from "node:path";

export type PilotDeploymentMode = "hosted-pwa" | "closed-local" | "hybrid";
export type PilotDeploymentConfigurationCheckStatus = "ready" | "blocked" | "manual" | "optional";

export interface PilotDeploymentConfigurationCheck {
  checkId: string;
  label: string;
  status: PilotDeploymentConfigurationCheckStatus;
  requiredFor: PilotDeploymentMode | "all";
  evidence: string;
  nextAction: string;
}

export interface PilotDeploymentConfigurationSnapshot {
  tenantId: string;
  mode: PilotDeploymentMode;
  status: "ready-for-operator" | "blocked";
  ready: boolean;
  checks: PilotDeploymentConfigurationCheck[];
  blockers: string[];
  configuredSecretNames: string[];
  exposedSecretValues: false;
  writesEnabled: false;
  studentActivationAllowed: false;
  sideEffect: "none";
}

const uploadTokenEnvironment = "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN";
const uploadTenantEnvironment = "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS";
const uploadRootEnvironment = "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT";
const deliveryTokenEnvironment = "LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN";
const deliveryTenantEnvironment = "LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS";
const deliveryRootEnvironment = "LIVING_TEXTBOOOK_PILOT_DELIVERY_ROOT";
const qrRegistryRootEnvironment = "LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_ROOT";
const localBundleManifestReviewRootEnvironment = "LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_ROOT";
const localPackageRootEnvironment = "LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT";
const approvedAssetRootEnvironment = "LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT";
const printBaseUrlEnvironment = "LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL";
const persistenceProviderEnvironment = "LIVING_TEXTBOOK_PERSISTENCE_PROVIDER";
const hostedPersistenceActivationRootEnvironment = "LIVING_TEXTBOOOK_HOSTED_PERSISTENCE_ACTIVATION_ROOT";

const reviewGateEnvironments = [
  ["LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED", "Quarantine intake gate", "all"],
  ["LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED", "Source review decision gate", "all"],
  ["LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED", "Evidence review gate", "all"],
  ["LIVING_TEXTBOOOK_PACKAGE_EVIDENCE_REVIEWS_ENABLED", "Package evidence gate", "all"],
  ["LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED", "Package review packet gate", "all"],
  ["LIVING_TEXTBOOOK_DELIVERY_MODE_DECISIONS_ENABLED", "Delivery mode decision gate", "all"],
  ["LIVING_TEXTBOOOK_PROMOTION_ADAPTER_DECISIONS_ENABLED", "Promotion adapter decision gate", "all"],
  ["LIVING_TEXTBOOOK_PILOT_DELIVERY_WRITES_ENABLED", "Pilot delivery metadata gate", "all"],
  ["LIVING_TEXTBOOOK_PILOT_RELEASE_RECEIPT_WRITES_ENABLED", "Pilot release receipt gate", "all"],
  ["LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_WRITES_ENABLED", "QR registry write gate", "all"],
  ["LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_WRITES_ENABLED", "Reviewed local bundle manifest gate", "all"],
  ["LIVING_TEXTBOOOK_APPROVED_ASSET_PROMOTION_WRITES_ENABLED", "Approved asset promotion gate", "all"],
] as const;

const localReadGates = [
  ["LIVING_TEXTBOOOK_LOCAL_PACKAGE_READS_ENABLED", "Local package index reads"],
  ["LIVING_TEXTBOOOK_LOCAL_PACKAGE_HANDOFF_READS_ENABLED", "Local handoff reads"],
  ["LIVING_TEXTBOOOK_LOCAL_PACKAGE_INTEGRITY_READS_ENABLED", "Local integrity reads"],
  ["LIVING_TEXTBOOOK_LOCAL_PACKAGE_CONTENT_READS_ENABLED", "Local content reads"],
  ["LIVING_TEXTBOOOK_LOCAL_PACKAGE_MEDIA_READS_ENABLED", "Local media reads"],
] as const;

/**
 * Read-only operator preflight. It reports configuration shape and never
 * returns secret values, enables a gate, writes a package, or activates a
 * student route.
 */
export function readPilotDeploymentConfigurationMatrix(tenantId: string): PilotDeploymentConfigurationSnapshot[] {
  return (["hosted-pwa", "closed-local", "hybrid"] as const).map((mode) => readPilotDeploymentConfiguration(tenantId, mode));
}

export function readPilotDeploymentConfiguration(
  tenantId: string,
  mode: PilotDeploymentMode,
): PilotDeploymentConfigurationSnapshot {
  const checks: PilotDeploymentConfigurationCheck[] = [];
  const configuredSecretNames: string[] = [];
  const safeTenantId = tenantId.trim();

  addSecretCheck(checks, configuredSecretNames, "upload-credential", "Upload quarantine credential", uploadTokenEnvironment, "all");
  addTenantAllowlistCheck(checks, "upload-tenant-allowlist", "Upload tenant allowlist", uploadTenantEnvironment, safeTenantId, "all");
  addDirectoryCheck(checks, "upload-quarantine-root", "Upload quarantine custody root", uploadRootEnvironment, "all");
  addSecretCheck(checks, configuredSecretNames, "delivery-credential", "Pilot delivery credential", deliveryTokenEnvironment, "all");
  addTenantAllowlistCheck(checks, "delivery-tenant-allowlist", "Pilot delivery tenant allowlist", deliveryTenantEnvironment, safeTenantId, "all");
  addDirectoryCheck(checks, "delivery-root", "Pilot delivery metadata root", deliveryRootEnvironment, "all");
  addDirectoryCheck(checks, "qr-registry-root", "QR registry root", qrRegistryRootEnvironment, "all");
  addDirectoryCheck(checks, "local-bundle-manifest-review-root", "Reviewed local bundle manifest custody root", localBundleManifestReviewRootEnvironment, "all");
  for (const [environmentName, label, requiredFor] of reviewGateEnvironments) addManualEnvironmentGate(checks, environmentName, label, requiredFor);
  addManualGateCheck(checks, "review-writes", "Review and package writes", "all", "Write gates are deliberately disabled by default.", "Enable only after human review, rights, and release evidence are accepted.");

  if (mode === "closed-local" || mode === "hybrid") {
    addDirectoryCheck(checks, "local-package-root", "Local package root", localPackageRootEnvironment, mode);
    addDirectoryCheck(checks, "approved-asset-root", "Approved asset root", approvedAssetRootEnvironment, mode);
    addPrintBaseUrlCheck(checks, mode);
    addManualEnvironmentGate(checks, "LIVING_TEXTBOOOK_LOCAL_PACKAGE_WRITES_ENABLED", "Local package assembly gate", mode);
    for (const [environmentName, label] of localReadGates) {
      checks.push({
        checkId: environmentName.toLowerCase().replaceAll("_", "-"),
        label,
        status: process.env[environmentName] === "true" ? "ready" : "blocked",
        requiredFor: mode,
        evidence: process.env[environmentName] === "true" ? "The local runtime read gate is enabled." : "The local runtime read gate is disabled.",
        nextAction: process.env[environmentName] === "true" ? "Keep the read lane review-only until release approval." : `Enable ${environmentName} only for an approved package rehearsal.`,
      });
    }
  }

  if (mode === "hosted-pwa" || mode === "hybrid") {
    addDirectoryCheck(checks, "hosted-persistence-activation-root", "Hosted persistence activation custody root", hostedPersistenceActivationRootEnvironment, mode);
    const persistenceProvider = process.env[persistenceProviderEnvironment]?.trim() || "process-memory";
    checks.push({
      checkId: "hosted-persistence-choice",
      label: "Hosted persistence choice",
      status: persistenceProvider === "sqlite" ? "ready" : "optional",
      requiredFor: mode,
      evidence: persistenceProvider === "sqlite" ? "SQLite-managed persistence is configured for the opt-in hosted lane." : "The core pilot may rehearse without durable hosted persistence; process-memory remains non-durable.",
      nextAction: persistenceProvider === "sqlite" ? "Complete the durable-write, policy, retention, and release gates." : "Choose and configure hosted persistence only when the school opts in.",
    });
  }

  const blockers = checks
    .filter((check) => check.status === "blocked")
    .map((check) => `${check.label}: ${check.evidence}`);

  return {
    tenantId: safeTenantId,
    mode,
    status: blockers.length === 0 ? "ready-for-operator" : "blocked",
    ready: blockers.length === 0,
    checks,
    blockers,
    configuredSecretNames,
    exposedSecretValues: false,
    writesEnabled: false,
    studentActivationAllowed: false,
    sideEffect: "none",
  };
}

function addSecretCheck(
  checks: PilotDeploymentConfigurationCheck[],
  configuredSecretNames: string[],
  checkId: string,
  label: string,
  environmentName: string,
  requiredFor: PilotDeploymentConfigurationCheck["requiredFor"],
): void {
  const configured = Boolean(process.env[environmentName]?.trim());
  if (configured) configuredSecretNames.push(environmentName);
  checks.push({
    checkId,
    label,
    status: configured ? "ready" : "blocked",
    requiredFor,
    evidence: configured ? "A server-side credential is present; its value is never returned." : `The server-side credential ${environmentName} is missing.`,
    nextAction: configured ? "Keep the credential server-side and rotate it through deployment secrets." : `Configure ${environmentName} in the deployment secret store.`,
  });
}

function addTenantAllowlistCheck(
  checks: PilotDeploymentConfigurationCheck[],
  checkId: string,
  label: string,
  environmentName: string,
  tenantId: string,
  requiredFor: PilotDeploymentConfigurationCheck["requiredFor"],
): void {
  const tenants = (process.env[environmentName] ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  const allowed = Boolean(tenantId) && tenants.includes(tenantId);
  checks.push({
    checkId,
    label,
    status: allowed ? "ready" : "blocked",
    requiredFor,
    evidence: allowed ? `Tenant ${tenantId} is explicitly present in the server-side allowlist.` : `Tenant ${tenantId || "(empty)"} is not present in ${environmentName}.`,
    nextAction: allowed ? "Keep the allowlist tenant-specific." : `Add the exact tenant id to ${environmentName}; do not use a wildcard.`,
  });
}

function addManualGateCheck(
  checks: PilotDeploymentConfigurationCheck[],
  checkId: string,
  label: string,
  requiredFor: PilotDeploymentConfigurationCheck["requiredFor"],
  evidence: string,
  nextAction: string,
): void {
  checks.push({ checkId, label, status: "manual", requiredFor, evidence, nextAction });
}

function addManualEnvironmentGate(
  checks: PilotDeploymentConfigurationCheck[],
  environmentName: string,
  label: string,
  requiredFor: PilotDeploymentConfigurationCheck["requiredFor"],
): void {
  const enabled = process.env[environmentName] === "true";
  checks.push({
    checkId: environmentName.toLowerCase().replaceAll("_", "-"),
    label,
    status: "manual",
    requiredFor,
    evidence: enabled ? `${environmentName} is enabled, but this preflight does not treat it as release approval.` : `${environmentName} is disabled; this is the safe default.`,
    nextAction: enabled ? "Confirm the matching human evidence and keep student activation blocked." : `Enable ${environmentName} only at the documented review stage.`,
  });
}

function addDirectoryCheck(
  checks: PilotDeploymentConfigurationCheck[],
  checkId: string,
  label: string,
  environmentName: string,
  requiredFor: PilotDeploymentConfigurationCheck["requiredFor"],
): void {
  const configuredPath = process.env[environmentName]?.trim();
  let isDirectory = false;
  try {
    isDirectory = Boolean(configuredPath && isAbsolute(configuredPath) && existsSync(configuredPath) && statSync(configuredPath).isDirectory());
  } catch {
    isDirectory = false;
  }
  checks.push({
    checkId,
    label,
    status: isDirectory ? "ready" : "blocked",
    requiredFor,
    evidence: isDirectory ? "An absolute configured directory exists; its path is not exposed in the review payload." : `An existing absolute directory is required for ${environmentName}.`,
    nextAction: isDirectory ? "Keep the directory outside client-visible configuration." : `Configure ${environmentName} as an existing absolute server-side directory.`,
  });
}

function addPrintBaseUrlCheck(checks: PilotDeploymentConfigurationCheck[], mode: PilotDeploymentMode): void {
  const configured = process.env[printBaseUrlEnvironment]?.trim();
  let valid = false;
  try {
    const url = new URL(configured ?? "");
    valid = (url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) && !url.username && !url.password;
  } catch {
    valid = false;
  }
  checks.push({
    checkId: "print-base-url",
    label: "QR print base URL",
    status: valid ? "ready" : "blocked",
    requiredFor: mode,
    evidence: valid ? "The print base URL is an approved HTTPS or local development origin." : `A safe ${printBaseUrlEnvironment} is required for deterministic QR output.`,
    nextAction: valid ? "Verify the URL resolves to the approved package front door before printing." : `Configure ${printBaseUrlEnvironment} with HTTPS or localhost; never a file URL.`,
  });
}
