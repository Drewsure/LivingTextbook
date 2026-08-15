import { readFileSync } from "node:fs";

const contentModelPath = new URL("../packages/content-model/src/index.ts", import.meta.url);
const catalogPath = new URL("../apps/web/src/features/game-shell/gameModeCatalog.ts", import.meta.url);
const scoringPath = new URL("../apps/web/src/features/game-shell/scoringProfiles.ts", import.meta.url);
const routeContractsPath = new URL("../apps/web/src/features/routes/routeContracts.ts", import.meta.url);

const contentModel = readFileSync(contentModelPath, "utf8");
const catalog = readFileSync(catalogPath, "utf8");
const scoring = readFileSync(scoringPath, "utf8");
const routeContracts = readFileSync(routeContractsPath, "utf8");

const gameModeMatch = contentModel.match(/export type GameModeId =([\s\S]*?);/);

if (!gameModeMatch) {
  console.error("FAIL Could not find GameModeId union in packages/content-model/src/index.ts.");
  process.exit(1);
}

const gameModes = Array.from(gameModeMatch[1].matchAll(/\|\s*"([^"]+)"/g), (match) => match[1]).sort();
const catalogIds = Array.from(catalog.matchAll(/id:\s*"([^"]+)"/g), (match) => match[1]).sort();
const duplicateCatalogIds = catalogIds.filter((mode, index) => catalogIds.indexOf(mode) !== index);
const missingCatalogIds = gameModes.filter((mode) => !catalogIds.includes(mode));
const extraCatalogIds = catalogIds.filter((mode) => !gameModes.includes(mode));
const missingScoringModes = gameModes.filter((mode) => !hasObjectKey(scoring, mode));
const missingRequiredAudio = gameModes.filter((mode) => {
  const item = getCatalogItemBody(catalog, mode);
  return !item.includes('audioRequirement: "required"');
});
const missingEngine = gameModes.filter((mode) => {
  const item = getCatalogItemBody(catalog, mode);
  return !/engineId:\s*"[^"]+"/.test(item);
});
const missingScoringProfile = gameModes.filter((mode) => {
  const item = getCatalogItemBody(catalog, mode);
  return !/scoringProfileId:\s*"[^"]+"/.test(item);
});
const requiredActiveGameRouteContracts = [
  { id: "flashcards", pattern: "/flashcards/[code]", helper: "getFlashcardsPath" },
  { id: "match-up", pattern: "/match/[code]", helper: "getMatchUpPath" },
  { id: "memory-match", pattern: "/memory/[code]", helper: "getMemoryMatchPath" },
  { id: "quiz", pattern: "/quiz/[code]", helper: "getQuizPath" },
  { id: "true-false", pattern: "/true-false/[code]", helper: "getTrueFalsePath" },
  { id: "type-answer", pattern: "/type-answer/[code]", helper: "getTypeAnswerPath" },
  { id: "balloon-pop", pattern: "/balloon/[code]", helper: "getBalloonPopPath" },
  { id: "sentence-builder", pattern: "/sentence/[code]", helper: "getSentenceBuilderPath" },
  { id: "speak-it", pattern: "/speak/[code]", helper: "getSpeakItPath" },
];

if (duplicateCatalogIds.length > 0) {
  console.error(`FAIL Duplicate game mode catalog id(s): ${[...new Set(duplicateCatalogIds)].join(", ")}`);
  process.exit(1);
}

if (missingCatalogIds.length > 0) {
  console.error(`FAIL GameModeId value(s) missing from gameModeCatalog: ${missingCatalogIds.join(", ")}`);
  process.exit(1);
}

if (extraCatalogIds.length > 0) {
  console.error(`FAIL Game catalog id(s) not present in GameModeId: ${extraCatalogIds.join(", ")}`);
  process.exit(1);
}

if (missingScoringModes.length > 0) {
  console.error(`FAIL Game mode scoring profile mapping missing for: ${missingScoringModes.join(", ")}`);
  process.exit(1);
}

if (missingRequiredAudio.length > 0) {
  console.error(`FAIL Game mode(s) must require learner audio: ${missingRequiredAudio.join(", ")}`);
  process.exit(1);
}

if (missingEngine.length > 0) {
  console.error(`FAIL Game mode engine mapping missing for: ${missingEngine.join(", ")}`);
  process.exit(1);
}

if (missingScoringProfile.length > 0) {
  console.error(`FAIL Game mode catalog scoring profile missing for: ${missingScoringProfile.join(", ")}`);
  process.exit(1);
}

for (const routeContract of requiredActiveGameRouteContracts) {
  if (!routeContracts.includes(`id: "${routeContract.id}"`)) {
    console.error(`FAIL Active game route contract missing id: ${routeContract.id}`);
    process.exit(1);
  }

  if (!routeContracts.includes(`pattern: "${routeContract.pattern}"`)) {
    console.error(`FAIL Active game route contract missing pattern: ${routeContract.pattern}`);
    process.exit(1);
  }

  if (!routeContracts.includes(`function ${routeContract.helper}`)) {
    console.error(`FAIL Active game route helper missing: ${routeContract.helper}`);
    process.exit(1);
  }
}

console.log(`PASS game mode catalog covers ${gameModes.length} shared GameModeId value(s).`);

function hasObjectKey(source, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\n)\\s*(?:"${escaped}"|${escaped}):\\s*"`, "m").test(source);
}

function getCatalogItemBody(source, mode) {
  const escaped = mode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`(?:^|\\n)\\s*(?:"${escaped}"|${escaped}):\\s*{([\\s\\S]*?)\\n\\s*},`, "m"));

  return match?.[1] ?? "";
}
