import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/releaseRuntime.ts");
const failures = [];

for (const marker of [
  "ReleaseRuntimeRequest",
  "ReleaseRuntimeAdapter",
  "validateReleaseRuntimeRequest",
  "createReviewOnlyReleaseRuntimeAdapter",
  "accepted source extraction evidence is required",
  "accepted asset rights evidence is required",
  "target-language audio readiness is required",
  "curated activity pathway review is required",
  "passed verifier evidence is required",
  "approved release state requires teacher or tenant approval",
  "approved release state requires accepted school or tenant policy",
  "approved release state requires rollback readiness",
  "production QR mutation is only valid for an active release request",
  "No release-state mutation",
  "No production QR redirect mutation",
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  if (!runtime.includes(marker)) failures.push(`Release runtime missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS release runtime keeps verifier, rights, audio, pathway, policy, QR, rollback, and no-side-effect gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
