import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/sourceRuntime.ts");
const failures = [];

for (const marker of [
  "SourceRuntimeRequest",
  "SourceRuntimeAdapter",
  "validateSourceRuntimeRequest",
  "createReviewOnlySourceRuntimeAdapter",
  "accepted upload file policy is required",
  "source file scan must pass before extraction",
  "source lineage review is required",
  "source rights review is required",
  "raw source files cannot become student payloads",
  "OCR confidence and uncertain spans must be reviewed before promotion",
  "teacher draft creation requires accepted extraction review",
  "student-facing source use requires content package runtime approval",
  "No OCR/parser promotion",
  "No teacher draft creation",
  "No AI extraction direct assignment",
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  if (!runtime.includes(marker)) failures.push(`Source runtime missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS source runtime keeps upload policy, scan, lineage, rights, extraction, OCR, draft, and no-side-effect gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
