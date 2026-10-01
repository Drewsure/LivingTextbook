import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-submission-package-evidence-reconciliation.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherSubmissionPackageEvidenceReconciliation.ts");
const source = readFileSync(sourcePath, "utf8");
writeFileSync(output, ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, "utf8");

try {
  const model = await import(`file://${output}`);
  const manifest = {
    manifestId: "manifest-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    assets: [{ assetId: "source-a", kind: "textbook-source" }],
    evidenceRequests: [
      { referenceId: "rights-evidence", appliesToAssetIds: ["source-a"] },
      { referenceId: "accessibility-evidence", appliesToAssetIds: ["source-a"] },
      { referenceId: "scan-evidence", appliesToAssetIds: ["source-a"] },
    ],
  };
  const reconciliation = {
    reconciliationId: "reconciliation-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    manifestId: "manifest-a",
    packageEvidenceReviewRecord: "upload_quarantine_package_evidence_review",
    status: "blocked",
    lanes: model.PUBLISHER_SUBMISSION_PACKAGE_EVIDENCE_LANES.map((lane) => ({
      lane,
      status: lane === "content" ? "review-pending" : "missing",
      sourceAssetIds: lane === "content" ? ["source-a"] : [],
      publisherEvidenceRequestIds: lane === "content" ? ["rights-evidence", "accessibility-evidence", "scan-evidence"] : [],
      derivedEvidenceRecordIds: lane === "game" ? ["curated_activity_pathway_packet", "canonical_game_integration_packet", "package_game_audio_coverage"] : [],
      requiredEvidence: ["Review reference"],
    })),
    unresolvedRequirements: ["game evidence is missing"],
    blockedActions: ["No package assembly", "No file promotion", "No QR print", "No student-facing use"],
    nextGate: ["Attach evidence references"],
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
  };
  if (model.validatePublisherSubmissionPackageEvidenceReconciliation(reconciliation, manifest).length !== 0) failures.push("valid reconciliation must pass");
  const unsafe = { ...reconciliation, qrPrintAllowed: true };
  if (!model.validatePublisherSubmissionPackageEvidenceReconciliation(unsafe, manifest).some((error) => error.includes("qrPrintAllowed"))) failures.push("QR printing must remain blocked");
  const incomplete = { ...reconciliation, lanes: reconciliation.lanes.slice(0, 7) };
  if (!model.validatePublisherSubmissionPackageEvidenceReconciliation(incomplete, manifest).some((error) => error.includes("every canonical lane"))) failures.push("canonical lane completeness must be enforced");
  const invalidDerived = { ...reconciliation, lanes: reconciliation.lanes.map((lane) => lane.lane === "game" ? { ...lane, derivedEvidenceRecordIds: [""] } : lane) };
  if (!model.validatePublisherSubmissionPackageEvidenceReconciliation(invalidDerived, manifest).some((error) => error.includes("derived evidence"))) failures.push("derived evidence ids must be validated");
  const gameUpload = { ...reconciliation, lanes: reconciliation.lanes.map((lane) => lane.lane === "game" ? { ...lane, sourceAssetIds: ["source-a"] } : lane) };
  if (!model.validatePublisherSubmissionPackageEvidenceReconciliation(gameUpload, manifest).some((error) => error.includes("must not claim publisher source assets"))) failures.push("game lane must remain derived-only");
  const mediaDerived = { ...reconciliation, lanes: reconciliation.lanes.map((lane) => lane.lane === "audio" ? { ...lane, derivedEvidenceRecordIds: ["derived-audio"] } : lane) };
  if (!model.validatePublisherSubmissionPackageEvidenceReconciliation(mediaDerived, manifest).some((error) => error.includes("must not claim platform-derived"))) failures.push("media lanes must remain publisher-owned");
  const incompleteGame = { ...reconciliation, lanes: reconciliation.lanes.map((lane) => lane.lane === "game" ? { ...lane, derivedEvidenceRecordIds: ["curated_activity_pathway_packet"] } : lane) };
  if (!model.validatePublisherSubmissionPackageEvidenceReconciliation(incompleteGame, manifest).some((error) => error.includes("canonical_game_integration_packet"))) failures.push("game lane must include the canonical derived evidence set");
  const unknownPublisherEvidence = { ...reconciliation, lanes: reconciliation.lanes.map((lane) => lane.lane === "content" ? { ...lane, publisherEvidenceRequestIds: ["unknown-evidence"] } : lane) };
  if (!model.validatePublisherSubmissionPackageEvidenceReconciliation(unknownPublisherEvidence, manifest).some((error) => error.includes("unknown publisher evidence"))) failures.push("unknown publisher evidence must be rejected");
} finally {
  rmSync(output, { force: true });
}

const route = readFileSync(join(root, "apps", "web", "src", "app", "teacher", "uploads", "[tenantId]", "page.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "content-intake", "PublisherSubmissionPackageEvidenceReconciliationPanel.tsx"), "utf8");
for (const marker of ["PublisherSubmissionPackageEvidenceReconciliationPanel", "createPublisherSubmissionPackageEvidenceReconciliation", "validatePublisherSubmissionPackageEvidenceReconciliationPreview"]) if (!route.includes(marker)) failures.push(`upload route is missing reconciliation marker: ${marker}`);
for (const marker of ["Package evidence reconciliation", "Manifest coverage against the canonical review packet", "Assembly blocked", "Unresolved requirements", "Canonical lane", "Publisher evidence", "Derived evidence"]) if (!panel.includes(marker)) failures.push(`reconciliation panel is missing marker: ${marker}`);
if (panel.includes("type=\"file\"") || panel.includes("fetch(") || panel.includes("navigator.mediaDevices")) failures.push("reconciliation panel must remain read-only");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS publisher submission evidence reconciliation covers all canonical package lanes and remains assembly, promotion, QR, and student blocked.");
