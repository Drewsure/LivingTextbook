import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../packages/content-model/src/entitlementRuntime.ts", import.meta.url), "utf8");
const failures = [];

for (const marker of [
  "EntitlementRuntimeRequest",
  "EntitlementRuntimeAdapter",
  "validateEntitlementRuntimeRequest",
  "createReviewOnlyEntitlementRuntimeAdapter",
  "teacher approval is required",
  "school policy acceptance is required",
  "privacy policy acceptance is required",
  "cost policy acceptance is required",
  "allowed levels must be declared",
  "usage limits must be declared",
  "AI Tutor requires premium or enterprise entitlement",
  "AI Tutor remains disabled in review-only mode",
  "microphone practice remains disabled in review-only mode",
  "No entitlement activation",
  "No premium provider billing",
  "No microphone recording activation",
  "No AI Tutor dispatch",
  "No student-facing feature unlock",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
]) {
  if (!source.includes(marker)) failures.push(`entitlement runtime contract missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS entitlement runtime keeps tenant package controls, AI Tutor cost/privacy gates, microphone approval, and no-side-effect review explicit.");
