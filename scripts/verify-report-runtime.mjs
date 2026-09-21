import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/reportRuntime.ts");
const persistenceRuntime = readSource("../packages/content-model/src/teacherReportPersistenceRuntime.ts");
const snapshot = readSource("../packages/content-model/src/teacherReportPackageSnapshot.ts");
const failures = [];

for (const marker of [
  "TeacherReportRuntimeRequest",
  "TeacherReportRuntimeAdapter",
  "validateTeacherReportRuntimeRequest",
  "validateTeacherReportCanonicalGameEvents",
  "targetLanguage",
  "targetLanguage is required and must be non-blank",
  "targetLanguage is required",
  "createReviewOnlyTeacherReportRuntimeAdapter",
  "TeacherReportPersistenceRuntimeRequest",
  "createReviewOnlyTeacherReportPersistenceAdapter",
  "validateTeacherReportPersistenceRuntimeRequest",
  "No teacher report package write",
  "No teacher report export",
  "preservesReportEventAcceptanceSummary",
  "preservesSettingsContext",
  "same tenant boundary key",
  "must be a boolean",
  "pseudonymous-slots-only",
  "raw learner audio is excluded from core teacher reports",
  "learner transcripts are excluded from core teacher reports",
  "accepted school or tenant policy is required",
  "explicit report export approval is required",
  "teacher report event envelopes must include launch_code matching runtime launchCode",
  "teacher report event envelopes must use runtime launchCode",
  "teacher report event envelopes must use runtime tenantId",
  "teacher report canonical game evidence",
  "No teacher report export",
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  const source = [runtime, persistenceRuntime].join("\n");
  if (!source.includes(marker)) failures.push(`Report runtime missing marker: ${marker}`);
}

for (const marker of [
  "TeacherReportPackageSnapshot",
  "createTeacherReportPackageSnapshot",
  "validateTeacherReportPackageSnapshot",
  'storageMode: "provider-neutral"',
  'exportAllowed: false',
  'writesAllowed: false',
  "must not embed raw event records",
  "hosted-managed",
  "local-classroom",
]) {
  if (!snapshot.includes(marker)) failures.push(`Report package snapshot missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS teacher report runtime keeps taxonomy, privacy, policy, approval, and no-side-effect review gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
