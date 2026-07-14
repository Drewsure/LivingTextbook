import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleTeacherAuthoringReadiness.ts");
const panel = readSource("../apps/web/src/features/content-intake/TeacherAuthoringReadinessPanel.tsx");
const draftPreview = readSource("../apps/web/src/features/content-intake/TeacherDraftPackagePreviewPanel.tsx");
const audioCoveragePreview = readSource("../apps/web/src/features/content-intake/TeacherDraftAudioCoveragePreview.tsx");
const contentEntryWorkbenchPreview = readSource("../apps/web/src/features/content-intake/TeacherDraftContentEntryWorkbenchPreview.tsx");
const localEditorPreview = readSource("../apps/web/src/features/content-intake/TeacherDraftLocalEditPreview.tsx");
const reviewHandoffPreview = readSource("../apps/web/src/features/content-intake/TeacherDraftReviewHandoffPreview.tsx");
const reviewQueue = readSource("../apps/web/src/data/sampleTeacherDraftReviewQueue.ts");
const reviewQueuePanel = readSource("../apps/web/src/features/content-intake/TeacherDraftReviewQueuePanel.tsx");
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
requireText(draftPreview, "TeacherDraftLocalEditPreview", "Teacher draft preview must render the local edit preview.");
requireText(draftPreview, "TeacherDraftContentEntryWorkbenchPreview", "Teacher draft preview must render the content-entry workbench preview.");
requireText(draftPreview, "TeacherDraftAudioCoveragePreview", "Teacher draft preview must render the draft audio coverage preview.");
requireText(draftPreview, "TeacherDraftReviewHandoffPreview", "Teacher draft preview must render the review handoff preview.");
requireText(audioCoveragePreview, "Draft audio coverage preview", "Draft audio coverage preview must expose its heading.");
requireText(audioCoveragePreview, "Term audio", "Draft audio coverage preview must show term audio.");
requireText(audioCoveragePreview, "Sentence audio", "Draft audio coverage preview must show sentence audio.");
requireText(audioCoveragePreview, "Instruction audio", "Draft audio coverage preview must show instruction audio.");
requireText(audioCoveragePreview, "Audio regeneration required", "Draft audio coverage preview must preserve audio regeneration requirement.");
requireText(reviewHandoffPreview, "Draft review handoff preview", "Draft review handoff preview must expose its heading.");
requireText(reviewHandoffPreview, "Review packet blocked", "Draft review handoff preview must block review packet submission.");
requireText(reviewHandoffPreview, "Schema validation packet", "Draft review handoff preview must show schema validation packet.");
requireText(reviewHandoffPreview, "Source lineage packet", "Draft review handoff preview must show source lineage packet.");
requireText(reviewHandoffPreview, "Audio coverage packet", "Draft review handoff preview must show audio coverage packet.");
requireText(reviewHandoffPreview, "Rights and version packet", "Draft review handoff preview must show rights/version packet.");
requireText(reviewHandoffPreview, "Route and activity packet", "Draft review handoff preview must show route/activity packet.");
requireText(reviewHandoffPreview, "Approval packet", "Draft review handoff preview must show approval packet.");
requireText(reviewHandoffPreview, "Draft persistence required", "Draft review handoff preview must preserve draft persistence blocker.");
requireText(reviewHandoffPreview, "No student assignment", "Draft review handoff preview must preserve no-student-assignment blocker.");
requireText(reviewQueue, "sampleTeacherDraftReviewQueue", "Teacher draft review queue sample data must exist.");
requireText(reviewQueue, "Verifier submission blocked", "Teacher draft review queue must block verifier submission.");
requireText(reviewQueue, "Package approval blocked", "Teacher draft review queue must block package approval.");
requireText(reviewQueue, "Student assignment blocked", "Teacher draft review queue must block student assignment.");
requireText(reviewQueue, "Return for edits", "Teacher draft review queue must show return-for-edits decision.");
requireText(reviewQueue, "Needs audio", "Teacher draft review queue must show needs-audio decision.");
requireText(reviewQueue, "Ready for approval", "Teacher draft review queue must show ready-for-approval decision.");
requireText(reviewQueue, "Approver identity required", "Teacher draft review queue must block approval without approver identity.");
requireText(reviewQueue, "Reviewer identity evidence", "Teacher draft review queue must show reviewer identity evidence.");
requireText(reviewQueue, "Evidence storage required", "Teacher draft review queue must block evidence upload without storage.");
requireText(reviewQueue, "No file upload in foundation preview", "Teacher draft review queue must block file upload in foundation preview.");
requireText(reviewQueue, "Handoff packet created", "Teacher draft review queue must show the review audit handoff event.");
requireText(reviewQueue, "Reviewer decision drafted", "Teacher draft review queue must show the review audit decision event.");
requireText(reviewQueue, "Evidence packet blocked", "Teacher draft review queue must show the review audit evidence-blocked event.");
requireText(reviewQueue, "Approval ledger blocked", "Teacher draft review queue must show the review audit approval-ledger event.");
requireText(reviewQueue, "No live state transition", "Teacher draft review queue must block live state transitions from audit preview events.");
requireText(reviewQueue, "Schema packet ready", "Teacher draft review queue must show verifier preflight schema readiness.");
requireText(reviewQueue, "Audio regeneration pending", "Teacher draft review queue must show verifier preflight audio blocking.");
requireText(reviewQueue, "Support language support-only", "Teacher draft review queue must show verifier preflight support-language boundary.");
requireText(reviewQueue, "Route compatibility ready", "Teacher draft review queue must show verifier preflight route readiness.");
requireText(reviewQueue, "Review evidence pending", "Teacher draft review queue must show verifier preflight evidence blocking.");
requireText(reviewQueue, "No automatic verifier submit", "Teacher draft review queue must block automatic verifier submission.");
requireText(reviewQueuePanel, "Teacher draft review queue", "Teacher draft review queue panel must expose its heading.");
requireText(reviewQueuePanel, "Review workbench preview", "Teacher draft review queue panel must expose its preview label.");
requireText(reviewQueuePanel, "No live approval", "Teacher draft review queue panel must block live approval.");
requireText(reviewQueuePanel, "No direct AI publish", "Teacher draft review queue panel must block direct AI publish.");
requireText(reviewQueuePanel, "Reviewer decision preview", "Teacher draft review queue panel must expose reviewer decision preview.");
requireText(reviewQueuePanel, "Decision actions disabled", "Teacher draft review queue panel must disable decision actions.");
requireText(reviewQueuePanel, "Approval still blocked", "Teacher draft review queue panel must keep approval blocked.");
requireText(reviewQueuePanel, "Review evidence packet preview", "Teacher draft review queue panel must expose evidence packet preview.");
requireText(reviewQueuePanel, "Evidence upload blocked", "Teacher draft review queue panel must block evidence upload.");
requireText(reviewQueuePanel, "Review audit trail preview", "Teacher draft review queue panel must expose audit trail preview.");
requireText(reviewQueuePanel, "Audit trail storage required", "Teacher draft review queue panel must block audit trail storage.");
requireText(reviewQueuePanel, "Verifier submission preflight", "Teacher draft review queue panel must expose verifier preflight.");
requireText(reviewQueuePanel, "Verifier submission still blocked", "Teacher draft review queue panel must block verifier submission.");
requireText(localEditorPreview, "Local edit preview", "Local editor preview must expose its heading.");
requireText(localEditorPreview, "Save draft blocked", "Local editor preview must block save.");
requireText(localEditorPreview, "Submit for review blocked", "Local editor preview must block submit for review.");
requireText(localEditorPreview, "Student assignment blocked", "Local editor preview must block student assignment.");
requireText(localEditorPreview, "Audio regeneration required", "Local editor preview must preserve audio regeneration requirement.");
requireText(contentEntryWorkbenchPreview, "Draft content-entry workbench preview", "Content-entry workbench preview must expose its heading.");
requireText(contentEntryWorkbenchPreview, "Activity title", "Content-entry workbench preview must show activity title.");
requireText(contentEntryWorkbenchPreview, "+ Instruction", "Content-entry workbench preview must show instruction control.");
requireText(contentEntryWorkbenchPreview, "Single sided", "Content-entry workbench preview must show single-sided control.");
requireText(contentEntryWorkbenchPreview, "Double sided", "Content-entry workbench preview must show double-sided control.");
requireText(contentEntryWorkbenchPreview, "min 2 max 50", "Content-entry workbench preview must show item limits.");
requireText(contentEntryWorkbenchPreview, "Generate With AI blocked", "Content-entry workbench preview must block AI generation.");
requireText(contentEntryWorkbenchPreview, "Flip tiles preview", "Content-entry workbench preview must show flip tiles preview.");
requireText(contentEntryWorkbenchPreview, "Cross-game upload guide", "Content-entry workbench preview must show cross-game upload guide.");
requireText(contentEntryWorkbenchPreview, "Done blocked", "Content-entry workbench preview must block Done.");
requireText(contentEntryWorkbenchPreview, "Front", "Content-entry workbench preview must show Front field.");
requireText(contentEntryWorkbenchPreview, "Back", "Content-entry workbench preview must show Back field.");
requireText(contentEntryWorkbenchPreview, "Bold", "Content-entry workbench preview must show Bold formatting.");
requireText(contentEntryWorkbenchPreview, "Superscript", "Content-entry workbench preview must show Superscript formatting.");
requireText(contentEntryWorkbenchPreview, "Subscript", "Content-entry workbench preview must show Subscript formatting.");
requireText(contentEntryWorkbenchPreview, "Symbol picker", "Content-entry workbench preview must show symbol picker.");
requireText(contentEntryWorkbenchPreview, "Approved learner font", "Content-entry workbench preview must show approved learner font control.");
requireText(contentEntryWorkbenchPreview, "Tenant font pack", "Content-entry workbench preview must show tenant font pack control.");
requireText(contentEntryWorkbenchPreview, "Hiragana-safe font", "Content-entry workbench preview must show hiragana-safe font control.");
requireText(contentEntryWorkbenchPreview, "Readable tile sizing", "Content-entry workbench preview must show readable tile sizing control.");
requireText(contentEntryWorkbenchPreview, "Font rendering gate", "Content-entry workbench preview must show font rendering gate.");
requireText(contentEntryWorkbenchPreview, "Audio cue required", "Content-entry workbench preview must show audio cue requirement.");
requireText(contentEntryWorkbenchPreview, "Image upload blocked", "Content-entry workbench preview must block image upload.");
requireText(contentEntryWorkbenchPreview, "Reorder item", "Content-entry workbench preview must show reorder item action.");
requireText(contentEntryWorkbenchPreview, "Duplicate item", "Content-entry workbench preview must show duplicate item action.");
requireText(contentEntryWorkbenchPreview, "Delete item", "Content-entry workbench preview must show delete item action.");
requireText(contentEntryWorkbenchPreview, "+ Add an item", "Content-entry workbench preview must show add item action.");
requireText(contentEntryWorkbenchPreview, "No live file picker", "Content-entry workbench preview must block live file pickers.");
requireText(contentEntryWorkbenchPreview, "No Done-to-student route", "Content-entry workbench preview must block Done-to-student routing.");
requireText(contentEntryWorkbenchPreview, "No template switch without compatibility check", "Content-entry workbench preview must block unchecked template switching.");
requireText(routeVerifier, "Teacher authoring readiness", "Active route verifier must check teacher authoring panel.");
requireText(routeVerifier, "/teacher/authoring/draft-sample-publisher-l1-u1", "Active route verifier must check teacher draft preview route.");
requireText(routeVerifier, "Direct AI publish", "Active route verifier must check direct AI publish block.");
requireText(routeVerifier, "Draft content-entry workbench preview", "Active route verifier must check content-entry workbench preview.");
requireText(routeVerifier, "Approved learner font", "Active route verifier must check draft font controls.");
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
