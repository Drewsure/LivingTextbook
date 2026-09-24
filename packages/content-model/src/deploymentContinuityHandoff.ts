import type {
  DeploymentContinuityDecision,
  DeploymentContinuityPath,
  PilotDeploymentOptionId,
} from "./index";
import { validateDeploymentContinuityDecision } from "./deploymentContinuityDecision";

export type DeploymentContinuityHandoffStatus = "blocked" | "needs-review" | "review-ready";

export interface DeploymentContinuityHandoffArtifact {
  artifactId: string;
  optionId: PilotDeploymentOptionId;
  label: string;
  deliverables: string[];
  evidenceBindings: string[];
  blockers: string[];
  reviewOnly: true;
  exportAllowed: false;
  installAllowed: false;
  activateAllowed: false;
}

export interface DeploymentContinuityHandoff {
  handoffId: string;
  tenantId: string;
  packageId: string;
  sourceDecisionId: string;
  activationPreflightId: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  releaseReadinessId: string;
  releaseReadinessTenantId: string;
  releaseReadinessPackageId: string;
  releaseReadinessStatus: "blocked" | "review-only" | "pilot-ready";
  status: DeploymentContinuityHandoffStatus;
  recommendedOptionId: PilotDeploymentOptionId;
  selectedOptionId: null;
  artifacts: DeploymentContinuityHandoffArtifact[];
  evidenceBindings: string[];
  blockers: string[];
  exportAllowed: false;
  installAllowed: false;
  activateAllowed: false;
  routeMutationAllowed: false;
  sideEffect: "none";
}

export interface DeploymentContinuityHandoffInput {
  handoffId: string;
  activationPreflightId: string;
  releaseReadinessId: string;
  releaseReadinessTenantId: string;
  releaseReadinessPackageId: string;
  releaseReadinessStatus: "blocked" | "review-only" | "pilot-ready";
  releaseReadinessBlockers: string[];
  decision: DeploymentContinuityDecision;
  activationPreflightStatus: "blocked" | "ready";
  activationPreflightBlockers: string[];
}

const DELIVERABLES: Record<PilotDeploymentOptionId, string[]> = {
  "hosted-pwa": [
    "Tenant-scoped hosted launch configuration",
    "Signed student-session and teacher-report boundary",
    "Backup, retention, and rollback operating record",
  ],
  "local-classroom-server": [
    "Closed classroom runtime configuration",
    "Local media and content manifest",
    "Backup, restore, and operator handoff record",
  ],
  "packaged-companion": [
    "Versioned textbook companion package manifest",
    "QR/front-door registry handoff",
    "Installer, update, and recovery evidence record",
  ],
};

export function deriveDeploymentContinuityHandoff(
  input: DeploymentContinuityHandoffInput,
): DeploymentContinuityHandoff {
  const decisionErrors = validateDeploymentContinuityDecision(input.decision);
  const sharedBlockers = [
    ...decisionErrors,
    ...input.decision.blockers,
    ...input.activationPreflightBlockers,
    ...input.releaseReadinessBlockers,
    ...(input.releaseReadinessTenantId !== input.decision.tenantId
      ? ["White-label release readiness tenant does not match the deployment decision tenant."]
      : []),
    ...(input.releaseReadinessPackageId !== input.decision.packageId
      ? ["White-label release readiness package does not match the deployment decision package."]
      : []),
    ...(input.activationPreflightStatus === "blocked" ? ["Durable-write activation preflight is blocked."] : []),
    ...(input.releaseReadinessStatus === "blocked" ? ["White-label release readiness is blocked."] : []),
    "Handoff artifacts remain review-only and cannot be exported, installed, or activated.",
  ];
  const blockers = [...new Set(sharedBlockers)];
  const artifacts = input.decision.paths.map((path) => createArtifact(path, input.decision.evidenceBindings, blockers));

  return {
    handoffId: input.handoffId,
    tenantId: input.decision.tenantId,
    packageId: input.decision.packageId,
    sourceDecisionId: input.decision.decisionId,
    activationPreflightId: input.activationPreflightId,
    storageSelectionPreflightId: input.decision.storageSelectionPreflightId,
    storageSelectionGateId: input.decision.storageSelectionGateId,
    releaseReadinessId: input.releaseReadinessId,
    releaseReadinessTenantId: input.releaseReadinessTenantId,
    releaseReadinessPackageId: input.releaseReadinessPackageId,
    releaseReadinessStatus: input.releaseReadinessStatus,
    status: decisionErrors.length > 0 || input.activationPreflightStatus === "blocked"
      ? "blocked"
      : blockers.length > 0
        ? "needs-review"
        : "review-ready",
    recommendedOptionId: input.decision.recommendedOptionId,
    selectedOptionId: null,
    artifacts,
    evidenceBindings: [
      `continuity-decision:${input.decision.decisionId}`,
      `activation-preflight:${input.activationPreflightId}`,
      `release-readiness:${input.releaseReadinessId}`,
      ...input.decision.evidenceBindings,
    ],
    blockers,
    exportAllowed: false,
    installAllowed: false,
    activateAllowed: false,
    routeMutationAllowed: false,
    sideEffect: "none",
  };
}

function createArtifact(
  path: DeploymentContinuityPath,
  evidenceBindings: string[],
  blockers: string[],
): DeploymentContinuityHandoffArtifact {
  return {
    artifactId: `deployment-handoff:${path.optionId}`,
    optionId: path.optionId,
    label: `${path.label} review packet`,
    deliverables: DELIVERABLES[path.optionId],
    evidenceBindings: [...evidenceBindings, ...path.recoveryModes.map((mode) => `recovery-mode:${mode}`)],
    blockers: [...new Set([...path.blockers, ...blockers])],
    reviewOnly: true,
    exportAllowed: false,
    installAllowed: false,
    activateAllowed: false,
  };
}

export function validateDeploymentContinuityHandoff(handoff: DeploymentContinuityHandoff): string[] {
  const errors: string[] = [];
  for (const field of ["handoffId", "tenantId", "packageId", "sourceDecisionId", "activationPreflightId", "storageSelectionPreflightId", "storageSelectionGateId", "releaseReadinessId", "releaseReadinessTenantId", "releaseReadinessPackageId"] as const) {
    if (typeof handoff[field] !== "string" || handoff[field].trim().length === 0) {
      errors.push(`Deployment continuity handoff ${field} must be non-empty.`);
    }
  }
  if (!["blocked", "review-only", "pilot-ready"].includes(handoff.releaseReadinessStatus)) {
    errors.push("Deployment continuity handoff releaseReadinessStatus is unsupported.");
  }
  if (handoff.releaseReadinessTenantId !== handoff.tenantId) {
    errors.push("Deployment continuity handoff release readiness tenant must match the handoff tenant.");
  }
  if (handoff.releaseReadinessPackageId !== handoff.packageId) {
    errors.push("Deployment continuity handoff release readiness package must match the handoff package.");
  }
  if (!handoff.evidenceBindings.includes(`storage-selection-preflight:${handoff.storageSelectionPreflightId}`)) {
    errors.push("Deployment continuity handoff must bind the storage selection preflight.");
  }
  if (!handoff.evidenceBindings.includes(`storage-selection-gate:${handoff.storageSelectionGateId}`)) {
    errors.push("Deployment continuity handoff must bind the storage selection gate.");
  }
  if (handoff.selectedOptionId !== null) errors.push("Deployment continuity handoff must not select an option.");
  for (const field of ["exportAllowed", "installAllowed", "activateAllowed", "routeMutationAllowed"] as const) {
    if (handoff[field] !== false) errors.push(`Deployment continuity handoff ${field} must remain false.`);
  }
  if (handoff.sideEffect !== "none") errors.push("Deployment continuity handoff must have no side effect.");
  if (!Array.isArray(handoff.evidenceBindings) || handoff.evidenceBindings.length < 3) errors.push("Deployment continuity handoff must include evidence bindings.");
  if (!Array.isArray(handoff.blockers) || handoff.blockers.length === 0) errors.push("Deployment continuity handoff must expose blockers.");
  if (!Array.isArray(handoff.artifacts) || handoff.artifacts.length !== 3) {
    errors.push("Deployment continuity handoff must include hosted, local, and packaged artifacts.");
  } else {
    const optionIds = new Set<PilotDeploymentOptionId>();
    for (const artifact of handoff.artifacts) {
      if (optionIds.has(artifact.optionId)) errors.push(`Deployment continuity handoff artifact is duplicated: ${artifact.optionId}.`);
      optionIds.add(artifact.optionId);
      if (!artifact.artifactId.trim() || !artifact.label.trim()) errors.push(`Deployment continuity handoff artifact ${artifact.optionId} must have identity.`);
      if (!Array.isArray(artifact.deliverables) || artifact.deliverables.length === 0) errors.push(`Deployment continuity handoff artifact ${artifact.optionId} must list deliverables.`);
      if (!Array.isArray(artifact.evidenceBindings) || artifact.evidenceBindings.length === 0) errors.push(`Deployment continuity handoff artifact ${artifact.optionId} must bind evidence.`);
      if (!Array.isArray(artifact.blockers) || artifact.blockers.length === 0) errors.push(`Deployment continuity handoff artifact ${artifact.optionId} must expose blockers.`);
      if (artifact.reviewOnly !== true) errors.push(`Deployment continuity handoff artifact ${artifact.optionId} must remain review-only.`);
      for (const field of ["exportAllowed", "installAllowed", "activateAllowed"] as const) {
        if (artifact[field] !== false) errors.push(`Deployment continuity handoff artifact ${artifact.optionId} ${field} must remain false.`);
      }
    }
    for (const optionId of ["hosted-pwa", "local-classroom-server", "packaged-companion"] as const) {
      if (!optionIds.has(optionId)) errors.push(`Deployment continuity handoff is missing artifact: ${optionId}.`);
    }
  }
  return [...new Set(errors)];
}
