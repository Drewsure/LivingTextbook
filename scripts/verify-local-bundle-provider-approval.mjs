import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-provider-approval-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "localBundleProviderApproval.ts"), "utf8");
writeFileSync(join(output, "localBundleProviderApproval.js"), ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, "utf8");

try {
  const { validateLocalBundleProviderApprovalPacket } = require(join(output, "localBundleProviderApproval.js"));
  const packet = {
    approvalId: "approval-1",
    tenantId: "sample-publisher",
    bundleId: "sample-bundle",
    packageId: "sample-package",
    storageSelectionPreflightId: "storage-preflight-1",
    storageSelectionGateId: "storage-gate-1",
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
    candidateId: "closed-local-candidate",
    providerKey: "unselected-provider-candidate",
    deploymentChannel: "local-classroom",
    mode: "review-only",
    selectedProvider: null,
    providerActivationAllowed: false,
    studentFacingAllowed: false,
    controls: {
      retentionPolicyRef: "retention-review",
      exportPolicyRef: "export-review",
      backupPolicyRef: "backup-review",
      restorePolicyRef: "restore-review",
      safeFallbackPolicyRef: "fallback-review",
      tenantIsolationProofRef: "tenant-review",
    },
    checks: [
      { checkId: "tenant-isolation", label: "Tenant isolation", status: "open", evidenceRef: "tenant-review", detail: "Open." },
      { checkId: "retention", label: "Retention", status: "open", evidenceRef: "retention-review", detail: "Open." },
      { checkId: "export", label: "Export", status: "open", evidenceRef: "export-review", detail: "Open." },
      { checkId: "backup", label: "Backup", status: "open", evidenceRef: "backup-review", detail: "Open." },
      { checkId: "restore", label: "Restore", status: "open", evidenceRef: "restore-review", detail: "Open." },
      { checkId: "safe-fallback", label: "Safe fallback", status: "open", evidenceRef: "fallback-review", detail: "Open." },
      { checkId: "data-exclusion", label: "Data exclusion", status: "passed", evidenceRef: "data-review", detail: "Passed." },
    ],
    rawLearnerAudioExcluded: true,
    rawLearnerTranscriptsExcluded: true,
    learnerDataExportBlocked: true,
    blockedActions: ["provider-activation", "student-promotion", "package-write", "learner-data-export"],
  };
  assert(validateLocalBundleProviderApprovalPacket(packet).length === 0, "complete review packet must validate");

  const unsafe = { ...packet, selectedProvider: "sqlite" };
  assert(validateLocalBundleProviderApprovalPacket(unsafe).some((error) => error.includes("must not select")), "provider selection must remain blocked");

  const incomplete = { ...packet, blockedActions: ["provider-activation"] };
  assert(validateLocalBundleProviderApprovalPacket(incomplete).some((error) => error.includes("student-promotion")), "student promotion blocker must be required");
  console.log("PASS local provider approval evidence requires controls, tenant isolation, data exclusion, and blocked activation.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
