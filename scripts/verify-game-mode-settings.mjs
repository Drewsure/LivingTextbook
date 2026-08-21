import { readFileSync } from "node:fs";

const data = readSource("../apps/web/src/data/sampleGameModeSettingsProfiles.ts");
const panel = readSource("../apps/web/src/features/game-offers/GameModeSettingsProfilePanel.tsx");
const teacherIntake = readSource("../apps/web/src/app/teacher/intake/page.tsx");
const activeRoutes = readSource("./verify-active-routes.mjs");
const foundationGate = readSource("../apps/web/src/data/sampleFoundationVerificationGate.ts");
const packageJson = readSource("../package.json");

const requiredModes = [
  "flashcards",
  "match-up",
  "label-it",
  "memory-match",
  "balloon-pop",
  "quiz",
  "true-false",
  "type-answer",
  "spelling-practice",
  "sentence-builder",
  "speak-it",
];
const requiredBoundaries = [
  "No setting save",
  "Only target-language game events can trigger mastery",
  "Assist-language text, audio, hints, and UI labels remain support-only",
  "Learning audio always has priority",
  "No scoring profile override",
  "No background-media-only progress",
];
const failures = [];

for (const mode of requiredModes) {
  requireText(data, `createProfile("${mode}"`, `Game settings profile missing mode: ${mode}`);
}

for (const boundary of requiredBoundaries) {
  requireText(data, boundary, `Game settings profiles must include boundary: ${boundary}`);
}

requireText(panel, "GameModeSettingsProfilePanel", "Panel component must exist.");
requireText(panel, "Timer and difficulty profile", "Panel must expose timer and difficulty review.");
requireText(panel, "Global settings rules", "Panel must show global settings rules.");
requireText(panel, "Blocked actions", "Panel must show blocked actions.");
requireText(teacherIntake, "sampleGameModeSettingsProfilePlan", "Teacher intake must import settings profile plan.");
requireText(teacherIntake, "GameModeSettingsProfilePanel", "Teacher intake must render settings profile panel.");
requireText(activeRoutes, "Game mode settings", "Active route verifier must check teacher intake game mode settings copy.");
requireText(activeRoutes, "Timer and difficulty profile", "Active route verifier must check timer/difficulty copy.");
requireText(foundationGate, "verify:game-settings", "Foundation verification gate must list verify:game-settings.");
requireText(packageJson, '"verify:game-settings"', "package.json must expose verify:game-settings.");
requireText(packageJson, "npm run verify:game-settings", "verify:foundation must include verify:game-settings.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(`PASS game mode settings profiles cover ${requiredModes.length} active mode(s) and ${requiredBoundaries.length} safety boundary/boundaries.`);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
