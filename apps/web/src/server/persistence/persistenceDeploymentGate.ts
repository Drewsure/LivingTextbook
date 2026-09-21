import { getDurableOperationsPolicySnapshot } from "./sqliteProgressionOperations";
import {
  getConfiguredPersistenceProvider,
  getPersistenceProviderConfiguration,
} from "./progressionPersistenceAdapter";
import { derivePersistenceDeploymentGate } from "./persistenceReadiness";
import { isTeacherSessionConfigured } from "./teacherSessionCookie";

export function getPersistenceDeploymentGateSnapshot() {
  const provider = getConfiguredPersistenceProvider();
  const providerConfiguration = getPersistenceProviderConfiguration();
  const durable = provider === "sqlite";
  const policy = getDurableOperationsPolicySnapshot();
  const studentSessionBoundaryConfigured = Boolean(process.env.LIVING_TEXTBOOK_STUDENT_SESSION_SECRET?.trim());
  const teacherOperationsSessionBoundaryConfigured = isTeacherSessionConfigured();

  return {
    provider,
    providerConfiguration,
    policy,
    studentSessionBoundaryConfigured,
    teacherOperationsSessionBoundaryConfigured,
    gate: derivePersistenceDeploymentGate({
      provider,
      providerConfigurationValid: providerConfiguration.valid,
      allowDurableWrites: process.env.LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES === "true",
      studentSessionBoundaryConfigured,
      teacherOperationsSessionBoundaryConfigured,
      schoolPolicyAccepted: policy.schoolPolicyAccepted,
      retentionPolicyAccepted: policy.retentionPolicyAccepted,
      releaseApprovalAccepted: policy.releaseApprovalAccepted,
      operationsReady: durable && policy.errors.length === 0,
    }),
  };
}
