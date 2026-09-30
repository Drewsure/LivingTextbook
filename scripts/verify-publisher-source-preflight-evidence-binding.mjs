import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const failures = [];
const model = readFileSync(join(root, "packages", "content-model", "src", "publisherSourcePreflightEvidence.ts"), "utf8");
const store = readFileSync(join(root, "apps", "web", "src", "server", "uploads", "quarantineUploadStore.ts"), "utf8");
const route = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "source-preflight-evidence", "route.ts"), "utf8");
const sourceBinding = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "source-package-evidence-binding", "route.ts"), "utf8");
const readinessBinding = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "package-readiness-binding", "route.ts"), "utf8");

const modelModule = await import(pathToFileURL(join(root, "packages", "content-model", "src", "publisherSourcePreflightEvidence.ts")).href);
const good = modelModule.createPublisherSourcePreflightEvidenceRecord({
  tenantId: "sample",
  quarantineId: "q-00000000-0000-4000-8000-000000000000",
  packageId: "sample:unit-1",
  reportId: "sample:unit-1:source-preflight",
  manifestId: "manifest-sample-v1",
  version: "1.0.0",
  sourceAssetId: "source-unit-1",
  sourceRelativePath: "units/unit-1.pdf",
  sourceUnitKey: "unit-1",
  sourceChecksumSha256: `sha256:${"a".repeat(64)}`,
  manifestChecksumSha256: `sha256:${"b".repeat(64)}`,
  inventoryChecksumSha256: `sha256:${"c".repeat(64)}`,
  declaredAssetCount: 3,
  verifiedAssetCount: 3,
  capturedAt: "2026-10-01T00:00:00.000Z",
});
if (modelModule.validatePublisherSourcePreflightEvidenceRecord(good).length) failures.push("valid source preflight evidence record was rejected");
if (good.packageAssemblyAllowed || good.packagePromotionAllowed || good.qrPrintAllowed || good.hostedPersistenceActivationAllowed || good.studentFacingUseAllowed) failures.push("protected actions are not blocked");
if (!modelModule.validatePublisherSourcePreflightEvidenceRecord({ ...good, sourceChecksumSha256: "sha256:bad" }).length) failures.push("tampered source checksum was accepted");
if (!modelModule.validatePublisherSourcePreflightEvidenceRecord({ ...good, verifiedAssetCount: 4 }).length) failures.push("verified count above declared count was accepted");

for (const marker of ["source-preflight-evidence.json", "LIVING_TEXTBOOOK_SOURCE_PREFLIGHT_EVIDENCE_ENABLED", "writeQuarantineSourcePreflightEvidence", "readQuarantineSourcePreflightEvidence"]) if (!store.includes(marker)) failures.push(`quarantine store is missing marker: ${marker}`);
for (const marker of ["validatePublisherSourcePackagePreflightReport", "readQuarantineUploadRecords", "sourceChecksum", "inventoryChecksumSha256", "review-only", "studentFacingUseAllowed: false"]) if (!route.includes(marker)) failures.push(`source preflight evidence route is missing marker: ${marker}`);
if (route.includes("payload.") || route.includes("readFile(")) failures.push("source preflight evidence route must not return payload bytes");
for (const binding of [sourceBinding, readinessBinding]) for (const marker of ["readQuarantineSourcePreflightEvidence", "preflightReference"]) if (!binding.includes(marker)) failures.push(`live binding is missing marker: ${marker}`);
if (failures.length) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS publisher source preflight evidence is validated, quarantine-bound, durable, and review-only.");
