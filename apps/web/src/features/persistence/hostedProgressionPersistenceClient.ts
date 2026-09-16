export interface HostedProgressionReadRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
}

export interface HostedProgressionReadResult {
  status: "available" | "not-found" | "error";
  provider?: "process-memory" | "sqlite";
  durability?: "non-durable-rehearsal" | "durable-managed";
  errors: string[];
}

export async function readHostedProgressionContinuity(
  request: HostedProgressionReadRequest,
): Promise<HostedProgressionReadResult> {
  const query = new URLSearchParams(Object.entries(request));
  try {
    const response = await fetch(`/api/persistence/progression?${query.toString()}`, { method: "GET", cache: "no-store" });
    const body = await response.json() as { status?: string; provider?: "process-memory" | "sqlite"; durability?: "non-durable-rehearsal" | "durable-managed"; errors?: string[] };
    if (!response.ok || body.status === "not-found") {
      return { status: "not-found", provider: body.provider, durability: body.durability, errors: body.errors ?? ["No hosted progression record was found."] };
    }
    return { status: "available", provider: body.provider, durability: body.durability, errors: body.errors ?? [] };
  } catch {
    return { status: "error", errors: ["The hosted progression adapter could not be reached."] };
  }
}
