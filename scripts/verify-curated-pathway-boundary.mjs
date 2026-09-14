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
  "apps/web/src/features/teacher/TeacherSessionRosterIdentityCard.tsx",
  "apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx",
  "apps/web/src/features/teacher/TeacherSessionLaunchGateBoundaryPanel.tsx",
  "apps/web/src/features/teacher/TeacherSessionPreflightPanel.tsx",
  "apps/web/src/features/teacher/TeacherReportPackagePreviewPanel.tsx",
  "apps/web/src/features/teacher/TeacherProgressSummaryConcept.tsx",
];
const forbiddenSampleLookup = /(?:findSampleUnitGameOfferMap|sampleUnitGameOfferMap)/;
const failures = [];

for (const relativePath of reusableFiles) {
  const source = read(relativePath);
  if (forbiddenSampleLookup.test(source)) {
    failures.push(`${relativePath} reaches into sample offer-map fixtures`);
  }
  if (source.includes("@/features/teacher/teacherSessionMonitorTypes") || source.includes("@/features/teacher/teacherProgressSummaryTypes")) {
    failures.push(`${relativePath} reaches into a web-owned reporting type module`);
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
const launchPage = read("apps/web/src/app/teacher/sessions/[launchCode]/page.tsx");
const dashboard = read("apps/web/src/features/dashboard/DashboardOverview.tsx");
if (!launchBoundary.includes("findSampleUnitGameOfferMap(context.contentPackage.meta.packageId)")) {
  failures.push("sample launch resolver does not translate its package into an offer map");
}
if (!frontDoorBoundary.includes("findSampleUnitGameOfferMap(route.contentPackage.meta.packageId)")) {
  failures.push("sample front-door resolver does not translate its package into an offer map");
}
if (!launchBoundary.includes("findSampleClassRosterPlan(context.launchSession.launchCode)")) {
  failures.push("sample launch resolver does not translate its launch into a roster plan");
}
if (!launchPage.includes("rosterPlan={context.classRosterPlan}")) {
  failures.push("teacher session route does not inject its roster plan");
}
if (dashboard.split(/\r?\n/).some((line) => /^\s*import\s+(?!type\b).*from\s+["']@\/data\/sample/.test(line))) {
  failures.push("DashboardOverview has a runtime import from sample fixtures");
}
if (!dashboard.includes("offerMap?: UnitGameOfferMap") || !dashboard.includes("contentPackage: ContentPackage")) {
  failures.push("DashboardOverview does not accept provider-owned package and pathway data");
}
if (!dashboard.includes("@living-textbook/content-model/src/teacherReporting")) {
  failures.push("DashboardOverview does not consume the neutral teacher reporting contract");
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL curated pathway boundary: ${failure}`);
  process.exit(1);
}

console.log(`PASS curated pathway provider boundary covers ${reusableFiles.length} reusable feature files and both sample resolver boundaries.`);
