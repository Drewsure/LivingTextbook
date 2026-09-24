import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-implementation-readiness-"));
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
    "packages/content-model/src/pilotReviewDecisionImplementationReadiness.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const model = require(join(output, "pilotReviewDecisionImplementationReadiness.js"));
  const valid = {
    readinessId: "behavior-readiness",
    tenantId: "sample-publisher",
    packageId: "sample-package",
    policyId: "sample-policy",
    label: "Behavior implementation readiness",
    storageSelectionPreflightId: "storage-preflight-a",
    storageSelectionGateId: "storage-gate-a",
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
    status: "blocked",
    providerNeutral: true,
    snapshotContractValid: true,
    adapterContractValid: true,
    retentionPolicyValid: true,
    retentionPolicyAccepted: false,
    auditPolicyAccepted: false,
    schoolPolicyAccepted: false,
    providerSelectionAllowed: false,
    implementationAllowed: false,
    writesAllowed: false,
    restoreAllowed: false,
    exportAllowed: false,
    activationAllowed: false,
    blockedActions: [
      "No provider selection",
      "No provider implementation",
      "No snapshot write",
      "No snapshot restore",
      "No snapshot export",
      "No review decision activation",
    ],
    requiredEvidence: ["Validated snapshot contract"],
    nextSteps: ["Complete policy review."],
    note: "Review-only behavior fixture.",
  };

  assertEmpty(model.validatePilotReviewDecisionImplementationReadiness(valid), "valid implementation readiness");

  const drifted = { ...valid, storageSelectionGateId: "other-storage-gate" };
  assertEmpty(model.validatePilotReviewDecisionImplementationReadiness(drifted), "identity-only implementation readiness remains valid without source comparison");

  const enabled = { ...valid, storageSelectionAllowed: true };
  assertIncludes(model.validatePilotReviewDecisionImplementationReadiness(enabled), "storage selection must remain disallowed", "storage enablement rejection");

  const unblocked = { ...valid, storageSelectionStatus: "ready", status: "ready-for-provider-selection" };
  assertIncludes(model.validatePilotReviewDecisionImplementationReadiness(unblocked), "storage selection must remain blocked", "storage status rejection");

  console.log("PASS provider implementation readiness preserves blocked storage identity and rejects enabled or unblocked selection.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assertEmpty(errors, label) {
  if (errors.length > 0) throw new Error(`${label} unexpectedly failed: ${errors.join(" | ")}`);
}

function assertIncludes(errors, expected, label) {
  if (!errors.some((error) => error.includes(expected))) throw new Error(`${label} did not include ${expected}: ${errors.join(" | ")}`);
}
