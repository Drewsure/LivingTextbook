import type { BrowserPrivacyTenantEvidencePilotBinding } from "./browserPrivacyTenantEvidencePilotBinding";
import type { WhiteLabelReleaseReadiness } from "./whiteLabelReleaseReadiness";

export type BrowserPrivacyTenantEvidenceReleaseBindingStatus = "awaiting-composite-evidence" | "blocked-by-composite-evidence" | "accepted-for-release-review";

export interface BrowserPrivacyTenantEvidenceReleaseBinding {
  version: 1;
  bindingId: string;
  pilotBindingId: string;
  packetId: string;
  adjudicationId: string;
  readinessId: string;
  tenantId: string;
  packageId: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionStatus: "blocked";
  storageSelectionAllowed: false;
  status: BrowserPrivacyTenantEvidenceReleaseBindingStatus;
  mode: "review-only";
  productionApprovalAllowed: false;
  studentProductionLaunchAllowed: false;
  packagePromotionAllowed: false;
  hostedPersistenceWriteAllowed: false;
  blockedReasons: string[];
  nextGate: string[];
}

export function createBrowserPrivacyTenantEvidenceReleaseBinding(
  readiness: Pick<WhiteLabelReleaseReadiness, "readinessId" | "tenantId" | "packageId" | "status" | "nextAction">,
  pilotBinding: BrowserPrivacyTenantEvidencePilotBinding,
): BrowserPrivacyTenantEvidenceReleaseBinding {
  const status = pilotBinding.status === "accepted-for-pilot-review"
    ? "accepted-for-release-review"
    : pilotBinding.status === "blocked-by-evidence"
      ? "blocked-by-composite-evidence"
      : "awaiting-composite-evidence";
  return {
    version: 1,
    bindingId: `browser-privacy-tenant-release-binding:${pilotBinding.bindingId}:${readiness.readinessId}`,
    pilotBindingId: pilotBinding.bindingId,
    packetId: pilotBinding.packetId,
    adjudicationId: pilotBinding.adjudicationId,
    readinessId: readiness.readinessId,
    tenantId: readiness.tenantId,
    packageId: readiness.packageId,
    storageSelectionPreflightId: pilotBinding.storageSelectionPreflightId,
    storageSelectionGateId: pilotBinding.storageSelectionGateId,
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
    status,
    mode: "review-only",
    productionApprovalAllowed: false,
    studentProductionLaunchAllowed: false,
    packagePromotionAllowed: false,
    hostedPersistenceWriteAllowed: false,
    blockedReasons: [
      ...pilotBinding.blockedReasons,
      ...(readiness.status !== "pilot-ready" ? [`White-label release readiness remains ${readiness.status}.`] : []),
    ].filter((reason, index, reasons) => reasons.indexOf(reason) === index),
    nextGate: [
      ...pilotBinding.nextGate,
      readiness.nextAction,
      "Keep production approval blocked until release-control and school-policy gates clear",
    ].filter((gate, index, gates) => gates.indexOf(gate) === index),
  };
}

export function validateBrowserPrivacyTenantEvidenceReleaseBinding(
  binding: BrowserPrivacyTenantEvidenceReleaseBinding,
  readiness: Pick<WhiteLabelReleaseReadiness, "readinessId" | "tenantId" | "packageId" | "status" | "nextAction">,
  pilotBinding: BrowserPrivacyTenantEvidencePilotBinding,
): string[] {
  const errors: string[] = [];
  for (const field of ["bindingId", "pilotBindingId", "packetId", "adjudicationId", "readinessId", "tenantId", "packageId", "storageSelectionPreflightId", "storageSelectionGateId"] as const) {
    if (typeof binding[field] !== "string" || binding[field].trim().length === 0) errors.push(`Browser privacy tenant release binding ${field} must be non-empty.`);
  }
  if (binding.version !== 1) errors.push("Browser privacy tenant release binding version is unsupported.");
  if (binding.mode !== "review-only") errors.push("Browser privacy tenant release binding must remain review-only.");
  if (!["awaiting-composite-evidence", "blocked-by-composite-evidence", "accepted-for-release-review"].includes(binding.status)) errors.push("Browser privacy tenant release binding status is unsupported.");
  if (binding.storageSelectionStatus !== "blocked") errors.push("Browser privacy tenant release binding storage selection must remain blocked.");
  if (binding.storageSelectionAllowed !== false) errors.push("Browser privacy tenant release binding storage selection must remain false.");
  for (const field of ["productionApprovalAllowed", "studentProductionLaunchAllowed", "packagePromotionAllowed", "hostedPersistenceWriteAllowed"] as const) if (binding[field] !== false) errors.push(`Browser privacy tenant release binding ${field} must remain false.`);
  if (binding.pilotBindingId !== pilotBinding.bindingId) errors.push("Browser privacy tenant release binding must preserve pilot binding identity.");
  if (binding.readinessId !== readiness.readinessId) errors.push("Browser privacy tenant release binding must preserve readiness identity.");
  if (binding.tenantId !== readiness.tenantId || binding.tenantId !== pilotBinding.tenantId) errors.push("Browser privacy tenant release binding must preserve tenant identity.");
  if (binding.packageId !== readiness.packageId || binding.packageId !== pilotBinding.packageId) errors.push("Browser privacy tenant release binding must preserve package identity.");
  if (binding.storageSelectionPreflightId !== pilotBinding.storageSelectionPreflightId) errors.push("Browser privacy tenant release binding must preserve storage preflight identity.");
  if (binding.storageSelectionGateId !== pilotBinding.storageSelectionGateId) errors.push("Browser privacy tenant release binding must preserve storage gate identity.");
  if (binding.packetId !== pilotBinding.packetId || binding.adjudicationId !== pilotBinding.adjudicationId) errors.push("Browser privacy tenant release binding must preserve composite evidence identity.");
  const expectedStatus = pilotBinding.status === "accepted-for-pilot-review" ? "accepted-for-release-review" : pilotBinding.status === "blocked-by-evidence" ? "blocked-by-composite-evidence" : "awaiting-composite-evidence";
  if (binding.status !== expectedStatus) errors.push("Browser privacy tenant release binding status must match the pilot binding.");
  if (!Array.isArray(binding.blockedReasons) || binding.blockedReasons.length === 0) errors.push("Browser privacy tenant release binding must preserve blockers.");
  if (!Array.isArray(binding.nextGate) || binding.nextGate.length === 0) errors.push("Browser privacy tenant release binding must preserve next gates.");
  return [...new Set(errors)];
}
