import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = mkdtempSync(join(tmpdir(), "living-textbook-qr-preview-"));
const failures = [];
const files = ["publisherPilotIntakeBrief", "publisherPilotQrPreview"];
const compile = (name) => ts.transpileModule(readFileSync(join(root, "packages", "content-model", "src", `${name}.ts`), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
for (const name of files) writeFileSync(join(output, `${name}.js`), compile(name), "utf8");

try {
  const model = createRequire(import.meta.url)(join(output, "publisherPilotQrPreview.js"));
  const brief = {
    recordVersion: 1,
    briefId: "brief-a",
    tenantId: "tenant-a",
    publisherName: "Publisher A",
    seriesName: "Series A",
    bookTitle: "Book A",
    edition: "2026",
    version: "1.0.0",
    targetLanguage: "en",
    supportLanguages: ["ja"],
    unitKey: "tenant-a:book:L1:U1",
    sourceOwner: "Publisher A",
    sourceFiles: ["source/unit-1.pdf"],
    mediaRequests: [{ kind: "audio", relativePath: "media/audio/unit-1.mp3", unitKey: "tenant-a:book:L1:U1", required: true, purpose: "Learning audio" }],
    evidenceRequests: [{ referenceId: "rights", kind: "rights", relativePath: "evidence/rights.md", appliesTo: ["source/unit-1.pdf"], required: true }],
    deliveryMode: "hybrid",
    hostedPersistenceOptIn: false,
    qrPageReferences: ["page-1"],
    qrReferences: [{ referenceId: "unit-1-entry", pageReference: "page-1", unitId: "unit-1", activitySlug: "unit-1-entry", targetType: "unit-launch", language: "en" }],
    retentionPolicy: "School policy",
    reportingPolicy: "Teacher reports",
    reviewOnly: true,
    packageAssemblyAllowed: false,
    studentFacingUseAllowed: false,
  };
  const preview = model.createPublisherPilotQrPreview(brief, "package-a");
  if (model.validatePublisherPilotQrPreview(preview).length !== 0) failures.push("valid QR preview must pass");
  if (preview.entries[0].printAllowed !== false || preview.productionPrintAllowed !== false || preview.sideEffect !== "none") failures.push("QR preview must stay print-blocked and side-effect-free");
  if (!preview.entries[0].aliasPath.startsWith("/q/tenant/tenant-a/") || !preview.entries[0].fallbackPath.startsWith("/local/package/tenant-a/package-a/1-0-0/")) failures.push("QR preview paths must be stable and package-bound");
  const duplicate = { ...brief, qrReferences: [brief.qrReferences[0], brief.qrReferences[0]] };
  try {
    model.createPublisherPilotQrPreview(duplicate, "package-a");
    failures.push("duplicate QR references must block preview creation");
  } catch {
    // Expected fail-closed behavior.
  }
} finally {
  rmSync(output, { recursive: true, force: true });
}

const panel = readFileSync(join(root, "apps", "web", "src", "features", "content-intake", "PublisherPilotQrPreviewPanel.tsx"), "utf8");
const route = readFileSync(join(root, "apps", "web", "src", "app", "teacher", "uploads", "[tenantId]", "page.tsx"), "utf8");
for (const marker of ["Publisher QR alias preview", "Print blocked", "Fallback mapped"]) if (!panel.includes(marker)) failures.push(`QR preview panel missing marker: ${marker}`);
if (!route.includes("PublisherPilotQrPreviewPanel") || !route.includes("samplePublisherPilotQrPreview")) failures.push("sample upload route must mount the QR preview panel");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS publisher pilot QR preview derives stable tenant/package aliases and remains print-blocked.");
