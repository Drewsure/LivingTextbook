import { readFileSync } from "node:fs";

const publishGate = readSource("../apps/web/src/data/samplePackagePublishGate.ts");
const approvalLedger = readSource("../apps/web/src/data/samplePackageApprovalLedger.ts");
const releasePanel = readSource("../apps/web/src/features/pilot/PilotReleaseCandidatePanel.tsx");
const publishPanel = readSource("../apps/web/src/features/pilot/PackagePublishGatePanel.tsx");
const approvalPanel = readSource("../apps/web/src/features/pilot/PackageApprovalLedgerPanel.tsx");
const readinessSummary = readSource("../apps/web/src/data/samplePilotReadinessSummary.ts");
const readinessSummaryPanel = readSource("../apps/web/src/features/pilot/PilotReadinessSummaryPanel.tsx");
const evidencePacket = readSource("../apps/web/src/data/samplePilotEvidencePacket.ts");
const evidencePacketPanel = readSource("../apps/web/src/features/pilot/PilotEvidencePacketPanel.tsx");
const launchChecklist = readSource("../apps/web/src/data/samplePilotLaunchChecklist.ts");
const launchChecklistPanel = readSource("../apps/web/src/features/pilot/PilotLaunchChecklistPanel.tsx");
const teacherDryRun = readSource("../apps/web/src/data/sampleTeacherDryRunRehearsal.ts");
const teacherDryRunPanel = readSource("../apps/web/src/features/pilot/TeacherDryRunRehearsalPanel.tsx");
const classroomLaunchGate = readSource("../apps/web/src/data/sampleClassroomLaunchGate.ts");
const classroomLaunchGatePanel = readSource("../apps/web/src/features/pilot/ClassroomLaunchGatePanel.tsx");
const schoolLaunchPolicyGate = readSource("../apps/web/src/data/sampleSchoolLaunchPolicyGate.ts");
const schoolLaunchPolicyGatePanel = readSource("../apps/web/src/features/pilot/SchoolLaunchPolicyGatePanel.tsx");
const schoolPolicyAcceptancePreflight = readSource("../apps/web/src/data/sampleSchoolPolicyAcceptancePreflight.ts");
const schoolPolicyAcceptancePreflightPanel = readSource("../apps/web/src/features/pilot/SchoolPolicyAcceptancePreflightPanel.tsx");
const schoolPolicyTextPack = readSource("../apps/web/src/data/sampleSchoolPolicyTextPack.ts");
const schoolPolicyTextPackPanel = readSource("../apps/web/src/features/pilot/SchoolPolicyTextPackPanel.tsx");
const schoolPolicyAcceptanceRecordPreview = readSource("../apps/web/src/data/sampleSchoolPolicyAcceptanceRecordPreview.ts");
const schoolPolicyAcceptanceRecordPreviewPanel = readSource("../apps/web/src/features/pilot/SchoolPolicyAcceptanceRecordPreviewPanel.tsx");
const schoolPolicyRevocationRollbackPlan = readSource("../apps/web/src/data/sampleSchoolPolicyRevocationRollbackPlan.ts");
const schoolPolicyRevocationRollbackPanel = readSource("../apps/web/src/features/pilot/SchoolPolicyRevocationRollbackPanel.tsx");
const schoolPolicyHandoffPacket = readSource("../apps/web/src/data/sampleSchoolPolicyHandoffPacket.ts");
const schoolPolicyHandoffPacketPanel = readSource("../apps/web/src/features/pilot/SchoolPolicyHandoffPacketPanel.tsx");
const backendSchema = readSource("../apps/web/src/data/sampleBackendSchemaDraft.ts");
const migrationSpecs = readSource("../apps/web/src/data/sampleBackendMigrationSpecs.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const failures = [];

const requiredGateIds = [
  "reviewed-content-payload",
  "audio-video-rights",
  "game-offer-map",
  "game-audio-coverage",
  "activity-rendering-profile-gate",
  "stable-qr-alias",
  "teacher-report-policy",
  "deployment-profile",
  "persistence-adapter",
  "pilot-package-policy",
];

const requiredSignoffs = [
  "content-review",
  "media-rights",
  "game-quality",
  "qr-route-stability",
  "privacy-report-policy",
  "deployment-support",
  "platform-release",
];

for (const gateId of requiredGateIds) {
  requireText(publishGate, `gateId: "${gateId}"`, `Package publish gate missing gate: ${gateId}.`);
}

for (const signoffId of requiredSignoffs) {
  requireText(approvalLedger, `signoffId: "${signoffId}"`, `Package approval ledger missing signoff: ${signoffId}.`);
}

requireText(publishGate, "A package may be shown as a controlled demo", "Publish gate must separate controlled demos from pilot publishing.");
requireText(publishGate, "cannot be marked pilot-publishable", "Publish gate must block pilot-publishable status while blockers remain.");
requireText(publishGate, "Support language helps comprehension but never unlocks target-language progression.", "Publish gate must preserve support-language rule.");
requireText(publishGate, "Every assigned game mode must have reviewed audio coverage", "Publish gate must require game audio coverage.");
requireText(publishGate, "activity_compatibility_snapshot", "Publish gate must require activity compatibility snapshots.");
requireText(publishGate, "template_rendering_profile", "Publish gate must require template rendering profiles.");
requireText(publishGate, "font_accessibility_profile", "Publish gate must require font accessibility profiles.");
requireText(publishGate, "No switch-to-anything panel can ship as a pilot feature.", "Publish gate must block switch-to-anything behavior.");
requireText(publishGate, "Do not connect live student records to a backend before policy and adapter gates are closed.", "Publish gate must block live backend writes.");
requireText(approvalLedger, "No sign-off can override a release-blocking safety rule.", "Approval ledger must prevent sign-off overrides.");
requireText(approvalLedger, "approver identity, timestamp, release candidate, package version, and evidence links", "Approval ledger must name durable approval evidence.");
requireText(releasePanel, "blockingGateCount === 0 && requiredApprovalOpenCount === 0", "Release candidate panel must derive pilot readiness from gates and approvals.");
requireText(releasePanel, "not a production publish button", "Release candidate panel must avoid implying production publishing.");
requireText(publishPanel, "Do not publish yet", "Publish gate panel must display do-not-publish status while blockers remain.");
requireText(approvalPanel, "Approvals open", "Approval ledger panel must show open approval status while signoffs remain.");
requireText(readinessSummary, "samplePackagePublishGate", "Pilot readiness summary must derive from the package publish gate source.");
requireText(readinessSummary, "Publisher pilot readiness summary", "Pilot readiness summary must expose a publisher-facing summary title.");
requireText(readinessSummary, "Source of truth: package publish gate", "Pilot readiness summary must name the package publish gate as source of truth.");
requireText(readinessSummary, "No publish action", "Pilot readiness summary must make clear it is not a publish action.");
requireText(readinessSummary, "status === \"ready\"", "Pilot readiness summary must derive demo-ready gates from ready gate status.");
requireText(readinessSummary, "item.blocksRelease && item.status !== \"ready\"", "Pilot readiness summary must derive pilot blockers from release-blocking non-ready gates.");
requireText(readinessSummaryPanel, "Demo-ready now", "Pilot readiness summary panel must show controlled-demo evidence.");
requireText(readinessSummaryPanel, "Pilot blockers", "Pilot readiness summary panel must show release-blocking issues.");
requireText(readinessSummaryPanel, "Missing evidence", "Pilot readiness summary panel must show missing evidence.");
requireText(readinessSummaryPanel, "Still not allowed", "Pilot readiness summary panel must show forbidden promises.");
requireText(evidencePacket, "samplePackagePublishGate", "Pilot evidence packet must derive gate evidence from package publish gate.");
requireText(evidencePacket, "samplePackageApprovalLedger", "Pilot evidence packet must derive approval evidence from package approval ledger.");
requireText(evidencePacket, "No evidence upload", "Pilot evidence packet must block live evidence upload.");
requireText(evidencePacket, "No signed approval capture", "Pilot evidence packet must block signed approval capture.");
requireText(evidencePacket, "No chat-only approval proof", "Pilot evidence packet must block chat-only approval proof.");
requireText(evidencePacketPanel, "Pilot evidence packet", "Pilot evidence packet panel must be visible.");
requireText(evidencePacketPanel, "Gate evidence needed", "Pilot evidence packet panel must show gate evidence.");
requireText(evidencePacketPanel, "Approval evidence needed", "Pilot evidence packet panel must show approval evidence.");
requireText(evidencePacketPanel, "Package evidence stays metadata first", "Pilot evidence packet panel must keep evidence metadata-first.");
requireText(launchChecklist, "samplePilotReadinessSummary", "Pilot launch checklist must derive from readiness summary.");
requireText(launchChecklist, "samplePilotEvidencePacket", "Pilot launch checklist must derive from evidence packet.");
requireText(launchChecklist, "samplePilotHandoffPackage", "Pilot launch checklist must derive from pilot handoff package.");
requireText(launchChecklist, "No classroom launch action", "Pilot launch checklist must block live classroom launch actions.");
requireText(launchChecklist, "Controlled partner demo", "Pilot launch checklist must separate controlled demo from real pilot.");
requireText(launchChecklist, "Teacher classroom dry run", "Pilot launch checklist must require teacher rehearsal before real pilot.");
requireText(launchChecklistPanel, "Partner pilot launch planning", "Pilot launch checklist panel must be visible.");
requireText(launchChecklistPanel, "Required before classroom pilot", "Pilot launch checklist panel must show classroom pilot requirements.");
requireText(launchChecklistPanel, "Go/no-go blocked", "Pilot launch checklist panel must show go/no-go status.");
requireText(teacherDryRun, "samplePilotLaunchChecklist", "Teacher dry-run rehearsal must derive from the pilot launch checklist.");
requireText(teacherDryRun, "samplePilotHandoffPackage", "Teacher dry-run rehearsal must derive from the pilot handoff package.");
requireText(teacherDryRun, "samplePilotEvidencePacket", "Teacher dry-run rehearsal must derive from the pilot evidence packet.");
requireText(teacherDryRun, "Teacher dry-run rehearsal preview", "Teacher dry-run rehearsal must expose a teacher-facing title.");
requireText(teacherDryRun, "No student launch action", "Teacher dry-run rehearsal must block student launch actions.");
requireText(teacherDryRun, "Do not collect real learner data", "Teacher dry-run rehearsal must block real learner data collection.");
requireText(teacherDryRun, "Entry and route rehearsal", "Teacher dry-run rehearsal must include entry and route checks.");
requireText(teacherDryRun, "Game and audio rehearsal", "Teacher dry-run rehearsal must include game and audio checks.");
requireText(teacherDryRun, "Media and support-language rehearsal", "Teacher dry-run rehearsal must include media/support-language checks.");
requireText(teacherDryRun, "Report and policy rehearsal", "Teacher dry-run rehearsal must include report and policy checks.");
requireText(teacherDryRunPanel, "Teacher-only rehearsal", "Teacher dry-run rehearsal panel must be visible.");
requireText(teacherDryRunPanel, "Dry-run evidence only", "Teacher dry-run rehearsal panel must keep evidence preview-only.");
requireText(teacherDryRunPanel, "No live workflow", "Teacher dry-run rehearsal panel must block live workflow behavior.");
requireText(classroomLaunchGate, "samplePackagePublishGate", "Classroom launch gate must derive from the package publish gate.");
requireText(classroomLaunchGate, "samplePackageApprovalLedger", "Classroom launch gate must derive from the package approval ledger.");
requireText(classroomLaunchGate, "samplePilotEvidencePacket", "Classroom launch gate must derive from the pilot evidence packet.");
requireText(classroomLaunchGate, "sampleTeacherDryRunRehearsal", "Classroom launch gate must derive from the teacher dry-run rehearsal.");
requireText(classroomLaunchGate, "Classroom launch gate preview", "Classroom launch gate must expose a teacher-facing title.");
requireText(classroomLaunchGate, "Launch blocked", "Classroom launch gate must keep live launch blocked.");
requireText(classroomLaunchGate, "Dry-run evidence required", "Classroom launch gate must require dry-run/evidence closure.");
requireText(classroomLaunchGate, "Policy and persistence required", "Classroom launch gate must require policy and persistence closure.");
requireText(classroomLaunchGate, "No live student session", "Classroom launch gate must block live student sessions.");
requireText(classroomLaunchGate, "No launch button", "Classroom launch gate must block launch button behavior.");
requireText(classroomLaunchGate, "Real learner data blocked", "Classroom launch gate must block real learner data.");
requireText(classroomLaunchGate, "Report export still blocked", "Classroom launch gate must block report export.");
requireText(classroomLaunchGatePanel, "Classroom launch gate", "Classroom launch gate panel must be visible.");
requireText(classroomLaunchGatePanel, "Required before launch", "Classroom launch gate panel must show required launch conditions.");
requireText(classroomLaunchGatePanel, "Blocked actions", "Classroom launch gate panel must show blocked actions.");
requireText(classroomLaunchGatePanel, "Preview only", "Classroom launch gate panel must stay preview-only.");
requireText(schoolLaunchPolicyGate, "samplePilotPolicyPlans", "School launch policy gate must derive school policy requirements from pilot policy plans.");
requireText(schoolLaunchPolicyGate, "sampleClassroomLaunchGate", "School launch policy gate must derive from the classroom launch gate.");
requireText(schoolLaunchPolicyGate, "sampleTeacherDryRunRehearsal", "School launch policy gate must derive from the teacher dry-run rehearsal.");
requireText(schoolLaunchPolicyGate, "School launch policy gate preview", "School launch policy gate must expose a teacher-facing title.");
requireText(schoolLaunchPolicyGate, "School launch decision blocked", "School launch policy gate must keep school launch blocked.");
requireText(schoolLaunchPolicyGate, "School privacy and retention acceptance", "School launch policy gate must require privacy and retention acceptance.");
requireText(schoolLaunchPolicyGate, "Classroom operating mode acceptance", "School launch policy gate must require classroom operating mode acceptance.");
requireText(schoolLaunchPolicyGate, "Publisher media and local package acceptance", "School launch policy gate must require publisher media/local package acceptance.");
requireText(schoolLaunchPolicyGate, "Teacher dry-run evidence acceptance", "School launch policy gate must require teacher dry-run evidence acceptance.");
requireText(schoolLaunchPolicyGate, "Platform release and storage acceptance", "School launch policy gate must require platform release and storage acceptance.");
requireText(schoolLaunchPolicyGate, "No real learner data collection", "School launch policy gate must block real learner data collection.");
requireText(schoolLaunchPolicyGate, "No teacher report export", "School launch policy gate must block teacher report export.");
requireText(schoolLaunchPolicyGate, "No support-language-only progression", "School launch policy gate must preserve target-language progress rules.");
requireText(schoolLaunchPolicyGate, "No live classroom workflow can start from this preview.", "School launch policy gate must stay preview-only.");
requireText(schoolLaunchPolicyGatePanel, "School launch policy gate", "School launch policy gate panel must be visible.");
requireText(schoolLaunchPolicyGatePanel, "Required before live launch", "School launch policy gate panel must show live-launch requirements.");
requireText(schoolLaunchPolicyGatePanel, "No school policy acceptance", "School launch policy gate panel must block live policy acceptance.");
requireText(schoolLaunchPolicyGatePanel, "No approval workflow", "School launch policy gate panel must block approval workflow behavior.");
requireText(schoolPolicyHandoffPacket, "sampleSchoolLaunchPolicyGate", "School policy handoff packet must derive from the school launch policy gate.");
requireText(schoolPolicyHandoffPacket, "School policy handoff packet preview", "School policy handoff packet must expose a school-facing title.");
requireText(schoolPolicyHandoffPacket, "Handoff draft only", "School policy handoff packet must stay draft-only.");
requireText(schoolPolicyHandoffPacket, "Privacy, retention, and learner data", "School policy handoff packet must include privacy and learner-data discussion.");
requireText(schoolPolicyHandoffPacket, "Teacher-led QR and student progression rules", "School policy handoff packet must include teacher QR and progression rules.");
requireText(schoolPolicyHandoffPacket, "Publisher media, music, video, and local package", "School policy handoff packet must include publisher media/local package rules.");
requireText(schoolPolicyHandoffPacket, "Teacher dry-run and evidence packet", "School policy handoff packet must include dry-run evidence.");
requireText(schoolPolicyHandoffPacket, "Platform storage, release, and rollback controls", "School policy handoff packet must include platform storage/release controls.");
requireText(schoolPolicyHandoffPacket, "No support-language-only progression", "School policy handoff packet must preserve target-language progression rules.");
requireText(schoolPolicyHandoffPacket, "No AI Tutor activation", "School policy handoff packet must keep AI Tutor opt-in and blocked by default.");
requireText(schoolPolicyHandoffPacket, "No launch-ready status", "School policy handoff packet must block launch-ready status.");
requireText(schoolPolicyHandoffPacketPanel, "School policy handoff packet", "School policy handoff packet panel must be visible.");
requireText(schoolPolicyHandoffPacketPanel, "Evidence needed", "School policy handoff packet panel must show evidence needs.");
requireText(schoolPolicyHandoffPacketPanel, "Deferred decisions", "School policy handoff packet panel must show deferred decisions.");
requireText(schoolPolicyHandoffPacketPanel, "Blocked actions", "School policy handoff packet panel must show blocked actions.");
requireText(schoolPolicyHandoffPacketPanel, "No policy acceptance", "School policy handoff packet panel must block policy acceptance.");
requireText(schoolPolicyHandoffPacketPanel, "create launch", "School policy handoff packet panel must state no live launch workflow is created.");
requireText(schoolPolicyAcceptancePreflight, "sampleSchoolPolicyHandoffPacket", "School policy acceptance preflight must derive from the school policy handoff packet.");
requireText(schoolPolicyAcceptancePreflight, "sampleReviewerIdentitySignatureGate", "School policy acceptance preflight must include reviewer identity/signature gates.");
requireText(schoolPolicyAcceptancePreflight, "School policy acceptance preflight", "School policy acceptance preflight must expose a school-facing title.");
requireText(schoolPolicyAcceptancePreflight, "Acceptance blocked", "School policy acceptance preflight must keep acceptance blocked.");
requireText(schoolPolicyAcceptancePreflight, "Authenticated school approver", "School policy acceptance preflight must require authenticated school approver identity.");
requireText(schoolPolicyAcceptancePreflight, "Policy text and scope", "School policy acceptance preflight must require policy text and scope.");
requireText(schoolPolicyAcceptancePreflight, "Evidence packet and attachment readiness", "School policy acceptance preflight must require evidence and attachment readiness.");
requireText(schoolPolicyAcceptancePreflight, "Release-control binding", "School policy acceptance preflight must require release-control binding.");
requireText(schoolPolicyAcceptancePreflight, "Child safety and progression boundaries", "School policy acceptance preflight must preserve child safety and progression boundaries.");
requireText(schoolPolicyAcceptancePreflight, "Hosted, local, and rollback readiness", "School policy acceptance preflight must require deployment readiness.");
requireText(schoolPolicyAcceptancePreflight, "No accept button", "School policy acceptance preflight must block accept button behavior.");
requireText(schoolPolicyAcceptancePreflight, "No support-language-only progression", "School policy acceptance preflight must block support-language-only progression.");
requireText(schoolPolicyAcceptancePreflight, "No AI Tutor activation", "School policy acceptance preflight must block AI Tutor activation.");
requireText(schoolPolicyAcceptancePreflightPanel, "School policy acceptance preflight", "School policy acceptance preflight panel must be visible.");
requireText(schoolPolicyAcceptancePreflightPanel, "Missing before acceptance", "School policy acceptance preflight panel must show missing acceptance requirements.");
requireText(schoolPolicyAcceptancePreflightPanel, "Minimum acceptance record", "School policy acceptance preflight panel must show minimum acceptance record.");
requireText(schoolPolicyAcceptancePreflightPanel, "No accept button", "School policy acceptance preflight panel must block accept button behavior.");
requireText(schoolPolicyTextPack, "sampleSchoolPolicyAcceptancePreflight", "School policy text pack must derive from the acceptance preflight.");
requireText(schoolPolicyTextPack, "School policy text version pack", "School policy text pack must expose a school-facing title.");
requireText(schoolPolicyTextPack, "Policy text blocked", "School policy text pack must keep policy text blocked.");
requireText(schoolPolicyTextPack, "Privacy, retention, and learner data", "School policy text pack must include privacy and learner-data clauses.");
requireText(schoolPolicyTextPack, "Teacher-led QR and progression rules", "School policy text pack must include QR and progression clauses.");
requireText(schoolPolicyTextPack, "Publisher media, music, video, and local package", "School policy text pack must include publisher media/local package clauses.");
requireText(schoolPolicyTextPack, "Microphone and AI Tutor optional features", "School policy text pack must include premium optional feature clauses.");
requireText(schoolPolicyTextPack, "Hosted, local, storage, and rollback", "School policy text pack must include storage and rollback clauses.");
requireText(schoolPolicyTextPack, "Evidence, signature method, and revocation", "School policy text pack must include evidence and signature clauses.");
requireText(schoolPolicyTextPack, "No policy acceptance from text pack", "School policy text pack must block policy acceptance.");
requireText(schoolPolicyTextPack, "No support-language-only progression", "School policy text pack must preserve target-language progression rules.");
requireText(schoolPolicyTextPack, "No AI Tutor activation", "School policy text pack must block AI Tutor activation.");
requireText(schoolPolicyTextPackPanel, "School policy text version pack", "School policy text pack panel must be visible.");
requireText(schoolPolicyTextPackPanel, "Versioned policy text only", "School policy text pack panel must keep text review-only.");
requireText(schoolPolicyTextPackPanel, "Minimum version fields", "School policy text pack panel must show version fields.");
requireText(schoolPolicyTextPackPanel, "Blocked actions", "School policy text pack panel must show blocked actions.");
requireText(schoolPolicyAcceptanceRecordPreview, "sampleSchoolPolicyTextPack", "School policy acceptance record preview must derive from the text pack.");
requireText(schoolPolicyAcceptanceRecordPreview, "Future school acceptance record preview", "School policy acceptance record preview must expose a school-facing title.");
requireText(schoolPolicyAcceptanceRecordPreview, "Acceptance record blocked", "School policy acceptance record preview must remain blocked.");
requireText(schoolPolicyAcceptanceRecordPreview, "Authenticated school approver", "School policy acceptance record preview must require authenticated approver identity.");
requireText(schoolPolicyAcceptanceRecordPreview, "Accepted policy text version", "School policy acceptance record preview must bind to policy text version.");
requireText(schoolPolicyAcceptanceRecordPreview, "Evidence packet binding", "School policy acceptance record preview must bind evidence.");
requireText(schoolPolicyAcceptanceRecordPreview, "Premium feature consent", "School policy acceptance record preview must keep premium features explicit.");
requireText(schoolPolicyAcceptanceRecordPreview, "No accepted terms stored", "School policy acceptance record preview must block accepted terms storage.");
requireText(schoolPolicyAcceptanceRecordPreview, "No accepted policy record", "School policy acceptance record preview must block accepted policy records.");
requireText(schoolPolicyAcceptanceRecordPreview, "No AI Tutor activation", "School policy acceptance record preview must block AI Tutor activation.");
requireText(schoolPolicyAcceptanceRecordPreviewPanel, "Future school acceptance record preview", "School policy acceptance record preview panel must be visible.");
requireText(schoolPolicyAcceptanceRecordPreviewPanel, "No accepted terms stored", "School policy acceptance record preview panel must block accepted terms.");
requireText(schoolPolicyAcceptanceRecordPreviewPanel, "Minimum accepted-record fields", "School policy acceptance record preview panel must show minimum accepted-record fields.");
requireText(schoolPolicyAcceptanceRecordPreviewPanel, "Non-accepted markers", "School policy acceptance record preview panel must show non-accepted markers.");
requireText(schoolPolicyRevocationRollbackPlan, "sampleSchoolPolicyAcceptanceRecordPreview", "School policy revocation rollback plan must derive from the acceptance record preview.");
requireText(schoolPolicyRevocationRollbackPlan, "School policy revocation and rollback preview", "School policy revocation rollback plan must expose a school-facing title.");
requireText(schoolPolicyRevocationRollbackPlan, "Rollback policy blocked", "School policy revocation rollback plan must remain blocked.");
requireText(schoolPolicyRevocationRollbackPlan, "Revocation request authority", "School policy revocation rollback plan must require revocation authority.");
requireText(schoolPolicyRevocationRollbackPlan, "Printed QR and route effect", "School policy revocation rollback plan must cover printed QR routes.");
requireText(schoolPolicyRevocationRollbackPlan, "Learner data and report effect", "School policy revocation rollback plan must cover learner data and reports.");
requireText(schoolPolicyRevocationRollbackPlan, "Microphone and AI Tutor effect", "School policy revocation rollback plan must cover premium features.");
requireText(schoolPolicyRevocationRollbackPlan, "No rollback button", "School policy revocation rollback plan must block rollback buttons.");
requireText(schoolPolicyRevocationRollbackPlan, "No production QR redirect mutation", "School policy revocation rollback plan must block production QR mutation.");
requireText(schoolPolicyRevocationRollbackPanel, "School policy revocation and rollback preview", "School policy revocation rollback panel must be visible.");
requireText(schoolPolicyRevocationRollbackPanel, "No rollback action", "School policy revocation rollback panel must block rollback actions.");
requireText(schoolPolicyRevocationRollbackPanel, "Minimum rollback record fields", "School policy revocation rollback panel must show minimum rollback fields.");
requireText(backendSchema, "package_release_candidate", "Backend schema must include package release candidate record.");
requireText(backendSchema, "package_publish_gate", "Backend schema must include package publish gate record.");
requireText(backendSchema, "package_approval_ledger", "Backend schema must include package approval ledger record.");
requireText(migrationSpecs, "spec-package-release-candidate", "Migration specs must include package release candidate status.");
requireText(routeVerifier, "Pilot release candidate", "Active route verifier must keep pilot release candidate visible.");
requireText(routeVerifier, "Package publish gate", "Active route verifier must keep publish gate visible.");
requireText(routeVerifier, "Publisher pilot readiness summary", "Active route verifier must keep publisher readiness summary visible.");
requireText(routeVerifier, "Pilot evidence packet", "Active route verifier must keep pilot evidence packet visible.");
requireText(routeVerifier, "Pilot launch checklist preview", "Active route verifier must keep pilot launch checklist visible.");
requireText(routeVerifier, "Teacher dry-run rehearsal preview", "Active route verifier must keep teacher dry-run rehearsal visible.");
requireText(routeVerifier, "Classroom launch gate preview", "Active route verifier must keep classroom launch gate visible.");
requireText(routeVerifier, "School launch policy gate preview", "Active route verifier must keep school launch policy gate visible.");
requireText(routeVerifier, "School policy handoff packet preview", "Active route verifier must keep school policy handoff packet visible.");
requireText(routeVerifier, "School policy acceptance preflight", "Active route verifier must keep school policy acceptance preflight visible.");
requireText(routeVerifier, "School policy text version pack", "Active route verifier must keep school policy text pack visible.");
requireText(routeVerifier, "Future school acceptance record preview", "Active route verifier must keep school acceptance record preview visible.");
requireText(routeVerifier, "School policy revocation and rollback preview", "Active route verifier must keep school policy revocation rollback preview visible.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS release control readiness covers ${requiredGateIds.length} publish gate(s) and ${requiredSignoffs.length} approval signoff(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
