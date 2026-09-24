import { mkdtempSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const output = mkdtempSync(join(tmpdir(), "living-textbook-storage-selection-review-"));
const source = readFileSync(new URL("../packages/content-model/src/persistenceProviderSelectionPreflight.ts", import.meta.url), "utf8");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(output, "preflight.js"), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");

  const { validatePersistenceProviderSelectionPreflight } = await import(pathToFileURL(join(output, "preflight.js")).href);
  const valid = buildValidPreflight();
  assertEmpty(validatePersistenceProviderSelectionPreflight(valid), "valid storage selection review");
  assert(valid.providerSelected === false && valid.selectionAllowed === false, "provider selection must remain blocked");
  assert(valid.writesAllowed === false && valid.activationAllowed === false, "storage side effects must remain blocked");

  const selected = structuredClone(valid);
  selected.providerSelected = true;
  assertIncludes(validatePersistenceProviderSelectionPreflight(selected), "providerSelected must remain false", "provider selection enablement rejection");

  const enabled = structuredClone(valid);
  enabled.selectionAllowed = true;
  assertIncludes(validatePersistenceProviderSelectionPreflight(enabled), "selectionAllowed must remain false", "selection enablement rejection");

  const duplicateCandidate = structuredClone(valid);
  duplicateCandidate.candidates.push(duplicateCandidate.candidates[0]);
  assertIncludes(validatePersistenceProviderSelectionPreflight(duplicateCandidate), "candidate id is duplicated", "candidate identity rejection");

  console.log("PASS storage selection review preserves provider-neutral comparison, blocked side effects, and unique candidate identity.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function buildValidPreflight() {
  return {
    preflightId: "storage-selection-review",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-l1-u1-routines-package",
    label: "Storage selection review",
    status: "blocked",
    providerNeutral: true,
    backendMatrixId: "first-pilot-backend-matrix",
    evidenceStorageGateId: "sample-publisher-evidence-storage-adapter-selection-gate",
    implementationReadinessId: "sample-publisher-pilot-review-decision-implementation-readiness",
    canonicalScopeValid: true,
    candidates: [
      {
        candidateId: "hosted-managed-first-pilot",
        label: "Hosted managed persistence candidate",
        deploymentFit: "hosted",
        costPosture: "controlled",
        whiteLabelFit: "Tenant-scoped hosted pilot.",
        requiredEvidence: ["Tenant isolation", "Retention policy"],
        unresolvedRisks: ["Provider not selected."],
      },
    ],
    recommendedCandidateId: "hosted-managed-first-pilot",
    selectionEvidence: {
      backendMatrixId: "first-pilot-backend-matrix",
      selectionGateId: "sample-publisher-backend-selection-gate",
      implementationReadinessId: "sample-publisher-pilot-review-decision-implementation-readiness",
      tenantId: "sample-publisher",
      packageId: "sample-publisher-l1-u1-routines-package",
      recommendedCandidateId: "hosted-managed-first-pilot",
      deploymentFit: "hosted",
      costPosture: "controlled",
      openCriterionCount: 1,
      criteria: [
        { criterionId: "tenant-policy", status: "open", owner: "joint" },
        { criterionId: "schema-contract", status: "passed", owner: "platform" },
      ],
      sourceRecords: ["backend-matrix:first-pilot-backend-matrix", "selection-gate:sample-publisher-backend-selection-gate", "readiness:sample-publisher-pilot-review-decision-implementation-readiness"],
    },
    providerSelected: false,
    selectionAllowed: false,
    migrationAllowed: false,
    writesAllowed: false,
    activationAllowed: false,
    requiredEvidence: ["Accepted retention and deletion policy"],
    blockedActions: ["No provider selected", "No provider-specific implementation", "No migration", "No persistence writes", "No activation"],
    nextSteps: ["Complete human policy review."],
    note: "Review-only storage comparison; no provider decision has been made.",
  };
}

function assertEmpty(errors, label) {
  if (errors.length > 0) throw new Error(`${label} unexpectedly failed: ${errors.join(" | ")}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(errors, expected, label) {
  if (!errors.some((error) => error.includes(expected))) throw new Error(`${label} did not include ${expected}: ${errors.join(" | ")}`);
}
