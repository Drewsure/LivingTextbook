import { readFileSync } from "node:fs";

const files = {
  packageJson: "package.json",
  routeList: "docs/ACTIVE_ROUTE_VERIFICATION_LIST.md",
  activeRouteVerifier: "scripts/verify-active-routes.mjs",
  prototypePage: "apps/web/src/app/teacher/prototypes/[tenantId]/page.tsx",
  generatorPage: "apps/web/src/app/teacher/generator/[tenantId]/page.tsx",
  gameReadinessPage: "apps/web/src/app/teacher/game-readiness/page.tsx",
  foundationGate: "apps/web/src/data/sampleFoundationVerificationGate.ts",
  verificationIndex: "docs/verification/README.md",
  buildSessions: "docs/BUILD_SESSIONS.md",
};

const sources = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, readFileSync(path, "utf8")]),
);

const tenantIds = ["sample-publisher", "ministar"];
const prototypeRoutes = tenantIds.map((tenantId) => `/teacher/prototypes/${tenantId}`);
const generatorRoutes = tenantIds.map((tenantId) => `/teacher/generator/${tenantId}`);
const prototypePageMarkers = [
  "Prototype handoff review workbench",
  "Z.ai and outside prototype evidence before integration",
  "Review-only",
  "No app file writes",
  "No scoring mutation",
  "no route creation",
  "no audio manifest mutation",
  "no package promotion",
  "no student",
  "assignment",
  "Z.ai prototype intake waits for the Codex integration gate",
];
const generatorLinkMarkers = [
  "const prototypeRoute = `/teacher/prototypes/${tenantId}`",
  "Open focused prototype review",
  "href={prototypeRoute}",
];
const routeVerifierMarkers = [
  "Open focused prototype review",
  "Prototype handoff review workbench",
  "No app file writes",
  "No scoring mutation",
  "No route creation",
];
const packageMarkers = ['"verify:prototype-review"', "npm run verify:prototype-review"];
const foundationGateMarkers = ["npm run verify:prototype-review", "Prototype review readiness"];

const failures = [];

for (const route of prototypeRoutes) {
  requireText(sources.routeList, `http://127.0.0.1:3000${route}`, `Active route list must include ${route}.`);
  requireText(sources.activeRouteVerifier, route, `Active route verifier must protect ${route}.`);
  requireText(sources.gameReadinessPage, route, `Game readiness workbench must link to ${route}.`);
}

for (const route of generatorRoutes) {
  requireText(sources.routeList, `http://127.0.0.1:3000${route}`, `Active route list must include ${route}.`);
  requireText(sources.activeRouteVerifier, route, `Active route verifier must protect ${route}.`);
}

for (const marker of prototypePageMarkers) {
  requireText(sources.prototypePage, marker, `Prototype review page must keep marker: ${marker}`);
}

for (const marker of generatorLinkMarkers) {
  requireText(sources.generatorPage, marker, `Generator route must keep prototype review link marker: ${marker}`);
}

for (const marker of routeVerifierMarkers) {
  requireText(sources.activeRouteVerifier, marker, `Route verifier must keep prototype marker: ${marker}`);
}

for (const marker of packageMarkers) {
  requireText(sources.packageJson, marker, `package.json must expose foundation marker: ${marker}`);
}

for (const marker of foundationGateMarkers) {
  requireText(sources.foundationGate, marker, `Teacher foundation gate must expose marker: ${marker}`);
}

requireText(
  sources.verificationIndex,
  "npm run verify:prototype-review",
  "Verification index must list npm run verify:prototype-review.",
);
requireText(
  sources.buildSessions,
  "npm run verify:prototype-review",
  "Build sessions must tell future sessions when to run the prototype review verifier.",
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  console.error(`${failures.length} prototype review readiness check(s) failed.`);
  process.exit(1);
}

console.log(
  `PASS prototype review readiness keeps ${prototypeRoutes.length} route(s), ${generatorRoutes.length} generator route(s), and ${prototypePageMarkers.length} blocked marker(s) guarded.`,
);

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
