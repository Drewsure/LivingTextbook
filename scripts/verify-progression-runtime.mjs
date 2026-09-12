import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../packages/content-model/src/progressionRuntime.ts", import.meta.url), "utf8");
const failures = [];

for (const marker of [
  "ProgressionRuntimeRequest",
  "ProgressionRuntimeAdapter",
  "validateProgressionRuntimeRequest",
  "must be a boolean",
  "createReviewOnlyProgressionRuntimeAdapter",
  "progress persistence readiness is required",
  "report runtime readiness is required",
  "deterministic reward policy readiness is required",
  "target-language evidence is required for progress-affecting events",
  "support-only events cannot enter the progression authority",
  "report-only events cannot enter the progression authority",
  "No mastery mutation",
  "No score mutation",
  "No Star Dust or reward mutation",
  "No support-language progress trigger",
  "No media-only progress trigger",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
]) {
  if (!source.includes(marker)) failures.push(`progression runtime contract missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS progression runtime keeps target-language authority, support-only boundaries, deterministic rewards, and no-side-effect review explicit.");
