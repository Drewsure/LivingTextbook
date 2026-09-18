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
const statusRoute = read("apps/web/src/app/api/persistence/status/route.ts");
const client = read("apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts");
const statusClient = read("apps/web/src/features/persistence/persistenceStatusClient.ts");
const panel = read("apps/web/src/app/teacher/persistence/page.tsx");
const statusPanel = read("apps/web/src/features/persistence/PersistenceOperationsStatusPanel.tsx");
const operationsAccessPanel = read("apps/web/src/features/persistence/TeacherOperationsAccessPanel.tsx");
const sessionEvents = read("apps/web/src/features/persistence/teacherOperationsSessionEvents.ts");
const evidencePanel = read("apps/web/src/features/persistence/PersistenceOperationsEvidencePanel.tsx");
const hostedAdapterPanel = read("apps/web/src/features/persistence/HostedProgressionAdapterPanel.tsx");
const teacherAuth = read("apps/web/src/server/persistence/teacherOperationsAuthorization.ts");

requireFragments("progression read route", route, [
  "const accessMode = url.searchParams.get(\"accessMode\")",
  "Hosted progression reads require an explicit access purpose.",
  "hasTeacherOperationsReadAuthorization(request, lookup.tenantId)",
  "Teacher-scoped authorization is required for the hosted progression review probe.",
  "hasPersistenceReadAuthorization(request, lookup)",
  "A matching signed student session or server-side persistence authorization is required for this progression read.",
  "No progression record is returned without a matching tenant-scoped learner session.",
]);
requireFragments("progression read client", client, [
  'accessMode?: "student-continuity" | "teacher-review-probe"',
  'accessMode: request.accessMode ?? "student-continuity"',
  'credentials: "same-origin"',
  'cache: "no-store"',
  'status: "unauthorized"',
]);
requireFragments("teacher persistence probe", panel, [
  'accessMode: "teacher-review-probe"',
]);
requireFragments("teacher probe status rendering", read("apps/web/src/features/persistence/HostedProgressionAdapterPanel.tsx"), [
  'result?.status === "unauthorized" ? "Protected"',
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

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS hosted progression reads require a declared purpose and matching tenant-scoped authorization.");
}
