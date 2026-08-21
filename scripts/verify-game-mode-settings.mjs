import { readFileSync } from "node:fs";

const data = readSource("../apps/web/src/data/sampleGameModeSettingsProfiles.ts");
const storageReadiness = readSource("../apps/web/src/data/sampleGameModeSettingsStorageReadiness.ts");
const backendContract = readSource("../apps/web/src/data/sampleGameModeSettingsBackendContract.ts");
const panel = readSource("../apps/web/src/features/game-offers/GameModeSettingsProfilePanel.tsx");
const storagePanel = readSource("../apps/web/src/features/game-offers/GameModeSettingsStorageReadinessPanel.tsx");
const backendContractPanel = readSource("../apps/web/src/features/game-offers/GameModeSettingsBackendContractPanel.tsx");
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
const requiredStorageMarkers = [
  "game_mode_settings_profile",
  "teacher_game_mode_settings_snapshot",
  "game_mode_settings_change_request",
  "hosted-game-mode-settings-profile-write",
  "local-game-mode-settings-profile-write",
  "Storage write blocked",
  "No persisted timer choice",
  "No persisted difficulty choice",
  "Learning audio priority preserved in storage",
  "No scoring profile override",
  "No background-media-only progress",
  "No support-language-only progress",
];
const requiredBackendContractMarkers = [
  "Game settings backend map",
  "Backend contract map",
  "m096-game-mode-settings-storage-records",
  "spec-game-mode-settings-storage",
  "game-mode-settings-profile",
  "teacher-game-mode-settings-snapshot",
  "game-mode-settings-change-request",
  "No live settings persistence",
  "Target-language-only progress preserved",
  "Support-language remains support-only",
  "Learning audio priority preserved",
  "Safe defaults cannot mutate",
];
const failures = [];

for (const mode of requiredModes) {
  requireText(data, `createProfile("${mode}"`, `Game settings profile missing mode: ${mode}`);
}

for (const boundary of requiredBoundaries) {
  requireText(data, boundary, `Game settings profiles must include boundary: ${boundary}`);
}

for (const marker of requiredStorageMarkers) {
  requireText(storageReadiness, marker, `Game settings storage readiness missing marker: ${marker}`);
}

for (const marker of requiredBackendContractMarkers) {
  requireText(backendContract, marker, `Game settings backend contract missing marker: ${marker}`);
}

requireText(panel, "GameModeSettingsProfilePanel", "Panel component must exist.");
requireText(panel, "Timer and difficulty profile", "Panel must expose timer and difficulty review.");
requireText(panel, "Global settings rules", "Panel must show global settings rules.");
requireText(panel, "Blocked actions", "Panel must show blocked actions.");
requireText(storagePanel, "GameModeSettingsStorageReadinessPanel", "Storage readiness panel component must exist.");
requireText(storagePanel, "Settings storage contract", "Storage readiness panel must expose settings storage contract copy.");
requireText(storagePanel, "Hosted write intent", "Storage readiness panel must show hosted write intent.");
requireText(storagePanel, "Local write intent", "Storage readiness panel must show local write intent.");
requireText(backendContractPanel, "GameModeSettingsBackendContractPanel", "Backend contract panel component must exist.");
requireText(backendContractPanel, "Backend contract map", "Backend contract panel must expose backend contract copy.");
requireText(backendContractPanel, "Migration candidate", "Backend contract panel must show migration candidate.");
requireText(backendContractPanel, "Migration spec", "Backend contract panel must show migration spec.");
requireText(teacherIntake, "sampleGameModeSettingsProfilePlan", "Teacher intake must import settings profile plan.");
requireText(teacherIntake, "GameModeSettingsProfilePanel", "Teacher intake must render settings profile panel.");
requireText(teacherIntake, "sampleGameModeSettingsStorageReadinessPlan", "Teacher intake must import settings storage readiness plan.");
requireText(teacherIntake, "GameModeSettingsStorageReadinessPanel", "Teacher intake must render settings storage readiness panel.");
requireText(teacherIntake, "sampleGameModeSettingsBackendContractPlan", "Teacher intake must import settings backend contract plan.");
requireText(teacherIntake, "GameModeSettingsBackendContractPanel", "Teacher intake must render settings backend contract panel.");
requireText(activeRoutes, "Game mode settings", "Active route verifier must check teacher intake game mode settings copy.");
requireText(activeRoutes, "Timer and difficulty profile", "Active route verifier must check timer/difficulty copy.");
requireText(activeRoutes, "Game mode settings storage readiness", "Active route verifier must check game mode settings storage readiness copy.");
requireText(activeRoutes, "Game settings backend map", "Active route verifier must check game mode settings backend contract copy.");
requireText(foundationGate, "verify:game-settings", "Foundation verification gate must list verify:game-settings.");
requireText(packageJson, '"verify:game-settings"', "package.json must expose verify:game-settings.");
requireText(packageJson, "npm run verify:game-settings", "verify:foundation must include verify:game-settings.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS game mode settings profiles cover ${requiredModes.length} active mode(s), ${requiredBoundaries.length} safety boundary/boundaries, ${requiredStorageMarkers.length} storage marker(s), and ${requiredBackendContractMarkers.length} backend contract marker(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
