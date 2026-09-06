import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/assetRuntime.ts");
const failures = [];

for (const marker of [
  "AssetRuntimeRequest",
  "AssetRuntimeAdapter",
  "validateAssetRuntimeRequest",
  "createReviewOnlyAssetRuntimeAdapter",
  "asset scan must pass before review or promotion",
  "media or source rights status cannot be unknown",
  "source review must be reviewed or approved",
  "learner-recorded media is excluded from the core asset runtime",
  "learner uploads are excluded from the core asset runtime",
  "target unit or game mapping review is required before asset promotion",
  "release approval is required before asset promotion, binding, or export",
  "No file upload",
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  if (!runtime.includes(marker)) failures.push(`Asset runtime missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS asset runtime keeps tenant, file safety, scan, rights, mapping, release, and no-side-effect review gates explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
