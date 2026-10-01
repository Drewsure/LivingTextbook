import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-delivery-assembly-request-preview.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherDeliveryAssemblyRequestPreview.ts");
writeFileSync(output, ts.transpileModule(readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, "utf8");

try {
  const model = await import(`file://${output}`);
  const preview = model.createPublisherDeliveryAssemblyRequestPreview({
    tenantId: "publisher-a", quarantineId: "q-00000000-0000-4000-8000-000000000001", packageId: "publisher-a-l1-u1-package",
    sourceChecksumSha256: "a".repeat(64), selectedMode: "closed-local", sourcePreflightEvidencePresent: true, reviewedPackageEvidencePresent: true, canonicalGameEvidenceComplete: true, deliveryManifestPresent: false,
    releaseReceiptPresent: false, qrRegistryPresent: false, packageIndexPresent: false, bundleManifestPresent: false,
    reviewedBundleManifestPresent: false, reviewPacketBound: true, operatorAndWriteTimePresent: false,
  });
  const errors = model.validatePublisherDeliveryAssemblyRequestPreview(preview);
  if (errors.length > 0) failures.push(`valid assembly preview was rejected: ${errors.join(" ")}`);
  if (preview.inputs.length !== 11) failures.push("assembly preview must expose eleven writer inputs including reviewed package and canonical game evidence");
  if (preview.inputs.filter((input) => input.status === "present").length !== 4) failures.push("assembly preview must preserve source, package evidence, canonical game, and review-packet lineage inputs");
  if (preview.packageAssemblyAllowed || preview.qrPrintArtifactIncluded || preview.studentFacingActivationAllowed || preview.hostedPersistenceActivated) failures.push("assembly preview must keep all protected actions blocked");
  const tampered = { ...preview, inputs: preview.inputs.slice(0, 6) };
  if (!model.validatePublisherDeliveryAssemblyRequestPreview(tampered).some((error) => error.includes("all required writer inputs"))) failures.push("missing writer inputs must be rejected");
} finally { rmSync(output, { force: true }); }

const route = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "package-readiness-binding", "route.ts"), "utf8");
const bridge = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherQuarantineHandoffBridgePanel.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherDeliveryAssemblyRequestPreviewPanel.tsx"), "utf8");
const contentModel = readFileSync(join(root, "packages", "content-model", "src", "localBundleManifestReviewSummary.ts"), "utf8");
const contentModelIndex = readFileSync(join(root, "packages", "content-model", "src", "index.ts"), "utf8");
for (const marker of ["createPublisherDeliveryAssemblyRequestPreview", "sourcePreflightEvidencePresent", "reviewedPackageEvidencePresent", "canonicalGameEvidenceComplete", "reviewedBundleManifestPresent", "readLocalBundleManifestReview", "summarizeReviewedBundleManifest", "validateLocalBundleManifestReviewSummary", "assemblyRequestPreview", "validatePublisherDeliveryAssemblyRequestPreview"]) if (!route.includes(marker)) failures.push(`readiness route is missing marker: ${marker}`);
for (const marker of ["PublisherDeliveryAssemblyRequestPreviewPanel", "LiveReviewedBundleManifestSummary", "reviewedBundleManifest", "assemblyRequestPreview"]) if (!bridge.includes(marker)) failures.push(`live handoff bridge is missing marker: ${marker}`);
for (const marker of ["Local package assembly request preview", "Exact writer inputs", "Protected actions"]) if (!panel.includes(marker)) failures.push(`assembly preview panel is missing marker: ${marker}`);
for (const marker of ["LocalBundleManifestReviewSummary", "validateLocalBundleManifestReviewSummary", "metadata-only"]) if (!contentModel.includes(marker)) failures.push(`shared custody summary contract is missing marker: ${marker}`);
if (!contentModelIndex.includes('export * from "./localBundleManifestReviewSummary"')) failures.push("shared custody summary must be exported from the content-model package root");
if (panel.includes("fetch(") || panel.includes('type="file"') || panel.includes("method: \"POST\"")) failures.push("assembly preview panel must remain read-only");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS publisher delivery assembly request preview enumerates eleven writer inputs, including package evidence, canonical game evidence, source preflight lineage, and reviewed bundle-manifest custody, and remains blocked, review-only, and side-effect-free.");
