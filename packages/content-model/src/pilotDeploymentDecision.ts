export type PilotDeploymentOptionId = "hosted-pwa" | "local-classroom-server" | "packaged-companion";
export type PilotDeploymentSelectionStatus = "unselected" | "selected-review-only";

export interface PilotDeploymentDecision {
  decisionId: string;
  tenantId: string;
  packageId: string;
  guideId: string;
  recommendedOptionId: PilotDeploymentOptionId;
  selectedOptionId: PilotDeploymentOptionId | null;
  selectionStatus: PilotDeploymentSelectionStatus;
  policyAcceptancePreflightId: string;
  acceptanceRecordPreviewId: string;
  policyAcceptanceStatus: "not-accepted";
  status: "review-only";
  policyAccepted: false;
  persistenceActivationAllowed: false;
  classroomLaunchAllowed: false;
  sideEffect: "none";
  blockers: string[];
  evidenceBindings: string[];
}

const validOptions: PilotDeploymentOptionId[] = [
  "hosted-pwa",
  "local-classroom-server",
  "packaged-companion",
];

export function validatePilotDeploymentDecision(decision: PilotDeploymentDecision): string[] {
  const errors: string[] = [];

  for (const field of [
    "decisionId",
    "tenantId",
    "packageId",
    "guideId",
    "recommendedOptionId",
    "policyAcceptancePreflightId",
    "acceptanceRecordPreviewId",
  ] as const) {
    if (typeof decision[field] !== "string" || decision[field].trim().length === 0) {
      errors.push(`Pilot deployment decision ${field} must be a non-empty string.`);
    }
  }

  if (!validOptions.includes(decision.recommendedOptionId)) {
    errors.push("Pilot deployment decision recommendedOptionId is unsupported.");
  }
  if (decision.selectedOptionId !== null && !validOptions.includes(decision.selectedOptionId)) {
    errors.push("Pilot deployment decision selectedOptionId is unsupported.");
  }
  if (!["unselected", "selected-review-only"].includes(decision.selectionStatus)) {
    errors.push("Pilot deployment decision selectionStatus is unsupported.");
  }
  if (decision.selectionStatus === "unselected" && decision.selectedOptionId !== null) {
    errors.push("An unselected pilot deployment decision cannot name a selected option.");
  }
  if (decision.selectionStatus === "selected-review-only" && decision.selectedOptionId === null) {
    errors.push("A selected review-only deployment decision must name its option.");
  }
  if (decision.status !== "review-only") errors.push("Pilot deployment decision must remain review-only.");
  if (decision.policyAcceptanceStatus !== "not-accepted") {
    errors.push("Pilot deployment policy acceptance status must remain not-accepted.");
  }
  if (decision.policyAccepted !== false) errors.push("Pilot deployment policy acceptance must remain false.");
  if (decision.persistenceActivationAllowed !== false) errors.push("Pilot deployment persistence activation must remain false.");
  if (decision.classroomLaunchAllowed !== false) errors.push("Pilot deployment classroom launch must remain false.");
  if (decision.sideEffect !== "none") errors.push("Pilot deployment decision must declare no side effect.");

  for (const [field, label] of [["blockers", "blockers"], ["evidenceBindings", "evidence bindings"]] as const) {
    if (!Array.isArray(decision[field]) || decision[field].length === 0) {
      errors.push(`Pilot deployment decision ${label} must contain at least one item.`);
      continue;
    }
    if (decision[field].some((item) => typeof item !== "string" || item.trim().length === 0)) {
      errors.push(`Pilot deployment decision ${label} must contain only non-empty strings.`);
    }
    const normalized = decision[field]
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim());
    if (new Set(normalized).size !== normalized.length) {
      errors.push(`Pilot deployment decision ${label} must be unique.`);
    }
  }

  return [...new Set(errors)];
}
