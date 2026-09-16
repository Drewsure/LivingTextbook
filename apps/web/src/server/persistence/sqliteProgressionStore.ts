import { mkdirSync } from "node:fs";
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

  constructor(databasePath = defaultDatabasePath) {
    const resolvedPath = resolve(databasePath);
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
