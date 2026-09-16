export interface TeacherOperationsSessionResult {
  status: "authenticated" | "signed-out" | "blocked" | "unauthorized" | "rejected" | "error";
  tenantId?: string;
  expiresAt?: string;
  errors: string[];
}

export async function createTeacherOperationsSession(tenantId: string, reviewCode: string): Promise<TeacherOperationsSessionResult> {
  try {
    const response = await fetch("/api/teacher/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, reviewCode }),
    });
    const body = await response.json() as Partial<TeacherOperationsSessionResult>;
    return { status: body.status ?? (response.ok ? "authenticated" : "error"), tenantId: body.tenantId, expiresAt: body.expiresAt, errors: body.errors ?? [] };
  } catch {
    return { status: "error", errors: ["The teacher review session endpoint could not be reached."] };
  }
}

export async function clearTeacherOperationsSession(): Promise<TeacherOperationsSessionResult> {
  try {
    const response = await fetch("/api/teacher/session", { method: "DELETE" });
    const body = await response.json() as Partial<TeacherOperationsSessionResult>;
    return { status: body.status ?? (response.ok ? "signed-out" : "error"), errors: body.errors ?? [] };
  } catch {
    return { status: "error", errors: ["The teacher review session endpoint could not be reached."] };
  }
}
