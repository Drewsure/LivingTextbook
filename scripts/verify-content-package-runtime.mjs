import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/contentPackageRuntime.ts");
const failures = [];

for (const marker of [
  "ContentPackageRuntimeRequest",
  "ContentPackageRuntimeAdapter",
  "validateContentPackageRuntimeRequest",
  "createReviewOnlyContentPackageRuntimeAdapter",
  "curated activity pathway review is required",
  "student-facing package use requires approved content review status",
  "accepted tenant or school storage policy is required",
  "package persistence readiness is required",
  "teacher or tenant release approval is required",
  "audio support must keep every learner-facing cue in the target language",
  "Student-visible assist language plan",
  "No student-ready marker",
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  if (!runtime.includes(marker)) failures.push(`Content package runtime missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS content package runtime keeps tenant, review, audio, assist-language, storage, release, and no-side-effect gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
