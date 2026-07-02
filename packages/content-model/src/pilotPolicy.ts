export type PilotPolicyRequirementCategory =
  | "student-data"
  | "report-export"
  | "raw-audio"
  | "transcripts"
  | "media-rights"
  | "local-deployment"
  | "ai-tutor";

export type PilotPolicyRequirementStatus = "accepted" | "needed" | "not-applicable" | "premium-only";
export type PilotPolicyReadiness = "demo-only" | "policy-required" | "pilot-ready";

export interface PilotPolicyRequirement {
  requirementId: string;
  category: PilotPolicyRequirementCategory;
  label: string;
  status: PilotPolicyRequirementStatus;
  requiredBeforePilot: boolean;
  blocksStudentData: boolean;
  blocksReportExport: boolean;
  blocksLocalDeployment: boolean;
  note: string;
}

export interface PilotPolicyPlan {
  policyPlanId: string;
  tenantId: string;
  label: string;
  readiness: PilotPolicyReadiness;
  requirements: PilotPolicyRequirement[];
  nextReviewOwner: string;
  note: string;
}

export function validatePilotPolicyPlan(plan: PilotPolicyPlan): string[] {
  const errors: string[] = [];
  const requirementIds = new Set<string>();

  if (plan.policyPlanId.trim().length === 0) {
    errors.push("Pilot policy plan must include a plan id.");
  }

  if (plan.tenantId.trim().length === 0) {
    errors.push("Pilot policy plan must include a tenant id.");
  }

  if (plan.label.trim().length === 0) {
    errors.push(`Pilot policy plan ${plan.policyPlanId} must include a label.`);
  }

  if (plan.requirements.length === 0) {
    errors.push(`Pilot policy plan ${plan.policyPlanId} must include policy requirements.`);
  }

  if (plan.nextReviewOwner.trim().length === 0) {
    errors.push(`Pilot policy plan ${plan.policyPlanId} must name a next review owner.`);
  }

  for (const requirement of plan.requirements) {
    if (requirement.requirementId.trim().length === 0) {
      errors.push(`Pilot policy plan ${plan.policyPlanId} includes a requirement without an id.`);
    }

    if (requirementIds.has(requirement.requirementId)) {
      errors.push(`Duplicate pilot policy requirement id: ${requirement.requirementId}.`);
    }

    requirementIds.add(requirement.requirementId);

    if (requirement.label.trim().length === 0) {
      errors.push(`Pilot policy requirement ${requirement.requirementId} must include a label.`);
    }

    if (requirement.note.trim().length === 0) {
      errors.push(`Pilot policy requirement ${requirement.requirementId} must include a note.`);
    }

    if ((requirement.blocksStudentData || requirement.blocksReportExport || requirement.blocksLocalDeployment) && !requirement.requiredBeforePilot) {
      errors.push(`Blocking policy requirement ${requirement.requirementId} must be required before pilot.`);
    }

    if (requirement.category === "raw-audio" && requirement.status === "accepted") {
      errors.push("Core pilot policy must not accept raw learner audio storage by default.");
    }

    if (requirement.category === "transcripts" && requirement.status === "accepted") {
      errors.push("Core pilot policy must not accept learner transcript storage by default.");
    }
  }

  return errors;
}

export function getPilotPolicyWarnings(plan: PilotPolicyPlan): string[] {
  const warnings: string[] = [];

  for (const requirement of plan.requirements) {
    if (requirement.requiredBeforePilot && requirement.status === "needed") {
      warnings.push(`${requirement.label} must be accepted before pilot use.`);
    }

    if (requirement.blocksStudentData && requirement.status !== "accepted") {
      warnings.push(`${requirement.label} blocks student progress storage.`);
    }

    if (requirement.blocksReportExport && requirement.status !== "accepted") {
      warnings.push(`${requirement.label} blocks teacher report export.`);
    }

    if (requirement.blocksLocalDeployment && requirement.status !== "accepted") {
      warnings.push(`${requirement.label} blocks local classroom deployment.`);
    }
  }

  if (plan.readiness !== "pilot-ready") {
    warnings.push(`${plan.label} is not pilot-ready. Current readiness: ${plan.readiness}.`);
  }

  return warnings;
}
