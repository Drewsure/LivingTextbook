export interface PersistenceOperationEvidence {
  evidenceId: string;
  operation: "backup" | "restore" | "retention-delete";
  occurredAt: string;
  status: "completed";
  schemaVersion: number;
  artifactSha256: string | null;
  artifactBytes: number | null;
  retentionDays: number;
  scopeDigest: string | null;
  deletedRecords: number | null;
}

export interface PersistenceOperationsEvidenceResult {
  status: "available" | "rehearsal" | "unavailable" | "unauthorized" | "error";
  records: PersistenceOperationEvidence[];
  errors: string[];
  privacy?: string;
}

export async function readPersistenceOperationsEvidence(tenantId: string): Promise<PersistenceOperationsEvidenceResult> {
  try {
    const response = await fetch(`/api/persistence/operations?limit=25&tenantId=${encodeURIComponent(tenantId)}`, { method: "GET", cache: "no-store" });
    const body = await response.json() as Partial<PersistenceOperationsEvidenceResult>;
    return {
      status: body.status ?? (response.ok ? "available" : "unavailable"),
      records: body.records ?? [],
      errors: body.errors ?? [],
      privacy: body.privacy,
    };
  } catch {
    return { status: "error", records: [], errors: ["The operation evidence endpoint could not be reached."] };
  }
}
