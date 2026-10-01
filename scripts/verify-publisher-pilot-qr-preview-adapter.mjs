import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = mkdtempSync(join(tmpdir(), "living-textbook-qr-adapter-"));
const compile = (name) => ts.transpileModule(readFileSync(join(root, "packages", "content-model", "src", `${name}.ts`), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

for (const name of ["publisherPilotIntakeBrief", "publisherPilotQrPreview", "publisherPilotQrPreviewAdapter"]) {
  writeFileSync(join(output, `${name}.js`), compile(name), "utf8");
}

const model = createRequire(import.meta.url)(join(output, "publisherPilotQrPreviewAdapter.js"));
const previewModel = createRequire(import.meta.url)(join(output, "publisherPilotQrPreview.js"));
const brief = {
  recordVersion: 1,
  briefId: "brief-adapter",
  tenantId: "tenant-a",
  publisherName: "Publisher A",
  seriesName: "Series A",
  bookTitle: "Book A",
  edition: "2026",
  version: "2026.1-review-preview",
  targetLanguage: "en",
  supportLanguages: [],
  unitKey: "tenant-a:book:L1:U1",
  sourceOwner: "Publisher A",
  sourceFiles: ["source/unit-1.pdf"],
  mediaRequests: [{ kind: "audio", relativePath: "media/audio/unit-1.mp3", unitKey: "tenant-a:book:L1:U1", required: true, purpose: "Learning audio" }],
  evidenceRequests: [{ referenceId: "rights", kind: "rights", relativePath: "evidence/rights.md", appliesTo: ["source/unit-1.pdf"], required: true }],
  deliveryMode: "hybrid",
  hostedPersistenceOptIn: false,
  qrPageReferences: ["page-1"],
  qrReferences: [{ referenceId: "unit-1-entry", pageReference: "page-1", unitId: "unit-1", activitySlug: "hello-friends", targetType: "unit-launch", language: "en" }],
  retentionPolicy: "School policy",
  reportingPolicy: "Teacher reports",
  reviewOnly: true,
  packageAssemblyAllowed: false,
  studentFacingUseAllowed: false,
};
const preview = previewModel.createPublisherPilotQrPreview(brief, "package-a");
const adapted = model.createPublisherPilotPackageQrPreviewsFromIntakePreview(preview, {
  tenantId: "tenant-a",
  packageId: "package-a",
  version: "2026.1-review-preview",
});
if (adapted.length !== 1 || adapted[0].printedQrId !== "qr-tenant-a-unit-1-entry") throw new Error("QR adapter must preserve the structured printed QR identity.");
if (adapted[0].printAllowed !== false || adapted[0].status !== "draft-only") throw new Error("QR adapter must remain print-blocked.");
if (!adapted[0].aliasPath.startsWith("/q/tenant/tenant-a/") || !adapted[0].fallbackPath.startsWith("/local/package/tenant-a/package-a/")) throw new Error("QR adapter must preserve bound paths.");

const packagePreviewSource = readFileSync(join(root, "apps", "web", "src", "data", "samplePublisherPilotPackagePreview.ts"), "utf8");
if (!packagePreviewSource.includes("createPublisherPilotPackageQrPreviewsFromIntakePreview(samplePublisherPilotQrPreview")) {
  throw new Error("Sample Publisher package preview must consume the structured QR adapter.");
}

try {
  model.createPublisherPilotPackageQrPreviewsFromIntakePreview(preview, { tenantId: "other-tenant", packageId: "package-a", version: "2026.1-review-preview" });
  throw new Error("tenant drift must block QR adapter");
} catch (error) {
  if (!String(error.message).includes("tenant")) throw error;
}

rmSync(output, { recursive: true, force: true });
console.log("PASS publisher QR intake preview adapts into package review while preserving identity and print blocking.");
