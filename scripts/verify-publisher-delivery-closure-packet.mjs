import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-delivery-closure-packet.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherDeliveryClosurePacket.ts");
writeFileSync(output, ts.transpileModule(readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, "utf8");

try {
  const model = await import(`file://${output}`);
  const packet = model.createPublisherDeliveryClosurePacket({
    tenantId: "publisher-a", quarantineId: "q-00000000-0000-4000-8000-000000000001", packageId: "publisher-a-l1-u1-package",
    sourceId: "quarantine-record:q-00000000-0000-4000-8000-000000000001", sourceChecksumSha256: "a".repeat(64), selectedMode: "closed-local",
    sourceReviewPassed: true, packageEvidencePassed: true, reviewPacketPassed: true, assemblyPreflightPassed: false,
    deliveryModePassed: true, releaseReceiptPassed: false, qrAuthorizationPassed: false, packageIndexPassed: false, rollbackAndPolicyPassed: false,
  });
  const errors = model.validatePublisherDeliveryClosurePacket(packet);
  if (errors.length > 0) failures.push(`valid closure packet was rejected: ${errors.join(" ")}`);
  if (packet.checks.length !== 9) failures.push("closure packet must contain nine closure checks");
  if (packet.checks.find((check) => check.checkId === "assembly-preflight")?.status !== "blocked") failures.push("assembly preflight must remain blocked when unresolved");
  if (packet.releaseWriteAllowed || packet.packageAssemblyAllowed || packet.qrPrintAllowed || packet.persistenceActivationAllowed || packet.studentFacingUseAllowed) failures.push("closure packet must keep all protected actions blocked");
  const tampered = { ...packet, checks: packet.checks.slice(0, 8) };
  if (!model.validatePublisherDeliveryClosurePacket(tampered).some((error) => error.includes("all required closure checks"))) failures.push("missing closure checks must be rejected");
} finally { rmSync(output, { force: true }); }

const route = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "package-readiness-binding", "route.ts"), "utf8");
const bridge = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherQuarantineHandoffBridgePanel.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherDeliveryClosurePacketPanel.tsx"), "utf8");
for (const marker of ["createPublisherDeliveryClosurePacket", "deliveryClosurePacket", "validatePublisherDeliveryClosurePacket"]) if (!route.includes(marker)) failures.push(`readiness route is missing marker: ${marker}`);
for (const marker of ["PublisherDeliveryClosurePacketPanel", "deliveryClosurePacket"]) if (!bridge.includes(marker)) failures.push(`live handoff bridge is missing marker: ${marker}`);
for (const marker of ["Publisher delivery closure packet", "Required human inputs", "Protected actions"]) if (!panel.includes(marker)) failures.push(`closure packet panel is missing marker: ${marker}`);
if (panel.includes("fetch(") || panel.includes('type="file"') || panel.includes("method: \"POST\"")) failures.push("closure packet panel must remain read-only");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS publisher delivery closure packet binds nine release checks and remains blocked, review-only, and side-effect-free.");
