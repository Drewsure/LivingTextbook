import { readFileSync } from "node:fs";

const rewardCatalog = readSource("../apps/web/src/features/rewards/rewardCatalog.ts");
const collectionPanel = readSource("../apps/web/src/features/rewards/CollectionGalleryPanel.tsx");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const activeRouteMatrix = readSource("../apps/web/src/data/sampleActiveRouteMatrix.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const collectionChecks = readSource("../docs/verification/COLLECTION_ROOM_ROUTE_CHECKS.md");
const principles = readSource("../docs/PRINCIPLES_AND_STANDARDS.md");
const failures = [];

const requiredRewardKinds = [
  "badge",
  "title",
  "cosmetic",
  "room-item",
  "pet-evolution",
  "power-up",
];

const requiredRoutes = [
  "/collection/demo-unit-1",
  "/collection/partner-demo-unit-1",
];

for (const kind of requiredRewardKinds) {
  requireText(rewardCatalog, `"${kind}"`, `Reward catalog type missing ${kind}.`);
}

for (const route of requiredRoutes) {
  requireText(activeRouteMatrix, route, `Active route matrix missing collection route ${route}.`);
  requireText(routeVerifier, route, `Active route verifier missing collection route ${route}.`);
  requireText(collectionChecks, route, `Collection checklist missing route ${route}.`);
}

requireText(rewardCatalog, "starter-room-star-mat", "Reward catalog must include a room-item preview.");
requireText(rewardCatalog, "companion-step-one", "Reward catalog must include a companion evolution preview.");
requireText(routeContracts, 'pattern: "/collection/[code]"', "Route contracts must define the collection route.");
requireText(routeContracts, "random pressure loops", "Route contract must reject random pressure loops.");
requireText(collectionPanel, "deterministic ownership loop", "Collection panel must state deterministic ownership.");
requireText(collectionPanel, "not a random pressure loop or paid gacha system", "Collection panel must reject random/gacha mechanics.");
requireText(collectionPanel, "Mastery unlocks only", "Collection panel must state mastery unlock rules.");
requireText(collectionPanel, "No random rewards", "Collection panel must show no-random status.");
requireText(principles, "Earned collection is the default engagement model.", "Principles must preserve earned collection standard.");
requireText(principles, "Surprise rewards are allowed only as child-safe bonus cosmetics.", "Principles must restrict surprise rewards.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS earned collection readiness covers ${requiredRewardKinds.length} reward kind(s) and ${requiredRoutes.length} route(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
