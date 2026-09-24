import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-local-resolver-"));
const failures = [];

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  for (const moduleName of ["localBundleManifest", "localBundleRuntime"]) {
    const source = readFileSync(join(root, "packages", "content-model", "src", `${moduleName}.ts`), "utf8");
    writeFileSync(join(output, `${moduleName}.js`), ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, "utf8");
  }
  const { createReadOnlyLocalBundleResolver } = require(join(output, "localBundleRuntime.js"));
  const sample = JSON.parse(readFileSync(join(root, "content", "sample-bundles", "ministar-l1-u1", "manifest.json"), "utf8"));
  const result = createReadOnlyLocalBundleResolver(sample);
  assert(result.valid, "planning sample must create a valid read-only resolver");
  assert(result.mode === "read-only-rehearsal", "resolver must identify read-only rehearsal mode");
  assert(result.resolver?.deliveryStatus === "planning", "planning manifest must expose planning delivery status");
  assert(result.resolver?.resolveRoute("ministar", "qr-ministar-l1-u1-front-door")?.localFallbackPath === "/enter/ministar", "declared QR route must resolve to its manifest fallback");
  assert(result.resolver?.resolveRoute("ministar", "qr-ministar-l1-u1-front-door")?.deliveryStatus === "planning", "planning route resolution must remain rehearsal-only");
  assert(result.resolver?.resolveAsset("ministar", "media-ministar-l1-u1-greetings-chant")?.localPath === "media/audio/greetings-chant.mp3", "declared asset must resolve to its manifest local path");
  assert(result.resolver?.resolveAsset("ministar", "media-ministar-l1-u1-greetings-chant")?.deliveryStatus === "planning", "planning asset resolution must remain rehearsal-only");
  assert(result.resolver?.resolveRoute("other-tenant", "qr-ministar-l1-u1-front-door") === undefined, "other tenant must not resolve the bundle route");
  assert(result.resolver?.resolveAsset("other-tenant", "media-ministar-l1-u1-greetings-chant") === undefined, "other tenant must not resolve the bundle asset");
  assert(result.resolver?.resolveRoute("ministar", "unknown-qr") === undefined, "unknown QR identifiers must not invent a route");

  const missingPackageIdentity = createReadOnlyLocalBundleResolver({
    ...sample,
    curriculum_id: undefined,
    unit_ids: [],
  });
  assert(!missingPackageIdentity.valid && !missingPackageIdentity.resolver, "resolver must reject a bundle without complete curriculum and unit identity");
  assert(missingPackageIdentity.errors.some((error) => error.includes("package identity")), "package identity rejection must identify the governed identity boundary");

  const wrongUnitRoute = createReadOnlyLocalBundleResolver({
    ...sample,
    routes: sample.routes.map((route) => ({ ...route, unit_id: "unit-2" })),
  });
  assert(!wrongUnitRoute.valid && !wrongUnitRoute.resolver, "resolver must reject a QR route outside the declared package unit scope");
  assert(wrongUnitRoute.errors.some((error) => error.includes("outside the package unit scope")), "unit scope rejection must identify the package boundary");

  const offlineReady = createReadOnlyLocalBundleResolver({
    ...sample,
    offline_ready: true,
    requires_hosted_redirect: false,
    assets: sample.assets.map((asset, index) => ({
      ...asset,
      checksum: `sha256-${String.fromCharCode(97 + index).repeat(64)}`,
      rights_status: "owned",
      scan_status: "passed",
      target_mapping_reviewed: true,
      ...(asset.kind === "audio" ? { transcript_path: "media/captions/greetings-chant.vtt" } : {}),
      ...(asset.kind === "video" ? { alt_text_ready: true } : {}),
    })),
  });
  assert(offlineReady.valid, "evidence-complete offline-ready manifest must create a resolver");
  assert(offlineReady.resolver?.deliveryStatus === "offline-ready", "offline-ready manifest must expose offline-ready delivery status");
  assert(offlineReady.resolver?.resolveAsset("ministar", "media-ministar-l1-u1-greetings-chant")?.deliveryStatus === "offline-ready", "offline-ready asset resolution must expose its delivery status");

  const invalid = createReadOnlyLocalBundleResolver({
    ...sample,
    assets: [{ ...sample.assets[0], local_path: "media/../private/student-data.json" }],
  });
  assert(!invalid.valid && !invalid.resolver, "invalid manifests must not create a resolver");
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS read-only local bundle resolver enforces manifest identity, tenant scope, declared routes, and declared assets.");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}
