import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const output = mkdtempSync(join(tmpdir(), "living-textbook-storage-reconciliation-"));
const source = readFileSync(new URL("../packages/content-model/src/evidenceAttachmentStorageReconciliation.ts", import.meta.url), "utf8");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(output, "reconciliation.js"), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");

  const {
    createEvidenceAttachmentStorageReconciliation,
    validateEvidenceAttachmentStorageReconciliation,
  } = await import(pathToFileURL(join(output, "reconciliation.js")).href);

  const fixture = {
    tenantId: "sample-publisher",
    packageId: "sample-publisher-l1-u1-routines-package",
    storageBindingId: "sample-publisher-l1-u1-routines-package:attachment-storage-plan:selection-gate",
    status: "blocked-preview",
    assetPacketIds: ["asset-evidence-labelled-diagram", "asset-evidence-media"],
    attachmentIds: ["attachment-image", "attachment-audio", "attachment-video"],
    candidateIds: ["hosted-managed-evidence", "closed-local-evidence", "hybrid-export-evidence"],
    unresolvedGates: ["Tenant storage policy", "Rights and retention review"],
    blockedActions: ["No per-asset storage selection", "No attachment upload", "No student-facing attachment"],
  };

  const created = createEvidenceAttachmentStorageReconciliation(fixture);
  assert(validateEvidenceAttachmentStorageReconciliation(created).length === 0, "valid reconciliation must pass");
  assert(created.reconciliationId === `${fixture.packageId}:${fixture.storageBindingId}`, "reconciliation identity must be deterministic");
  assert(created.storageSelectionAllowed === false && created.uploadAllowed === false, "storage selection and upload must remain blocked");
  assert(created.downloadAllowed === false && created.promotionAllowed === false, "download and promotion must remain blocked");
  assert(created.mode === "review-only" && created.sideEffect === "none", "reconciliation must be review-only and side-effect-free");

  assert(
    validateEvidenceAttachmentStorageReconciliation({ ...created, assetPacketIds: [created.assetPacketIds[0], created.assetPacketIds[0]] })
      .some((error) => error.includes("assetPacketIds must not contain duplicates")),
    "duplicate asset packet identities must be rejected",
  );
  assert(
    validateEvidenceAttachmentStorageReconciliation({ ...created, storageSelectionAllowed: true })
      .some((error) => error.includes("storageSelectionAllowed must remain false")),
    "provider-selection enablement must be rejected",
  );
  assert(
    validateEvidenceAttachmentStorageReconciliation({ ...created, tenantId: "other-tenant" }).length === 0,
    "standalone reconciliation validation should preserve identity for the handoff scope validator",
  );

  console.log("PASS evidence attachment storage reconciliation preserves deterministic identity, unique asset coverage, blocked provider selection, and side-effect-free review semantics.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
