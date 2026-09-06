import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/reportRuntime.ts");
const failures = [];

for (const marker of [
  "TeacherReportRuntimeRequest",
  "TeacherReportRuntimeAdapter",
  "validateTeacherReportRuntimeRequest",
  "createReviewOnlyTeacherReportRuntimeAdapter",
  "pseudonymous-slots-only",
  "raw learner audio is excluded from core teacher reports",
  "learner transcripts are excluded from core teacher reports",
  "accepted school or tenant policy is required",
  "explicit report export approval is required",
  "No teacher report export",
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  if (!runtime.includes(marker)) failures.push(`Report runtime missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS teacher report runtime keeps taxonomy, privacy, policy, approval, and no-side-effect review gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
