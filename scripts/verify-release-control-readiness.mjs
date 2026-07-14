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
requireText(backendSchema, "package_release_candidate", "Backend schema must include package release candidate record.");
requireText(backendSchema, "package_publish_gate", "Backend schema must include package publish gate record.");
requireText(backendSchema, "package_approval_ledger", "Backend schema must include package approval ledger record.");
requireText(migrationSpecs, "spec-package-release-candidate", "Migration specs must include package release candidate status.");
requireText(routeVerifier, "Pilot release candidate", "Active route verifier must keep pilot release candidate visible.");
requireText(routeVerifier, "Package publish gate", "Active route verifier must keep publish gate visible.");
requireText(routeVerifier, "Publisher pilot readiness summary", "Active route verifier must keep publisher readiness summary visible.");
requireText(routeVerifier, "Pilot evidence packet", "Active route verifier must keep pilot evidence packet visible.");
requireText(routeVerifier, "Pilot launch checklist preview", "Active route verifier must keep pilot launch checklist visible.");

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
