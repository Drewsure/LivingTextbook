import { getDurableOperationsPolicySnapshot } from "./sqliteProgressionOperations";
import { getDurableDatabasePathPolicySnapshot } from "./databasePathPolicy";
import {
  getConfiguredPersistenceProvider,
  getPersistenceProviderConfiguration,
} from "./progressionPersistenceAdapter";
import { derivePersistenceDeploymentGate } from "./persistenceReadiness";
import { isTeacherSessionConfigured } from "./teacherSessionCookie";
import { readServerSessionSecret } from "./sessionSecretPolicy";

export function getPersistenceDeploymentGateSnapshot() {
  const provider = getConfiguredPersistenceProvider();
  const providerConfiguration = getPersistenceProviderConfiguration();
  const durable = provider === "sqlite";
  const policy = getDurableOperationsPolicySnapshot();
  const databasePath = getDurableDatabasePathPolicySnapshot();
  const studentSessionBoundaryConfigured = Boolean(readServerSessionSecret("LIVING_TEXTBOOK_STUDENT_SESSION_SECRET"));
  const teacherOperationsSessionBoundaryConfigured = isTeacherSessionConfigured();

  return {
    provider,
    providerConfiguration,
    policy,
    studentSessionBoundaryConfigured,
    teacherOperationsSessionBoundaryConfigured,
    databasePath,
    gate: derivePersistenceDeploymentGate({
      provider,
      providerConfigurationValid: providerConfiguration.valid,
      databasePathReady: databasePath.valid,
      databasePathErrors: databasePath.errors,
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
