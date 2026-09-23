import type { BrowserPrivacyTenantEvidenceAdjudication } from "./browserPrivacyTenantEvidenceAdjudication";
import type { BrowserPrivacyTenantEvidencePacket } from "./browserPrivacyTenantEvidencePacket";
import type { PilotReviewDecision } from "./pilotReviewDecision";

export type BrowserPrivacyTenantEvidencePilotBindingStatus = "awaiting-evidence" | "accepted-for-pilot-review" | "blocked-by-evidence";

export interface BrowserPrivacyTenantEvidencePilotBinding {
  version: 1;
  bindingId: string;
  packetId: string;
  adjudicationId: string;
  pilotDecisionId: string;
  tenantId: string;
  packageId: string;
  status: BrowserPrivacyTenantEvidencePilotBindingStatus;
  mode: "review-only";
  pilotLaunchAllowed: false;
  studentDataCollectionAllowed: false;
  reportExportAllowed: false;
  packagePromotionAllowed: false;
  blockedReasons: string[];
  nextGate: string[];
}

export function createBrowserPrivacyTenantEvidencePilotBinding(
  packet: BrowserPrivacyTenantEvidencePacket | undefined,
  pilotDecision: PilotReviewDecision,
  adjudication?: BrowserPrivacyTenantEvidenceAdjudication,
): BrowserPrivacyTenantEvidencePilotBinding {
  const packetId = packet?.packetId ?? "awaiting-composite-evidence-packet";
  const adjudicationId = adjudication?.adjudicationId ?? "awaiting-composite-evidence-adjudication";
  const status = !adjudication
    ? "awaiting-evidence"
    : adjudication.decision === "accepted-for-next-gate"
      ? "accepted-for-pilot-review"
      : "blocked-by-evidence";
  return {
    version: 1,
    bindingId: `browser-privacy-tenant-pilot-binding:${packetId}:${pilotDecision.decisionId}`,
    packetId,
    adjudicationId,
    pilotDecisionId: pilotDecision.decisionId,
    tenantId: packet?.tenantId ?? pilotDecision.tenantId,
    packageId: packet?.packageId ?? pilotDecision.packageId,
    status,
    mode: "review-only",
    pilotLaunchAllowed: false,
    studentDataCollectionAllowed: false,
    reportExportAllowed: false,
    packagePromotionAllowed: false,
    blockedReasons: [
      ...(packet ? [] : ["Composite browser, privacy, and tenant-isolation evidence packet is not recorded."]),
      ...(adjudication ? [] : ["Composite evidence adjudication is not recorded."]),
      ...(adjudication?.decision === "blocked" ? [`Composite evidence adjudication blocked the packet: ${adjudication.reviewerNote}`] : []),
      ...pilotDecision.blockingReasons,
    ].filter((reason, index, reasons) => reasons.indexOf(reason) === index),
    nextGate: [
      ...(adjudication?.nextGate ?? ["Capture and adjudicate the composite browser/privacy/tenant evidence packet"]),
      "Keep the canonical pilot decision blocked until every pilot gate clears",
    ].filter((gate, index, gates) => gates.indexOf(gate) === index),
  };
}

export function validateBrowserPrivacyTenantEvidencePilotBinding(
  binding: BrowserPrivacyTenantEvidencePilotBinding,
  pilotDecision: PilotReviewDecision,
  packet?: BrowserPrivacyTenantEvidencePacket,
  adjudication?: BrowserPrivacyTenantEvidenceAdjudication,
): string[] {
  const errors: string[] = [];
  for (const field of ["bindingId", "packetId", "adjudicationId", "pilotDecisionId", "tenantId", "packageId"] as const) {
    if (typeof binding[field] !== "string" || binding[field].trim().length === 0) errors.push(`Browser privacy tenant pilot binding ${field} must be non-empty.`);
  }
  if (binding.version !== 1) errors.push("Browser privacy tenant pilot binding version is unsupported.");
  if (binding.mode !== "review-only") errors.push("Browser privacy tenant pilot binding must remain review-only.");
  if (!["awaiting-evidence", "accepted-for-pilot-review", "blocked-by-evidence"].includes(binding.status)) errors.push("Browser privacy tenant pilot binding status is unsupported.");
  for (const field of ["pilotLaunchAllowed", "studentDataCollectionAllowed", "reportExportAllowed", "packagePromotionAllowed"] as const) if (binding[field] !== false) errors.push(`Browser privacy tenant pilot binding ${field} must remain false.`);
  if (binding.pilotDecisionId !== pilotDecision.decisionId) errors.push("Browser privacy tenant pilot binding must preserve the pilot decision.");
  if (binding.tenantId !== pilotDecision.tenantId) errors.push("Browser privacy tenant pilot binding must preserve tenant identity.");
  if (binding.packageId !== pilotDecision.packageId) errors.push("Browser privacy tenant pilot binding must preserve package identity.");
  if (packet) {
    if (binding.packetId !== packet.packetId) errors.push("Browser privacy tenant pilot binding must preserve packet identity.");
    if (binding.tenantId !== packet.tenantId || binding.packageId !== packet.packageId) errors.push("Browser privacy tenant pilot binding cannot cross packet scope.");
  } else if (binding.packetId !== "awaiting-composite-evidence-packet") errors.push("Awaiting browser privacy tenant pilot bindings must identify the missing packet.");
  if (adjudication) {
    if (binding.adjudicationId !== adjudication.adjudicationId) errors.push("Browser privacy tenant pilot binding must preserve adjudication identity.");
    if (!packet || adjudication.packetId !== packet.packetId) errors.push("Browser privacy tenant pilot binding cannot use an adjudication from another packet.");
  } else if (binding.adjudicationId !== "awaiting-composite-evidence-adjudication") errors.push("Awaiting browser privacy tenant pilot bindings must identify the missing adjudication.");
  if (!Array.isArray(binding.blockedReasons) || binding.blockedReasons.length === 0) errors.push("Browser privacy tenant pilot binding must preserve pilot blockers.");
  if (!Array.isArray(binding.nextGate) || binding.nextGate.length === 0) errors.push("Browser privacy tenant pilot binding must preserve next gates.");
  if (binding.status === "accepted-for-pilot-review" && (!packet || !adjudication || adjudication.decision !== "accepted-for-next-gate")) errors.push("Accepted browser privacy tenant pilot binding requires accepted composite adjudication.");
  return [...new Set(errors)];
}
