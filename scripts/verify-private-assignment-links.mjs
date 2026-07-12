import { readFileSync } from "node:fs";

const privateAssignmentData = readSource("../apps/web/src/data/samplePrivateAssignmentLinks.ts");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const assignmentPanel = readSource("../apps/web/src/features/routes/PrivateAssignmentLinkPanel.tsx");
const activeRouteMatrix = readSource("../apps/web/src/data/sampleActiveRouteMatrix.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const shareContract = readSource("../docs/SHARE_EMBED_READINESS_CONTRACT.md");
const checklist = readSource("../docs/verification/PRIVATE_ASSIGNMENT_LINK_ROUTE_CHECKS.md");
const failures = [];

const requiredAssignments = [
  "assignment-ministar-demo-whole-class",
  "assignment-sample-publisher-front-door",
];

const requiredBoundaries = [
  "Private assignment link only; not public community sharing.",
  "No iframe embed or public activity discovery in v1.",
  "Student route hides teacher/admin review controls.",
  "Teacher reports remain policy-blocked until persistence and retention rules are accepted.",
  "Support language, media engagement, and microphone practice cannot unlock target-language mastery by themselves.",
];

for (const assignmentId of requiredAssignments) {
  requireText(privateAssignmentData, assignmentId, `Private assignment data missing ${assignmentId}.`);
  requireText(activeRouteMatrix, `/assign/${assignmentId}`, `Active route matrix missing ${assignmentId}.`);
  requireText(routeVerifier, `/assign/${assignmentId}`, `Active route verifier missing ${assignmentId}.`);
  requireText(checklist, `/assign/${assignmentId}`, `Private assignment checklist missing ${assignmentId}.`);
}

for (const boundary of requiredBoundaries) {
  requireText(privateAssignmentData, boundary, `Private assignment boundary missing: ${boundary}`);
}

requireText(routeContracts, 'pattern: "/assign/[assignmentId]"', "Route contract must define private assignment link pattern.");
requireText(routeContracts, "getPrivateAssignmentPath", "Route contract must expose private assignment path helper.");
requireText(routeContracts, "without exposing public sharing or teacher/admin controls", "Route contract must state public/admin exposure boundary.");
requireText(assignmentPanel, "Student-facing assignment preview", "Private assignment panel must state student-facing scope.");
requireText(assignmentPanel, "Private-first sharing rules", "Private assignment panel must state private-first sharing rules.");
requireText(assignmentPanel, "not public sharing, public community discovery, or an iframe embed", "Private assignment panel must reject public/embed behavior.");
requireText(assignmentPanel, "Teacher reports remain policy-blocked", "Private assignment panel must preserve report policy blocker.");
requireText(shareContract, "Private assignment links come first.", "Share/embed contract must keep private assignment links first.");
requireText(shareContract, "Public sharing, public community discovery, and iframe embeds are not v1 features.", "Share/embed contract must keep public/embed blocked for v1.");
requireText(routeVerifier, "Private assignment link", "Active route verifier must check private assignment route text.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS private assignment links cover ${requiredAssignments.length} assignment route(s) and ${requiredBoundaries.length} safety boundary/boundaries.`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
