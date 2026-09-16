export interface EstablishStudentSessionRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
  entryCode: string;
  userCode: string;
}

export interface EstablishStudentSessionResult {
  status: "authenticated" | "rehearsal-only" | "unauthorized" | "unavailable" | "error";
  errors: string[];
}

export async function establishStudentSession(
  request: EstablishStudentSessionRequest,
): Promise<EstablishStudentSessionResult> {
  try {
    const response = await fetch("/api/student/session", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    const body = await response.json() as { status?: EstablishStudentSessionResult["status"]; errors?: string[] };
    const status = body.status ?? (response.status === 401 ? "unauthorized" : "unavailable");
    return { status, errors: body.errors ?? [] };
  } catch {
    return { status: "error", errors: ["The student session boundary could not be reached."] };
  }
}
