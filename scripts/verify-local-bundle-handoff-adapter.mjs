import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-local-handoff-adapter-"));
const files = ["localBundleHandoff.ts", "localBundleHandoffReview.ts", "localBundleHandoffRecord.ts"];

for (const file of files) {
  const source = readFileSync(join(root, "packages", "content-model", "src", file), "utf8");
  writeFileSync(join(output, file.replace(".ts", ".js")), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
}

try {
  const { mapLocalBundleHandoffPacketToRecord, validateLocalBundleHandoffRecord } = require(join(output, "localBundleHandoffRecord.js"));
  const packet = {
    packetId: "sample-review-handoff",
    tenantId: "sample-publisher",
    bundleId: "sample-publisher-unit-1-planning",
    mode: "review-only",
    summary: "Review-only local companion evidence.",
    offlineReadyAllowed: false,
    checks: [
      { checkId: "manifest", label: "Manifest", status: "passed", detail: "Declared." },
      { checkId: "asset-evidence", label: "Assets", status: "blocked", detail: "Media evidence remains open." },
      { checkId: "route-resolution", label: "Routes", status: "passed", detail: "Resolved." },
      { checkId: "release-gate", label: "Release", status: "blocked", detail: "Policy remains open." },
      { checkId: "side-effects", label: "Side effects", status: "passed", detail: "Disabled." },
    ],
    blockedActions: ["package-write", "offline-activation", "student-promotion", "hosted-redirect-mutation"],
  };
  const record = mapLocalBundleHandoffPacketToRecord({
    packet,
    packageId: "sample-publisher-package",
    items: [{ itemId: "media-rights", owner: "publisher", artifact: "rights packet", status: "blocked", blocker: "Needs review", nextAction: "Review" }],
  });
  assert(record.tenantId === packet.tenantId, "mapper must preserve tenant scope");
  assert(record.blockedCount === 3, "mapper must derive blocked count from checks and items");
  assert(record.offlineReadyAllowed === false, "mapper must keep blocked records offline-ineligible");
  assert(validateLocalBundleHandoffRecord(record, { tenantId: packet.tenantId, bundleId: packet.bundleId, packetId: packet.packetId }).length === 0, "mapped record must validate");
  assert(validateLocalBundleHandoffRecord(record, { tenantId: "other-tenant", bundleId: packet.bundleId, packetId: packet.packetId }).some((error) => error.includes("tenant")), "tenant mismatch must be rejected");
  console.log("PASS local handoff adapter mapping preserves tenant scope, derived blockers, and read-only readiness.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
