import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../packages/content-model/src/recoveryRuntime.ts", import.meta.url), "utf8");
const failures = [];

for (const marker of [
  "RecoveryRuntimeRequest",
  "RecoveryRuntimeAdapter",
  "validateRecoveryRuntimeRequest",
  "createReviewOnlyRecoveryRuntimeAdapter",
  "backup manifest readiness is required",
  "checksum verification is required",
  "encryption readiness is required",
  "access control readiness is required",
  "retention policy acceptance is required",
  "school or tenant policy acceptance is required",
  "report integrity readiness is required",
  "raw learner audio exclusion is required",
  "raw learner transcript exclusion is required",
  "restore execution requires rollback readiness",
  "rollback execution requires an executing recovery request",
  "No backup creation",
  "No restore execution",
  "No export archive creation",
  "No learner-data recovery",
  "No QR or route mutation",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
]) {
  if (!source.includes(marker)) failures.push(`recovery runtime contract missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS recovery runtime keeps backup, restore, export, rollback, privacy, policy, and no-side-effect gates explicit.");
