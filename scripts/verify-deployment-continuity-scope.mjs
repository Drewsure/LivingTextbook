import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-continuity-scope-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "deploymentContinuityDecision.ts"), "utf8");
writeFileSync(join(output, "deploymentContinuityDecision.js"), transpile(source), "utf8");
writeFileSync(join(output, "pilotDeploymentDecision.js"), "exports.validatePilotDeploymentDecision = () => [];\n", "utf8");
writeFileSync(join(output, "persistenceRecoveryRehearsal.js"), "exports.validatePersistenceRecoveryRehearsal = () => [];\n", "utf8");

try {
  const model = require(join(output, "deploymentContinuityDecision.js"));
  const pilotDeploymentDecision = {
    decisionId: "deployment-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    recommendedOptionId: "hosted-pwa",
    blockers: ["Policy remains incomplete."],
  };
  const recoveryRehearsal = {
    rehearsalId: "recovery-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    storageSelectionPreflightId: "preflight-a",
    storageSelectionGateId: "storage-gate-a",
    status: "blocked",
    modes: [
      { mode: "hosted-managed", openChecks: ["backup rehearsal"], reasons: [], sourceRecords: [] },
      { mode: "local-classroom", openChecks: ["restore rehearsal"], reasons: [], sourceRecords: [] },
      { mode: "hybrid", openChecks: ["export rehearsal"], reasons: [], sourceRecords: [] },
    ],
    reasons: [],
    sourceRecords: [],
  };
  const valid = model.deriveDeploymentContinuityDecision({
    decisionId: "continuity-a",
    pilotDeploymentDecision,
    recoveryRehearsal,
    storageSelectionPreflightId: "preflight-a",
    storageSelectionGateId: "storage-gate-a",
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
  });
  assert(valid.blockers.every((blocker) => !blocker.includes("must match the pilot deployment")), "matching recovery scope must not add a scope blocker");
  const wrongTenant = model.deriveDeploymentContinuityDecision({
    decisionId: "continuity-b",
    pilotDeploymentDecision,
    recoveryRehearsal: { ...recoveryRehearsal, tenantId: "tenant-b" },
    storageSelectionPreflightId: "preflight-a",
    storageSelectionGateId: "storage-gate-a",
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
  });
  assert(wrongTenant.status === "blocked", "recovery tenant drift must block continuity");
  assert(wrongTenant.blockers.some((blocker) => blocker.includes("must match the pilot deployment")), "recovery tenant drift must be explicit");
  const wrongPackage = model.deriveDeploymentContinuityDecision({
    decisionId: "continuity-c",
    pilotDeploymentDecision,
    recoveryRehearsal: { ...recoveryRehearsal, packageId: "package-b" },
    storageSelectionPreflightId: "preflight-a",
    storageSelectionGateId: "storage-gate-a",
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
  });
  assert(wrongPackage.status === "blocked", "recovery package drift must block continuity");
  console.log("PASS deployment continuity rejects recovery scope drift before deployment review.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function transpile(sourceText) {
  return ts.transpileModule(sourceText, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
