import {
  validatePilotDeploymentDecision,
  type PilotDeploymentDecision,
  type PilotDeploymentOptionId,
} from "./pilotDeploymentDecision";
import {
  validatePersistenceRecoveryRehearsal,
  type PersistenceRecoveryRehearsal,
  type PersistenceRecoveryRehearsalMode,
} from "./persistenceRecoveryRehearsal";

export type DeploymentContinuityDecisionStatus = "blocked" | "needs-review" | "review-ready";

export interface DeploymentContinuityPath {
  optionId: PilotDeploymentOptionId;
  label: string;
  recoveryModes: PersistenceRecoveryRehearsalMode[];
  continuityEvidenceReady: false;
  blockers: string[];
}

export interface DeploymentContinuityDecision {
  decisionId: string;
  tenantId: string;
  packageId: string;
  pilotDeploymentDecisionId: string;
  recoveryRehearsalId: string;
  status: DeploymentContinuityDecisionStatus;
  recommendedOptionId: PilotDeploymentOptionId;
  selectedOptionId: null;
  policyAccepted: false;
  providerSelected: false;
  persistenceActivationAllowed: false;
  classroomLaunchAllowed: false;
  offlineReady: false;
  sideEffect: "none";
  paths: DeploymentContinuityPath[];
  evidenceBindings: string[];
  blockers: string[];
}

export interface DeploymentContinuityDecisionInput {
  decisionId: string;
  pilotDeploymentDecision: PilotDeploymentDecision;
  recoveryRehearsal: PersistenceRecoveryRehearsal;
}

const REQUIRED_OPTIONS: PilotDeploymentOptionId[] = ["hosted-pwa", "local-classroom-server", "packaged-companion"];
const OPTION_LABELS: Record<PilotDeploymentOptionId, string> = {
  "hosted-pwa": "Hosted PWA",
  "local-classroom-server": "Local classroom server",
  "packaged-companion": "Packaged textbook companion",
};
const OPTION_RECOVERY_MODES: Record<PilotDeploymentOptionId, PersistenceRecoveryRehearsalMode[]> = {
  "hosted-pwa": ["hosted-managed"],
  "local-classroom-server": ["local-classroom"],
  "packaged-companion": ["local-classroom", "hybrid"],
};

export function deriveDeploymentContinuityDecision(
  input: DeploymentContinuityDecisionInput,
): DeploymentContinuityDecision {
  const pilotErrors = validatePilotDeploymentDecision(input.pilotDeploymentDecision);
  const recoveryErrors = validatePersistenceRecoveryRehearsal(input.recoveryRehearsal);
  const modeByName = new Map(input.recoveryRehearsal.modes.map((mode) => [mode.mode, mode]));

  const paths = REQUIRED_OPTIONS.map((optionId) => {
    const recoveryModes = OPTION_RECOVERY_MODES[optionId];
    const blockers = [
      ...(input.pilotDeploymentDecision.blockers ?? []),
      ...recoveryModes.flatMap((mode) => {
        const readiness = modeByName.get(mode);
        return readiness ? readiness.openChecks.map((check) => `${mode}:${check}`) : [`${mode}:recovery-mode-missing`];
      }),
    ];
    return {
      optionId,
      label: OPTION_LABELS[optionId],
      recoveryModes,
      continuityEvidenceReady: false as const,
      blockers: [...new Set(blockers)],
    };
  });

  const blockers = [
    ...pilotErrors,
    ...recoveryErrors,
    ...input.pilotDeploymentDecision.blockers,
    ...input.recoveryRehearsal.reasons,
    "No deployment option is selected.",
    "School or publisher policy acceptance is not complete.",
    "Continuity evidence is review-only and cannot activate persistence or classroom launch.",
  ];
  const uniqueBlockers = [...new Set(blockers)];
  const status: DeploymentContinuityDecisionStatus =
    pilotErrors.length > 0 || recoveryErrors.length > 0 || input.recoveryRehearsal.status === "blocked"
      ? "blocked"
      : uniqueBlockers.length > 0
        ? "needs-review"
        : "review-ready";

  return {
    decisionId: input.decisionId,
    tenantId: input.pilotDeploymentDecision.tenantId,
    packageId: input.pilotDeploymentDecision.packageId,
    pilotDeploymentDecisionId: input.pilotDeploymentDecision.decisionId,
    recoveryRehearsalId: input.recoveryRehearsal.rehearsalId,
    status,
    recommendedOptionId: input.pilotDeploymentDecision.recommendedOptionId,
    selectedOptionId: null,
    policyAccepted: false,
    providerSelected: false,
    persistenceActivationAllowed: false,
    classroomLaunchAllowed: false,
    offlineReady: false,
    sideEffect: "none",
    paths,
    evidenceBindings: [
      `pilot-deployment:${input.pilotDeploymentDecision.decisionId}`,
      `recovery-rehearsal:${input.recoveryRehearsal.rehearsalId}`,
      ...input.recoveryRehearsal.sourceRecords,
    ],
    blockers: uniqueBlockers,
  };
}

export function validateDeploymentContinuityDecision(decision: DeploymentContinuityDecision): string[] {
  const errors: string[] = [];
  for (const field of [
    "decisionId",
    "tenantId",
    "packageId",
    "pilotDeploymentDecisionId",
    "recoveryRehearsalId",
    "recommendedOptionId",
  ] as const) {
    if (typeof decision[field] !== "string" || decision[field].trim().length === 0) {
      errors.push(`Deployment continuity decision ${field} must be non-empty.`);
    }
  }
  if (!REQUIRED_OPTIONS.includes(decision.recommendedOptionId)) errors.push("Deployment continuity decision recommendation is unsupported.");
  if (decision.selectedOptionId !== null) errors.push("Deployment continuity decision must not select an option.");
  for (const field of ["policyAccepted", "providerSelected", "persistenceActivationAllowed", "classroomLaunchAllowed", "offlineReady"] as const) {
    if (decision[field] !== false) errors.push(`Deployment continuity decision ${field} must remain false.`);
  }
  if (decision.sideEffect !== "none") errors.push("Deployment continuity decision must have no side effect.");
  if (!Array.isArray(decision.evidenceBindings) || decision.evidenceBindings.length < 3) errors.push("Deployment continuity decision must include at least three evidence bindings.");
  if (!Array.isArray(decision.blockers) || decision.blockers.length === 0) errors.push("Deployment continuity decision must expose blockers.");
  if (!Array.isArray(decision.paths) || decision.paths.length !== REQUIRED_OPTIONS.length) {
    errors.push("Deployment continuity decision must include hosted, local, and packaged paths.");
  } else {
    const optionIds = new Set<PilotDeploymentOptionId>();
    for (const path of decision.paths) {
      if (optionIds.has(path.optionId)) errors.push(`Deployment continuity path is duplicated: ${path.optionId}.`);
      optionIds.add(path.optionId);
      if (!REQUIRED_OPTIONS.includes(path.optionId)) errors.push(`Deployment continuity path is unsupported: ${path.optionId}.`);
      if (!Array.isArray(path.recoveryModes) || path.recoveryModes.length === 0) errors.push(`Deployment continuity path ${path.optionId} must bind recovery modes.`);
      if (path.continuityEvidenceReady !== false) errors.push(`Deployment continuity path ${path.optionId} must remain not ready.`);
      if (!Array.isArray(path.blockers) || path.blockers.length === 0) errors.push(`Deployment continuity path ${path.optionId} must expose blockers.`);
    }
    for (const optionId of REQUIRED_OPTIONS) if (!optionIds.has(optionId)) errors.push(`Deployment continuity decision is missing path: ${optionId}.`);
  }
  return [...new Set(errors)];
}
