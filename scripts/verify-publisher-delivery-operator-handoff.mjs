import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-delivery-operator-handoff.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherDeliveryOperatorHandoff.ts");
writeFileSync(output, ts.transpileModule(readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, "utf8");

try {
  const model = await import(`file://${output}`);
  const journey = {
    journeyId: "package:q:live-review-journey", tenantId: "publisher-a", quarantineId: "q-00000000-0000-4000-8000-000000000001",
    packageId: "publisher-a-l1-u1-package", sourceId: "quarantine-record:q-00000000-0000-4000-8000-000000000001", unitKey: "publisher-a:textbook:L1:U1",
    checksumSha256: "a".repeat(64), status: "blocked", reviewOnly: true,
    gates: [["source-admitted", "passed"], ["source-review-decision", "passed"], ["package-evidence", "passed"], ["package-review-packet", "passed"], ["delivery-mode", "passed"], ["promotion-adapter", "passed"], ["release-and-qr", "blocked"], ["teacher-rehearsal", "blocked"]].map(([gateId, status]) => ({ gateId, label: gateId, status, evidence: "Evidence", nextAction: "Next" })),
    blockedActions: ["No package assembly"], nextGateIds: ["release-and-qr", "teacher-rehearsal"], nextGates: ["Release and QR authorization: Next"],
    packageAssemblyAllowed: false, promotionAllowed: false, qrPrintAllowed: false, persistenceActivationAllowed: false, studentFacingUseAllowed: false,
  };
  const plan = model.createPublisherDeliveryOperatorHandoff({ journey, packetRecorded: true, assemblyPreflight: null, deliveryManifestPreview: null, releaseReceiptPreview: null, packageIndexPreview: null, releasePreflight: null });
  const errors = model.validatePublisherDeliveryOperatorHandoff(plan);
  if (errors.length > 0) failures.push(`valid operator handoff was rejected: ${errors.join(" ")}`);
  if (plan.actions.length !== 6) failures.push("operator handoff must contain six ordered actions");
  if (plan.nextActionIds[0] !== "release-and-qr-review") failures.push("release and QR must be the current operator action after upstream review passes");
  if (plan.packageAssemblyAllowed || plan.releaseWriteAllowed || plan.qrPrintAllowed || plan.persistenceActivationAllowed || plan.studentFacingUseAllowed) failures.push("operator handoff must keep all protected actions blocked");
  const duplicate = { ...plan, actions: [...plan.actions, plan.actions[0]] };
  if (!model.validatePublisherDeliveryOperatorHandoff(duplicate).some((error) => error.includes("six ordered actions"))) failures.push("duplicate action count must be rejected");
} finally { rmSync(output, { force: true }); }

const bridge = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherQuarantineHandoffBridgePanel.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "evidence", "PublisherDeliveryOperatorHandoffPanel.tsx"), "utf8");
const contract = readFileSync(sourcePath, "utf8");
for (const marker of ["createPublisherDeliveryOperatorHandoff", "validatePublisherDeliveryOperatorHandoff", "PublisherDeliveryOperatorHandoffPanel"]) if (!bridge.includes(marker)) failures.push(`live handoff bridge is missing marker: ${marker}`);
for (const marker of ["Operator delivery sequence", "Protected actions", "Next action IDs"]) if (!panel.includes(marker)) failures.push(`operator handoff panel is missing marker: ${marker}`);
for (const marker of ["No package assembly", "No student-facing use"]) if (!contract.includes(marker)) failures.push(`operator handoff contract is missing marker: ${marker}`);
if (panel.includes('type="file"') || panel.includes("fetch(") || panel.includes("method: \"POST\"")) failures.push("operator handoff panel must remain read-only");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS publisher delivery operator handoff derives one blocked, review-only action sequence from live gate state.");
