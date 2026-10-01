import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-delivery-handoff-record.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherDeliveryHandoffRecord.ts");
writeFileSync(output, ts.transpileModule(readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, "utf8");

try {
  const model = await import(`file://${output}`);
  const record = model.createPublisherDeliveryHandoffRecord({
    tenantId: "publisher-a",
    quarantineId: "q-00000000-0000-4000-8000-000000000001",
    packageId: "publisher-a-l1-u1-package",
    sourceChecksumSha256: "a".repeat(64),
    selectedMode: "closed-local",
    sourceReviewPassed: true,
    sentenceApprovalPassed: true,
    packageReviewPacketId: "publisher-a-l1-u1-package:q-00000000-0000-4000-8000-000000000001:package-review-packet",
    packageReviewPacketReady: true,
    packageEvidenceReview: null,
    deliveryManifestPreviewId: "publisher-a-l1-u1-package:delivery-manifest-preview",
    releaseReceiptPreviewId: "publisher-a-l1-u1-package:release-receipt-preview",
    packageIndexPreviewId: "publisher-a-l1-u1-package:package-index-preview",
    assemblyRequestPreviewId: "publisher-a-l1-u1-package:assembly-request-preview",
    qrRegistryId: null,
  });
  const errors = model.validatePublisherDeliveryHandoffRecord(record);
  if (errors.length > 0) failures.push(`valid handoff record was rejected: ${errors.join(" ")}`);
  if (record.evidence.length !== 9) failures.push("handoff record must bind nine evidence references");
  if (record.evidence.some((item) => !item.origin)) failures.push("handoff evidence must preserve origin");
  if (record.packageEvidence.status !== "not-recorded") failures.push("null package evidence must remain not-recorded");
  if (record.includedMetadataFiles.length !== 0) failures.push("review-only handoff must include no files");
  if (record.rawPayloadIncluded || record.learnerRecordsIncluded || record.qrPrintArtifactCreated || record.packageAssemblyAllowed || record.releaseWriteAllowed || record.qrPrintAllowed || record.persistenceActivationAllowed || record.studentFacingUseAllowed) failures.push("handoff record must keep every protected action disabled");
  const tampered = { ...record, status: "delivered" };
  if (!model.validatePublisherDeliveryHandoffRecord(tampered).some((error) => error.includes("blocked, review-only"))) failures.push("delivered status must be rejected");
  const filesTampered = { ...record, includedMetadataFiles: ["handoff-record.json"] };
  if (!model.validatePublisherDeliveryHandoffRecord(filesTampered).some((error) => error.includes("must not claim metadata files"))) failures.push("included metadata files must be rejected before release");
} finally {
  rmSync(output, { force: true });
}

const route = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "package-readiness-binding", "route.ts"), "utf8");
const bridge = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherQuarantineHandoffBridgePanel.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherDeliveryHandoffRecordPanel.tsx"), "utf8");
const samplePage = readFileSync(join(root, "apps", "web", "src", "app", "teacher", "evidence", "[tenantId]", "handoff", "page.tsx"), "utf8");
const sampleData = readFileSync(join(root, "apps", "web", "src", "data", "samplePublisherDeliveryHandoffRecord.ts"), "utf8");
for (const marker of ["createPublisherDeliveryHandoffRecord", "deliveryHandoffRecord", "validatePublisherDeliveryHandoffRecord"]) if (!route.includes(marker)) failures.push(`readiness route is missing marker: ${marker}`);
for (const marker of ["packageEvidenceReview", "packageEvidence"]) if (!route.includes(marker)) failures.push(`readiness route is missing provenance marker: ${marker}`);
for (const marker of ["PublisherDeliveryHandoffRecordPanel", "deliveryHandoffRecord"]) if (!bridge.includes(marker)) failures.push(`live handoff bridge is missing marker: ${marker}`);
for (const marker of ["Publisher delivery handoff evidence", "Package evidence provenance", "Expected metadata files", "Protection boundary"]) if (!panel.includes(marker)) failures.push(`handoff record panel is missing marker: ${marker}`);
for (const marker of ["PublisherDeliveryHandoffRecordPanel", "samplePublisherDeliveryHandoffRecord"]) if (!samplePage.includes(marker)) failures.push(`sample publisher handoff page is missing marker: ${marker}`);
for (const marker of ["createPublisherDeliveryHandoffRecord", "samplePublisherDeliveryHandoffRecordErrors"]) if (!sampleData.includes(marker)) failures.push(`sample publisher handoff data is missing marker: ${marker}`);
if (panel.includes("fetch(") || panel.includes('type="file"') || panel.includes("method: \"POST\"")) failures.push("handoff record panel must remain read-only");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS publisher delivery handoff record binds evidence identities and remains blocked, metadata-only, and side-effect-free.");
