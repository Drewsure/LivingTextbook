export type PersistenceProviderSelectionPreflightStatus = "blocked" | "ready-for-human-selection";

export type PersistenceProviderDeploymentFit = "hosted" | "local" | "hybrid";
export type PersistenceProviderCostPosture = "lowest" | "controlled" | "higher" | "variable";

export interface PersistenceProviderSelectionCandidate {
  candidateId: string;
  label: string;
  deploymentFit: PersistenceProviderDeploymentFit;
  costPosture: PersistenceProviderCostPosture;
  whiteLabelFit: string;
  requiredEvidence: string[];
  unresolvedRisks: string[];
}

export interface PersistenceProviderSelectionEvidence {
  backendMatrixId: string;
  selectionGateId: string;
  implementationReadinessId: string;
  tenantId: string;
  packageId: string;
  recommendedCandidateId: string;
  deploymentFit: PersistenceProviderDeploymentFit;
  costPosture: PersistenceProviderCostPosture;
  openCriterionCount: number;
  criteria: PersistenceProviderSelectionCriterionEvidence[];
  sourceRecords: string[];
}

export interface PersistenceProviderSelectionCriterionEvidence {
  criterionId: string;
  status: "passed" | "open" | "blocked";
  owner: "platform" | "tenant" | "joint";
}

export interface PersistenceProviderSelectionPreflight {
  preflightId: string;
  tenantId: string;
  packageId: string;
  label: string;
  status: PersistenceProviderSelectionPreflightStatus;
  providerNeutral: true;
  backendMatrixId: string;
  evidenceStorageGateId: string;
  implementationReadinessId: string;
  canonicalScopeValid: boolean;
  candidates: PersistenceProviderSelectionCandidate[];
  recommendedCandidateId: string;
  selectionEvidence: PersistenceProviderSelectionEvidence;
  providerSelected: false;
  selectionAllowed: false;
  migrationAllowed: false;
  writesAllowed: false;
  activationAllowed: false;
  requiredEvidence: string[];
  blockedActions: string[];
  nextSteps: string[];
  note: string;
}

const REQUIRED_BLOCKED_ACTIONS = [
  "No provider selected",
  "No provider-specific implementation",
  "No migration",
  "No persistence writes",
  "No activation",
] as const;

export function validatePersistenceProviderSelectionPreflight(
  preflight: PersistenceProviderSelectionPreflight,
): string[] {
  const errors: string[] = [];
  for (const field of [
    "preflightId",
    "tenantId",
    "packageId",
    "label",
    "backendMatrixId",
    "evidenceStorageGateId",
    "implementationReadinessId",
    "recommendedCandidateId",
    "note",
  ] as const) {
    if (typeof preflight[field] !== "string" || preflight[field].trim().length === 0) {
      errors.push(`Persistence provider selection preflight ${field} must be non-empty.`);
    }
  }

  if (preflight.providerNeutral !== true) errors.push("Persistence provider selection preflight must remain provider-neutral.");
  if (typeof preflight.canonicalScopeValid !== "boolean") errors.push("Persistence provider selection preflight canonicalScopeValid must be boolean.");
  for (const field of ["providerSelected", "selectionAllowed", "migrationAllowed", "writesAllowed", "activationAllowed"] as const) {
    if (preflight[field] !== false) errors.push(`Persistence provider selection preflight ${field} must remain false.`);
  }
  if (!Array.isArray(preflight.candidates) || preflight.candidates.length === 0) errors.push("Persistence provider selection preflight must list candidates.");
  if (!Array.isArray(preflight.requiredEvidence) || preflight.requiredEvidence.length === 0) errors.push("Persistence provider selection preflight must list required evidence.");
  if (!Array.isArray(preflight.blockedActions)) errors.push("Persistence provider selection preflight blockedActions must be an array.");
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!preflight.blockedActions.includes(action)) errors.push(`Persistence provider selection preflight must block: ${action}.`);
  }
  if (!Array.isArray(preflight.nextSteps) || preflight.nextSteps.length === 0) errors.push("Persistence provider selection preflight must list next steps.");

  const selectionEvidence = preflight.selectionEvidence;
  if (!selectionEvidence || typeof selectionEvidence !== "object" || Array.isArray(selectionEvidence)) {
    errors.push("Persistence provider selection preflight selectionEvidence must be an object.");
  } else {
    for (const field of ["backendMatrixId", "selectionGateId", "implementationReadinessId", "tenantId", "packageId", "recommendedCandidateId"] as const) {
      if (typeof selectionEvidence[field] !== "string" || selectionEvidence[field].trim().length === 0) {
        errors.push(`Persistence provider selection evidence ${field} must be non-empty.`);
      }
    }
    if (selectionEvidence.backendMatrixId !== preflight.backendMatrixId) errors.push("Persistence provider selection evidence must match the backend matrix.");
    if (selectionEvidence.implementationReadinessId !== preflight.implementationReadinessId) errors.push("Persistence provider selection evidence must match implementation readiness.");
    if (selectionEvidence.tenantId !== preflight.tenantId) errors.push("Persistence provider selection evidence must match the preflight tenant.");
    if (selectionEvidence.packageId !== preflight.packageId) errors.push("Persistence provider selection evidence must match the preflight package.");
    if (selectionEvidence.recommendedCandidateId !== preflight.recommendedCandidateId) errors.push("Persistence provider selection evidence must match the recommended candidate.");
    if (!Number.isInteger(selectionEvidence.openCriterionCount) || selectionEvidence.openCriterionCount < 0) errors.push("Persistence provider selection evidence openCriterionCount must be a non-negative integer.");
    const criterionEvidence = selectionEvidence.criteria;
    if (!Array.isArray(criterionEvidence) || criterionEvidence.length === 0) {
      errors.push("Persistence provider selection evidence must include criterion evidence.");
    } else {
      const criterionIds = new Set<string>();
      let derivedOpenCriterionCount = 0;
      for (const criterion of criterionEvidence) {
        if (!criterion || typeof criterion !== "object") {
          errors.push("Persistence provider selection criterion evidence must be an object.");
          continue;
        }
        if (typeof criterion.criterionId !== "string" || criterion.criterionId.trim().length === 0) {
          errors.push("Persistence provider selection criterion evidence criterionId must be non-empty.");
        } else if (criterionIds.has(criterion.criterionId)) {
          errors.push(`Persistence provider selection criterion evidence is duplicated: ${criterion.criterionId}.`);
        } else {
          criterionIds.add(criterion.criterionId);
        }
        if (!(criterion.status === "passed" || criterion.status === "open" || criterion.status === "blocked")) {
          errors.push(`Persistence provider selection criterion ${criterion.criterionId || "unknown"} has an unsupported status.`);
        } else if (criterion.status !== "passed") {
          derivedOpenCriterionCount += 1;
        }
        if (!(criterion.owner === "platform" || criterion.owner === "tenant" || criterion.owner === "joint")) {
          errors.push(`Persistence provider selection criterion ${criterion.criterionId || "unknown"} has an unsupported owner.`);
        }
      }
      if (selectionEvidence.openCriterionCount !== derivedOpenCriterionCount) {
        errors.push("Persistence provider selection evidence openCriterionCount must match criterion evidence.");
      }
    }
    const recommendedCandidate = preflight.candidates?.find((candidate) => candidate.candidateId === preflight.recommendedCandidateId);
    if (recommendedCandidate) {
      if (selectionEvidence.deploymentFit !== recommendedCandidate.deploymentFit) errors.push("Persistence provider selection evidence must match the recommended deployment fit.");
      if (selectionEvidence.costPosture !== recommendedCandidate.costPosture) errors.push("Persistence provider selection evidence must match the recommended cost posture.");
    }
    if (!Array.isArray(selectionEvidence.sourceRecords) || selectionEvidence.sourceRecords.filter((value) => typeof value === "string" && value.trim()).length < 3) {
      errors.push("Persistence provider selection evidence must include at least three source records.");
    }
    if (preflight.status === "blocked" && selectionEvidence.openCriterionCount === 0) errors.push("Blocked provider selection preflight must expose an open selection criterion.");
  }

  const candidateIds = new Set<string>();
  for (const candidate of preflight.candidates) {
    if (candidateIds.has(candidate.candidateId)) errors.push(`Persistence provider selection candidate id is duplicated: ${candidate.candidateId}.`);
    candidateIds.add(candidate.candidateId);
    for (const field of ["candidateId", "label", "whiteLabelFit"] as const) {
      if (typeof candidate[field] !== "string" || candidate[field].trim().length === 0) errors.push(`Persistence provider selection candidate ${field} must be non-empty.`);
    }
    if (!Array.isArray(candidate.requiredEvidence) || candidate.requiredEvidence.length === 0) errors.push(`Persistence provider selection candidate ${candidate.candidateId} must list required evidence.`);
    if (!Array.isArray(candidate.unresolvedRisks) || candidate.unresolvedRisks.length === 0) errors.push(`Persistence provider selection candidate ${candidate.candidateId} must list unresolved risks.`);
  }
  if (!candidateIds.has(preflight.recommendedCandidateId)) errors.push("Persistence provider selection preflight recommendedCandidateId must match a candidate.");
  return [...new Set(errors)];
}
