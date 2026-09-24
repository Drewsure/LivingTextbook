import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const output = mkdtempSync(join(tmpdir(), "living-textbook-assist-audio-reviewer-binding-"));
const contract = readFileSync(new URL("../packages/content-model/src/assistLanguageAudioCatalogReviewerGateBinding.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../apps/web/src/features/multimedia/TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../apps/web/src/app/teacher/media/[tenantId]/page.tsx", import.meta.url), "utf8");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(output, "binding.js"), ts.transpileModule(contract, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");

  const {
    createReviewOnlyAssistLanguageAudioCatalogReviewerGateBinding,
    validateAssistLanguageAudioCatalogReviewerGateBinding,
  } = await import(pathToFileURL(join(output, "binding.js")).href);

  const fixture = {
    reconciliationId: "reconciliation-sample-publisher-package-unit-1",
    reviewerGateId: "sample-publisher-reviewer-identity-signature-gate",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-package",
    unitKey: "unit-1",
    status: "blocked-preview",
    gateIdentityStatus: "Reviewer identity blocked",
    gateSignatureStatus: "Signed approval capture blocked",
    gateApprovalCaptureStatus: "Approval intent preview only",
    requiredReviewerLanes: [
      "Authenticated reviewer identity lane",
      "Approval intent lane",
      "Signature policy lane",
      "Audit and retention lane",
    ],
    unresolvedRequirements: ["identity provider selected", "approval scope"],
    scopeDrift: [],
    blockedActions: [
      "No signed approval capture",
      "No approve button",
      "No release-state mutation",
      "No signature attachment upload",
      "No student assignment from approval",
      "No catalog admission from reviewer binding",
    ],
  };

  const created = createReviewOnlyAssistLanguageAudioCatalogReviewerGateBinding(fixture);
  assert(validateAssistLanguageAudioCatalogReviewerGateBinding(created).length === 0, "valid reviewer binding must pass");
  assert(created.bindingId === `${fixture.tenantId}:${fixture.packageId}:${fixture.unitKey}:${fixture.reconciliationId}:${fixture.reviewerGateId}`, "reviewer binding identity must be deterministic");
  assert(created.bindingComplete === false && created.approvalCaptureAllowed === false && created.releaseMutationAllowed === false, "reviewer binding must remain blocked");
  assert(created.mode === "review-only" && created.sideEffect === "none", "reviewer binding must remain review-only and side-effect-free");
  assert(
    validateAssistLanguageAudioCatalogReviewerGateBinding({ ...created, reviewerGateId: "" }).some((error) => error.includes("reviewerGateId is required")),
    "missing reviewer gate identity must be rejected",
  );
  assert(
    validateAssistLanguageAudioCatalogReviewerGateBinding({ ...created, releaseMutationAllowed: true }).some((error) => error.includes("must remain incomplete and approval-disabled")),
    "release mutation enablement must be rejected",
  );

  for (const marker of [
    "Reviewer gate binding",
    "Identity and signature gate remains closed",
    "Approval disabled",
    "Required reviewer lanes",
    "Unresolved requirements",
    "Binding complete: no",
  ]) assert(panel.includes(marker), `reviewer binding panel missing marker: ${marker}`);

  for (const marker of [
    "buildAssistLanguageAudioCatalogReviewerGateBindings",
    "TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel",
    "sampleReviewerIdentitySignatureGate",
    "reviewerGate",
  ]) assert(route.includes(marker), `teacher media route missing marker: ${marker}`);

  console.log("PASS assist-language audio reviewer gate binding preserves tenant scope, identity lanes, approval blockers, and no-release side effects.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
