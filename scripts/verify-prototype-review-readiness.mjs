import { readFileSync } from "node:fs";

const files = {
  packageJson: "package.json",
  routeList: "docs/ACTIVE_ROUTE_VERIFICATION_LIST.md",
  activeRouteVerifier: "scripts/verify-active-routes.mjs",
  prototypePage: "apps/web/src/app/teacher/prototypes/[tenantId]/page.tsx",
  generatorPage: "apps/web/src/app/teacher/generator/[tenantId]/page.tsx",
  gameReadinessPage: "apps/web/src/app/teacher/game-readiness/page.tsx",
  prototypeIntakeAlert: "apps/web/src/data/samplePrototypeIntakeAlert.ts",
  prototypeIntakeAlertPanel: "apps/web/src/features/game-offers/PrototypeIntakeAlertPanel.tsx",
  prototypeIntakeQueue: "apps/web/src/data/samplePrototypeIntakeQueue.ts",
  prototypeIntakeQueuePanel: "apps/web/src/features/game-offers/PrototypeIntakeQueuePanel.tsx",
  prototypeIntakeReadinessSummary: "apps/web/src/data/samplePrototypeIntakeReadinessSummary.ts",
  prototypeIntakeReadinessSummaryPanel: "apps/web/src/features/game-offers/PrototypeIntakeReadinessSummaryPanel.tsx",
  prototypeIntakeStorageGuard: "apps/web/src/data/samplePrototypeIntakeStorageGuard.ts",
  prototypeIntakeStorageGuardPanel: "apps/web/src/features/game-offers/PrototypeIntakeStorageGuardPanel.tsx",
  prototypeReturnPackageChecklist: "apps/web/src/data/samplePrototypeReturnPackageChecklist.ts",
  prototypeReturnPackageChecklistPanel: "apps/web/src/features/game-offers/PrototypeReturnPackageChecklistPanel.tsx",
  evidencePacketFlows: "apps/web/src/data/sampleEvidencePacketFlows.ts",
  evidencePacketFlowPanel: "apps/web/src/features/evidence/EvidencePacketFlowPanel.tsx",
  backendSchemaDraft: "apps/web/src/data/sampleBackendSchemaDraft.ts",
  backendMigrationCandidates: "apps/web/src/data/sampleBackendMigrationCandidates.ts",
  backendMigrationSpecs: "apps/web/src/data/sampleBackendMigrationSpecs.ts",
  persistencePlan: "apps/web/src/data/samplePersistencePlan.ts",
  persistenceAdapterPlan: "apps/web/src/data/samplePersistenceAdapterPlan.ts",
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
  "Z.ai prototype intake alert",
  "Codex alert required",
  "Prototype intake queue",
  "Outside game inventory before Codex review",
  "Prototype intake readiness",
  "Codex alert not issued",
  "Prototype intake storage guard",
  "Storage contract before outside game intake",
  "Prototype intake evidence packet flow",
  "No prototype upload or import",
  "Returned prototype package checklist",
  "No archive import",
];
const prototypeIntakeAlertMarkers = [
  "Z.ai prototype intake alert",
  "Codex will explicitly alert the user",
  "Parent engine readiness is accepted for the target game family",
  "JSON fixture replay",
  "Standard event replay",
  "Target-language audio coverage",
  "Deterministic scoring replay",
  "Phaser wrapper review",
  "No direct app file writes",
  "No route creation",
  "No reward inventory mutation",
  "No package promotion",
  "Codex owns architecture",
];
const packageMarkers = ['"verify:prototype-review"', "npm run verify:prototype-review"];
const foundationGateMarkers = ["npm run verify:prototype-review", "Prototype review readiness"];
const prototypeIntakeQueueMarkers = [
  "Prototype intake queue",
  "Outside game inventory before Codex review",
  "intake-ministar-sentence-builder-dom",
  "intake-ministar-balloon-pop-phaser",
  "intake-ministar-whack-a-mole-phaser",
  "intake-sample-publisher-fill-blank-dom",
  "Drewsure/ministar-lab",
  "sentence-builder",
  "balloon-pop",
  "whack-a-mole",
  "fill-in-the-blank",
  "Phaser wrapper review",
  "No active route replacement",
  "filterPrototypeIntakeQueueByTenant",
];
const prototypeIntakeQueueStorageMarkers = [
  "prototype_intake_queue_item",
  "prototype_intake_queue_item_id",
  "m098-prototype-intake-queue-storage",
  "spec-prototype-intake-queue-item",
  "prototype-intake-queue-item-record",
  "prototype-intake-queue-item-boundary",
  "hosted-prototype-intake-queue-item-write",
  "local-prototype-intake-queue-item-write",
  "preservesPrototypeIntakeQueueItem: true",
  "blocksPrototypeIntakeDirectImport: true",
  "blocksPrototypeIntakeRouteReplacement: true",
];
const prototypeReturnPackageChecklistStorageMarkers = [
  "prototype_return_package_checklist",
  "prototype_return_package_checklist_id",
  "m099-prototype-return-package-checklist-storage",
  "spec-prototype-return-package-checklist",
  "prototype-return-package-checklist-record",
  "prototype-return-package-checklist-boundary",
  "hosted-prototype-return-package-checklist-write",
  "local-prototype-return-package-checklist-write",
  "preservesPrototypeReturnPackageChecklist: true",
  "requiresPrototypeReturnSourceManifest: true",
  "requiresPrototypeReturnFixtureFolder: true",
  "blocksPrototypeReturnArchiveImport: true",
];
const prototypeIntakeReadinessSummaryMarkers = [
  "Prototype intake readiness summary",
  "prototype-intake-readiness-summary-foundation",
  "Codex alert not issued",
  "No Codex green-light alert yet",
  "Returned prototype package",
  "Replay reports",
  "Codex wrapper decision",
  "No app file import",
  "No active route replacement",
  "No student assignment",
  "PrototypeIntakeReadinessSummaryPanel",
];
const prototypeIntakeStorageGuardMarkers = [
  "Prototype intake storage guard",
  "Storage contract before outside game intake",
  "prototype-intake-queue-storage-contract",
  "prototype-intake-queue-item-record",
  "prototype-intake-queue-item-boundary",
  "hosted-prototype-intake-queue-item-write",
  "local-prototype-intake-queue-item-write",
  "m098-prototype-intake-queue-storage",
  "spec-prototype-intake-queue-item",
  "No direct prototype import",
  "No active route replacement",
  "No scoring profile mutation",
  "No support-language progress trigger",
];
const prototypeIntakeEvidenceFlowMarkers = [
  "samplePrototypeIntakeEvidencePacketFlow",
  "Prototype intake evidence packet flow",
  "prototype-intake-evidence-packet-flow",
  "Source snapshot packet",
  "Fixture replay packet",
  "Event and scoring packet",
  "Target-language audio packet",
  "Mobile accessibility packet",
  "Wrapper boundary packet",
  "No prototype upload or import",
  "No active route replacement",
  "No support-language progress trigger",
  "EvidencePacketFlowPanel",
];
const prototypeReturnPackageChecklistMarkers = [
  "Returned prototype package checklist",
  "prototype-return-package-ministar-sentence-builder",
  "prototype-return-package-ministar-balloon-pop",
  "prototype-return-package-sample-publisher-fill-blank",
  "Source archive manifest",
  "Reviewed fixture folder",
  "Event and scoring replay",
  "Target-language audio coverage map",
  "Mobile accessibility capture",
  "Wrapper boundary notes",
  "No archive import",
  "No direct file copy into apps/web",
  "No active route replacement",
  "No student assignment",
  "filterPrototypeReturnPackageChecklistsByTenant",
  "PrototypeReturnPackageChecklistPanel",
];

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

for (const marker of prototypeIntakeAlertMarkers) {
  requireText(
    sources.prototypeIntakeAlert + sources.prototypeIntakeAlertPanel + sources.gameReadinessPage,
    marker,
    `Prototype intake alert must keep marker: ${marker}`,
  );
}

for (const marker of prototypeIntakeQueueMarkers) {
  requireText(
    sources.prototypeIntakeQueue + sources.prototypeIntakeQueuePanel + sources.gameReadinessPage + sources.prototypePage,
    marker,
    `Prototype intake queue must keep marker: ${marker}`,
  );
}

for (const marker of prototypeIntakeQueueStorageMarkers) {
  requireText(
    sources.backendSchemaDraft +
      sources.backendMigrationCandidates +
      sources.backendMigrationSpecs +
      sources.persistencePlan +
      sources.persistenceAdapterPlan,
    marker,
    `Prototype intake queue storage must keep marker: ${marker}`,
  );
}

for (const marker of prototypeReturnPackageChecklistStorageMarkers) {
  requireText(
    sources.backendSchemaDraft +
      sources.backendMigrationCandidates +
      sources.backendMigrationSpecs +
      sources.persistencePlan +
      sources.persistenceAdapterPlan,
    marker,
    `Prototype return package checklist storage must keep marker: ${marker}`,
  );
}

for (const marker of prototypeIntakeReadinessSummaryMarkers) {
  requireText(
    sources.prototypeIntakeReadinessSummary +
      sources.prototypeIntakeReadinessSummaryPanel +
      sources.gameReadinessPage +
      sources.prototypePage,
    marker,
    `Prototype intake readiness summary must keep marker: ${marker}`,
  );
}

for (const marker of prototypeIntakeStorageGuardMarkers) {
  requireText(
    sources.prototypeIntakeStorageGuard +
      sources.prototypeIntakeStorageGuardPanel +
      sources.gameReadinessPage +
      sources.prototypePage,
    marker,
    `Prototype intake storage guard must keep marker: ${marker}`,
  );
}

for (const marker of prototypeIntakeEvidenceFlowMarkers) {
  requireText(
    sources.evidencePacketFlows + sources.evidencePacketFlowPanel + sources.gameReadinessPage + sources.prototypePage,
    marker,
    `Prototype intake evidence flow must keep marker: ${marker}`,
  );
}

for (const marker of prototypeReturnPackageChecklistMarkers) {
  requireText(
    sources.prototypeReturnPackageChecklist +
      sources.prototypeReturnPackageChecklistPanel +
      sources.gameReadinessPage +
      sources.prototypePage,
    marker,
    `Prototype return package checklist must keep marker: ${marker}`,
  );
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
