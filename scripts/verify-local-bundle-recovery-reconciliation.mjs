import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-recovery-reconciliation-"));
const sourceNames = ["localBundleProviderApproval", "localBundleRecoveryPacket", "localBundleRecoveryReconciliation"];

for (const sourceName of sourceNames) {
  const source = readFileSync(join(root, "packages", "content-model", "src", `${sourceName}.ts`), "utf8");
  writeFileSync(join(output, `${sourceName}.js`), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
}

try {
  const { reconcileLocalBundleRecoveryEvidence } = require(join(output, "localBundleRecoveryReconciliation.js"));
  const approval = {
    approvalId: "approval-1", tenantId: "tenant-1", bundleId: "bundle-1", packageId: "package-1",
    candidateId: "candidate-1", providerKey: "unselected", deploymentChannel: "local-classroom",
    mode: "review-only", selectedProvider: null, providerActivationAllowed: false, studentFacingAllowed: false,
    controls: { retentionPolicyRef: "retention", exportPolicyRef: "export", backupPolicyRef: "backup", restorePolicyRef: "restore", safeFallbackPolicyRef: "fallback", tenantIsolationProofRef: "tenant" },
    checks: ["tenant-isolation", "retention", "export", "backup", "restore", "safe-fallback", "data-exclusion"].map((checkId) => ({ checkId, label: checkId, status: "open", evidenceRef: `${checkId}-evidence`, detail: "review" })),
    rawLearnerAudioExcluded: true, rawLearnerTranscriptsExcluded: true, learnerDataExportBlocked: true,
    blockedActions: ["provider-activation", "student-promotion", "package-write", "learner-data-export"],
  };
  const recovery = {
    packetId: "recovery-1", tenantId: "tenant-1", bundleId: "bundle-1", packageId: "package-1",
    mode: "review-only", selectedProvider: null, backupExecutionAllowed: false, restoreExecutionAllowed: false,
    exportExecutionAllowed: false, packageWriteAllowed: false, studentPromotionAllowed: false, routeMutationAllowed: false,
    backup: { status: "blocked", manifestRef: "manifest", checksumRef: "checksum", checksumAlgorithm: "sha256", schemaVersion: "v1", rawLearnerAudioExcluded: true, learnerTranscriptsExcluded: true },
    restore: { status: "blocked", sourceManifestRef: "manifest", rehearsalRef: "rehearsal", rollbackRef: "rollback", crossTenantRestoreBlocked: true },
    export: { status: "blocked", format: "review-json", policyRef: "export", includesLearnerData: false, includesRawMedia: false, includesCredentials: false },
    retention: { status: "open", policyRef: "retention", retentionDays: null, deletionScope: "tenant-package-session", deletionRequiresPolicy: true },
    blockedActions: ["backup-execution", "restore-execution", "export-execution", "package-write", "student-promotion", "route-mutation"],
  };
  const result = reconcileLocalBundleRecoveryEvidence(approval, recovery);
  assert(result.status === "needs-evidence", "open evidence must remain needs-evidence");
  assert(result.identityMatches, "matching packet identities must reconcile");
  assert(result.executionAllowed === false && result.sideEffect === "none", "reconciliation must stay non-executing");
  assert(result.blockedActions.includes("provider-activation"), "provider activation must remain blocked");
  assert(reconcileLocalBundleRecoveryEvidence(approval, { ...recovery, tenantId: "other-tenant" }).status === "mismatch", "tenant drift must be a mismatch");
  console.log("PASS local recovery reconciliation preserves identity, evidence gaps, and no-execution boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
