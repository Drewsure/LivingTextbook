import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-local-bundle-"));
const failures = [];

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const manifestSource = readFileSync(join(root, "packages", "content-model", "src", "localBundleManifest.ts"), "utf8");
  writeFileSync(join(output, "localBundleManifest.js"), ts.transpileModule(manifestSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  const evidenceSource = readFileSync(join(root, "packages", "content-model", "src", "localBundleAssetEvidence.ts"), "utf8");
  writeFileSync(join(output, "localBundleAssetEvidence.js"), ts.transpileModule(evidenceSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  const { validateLocalBundleManifest } = require(join(output, "localBundleManifest.js"));
  const { evaluateLocalBundleAssetEvidence } = require(join(output, "localBundleAssetEvidence.js"));
  const sample = JSON.parse(readFileSync(join(root, "content", "sample-bundles", "ministar-l1-u1", "manifest.json"), "utf8"));
  const offlineCachePolicy = {
    mode: "offline-ready",
    version: "0.1.0",
    cache_name: "ministar-level-1-unit-1-demo-v0.1.0",
    allowed_route_prefixes: ["/enter/ministar"],
    precache_asset_kinds: ["audio", "video"],
    student_data_mode: "excluded",
    background_sync: false,
  };
  const sampleResult = validateLocalBundleManifest(sample);
  assert(sampleResult.valid, "planning sample manifest must remain structurally valid");
  assert(sampleResult.warnings.some((warning) => warning.includes("checksum")), "planning sample must expose checksum warnings");

  const reviewOnlyOfflinePolicyResult = validateLocalBundleManifest({
    ...sample,
    cache_policy: offlineCachePolicy,
  });
  assert(!reviewOnlyOfflinePolicyResult.valid, "review-only manifest must not declare an offline-ready cache policy");
  assert(reviewOnlyOfflinePolicyResult.errors.some((error) => error.includes("cannot declare an offline-ready cache policy")), "review-only cache policy rejection must be explicit");

  const mismatchedCacheVersionResult = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
    cache_policy: { ...offlineCachePolicy, version: "9.9.9" },
  });
  assert(!mismatchedCacheVersionResult.valid, "cache policy version drift must be rejected");
  assert(mismatchedCacheVersionResult.errors.some((error) => error.includes("must match the manifest version")), "cache version drift rejection must be explicit");

  const sourceDocumentCacheResult = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
    cache_policy: { ...offlineCachePolicy, precache_asset_kinds: ["source-document"] },
  });
  assert(!sourceDocumentCacheResult.valid, "source documents must not be precacheable learner assets");
  assert(sourceDocumentCacheResult.errors.some((error) => error.includes("source-document assets")), "source-document cache rejection must be explicit");

  const routeCoverageResult = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
    cache_policy: { ...offlineCachePolicy, allowed_route_prefixes: ["/launch"] },
  });
  assert(!routeCoverageResult.valid, "offline-ready routes must be covered by the cache allowlist");
  assert(routeCoverageResult.errors.some((error) => error.includes("outside the cache_policy route allowlist")), "route coverage rejection must be explicit");

  const missingCachePolicyResult = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
  });
  assert(!missingCachePolicyResult.valid, "offline-ready manifest without a cache policy must be rejected");
  assert(missingCachePolicyResult.errors.some((error) => error.includes("offline-ready cache policy")), "missing cache policy rejection must be explicit");

  const offlineResult = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
    cache_policy: offlineCachePolicy,
  });
  assert(!offlineResult.valid, "offline-ready sample with placeholder checksums must be rejected");
  assert(offlineResult.errors.some((error) => error.includes("final sha256 checksum")), "offline-ready rejection must name checksum evidence");

  const safeOfflineResult = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
    requires_hosted_redirect: false,
    cache_policy: offlineCachePolicy,
    assets: sample.assets.map((asset) => ({
      ...asset,
      checksum: `sha256-${"a".repeat(64)}`,
      rights_status: "owned",
      scan_status: "passed",
      target_mapping_reviewed: true,
      ...(asset.kind === "audio" ? { transcript_path: asset.transcript_path || "content/transcripts/ready.en.txt" } : {}),
      ...(asset.kind === "video" ? {
        poster_path: asset.poster_path || "media/posters/ready.jpg",
        transcript_path: asset.transcript_path || "content/transcripts/ready.en.txt",
      } : {}),
      ...(asset.kind === "image" ? { alt_text_ready: true } : {}),
    })),
  });
  assert(safeOfflineResult.valid, "rights-safe final-checksum bundle must validate as structurally offline-ready");

  const imageWithoutAltTextResult = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
    cache_policy: offlineCachePolicy,
    assets: [
      ...sample.assets.map((asset) => ({
        ...asset,
        checksum: `sha256-${"a".repeat(64)}`,
        rights_status: "owned",
        scan_status: "passed",
        target_mapping_reviewed: true,
      })),
      {
        asset_id: "review-image-without-alt-text",
        kind: "image",
        local_path: "media/images/review.png",
        checksum: `sha256-${"b".repeat(64)}`,
        rights_status: "owned",
        scan_status: "passed",
        target_mapping_reviewed: true,
        alt_text_ready: false,
      },
    ],
  });
  assert(!imageWithoutAltTextResult.valid, "offline-ready image without alt-text evidence must be rejected");
  assert(imageWithoutAltTextResult.errors.some((error) => error.includes("alt-text evidence")), "image rejection must identify alt-text evidence");

  const readyAudio = evaluateLocalBundleAssetEvidence({
    ...sample.assets[0],
    checksum: `sha256-${"a".repeat(64)}`,
    rights_status: "owned",
    scan_status: "passed",
    target_mapping_reviewed: true,
    transcript_path: "content/transcripts/ready.en.txt",
  });
  assert(readyAudio.handoffReady, "complete audio evidence must be handoff-ready");

  const audioWithoutTranscript = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
    requires_hosted_redirect: false,
    cache_policy: offlineCachePolicy,
    assets: sample.assets.map((asset, index) => index === 0
      ? {
          ...asset,
          checksum: `sha256-${"a".repeat(64)}`,
          rights_status: "owned",
          scan_status: "passed",
          target_mapping_reviewed: true,
          transcript_path: undefined,
        }
      : {
          ...asset,
          checksum: `sha256-${"b".repeat(64)}`,
          rights_status: "owned",
          scan_status: "passed",
          target_mapping_reviewed: true,
          ...(asset.kind === "image" ? { alt_text_ready: true } : {}),
        }),
  });
  assert(!audioWithoutTranscript.valid, "offline-ready audio without transcript evidence must be rejected");
  assert(audioWithoutTranscript.errors.some((error) => error.includes("transcript evidence")), "audio rejection must identify transcript evidence");

  const incompleteVideo = evaluateLocalBundleAssetEvidence({
    ...sample.assets[1],
    checksum: `sha256-${"a".repeat(64)}`,
    rights_status: "owned",
    scan_status: "passed",
    target_mapping_reviewed: true,
    poster_path: undefined,
  });
  assert(!incompleteVideo.handoffReady, "video without poster evidence must remain blocked");

  const videoWithoutPoster = validateLocalBundleManifest({
    ...sample,
    offline_ready: true,
    requires_hosted_redirect: false,
    cache_policy: offlineCachePolicy,
    assets: sample.assets.map((asset, index) => index === 1
      ? {
          ...asset,
          checksum: `sha256-${"c".repeat(64)}`,
          rights_status: "owned",
          scan_status: "passed",
          target_mapping_reviewed: true,
          poster_path: undefined,
        }
      : {
          ...asset,
          checksum: `sha256-${"d".repeat(64)}`,
          rights_status: "owned",
          scan_status: "passed",
          target_mapping_reviewed: true,
          ...(asset.kind === "image" ? { alt_text_ready: true } : {}),
        }),
  });
  assert(!videoWithoutPoster.valid, "offline-ready video without poster evidence must be rejected");
  assert(videoWithoutPoster.errors.some((error) => error.includes("poster and transcript/caption evidence")), "video rejection must identify poster and transcript evidence");

  const traversalResult = validateLocalBundleManifest({
    ...sample,
    assets: [{ ...sample.assets[0], local_path: "media/../private/student-data.json" }],
  });
  assert(!traversalResult.valid, "path traversal must be rejected");
  assert(traversalResult.errors.some((error) => error.includes("safe and relative")), "path traversal rejection must identify local path safety");

  const duplicateResult = validateLocalBundleManifest({
    ...sample,
    assets: [sample.assets[0], { ...sample.assets[1], asset_id: sample.assets[0].asset_id }],
  });
  assert(!duplicateResult.valid, "duplicate asset identifiers must be rejected");
  assert(duplicateResult.errors.some((error) => error.includes("must be unique")), "duplicate asset rejection must identify uniqueness");
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS local bundle manifest runtime validation protects path safety, checksum evidence, rights evidence, and uniqueness.");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}
