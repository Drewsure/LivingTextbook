export interface HostedProgressionReadRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
}

import type { HostedProgressionPersistenceRecord } from "@living-textbook/content-model";

export interface HostedProgressionReadResult {
  status: "available" | "not-found" | "error";
  provider?: "process-memory" | "sqlite";
  durability?: "non-durable-rehearsal" | "durable-managed";
  record?: HostedProgressionPersistenceRecord;
  errors: string[];
}

export async function readHostedProgressionContinuity(
  request: HostedProgressionReadRequest,
): Promise<HostedProgressionReadResult> {
  const query = new URLSearchParams(Object.entries(request));
  try {
    const response = await fetch(`/api/persistence/progression?${query.toString()}`, { method: "GET", credentials: "same-origin", cache: "no-store" });
    const body = await response.json() as { status?: string; provider?: "process-memory" | "sqlite"; durability?: "non-durable-rehearsal" | "durable-managed"; record?: HostedProgressionPersistenceRecord; errors?: string[] };
    if (!response.ok || body.status === "not-found") {
      return { status: "not-found", provider: body.provider, durability: body.durability, record: body.record, errors: body.errors ?? ["No hosted progression record was found."] };
    }
    return { status: "available", provider: body.provider, durability: body.durability, record: body.record, errors: body.errors ?? [] };
  } catch {
    return { status: "error", errors: ["The hosted progression adapter could not be reached."] };
  }
}

export async function writeHostedProgressionContinuity(request: {
  expectedTenantId: string;
  expectedPackageId: string;
  expectedLaunchCode: string;
  expectedStudentSessionId: string;
  envelope: unknown;
}) {
  const response = await fetch("/api/persistence/progression", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...request,
      requestedMode: "durable-managed",
    }),
  });
  const body = await response.json() as { status?: string; errors?: string[]; idempotent?: boolean };
  return {
    status: body.status ?? (response.ok ? "accepted" : "error"),
    idempotent: body.idempotent === true,
    errors: body.errors ?? [],
  };
}
