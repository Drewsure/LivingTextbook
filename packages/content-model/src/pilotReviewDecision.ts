export type PilotReviewDecisionStatus = "demo-ready-pilot-blocked" | "pilot-ready";

export interface PilotReviewDecision {
  decisionId: string;
  tenantId: string;
  packageId: string;
  handoffRouteKey: string;
  evidenceHandoffRouteKey: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionStatus: "blocked";
  storageSelectionAllowed: false;
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

  for (const field of ["decisionId", "tenantId", "packageId", "handoffRouteKey", "evidenceHandoffRouteKey", "storageSelectionPreflightId", "storageSelectionGateId"] as const) {
    if (typeof decision[field] !== "string" || decision[field].trim().length === 0) {
      errors.push(`Pilot review decision ${field} must be a non-empty string.`);
    }
  }

  if (decision.mode !== "review-only") errors.push("Pilot review decision must remain review-only.");
  if (decision.demoAllowed !== true) errors.push("Pilot review decision must allow controlled demos.");
  if (decision.storageSelectionStatus !== "blocked") errors.push("Pilot review decision storage selection must remain blocked.");
  if (decision.storageSelectionAllowed !== false) errors.push("Pilot review decision storage selection must remain disallowed.");
  for (const field of ["pilotLaunchAllowed", "studentDataCollectionAllowed", "reportExportAllowed", "packagePromotionAllowed"] as const) {
    if (decision[field] !== false) errors.push(`Pilot review decision ${field} must remain false.`);
  }

  if (!Array.isArray(decision.blockingReasons)) {
    errors.push("Pilot review decision blockingReasons must be an array.");
  } else {
    if (decision.blockingReasons.some((reason) => typeof reason !== "string" || reason.trim().length === 0)) {
      errors.push("Pilot review decision blockingReasons must contain only non-empty strings.");
    }
    const normalizedReasons = decision.blockingReasons.filter((reason): reason is string => typeof reason === "string").map((reason) => reason.trim());
    if (new Set(normalizedReasons).size !== normalizedReasons.length) errors.push("Pilot review decision blockingReasons must be unique.");
  }
  if (!Array.isArray(decision.requiredNextSteps) || decision.requiredNextSteps.length === 0) {
    errors.push("Pilot review decision must include required next steps.");
  } else {
    if (decision.requiredNextSteps.some((step) => typeof step !== "string" || step.trim().length === 0)) {
      errors.push("Pilot review decision requiredNextSteps must contain only non-empty strings.");
    }
    const normalizedSteps = decision.requiredNextSteps.filter((step): step is string => typeof step === "string").map((step) => step.trim());
    if (new Set(normalizedSteps).size !== normalizedSteps.length) errors.push("Pilot review decision requiredNextSteps must be unique.");
  }
  if (!Array.isArray(decision.evidenceBindings) || decision.evidenceBindings.length === 0) {
    errors.push("Pilot review decision must include evidence bindings.");
  } else {
    const evidenceBindings = decision.evidenceBindings;
    if (evidenceBindings.some((binding) => typeof binding !== "string" || binding.trim().length === 0)) {
      errors.push("Pilot review decision evidence bindings must contain only non-empty strings.");
    }
    const normalizedBindings = evidenceBindings.filter((binding): binding is string => typeof binding === "string").map((binding) => binding.trim());
    if (new Set(normalizedBindings).size !== normalizedBindings.length) {
      errors.push("Pilot review decision evidence bindings must be unique.");
    }
  }

  const blockerCount = Array.isArray(decision.blockingReasons) ? decision.blockingReasons.length : 0;
  const expectedStatus: PilotReviewDecisionStatus = blockerCount > 0 ? "demo-ready-pilot-blocked" : "pilot-ready";
  if (decision.status !== expectedStatus) errors.push("Pilot review decision status must match its blocking reasons.");
  if (decision.status === "pilot-ready") errors.push("Pilot review decision cannot be pilot-ready while the review-only foundation blocks launch.");

  return [...new Set(errors)];
}
