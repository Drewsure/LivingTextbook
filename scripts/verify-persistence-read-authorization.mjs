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

const route = read("apps/web/src/app/api/persistence/progression/route.ts");
const eventRoute = read("apps/web/src/app/api/persistence/events/route.ts");
const operationsRoute = read("apps/web/src/app/api/persistence/operations/route.ts");
const statusRoute = read("apps/web/src/app/api/persistence/status/route.ts");
const localHandoffRoute = read("apps/web/src/app/api/persistence/local-handoff/route.ts");
const requestBoundary = read("apps/web/src/server/persistence/requestBoundary.ts");
const client = read("apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts");
const statusClient = read("apps/web/src/features/persistence/persistenceStatusClient.ts");
const panel = read("apps/web/src/app/teacher/persistence/page.tsx");
const statusPanel = read("apps/web/src/features/persistence/PersistenceOperationsStatusPanel.tsx");
const operationsAccessPanel = read("apps/web/src/features/persistence/TeacherOperationsAccessPanel.tsx");
const sessionEvents = read("apps/web/src/features/persistence/teacherOperationsSessionEvents.ts");
const evidencePanel = read("apps/web/src/features/persistence/PersistenceOperationsEvidencePanel.tsx");
const hostedAdapterPanel = read("apps/web/src/features/persistence/HostedProgressionAdapterPanel.tsx");
const teacherAuth = read("apps/web/src/server/persistence/teacherOperationsAuthorization.ts");
const readiness = read("apps/web/src/server/persistence/persistenceReadiness.ts");
const studentSession = read("apps/web/src/server/persistence/studentSessionCookie.ts");
const teacherSession = read("apps/web/src/server/persistence/teacherSessionCookie.ts");
const sessionSecretPolicy = read("apps/web/src/server/persistence/sessionSecretPolicy.ts");
const persistenceRuntime = read("scripts/verify-persistence-runtime.mjs");
const studentSessionRoute = read("apps/web/src/app/api/student/session/route.ts");
const teacherSessionRoute = read("apps/web/src/app/api/teacher/session/route.ts");

requireFragments("progression read route", route, [
  "const accessMode = url.searchParams.get(\"accessMode\")",
  "Hosted progression reads require an explicit access purpose.",
  "hasTeacherOperationsReadAuthorization(request, lookup.tenantId)",
  "Teacher-scoped authorization is required for the hosted progression review probe.",
  "hasPersistenceReadAuthorization(request, lookup)",
  "A matching signed student session or server-side persistence authorization is required for this progression read.",
  "No progression record is returned without a matching tenant-scoped learner session.",
  'accessMode === "student-continuity" && !hasPersistenceReadAuthorization(request, lookup)',
  "Teacher probes are already authorized against the tenant-scoped teacher session above.",
  "readBoundedQueryParam",
]);
requireFragments("progression read client", client, [
  'accessMode?: "student-continuity" | "teacher-review-probe"',
  'accessMode: request.accessMode ?? "student-continuity"',
  'credentials: "same-origin"',
  'cache: "no-store"',
  'status: "unauthorized"',
  'status: "blocked"',
  'status: "unavailable"',
  "invalid response",
  "response.status === 409",
]);
requireFragments("teacher persistence probe", panel, [
  'accessMode: "teacher-review-probe"',
]);
requireFragments("teacher probe status rendering", read("apps/web/src/features/persistence/HostedProgressionAdapterPanel.tsx"), [
  'result?.status === "unauthorized"',
  '"Protected"',
  'result?.status === "blocked"',
  'result?.status === "unavailable"',
  "Deployment policy blocks this adapter path.",
  "The persistence provider is temporarily unavailable.",
  'Tenant-scoped review authorization is required.',
]);
requireFragments("teacher authorization boundary", teacherAuth, [
  "hasTeacherOperationsReadAuthorization",
  "claims.tenantId === tenantId",
]);
requireFragments("persistence status route", statusRoute, [
  "export function GET(request: Request)",
  "hasTeacherOperationsReadAuthorization(request, tenantId)",
  "Teacher-scoped authorization is required to inspect persistence operations status.",
  "Provider, deployment configuration, database paths, learner records, and operation evidence are withheld",
  "derivePersistenceReadiness",
  "policyErrors: policy.errors",
]);
requireFragments("persistence readiness helper", readiness, [
  "export function derivePersistenceReadiness",
  "const effectivePolicyErrors = input.durable ? input.policyErrors : [];",
  'status: "healthy" | "blocked" | "rehearsal"',
  "Signed student session boundary is not configured.",
]);
requireFragments("persistence runtime emission regression", persistenceRuntime, [
  "verify-session-cookie-emission-runtime.mjs",
]);
requireFragments("persistence status client", statusClient, [
  "readPersistenceStatus(tenantId: string)",
  "encodeURIComponent(tenantId)",
  'credentials: "same-origin"',
]);
requireFragments("persistence status panel", statusPanel, [
  "tenantId }: { tenantId: string }",
  'result?.status === "unauthorized" ? "Protected"',
  "Tenant-scoped review authorization is required.",
]);
requireFragments("teacher session change contract", sessionEvents, [
  "TEACHER_OPERATIONS_SESSION_CHANGED",
  "CustomEvent",
  "tenantId",
]);
requireFragments("event stream read route", eventRoute, [
  "readBoundedQueryParam",
  "Event stream read scope exceeds the bounded query limits.",
]);
requireFragments("persistence query boundary", requestBoundary, [
  "export function readBoundedQueryParam",
  "export function readBoundedQueryLimit",
  "value.length <= maxLength",
]);
requireFragments("operations read route", operationsRoute, [
  "readBoundedQueryLimit",
  "Operation evidence query exceeds the bounded query limits.",
  "listOperationEvidence(limit ?? 50, tenantId)",
]);
requireFragments("persistence status query boundary", statusRoute, [
  "readBoundedQueryParam",
  "Persistence status query exceeds the bounded tenant limit.",
]);
requireFragments("local handoff query boundary", localHandoffRoute, [
  "readBoundedQueryParam",
  "Local handoff query exceeds the bounded query limits.",
]);
requireFragments("teacher access session publishing", operationsAccessPanel, [
  "notifyTeacherOperationsSessionChanged(tenantId)",
  'nextResult.status === "authenticated"',
]);
requireFragments("persistence status session refresh", statusPanel, [
  "TEACHER_OPERATIONS_SESSION_CHANGED",
  "isTeacherOperationsSessionChangeForTenant",
  "checkStatus",
]);
requireFragments("operations evidence session refresh", evidencePanel, [
  "TEACHER_OPERATIONS_SESSION_CHANGED",
  "isTeacherOperationsSessionChangeForTenant",
  "checkEvidence",
]);
requireFragments("hosted adapter session refresh", hostedAdapterPanel, [
  "TEACHER_OPERATIONS_SESSION_CHANGED",
  "isTeacherOperationsSessionChangeForTenant",
  "checkReadPath",
]);
requireFragments("student session input bounds", studentSessionRoute, [
  "const fieldLimits",
  "tenantId: 160",
  "entryCode: 512",
  "Student session fields exceed their limits",
]);
for (const [label, source, emitter, maxTtl] of [["student session time bounds", studentSession, "getStudentSessionCookieMaxAge", "Math.min(STUDENT_SESSION_MAX_TTL_SECONDS, remainingSeconds)"], ["teacher session time bounds", teacherSession, "getTeacherSessionCookieMaxAge", "Math.min(TEACHER_SESSION_MAX_TTL_SECONDS, remainingSeconds)"]]) {
  requireFragments(label, source, ["readServerSessionSecret", "COOKIE_MAX_BYTES", "MAX_TTL_SECONDS", emitter, "Number.isFinite(expiresAtMs)", maxTtl, "Buffer.byteLength(cookieValue, \"utf8\")", "Buffer.byteLength(value, \"utf8\") <=", "segments.length !== 2", "hasBoundedString", "isValid", "issuedAt > now + 30_000", "expiresAt <= issuedAt"]);
}
requireFragments("session secret policy", sessionSecretPolicy, ["SESSION_SECRET_MIN_BYTES", "Buffer.byteLength(secret, \"utf8\") < SESSION_SECRET_MIN_BYTES", "readServerSessionSecret"]);
for (const [label, source] of [["student session sign-out origin gate", studentSessionRoute], ["teacher session sign-out origin gate", teacherSessionRoute]]) {
  requireFragments(label, source, ["export function DELETE(request: Request)", "validateSameOriginMutation(request)", "status: \"signed-out\""]);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS hosted progression reads require a declared purpose and matching tenant-scoped authorization.");
}
