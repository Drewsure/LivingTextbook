import type { BrowserRehearsalObservationAdjudication } from "./browserRehearsalObservationAdjudication";
import type { BrowserRehearsalObservationHandoff } from "./browserRehearsalObservationHandoff";
import type { PilotReviewDecision } from "./pilotReviewDecision";

export type BrowserRehearsalObservationPilotBindingStatus = "awaiting-adjudication" | "accepted-for-pilot-review" | "blocked-by-adjudication";

export interface BrowserRehearsalObservationPilotBinding {
  version: 1;
  bindingId: string;
  handoffId: string;
  adjudicationId: string;
  pilotDecisionId: string;
  tenantId: string;
  packageId: string;
  status: BrowserRehearsalObservationPilotBindingStatus;
  mode: "review-only";
  pilotLaunchAllowed: false;
  studentDataCollectionAllowed: false;
  reportExportAllowed: false;
  packagePromotionAllowed: false;
  blockedReasons: string[];
  nextGate: string[];
}

export function createBrowserRehearsalObservationPilotBinding(
  handoff: BrowserRehearsalObservationHandoff,
  pilotDecision: PilotReviewDecision,
  adjudication?: BrowserRehearsalObservationAdjudication,
): BrowserRehearsalObservationPilotBinding {
  const status = !adjudication
    ? "awaiting-adjudication"
    : adjudication.decision === "accepted-for-next-gate"
      ? "accepted-for-pilot-review"
      : "blocked-by-adjudication";

  return {
    version: 1,
    bindingId: `browser-pilot-binding:${handoff.handoffId}:${pilotDecision.decisionId}`,
    handoffId: handoff.handoffId,
    adjudicationId: adjudication?.adjudicationId ?? "awaiting-adult-adjudication",
    pilotDecisionId: pilotDecision.decisionId,
    tenantId: handoff.tenantId,
    packageId: handoff.packageId,
    status,
    mode: "review-only",
    pilotLaunchAllowed: false,
    studentDataCollectionAllowed: false,
    reportExportAllowed: false,
    packagePromotionAllowed: false,
    blockedReasons: [
      ...(adjudication ? [] : ["Adult observation adjudication is not recorded."]),
      ...(adjudication?.decision === "blocked" ? [`Adult adjudication blocked the evidence: ${adjudication.reviewerNote}`] : []),
      ...pilotDecision.blockingReasons,
    ].filter((reason, index, reasons) => reasons.indexOf(reason) === index),
    nextGate: [
      ...(adjudication?.nextGate ?? ["Record adult observation adjudication"]),
      "Keep the canonical pilot decision blocked until every pilot gate clears",
    ].filter((gate, index, gates) => gates.indexOf(gate) === index),
  };
}

export function validateBrowserRehearsalObservationPilotBinding(
  binding: BrowserRehearsalObservationPilotBinding,
  handoff: BrowserRehearsalObservationHandoff,
  pilotDecision: PilotReviewDecision,
  adjudication?: BrowserRehearsalObservationAdjudication,
): string[] {
  const errors: string[] = [];
  for (const field of ["bindingId", "handoffId", "adjudicationId", "pilotDecisionId", "tenantId", "packageId"] as const) {
    if (typeof binding[field] !== "string" || binding[field].trim().length === 0) errors.push(`Browser pilot binding ${field} must be non-empty.`);
  }
  if (binding.version !== 1) errors.push("Browser pilot binding version is unsupported.");
  if (binding.mode !== "review-only") errors.push("Browser pilot binding must remain review-only.");
  if (!["awaiting-adjudication", "accepted-for-pilot-review", "blocked-by-adjudication"].includes(binding.status)) errors.push("Browser pilot binding status is unsupported.");
  for (const field of ["pilotLaunchAllowed", "studentDataCollectionAllowed", "reportExportAllowed", "packagePromotionAllowed"] as const) {
    if (binding[field] !== false) errors.push(`Browser pilot binding ${field} must remain false.`);
  }
  if (binding.handoffId !== handoff.handoffId) errors.push("Browser pilot binding must preserve the observation handoff.");
  if (binding.pilotDecisionId !== pilotDecision.decisionId) errors.push("Browser pilot binding must preserve the pilot decision.");
  if (binding.tenantId !== handoff.tenantId || binding.tenantId !== pilotDecision.tenantId) errors.push("Browser pilot binding must preserve tenant identity.");
  if (binding.packageId !== handoff.packageId || binding.packageId !== pilotDecision.packageId) errors.push("Browser pilot binding must preserve package identity.");
  if (adjudication) {
    if (binding.adjudicationId !== adjudication.adjudicationId) errors.push("Browser pilot binding must preserve adjudication identity.");
    if (adjudication.handoffId !== handoff.handoffId) errors.push("Browser pilot binding cannot use an adjudication from another handoff.");
  } else if (binding.adjudicationId !== "awaiting-adult-adjudication") {
    errors.push("Awaiting browser pilot bindings must identify the missing adjudication.");
  }
  if (!Array.isArray(binding.blockedReasons) || binding.blockedReasons.length === 0) errors.push("Browser pilot binding must preserve pilot blockers.");
  if (!Array.isArray(binding.nextGate) || binding.nextGate.length === 0) errors.push("Browser pilot binding must preserve next gates.");
  return [...new Set(errors)];
}
