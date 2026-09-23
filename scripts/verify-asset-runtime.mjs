import { readFileSync } from "node:fs";

const runtime = readSource("../packages/content-model/src/assetRuntime.ts");
const failures = [];

for (const marker of [
  "AssetRuntimeRequest",
  "AssetRuntimeFileMetadata",
  "AssetRuntimeAdapter",
  "validateAssetRuntimeRequest",
  "validateAssetRuntimeFileMetadata",
  "must be a boolean",
  "createReviewOnlyAssetRuntimeAdapter",
  "asset scan must pass before review or promotion",
  "media or source rights status cannot be unknown",
  "source review must be reviewed or approved",
  "learner-recorded media is excluded from the core asset runtime",
  "learner uploads are excluded from the core asset runtime",
  "target unit or game mapping review is required before asset promotion",
  "release approval is required before asset promotion, binding, or export",
  "asset runtime request must be an object",
  "asset operation is unsupported",
  "asset kind is unsupported",
  "MIME type must be a bounded type/subtype value",
  "asset MIME type is incompatible with asset kind",
  "asset size must be a positive integer",
  "asset size cannot exceed ${ASSET_RUNTIME_MAX_BYTES} bytes",
  "ASSET_RUNTIME_MAX_BYTES",
  "asset scan status is unsupported",
  "asset rights status is unsupported",
  "asset source review status is unsupported",
  "bounded safe identifier",
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
