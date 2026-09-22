export type PilotReviewDecisionStatus = "demo-ready-pilot-blocked" | "pilot-ready";

export interface PilotReviewDecision {
  decisionId: string;
  tenantId: string;
  packageId: string;
  handoffRouteKey: string;
  evidenceHandoffRouteKey: string;
  status: PilotReviewDecisionStatus;
  mode: "review-only";
  demoAllowed: true;
  pilotLaunchAllowed: false;
  studentDataCollectionAllowed: false;
  reportExportAllowed: false;
  packagePromotionAllowed: false;
  blockingReasons: string[];
  requiredNextSteps: string[];
  evidenceBindings: string[];
}

export function validatePilotReviewDecision(decision: PilotReviewDecision): string[] {
  const errors: string[] = [];

  for (const field of ["decisionId", "tenantId", "packageId", "handoffRouteKey", "evidenceHandoffRouteKey"] as const) {
    if (typeof decision[field] !== "string" || decision[field].trim().length === 0) {
      errors.push(`Pilot review decision ${field} must be a non-empty string.`);
    }
  }

  if (decision.mode !== "review-only") errors.push("Pilot review decision must remain review-only.");
  if (decision.demoAllowed !== true) errors.push("Pilot review decision must allow controlled demos.");
  for (const field of ["pilotLaunchAllowed", "studentDataCollectionAllowed", "reportExportAllowed", "packagePromotionAllowed"] as const) {
    if (decision[field] !== false) errors.push(`Pilot review decision ${field} must remain false.`);
  }

  if (!Array.isArray(decision.blockingReasons)) errors.push("Pilot review decision blockingReasons must be an array.");
  if (!Array.isArray(decision.requiredNextSteps) || decision.requiredNextSteps.length === 0) {
    errors.push("Pilot review decision must include required next steps.");
  }
  if (!Array.isArray(decision.evidenceBindings) || decision.evidenceBindings.length === 0) {
    errors.push("Pilot review decision must include evidence bindings.");
  }

  const blockerCount = Array.isArray(decision.blockingReasons) ? decision.blockingReasons.length : 0;
  const expectedStatus: PilotReviewDecisionStatus = blockerCount > 0 ? "demo-ready-pilot-blocked" : "pilot-ready";
  if (decision.status !== expectedStatus) errors.push("Pilot review decision status must match its blocking reasons.");
  if (decision.status === "pilot-ready") errors.push("Pilot review decision cannot be pilot-ready while the review-only foundation blocks launch.");

  return [...new Set(errors)];
}
