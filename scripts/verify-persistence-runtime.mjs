import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/persistenceRuntime.ts");
const failures = [];

for (const marker of [
  "PersistenceRuntimeRequest",
  "PersistenceRuntimeAdapter",
  "validatePersistenceRuntimeRequest",
  "createReviewOnlyPersistenceAdapter",
  'mode: "review-only"',
  'sideEffect: "none"',
  "raw learner audio is not a core persistence field",
  "learner transcripts are not a core persistence field",
  "release approval is required before mutation or export",
  "No hosted database write",
  "No local classroom write",
  "No hybrid sync write",
]) {
  if (!runtime.includes(marker)) failures.push(`Persistence runtime missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS persistence runtime keeps tenant, policy, privacy, release, and no-side-effect review gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
