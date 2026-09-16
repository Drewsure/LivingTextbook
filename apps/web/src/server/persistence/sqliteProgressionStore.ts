import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { HostedProgressionPersistenceRecord } from "@living-textbook/content-model";

export interface DurableProgressionIdentity {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
}

export interface DurableProgressionWriteResult {
  status: "accepted" | "conflict";
  idempotent: boolean;
  record?: HostedProgressionPersistenceRecord;
  errors: string[];
}

export interface DurableProgressionHealth {
  healthy: boolean;
  schemaVersion: number;
  journalMode: string;
  synchronous: string;
  errors: string[];
}

export interface DurableProgressionBackupResult {
  destinationPath: string;
  bytes: number;
  sha256: string;
  schemaVersion: number;
}

export type DurableProgressionOperation = "backup" | "restore" | "retention-delete";

export interface DurableProgressionOperationEvidence {
  evidenceId: string;
  operation: DurableProgressionOperation;
  occurredAt: string;
  status: "completed";
  schemaVersion: number;
  artifactSha256: string | null;
  artifactBytes: number | null;
  retentionDays: number;
  scopeDigest: string | null;
  deletedRecords: number | null;
}

interface StoredOperationEvidence extends DurableProgressionOperationEvidence {
  artifact_sha256: string | null;
  artifact_bytes: number | null;
  occurred_at: string;
  retention_days: number;
  scope_digest: string | null;
  deleted_records: number | null;
  evidence_id: string;
  schema_version: number;
}

interface StoredRow {
  record_json: string;
  idempotency_key: string;
}

interface StoredIdentityRow extends StoredRow {
  tenant_id: string;
  package_id: string;
  launch_code: string;
  student_session_id: string;
}

const defaultDatabasePath = resolve(process.cwd(), "data", "living-textbook-progress.sqlite");
let cachedStore: SqliteProgressionStore | undefined;
let cachedPath: string | undefined;

/**
 * Server-only durable store for the first closed/hosted pilot slice.
 * The route remains the policy and identity boundary; this class only stores
 * already-validated records and never accepts arbitrary SQL or payload fields.
 */
export class SqliteProgressionStore {
  readonly provider = "sqlite" as const;
  private readonly database: DatabaseSync;
  private readonly databasePath: string;

  constructor(databasePath = defaultDatabasePath) {
    const resolvedPath = resolve(databasePath);
    this.databasePath = resolvedPath;
    mkdirSync(dirname(resolvedPath), { recursive: true });
    this.database = new DatabaseSync(resolvedPath);
    this.database.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA synchronous = FULL; PRAGMA busy_timeout = 5000;");
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS hosted_progression_records (
        tenant_id TEXT NOT NULL,
        package_id TEXT NOT NULL,
        launch_code TEXT NOT NULL,
        student_session_id TEXT NOT NULL,
        idempotency_key TEXT NOT NULL,
        written_at TEXT NOT NULL,
        record_json TEXT NOT NULL,
        PRIMARY KEY (tenant_id, package_id, launch_code, student_session_id, idempotency_key)
      ) STRICT;
      CREATE INDEX IF NOT EXISTS idx_hosted_progression_identity
        ON hosted_progression_records (tenant_id, package_id, launch_code, student_session_id, written_at);
      CREATE INDEX IF NOT EXISTS idx_hosted_progression_idempotency
        ON hosted_progression_records (idempotency_key);
      CREATE TABLE IF NOT EXISTS progression_operation_evidence (
        evidence_id TEXT PRIMARY KEY,
        operation TEXT NOT NULL CHECK (operation IN ('backup', 'restore', 'retention-delete')),
        occurred_at TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status = 'completed'),
        schema_version INTEGER NOT NULL,
        artifact_sha256 TEXT,
        artifact_bytes INTEGER,
        retention_days INTEGER NOT NULL,
        scope_digest TEXT,
        deleted_records INTEGER
      ) STRICT;
      CREATE INDEX IF NOT EXISTS idx_progression_operation_evidence_time
        ON progression_operation_evidence (occurred_at DESC);
    `);
  }

  read(identity: DurableProgressionIdentity): HostedProgressionPersistenceRecord | undefined {
    const row = this.database.prepare(`
      SELECT record_json, idempotency_key
      FROM hosted_progression_records
      WHERE tenant_id = ? AND package_id = ? AND launch_code = ? AND student_session_id = ?
      ORDER BY written_at DESC
      LIMIT 1
    `).get(identity.tenantId, identity.packageId, identity.launchCode, identity.studentSessionId) as StoredRow | undefined;

    return parseStoredRecord(row);
  }

  write(record: HostedProgressionPersistenceRecord): DurableProgressionWriteResult {
    const existingRow = this.database.prepare(`
      SELECT tenant_id, package_id, launch_code, student_session_id, record_json
      FROM hosted_progression_records
      WHERE idempotency_key = ?
      LIMIT 1
    `).get(record.idempotencyKey) as StoredIdentityRow | undefined;

    if (existingRow) {
      const sameIdentity = existingRow.tenant_id === record.tenantId
        && existingRow.package_id === record.packageId
        && existingRow.launch_code === record.launchCode
        && existingRow.student_session_id === record.studentSessionId;
      if (!sameIdentity) {
        return {
          status: "conflict",
          idempotent: false,
          errors: ["The idempotency key is already bound to a different tenant-scoped identity."],
        };
      }

      return {
        status: "accepted",
        idempotent: true,
        record: parseStoredRecord(existingRow),
        errors: [],
      };
    }

    this.database.prepare(`
      INSERT INTO hosted_progression_records (
        tenant_id, package_id, launch_code, student_session_id,
        idempotency_key, written_at, record_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      record.tenantId,
      record.packageId,
      record.launchCode,
      record.studentSessionId,
      record.idempotencyKey,
      record.writtenAt,
      JSON.stringify(record),
    );

    return { status: "accepted", idempotent: false, record, errors: [] };
  }

  getHealth(): DurableProgressionHealth {
    try {
      const integrity = this.database.prepare("PRAGMA integrity_check").get() as { integrity_check?: string } | undefined;
      const journal = this.database.prepare("PRAGMA journal_mode").get() as { journal_mode?: string } | undefined;
      const synchronous = this.database.prepare("PRAGMA synchronous").get() as { synchronous?: string | number } | undefined;
      const errors = integrity?.integrity_check === "ok" ? [] : ["SQLite integrity check did not return ok."];
      return {
        healthy: errors.length === 0,
        schemaVersion: 1,
        journalMode: journal?.journal_mode ?? "unknown",
        synchronous: String(synchronous?.synchronous ?? "unknown"),
        errors,
      };
    } catch {
      return {
        healthy: false,
        schemaVersion: 1,
        journalMode: "unknown",
        synchronous: "unknown",
        errors: ["SQLite health diagnostics could not be completed."],
      };
    }
  }

  backupTo(destinationPath: string): DurableProgressionBackupResult {
    const resolvedDestination = resolve(destinationPath);
    if (resolvedDestination === this.databasePath) throw new Error("A progression database cannot back up over itself.");
    if (existsSync(resolvedDestination)) throw new Error("The backup destination already exists.");
    mkdirSync(dirname(resolvedDestination), { recursive: true });
    const escapedPath = resolvedDestination.replaceAll("'", "''");
    this.database.exec(`VACUUM INTO '${escapedPath}'`);
    return {
      destinationPath: resolvedDestination,
      bytes: statSync(resolvedDestination).size,
      sha256: sha256File(resolvedDestination),
      schemaVersion: 1,
    };
  }

  deleteForIdentity(identity: DurableProgressionIdentity): { deletedRecords: number } {
    const result = this.database.prepare(`
      DELETE FROM hosted_progression_records
      WHERE tenant_id = ? AND package_id = ? AND launch_code = ? AND student_session_id = ?
    `).run(identity.tenantId, identity.packageId, identity.launchCode, identity.studentSessionId);
    return { deletedRecords: Number(result.changes ?? 0) };
  }

  recordOperationEvidence(input: {
    operation: DurableProgressionOperation;
    artifactSha256?: string;
    artifactBytes?: number;
    retentionDays: number;
    scopeDigest?: string;
    deletedRecords?: number;
  }): DurableProgressionOperationEvidence {
    const evidence: DurableProgressionOperationEvidence = {
      evidenceId: `ops-${Date.now()}-${randomUUID()}`,
      operation: input.operation,
      occurredAt: new Date().toISOString(),
      status: "completed",
      schemaVersion: 1,
      artifactSha256: input.artifactSha256 ?? null,
      artifactBytes: input.artifactBytes ?? null,
      retentionDays: input.retentionDays,
      scopeDigest: input.scopeDigest ?? null,
      deletedRecords: input.deletedRecords ?? null,
    };
    this.database.prepare(`
      INSERT INTO progression_operation_evidence (
        evidence_id, operation, occurred_at, status, schema_version,
        artifact_sha256, artifact_bytes, retention_days, scope_digest, deleted_records
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      evidence.evidenceId,
      evidence.operation,
      evidence.occurredAt,
      evidence.status,
      evidence.schemaVersion,
      evidence.artifactSha256,
      evidence.artifactBytes,
      evidence.retentionDays,
      evidence.scopeDigest,
      evidence.deletedRecords,
    );
    return evidence;
  }

  listOperationEvidence(limit = 50): DurableProgressionOperationEvidence[] {
    const boundedLimit = Math.max(1, Math.min(100, Math.trunc(limit)));
    const rows = this.database.prepare(`
      SELECT evidence_id, operation, occurred_at, status, schema_version,
        artifact_sha256, artifact_bytes, retention_days, scope_digest, deleted_records
      FROM progression_operation_evidence
      ORDER BY occurred_at DESC
      LIMIT ?
    `).all(boundedLimit) as unknown as StoredOperationEvidence[];
    return rows.map((row) => ({
      evidenceId: row.evidence_id,
      operation: row.operation,
      occurredAt: row.occurred_at,
      status: "completed",
      schemaVersion: row.schema_version,
      artifactSha256: row.artifact_sha256,
      artifactBytes: row.artifact_bytes,
      retentionDays: row.retention_days,
      scopeDigest: row.scope_digest,
      deletedRecords: row.deleted_records,
    }));
  }

  close(): void {
    this.database.close();
  }

  static restoreFromBackup(sourcePath: string, destinationPath: string): DurableProgressionBackupResult {
    const resolvedSource = resolve(sourcePath);
    const resolvedDestination = resolve(destinationPath);
    if (!existsSync(resolvedSource)) throw new Error("The progression backup does not exist.");
    if (resolvedSource === resolvedDestination) throw new Error("A progression backup cannot restore over itself.");
    if (existsSync(resolvedDestination)) throw new Error("The restore destination already exists.");

    const source = new DatabaseSync(resolvedSource);
    try {
      const integrity = source.prepare("PRAGMA integrity_check").get() as { integrity_check?: string } | undefined;
      if (integrity?.integrity_check !== "ok") throw new Error("The progression backup failed its SQLite integrity check.");
      const table = source.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'hosted_progression_records'").get() as { name?: string } | undefined;
      if (table?.name !== "hosted_progression_records") throw new Error("The progression backup is missing the expected record table.");
    } finally {
      source.close();
    }

    mkdirSync(dirname(resolvedDestination), { recursive: true });
    copyFileSync(resolvedSource, resolvedDestination);
    return {
      destinationPath: resolvedDestination,
      bytes: statSync(resolvedDestination).size,
      sha256: sha256File(resolvedDestination),
      schemaVersion: 1,
    };
  }
}

export function sha256File(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

export function getDurableProgressionStore(): SqliteProgressionStore {
  const configuredPath = process.env.LIVING_TEXTBOOK_PROGRESSION_DB_PATH?.trim();
  const databasePath = configuredPath ? resolve(configuredPath) : defaultDatabasePath;

  if (!cachedStore || cachedPath !== databasePath) {
    cachedStore = new SqliteProgressionStore(databasePath);
    cachedPath = databasePath;
  }

  return cachedStore;
}

function parseStoredRecord(row: StoredRow | undefined): HostedProgressionPersistenceRecord | undefined {
  if (!row?.record_json) return undefined;

  try {
    const record = JSON.parse(row.record_json) as HostedProgressionPersistenceRecord;
    return record && record.idempotencyKey === row.idempotency_key ? record : undefined;
  } catch {
    return undefined;
  }
}
