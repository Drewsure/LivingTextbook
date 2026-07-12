import { readFileSync } from "node:fs";

const publishGate = readSource("../apps/web/src/data/samplePackagePublishGate.ts");
const approvalLedger = readSource("../apps/web/src/data/samplePackageApprovalLedger.ts");
const releasePanel = readSource("../apps/web/src/features/pilot/PilotReleaseCandidatePanel.tsx");
const publishPanel = readSource("../apps/web/src/features/pilot/PackagePublishGatePanel.tsx");
const approvalPanel = readSource("../apps/web/src/features/pilot/PackageApprovalLedgerPanel.tsx");
const backendSchema = readSource("../apps/web/src/data/sampleBackendSchemaDraft.ts");
const migrationSpecs = readSource("../apps/web/src/data/sampleBackendMigrationSpecs.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const failures = [];

const requiredGateIds = [
  "reviewed-content-payload",
  "audio-video-rights",
  "game-offer-map",
  "game-audio-coverage",
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
requireText(publishGate, "Do not connect live student records to a backend before policy and adapter gates are closed.", "Publish gate must block live backend writes.");
requireText(approvalLedger, "No sign-off can override a release-blocking safety rule.", "Approval ledger must prevent sign-off overrides.");
requireText(approvalLedger, "approver identity, timestamp, release candidate, package version, and evidence links", "Approval ledger must name durable approval evidence.");
requireText(releasePanel, "blockingGateCount === 0 && requiredApprovalOpenCount === 0", "Release candidate panel must derive pilot readiness from gates and approvals.");
requireText(releasePanel, "not a production publish button", "Release candidate panel must avoid implying production publishing.");
requireText(publishPanel, "Do not publish yet", "Publish gate panel must display do-not-publish status while blockers remain.");
requireText(approvalPanel, "Approvals open", "Approval ledger panel must show open approval status while signoffs remain.");
requireText(backendSchema, "package_release_candidate", "Backend schema must include package release candidate record.");
requireText(backendSchema, "package_publish_gate", "Backend schema must include package publish gate record.");
requireText(backendSchema, "package_approval_ledger", "Backend schema must include package approval ledger record.");
requireText(migrationSpecs, "spec-package-release-candidate", "Migration specs must include package release candidate status.");
requireText(routeVerifier, "Pilot release candidate", "Active route verifier must keep pilot release candidate visible.");
requireText(routeVerifier, "Package publish gate", "Active route verifier must keep publish gate visible.");

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
