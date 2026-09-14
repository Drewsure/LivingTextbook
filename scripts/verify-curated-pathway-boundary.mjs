import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

function read(relativePath) {
  return readFileSync(resolve(repoRoot, relativePath), "utf8");
}

const reusableFiles = [
  "apps/web/src/features/game-shell/GameSequence.tsx",
  "apps/web/src/features/game-shell/components/PlayableGameRouteShell.tsx",
  "apps/web/src/features/student/components/RecommendedGameRoutesCard.tsx",
  "apps/web/src/features/access/FrontDoorEntryFlow.tsx",
];
const forbiddenSampleLookup = /(?:findSampleUnitGameOfferMap|sampleUnitGameOfferMap)/;
const failures = [];

for (const relativePath of reusableFiles) {
  if (forbiddenSampleLookup.test(read(relativePath))) {
    failures.push(`${relativePath} reaches into sample offer-map fixtures`);
  }
}

const routeCard = read("apps/web/src/features/student/components/RecommendedGameRoutesCard.tsx");
if (!routeCard.includes("offerMap?: UnitGameOfferMap")) {
  failures.push("RecommendedGameRoutesCard does not accept an injected offer map");
}
if (routeCard.includes("contentPackageId?: string")) {
  failures.push("RecommendedGameRoutesCard still exposes a package-id lookup prop");
}

const gameShell = read("apps/web/src/features/game-shell/components/PlayableGameRouteShell.tsx");
if (!gameShell.includes("offerMap?: UnitGameOfferMap") || !gameShell.includes("offerMap={offerMap}")) {
  failures.push("PlayableGameRouteShell does not preserve offer-map injection");
}

const launchBoundary = read("apps/web/src/data/sampleLaunchResolver.ts");
const frontDoorBoundary = read("apps/web/src/data/sampleTenantRouteRegistry.ts");
if (!launchBoundary.includes("findSampleUnitGameOfferMap(context.contentPackage.meta.packageId)")) {
  failures.push("sample launch resolver does not translate its package into an offer map");
}
if (!frontDoorBoundary.includes("findSampleUnitGameOfferMap(route.contentPackage.meta.packageId)")) {
  failures.push("sample front-door resolver does not translate its package into an offer map");
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL curated pathway boundary: ${failure}`);
  process.exit(1);
}

console.log(`PASS curated pathway provider boundary covers ${reusableFiles.length} reusable feature files and both sample resolver boundaries.`);
