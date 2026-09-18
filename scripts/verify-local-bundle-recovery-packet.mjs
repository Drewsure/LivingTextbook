import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-recovery-packet-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "localBundleRecoveryPacket.ts"), "utf8");
writeFileSync(join(output, "localBundleRecoveryPacket.js"), ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, "utf8");

try {
  const { validateLocalBundleRecoveryPacket } = require(join(output, "localBundleRecoveryPacket.js"));
  const packet = {
    packetId: "recovery-1",
    tenantId: "sample-publisher",
    bundleId: "sample-bundle",
    packageId: "sample-package",
    mode: "review-only",
    selectedProvider: null,
    backupExecutionAllowed: false,
    restoreExecutionAllowed: false,
    exportExecutionAllowed: false,
    packageWriteAllowed: false,
    studentPromotionAllowed: false,
    routeMutationAllowed: false,
    backup: { status: "blocked", manifestRef: "manifest-review", checksumRef: "checksum-review", checksumAlgorithm: "sha256", schemaVersion: "review-v1", rawLearnerAudioExcluded: true, learnerTranscriptsExcluded: true },
    restore: { status: "blocked", sourceManifestRef: "manifest-review", rehearsalRef: "restore-review", rollbackRef: "rollback-review", crossTenantRestoreBlocked: true },
    export: { status: "blocked", format: "review-json", policyRef: "export-review", includesLearnerData: false, includesRawMedia: false, includesCredentials: false },
    retention: { status: "open", policyRef: "retention-review", retentionDays: null, deletionScope: "tenant-package-session", deletionRequiresPolicy: true },
    blockedActions: ["backup-execution", "restore-execution", "export-execution", "package-write", "student-promotion", "route-mutation"],
  };
  assert(validateLocalBundleRecoveryPacket(packet).length === 0, "complete recovery packet must validate");
  assert(validateLocalBundleRecoveryPacket({ ...packet, export: { ...packet.export, includesLearnerData: true } }).some((error) => error.includes("exclude learner data")), "learner-data export must be rejected");
  assert(validateLocalBundleRecoveryPacket({ ...packet, backup: { ...packet.backup, checksumAlgorithm: "md5" } }).some((error) => error.includes("SHA-256")), "non-SHA-256 backup evidence must be rejected");
  assert(validateLocalBundleRecoveryPacket({ ...packet, selectedProvider: "sqlite" }).some((error) => error.includes("must not select")), "provider selection must remain blocked");
  assert(validateLocalBundleRecoveryPacket({ ...packet, blockedActions: ["backup-execution"] }).some((error) => error.includes("restore-execution")), "all execution blockers must be required");
  console.log("PASS local recovery packet protects checksum, restore, export, retention, tenant, and no-execution boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
