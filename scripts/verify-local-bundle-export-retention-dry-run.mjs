import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-export-retention-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "localBundleExportRetentionDryRun.ts"), "utf8");
writeFileSync(join(output, "localBundleExportRetentionDryRun.js"), ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, "utf8");

try {
  const { validateLocalBundleExportRetentionDryRun } = require(join(output, "localBundleExportRetentionDryRun.js"));
  const categories = [
    ["content-package", "include"], ["route-registry", "include"], ["game-route-manifest", "include"],
    ["reviewed-media-manifest", "include"], ["learner-progress", "requires-policy"],
    ["raw-learner-audio", "exclude"], ["learner-transcripts", "exclude"], ["credentials", "exclude"],
  ];
  const dryRun = {
    dryRunId: "dry-run-1", reconciliationId: "reconciliation-1", tenantId: "tenant-1", bundleId: "bundle-1", packageId: "package-1",
    storageSelectionPreflightId: "storage-preflight-1", storageSelectionGateId: "storage-gate-1", storageSelectionStatus: "blocked", storageSelectionAllowed: false,
    mode: "review-only", status: "blocked", format: "review-json",
    items: categories.map(([category, disposition]) => ({ itemId: category, label: category, category, disposition, sourceRef: `${category}-ref`, reason: "review" })),
    retention: { policyRef: "retention-policy", deletionScope: "tenant-package-session", retentionDays: null, deletionRequiresPolicy: true, deletionAction: "blocked" },
    exportExecutionAllowed: false, retentionDeletionAllowed: false, fileCopyAllowed: false, learnerDataExportAllowed: false,
    packageWriteAllowed: false, routeMutationAllowed: false,
    blockedActions: ["export-execution", "retention-deletion", "file-copy", "learner-data-export", "package-write", "route-mutation"],
    sideEffect: "none",
  };
  assert(validateLocalBundleExportRetentionDryRun(dryRun).length === 0, "complete export/retention dry run must validate");
  assert(validateLocalBundleExportRetentionDryRun({ ...dryRun, items: dryRun.items.map((item) => item.category === "raw-learner-audio" ? { ...item, disposition: "include" } : item) }).some((error) => error.includes("raw-learner-audio")), "raw learner audio must remain excluded");
  assert(validateLocalBundleExportRetentionDryRun({ ...dryRun, retention: { ...dryRun.retention, deletionAction: "ready" } }).some((error) => error.includes("deletion must remain blocked")), "retention deletion must remain blocked");
  assert(validateLocalBundleExportRetentionDryRun({ ...dryRun, blockedActions: [] }).length > 0, "dry run must require all blocked actions");
  console.log("PASS local export/retention dry run preserves classifications, policy gates, exclusions, and no-execution boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
