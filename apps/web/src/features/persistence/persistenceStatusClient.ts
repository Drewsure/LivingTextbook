export interface PersistenceStatusResult {
  status: "healthy" | "blocked" | "rehearsal" | "error";
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
  operations?: {
    enabled: boolean;
    ready: boolean;
    retentionDays: number | null;
    errors: string[];
  };
  errors: string[];
  privacy?: string;
}

export async function readPersistenceStatus(): Promise<PersistenceStatusResult> {
  try {
    const response = await fetch("/api/persistence/status", { method: "GET", cache: "no-store" });
    const body = await response.json() as Omit<PersistenceStatusResult, "status"> & { status?: PersistenceStatusResult["status"] };
    return {
      status: body.status ?? (response.ok ? "healthy" : "error"),
      provider: body.provider,
      durability: body.durability,
      healthy: body.healthy,
      schemaVersion: body.schemaVersion,
      journalMode: body.journalMode,
      synchronous: body.synchronous,
      operationEvidenceIntegrity: body.operationEvidenceIntegrity,
      studentSessionBoundaryConfigured: body.studentSessionBoundaryConfigured,
      operations: body.operations,
      errors: body.errors ?? [],
      privacy: body.privacy,
    };
  } catch {
    return { status: "error", errors: ["The persistence status endpoint could not be reached."] };
  }
}
