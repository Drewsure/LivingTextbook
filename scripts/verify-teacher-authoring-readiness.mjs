import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleTeacherAuthoringReadiness.ts");
const panel = readSource("../apps/web/src/features/content-intake/TeacherAuthoringReadinessPanel.tsx");
const draftPreview = readSource("../apps/web/src/features/content-intake/TeacherDraftPackagePreviewPanel.tsx");
const draftData = readSource("../apps/web/src/data/sampleTeacherDraftPackage.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const aiHandoff = readSource("../docs/AI_AUTHORING_VERIFIER_HANDOFF.md");
const failures = [];

const plannedLanes = ["quick-draft", "copy-edit", "activity-pathway-edit", "printable-authoring"];
const blockedLanes = ["direct-ai-publish"];
const requiredGates = ["draft-ownership", "review-before-assignment", "audio-before-students", "rights-version-audit"];

for (const laneId of plannedLanes) {
  requireLaneStatus(laneId, "planned");
}

for (const laneId of blockedLanes) {
  requireLaneStatus(laneId, "blocked");
}

for (const gateId of requiredGates) {
  requireText(plan, `gateId: "${gateId}"`, `Teacher authoring gate missing: ${gateId}`);
}

requireText(plan, "Fast authoring creates draft packages only", "Teacher authoring plan must keep fast authoring draft-only.");
requireText(plan, "Assign directly to students", "Teacher authoring plan must block direct draft assignment.");
requireText(plan, "AI draft to assignment", "Teacher authoring plan must block direct AI publish.");
requireText(plan, "Audio before students", "Teacher authoring plan must preserve audio-before-students gate.");
requireText(panel, "Teacher authoring readiness", "Teacher authoring panel must expose its heading.");
requireText(panel, "Required before student use", "Teacher authoring panel must show student-use requirements.");
requireText(draftData, "canAssignToStudents: false", "Teacher draft package must block student assignment.");
requireText(draftData, "Skip audio support", "Teacher draft package must block skipped audio support.");
requireText(draftPreview, "Teacher draft package", "Teacher draft preview must expose its heading.");
requireText(draftPreview, "Student assignment blocked", "Teacher draft preview must show assignment block.");
requireText(draftPreview, "No direct publish", "Teacher draft preview must show no-direct-publish boundary.");
requireText(routeVerifier, "Teacher authoring readiness", "Active route verifier must check teacher authoring panel.");
requireText(routeVerifier, "/teacher/authoring/draft-sample-publisher-l1-u1", "Active route verifier must check teacher draft preview route.");
requireText(routeVerifier, "Direct AI publish", "Active route verifier must check direct AI publish block.");
requireText(aiHandoff, "AI can draft structure. It cannot publish student-facing content by itself.", "AI handoff docs must preserve no-direct-publish rule.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS teacher authoring readiness covers ${plannedLanes.length} planned lane(s), ${blockedLanes.length} blocked lane(s), and ${requiredGates.length} assignment gate(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function requireLaneStatus(laneId, status) {
  const escaped = laneId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`laneId:\\s*"${escaped}"[\\s\\S]*?status:\\s*"${status}"`, "m");

  if (!pattern.test(plan)) {
    failures.push(`Teacher authoring lane ${laneId} must have status ${status}.`);
  }
}
