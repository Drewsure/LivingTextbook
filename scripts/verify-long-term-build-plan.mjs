import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const planPath = fileURLToPath(new URL("../docs/LONG_TERM_BUILD_PLAN.md", import.meta.url));
const plan = readFileSync(planPath, "utf8");
const requiredMarkers = [
  "Foundation hardening",
  "Canonical game integration",
  "Controlled pilot release",
  "Publisher content pipeline",
  "Production persistence and deployment",
  "Accessibility and localization",
  "Optional AI services",
  "Release readiness",
  "evidence/return-package.json",
  "Drewsure/ministar-lab",
  "frozen-2026-09-12-aaa-stable",
  "No source copy",
  "English/target-language evidence triggers progression",
  "Rewards are deterministic",
];

const missingMarkers = requiredMarkers.filter((marker) => !plan.includes(marker));
if (missingMarkers.length > 0) {
  throw new Error(`Long-term build plan is missing required markers: ${missingMarkers.join(", ")}`);
}

if (!plan.includes("## Governed phases") || !plan.includes("## Current hard gate") || !plan.includes("## Work sequencing rule")) {
  throw new Error("Long-term build plan must retain governed phase, hard-gate, and sequencing sections.");
}

console.log("PASS long-term build plan preserves all governed phases, the active Z.ai gate, and platform boundaries.");
