export interface PersistenceReadinessInput {
  providerConfigurationValid: boolean;
  providerConfigurationErrors: string[];
  durable: boolean;
  health: {
    healthy: boolean;
    operationEvidenceIntegrityHealthy: boolean;
    errors: string[];
  };
  studentSessionBoundaryConfigured: boolean;
  policyErrors: string[];
}

export interface PersistenceReadinessResult {
  status: "healthy" | "blocked" | "rehearsal";
  healthy: boolean;
  errors: string[];
}

export interface PersistenceDeploymentGateInput {
  provider: "process-memory" | "sqlite";
  providerConfigurationValid: boolean;
  databasePathReady: boolean;
  databasePathErrors: string[];
  allowDurableWrites: boolean;
  studentSessionBoundaryConfigured: boolean;
  teacherOperationsSessionBoundaryConfigured: boolean;
  schoolPolicyAccepted: boolean;
  retentionPolicyAccepted: boolean;
  releaseApprovalAccepted: boolean;
  operationsReady: boolean;
}

export interface PersistenceDeploymentGateResult {
  status: "ready" | "blocked" | "rehearsal";
  mode: "durable-managed" | "non-durable-rehearsal";
  ready: boolean;
  blockedReasons: string[];
}

/**
 * Derives one readiness signal for status, launch preflight, and future
 * provider adapters. Durable policy failures are operational failures; they
 * must not be hidden in a secondary operations field.
 */
export function derivePersistenceReadiness(input: PersistenceReadinessInput): PersistenceReadinessResult {
  const errors = [
    ...input.providerConfigurationErrors,
    ...input.health.errors,
    ...(!input.health.operationEvidenceIntegrityHealthy ? ["Persistence operation evidence integrity is not healthy."] : []),
    ...(!input.durable || input.studentSessionBoundaryConfigured ? [] : ["Signed student session boundary is not configured."]),
  ];
  const effectivePolicyErrors = input.durable ? input.policyErrors : [];
  const readinessErrors = [...new Set([...errors, ...effectivePolicyErrors])];

  return {
    status: !input.providerConfigurationValid
      ? "blocked"
      : readinessErrors.length === 0
        ? "healthy"
        : input.durable
          ? "blocked"
          : "rehearsal",
    healthy: input.health.healthy
      && input.health.operationEvidenceIntegrityHealthy
      && readinessErrors.length === 0,
    errors: readinessErrors,
  };
}

/**
 * Composes the explicit deployment gates required before durable hosted writes.
 * This is a read-only decision; it never changes provider configuration.
 */
export function derivePersistenceDeploymentGate(input: PersistenceDeploymentGateInput): PersistenceDeploymentGateResult {
  if (!input.providerConfigurationValid) {
    return {
      status: "blocked",
      mode: "non-durable-rehearsal",
      ready: false,
      blockedReasons: ["Persistence provider configuration is invalid."],
    };
  }

  if (input.provider !== "sqlite") {
    return {
      status: "rehearsal",
      mode: "non-durable-rehearsal",
      ready: false,
      blockedReasons: ["Durable hosted persistence requires the SQLite-managed provider path."],
    };
  }

  const blockedReasons = [
    ...(!input.databasePathReady ? input.databasePathErrors : []),
    ...(!input.allowDurableWrites ? ["Durable write approval is not enabled for this deployment."] : []),
    ...(!input.studentSessionBoundaryConfigured ? ["Signed student session boundary is not configured."] : []),
    ...(!input.teacherOperationsSessionBoundaryConfigured ? ["Tenant-scoped teacher operations boundary is not configured."] : []),
    ...(!input.schoolPolicyAccepted ? ["School policy acceptance is missing."] : []),
    ...(!input.retentionPolicyAccepted ? ["Retention policy acceptance is missing."] : []),
    ...(!input.releaseApprovalAccepted ? ["Release approval is missing."] : []),
    ...(!input.operationsReady ? ["Durable operations policy is not ready."] : []),
  ];

  return {
    status: blockedReasons.length === 0 ? "ready" : "blocked",
    mode: "durable-managed",
    ready: blockedReasons.length === 0,
    blockedReasons,
  };
}
