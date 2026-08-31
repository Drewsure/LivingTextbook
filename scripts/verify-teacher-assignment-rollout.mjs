import { readFileSync } from "node:fs";

const rolloutPlans = readSource("../apps/web/src/data/sampleAssignmentRolloutPlan.ts");
const generatedAssignmentHandoffEvidencePackets = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackageWriterAssignmentHandoffEvidencePacket.ts",
);
const rolloutPanel = readSource("../apps/web/src/features/teacher/TeacherAssignmentRolloutPanel.tsx");
const assignmentWorkbenchPage = readSource("../apps/web/src/app/teacher/assignments/page.tsx");
const teacherIntakePage = readSource("../apps/web/src/app/teacher/intake/page.tsx");
const activeRouteList = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const activeRouteVerifier = readSource("./verify-active-routes.mjs");
const buildSessions = readSource("../docs/BUILD_SESSIONS.md");
const rolloutChecks = readSource("../docs/verification/TEACHER_ASSIGNMENT_ROLLOUT_CHECKS.md");
const failures = [];

const requiredPlanMarkers = [
  "rollout-ministar-demo-unit-1",
  "assignment-ministar-demo-whole-class",
  "status: \"demo-preview\"",
  "rollout-sample-publisher-front-door",
  "assignment-sample-publisher-front-door",
  "rollout-local-companion-draft",
  "status: \"blocked\"",
  "game-audio-coverage",
  "Media rights",
  "Progress persistence",
  "Report policy",
  "Local bundle",
  "Local storage",
  "Do not schedule as a real partner pilot",
  "reviewed offline audio coverage for every assigned game mode",
  "sourceEvidencePacketIds",
  "generatedPackagePolicyNote",
  "countAssignmentRolloutEvidencePackets",
  "Generated handoff evidence",
  "samplePublisherGeneratedAssignmentEvidence.evidencePacketId",
  "ministarGeneratedAssignmentEvidence.evidencePacketId",
  "assignment handoff evidence storage",
];

for (const marker of requiredPlanMarkers) {
  requireText(rolloutPlans, marker, `Assignment rollout plan missing marker: ${marker}`);
}

for (const marker of [
  "ai-generated-package-writer-assignment-handoff-evidence-packet-${guard.requestId}",
  "sampleAiGeneratedPackageWriterAssignmentShellGuards",
  "guard.requestId",
]) {
  requireText(
    generatedAssignmentHandoffEvidencePackets,
    marker,
    `Generated assignment handoff evidence packet fixture missing marker: ${marker}`,
  );
}

requireText(rolloutPanel, "Assignment rollout", "Assignment rollout panel must expose its heading.");
requireText(rolloutPanel, "From reviewed assignment to scheduled pilot", "Assignment rollout panel must explain the transition boundary.");
requireText(rolloutPanel, "Rollout gates separate safe demos from real classroom pilots", "Assignment rollout panel must preserve the safe-demo boundary.");
requireText(rolloutPanel, "countAssignmentRolloutGates", "Assignment rollout panel must count gate states.");
requireText(rolloutPanel, "Passing gates", "Assignment rollout panel must show passing gate counts.");
requireText(rolloutPanel, "Warnings", "Assignment rollout panel must show warning gate counts.");
requireText(rolloutPanel, "Blocked", "Assignment rollout panel must show blocked gate counts.");
requireText(rolloutPanel, "Generated evidence", "Assignment rollout panel must summarize generated evidence packets.");
requireText(rolloutPanel, "countAssignmentRolloutEvidencePackets", "Assignment rollout panel must use the generated evidence counter.");
requireText(rolloutPanel, "Generated package handoff evidence", "Assignment rollout panel must show generated handoff evidence.");
requireText(rolloutPanel, "sourceEvidencePacketIds", "Assignment rollout panel must render source evidence packet ids.");

requireText(teacherIntakePage, "TeacherAssignmentRolloutPanel", "Teacher intake must render assignment rollout.");
requireText(teacherIntakePage, "sampleAssignmentRolloutPlans", "Teacher intake must use sample assignment rollout plans.");
requireText(assignmentWorkbenchPage, "Assignment rollout workbench", "Teacher assignment workbench must expose its heading.");
requireText(assignmentWorkbenchPage, "TeacherAssignmentReadinessPanel", "Teacher assignment workbench must render assignment readiness.");
requireText(assignmentWorkbenchPage, "TeacherAssignmentRolloutPanel", "Teacher assignment workbench must render assignment rollout.");
requireText(assignmentWorkbenchPage, "ClassRosterReadinessPanel", "Teacher assignment workbench must render roster readiness.");
requireText(assignmentWorkbenchPage, "No live scheduling", "Teacher assignment workbench must block live scheduling.");
requireText(assignmentWorkbenchPage, "No real learner data", "Teacher assignment workbench must block real learner data.");
requireText(assignmentWorkbenchPage, "generated-package assignment handoff stay blocked", "Teacher assignment workbench must block generated-package assignment handoff.");
requireText(routeContracts, "getTeacherAssignmentRolloutWorkbenchPath", "Route contracts must expose assignment rollout workbench helper.");
requireText(activeRouteList, "http://127.0.0.1:3000/teacher/assignments", "Active route list must include assignment rollout workbench.");

for (const marker of [
  "Assignment rollout workbench",
  "Private links, QR entry, roster scope, and pilot scheduling gates",
  "Assignment rollout",
  "From reviewed assignment to scheduled pilot",
  "demo-preview",
  "Sample publisher front-door pilot rollout",
  "Closed local companion rollout",
  "Game audio coverage",
  "Media rights",
  "Report policy",
  "Local storage",
  "Generated package handoff evidence",
  "Generated evidence",
  "Generated handoff evidence",
  "ai-generated-package-writer-assignment-handoff-evidence-packet",
  "cannot schedule a live class",
  "/teacher/assignments",
]) {
  requireText(activeRouteVerifier, marker, `Active route verifier must check assignment rollout text: ${marker}`);
}

requireText(buildSessions, "assignment rollout surfaces game audio coverage before scheduling", "Build sessions must preserve assignment rollout game-audio scheduling rule.");
requireText(buildSessions, "Package publish gates, approval ledgers, and assignment rollout gates must remain visible before any school pilot is scheduled.", "Build sessions must preserve assignment rollout pilot scheduling rule.");
requireText(rolloutChecks, "The panel does not imply that a package draft is a scheduled pilot.", "Verification checklist must preserve scheduled-pilot boundary.");
requireText(rolloutChecks, "The panel does not allow scheduling around missing assigned-game audio coverage.", "Verification checklist must preserve audio coverage scheduling boundary.");
requireText(rolloutChecks, "The panel shows generated-package handoff evidence as review-only.", "Verification checklist must preserve generated handoff boundary.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log("PASS teacher assignment rollout keeps demo, blocked pilot, local, and game-audio scheduling gates visible.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
