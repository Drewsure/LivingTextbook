import { readFileSync } from "node:fs";

const bundlePlan = readSource("../apps/web/src/data/sampleLocalBundlePlan.ts");
const deploymentPreflight = readSource("../apps/web/src/data/sampleLocalDeploymentPreflight.ts");
const localPreviewPanel = readSource("../apps/web/src/features/deployment/LocalCompanionPackagePreviewPanel.tsx");
const activeRoutes = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");

const failures = [];
const expectedBundles = ["ministar-level-1-unit-1-demo", "sample-publisher-unit-1-planning"];
const requiredLocalGameModes = ["flashcards", "match-up", "label-it", "memory-match", "quiz", "true-false", "type-answer", "sentence-builder", "speak-it"];
const requiredBlockedPreflightChecks = ["media-bundle", "installer-update", "local-reporting", "offline-access"];
const requiredReleaseGateItems = [
  "media-rights-checksums",
  "installer-update-path",
  "backup-restore-export",
  "qr-deeplink-fallback",
  "game-audio-reporting",
  "school-access-policy",
];
const snapshotFields = [
  "offline_ready_allowed",
  "content_package_path",
  "media_root",
  "requires_hosted_redirect",
  "ai_tutor_enabled",
  "assets",
  "routes",
  "games",
  "artifacts",
  "handoff",
];
const requiredLocalFallbackPaths = [
  "/enter/ministar",
  "/launch/demo-unit-1",
  "/activities/demo-unit-1",
  "/media/playlist-ministar-l1-u1-greetings",
  "/enter/sample-publisher",
  "/launch/partner-demo-unit-1",
  "/activities/partner-demo-unit-1",
  "/media/playlist-sample-publisher-l1-u1-routines",
];
const requiredLocalGamePaths = [
  "/flashcards/demo-unit-1",
  "/match/demo-unit-1",
  "/label-it/demo-unit-1",
  "/memory/demo-unit-1",
  "/flashcards/partner-demo-unit-1",
  "/match/partner-demo-unit-1",
  "/label-it/partner-demo-unit-1",
  "/memory/partner-demo-unit-1",
  "/type-answer/partner-demo-unit-1",
];

for (const bundleId of expectedBundles) {
  requireText(bundlePlan, `bundleId: "${bundleId}"`, `Local bundle manifest missing: ${bundleId}`);
}

for (const mode of requiredLocalGameModes) {
  requireText(bundlePlan, `gameMode: "${mode}"`, `Local bundle game route missing mode: ${mode}`);
}

for (const checkId of requiredBlockedPreflightChecks) {
  requireText(deploymentPreflight, `checkId: "${checkId}"`, `Local deployment preflight missing check: ${checkId}`);
}

for (const gateId of requiredReleaseGateItems) {
  requireText(deploymentPreflight, `gateId: "${gateId}"`, `Local release gate missing item: ${gateId}`);
}

for (const field of snapshotFields) {
  requireText(localPreviewPanel, field, `Local manifest snapshot missing field: ${field}`);
}

for (const fallbackPath of requiredLocalFallbackPaths) {
  requireText(bundlePlan, `localFallbackPath: "${fallbackPath}"`, `Local bundle missing route fallback path: ${fallbackPath}`);
}

for (const gamePath of requiredLocalGamePaths) {
  requireText(bundlePlan, `localPath: "${gamePath}"`, `Local bundle missing local game path: ${gamePath}`);
}

requireText(activeRoutes, "http://127.0.0.1:3000/local/sample-publisher", "Active route list missing local companion preview route.");
requireText(bundlePlan, "content-package.json", "Local bundle must keep a content package artifact path.");
requireText(bundlePlan, "routes/qr-registry.json", "Local bundle must keep a QR registry artifact path.");
requireText(bundlePlan, "games/game-routes.json", "Local bundle must keep a game route manifest artifact path.");
requireText(bundlePlan, 'targetType: "activity-hub"', "Local bundle must include curated activity hub fallback routes.");
requireText(bundlePlan, "policy/report-policy.json", "Local bundle must keep a report policy artifact path.");
requireText(bundlePlan, "checksums.json", "Local bundle must keep checksum handoff requirements.");
requireText(bundlePlan, "aiTutorEnabled: false", "Local bundle AI Tutor must default off.");
requireText(deploymentPreflight, "Previewable only. Do not hand off as a closed local product yet.", "Local release gate must block closed handoff.");

if (bundlePlan.includes("offlineReady: true") && (bundlePlan.includes('rightsStatus: "unknown"') || bundlePlan.includes("checksumReady: false"))) {
  failures.push("Local bundle cannot be offline-ready while media rights are unknown or checksums are missing.");
}

if (bundlePlan.includes('readiness: "offline-ready"') && deploymentPreflight.includes('status: "blocked"')) {
  failures.push("Local bundle cannot be marked offline-ready while deployment preflight has blocked checks.");
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS local bundle readiness covers ${expectedBundles.length} bundle manifest(s), ${requiredLocalGameModes.length} local game mode(s), and ${requiredReleaseGateItems.length} release gate item(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
