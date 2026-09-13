import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../packages/content-model/src/progressionRuntime.ts", import.meta.url), "utf8");
const economyPolicy = readFileSync(new URL("../packages/content-model/src/economyPolicy.ts", import.meta.url), "utf8");
const identity = readFileSync(new URL("../packages/content-model/src/progressionIdentity.ts", import.meta.url), "utf8");
const failures = [];

for (const marker of [
  "export const UNIT_STAR_DUST_CAP = 1000",
  "export const MODULE_STAR_DUST_CAP = 4000",
  "export const MODULE_MASTERY_THRESHOLD = 3000",
]) {
  if (!economyPolicy.includes(marker)) failures.push(`economy policy missing marker: ${marker}`);
}

for (const marker of [
  "ProgressionRuntimeRequest",
  "ProgressionRuntimeAdapter",
  "validateProgressionRuntimeRequest",
  "must be a boolean",
  "createReviewOnlyProgressionRuntimeAdapter",
  "progress persistence readiness is required",
  "report runtime readiness is required",
  "deterministic reward policy readiness is required",
  "target-language evidence is required for progress-affecting events",
  "support-only events cannot enter the progression authority",
  "report-only events cannot enter the progression authority",
  "No mastery mutation",
  "No score mutation",
  "No Star Dust or reward mutation",
  "No support-language progress trigger",
  "No media-only progress trigger",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
  "ProgressionContinuityEnvelope",
  "createProgressionContinuityEnvelope",
  "validateProgressionContinuityEnvelope",
  "validateProgressionContinuityRuntimeRequest",
  "createReviewOnlyProgressionContinuityAdapter",
  "No URL-encoded progression state",
  "No cross-tenant progression reuse",
  "sideEffect: \"none\"",
]) {
  if (!source.includes(marker)) failures.push(`progression runtime contract missing marker: ${marker}`);
}

if (!identity.includes("validateProgressionLaunchIdentity")) {
  failures.push("progression identity contract missing marker: validateProgressionLaunchIdentity");
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS progression runtime keeps target-language authority, support-only boundaries, deterministic rewards, and no-side-effect review explicit.");
