import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-local-handoff-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "localBundleHandoff.ts"), "utf8");
writeFileSync(join(output, "localBundleHandoff.js"), ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, "utf8");

try {
  const { validateLocalBundleHandoffPacket } = require(join(output, "localBundleHandoff.js"));
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
  assert(validateLocalBundleHandoffPacket(packet).length === 0, "review-only packet with explicit blockers must validate");

  const unsafePacket = {
    ...packet,
    offlineReadyAllowed: true,
    blockedActions: ["package-write"],
  };
  const errors = validateLocalBundleHandoffPacket(unsafePacket);
  assert(errors.some((error) => error.includes("offline readiness")), "unsafe packet must reject offline readiness with open checks");
  assert(errors.some((error) => error.includes("offline-activation")), "unsafe packet must preserve blocked activation action");

  console.log("PASS local bundle handoff runtime keeps review-only identity, blockers, and offline readiness fail-closed.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
