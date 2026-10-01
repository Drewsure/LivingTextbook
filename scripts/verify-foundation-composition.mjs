import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

execFileSync(process.execPath, [fileURLToPath(new URL("./verify-long-term-build-plan.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-standards-integrity.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-human-evidence.mjs", import.meta.url)), "--self-test"], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./create-pilot-human-evidence-packet.mjs", import.meta.url)), "--self-test"], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-package-assembler.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-package-operator-behavior.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-package-runtime-reader.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-package-runtime-route.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-companion-release-continuity.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-package-content-reader.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-memory-route.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-front-door-route.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-media-route.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-teacher-evidence-route.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-pilot-qr-review-route.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-curated-pathway-boundary.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-content-model-public-boundary.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-locale-independent-content-matching.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-evidence-tenant-key.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-local-evidence-runtime.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-cross-route-persistence.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-durable-progression-storage.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-durable-progression-database-path.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-upload-quarantine-filesystem-boundary.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./create-publisher-source-manifest.mjs", import.meta.url)), "--self-test"], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-publisher-pilot-source-manifest-bridge.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-publisher-pilot-package-preview.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-durable-progression-operations.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-teacher-operations-authorization.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-persistence-adapter-seam.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-shared-app-shell-accessibility.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-audio-accessibility.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-app-shell-navigation.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-edition-qr-alias-resolver.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-qr-alias-rollback-boundary.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-qr-alias-backend-alignment.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-qr-alias-preview-integration.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-qr-print-preview-integration.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-qr-print-authorization-preflight.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-qr-alias-registry-writer-behavior.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-deployment-decision.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-persistence-activation-preflight.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-handoff-scope.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-evidence-handoff-scope.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-evidence-storage-reconciliation.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-evidence-storage-selection-review.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-review-decision-persistence.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-review-decision-snapshot.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-review-decision-snapshot-runtime.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-review-decision-retention-policy.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-pilot-review-decision-implementation-readiness.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-persistence-provider-selection-preflight.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-persistence-provider-selection-preflight-behavior.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-hosted-persistence-opt-in-decision-packet.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-deployment-decision-workbench.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-phaser-candidate-integration-eligibility.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-phaser-candidate-evidence-return.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-phaser-candidate-evidence-return-behavior.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-phaser-candidate-evidence-adjudication.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-white-label-release-readiness.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-white-label-release-readiness-behavior.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-upload-quarantine-package-review-packet.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-upload-quarantine-package-assembly-preflight.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-publisher-pilot-package-readiness-binding.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-live-delivery-manifest-preview.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-live-release-receipt-preview.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-live-package-index-preview.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-live-review-decision-binding.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-live-release-lineage-boundary.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-delivery-mode-decision.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-promotion-adapter-decision.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-package-review-packet-revision.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-package-evidence-review.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-package-evidence-review-behavior.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, ["--experimental-strip-types", "--experimental-specifier-resolution=node", fileURLToPath(new URL("./verify-pilot-delivery-manifest-behavior.mjs", import.meta.url))], {
  stdio: "inherit",
});

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const scripts = packageJson.scripts ?? {};
const webPackageJson = JSON.parse(readFileSync(new URL("../apps/web/package.json", import.meta.url), "utf8"));
const auditSource = readFileSync(new URL("./audit-first-saleable-pilot.mjs", import.meta.url), "utf8");
const buildProofVerifierSource = readFileSync(new URL("./verify-production-build-proof.mjs", import.meta.url), "utf8");
const foundation = scripts["verify:foundation"] ?? "";
const requiredCommands = [
  "npm run verify:content-model-boundary",
  "npm run verify:ai-service",
  "npm run verify:phaser-source-evidence-contract",
  "npm run verify:phaser-scene-inventory",
  "npm run verify:persistence-runtime",
  "npm run verify:report-runtime",
  "npm run verify:asset-runtime",
  "npm run verify:content-package-runtime",
  "npm run verify:launch-runtime",
  "npm run verify:assignment-runtime",
  "npm run verify:source-runtime",
  "npm run verify:release-runtime",
  "npm run verify:recovery-runtime",
  "npm run verify:progression-runtime",
  "npm run verify:reward-runtime",
  "npm run verify:entitlement-runtime",
  "npm run verify:runtime-behavior",
  "npm run typecheck:ai-service",
  "npm run typecheck --workspace @living-textbook/web",
  "npm run build --workspace @living-textbook/web",
  "npm run verify:routes",
  "npm run verify:deployment",
];
const missing = requiredCommands.filter((command) => !foundation.includes(command));

if (typeof scripts["verify:ai-service"] !== "string") missing.push("scripts.verify:ai-service");
if (typeof scripts["verify:persistence-runtime"] !== "string") missing.push("scripts.verify:persistence-runtime");
if (typeof scripts["typecheck:ai-service"] !== "string") missing.push("scripts.typecheck:ai-service");
if (webPackageJson.scripts?.postbuild !== "node ../../scripts/write-production-build-proof.mjs") missing.push("apps/web postbuild source-bound proof hook");
if (scripts["verify:production-build-proof"] !== "node scripts/verify-production-build-proof.mjs") missing.push("scripts.verify:production-build-proof");
if (!auditSource.includes("verify-production-build-proof.mjs") || !auditSource.includes('productionBuildReport?.status === "proved"')) missing.push("saleability audit source-bound build proof gate");
if (!buildProofVerifierSource.includes("sourceRevision") || !buildProofVerifierSource.includes("buildId")) missing.push("production build proof identity checks");

if (missing.length > 0) {
  for (const item of missing) console.error(`FAIL foundation composition missing: ${item}`);
  process.exit(1);
}

console.log(`PASS foundation composition includes ${requiredCommands.length} critical runtime, type, build, route, and deployment checks plus the stable QR resolver, evidence handoff, storage reconciliation, and storage selection review guards.`);
