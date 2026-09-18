import { isTeacherTenantAllowed, readTeacherSessionClaims, TEACHER_PERSISTENCE_READ_SCOPE } from "./teacherSessionCookie";

export function hasTeacherOperationsReadAuthorization(request: Request, tenantId: string): boolean {
  if (hasServerPersistenceToken(request)) return true;
  const claims = readTeacherSessionClaims(request);
  return Boolean(claims)
    && claims?.role === "teacher"
    && claims.scope === TEACHER_PERSISTENCE_READ_SCOPE
    && isTeacherTenantAllowed(claims.tenantId)
    && claims.tenantId === tenantId;
}

function hasServerPersistenceToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOK_PERSISTENCE_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}
