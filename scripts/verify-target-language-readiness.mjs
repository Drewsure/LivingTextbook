import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleTargetLanguageExpansionPlan.ts");
const panel = readSource("../apps/web/src/features/language/TargetLanguageExpansionPanel.tsx");
const routeVerifier = readSource("./verify-active-routes.mjs");
const assistStandard = readSource("../docs/ASSIST_LANGUAGE_STANDARD.md");
const futureRequirements = readSource("../docs/FUTURE_REQUIREMENTS.md");
const failures = [];

const requiredLanes = [
  ["target-language-config", "planned"],
  ["japanese-script-policy", "planned"],
  ["segmentation-policy", "blocked"],
  ["audio-pronunciation", "planned"],
  ["typing-input", "planned"],
  ["handwriting-stroke-order", "optional"],
];

const requiredGates = [
  "assist-target-separation",
  "target-language-trigger",
  "furigana-rendering",
  "segmentation-engine",
  "teacher-review",
];

for (const [laneId, status] of requiredLanes) {
  requireLaneStatus(laneId, status);
}

for (const gateId of requiredGates) {
  requireText(plan, `gateId: "${gateId}"`, `Target-language gate missing: ${gateId}`);
}

requireText(plan, "Assist language is not target language", "Plan must keep assist language separate from target language.");
requireText(plan, "Japanese as target language", "Plan must name Japanese as target-language opportunity.");
requireText(plan, "English remains the progression trigger", "MiniStar English must keep English as progression trigger.");
requireText(plan, "Japanese becomes the target-language trigger", "Japanese tenant must use Japanese as target-language trigger.");
requireText(plan, "Furigana", "Plan must include furigana/ruby readiness.");
requireText(plan, "Segmentation policy", "Plan must include segmentation policy.");
requireText(plan, "Kana and kanji input", "Plan must include kana/kanji input readiness.");
requireText(plan, "Japanese audio cues", "Plan must include Japanese audio readiness.");
requireText(panel, "Target language expansion", "Panel must expose target-language expansion heading.");
requireText(panel, "Blocks Japanese target-language pilot", "Panel must show pilot blockers.");
requireText(routeVerifier, "Target language expansion", "Active route verifier must check target-language panel.");
requireText(routeVerifier, "Assist language is not target language", "Active route verifier must check assist/target separation.");
requireText(assistStandard, "Do not treat MiniStar Japanese assist copy as proof", "Assist standard must preserve target-language boundary.");
requireText(futureRequirements, "Japanese As Target Language For White-Label Tenants", "Future requirements must preserve Japanese target-language opportunity.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS target-language readiness covers ${requiredLanes.length} expansion lane(s) and ${requiredGates.length} target-language gate(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function requireLaneStatus(laneId, status) {
  const escaped = laneId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`laneId:\\s*"${escaped}"[\\s\\S]*?status:\\s*"${status}"`, "m");

  if (!pattern.test(plan)) {
    failures.push(`Target-language lane ${laneId} must have status ${status}.`);
  }
}
