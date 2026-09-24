import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const output = mkdtempSync(join(tmpdir(), "living-textbook-assist-audio-reconciliation-"));
const contractPath = "../packages/content-model/src/assistLanguageAudioCatalogApprovalReconciliation.ts";
const contract = readFileSync(new URL(contractPath, import.meta.url), "utf8");
const panel = readFileSync(new URL("../apps/web/src/features/multimedia/TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../apps/web/src/app/teacher/media/[tenantId]/page.tsx", import.meta.url), "utf8");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(output, "reconciliation.js"), ts.transpileModule(contract, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");

  const {
    createReviewOnlyAssistLanguageAudioCatalogApprovalReconciliation,
    validateAssistLanguageAudioCatalogApprovalReconciliation,
  } = await import(pathToFileURL(join(output, "reconciliation.js")).href);

  const fixture = {
    approvalPacketId: "assist-audio-approval-sample-publisher-package-unit-1",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-package",
    unitKey: "unit-1",
    catalogRecordIds: ["catalog-a", "catalog-b"],
    evidenceRecordIds: ["catalog-a", "catalog-b"],
    linkedStorageRecords: [
      "assist_language_audio_catalog_admission",
      "teacher_approval_ledger",
      "media_rights_evidence_attachment",
      "local_or_hosted_delivery_binding",
    ],
    identityChecks: [
      "Approval packet tenant matches every catalog record",
      "Approval packet package matches every catalog record",
      "Approval packet unit matches every catalog record",
      "Catalog record identities are unique and complete",
    ],
    identityDrift: [],
    unresolvedEvidence: ["Rights review remains open."],
    status: "blocked-preview",
    approvalDecision: "not-recorded",
    blockedActions: [
      "No approval capture",
      "No catalog admission",
      "No hosted media promotion",
      "No local bundle activation",
      "No student-facing assist audio",
      "No speech API billing",
    ],
  };

  const created = createReviewOnlyAssistLanguageAudioCatalogApprovalReconciliation(fixture);
  assert(validateAssistLanguageAudioCatalogApprovalReconciliation(created).length === 0, "valid reconciliation must pass");
  assert(created.reconciliationId === `${fixture.approvalPacketId}:${fixture.packageId}:${fixture.unitKey}`, "reconciliation identity must be deterministic");
  assert(created.reconciliationComplete === false && created.approvalCaptureAllowed === false, "reconciliation and approval capture must remain blocked");
  assert(created.catalogAdmissionAllowed === false && created.promotionAllowed === false && created.studentFacingAllowed === false, "catalog admission and promotion must remain blocked");
  assert(created.mode === "review-only" && created.sideEffect === "none", "reconciliation must remain review-only and side-effect-free");
  assert(
    validateAssistLanguageAudioCatalogApprovalReconciliation({ ...created, tenantId: "" }).some((error) => error.includes("tenantId is required")),
    "missing tenant identity must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogApprovalReconciliation({ ...created, linkedStorageRecords: ["teacher_approval_ledger"] }).some((error) => error.includes("must link assist_language_audio_catalog_admission")),
    "missing catalog admission record must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogApprovalReconciliation({ ...created, approvalCaptureAllowed: true }).some((error) => error.includes("approvalCaptureAllowed must remain false")),
    "approval capture enablement must be rejected",
  );

  for (const marker of [
    "Evidence reconciliation",
    "Approval packet and catalog identity check",
    "No release mutation",
    "Identity drift",
    "Unresolved evidence",
    "Reconciliation complete: no",
  ]) assert(panel.includes(marker), `reconciliation panel missing marker: ${marker}`);

  for (const marker of [
    "buildAssistLanguageAudioCatalogApprovalReconciliations",
    "TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel",
    "tenantCatalogRecords",
  ]) assert(route.includes(marker), `teacher media route missing marker: ${marker}`);

  console.log("PASS assist-language audio catalog reconciliation preserves identity, evidence, approval, promotion, and student-use boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
