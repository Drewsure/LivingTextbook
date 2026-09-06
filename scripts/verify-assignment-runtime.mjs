import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/assignmentRuntime.ts");
const failures = [];

for (const marker of [
  "AssignmentRuntimeRequest",
  "AssignmentRuntimeAdapter",
  "validateAssignmentRuntimeRequest",
  "createReviewOnlyAssignmentRuntimeAdapter",
  "teacher role verification is required",
  "content package runtime approval is required",
  "classroom launch runtime approval is required",
  "accepted private assignment link policy is required",
  "accepted roster and learner identity policy is required",
  "assignment and progress persistence readiness is required",
  "target-language audio readiness is required",
  "student-facing assignment use requires ready-for-pilot assignment readiness",
  "No assignment write",
  "No private link activation",
  "No roster binding",
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  if (!runtime.includes(marker)) failures.push(`Assignment runtime missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS assignment runtime keeps private links, roster, persistence, reporting, audio, and no-side-effect gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
