import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/front-door/[unitId]/page.tsx"), "utf8");
const flow = readFileSync(resolve(root, "apps/web/src/features/game-shell/entry/FlashcardDemoFlow.tsx"), "utf8");
const routes = readFileSync(resolve(root, "apps/web/src/features/student/components/RecommendedGameRoutesCard.tsx"), "utf8");
const contracts = readFileSync(resolve(root, "apps/web/src/features/routes/routeContracts.ts"), "utf8");

for (const marker of [
  "readLocalPilotPackageContent",
  "FlashcardDemoFlow",
  "createLaunchSession",
  "getInitialStudentProgression",
  "entryMode: \"flashcards\"",
  "recommendedNextModes: [\"memory-match\"]",
  "getLocalPilotPackageMemoryMatchPath",
  "audioCues={contentResult.contentPackage.audioCues}",
  "assistLanguagePlan=",
  "accessMode: \"teacher-qr\"",
]) {
  if (!page.includes(marker)) throw new Error(`Local package front door is missing: ${marker}`);
}

for (const marker of [
  "routeHrefForMode?: (mode: GameModeId, defaultHref: string) => string",
  "activityHubHref?: string",
  "routeHrefForMode={routeHrefForMode}",
  "activityHubHref={activityHubHref}",
]) {
  if (!flow.includes(marker) && !routes.includes(marker)) throw new Error(`Local package front door routing seam is missing: ${marker}`);
}

for (const marker of ["getLocalPilotPackageFrontDoorPath", "/front-door/"]) {
  if (!contracts.includes(marker)) throw new Error(`Local package front door contract is missing: ${marker}`);
}

for (const forbidden of ["resolveSampleLaunchContext", "studentRecords", "fetch(", "learnerRecords"]) {
  if (page.includes(forbidden)) throw new Error(`Local package front door must not use forbidden parallel path: ${forbidden}`);
}

console.log("PASS local package front door reuses canonical flashcards, audio, assist, progression, and package-scoped Memory Match contracts.");
