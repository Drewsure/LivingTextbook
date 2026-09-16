import { createHash } from "node:crypto";
import type {
  DurableProgressionBackupResult,
  DurableProgressionHealth,
  DurableProgressionIdentity,
  DurableProgressionOperationEvidence,
  SqliteProgressionStore,
} from "./sqliteProgressionStore";
import { createTenantScopeDigest, getDurableProgressionStore, sha256File, SqliteProgressionStore as SqliteStore } from "./sqliteProgressionStore";

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

export interface DurableProgressionBackupManifest {
  manifestVersion: 1;
  artifactKind: "sqlite-progression-backup";
  provider: "sqlite";
  schemaVersion: number;
  bytes: number;
  sha256: string;
  createdAt: string;
  retentionDays: number;
  rawLearnerAudioExcluded: true;
  learnerTranscriptsExcluded: true;
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
    return this.store.backupTo(destinationPath);
  }

  backupWithManifest(destinationPath: string, policy: DurableOperationsPolicy): DurableProgressionBackupEvidence {
    const backup = this.backupTo(destinationPath, policy);
    const policySnapshot = getDurableOperationsPolicySnapshot();
    const evidence = this.store.recordOperationEvidence({
      operation: "backup",
      artifactSha256: backup.sha256,
      artifactBytes: backup.bytes,
      retentionDays: policySnapshot.retentionDays ?? 0,
    });
    return {
      backup,
      manifest: {
        manifestVersion: 1,
        artifactKind: "sqlite-progression-backup",
        provider: "sqlite",
        schemaVersion: backup.schemaVersion,
        bytes: backup.bytes,
        sha256: backup.sha256,
        createdAt: new Date().toISOString(),
        retentionDays: policySnapshot.retentionDays ?? 0,
        rawLearnerAudioExcluded: true,
        learnerTranscriptsExcluded: true,
      },
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
    if (manifest.artifactKind !== "sqlite-progression-backup" || manifest.provider !== "sqlite") {
      throw new Error("The backup manifest does not describe a SQLite progression backup.");
    }
    if (manifest.rawLearnerAudioExcluded !== true || manifest.learnerTranscriptsExcluded !== true) {
      throw new Error("The backup manifest must exclude raw learner audio and learner transcripts.");
    }
    if (sha256File(sourcePath) !== manifest.sha256) {
      throw new Error("The progression backup does not match its checksum manifest.");
    }
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
