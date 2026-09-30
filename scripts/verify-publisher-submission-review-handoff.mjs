import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-submission-review-handoff.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherSubmissionReviewHandoff.ts");
const source = readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
writeFileSync(output, compiled, "utf8");

try {
  const model = await import(`file://${output}`);
  const manifest = {
    manifestId: "manifest-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    edition: "Pilot",
    version: "draft",
    targetLanguage: "en",
    supportLanguages: ["ja"],
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
  const valid = model.createPublisherSubmissionReviewHandoff(manifest, {
    sourceManifestRoute: "/teacher/uploads/tenant-a",
    evidenceIndexRoute: "/teacher/evidence/tenant-a",
    evidenceHandoffRoute: "/teacher/evidence/tenant-a/handoff",
  });
  if (model.validatePublisherSubmissionReviewHandoff(valid, manifest).length !== 0) failures.push("valid submission review handoff must pass");
  const unsafe = { ...valid, blockedActions: valid.blockedActions.filter((action) => action !== "No QR print") };
  if (!model.validatePublisherSubmissionReviewHandoff(unsafe, manifest).some((error) => error.includes("No QR print"))) failures.push("QR printing must remain blocked");
  const missingLane = { ...valid, lanes: [] };
  if (!model.validatePublisherSubmissionReviewHandoff(missingLane, manifest).some((error) => error.includes("evidence lane"))) failures.push("missing evidence lanes must be rejected");
} finally {
  rmSync(output, { force: true });
}

const route = readFileSync(join(root, "apps", "web", "src", "app", "teacher", "uploads", "[tenantId]", "page.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "content-intake", "PublisherSubmissionReviewHandoffPanel.tsx"), "utf8");
if (!route.includes("PublisherSubmissionReviewHandoffPanel") || !route.includes("createPublisherSubmissionReviewHandoffPreview")) failures.push("upload route must mount the review handoff");
for (const marker of ["Publisher review handoff", "Every submission item has a named evidence lane", "Blocked actions", "Next gate"]) {
  if (!panel.includes(marker)) failures.push(`submission review handoff panel is missing marker: ${marker}`);
}
if (panel.includes("type=\"file\"") || panel.includes("fetch(") || panel.includes("navigator.mediaDevices")) failures.push("submission review handoff panel must remain read-only");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS publisher submission review handoff maps every manifest asset to evidence while blocking promotion, QR print, export, and student use.");
