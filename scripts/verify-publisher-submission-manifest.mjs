import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-submission-manifest.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherSubmissionManifest.ts");
const source = readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
writeFileSync(output, compiled, "utf8");

try {
  const model = await import(`file://${output}`);
  const valid = {
    manifestId: "manifest-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    edition: "Pilot",
    version: "draft",
    targetLanguage: "en",
    supportLanguages: ["ja"],
    evidenceRequests: [{
      referenceId: "rights-evidence",
      kind: "rights",
      relativePath: "evidence/rights.md",
      appliesToAssetIds: ["source-a"],
      required: true,
      status: "missing",
    }],
    reviewOnly: true,
    filePromotionAllowed: false,
    studentFacingUseAllowed: false,
    assets: [{
      assetId: "source-a",
      kind: "textbook-source",
      label: "Unit source",
      required: true,
      unitKey: "tenant-a:L1:U1",
      acceptedTypes: ["pdf"],
      rightsEvidenceRequired: true,
      accessibilityEvidenceRequired: true,
      status: "missing",
      nextGate: "Source review",
    }],
  };
  if (model.validatePublisherSubmissionManifest(valid).length !== 0) failures.push("valid submission manifest must pass");
  const unsafe = { ...valid, filePromotionAllowed: true };
  if (!model.validatePublisherSubmissionManifest(unsafe).some((error) => error.includes("filePromotionAllowed"))) failures.push("promotion must remain blocked");
  const duplicate = { ...valid, assets: [valid.assets[0], { ...valid.assets[0] }] };
  if (!model.validatePublisherSubmissionManifest(duplicate).some((error) => error.includes("Duplicate"))) failures.push("duplicate asset ids must be rejected");
} finally {
  rmSync(output, { force: true });
}

const route = readFileSync(join(root, "apps", "web", "src", "app", "teacher", "uploads", "[tenantId]", "page.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "content-intake", "PublisherSubmissionManifestPanel.tsx"), "utf8");
const template = readFileSync(join(root, "apps", "web", "src", "data", "publisherSubmissionManifest.ts"), "utf8");
if (!route.includes("PublisherSubmissionManifestPanel") || !route.includes("createPublisherSubmissionManifestTemplate")) failures.push("upload route must mount the submission manifest");
if (!route.includes("createPublisherSubmissionManifestFromPilotIntake") || !route.includes("samplePublisherPilotIntakeBrief")) failures.push("sample publisher route must use the canonical intake-to-manifest adapter");
for (const marker of ["Publisher submission manifest", "Promotion blocked", "Student use blocked", "Support languages"]) {
  if (!panel.includes(marker)) failures.push(`submission manifest panel is missing marker: ${marker}`);
}
if (panel.includes("type=\"file\"") || panel.includes("fetch(") || panel.includes("navigator.mediaDevices")) failures.push("submission manifest panel must remain read-only");
for (const marker of [
  '["pdf", "docx", "txt", "md", "csv"]',
  '["png", "jpg", "jpeg", "webp", "svg"]',
  '["mp3", "wav", "m4a", "ogg"]',
  '["mp4", "webm", "mov"]',
  '["mp3", "wav", "m4a", "ogg", "mp4", "webm", "mov"]',
]) {
  if (!template.includes(marker)) failures.push(`submission manifest template is missing supported format lane: ${marker}`);
}
if (template.includes('["mp4", "webm", "jpg", "png"]')) failures.push("video lane must not mix poster image formats with video formats");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS publisher submission manifest validates tenant/package input shape, rights/accessibility requirements, and review-only boundaries.");
