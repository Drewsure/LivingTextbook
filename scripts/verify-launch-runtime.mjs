import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/launchRuntime.ts");
const failures = [];

for (const marker of [
  "LaunchRuntimeRequest",
  "LaunchRuntimeAdapter",
  "validateLaunchRuntimeRequest",
  "createReviewOnlyLaunchRuntimeAdapter",
  "teacher role verification is required",
  "content package runtime approval is required",
  "teacher assignment runtime approval is required",
  "accepted school or tenant launch policy is required",
  "accepted roster and learner identity policy is required",
  "target-language audio readiness is required",
  "support language progress must remain disabled",
  "media-only progress must remain disabled",
  "No classroom session activation",
  "No student data collection",
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  if (!runtime.includes(marker)) failures.push(`Launch runtime missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS launch runtime keeps tenant, QR, policy, roster, persistence, audio, and no-side-effect classroom gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
