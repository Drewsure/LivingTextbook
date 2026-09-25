import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const output = mkdtempSync(join(tmpdir(), "living-textbook-assist-audio-decision-snapshot-"));
const contractPath = new URL("../packages/content-model/src/assistLanguageAudioCatalogReleaseDecisionSnapshotBinding.ts", import.meta.url);
const contract = readFileSync(contractPath, "utf8");
const releaseReviewBindingContract = readFileSync(new URL("../packages/content-model/src/assistLanguageAudioCatalogReleaseReviewBinding.ts", import.meta.url), "utf8");
const builder = readFileSync(new URL("../apps/web/src/data/sampleAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../apps/web/src/features/multimedia/TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanel.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../apps/web/src/app/teacher/media/[tenantId]/page.tsx", import.meta.url), "utf8");
const releaseControlRoute = readFileSync(new URL("../apps/web/src/app/teacher/release-control/[tenantId]/page.tsx", import.meta.url), "utf8");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(output, "binding.js"), ts.transpileModule(contract, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  writeFileSync(join(output, "assistLanguageAudioCatalogReleaseReviewBinding.js"), ts.transpileModule(releaseReviewBindingContract, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");

  const {
    ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_BLOCKED_ACTIONS,
    createReviewOnlyAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding,
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding,
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstSnapshot,
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstReleaseReviewBinding,
  } = await import(pathToFileURL(join(output, "binding.js")).href);

  const fixture = {
    releaseReviewBindingId: "assist-audio-release-review-binding-v1",
    reconciliationId: "assist-audio-reconciliation-v1",
    reviewerGateBindingId: "assist-audio-reviewer-gate-binding-v1",
    humanReviewPacketId: "controlled-pilot-human-review-packet-v1",
    snapshotId: "pilot-review-decision-snapshot-v1:sample-publisher-review-decision:hosted-managed",
    decisionId: "sample-publisher-l1-u1-routines-package-review-decision",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-l1-u1-routines-package",
    unitKey: "sample-publisher:partner-textbook-companion:L1:U1",
    persistenceMode: "hosted-managed",
    decisionFingerprint: "pilot-review-decision-fnv1a-v1:1234abcd",
    releaseReadinessId: "sample-publisher-release-readiness-v1",
    releaseControlGateId: "sample-publisher-package-publish-gate",
    approvalLedgerId: "sample-publisher-package-approval-ledger",
    status: "blocked-preview",
    linkedRecords: [
      "assist_language_audio_catalog_release_review_binding",
      "assist_language_audio_catalog_approval_reconciliation",
      "assist_language_audio_reviewer_gate_binding",
      "pilot_review_decision_snapshot",
      "white_label_release_readiness",
      "package_publish_gate",
      "package_approval_ledger",
      "controlled_pilot_human_review_packet",
    ],
    scopeDrift: [],
    blockingReasons: ["Canonical pilot decision remains demo-ready-pilot-blocked."],
    blockedActions: [...ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_BLOCKED_ACTIONS],
    nextGate: ["Reconcile the decision snapshot with the release candidate."],
  };

  const created = createReviewOnlyAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding(fixture);
  const sourceSnapshot = {
    snapshotId: fixture.snapshotId,
    tenantId: fixture.tenantId,
    packageId: fixture.packageId,
    persistenceMode: fixture.persistenceMode,
    decisionFingerprint: fixture.decisionFingerprint,
    decision: { decisionId: fixture.decisionId },
  };
  assert(validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding(created).length === 0, "valid decision snapshot binding must pass");
  assert(validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstSnapshot(created, sourceSnapshot).length === 0, "matching decision snapshot identity must pass");
  const sourceReleaseReviewBinding = {
    bindingId: fixture.releaseReviewBindingId,
    reconciliationId: fixture.reconciliationId,
    reviewerGateBindingId: fixture.reviewerGateBindingId,
    humanReviewPacketId: fixture.humanReviewPacketId,
    releaseReadinessId: fixture.releaseReadinessId,
    releaseControlGateId: fixture.releaseControlGateId,
    approvalLedgerId: fixture.approvalLedgerId,
    tenantId: fixture.tenantId,
    packageId: fixture.packageId,
    unitKey: fixture.unitKey,
    releaseControlStatus: "blocked",
    humanReviewStatus: "awaiting-human-review",
    status: "blocked-preview",
    linkedRecords: [
      "assist_language_audio_catalog_approval_reconciliation",
      "assist_language_audio_reviewer_gate_binding",
      "white_label_release_readiness",
      "package_publish_gate",
      "package_approval_ledger",
      "controlled_pilot_human_review_packet",
    ],
    scopeDrift: [],
    blockingReasons: ["No approval capture", "No production approval", "No package promotion", "No student production launch", "No catalog admission", "No student-facing assist audio"],
    nextGate: ["Human review"],
    approvalCaptureAllowed: false,
    productionApprovalAllowed: false,
    packagePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  assert(validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstReleaseReviewBinding(created, sourceReleaseReviewBinding).length === 0, "matching release-review upstream identity must pass");
  assert(created.bindingId === `assist-language-audio-release-decision-snapshot-binding-v1:${fixture.releaseReviewBindingId}:${fixture.snapshotId}`, "decision snapshot binding identity must be deterministic");
  assert(created.snapshotWriteAllowed === false && created.snapshotRestoreAllowed === false && created.snapshotExportAllowed === false, "snapshot operations must remain blocked");
  assert(created.approvalCaptureAllowed === false && created.productionApprovalAllowed === false && created.packagePromotionAllowed === false && created.studentProductionLaunchAllowed === false && created.activationAllowed === false, "release actions must remain blocked");
  assert(created.mode === "review-only" && created.sideEffect === "none", "decision snapshot binding must remain review-only and side-effect-free");
  assert(
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding({ ...created, blockedActions: [] }).some((error) => error.includes("must block No decision snapshot write")),
    "missing blocked snapshot action must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding({ ...created, snapshotWriteAllowed: true }).some((error) => error.includes("snapshotWriteAllowed must remain false")),
    "snapshot write enablement must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstSnapshot(created, { ...sourceSnapshot, tenantId: "other-tenant" }).some((error) => error.includes("tenantId does not match")),
    "cross-tenant snapshot identity must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstSnapshot(created, { ...sourceSnapshot, decisionFingerprint: "pilot-review-decision-fnv1a-v1:deadbeef" }).some((error) => error.includes("decisionFingerprint does not match")),
    "tampered decision fingerprint must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstReleaseReviewBinding(created, { ...sourceReleaseReviewBinding, reviewerGateBindingId: "other-reviewer-gate" }).some((error) => error.includes("reviewerGateBindingId does not match")),
    "tampered reviewer gate identity must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstReleaseReviewBinding(created, { ...sourceReleaseReviewBinding, humanReviewPacketId: "other-human-review-packet" }).some((error) => error.includes("humanReviewPacketId does not match")),
    "tampered human review identity must be rejected",
  );

  for (const marker of [
    "Decision snapshot adjudication",
    "exact",
    "pilot decision snapshot and fingerprint",
    "No live action",
    "Blocked actions",
    "Open blockers",
    "fingerprint",
    "Reconciliation",
    "Reviewer gate",
    "Human review packet",
  ]) assert(panel.includes(marker), `decision snapshot panel missing marker: ${marker}`);

  for (const marker of [
    "buildAssistLanguageAudioCatalogReleaseDecisionSnapshotBindings",
    "TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanel",
    "samplePilotReviewDecisionSnapshots",
  ]) assert(builder.includes(marker) || route.includes(marker), `decision snapshot integration missing marker: ${marker}`);

  for (const marker of [
    "buildAssistLanguageAudioCatalogReleaseDecisionSnapshotBindings",
    "TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanel",
    "samplePilotReviewDecisionSnapshots",
  ]) assert(releaseControlRoute.includes(marker), `release-control route missing marker: ${marker}`);

  console.log("PASS assist-language audio decision snapshot binding preserves fingerprint identity, release lineage, tenant scope, and review-only action blocks.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
