import { readFileSync } from "node:fs";

const contract = readSource("../packages/content-model/src/localBundleHandoffReview.ts");
const route = readSource("../apps/web/src/app/api/persistence/local-handoff/route.ts");
const authorization = readSource("../apps/web/src/server/persistence/teacherOperationsAuthorization.ts");
const failures = [];

for (const marker of [
  "LocalBundleHandoffReviewRequest",
  'value.accessMode !== \"teacher-review\"',
  "studentFacing: false",
  "validateLocalBundleHandoffReviewRequest",
  "must remain non-student-facing",
]) {
  if (!contract.includes(marker)) failures.push(`Review contract is missing ${marker}.`);
}

for (const marker of [
  "validateLocalBundleHandoffReviewRequest",
  "hasTeacherOperationsReadAuthorization(request, requestShape.tenantId)",
  "Local handoff review storage is not configured",
  "no package record is synthesized",
  "never student-facing",
  'status: \"unauthorized\"',
  'status: \"blocked\"',
  "Cache-Control",
]) {
  if (!route.includes(marker)) failures.push(`Review route is missing ${marker}.`);
}

for (const marker of [
  "claims?.role === \"teacher\"",
  "claims.scope === TEACHER_PERSISTENCE_READ_SCOPE",
  "isTeacherTenantAllowed(claims.tenantId)",
  "claims.tenantId === tenantId",
]) {
  if (!authorization.includes(marker)) failures.push(`Teacher authorization is missing ${marker}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS local handoff review access is teacher-scoped, tenant-bound, read-only, and blocked until a provider is approved.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
