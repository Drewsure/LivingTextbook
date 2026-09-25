import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import type {
  DurableProgressionBackupResult,
  DurableProgressionHealth,
  DurableProgressionIdentity,
  DurableProgressionOperationEvidence,
  SqliteProgressionStore,
} from "./sqliteProgressionStore";
import { createTenantScopeDigest, getDurableProgressionStore, sha256File, SqliteProgressionStore as SqliteStore } from "./sqliteProgressionStore";
import { createDurableProgressionBackupManifest, validateDurableProgressionBackupManifest } from "./backupManifest";
import { validateDurableBackupPath } from "./backupPathPolicy";
import type { DurableProgressionBackupManifest } from "./backupManifest";
export type { DurableProgressionBackupManifest } from "./backupManifest";

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
  encryptionAtRestAccepted: boolean;
  retentionDays: number | null;
  errors: string[];
}

export interface DurableProgressionBackupEvidence {
  backup: DurableProgressionBackupResult;
  manifest: DurableProgressionBackupManifest;
  evidence: DurableProgressionOperationEvidence;
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
    assertDurableBackupPath(destinationPath);
    return this.store.backupTo(destinationPath);
  }

  backupWithManifest(destinationPath: string, policy: DurableOperationsPolicy): DurableProgressionBackupEvidence {
    const backup = this.backupTo(destinationPath, policy);
    const policySnapshot = getDurableOperationsPolicySnapshot();
    const manifest = createDurableProgressionBackupManifest(backup, policySnapshot.retentionDays ?? 0);
    const evidence = this.store.recordOperationEvidence({
      operation: "backup",
      artifactSha256: backup.sha256,
      artifactBytes: backup.bytes,
      retentionDays: policySnapshot.retentionDays ?? 0,
    });
    return {
      backup,
      manifest,
      evidence,
    };
  }

  restoreFromBackup(
    sourcePath: string,
    destinationPath: string,
    manifest: DurableProgressionBackupManifest,
    policy: DurableOperationsPolicy,
  ): DurableProgressionBackupResult {
    return this.restoreWithManifest(sourcePath, destinationPath, manifest, policy);
  }

  restoreWithManifest(
    sourcePath: string,
    destinationPath: string,
    manifest: DurableProgressionBackupManifest,
    policy: DurableOperationsPolicy,
  ): DurableProgressionBackupResult {
    assertOperationsAllowed(policy);
    assertDurableBackupPath(sourcePath);
    assertDurableBackupPath(destinationPath);
    const sourceBytes = statSync(sourcePath).size;
    const sourceSha256 = sha256File(sourcePath);
    const manifestErrors = validateDurableProgressionBackupManifest(manifest, {
      bytes: sourceBytes,
      sha256: sourceSha256,
      schemaVersion: 1,
    });
    if (manifestErrors.length > 0) throw new Error(manifestErrors.join(" "));
    const source = SqliteStore.restoreFromBackup(sourcePath, destinationPath);
    this.store.recordOperationEvidence({
      operation: "restore",
      artifactSha256: source.sha256,
      artifactBytes: source.bytes,
      retentionDays: getDurableOperationsPolicySnapshot().retentionDays ?? 0,
    });
    return source;
  }

  deleteForIdentity(identity: DurableProgressionIdentity, policy: DurableOperationsPolicy): { deletedRecords: number } {
    assertOperationsAllowed(policy);
    const result = this.store.deleteForIdentity(identity);
    this.store.recordOperationEvidence({
      operation: "retention-delete",
      retentionDays: getDurableOperationsPolicySnapshot().retentionDays ?? 0,
      scopeDigest: sha256Scope(identity),
      tenantScopeDigest: createTenantScopeDigest(identity.tenantId),
      deletedRecords: result.deletedRecords,
    });
    return result;
  }
}

function sha256Scope(identity: DurableProgressionIdentity): string {
  return createHash("sha256")
    .update([identity.tenantId, identity.packageId, identity.launchCode, identity.studentSessionId].join("\u001f"))
    .digest("hex");
}

export function getDurableOperationsPolicySnapshot(): DurableOperationsPolicySnapshot {
  const retentionDays = Number.parseInt(process.env.LIVING_TEXTBOOK_PERSISTENCE_RETENTION_DAYS ?? "", 10);
  const snapshot = {
    operationsEnabled: process.env.LIVING_TEXTBOOK_PERSISTENCE_ALLOW_OPERATIONS === "true",
    schoolPolicyAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_SCHOOL_POLICY_ACCEPTED === "true",
    retentionPolicyAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_RETENTION_POLICY_ACCEPTED === "true",
    releaseApprovalAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_RELEASE_APPROVED === "true",
    encryptionAtRestAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_ENCRYPTION_AT_REST_ACCEPTED === "true",
    retentionDays: Number.isInteger(retentionDays) && retentionDays > 0 ? retentionDays : null,
    errors: [] as string[],
  };
  if (!snapshot.operationsEnabled) snapshot.errors.push("Durable operations require the explicit operations gate.");
  if (!snapshot.schoolPolicyAccepted) snapshot.errors.push("Durable operations require the deployment school-policy gate.");
  if (!snapshot.retentionPolicyAccepted) snapshot.errors.push("Durable operations require the deployment retention-policy gate.");
  if (!snapshot.releaseApprovalAccepted) snapshot.errors.push("Durable operations require the deployment release-approval gate.");
  if (!snapshot.encryptionAtRestAccepted) snapshot.errors.push("Durable operations require the deployment encryption-at-rest gate.");
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

function assertDurableBackupPath(candidatePath: string): void {
  const errors = validateDurableBackupPath(candidatePath, process.env.LIVING_TEXTBOOK_PERSISTENCE_BACKUP_ROOT);
  if (errors.length > 0) throw new Error(errors.join(" "));
}
