import { readFileSync } from "node:fs";

const intakeData = readSource("../apps/web/src/data/samplePartnerPilotRequirementsIntake.ts");
const intakePanel = readSource("../apps/web/src/features/pilot/PartnerPilotRequirementsIntakePanel.tsx");
const intakePage = readSource("../apps/web/src/app/teacher/pilot/requirements/[tenantId]/page.tsx");
const pilotPage = readSource("../apps/web/src/app/teacher/pilot/page.tsx");
const appShell = readSource("../apps/web/src/components/layout/AppShell.tsx");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const activeRouteMatrix = readSource("../apps/web/src/data/sampleActiveRouteMatrix.ts");
const activeRouteVerifier = readSource("./verify-active-routes.mjs");
const activeRouteList = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");
const foundationGate = readSource("../apps/web/src/data/sampleFoundationVerificationGate.ts");
const packageJson = readSource("../package.json");
const principles = readSource("../docs/PRINCIPLES_AND_STANDARDS.md");
const buildSessions = readSource("../docs/BUILD_SESSIONS.md");
const operatingNotes = readSource("../docs/OPERATING_NOTES.md");
const decisionRegister = readSource("../docs/DECISION_REGISTER.md");
const decisionRegisterReadme = readSource("../docs/decision-register/README.md");
const decisionRecord = readSource("../docs/decision-register/DR-552-partner-pilot-requirements-intake.md");
const adr = readSource("../docs/adr/0481-partner-pilot-requirements-intake.md");
const routeChecks = readSource("../docs/verification/PARTNER_PILOT_REQUIREMENTS_INTAKE_CHECKS.md");
const verificationReadme = readSource("../docs/verification/README.md");
const buildSessionNote = readSource("../docs/build-session-notes/2026-09-05-partner-pilot-requirements-intake.md");

const failures = [];

const requiredDataMarkers = [
  "sample-publisher-first-pilot-requirements-v2026-09-05",
  "Partner pilot requirements intake",
  "Demo-ready, not classroom-ready",
  "Source PDF or text units",
  "Audio, music, video, poster, and image rights",
  "Pilot activity pathway scope",
  "QR, entry code, and learner code rules",
  "Learner data and roster policy",
  "Teacher report and export expectations",
  "Deployment channel",
  "Package tier and support boundary",
  "AI Tutor and speech scoring option",
  "Z.ai or outside prototype intake",
  "No upload button",
  "No file picker writes",
  "No policy acceptance",
  "No live storage write",
  "No report export",
  "No classroom launch",
  "No local package activation",
  "No premium AI Tutor activation",
  "No Z.ai source handoff request",
  "/teacher/sources/sample-publisher",
  "/teacher/media/sample-publisher",
  "/activities/partner-demo-unit-1",
  "/enter/sample-publisher",
  "/teacher/reporting",
  "/teacher/deployment",
  "/teacher/entitlements",
  "/teacher/game-readiness",
];

const requiredPageMarkers = [
  "Partner pilot requirements intake",
  "What we need before a real classroom pilot",
  "requirements conversation guide",
  "publisher supplies",
  "school decisions",
  "deployment choices",
  "optional premium AI Tutor",
  "Back to pilot dashboard",
  "PartnerPilotRequirementsIntakePanel",
];

const requiredPanelMarkers = [
  "Pilot position",
  "Recommended first path",
  "Evidence needed",
  "Current foundation evidence",
  "Next action",
  "Required before classroom pilot",
  "No live capture",
  "Review-only",
];

const requiredRouteVerifierMarkers = [
  "Partner pilot requirements intake",
  "What we need before a real classroom pilot",
  "Source PDF or text units",
  "Audio, music, video, poster, and image rights",
  "Pilot activity pathway scope",
  "QR, entry code, and learner code rules",
  "Learner data and roster policy",
  "Teacher report and export expectations",
  "Deployment channel",
  "Package tier and support boundary",
  "AI Tutor and speech scoring option",
  "Z.ai or outside prototype intake",
  "No live capture",
  "No upload button",
  "No policy acceptance",
  "No live storage write",
  "No premium AI Tutor activation",
];

const requiredIntegrationMarkers = [
  "teacher-partner-pilot-requirements-intake",
  "/teacher/pilot/requirements/[tenantId]",
  "/teacher/pilot/requirements/sample-publisher",
  "PartnerPilotRequirementsIntake",
  "PartnerPilotRequirement[]",
  "Partner requirements intake",
  "Requirements",
  "verify:pilot-requirements",
  "88 active routes checked",
  "88 checked routes",
];

for (const marker of requiredDataMarkers) {
  requireText(intakeData, marker, `Partner pilot requirements data missing marker: ${marker}`);
}

for (const marker of requiredPageMarkers) {
  requireText(intakePage, marker, `Partner pilot requirements page missing marker: ${marker}`);
}

for (const marker of requiredPanelMarkers) {
  requireText(intakePanel, marker, `Partner pilot requirements panel missing marker: ${marker}`);
}

for (const marker of requiredRouteVerifierMarkers) {
  requireText(activeRouteVerifier, marker, `Active route verifier must check requirements marker: ${marker}`);
}

for (const marker of requiredIntegrationMarkers) {
  requireText(
    routeContracts + activeRouteMatrix + activeRouteVerifier + activeRouteList + pilotPage + appShell + foundationGate + packageJson,
    marker,
    `Partner pilot requirements integration missing marker: ${marker}`,
  );
}

requireText(principles, "Partner Pilot Requirements Intake Standard", "Principles document must include the requirements standard.");
requireText(buildSessions, "/teacher/pilot/requirements/sample-publisher", "Build sessions must record the requirements route.");
requireText(operatingNotes, "OW-026", "Operating notes must record the requirements procedure.");
requireText(decisionRegister, "DR-552", "Decision register must include DR-552.");
requireText(decisionRegisterReadme, "DR-552-partner-pilot-requirements-intake.md", "Decision register README must list DR-552.");
requireText(decisionRecord, "DR-552", "Decision record file must exist.");
requireText(adr, "ADR 0481", "ADR file must exist.");
requireText(routeChecks, "Partner Pilot Requirements Intake Checks", "Verification checklist must exist.");
requireText(verificationReadme, "PARTNER_PILOT_REQUIREMENTS_INTAKE_CHECKS.md", "Verification README must list requirements checks.");
requireText(buildSessionNote, "Partner pilot requirements intake", "Build-session note must exist.");

forbidText(intakePage + intakePanel, "input type=\"file\"", "Requirements intake must not include live upload inputs.");
forbidText(intakePage + intakePanel, "fetch(", "Requirements intake must not call live services.");
forbidText(intakePage + intakePanel, "navigator.mediaDevices.getUserMedia", "Requirements intake must not request microphone access.");
forbidText(intakePage + intakePanel, "navigator.serviceWorker.register", "Requirements intake must not register a service worker.");
forbidText(intakePage + intakePanel, "caches.open", "Requirements intake must not mutate browser caches.");
forbidText(intakePage + intakePanel, "Launch now", "Requirements intake must not introduce a launch-now action.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log("PASS partner pilot requirements intake keeps onboarding requirements visible while live capture stays blocked.");

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
