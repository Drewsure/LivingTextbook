import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../packages/content-model/src/rewardRuntime.ts", import.meta.url), "utf8");
const failures = [];

for (const marker of [
  "RewardRuntimeRequest",
  "RewardRuntimeAdapter",
  "validateRewardRuntimeRequest",
  "createReviewOnlyRewardRuntimeAdapter",
  "pseudonymous learnerSlotId is required",
  "earned mastery evidence is required",
  "deterministic reward rule is required",
  "ownership provenance readiness is required",
  "random reward generation must remain disabled",
  "gacha pressure must remain disabled",
  "purchase-required rewards must remain disabled",
  "Spin Wheel ticket issuance requires a separately approved reward policy",
  "No collection inventory write",
  "No reward ownership mutation",
  "No random reward generation",
  "No gacha or purchase pressure",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
]) {
  if (!source.includes(marker)) failures.push(`reward runtime contract missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS reward runtime keeps earned collection, deterministic rules, provenance, and no-gacha boundaries explicit.");
