import { readFileSync } from "node:fs";

const guide = readSource("../apps/web/src/data/sampleDeploymentDecisionGuide.ts");
const guidePanel = readSource("../apps/web/src/features/deployment/DeploymentDecisionGuidePanel.tsx");
const deploymentPage = readSource("../apps/web/src/app/teacher/deployment/page.tsx");
const teacherPage = readSource("../apps/web/src/app/teacher/page.tsx");
const appShell = readSource("../apps/web/src/components/layout/AppShell.tsx");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const activeRouteMatrix = readSource("../apps/web/src/data/sampleActiveRouteMatrix.ts");
const activeRouteVerifier = readSource("./verify-active-routes.mjs");
const activeRouteList = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");
const principles = readSource("../docs/PRINCIPLES_AND_STANDARDS.md");
const buildSessions = readSource("../docs/BUILD_SESSIONS.md");
const decisionRegister = readSource("../docs/DECISION_REGISTER.md");
const decisionRecord = readSource("../docs/decision-register/DR-550-deployment-decision-workbench.md");
const adr = readSource("../docs/adr/0479-deployment-decision-workbench.md");
const routeChecks = readSource("../docs/verification/DEPLOYMENT_DECISION_WORKBENCH_CHECKS.md");

const failures = [];

const requiredGuideMarkers = [
  "deployment-decision-guide-v2026-09-03",
  "Hosted PWA first pilot",
  "Local classroom server pilot",
  "Packaged textbook companion",
  "Lowest initial support cost",
  "Moderate support cost",
  "Highest support cost",
  "No offline-ready claim",
  "No local package activation",
  "No student-facing paid feature prompt",
  "No media-only progress",
  "No support-language-only progression",
];

const requiredPageMarkers = [
  "Deployment decision workbench",
  "Hosted PWA, local classroom server, and packaged companion decisions",
  "Review-only",
  "No offline-ready claim",
  "No local package activation",
  "Cost controlled",
  "Standing deployment gate",
  "DeploymentDecisionGuidePanel",
  "DeploymentProfilePanel",
  "PwaOfflineReadinessPanel",
  "MediaBundleIntegrityPanel",
  "LocalDeploymentPreflightPanel",
  "LocalBundleManifestPanel",
  "PackageTierCatalogPanel",
  "/teacher/intake",
  "/teacher/persistence",
  "/teacher/entitlements",
  "/local/sample-publisher",
  "/local/ministar",
];

const requiredRouteVerifierMarkers = [
  "Deployment decision workbench",
  "Hosted PWA, local classroom server, and packaged companion decisions",
  "Review-only",
  "No offline-ready claim",
  "No local package activation",
  "Cost controlled",
  "Standing deployment gate",
  "Deployment decision guide",
  "Hosted PWA first pilot",
  "Local classroom server pilot",
  "Packaged textbook companion",
  "Required evidence",
  "Blocked actions",
  "No report export",
  "No real learner data collection",
  "No student-facing paid feature prompt",
  "No media-only progress",
  "No support-language-only progression",
  "Deployment profiles",
  "PWA and offline readiness",
  "Media bundle integrity readiness",
  "Local deployment preflight",
  "Local bundle manifests",
  "White-label package catalog",
  "/teacher/intake",
  "/teacher/persistence",
  "/teacher/entitlements",
  "/local/sample-publisher",
  "/local/ministar",
];

const requiredIntegrationMarkers = [
  "teacher-deployment-workbench",
  "/teacher/deployment",
  "DeploymentDecisionGuide",
  "Teacher deployment decision workbench",
  "Open deployment decision workbench",
  "Deployment",
  "88 active routes checked",
  "88 checked routes",
];

for (const marker of requiredGuideMarkers) {
  requireText(guide, marker, `Deployment decision guide missing marker: ${marker}`);
}

for (const marker of requiredPageMarkers) {
  requireText(deploymentPage, marker, `Deployment route missing marker: ${marker}`);
}

for (const marker of requiredRouteVerifierMarkers) {
  requireText(activeRouteVerifier, marker, `Active route verifier must check deployment marker: ${marker}`);
}

for (const marker of requiredIntegrationMarkers) {
  requireText(
    routeContracts + activeRouteMatrix + activeRouteVerifier + activeRouteList + teacherPage + appShell,
    marker,
    `Deployment workbench integration missing marker: ${marker}`,
  );
}

requireText(guidePanel, "Deployment decision guide", "Deployment guide panel must render its heading.");
requireText(guidePanel, "Required evidence", "Deployment guide panel must render required evidence.");
requireText(guidePanel, "Blocked actions", "Deployment guide panel must render blocked actions.");
requireText(guidePanel, "Cost controlled", "Deployment guide panel must render cost-control status.");
requireText(principles, "Deployment Decision Workbench Standard", "Principles document must include the deployment standard.");
requireText(buildSessions, "/teacher/deployment", "Build sessions must record the deployment route.");
requireText(decisionRegister, "DR-550", "Decision register must include DR-550.");
requireText(decisionRecord, "DR-550", "Decision record file must exist.");
requireText(adr, "ADR 0479", "ADR file must exist.");
requireText(routeChecks, "Deployment Decision Workbench Checks", "Verification checklist must exist.");

forbidText(deploymentPage, "input type=\"file\"", "Deployment workbench must not include live upload inputs.");
forbidText(deploymentPage, "navigator.serviceWorker.register", "Deployment workbench must not register a service worker.");
forbidText(deploymentPage, "caches.open", "Deployment workbench must not mutate browser caches.");
forbidText(deploymentPage, "fetch(", "Deployment workbench must not call live deployment, billing, or storage services.");
forbidText(deploymentPage, "navigator.mediaDevices.getUserMedia", "Deployment workbench must not request microphone access.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log("PASS deployment decision workbench keeps hosted, local, packaged, offline, media, and package gates review-only.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function forbidText(source, text, message) {
  if (source.includes(text)) {
    failures.push(message);
  }
}
