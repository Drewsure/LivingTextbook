import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const runtime = readSource("../packages/content-model/src/persistenceRuntime.ts");
const replay = readSource("../packages/content-model/src/canonicalGameReplay.ts");
const handoff = readSource("../packages/content-model/src/persistenceHandoff.ts");
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

for (const marker of [
  "PersistenceHandoffPacket",
  "validatePersistenceHandoffPacket",
  "provider selection remains uncommitted",
  "live side effects remain disabled",
  "tenant-bound category coverage",
]) {
  if (!handoff.includes(marker)) failures.push(`Persistence handoff contract missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

execFileSync(process.execPath, [fileURLToPath(new URL("./verify-progress-event-persistence.mjs", import.meta.url))], {
  stdio: "inherit",
});

console.log("PASS persistence runtime keeps tenant, policy, privacy, release, and no-side-effect review gates explicit.");
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-persistence-provider-configuration.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-persistence-provider-conformance.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-persistence-readiness.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-teacher-launch-report-aggregation.mjs", import.meta.url))], {
  stdio: "inherit",
});

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
