export interface HostedProgressionReadRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
}

export interface HostedProgressionReadResult {
  status: "available" | "not-found" | "error";
  durability?: "non-durable-rehearsal";
  errors: string[];
}

export async function readHostedProgressionContinuity(
  request: HostedProgressionReadRequest,
): Promise<HostedProgressionReadResult> {
  const query = new URLSearchParams(Object.entries(request));
  try {
    const response = await fetch(`/api/persistence/progression?${query.toString()}`, { method: "GET", cache: "no-store" });
    const body = await response.json() as { status?: string; durability?: "non-durable-rehearsal"; errors?: string[] };
    if (!response.ok || body.status === "not-found") {
      return { status: "not-found", durability: body.durability, errors: body.errors ?? ["No hosted progression rehearsal record was found."] };
    }
    return { status: "available", durability: body.durability, errors: body.errors ?? [] };
  } catch {
    return { status: "error", errors: ["The hosted progression adapter could not be reached."] };
  }
}
