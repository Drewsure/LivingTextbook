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
