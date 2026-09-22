import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const model = readSource("../packages/content-model/src/phaserCandidateIntegrationEligibility.ts");
const index = readSource("../packages/content-model/src/index.ts");
const fixture = readSource("../apps/web/src/data/samplePhaserCandidateIntegrationEligibility.ts");
const panel = readSource("../apps/web/src/features/game-offers/PhaserCandidateIntegrationEligibilityPanel.tsx");
const page = readSource("../apps/web/src/app/teacher/game-readiness/page.tsx");
const failures = [];

for (const marker of [
  "PhaserCandidateIntegrationEligibility",
  "sourceIsolationRequired",
  "canonicalRoute",
  "canonicalComponent",
  "scoringProfile",
  "No direct source import",
  "No wrapper approval",
  "No route replacement",
  "No scene-owned scoring",
  "No browser persistence ownership",
  "No package promotion",
  "No student assignment",
]) {
  if (!model.includes(marker)) failures.push(`Phaser integration eligibility model missing marker: ${marker}`);
}
requireText(index, 'export * from "./phaserCandidateIntegrationEligibility";', "Integration eligibility must be exposed through the public content-model root.");
requireText(fixture, 'status: "blocked"', "Phaser integration eligibility samples must remain blocked.");
requireText(fixture, "wrapperAllowed: false", "Phaser integration eligibility must block wrapper approval.");
requireText(fixture, "directImportAllowed: false", "Phaser integration eligibility must block direct import.");
requireText(fixture, "balloon-pop", "Phaser integration eligibility must cover Balloon Pop.");
requireText(fixture, "memory-match", "Phaser integration eligibility must cover Memory Match.");
requireText(panel, "Z.ai and Phaser source remains isolated", "Game readiness must show source isolation explicitly.");
requireText(panel, "Import blocked", "Game readiness must show import remains blocked.");
requireText(page, "PhaserCandidateIntegrationEligibilityPanel", "Game readiness must mount integration eligibility.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS frozen Phaser candidates are bound to canonical game contracts with import, wrapper, scoring, persistence, promotion, and assignment blocked.");

function readSource(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
