import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const output = mkdtempSync(join(tmpdir(), "living-textbook-assist-audio-release-review-"));
const contract = readFileSync(new URL("../packages/content-model/src/assistLanguageAudioCatalogReleaseReviewBinding.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../apps/web/src/features/multimedia/TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../apps/web/src/app/teacher/media/[tenantId]/page.tsx", import.meta.url), "utf8");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(output, "binding.js"), ts.transpileModule(contract, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");

  const {
    createReviewOnlyAssistLanguageAudioCatalogReleaseReviewBinding,
    validateAssistLanguageAudioCatalogReleaseReviewBinding,
  } = await import(pathToFileURL(join(output, "binding.js")).href);

  const fixture = {
    reconciliationId: "reconciliation-sample-publisher-package-unit-1",
    reviewerGateBindingId: "reviewer-binding-sample-publisher-package-unit-1",
    releaseReadinessId: "sample-publisher-release-readiness-v1",
    releaseControlGateId: "sample-publisher-package-publish-gate",
    approvalLedgerId: "sample-publisher-package-approval-ledger",
    humanReviewPacketId: "sample-publisher-controlled-human-review-packet",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-l1-u1-routines-package",
    unitKey: "sample-publisher:partner-textbook-companion:L1:U1",
    releaseControlStatus: "blocked",
    humanReviewStatus: "blocked",
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
    blockingReasons: [
      "No approval capture",
      "No production approval",
      "No package promotion",
      "No student production launch",
      "No catalog admission",
      "No student-facing assist audio",
      "Release control remains blocked.",
    ],
    nextGate: ["Reconcile release scope.", "Keep activation blocked."],
  };

  const created = createReviewOnlyAssistLanguageAudioCatalogReleaseReviewBinding(fixture);
  assert(validateAssistLanguageAudioCatalogReleaseReviewBinding(created).length === 0, "valid release review binding must pass");
  assert(created.bindingId === `${fixture.tenantId}:${fixture.packageId}:${fixture.unitKey}:${fixture.reconciliationId}:${fixture.humanReviewPacketId}`, "release review binding identity must be deterministic");
  assert(created.approvalCaptureAllowed === false && created.productionApprovalAllowed === false && created.packagePromotionAllowed === false && created.studentProductionLaunchAllowed === false, "release review actions must remain blocked");
  assert(created.mode === "review-only" && created.sideEffect === "none", "release review binding must remain review-only and side-effect-free");
  assert(
    validateAssistLanguageAudioCatalogReleaseReviewBinding({ ...created, packagePromotionAllowed: true }).some((error) => error.includes("packagePromotionAllowed must remain false")),
    "promotion enablement must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogReleaseReviewBinding({ ...created, linkedRecords: ["package_publish_gate"] }).some((error) => error.includes("must link assist_language_audio_catalog_approval_reconciliation")),
    "missing assist-audio reconciliation record must be rejected",
  );

  for (const marker of [
    "Composite release review binding",
    "Assist audio cannot bypass release control",
    "Production approval blocked",
    "Linked records",
    "Open blockers",
    "Package promotion: no",
  ]) assert(panel.includes(marker), `release review panel missing marker: ${marker}`);

  for (const marker of [
    "buildAssistLanguageAudioCatalogReleaseReviewBindings",
    "TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel",
    "sampleWhiteLabelReleaseReadiness",
    "sampleControlledPilotHumanReviewPacket",
  ]) assert(route.includes(marker), `teacher media route missing marker: ${marker}`);

  console.log("PASS assist-language audio release review binding preserves composite release identity, human-review lineage, tenant scope, and blocked production actions.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
