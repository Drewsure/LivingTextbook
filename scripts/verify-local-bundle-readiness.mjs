import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const bundlePlan = readSource("../apps/web/src/data/sampleLocalBundlePlan.ts");
const deploymentPreflight = readSource("../apps/web/src/data/sampleLocalDeploymentPreflight.ts");
const mediaBundleIntegrity = readSource("../apps/web/src/data/sampleMediaBundleIntegrity.ts");
const mediaBundleIntegrityPanel = readSource("../apps/web/src/features/deployment/MediaBundleIntegrityPanel.tsx");
const pwaOfflineReadiness = readSource("../apps/web/src/data/samplePwaOfflineReadiness.ts");
const pwaOfflinePanel = readSource("../apps/web/src/features/deployment/PwaOfflineReadinessPanel.tsx");
const localPreviewPanel = readSource("../apps/web/src/features/deployment/LocalCompanionPackagePreviewPanel.tsx");
const resolutionPanel = readSource("../apps/web/src/features/deployment/LocalBundleResolutionPanel.tsx");
const assetEvidencePanel = readSource("../apps/web/src/features/deployment/LocalBundleAssetEvidencePanel.tsx");
const assetEvidenceContract = readSource("../packages/content-model/src/localBundleAssetEvidence.ts");
const handoffContract = readSource("../packages/content-model/src/localBundleHandoff.ts");
const handoffData = readSource("../apps/web/src/data/localBundleHandoff.ts");
const handoffReviewContract = readSource("../packages/content-model/src/localBundleHandoffReview.ts");
const handoffReviewRoute = readSource("../apps/web/src/app/api/persistence/local-handoff/route.ts");
const handoffReviewAdapter = readSource("../apps/web/src/server/persistence/localBundleHandoffReviewAdapter.ts");
const providerApprovalContract = readSource("../packages/content-model/src/localBundleProviderApproval.ts");
const activeRoutes = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");

const failures = [];
const expectedBundles = ["ministar-level-1-unit-1-demo", "sample-publisher-unit-1-planning"];
const requiredLocalGameModes = ["flashcards", "match-up", "label-it", "memory-match", "quiz", "true-false", "balloon-pop", "type-answer", "spelling-practice", "fill-in-the-blank", "sentence-builder", "speak-it"];
const requiredBlockedPreflightChecks = ["media-bundle", "installer-update", "local-reporting", "offline-access"];
const requiredPwaOfflineLanes = [
  "installable-shell",
  "service-worker-cache",
  "offline-media-bundle",
  "offline-learner-data",
  "qr-local-fallback",
];
const requiredPwaOfflineMarkers = [
  "PWA and offline readiness",
  "Manifest available",
  "Service worker not enabled yet",
  "Cache strategy not approved yet",
  "Offline media bundle not approved yet",
  "Rights and versioned manifest required",
  "Learning audio priority preserved",
  "Local companion fallback required",
  "QR alias compatibility required",
  "No offline-ready claim",
  "No service worker registration",
  "No cache mutation",
  "No media pre-cache",
  "No local installer export",
  "No student data offline storage",
  "No background sync",
];
const requiredMediaBundleIntegrityLanes = [
  "bundle-size-budget",
  "checksum-manifest",
  "media-deduplication",
  "yearly-edition-replacement",
  "learning-audio-priority",
];
const requiredMediaBundleIntegrityMarkers = [
  "Media bundle integrity readiness",
  "Media package engineering gate",
  "Bundle size budget",
  "Checksum manifest",
  "Duplicate media detection",
  "Streaming/local fallback",
  "Yearly edition replacement",
  "Learning audio priority preserved",
  "Asset rights proof first",
  "No package-size approval",
  "No checksum-free bundle",
  "No direct folder activation",
  "No uncompressed video handoff",
  "No media-only progress",
  "No background music overriding learning audio",
  "No offline-ready claim",
  "No local installer export",
];
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
const requiredResolutionMarkers = [
  "Read-only local bundle resolution rehearsal",
  "Manifest-declared QR fallbacks",
  "Manifest-declared local assets",
  "No file access",
  "No bundle write",
  "No offline activation",
  "No learner-data persistence",
  "createReadOnlyLocalBundleResolver",
];
const requiredLocalAssetKinds = ["audio", "video", "image"];
const requiredSupportingAssetPaths = [
  "posterPath: \"media/posters/hello-friends.jpg\"",
  "transcriptPath: \"content/captions/hello-friends.en.vtt\"",
  "transcriptPath: \"content/transcripts/greetings-chant.en.txt\"",
];
const requiredAssetEvidenceMarkers = [
  "Reviewed asset evidence handoff",
  "Rights evidence",
  "Checksum",
  "Scan",
  "Target mapping",
  "Accessibility evidence",
  "No live upload",
  "No student-facing promotion",
];
const requiredAssetEvidenceContractMarkers = [
  "evaluateLocalBundleAssetEvidence",
  "rightsReady",
  "checksumReady",
  "scanReady",
  "targetMappingReady",
  "accessibilityReady",
  "handoffReady",
  "evaluateLocalBundleAssetEvidenceSet",
];
const requiredSnapshotAssetGateMarkers = [
  "assetEvidenceBlockedCount",
  "asset_evidence",
  "handoff_ready",
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
  "/quiz/demo-unit-1",
  "/true-false/demo-unit-1",
  "/balloon/demo-unit-1",
  "/type-answer/demo-unit-1",
  "/spelling/demo-unit-1",
  "/fill/demo-unit-1",
  "/sentence/demo-unit-1",
  "/speak/demo-unit-1",
  "/flashcards/partner-demo-unit-1",
  "/match/partner-demo-unit-1",
  "/label-it/partner-demo-unit-1",
  "/memory/partner-demo-unit-1",
  "/quiz/partner-demo-unit-1",
  "/true-false/partner-demo-unit-1",
  "/balloon/partner-demo-unit-1",
  "/type-answer/partner-demo-unit-1",
  "/spelling/partner-demo-unit-1",
  "/fill/partner-demo-unit-1",
  "/sentence/partner-demo-unit-1",
  "/speak/partner-demo-unit-1",
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

for (const laneId of requiredPwaOfflineLanes) {
  requireText(pwaOfflineReadiness, `laneId: "${laneId}"`, `PWA offline readiness missing lane: ${laneId}`);
}

for (const marker of requiredPwaOfflineMarkers) {
  requireText(pwaOfflineReadiness, marker, `PWA offline readiness missing marker: ${marker}`);
}

requireText(pwaOfflinePanel, "No offline-ready claim", "PWA offline panel must render offline claim blocker.");
requireText(pwaOfflinePanel, "Globally blocked actions", "PWA offline panel must render global blocked actions.");
requireText(pwaOfflinePanel, "Required before live", "PWA offline panel must render live requirements.");
requireText(mediaBundleIntegrityPanel, "Media package engineering gate", "Media bundle integrity panel must render its gate label.");
requireText(mediaBundleIntegrityPanel, "Required before bundle", "Media bundle integrity panel must render required-before-bundle checks.");
requireText(mediaBundleIntegrityPanel, "Globally blocked actions", "Media bundle integrity panel must render global blockers.");
requirePattern(
  pwaOfflineReadiness,
  /laneId: "service-worker-cache"[\s\S]*?status: "blocked"[\s\S]*?Cache strategy not approved yet/,
  "PWA service worker and cache policy lane must remain blocked until cache strategy is approved.",
);
requirePattern(
  pwaOfflineReadiness,
  /laneId: "offline-media-bundle"[\s\S]*?status: "blocked"[\s\S]*?Rights and versioned manifest required/,
  "PWA offline media bundle lane must remain blocked until rights and versioned manifest evidence exists.",
);
requirePattern(
  pwaOfflineReadiness,
  /laneId: "offline-learner-data"[\s\S]*?status: "blocked"[\s\S]*?No raw learner audio or transcript storage/,
  "PWA offline learner data lane must remain blocked until privacy and storage evidence exists.",
);

for (const laneId of requiredMediaBundleIntegrityLanes) {
  requireText(mediaBundleIntegrity, `laneId: "${laneId}"`, `Media bundle integrity missing lane: ${laneId}`);
}

for (const marker of requiredMediaBundleIntegrityMarkers) {
  requireText(mediaBundleIntegrity, marker, `Media bundle integrity missing marker: ${marker}`);
}

requirePattern(
  mediaBundleIntegrity,
  /laneId: "bundle-size-budget"[\s\S]*?status: "blocked"[\s\S]*?No package-size approval/,
  "Media bundle size budget must remain blocked until package-size approval exists.",
);
requirePattern(
  mediaBundleIntegrity,
  /laneId: "checksum-manifest"[\s\S]*?status: "blocked"[\s\S]*?No checksum-free bundle/,
  "Media bundle checksum manifest must remain blocked until checksums exist.",
);
requirePattern(
  mediaBundleIntegrity,
  /laneId: "learning-audio-priority"[\s\S]*?status: "ready"[\s\S]*?No media-only progress/,
  "Media bundle integrity must keep learning audio priority ready and media-only progress blocked.",
);

for (const gateId of requiredReleaseGateItems) {
  requireText(deploymentPreflight, `gateId: "${gateId}"`, `Local release gate missing item: ${gateId}`);
}

for (const field of snapshotFields) {
  requireText(localPreviewPanel, field, `Local manifest snapshot missing field: ${field}`);
}

for (const marker of requiredResolutionMarkers) {
  requireText(resolutionPanel, marker, `Local bundle resolution preview missing marker: ${marker}`);
}

for (const kind of requiredLocalAssetKinds) {
  requireText(bundlePlan, `kind: "${kind}"`, `Local bundle sample missing asset kind: ${kind}`);
}

for (const path of requiredSupportingAssetPaths) {
  requireText(bundlePlan, path, `Local bundle sample missing supporting asset path: ${path}`);
}

for (const marker of requiredAssetEvidenceMarkers) {
  requireText(assetEvidencePanel, marker, `Local asset evidence panel missing marker: ${marker}`);
}

for (const marker of requiredAssetEvidenceContractMarkers) {
  requireText(assetEvidenceContract, marker, `Local asset evidence contract missing marker: ${marker}`);
}

for (const marker of requiredSnapshotAssetGateMarkers) {
  requireText(localPreviewPanel, marker, `Local bundle snapshot missing asset evidence gate: ${marker}`);
}

for (const marker of ["LocalBundleHandoffPacket", "validateLocalBundleHandoffPacket", "offlineReadyAllowed", "package-write", "offline-activation", "student-promotion"]) {
  requireText(handoffContract, marker, `Local bundle handoff contract missing marker: ${marker}`);
}
for (const marker of ["buildLocalBundleHandoffPacket", "Local package evidence handoff", "Writes blocked"]) {
  requireText(handoffData + localPreviewPanel, marker, `Local bundle handoff review missing marker: ${marker}`);
}

for (const fallbackPath of requiredLocalFallbackPaths) {
  requireText(bundlePlan, `localFallbackPath: "${fallbackPath}"`, `Local bundle missing route fallback path: ${fallbackPath}`);
}

for (const gamePath of requiredLocalGamePaths) {
  requireText(bundlePlan, `localPath: "${gamePath}"`, `Local bundle missing local game path: ${gamePath}`);
}

requireText(activeRoutes, "http://127.0.0.1:3000/local/ministar", "Active route list missing MiniStar local companion preview route.");
requireText(activeRoutes, "http://127.0.0.1:3000/local/sample-publisher", "Active route list missing sample publisher local companion preview route.");
requireText(handoffReviewContract, "validateLocalBundleHandoffReviewRequest", "Local handoff review contract must validate requests.");
requireText(handoffReviewRoute, "hasTeacherOperationsReadAuthorization(request, requestShape.tenantId)", "Local handoff review route must require tenant-scoped teacher authorization.");
requireText(handoffReviewRoute, "records: result.record ? [result.record] : []", "Local handoff review route must expose only mapped adapter records.");
requireText(handoffReviewAdapter, "no package record is synthesized", "Local handoff review adapter must not synthesize package records.");
requireText(handoffReviewAdapter, "unconfiguredProvider", "Local handoff review must expose an explicit unconfigured provider adapter.");
requireText(handoffReviewAdapter, "record: null", "Local handoff review provider must return no record before provider approval.");
requireText(providerApprovalContract, "validateLocalBundleProviderApprovalPacket", "Local provider approval must validate evidence packets.");
requireText(providerApprovalContract, "selectedProvider: null", "Local provider approval must keep provider selection uncommitted.");
requireText(providerApprovalContract, "providerActivationAllowed: false", "Local provider approval must block activation.");
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

if (pwaOfflineReadiness.includes("serviceWorkerRegistered: true") || pwaOfflineReadiness.includes("offlineReady: true")) {
  failures.push("PWA offline readiness may not register service workers or claim offline-ready status in the foundation gate.");
}

if (mediaBundleIntegrity.includes("bundleWriteAllowed: true") || mediaBundleIntegrity.includes("mediaPrecacheAllowed: true")) {
  failures.push("Media bundle integrity may not enable bundle writes or media precache in the foundation gate.");
}

if (bundlePlan.includes('engineId: "entry"') || bundlePlan.includes('engineId: "speaking-listening"')) {
  failures.push("Local bundle games must use shared ParentEngine ids, not local-only aliases or game family ids.");
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS local bundle readiness covers ${expectedBundles.length} bundle manifest(s), ${requiredLocalGameModes.length} local game mode(s), ${requiredReleaseGateItems.length} release gate item(s), ${requiredPwaOfflineLanes.length} PWA/offline lane(s), and ${requiredMediaBundleIntegrityLanes.length} media integrity lane(s).`,
);
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-bundle-manifest-runtime.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-bundle-resolver-runtime.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-bundle-handoff-runtime.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-bundle-handoff-storage.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-bundle-persistence-admission.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-bundle-handoff-review-access.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-bundle-handoff-adapter.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-bundle-provider-approval.mjs", import.meta.url))], {
  stdio: "inherit",
});

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function requirePattern(source, pattern, message) {
  if (!pattern.test(source)) {
    failures.push(message);
  }
}
