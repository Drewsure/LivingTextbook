import type {
  DurableProgressionBackupResult,
  DurableProgressionHealth,
  DurableProgressionIdentity,
  SqliteProgressionStore,
} from "./sqliteProgressionStore";
import { getDurableProgressionStore, SqliteProgressionStore as SqliteStore } from "./sqliteProgressionStore";

export interface DurableOperationsPolicy {
  schoolPolicyAccepted: boolean;
  retentionPolicyAccepted: boolean;
  releaseApprovalAccepted: boolean;
}

export interface DurableOperationsPolicySnapshot {
  operationsEnabled: boolean;
  schoolPolicyAccepted: boolean;
  retentionPolicyAccepted: boolean;
  releaseApprovalAccepted: boolean;
  retentionDays: number | null;
  errors: string[];
}

/**
 * Server-only operational controls for the closed pilot. These methods are
 * intentionally not exposed as browser mutation routes.
 */
export class SqliteProgressionOperations {
  constructor(private readonly store: SqliteProgressionStore = getDurableProgressionStore()) {}

  health(): DurableProgressionHealth {
    return this.store.getHealth();
  }

  backupTo(destinationPath: string, policy: DurableOperationsPolicy): DurableProgressionBackupResult {
    assertOperationsAllowed(policy);
    return this.store.backupTo(destinationPath);
  }

  restoreFromBackup(sourcePath: string, destinationPath: string, policy: DurableOperationsPolicy): DurableProgressionBackupResult {
    assertOperationsAllowed(policy);
    return SqliteStore.restoreFromBackup(sourcePath, destinationPath);
  }

  deleteForIdentity(identity: DurableProgressionIdentity, policy: DurableOperationsPolicy): { deletedRecords: number } {
    assertOperationsAllowed(policy);
    return this.store.deleteForIdentity(identity);
  }
}

export function getDurableOperationsPolicySnapshot(): DurableOperationsPolicySnapshot {
  const retentionDays = Number.parseInt(process.env.LIVING_TEXTBOOK_PERSISTENCE_RETENTION_DAYS ?? "", 10);
  const snapshot = {
    operationsEnabled: process.env.LIVING_TEXTBOOK_PERSISTENCE_ALLOW_OPERATIONS === "true",
    schoolPolicyAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_SCHOOL_POLICY_ACCEPTED === "true",
    retentionPolicyAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_RETENTION_POLICY_ACCEPTED === "true",
    releaseApprovalAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_RELEASE_APPROVED === "true",
    retentionDays: Number.isInteger(retentionDays) && retentionDays > 0 ? retentionDays : null,
    errors: [] as string[],
  };
  if (!snapshot.operationsEnabled) snapshot.errors.push("Durable operations require the explicit operations gate.");
  if (!snapshot.schoolPolicyAccepted) snapshot.errors.push("Durable operations require the deployment school-policy gate.");
  if (!snapshot.retentionPolicyAccepted) snapshot.errors.push("Durable operations require the deployment retention-policy gate.");
  if (!snapshot.releaseApprovalAccepted) snapshot.errors.push("Durable operations require the deployment release-approval gate.");
  if (snapshot.retentionDays === null) snapshot.errors.push("Durable operations require a positive retention period in days.");
  return snapshot;
}

function assertOperationsAllowed(policy: DurableOperationsPolicy): void {
  const snapshot = getDurableOperationsPolicySnapshot();
  const errors = [
    ...snapshot.errors,
    ...(policy.schoolPolicyAccepted ? [] : ["Operation evidence must include school-policy acceptance."]),
    ...(policy.retentionPolicyAccepted ? [] : ["Operation evidence must include retention-policy acceptance."]),
    ...(policy.releaseApprovalAccepted ? [] : ["Operation evidence must include release approval."]),
  ];
  if (errors.length > 0) throw new Error(errors.join(" "));
}
