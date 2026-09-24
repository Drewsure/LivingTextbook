import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-continuity-handoff-storage-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "deploymentContinuityHandoff.ts"), "utf8");
writeFileSync(join(output, "deploymentContinuityHandoff.js"), transpile(source), "utf8");
writeFileSync(join(output, "deploymentContinuityDecision.js"), "exports.validateDeploymentContinuityDecision = () => [];\n", "utf8");

try {
  const model = require(join(output, "deploymentContinuityHandoff.js"));
  const valid = {
    handoffId: "handoff-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    sourceDecisionId: "decision-a",
    activationPreflightId: "activation-a",
    storageSelectionPreflightId: "preflight-a",
    storageSelectionGateId: "storage-gate-a",
    releaseReadinessId: "readiness-a",
    releaseReadinessTenantId: "tenant-a",
    releaseReadinessPackageId: "package-a",
    releaseReadinessStatus: "blocked",
    status: "blocked",
    recommendedOptionId: "hosted-pwa",
    selectedOptionId: null,
    artifacts: [
      artifact("hosted-pwa"),
      artifact("local-classroom-server"),
      artifact("packaged-companion"),
    ],
    evidenceBindings: [
      "continuity-decision:decision-a",
      "activation-preflight:activation-a",
      "release-readiness:readiness-a",
      "storage-selection-preflight:preflight-a",
      "storage-selection-gate:storage-gate-a",
    ],
    blockers: ["Activation remains blocked."],
    exportAllowed: false,
    installAllowed: false,
    activateAllowed: false,
    routeMutationAllowed: false,
    sideEffect: "none",
  };
  assert(model.validateDeploymentContinuityHandoff(valid).length === 0, "valid handoff must preserve storage identity");
  const missingPreflight = { ...valid, evidenceBindings: valid.evidenceBindings.filter((binding) => binding !== "storage-selection-preflight:preflight-a") };
  assert(model.validateDeploymentContinuityHandoff(missingPreflight).some((error) => error.includes("storage selection preflight")), "missing storage preflight binding must be rejected");
  const missingGate = { ...valid, evidenceBindings: valid.evidenceBindings.filter((binding) => binding !== "storage-selection-gate:storage-gate-a") };
  assert(model.validateDeploymentContinuityHandoff(missingGate).some((error) => error.includes("storage selection gate")), "missing storage gate binding must be rejected");
  console.log("PASS deployment continuity handoff preserves explicit storage identity and rejects missing storage evidence bindings.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function artifact(optionId) {
  return {
    artifactId: `deployment-handoff:${optionId}`,
    optionId,
    label: `${optionId} review packet`,
    deliverables: ["Review evidence"],
    evidenceBindings: ["continuity-decision:decision-a"],
    blockers: ["Activation remains blocked."],
    reviewOnly: true,
    exportAllowed: false,
    installAllowed: false,
    activateAllowed: false,
  };
}

function transpile(sourceText) {
  return ts.transpileModule(sourceText, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
