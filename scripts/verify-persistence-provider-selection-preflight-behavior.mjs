import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-provider-selection-behavior-"));
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");

try {
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/persistenceProviderSelectionPreflight.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const model = require(join(output, "persistenceProviderSelectionPreflight.js"));
  const valid = buildValidPreflight();
  assertEmpty(model.validatePersistenceProviderSelectionPreflight(valid), "valid provider selection preflight");

  const wrongPackage = structuredClone(valid);
  wrongPackage.selectionEvidence.packageId = "other-package";
  assertIncludes(model.validatePersistenceProviderSelectionPreflight(wrongPackage), "must match the preflight package", "package mismatch rejection");

  const wrongMatrix = structuredClone(valid);
  wrongMatrix.selectionEvidence.backendMatrixId = "other-matrix";
  assertIncludes(model.validatePersistenceProviderSelectionPreflight(wrongMatrix), "must match the backend matrix", "matrix mismatch rejection");

  const falseReady = structuredClone(valid);
  falseReady.selectionEvidence.openCriterionCount = 0;
  assertIncludes(model.validatePersistenceProviderSelectionPreflight(falseReady), "must expose an open selection criterion", "false-ready selection rejection");

  const countDrift = structuredClone(valid);
  countDrift.selectionEvidence.openCriterionCount = 1;
  assertIncludes(model.validatePersistenceProviderSelectionPreflight(countDrift), "must match criterion evidence", "criterion count drift rejection");

  const fitDrift = structuredClone(valid);
  fitDrift.selectionEvidence.costPosture = "lowest";
  assertIncludes(model.validatePersistenceProviderSelectionPreflight(fitDrift), "must match the recommended cost posture", "candidate cost drift rejection");

  const missingSources = structuredClone(valid);
  missingSources.selectionEvidence.sourceRecords = ["only-one-source"];
  assertIncludes(model.validatePersistenceProviderSelectionPreflight(missingSources), "at least three source records", "selection evidence source rejection");

  console.log("PASS provider selection behavior accepts reconciled evidence and rejects package, matrix, false-ready, and source-record drift.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function buildValidPreflight() {
  return {
    preflightId: "behavior-provider-selection",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-package",
    label: "Behavior provider selection preflight",
    status: "blocked",
    providerNeutral: true,
    backendMatrixId: "backend-matrix",
    evidenceStorageGateId: "evidence-gate",
    implementationReadinessId: "implementation-readiness",
    canonicalScopeValid: true,
    candidates: [{
      candidateId: "hosted-managed-first-pilot",
      label: "Hosted managed",
      deploymentFit: "hosted",
      costPosture: "controlled",
      whiteLabelFit: "Tenant-scoped hosted pilot.",
      requiredEvidence: ["Policy"],
      unresolvedRisks: ["Provider not selected."],
    }],
    recommendedCandidateId: "hosted-managed-first-pilot",
    selectionEvidence: {
      backendMatrixId: "backend-matrix",
      selectionGateId: "selection-gate",
      implementationReadinessId: "implementation-readiness",
      tenantId: "sample-publisher",
      packageId: "sample-publisher-package",
      recommendedCandidateId: "hosted-managed-first-pilot",
      deploymentFit: "hosted",
      costPosture: "controlled",
      openCriterionCount: 2,
      criteria: [
        { criterionId: "privacy-policy", status: "open", owner: "joint" },
        { criterionId: "schema-contract", status: "passed", owner: "platform" },
        { criterionId: "release-control", status: "open", owner: "platform" },
      ],
      sourceRecords: ["backend-matrix:backend-matrix", "pilot-selection-gate:selection-gate", "implementation-readiness:implementation-readiness"],
    },
    providerSelected: false,
    selectionAllowed: false,
    migrationAllowed: false,
    writesAllowed: false,
    activationAllowed: false,
    requiredEvidence: ["Policy"],
    blockedActions: ["No provider selected", "No provider-specific implementation", "No migration", "No persistence writes", "No activation"],
    nextSteps: ["Review evidence."],
    note: "Review-only.",
  };
}

function assertEmpty(errors, label) {
  if (errors.length > 0) throw new Error(`${label} unexpectedly failed: ${errors.join(" | ")}`);
}

function assertIncludes(errors, expected, label) {
  if (!errors.some((error) => error.includes(expected))) throw new Error(`${label} did not include ${expected}: ${errors.join(" | ")}`);
}
