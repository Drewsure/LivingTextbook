import { readFileSync } from "node:fs";

const launchCard = readSource("../apps/web/src/features/student/components/LaunchContextSafetyCard.tsx");
const studentLaunchFlow = readSource("../apps/web/src/features/student/StudentLaunchFlow.tsx");
const frontDoorFlow = readSource("../apps/web/src/features/access/FrontDoorEntryFlow.tsx");
const assignmentPage = readSource("../apps/web/src/app/assign/[assignmentId]/page.tsx");
const sessionPage = readSource("../apps/web/src/app/teacher/sessions/[launchCode]/page.tsx");
const reportPackagePage = readSource("../apps/web/src/app/teacher/sessions/[launchCode]/report-package/page.tsx");
const sessionBoundaryPanel = readSource("../apps/web/src/features/teacher/TeacherSessionLaunchGateBoundaryPanel.tsx");
const teacherUnitReviewPanel = readSource("../apps/web/src/features/teacher/TeacherUnitReviewPanel.tsx");
const sessionMonitorData = readSource("../apps/web/src/data/sampleTeacherSessionMonitor.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const buildSessions = readSource("../docs/BUILD_SESSIONS.md");
const failures = [];

const studentRoutes = [
  "/enter/ministar",
  "/launch/demo-unit-1",
  "/enter/sample-publisher",
  "/launch/partner-demo-unit-1",
  "/assign/assignment-ministar-demo-whole-class",
  "/assign/assignment-sample-publisher-front-door",
];

const teacherRoutes = [
  "/teacher/units/ministar%3Aministar-english%3AL1%3AU1",
  "/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1",
  "/teacher/sessions/demo-unit-1",
  "/teacher/sessions/partner-demo-unit-1",
  "/teacher/sessions/demo-unit-1/report-package",
  "/teacher/sessions/partner-demo-unit-1/report-package",
];

const safetyMarkers = [
  "No live classroom launch",
  "Target language unlocks progress",
  "No production student accounts",
  "Real learner data blocked",
  "Report export still blocked",
  "Session launch gate boundary",
];

for (const route of studentRoutes) {
  requireText(routeVerifier, route, `Active route verifier missing launch-safety route: ${route}`);
}

for (const route of teacherRoutes) {
  requireText(routeVerifier, route, `Active route verifier missing teacher launch-gate route: ${route}`);
}

for (const marker of safetyMarkers) {
  requireText(routeVerifier, marker, `Active route verifier missing launch-safety marker: ${marker}`);
}

requireText(launchCard, "This route is controlled practice.", "Launch context card must state controlled practice.");
requireText(launchCard, "Target language unlocks progress", "Launch context card must state target-language progression.");
requireText(launchCard, "No production student accounts", "Launch context card must state no production accounts.");
requireText(studentLaunchFlow, "Controlled student practice", "Student launch flow must render controlled-student-practice boundary.");
requireText(frontDoorFlow, "Controlled front-door practice", "Front-door flow must render controlled-front-door-practice boundary.");
requireText(assignmentPage, "Controlled assignment practice", "Private assignment page must render controlled-assignment-practice boundary.");
requireText(sessionPage, "TeacherSessionLaunchGateBoundaryPanel", "Teacher session monitor route must render launch gate boundary panel.");
requireText(reportPackagePage, "TeacherSessionLaunchGateBoundaryPanel", "Report package route must render launch gate boundary panel.");
requireText(teacherUnitReviewPanel, "Assignment stays review-only", "Teacher unit review must state assignment remains review-only.");
requireText(teacherUnitReviewPanel, "No live classroom launch", "Teacher unit review must keep live classroom launch blocked.");
requireText(teacherUnitReviewPanel, "Real learner data blocked", "Teacher unit review must keep real learner data blocked.");
requireText(teacherUnitReviewPanel, "Report export still blocked", "Teacher unit review must keep report export blocked.");
requireText(sessionBoundaryPanel, "Open classroom launch gate", "Session launch gate boundary panel must link to the launch gate workspace.");
requireText(sessionBoundaryPanel, "No live classroom launch", "Session launch gate boundary panel must state no live classroom launch.");
requireText(sessionMonitorData, "Real learner data blocked", "Session monitor data must preserve real learner data blocker.");
requireText(sessionMonitorData, "Report export still blocked", "Session monitor data must preserve report export blocker.");
requireText(buildSessions, "private assignment routes show controlled-practice launch context", "Build sessions must preserve private assignment launch context rule.");
requireText(buildSessions, "teacher session monitor and report-package routes show a session launch gate boundary", "Build sessions must preserve teacher report launch gate rule.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS launch safety boundaries cover ${studentRoutes.length} student doorway route(s), ${teacherRoutes.length} teacher/report route(s), and ${safetyMarkers.length} safety marker(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
