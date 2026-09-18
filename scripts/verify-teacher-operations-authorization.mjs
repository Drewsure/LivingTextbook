import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function requireFragments(label, source, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}

const session = read("apps/web/src/server/persistence/teacherSessionCookie.ts");
const authorization = read("apps/web/src/server/persistence/teacherOperationsAuthorization.ts");
const sessionRoute = read("apps/web/src/app/api/teacher/session/route.ts");
const operationsRoute = read("apps/web/src/app/api/persistence/operations/route.ts");
const store = read("apps/web/src/server/persistence/sqliteProgressionStore.ts");
const client = read("apps/web/src/features/persistence/persistenceOperationsEvidenceClient.ts");
const panel = read("apps/web/src/features/persistence/TeacherOperationsAccessPanel.tsx");
const env = read(".env.example");

requireFragments("signed teacher session", session, [
  "living-textbook-teacher-session",
  "TEACHER_PERSISTENCE_READ_SCOPE",
  "createHmac",
  "timingSafeEqual",
  "HttpOnly",
  "SameSite=Lax",
  "Date.parse(claims.expiresAt) <= Date.now()",
]);
requireFragments("authorization helper", authorization, [
  "hasTeacherOperationsReadAuthorization",
  "hasServerPersistenceToken",
  "claims?.role === \"teacher\"",
  "claims.scope === TEACHER_PERSISTENCE_READ_SCOPE",
  "isTeacherTenantAllowed(claims.tenantId)",
  "claims.tenantId === tenantId",
]);
requireFragments("session route", sessionRoute, [
  "export function GET(request: Request)",
  "readTeacherSessionClaims",
  "isTeacherSessionConfigured",
  "isTeacherReviewCodeValid",
  "isTeacherTenantAllowed",
  "!claims || !isTeacherTenantAllowed(claims.tenantId)",
  "setTeacherSessionCookie",
  "clearTeacherSessionCookie",
]);
requireFragments("tenant allowlist", session, [
  "Boolean(configuredTenants?.length && configuredTenants.includes(tenantId))",
]);
requireFragments("operations route", operationsRoute, [
  "Teacher-scoped authorization is required",
  "hasTeacherOperationsReadAuthorization(request, tenantId)",
  "listOperationEvidence(limit, tenantId)",
]);
if (operationsRoute.includes('status: "unauthorized", provider: getProvider()')) {
  failures.push("operations route: unauthorized response must not disclose provider");
}
requireFragments("tenant-filtered receipts", store, [
  "tenant_scope_digest",
  "createTenantScopeDigest",
  ".filter((row) => !tenantScopeDigest || row.tenant_scope_digest === tenantScopeDigest)",
]);
requireFragments("browser client", client, [
  "readPersistenceOperationsEvidence(tenantId: string)",
  "encodeURIComponent(tenantId)",
]);
requireFragments("teacher access UI", panel, [
  "Teacher review code",
  "Sign in for review",
  "Sign out",
  "cannot access student gameplay",
  "useEffect",
  "readTeacherOperationsSession",
]);
requireFragments("environment contract", env, [
  "LIVING_TEXTBOOK_TEACHER_SESSION_SECRET",
  "LIVING_TEXTBOOK_TEACHER_REVIEW_CODE",
  "LIVING_TEXTBOOK_TEACHER_REVIEW_TENANTS",
  "LIVING_TEXTBOOK_TEACHER_SESSION_TTL_SECONDS",
]);

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS teacher operations history requires separate expiring tenant-scoped authorization.");
}
