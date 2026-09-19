export interface PersistenceStatusResult {
  status: "healthy" | "blocked" | "rehearsal" | "unauthorized" | "error";
  tenantId?: string;
  checkedAt?: string;
  provider?: "process-memory" | "sqlite";
  durability?: "non-durable-rehearsal" | "durable-managed";
  healthy?: boolean;
  schemaVersion?: number | null;
  journalMode?: string | null;
  synchronous?: string | null;
  operationEvidenceIntegrity?: {
    healthy: boolean;
    checkedRecords: number;
    errors: string[];
  };
  studentSessionBoundaryConfigured?: boolean;
  teacherOperationsSessionBoundaryConfigured?: boolean;
  operations?: {
    enabled: boolean;
    ready: boolean;
    retentionDays: number | null;
    errors: string[];
  };
  errors: string[];
  privacy?: string;
}

export async function readPersistenceStatus(tenantId: string): Promise<PersistenceStatusResult> {
  try {
    const response = await fetch(`/api/persistence/status?tenantId=${encodeURIComponent(tenantId)}`, { method: "GET", credentials: "same-origin", cache: "no-store" });
    const body = await response.json() as Omit<PersistenceStatusResult, "status"> & { status?: PersistenceStatusResult["status"] };
    return {
      status: body.status ?? (response.ok ? "healthy" : "error"),
      tenantId: body.tenantId,
      checkedAt: body.checkedAt,
      provider: body.provider,
      durability: body.durability,
      healthy: body.healthy,
      schemaVersion: body.schemaVersion,
      journalMode: body.journalMode,
      synchronous: body.synchronous,
      operationEvidenceIntegrity: body.operationEvidenceIntegrity,
      studentSessionBoundaryConfigured: body.studentSessionBoundaryConfigured,
      teacherOperationsSessionBoundaryConfigured: body.teacherOperationsSessionBoundaryConfigured,
      operations: body.operations,
      errors: body.errors ?? [],
      privacy: body.privacy,
    };
  } catch {
    return { status: "error", errors: ["The persistence status endpoint could not be reached."] };
  }
}
