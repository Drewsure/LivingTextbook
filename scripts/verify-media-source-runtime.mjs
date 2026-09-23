import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-media-source-"));

try {
  const source = readFileSync(new URL("../apps/web/src/features/multimedia/mediaSourceResolver.ts", import.meta.url), "utf8");
  writeFileSync(join(output, "mediaSourceResolver.cjs"), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  const resolver = require(join(output, "mediaSourceResolver.cjs"));
  const asset = {
    sourceUri: "/media/tenant/unit/audio.mp3",
    localBundlePath: "content/tenant/unit/audio.mp3",
  };

  assert(resolver.resolveMediaSource(asset, "hosted-first").sourceKind === "hosted", "hosted-first must prefer a root-relative hosted source");
  assert(resolver.resolveMediaSource(asset, "local-first").sourceKind === "local-bundle", "local-first must prefer a safe local bundle path");
  assert(resolver.resolveMediaSource({ sourceUri: "https://cdn.example.test/audio.mp3" }, "local-first").sourceKind === "hosted", "local-first must fall back to a safe hosted source");
  assert(resolver.resolveMediaSource({ sourceUri: "javascript:alert(1)", localBundlePath: "../outside.mp3" }).available === false, "unsafe hosted and traversal paths must resolve as unavailable");
  assert(resolver.resolveMediaSource({ sourceUri: "data:audio/mp3;base64,AAAA", localBundlePath: "https://example.test/audio.mp3" }).available === false, "data and protocol local paths must resolve as unavailable");
  assert(resolver.resolveMediaSource({ sourceUri: "//other-origin.example/audio.mp3", localBundlePath: "content\\tenant\\audio.mp3" }).available === false, "protocol-relative and backslash paths must resolve as unavailable");
  assert(resolver.resolveMediaSource({ sourceUri: `/${"a".repeat(2049)}.mp3` }).available === false, "oversized media paths must resolve as unavailable");
} finally {
  rmSync(output, { recursive: true, force: true });
}

console.log("PASS media source resolution prefers the configured delivery mode and rejects unsafe, oversized, protocol, and traversal paths.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
