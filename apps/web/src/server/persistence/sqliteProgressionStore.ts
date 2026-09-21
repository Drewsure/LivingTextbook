import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type {
  HostedProgressionPersistenceRecord,
  ProgressEventStreamPersistenceRecord,
} from "@living-textbook/content-model";
import { createProgressionRecordFingerprint } from "./progressionRecordFingerprint";

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

export interface DurableProgressEventStreamIdentity {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
}

export interface DurableProgressEventStreamLaunchScope {
  tenantId: string;
  packageId: string;
  launchCode: string;
}

export interface DurableProgressEventStreamWriteResult {
  status: "accepted" | "conflict";
  idempotent: boolean;
  record?: ProgressEventStreamPersistenceRecord;
  errors: string[];
}

export interface DurableProgressionHealth {
  healthy: boolean;
  schemaVersion: number;
  journalMode: string;
  synchronous: string;
  errors: string[];
  operationEvidenceIntegrity: {
    healthy: boolean;
    checkedRecords: number;
    errors: string[];
  };
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
  tenantScopeDigest: string | null;
  deletedRecords: number | null;
  previousHash: string | null;
  evidenceHash: string;
}

interface StoredOperationEvidence {
  operation: DurableProgressionOperation;
  status: "completed";
  artifact_sha256: string | null;
  artifact_bytes: number | null;
  occurred_at: string;
  retention_days: number;
  scope_digest: string | null;
  tenant_scope_digest: string | null;
  deleted_records: number | null;
  previous_hash: string | null;
  evidence_hash: string | null;
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

interface StoredEventStreamIdentityRow extends StoredRow {
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
      CREATE TABLE IF NOT EXISTS progress_event_stream_records (
        tenant_id TEXT NOT NULL,
        package_id TEXT NOT NULL,
        launch_code TEXT NOT NULL,
        student_session_id TEXT NOT NULL,
        idempotency_key TEXT NOT NULL,
        written_at TEXT NOT NULL,
        record_json TEXT NOT NULL,
        PRIMARY KEY (tenant_id, package_id, launch_code, student_session_id, idempotency_key)
      ) STRICT;
      CREATE INDEX IF NOT EXISTS idx_progress_event_stream_identity
        ON progress_event_stream_records (tenant_id, package_id, launch_code, student_session_id, written_at);
      CREATE INDEX IF NOT EXISTS idx_progress_event_stream_idempotency
        ON progress_event_stream_records (idempotency_key);
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
        tenant_scope_digest TEXT,
        deleted_records INTEGER,
        previous_hash TEXT,
        evidence_hash TEXT
      ) STRICT;
      CREATE INDEX IF NOT EXISTS idx_progression_operation_evidence_time
        ON progression_operation_evidence (occurred_at DESC);
    `);
    if (this.ensureOperationEvidenceHashColumns()) this.backfillOperationEvidenceHashes();
  }

  private ensureOperationEvidenceHashColumns(): boolean {
    const columns = this.database.prepare("PRAGMA table_info(progression_operation_evidence)").all() as unknown as Array<{ name?: string }>;
    const names = new Set(columns.map((column) => column.name));
    let addedColumn = false;
    if (!names.has("tenant_scope_digest")) {
      this.database.exec("ALTER TABLE progression_operation_evidence ADD COLUMN tenant_scope_digest TEXT");
      addedColumn = true;
    }
    if (!names.has("previous_hash")) {
      this.database.exec("ALTER TABLE progression_operation_evidence ADD COLUMN previous_hash TEXT");
      addedColumn = true;
    }
    if (!names.has("evidence_hash")) {
      this.database.exec("ALTER TABLE progression_operation_evidence ADD COLUMN evidence_hash TEXT");
      addedColumn = true;
    }
    return addedColumn;
  }

  private backfillOperationEvidenceHashes(): void {
    const rows = this.readOperationEvidenceRows();
    let previousHash: string | null = null;
    for (const row of rows) {
      const evidenceHash = createOperationEvidenceHash({ row, previousHash });
      if (row.previous_hash !== previousHash || row.evidence_hash !== evidenceHash) {
        this.database.prepare("UPDATE progression_operation_evidence SET previous_hash = ?, evidence_hash = ? WHERE evidence_id = ?").run(previousHash, evidenceHash, row.evidence_id);
      }
      previousHash = evidenceHash;
    }
  }

  read(identity: DurableProgressionIdentity): HostedProgressionPersistenceRecord | undefined {
    const row = this.database.prepare(`
      SELECT record_json, idempotency_key
      FROM hosted_progression_records
      WHERE tenant_id = ? AND package_id = ? AND launch_code = ? AND student_session_id = ?
      ORDER BY written_at DESC, idempotency_key DESC
      LIMIT 1
    `).get(identity.tenantId, identity.packageId, identity.launchCode, identity.studentSessionId) as StoredRow | undefined;

    return parseStoredRecord(row);
  }

  write(record: HostedProgressionPersistenceRecord): DurableProgressionWriteResult {
    const existingRow = this.database.prepare(`
      SELECT tenant_id, package_id, launch_code, student_session_id, record_json, idempotency_key
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

      const existingRecord = parseStoredRecord(existingRow);
      if (!existingRecord) {
        return {
          status: "conflict",
          idempotent: false,
          errors: ["The idempotency key is bound to an invalid stored progression payload."],
        };
      }
      if (createProgressionRecordFingerprint(existingRecord) !== createProgressionRecordFingerprint(record)) {
        return {
          status: "conflict",
          idempotent: false,
          errors: ["The idempotency key is already bound to a different progression payload."],
        };
      }

      return { status: "accepted", idempotent: true, record: existingRecord, errors: [] };
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

  readEventStream(identity: DurableProgressEventStreamIdentity): ProgressEventStreamPersistenceRecord | undefined {
    const row = this.database.prepare(`
      SELECT record_json, idempotency_key
      FROM progress_event_stream_records
      WHERE tenant_id = ? AND package_id = ? AND launch_code = ? AND student_session_id = ?
      ORDER BY written_at DESC, idempotency_key DESC
      LIMIT 1
    `).get(identity.tenantId, identity.packageId, identity.launchCode, identity.studentSessionId) as StoredRow | undefined;
    return parseStoredEventStreamRecord(row);
  }

  listEventStreams(scope: DurableProgressEventStreamLaunchScope): ProgressEventStreamPersistenceRecord[] {
    const rows = this.database.prepare(`
      SELECT record_json, idempotency_key
      FROM progress_event_stream_records
      WHERE tenant_id = ? AND package_id = ? AND launch_code = ?
      ORDER BY written_at DESC, student_session_id ASC, idempotency_key DESC
    `).all(scope.tenantId, scope.packageId, scope.launchCode) as unknown as StoredRow[];
    return rows.flatMap((row) => {
      const record = parseStoredEventStreamRecord(row);
      return record ? [record] : [];
    });
  }

  writeEventStream(record: ProgressEventStreamPersistenceRecord): DurableProgressEventStreamWriteResult {
    const storageErrors = validateEventStreamStorageRecord(record);
    if (storageErrors.length > 0) return { status: "conflict", idempotent: false, errors: storageErrors };
    const existingRow = this.database.prepare(`
      SELECT tenant_id, package_id, launch_code, student_session_id, record_json, idempotency_key
      FROM progress_event_stream_records
      WHERE idempotency_key = ?
      LIMIT 1
    `).get(record.idempotencyKey) as StoredEventStreamIdentityRow | undefined;

    if (existingRow) {
      const sameIdentity = existingRow.tenant_id === record.tenantId
        && existingRow.package_id === record.packageId
        && existingRow.launch_code === record.launchCode
        && existingRow.student_session_id === record.studentSessionId;
      if (!sameIdentity) {
        return { status: "conflict", idempotent: false, errors: ["The event stream idempotency key is already bound to a different tenant-scoped identity."] };
      }
      const existingRecord = parseStoredEventStreamRecord(existingRow);
      if (!existingRecord) {
        return { status: "conflict", idempotent: false, errors: ["The event stream idempotency key is bound to an invalid stored payload."] };
      }
      if (stableJson(existingRecord) !== stableJson(record)) {
        return { status: "conflict", idempotent: false, errors: ["The event stream idempotency key is already bound to a different event payload."] };
      }
      return { status: "accepted", idempotent: true, record: existingRecord, errors: [] };
    }

    this.database.prepare(`
      INSERT INTO progress_event_stream_records (
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
        operationEvidenceIntegrity: this.getOperationEvidenceIntegrity(),
      };
    } catch {
      return {
        healthy: false,
        schemaVersion: 1,
        journalMode: "unknown",
        synchronous: "unknown",
        errors: ["SQLite health diagnostics could not be completed."],
        operationEvidenceIntegrity: { healthy: false, checkedRecords: 0, errors: ["Operation evidence integrity could not be checked."] },
      };
    }
  }

  getOperationEvidenceIntegrity(): { healthy: boolean; checkedRecords: number; errors: string[] } {
    try {
      const rows = this.readOperationEvidenceRows();
      const errors: string[] = [];
      let previousHash: string | null = null;
      for (const row of rows) {
        const expectedHash = createOperationEvidenceHash({ row, previousHash });
        if (row.previous_hash !== previousHash) errors.push(`Operation evidence ${row.evidence_id} has an invalid previous hash.`);
        if (row.evidence_hash !== expectedHash) errors.push(`Operation evidence ${row.evidence_id} has an invalid evidence hash.`);
        previousHash = expectedHash;
      }
      return { healthy: errors.length === 0, checkedRecords: rows.length, errors };
    } catch {
      return { healthy: false, checkedRecords: 0, errors: ["Operation evidence integrity check could not be completed."] };
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
    const progressionResult = this.database.prepare(`
      DELETE FROM hosted_progression_records
      WHERE tenant_id = ? AND package_id = ? AND launch_code = ? AND student_session_id = ?
    `).run(identity.tenantId, identity.packageId, identity.launchCode, identity.studentSessionId);
    const eventResult = this.database.prepare(`
      DELETE FROM progress_event_stream_records
      WHERE tenant_id = ? AND package_id = ? AND launch_code = ? AND student_session_id = ?
    `).run(identity.tenantId, identity.packageId, identity.launchCode, identity.studentSessionId);
    return { deletedRecords: Number(progressionResult.changes ?? 0) + Number(eventResult.changes ?? 0) };
  }

  recordOperationEvidence(input: {
    operation: DurableProgressionOperation;
    artifactSha256?: string;
    artifactBytes?: number;
    retentionDays: number;
    scopeDigest?: string;
    tenantScopeDigest?: string;
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
      tenantScopeDigest: input.tenantScopeDigest ?? null,
      deletedRecords: input.deletedRecords ?? null,
      previousHash: (this.database.prepare("SELECT evidence_hash FROM progression_operation_evidence ORDER BY occurred_at DESC, evidence_id DESC LIMIT 1").get() as { evidence_hash?: string } | undefined)?.evidence_hash ?? null,
      evidenceHash: "",
    };
    evidence.evidenceHash = createOperationEvidenceHash({
      row: {
        evidence_id: evidence.evidenceId,
        operation: evidence.operation,
        occurred_at: evidence.occurredAt,
        status: evidence.status,
        schema_version: evidence.schemaVersion,
        artifact_sha256: evidence.artifactSha256,
        artifact_bytes: evidence.artifactBytes,
        retention_days: evidence.retentionDays,
        scope_digest: evidence.scopeDigest,
        tenant_scope_digest: evidence.tenantScopeDigest,
        deleted_records: evidence.deletedRecords,
        previous_hash: evidence.previousHash,
        evidence_hash: null,
      },
      previousHash: evidence.previousHash,
    });
    this.database.prepare(`
      INSERT INTO progression_operation_evidence (
        evidence_id, operation, occurred_at, status, schema_version,
        artifact_sha256, artifact_bytes, retention_days, scope_digest, tenant_scope_digest, deleted_records, previous_hash, evidence_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      evidence.tenantScopeDigest,
      evidence.deletedRecords,
      evidence.previousHash,
      evidence.evidenceHash,
    );
    return evidence;
  }

  listOperationEvidence(limit = 50, tenantId?: string): DurableProgressionOperationEvidence[] {
    const boundedLimit = Math.max(1, Math.min(100, Math.trunc(limit)));
    const tenantScopeDigest = tenantId ? createTenantScopeDigest(tenantId) : undefined;
    const rows = this.readOperationEvidenceRows()
      .filter((row) => !tenantScopeDigest || row.tenant_scope_digest === tenantScopeDigest)
      .slice(-boundedLimit)
      .reverse();
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
      tenantScopeDigest: row.tenant_scope_digest,
      deletedRecords: row.deleted_records,
      previousHash: row.previous_hash,
      evidenceHash: row.evidence_hash ?? "",
    }));
  }

  private readOperationEvidenceRows(): StoredOperationEvidence[] {
    const rows = this.database.prepare(`
      SELECT evidence_id, operation, occurred_at, status, schema_version,
        artifact_sha256, artifact_bytes, retention_days, scope_digest, deleted_records,
        tenant_scope_digest, previous_hash, evidence_hash
      FROM progression_operation_evidence
      ORDER BY occurred_at ASC, evidence_id ASC
    `).all() as unknown as StoredOperationEvidence[];
    return rows;
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

function createOperationEvidenceHash(args: { row: StoredOperationEvidence; previousHash: string | null }): string {
  const metadata: Record<string, unknown> = {
    evidenceId: args.row.evidence_id,
    operation: args.row.operation,
    occurredAt: args.row.occurred_at,
    status: args.row.status,
    schemaVersion: args.row.schema_version,
    artifactSha256: args.row.artifact_sha256,
    artifactBytes: args.row.artifact_bytes,
    retentionDays: args.row.retention_days,
    scopeDigest: args.row.scope_digest,
    deletedRecords: args.row.deleted_records,
    previousHash: args.previousHash,
  };
  if (args.row.tenant_scope_digest) metadata.tenantScopeDigest = args.row.tenant_scope_digest;
  return createHash("sha256").update(JSON.stringify(metadata)).digest("hex");
}

export function createTenantScopeDigest(tenantId: string): string {
  return createHash("sha256").update(tenantId).digest("hex");
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

/** Close the process cache during controlled shutdowns and isolated verification. */
export function closeDurableProgressionStore(): void {
  cachedStore?.close();
  cachedStore = undefined;
  cachedPath = undefined;
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

function parseStoredEventStreamRecord(row: StoredRow | undefined): ProgressEventStreamPersistenceRecord | undefined {
  if (!row?.record_json) return undefined;
  try {
    const record = JSON.parse(row.record_json) as ProgressEventStreamPersistenceRecord;
    return record && record.idempotencyKey === row.idempotency_key ? record : undefined;
  } catch {
    return undefined;
  }
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`)
    .join(",")}}`;
}

function validateEventStreamStorageRecord(record: ProgressEventStreamPersistenceRecord): string[] {
  const errors: string[] = [];
  if (record.recordVersion !== 1) errors.push("The event stream record version is unsupported.");
  if (record.category !== "progress-event-stream") errors.push("The event stream record category is invalid.");
  if (record.adapterMode !== "hosted-managed") errors.push("The event stream record adapter mode is invalid.");
  if (record.rawLearnerAudioIncluded !== false) errors.push("The event stream store rejects raw learner audio fields.");
  if (record.learnerTranscriptIncluded !== false) errors.push("The event stream store rejects learner transcript fields.");
  for (const [name, value] of Object.entries({
    tenantId: record.tenantId,
    packageId: record.packageId,
    launchCode: record.launchCode,
    studentSessionId: record.studentSessionId,
    idempotencyKey: record.idempotencyKey,
    writtenAt: record.writtenAt,
  })) {
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`The event stream record ${name} is required.`);
  }
  if (!Array.isArray(record.events) || record.events.length === 0) errors.push("The event stream record must contain events.");
  const firstEvent = record.events?.[0];
  if (firstEvent && typeof firstEvent === "object") {
    const expectedKey = createEventStreamIdempotencyKey({
      tenantId: record.tenantId,
      unitKey: record.unitKey,
      launchCode: record.launchCode,
      studentSessionId: record.studentSessionId,
      gameMode: record.gameMode,
    });
    if (record.idempotencyKey !== expectedKey) errors.push("The event stream record idempotency key does not match canonical completion identity.");
  }
  return errors;
}

function createEventStreamIdempotencyKey(args: { tenantId: string; unitKey: string; launchCode: string; studentSessionId: string; gameMode: string }): string {
  return ["completion-v1", args.tenantId, args.unitKey, args.launchCode, args.studentSessionId, args.gameMode]
    .map((value) => encodeURIComponent(value.trim()))
    .join(":");
}
