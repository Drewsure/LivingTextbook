import {
  validatePersistenceProviderSelectionPreflight,
  type PersistenceProviderSelectionPreflight,
  type PersistenceProviderDeploymentFit,
} from "./persistenceProviderSelectionPreflight";
import { validatePersistenceHandoffPacket, type PersistenceHandoffPacket } from "./persistenceHandoff";
import type { LocalBundleRecoveryReconciliation } from "./localBundleRecoveryReconciliation";

export type PersistenceRecoveryRehearsalStatus = "blocked" | "needs-evidence" | "rehearsal-ready";
export type PersistenceRecoveryRehearsalMode = "hosted-managed" | "local-classroom" | "hybrid";

export interface PersistenceRecoveryModeReadiness {
  mode: PersistenceRecoveryRehearsalMode;
  candidateId: string;
  providerSelectionCommitted: false;
  backupRehearsalRequired: true;
  restoreRehearsalRequired: true;
  exportRehearsalRequired: true;
  tenantIsolationRequired: true;
  rawLearnerAudioExcluded: true;
  rawLearnerTranscriptsExcluded: true;
  openChecks: string[];
  blockedActions: string[];
}

export interface PersistenceRecoveryRehearsal {
  rehearsalId: string;
  tenantId: string;
  packageId: string;
  status: PersistenceRecoveryRehearsalStatus;
  providerNeutral: true;
  selectedMode: null;
  providerSelected: false;
  persistenceWritesAllowed: false;
  recoveryExecutionAllowed: false;
  exportAllowed: false;
  packagePromotionAllowed: false;
  routeMutationAllowed: false;
  sideEffect: "none";
  modes: PersistenceRecoveryModeReadiness[];
  sourceRecords: string[];
  requiredEvidence: string[];
  blockedActions: string[];
  reasons: string[];
}

export interface PersistenceRecoveryRehearsalInput {
  rehearsalId: string;
  providerPreflight: PersistenceProviderSelectionPreflight;
  handoff: PersistenceHandoffPacket;
  localRecoveryReconciliation?: LocalBundleRecoveryReconciliation;
}

const REQUIRED_MODES: PersistenceRecoveryRehearsalMode[] = ["hosted-managed", "local-classroom", "hybrid"];
const REQUIRED_BLOCKED_ACTIONS = [
  "No provider selection",
  "No persistence writes",
  "No recovery execution",
  "No export",
  "No package promotion",
  "No route mutation",
] as const;

const candidateFitForMode: Record<PersistenceRecoveryRehearsalMode, PersistenceProviderDeploymentFit> = {
  "hosted-managed": "hosted",
  "local-classroom": "local",
  hybrid: "hybrid",
};

export function derivePersistenceRecoveryRehearsal(
  input: PersistenceRecoveryRehearsalInput,
): PersistenceRecoveryRehearsal {
  const providerErrors = validatePersistenceProviderSelectionPreflight(input.providerPreflight);
  const handoffErrors = validatePersistenceHandoffPacket(input.handoff);
  const reconciliation = input.localRecoveryReconciliation;
  const reconciliationErrors = reconciliation
    ? [...reconciliation.approvalErrors, ...reconciliation.recoveryErrors]
    : ["A local recovery reconciliation record is required."];
  const openHandoffChecks = input.handoff.checks.filter((check) => check.status !== "passed").map((check) => check.checkId);
  const sourceRecords = [
    `provider-preflight:${input.providerPreflight.preflightId}`,
    `persistence-handoff:${input.handoff.packetId}`,
    ...(reconciliation ? [`local-recovery:${reconciliation.recoveryPacketId}`] : []),
  ];
  const commonBlockedActions = [...REQUIRED_BLOCKED_ACTIONS];

  const modes = REQUIRED_MODES.map((mode) => {
    const fit = candidateFitForMode[mode];
    const candidate = input.providerPreflight.candidates.find((item) => item.deploymentFit === fit);
    const openChecks = [
      ...(candidate ? candidate.requiredEvidence.map((evidence) => `${mode}:${evidence}`) : [`${mode}:candidate-missing`]),
      `${mode}:provider-selection-open`,
      `${mode}:backup-rehearsal-open`,
      `${mode}:restore-rehearsal-open`,
      `${mode}:export-rehearsal-open`,
      `${mode}:tenant-isolation-open`,
      ...(mode !== "hosted-managed" ? [`${mode}:local-fallback-open`] : []),
      ...(mode !== "local-classroom" ? [`${mode}:hosted-access-policy-open`] : []),
    ];

    return {
      mode,
      candidateId: candidate?.candidateId ?? `${mode}-candidate-missing`,
      providerSelectionCommitted: false as const,
      backupRehearsalRequired: true as const,
      restoreRehearsalRequired: true as const,
      exportRehearsalRequired: true as const,
      tenantIsolationRequired: true as const,
      rawLearnerAudioExcluded: true as const,
      rawLearnerTranscriptsExcluded: true as const,
      openChecks,
      blockedActions: commonBlockedActions,
    };
  });

  const reasons = [
    ...providerErrors,
    ...handoffErrors,
    ...reconciliationErrors,
    ...(input.providerPreflight.status === "blocked" ? ["Provider selection preflight is blocked."] : []),
    ...(openHandoffChecks.length > 0 ? [`Persistence handoff checks remain open: ${openHandoffChecks.join(", ")}.`] : []),
    ...(reconciliation?.status === "mismatch" ? ["Local recovery reconciliation has an identity or contract mismatch."] : []),
    ...(reconciliation?.status === "needs-evidence" ? ["Local recovery reconciliation still needs backup, restore, export, retention, or provider evidence."] : []),
    "Hosted-managed, closed-local, and hybrid recovery remain rehearsal paths only.",
    "No provider, storage adapter, backup, restore, export, promotion, or route mutation is selected by this packet.",
  ];
  const uniqueReasons = [...new Set(reasons)];
  const status: PersistenceRecoveryRehearsalStatus =
    providerErrors.length > 0 || handoffErrors.length > 0 || reconciliationErrors.length > 0 || reconciliation?.status === "mismatch"
      ? "blocked"
      : input.providerPreflight.status === "blocked" || openHandoffChecks.length > 0 || modes.some((mode) => mode.openChecks.length > 0)
        ? "needs-evidence"
        : "rehearsal-ready";

  return {
    rehearsalId: input.rehearsalId,
    tenantId: input.providerPreflight.tenantId,
    packageId: input.providerPreflight.packageId,
    status,
    providerNeutral: true,
    selectedMode: null,
    providerSelected: false,
    persistenceWritesAllowed: false,
    recoveryExecutionAllowed: false,
    exportAllowed: false,
    packagePromotionAllowed: false,
    routeMutationAllowed: false,
    sideEffect: "none",
    modes,
    sourceRecords,
    requiredEvidence: [
      "Accepted school or tenant policy",
      "Tenant isolation proof for every selected deployment path",
      "Backup manifest and checksum rehearsal",
      "Restore and rollback rehearsal",
      "Sanitized export and retention rehearsal",
      "Provider-specific cost and operational ownership evidence",
    ],
    blockedActions: commonBlockedActions,
    reasons: uniqueReasons,
  };
}

export function validatePersistenceRecoveryRehearsal(rehearsal: PersistenceRecoveryRehearsal): string[] {
  const errors: string[] = [];
  for (const field of ["rehearsalId", "tenantId", "packageId"] as const) {
    if (typeof rehearsal[field] !== "string" || rehearsal[field].trim().length === 0) {
      errors.push(`Persistence recovery rehearsal ${field} must be non-empty.`);
    }
  }
  if (rehearsal.providerNeutral !== true) errors.push("Persistence recovery rehearsal must remain provider-neutral.");
  if (rehearsal.selectedMode !== null) errors.push("Persistence recovery rehearsal must not select a deployment mode.");
  for (const field of [
    "providerSelected",
    "persistenceWritesAllowed",
    "recoveryExecutionAllowed",
    "exportAllowed",
    "packagePromotionAllowed",
    "routeMutationAllowed",
  ] as const) {
    if (rehearsal[field] !== false) errors.push(`Persistence recovery rehearsal ${field} must remain false.`);
  }
  if (rehearsal.sideEffect !== "none") errors.push("Persistence recovery rehearsal must have no side effect.");
  if (!Array.isArray(rehearsal.sourceRecords) || rehearsal.sourceRecords.length < 3) errors.push("Persistence recovery rehearsal must include at least three source records.");
  if (!Array.isArray(rehearsal.requiredEvidence) || rehearsal.requiredEvidence.length === 0) errors.push("Persistence recovery rehearsal must list required evidence.");
  if (!Array.isArray(rehearsal.reasons) || rehearsal.reasons.length === 0) errors.push("Persistence recovery rehearsal must list reasons.");

  const blockedActions = new Set(rehearsal.blockedActions);
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.has(action)) errors.push(`Persistence recovery rehearsal must block: ${action}.`);
  }

  if (!Array.isArray(rehearsal.modes) || rehearsal.modes.length !== REQUIRED_MODES.length) {
    errors.push("Persistence recovery rehearsal must list hosted, local, and hybrid modes.");
  } else {
    const modes = new Set<PersistenceRecoveryRehearsalMode>();
    for (const mode of rehearsal.modes) {
      if (modes.has(mode.mode)) errors.push(`Persistence recovery rehearsal mode is duplicated: ${mode.mode}.`);
      modes.add(mode.mode);
      if (!REQUIRED_MODES.includes(mode.mode)) errors.push(`Persistence recovery rehearsal mode is unsupported: ${mode.mode}.`);
      if (mode.providerSelectionCommitted !== false) errors.push(`Persistence recovery rehearsal ${mode.mode} must not commit provider selection.`);
      if (mode.backupRehearsalRequired !== true || mode.restoreRehearsalRequired !== true || mode.exportRehearsalRequired !== true) {
        errors.push(`Persistence recovery rehearsal ${mode.mode} must require backup, restore, and export rehearsal.`);
      }
      if (mode.tenantIsolationRequired !== true) errors.push(`Persistence recovery rehearsal ${mode.mode} must require tenant isolation.`);
      if (mode.rawLearnerAudioExcluded !== true || mode.rawLearnerTranscriptsExcluded !== true) errors.push(`Persistence recovery rehearsal ${mode.mode} must exclude raw learner audio and transcripts.`);
      if (!Array.isArray(mode.openChecks) || mode.openChecks.length === 0) errors.push(`Persistence recovery rehearsal ${mode.mode} must list open checks.`);
      for (const action of REQUIRED_BLOCKED_ACTIONS) {
        if (!mode.blockedActions.includes(action)) errors.push(`Persistence recovery rehearsal ${mode.mode} must block: ${action}.`);
      }
    }
    for (const mode of REQUIRED_MODES) if (!modes.has(mode)) errors.push(`Persistence recovery rehearsal is missing mode: ${mode}.`);
  }
  return [...new Set(errors)];
}
