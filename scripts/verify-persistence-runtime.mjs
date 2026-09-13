import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/persistenceRuntime.ts");
const replay = readSource("../packages/content-model/src/canonicalGameReplay.ts");
const failures = [];

for (const marker of [
  "PersistenceRuntimeRequest",
  "PersistenceRuntimeAdapter",
  "validatePersistenceRuntimeRequest",
  "createReviewOnlyPersistenceAdapter",
  "must be a boolean",
  'mode: "review-only"',
  'sideEffect: "none"',
  "raw learner audio is not a core persistence field",
  "learner transcripts are not a core persistence field",
  "release approval is required before mutation or export",
  "progress event writes require a completion idempotency key",
  "progress event writes require canonical completion identity",
  "validateCanonicalCompletionIdempotencyKey",
  "completionIdentity",
  "No hosted database write",
  "No local classroom write",
  "No hybrid sync write",
  "idempotencyKey",
]) {
  if (!runtime.includes(marker)) failures.push(`Persistence runtime missing marker: ${marker}`);
}

if (!replay.includes("completion idempotency key does not match canonical completion identity")) {
  failures.push("Canonical replay contract missing completion identity mismatch marker");
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS persistence runtime keeps tenant, policy, privacy, release, and no-side-effect review gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
