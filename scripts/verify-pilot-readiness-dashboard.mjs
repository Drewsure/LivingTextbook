import { readFileSync } from "node:fs";

const dashboardData = readSource("../apps/web/src/data/samplePilotReadinessDashboard.ts");
const dashboardPanel = readSource("../apps/web/src/features/pilot/PilotReadinessDashboardPanel.tsx");
const pilotPage = readSource("../apps/web/src/app/teacher/pilot/page.tsx");
const teacherPage = readSource("../apps/web/src/app/teacher/page.tsx");
const appShell = readSource("../apps/web/src/components/layout/AppShell.tsx");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const activeRouteMatrix = readSource("../apps/web/src/data/sampleActiveRouteMatrix.ts");
const activeRouteVerifier = readSource("./verify-active-routes.mjs");
const activeRouteList = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");
const packageJson = readSource("../package.json");
const principles = readSource("../docs/PRINCIPLES_AND_STANDARDS.md");
const buildSessions = readSource("../docs/BUILD_SESSIONS.md");
const operatingNotes = readSource("../docs/OPERATING_NOTES.md");
const decisionRegister = readSource("../docs/DECISION_REGISTER.md");
const decisionRegisterReadme = readSource("../docs/decision-register/README.md");
const decisionRecord = readSource("../docs/decision-register/DR-551-pilot-readiness-dashboard.md");
const adr = readSource("../docs/adr/0480-pilot-readiness-dashboard.md");
const routeChecks = readSource("../docs/verification/PILOT_READINESS_DASHBOARD_CHECKS.md");
const verificationReadme = readSource("../docs/verification/README.md");
const buildSessionNote = readSource("../docs/build-session-notes/2026-09-03-pilot-readiness-dashboard.md");

const failures = [];

const requiredDashboardDataMarkers = [
  "first-partner-pilot-readiness-dashboard-v2026-09-03",
  "Pilot readiness dashboard",
  "Demo-ready, not classroom-ready",
  "8-12 week pilot target",
  "partner-demo-routes",
  "publisher-source-evidence",
  "school-policy-readiness",
  "persistence-and-reports",
  "deployment-choice",
  "No classroom launch",
  "No real learner data",
  "No report export",
  "No policy acceptance",
  "No local package activation",
  "No offline-ready claim",
  "No premium AI Tutor activation",
  "No Z.ai prototype intake request",
  "/partner-demo",
  "/teacher/sources/sample-publisher",
  "/teacher/persistence",
  "/teacher/deployment",
];

const requiredPageMarkers = [
  "Pilot readiness command view",
  "Demo-ready, not classroom-ready",
  "8-12 week pilot target",
  "No classroom launch",
  "No real learner data",
  "No report export",
  "Standing pilot gate",
  "PilotReadinessDashboardPanel",
  "WhiteLabelPilotReadinessPanel",
  "PilotReadinessGatePanel",
  "DeploymentDecisionGuidePanel",
  "PilotReadinessSummaryPanel",
  "PilotLaunchChecklistPanel",
  "TeacherDryRunRehearsalPanel",
  "ClassroomLaunchGatePanel",
  "SchoolLaunchPolicyGatePanel",
  "PilotEvidencePacketPanel",
  "PilotHandoffPackagePanel",
  "PackagePublishGatePanel",
  "Warnings that must stay visible before pilot launch",
  "Policy warnings",
  "Persistence warnings",
  "Partner requirements intake",
  "getTeacherPilotRequirementsIntakePath",
  "/partner-demo",
  "/teacher/deployment",
  "/teacher/intake",
  "/teacher/sessions/partner-demo-unit-1",
  "/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run",
  "/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate",
];

const requiredRouteVerifierMarkers = [
  "Pilot readiness command view",
  "Demo-ready, not classroom-ready",
  "First conversation position",
  "Controlled partner demo routes",
  "Publisher source and media evidence",
  "School policy and learner data",
  "Persistence and teacher reports",
  "Deployment choice",
  "Hard blocks",
  "No launch button",
  "White-label pilot readiness",
  "Can this become a real partner pilot?",
  "Deployment decision guide",
  "Pilot launch checklist preview",
  "Teacher dry-run rehearsal preview",
  "Classroom launch gate preview",
  "School launch policy gate preview",
  "Pilot evidence packet preview",
  "Pilot handoff package",
  "Package publish gate",
  "Warnings that must stay visible before pilot launch",
];

const requiredIntegrationMarkers = [
  "teacher-pilot-readiness-dashboard",
  "/teacher/pilot",
  "PilotReadinessDashboard",
  "Teacher pilot readiness dashboard",
  "Open pilot readiness dashboard",
  "Pilot",
  "88 active routes checked",
  "88 checked routes",
  "verify:pilot",
];

for (const marker of requiredDashboardDataMarkers) {
  requireText(dashboardData, marker, `Pilot readiness dashboard data missing marker: ${marker}`);
}

for (const marker of requiredPageMarkers) {
  requireText(pilotPage, marker, `Pilot readiness page missing marker: ${marker}`);
}

for (const marker of requiredRouteVerifierMarkers) {
  requireText(activeRouteVerifier, marker, `Active route verifier must check pilot marker: ${marker}`);
}

for (const marker of requiredIntegrationMarkers) {
  requireText(
    routeContracts + activeRouteMatrix + activeRouteVerifier + activeRouteList + teacherPage + appShell + packageJson,
    marker,
    `Pilot readiness dashboard integration missing marker: ${marker}`,
  );
}

requireText(dashboardPanel, "Pilot readiness dashboard", "Dashboard panel must render its heading.");
requireText(dashboardPanel, "First conversation position", "Dashboard panel must render first conversation position.");
requireText(dashboardPanel, "Dependent gates", "Dashboard panel must render dependent gates.");
requireText(dashboardPanel, "Hard blocks", "Dashboard panel must render hard blocks.");
requireText(dashboardPanel, "No launch button", "Dashboard panel must render no-launch status.");
requireText(principles, "Pilot Readiness Dashboard Standard", "Principles document must include the pilot dashboard standard.");
requireText(buildSessions, "/teacher/pilot", "Build sessions must record the pilot dashboard route.");
requireText(operatingNotes, "OW-025", "Operating notes must record the pilot dashboard procedure.");
requireText(decisionRegister, "DR-551", "Decision register must include DR-551.");
requireText(decisionRegisterReadme, "DR-551-pilot-readiness-dashboard.md", "Decision register README must list DR-551.");
requireText(decisionRecord, "DR-551", "Decision record file must exist.");
requireText(adr, "ADR 0480", "ADR file must exist.");
requireText(routeChecks, "Pilot Readiness Dashboard Checks", "Verification checklist must exist.");
requireText(verificationReadme, "PILOT_READINESS_DASHBOARD_CHECKS.md", "Verification README must list pilot checks.");
requireText(buildSessionNote, "Pilot readiness dashboard", "Build-session note must exist.");

forbidText(pilotPage, "input type=\"file\"", "Pilot dashboard must not include live upload inputs.");
forbidText(pilotPage, "fetch(", "Pilot dashboard must not call live services.");
forbidText(pilotPage, "navigator.mediaDevices.getUserMedia", "Pilot dashboard must not request microphone access.");
forbidText(pilotPage, "navigator.serviceWorker.register", "Pilot dashboard must not register a service worker.");
forbidText(pilotPage, "caches.open", "Pilot dashboard must not mutate browser caches.");
forbidText(pilotPage, "Launch now", "Pilot dashboard must not introduce a launch-now action.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log("PASS pilot readiness dashboard keeps partner-pilot evidence visible while classroom launch stays blocked.");

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
