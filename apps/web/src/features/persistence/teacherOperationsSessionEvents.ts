export const TEACHER_OPERATIONS_SESSION_CHANGED = "living-textbook:teacher-operations-session-changed";

export function notifyTeacherOperationsSessionChanged(tenantId: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TEACHER_OPERATIONS_SESSION_CHANGED, { detail: { tenantId } }));
}

export function isTeacherOperationsSessionChangeForTenant(event: Event, tenantId: string): boolean {
  if (!(event instanceof CustomEvent)) return false;
  const detail = event.detail as { tenantId?: unknown } | null;
  return detail?.tenantId === tenantId;
}
