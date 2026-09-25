import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-local-assessment-"));
const modules = [
  "reviewSurfaceScope",
  "packageReadinessPersistence",
  "persistenceRecords",
  "persistenceHandoff",
  "localBundleManifest",
  "localBundleAssetEvidence",
  "localBundleHandoff",
  "localBundleHandoffPersistence",
  "localBundleRuntime",
  "localBundleReadinessAssessment",
];

for (const moduleName of modules) {
  const source = readFileSync(join(root, "packages", "content-model", "src", `${moduleName}.ts`), "utf8");
  writeFileSync(join(output, `${moduleName}.js`), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
}

try {
  const { assessLocalBundleReadiness } = require(join(output, "localBundleReadinessAssessment.js"));
  const { TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES } = require(join(output, "persistenceRecords.js"));
  const manifest = {
    bundle_id: "sample-bundle",
    tenant_id: "sample-tenant",
    curriculum_id: "sample-curriculum",
    series_id: "sample-series",
    book_id: "sample-book",
    unit_ids: ["unit-1"],
    version: "1.0.0",
    created_at: "2026-09-25T00:00:00.000Z",
    content_package_path: "content/package.json",
    media_root: "media/",
    offline_ready: false,
    cache_policy: {
      mode: "review-only",
      version: "1.0.0",
      cache_name: "living-textbook-sample-bundle-v1.0.0",
      allowed_route_prefixes: ["/launch"],
      precache_asset_kinds: ["audio"],
      student_data_mode: "excluded",
      background_sync: false,
    },
    requires_hosted_redirect: false,
    assets: [{
      asset_id: "greetings-audio",
      unit_id: "unit-1",
      kind: "audio",
      local_path: "media/greetings.mp3",
      checksum: "sha256-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      rights_status: "owned",
      scan_status: "passed",
      target_mapping_reviewed: true,
      transcript_path: "content/greetings.txt",
    }],
    routes: [{
      qr_id: "qr-greetings",
      unit_id: "unit-1",
      target_type: "unit-launch",
      target_id: "unit-1",
      local_fallback_path: "/launch/unit-1",
    }],
  };
  const handoffPacket = {
    packetId: "sample-bundle-review-handoff",
    tenantId: "sample-tenant",
    bundleId: "sample-bundle",
    mode: "review-only",
    summary: "Review-only evidence.",
    offlineReadyAllowed: false,
    checks: [
      { checkId: "manifest", label: "Manifest", status: "passed", detail: "Declared." },
      { checkId: "asset-evidence", label: "Assets", status: "passed", detail: "Reviewed." },
      { checkId: "route-resolution", label: "Routes", status: "passed", detail: "Resolved." },
      { checkId: "release-gate", label: "Release", status: "passed", detail: "Reviewed." },
      { checkId: "side-effects", label: "Side effects", status: "passed", detail: "Disabled." },
    ],
    blockedActions: ["package-write", "offline-activation", "student-promotion", "hosted-redirect-mutation"],
  };
  const persistencePacket = {
    packetId: "persistence-review",
    label: "Provider-neutral implementation handoff",
    mode: "review-only",
    summary: "Shared persistence evidence.",
    selectedProvider: null,
    checks: [
      { checkId: "contract-alignment", label: "Contract", status: "passed", detail: "Aligned." },
      { checkId: "provider-selection", label: "Provider", status: "passed", detail: "Unselected." },
      { checkId: "side-effects", label: "Side effects", status: "passed", detail: "Disabled." },
    ],
    categoryCoverage: TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES.map((category) => ({
      category,
      durableRecord: true,
      hostedIntent: true,
      localIntent: true,
    })),
  };
  const persistencePreview = {
    previewId: "sample-bundle-review-handoff-persistence-review",
    packetId: handoffPacket.packetId,
    tenantId: handoffPacket.tenantId,
    bundleId: handoffPacket.bundleId,
    recordCategory: "local-companion-handoff",
    mode: "review-only",
    selectedProvider: null,
    durableWriteAllowed: false,
    packageWriteAllowed: false,
    offlineActivationAllowed: false,
    studentPromotionAllowed: false,
    hostedRedirectMutationAllowed: false,
  };
  const baseInput = {
    manifest,
    expectedTenantId: "sample-tenant",
    handoffPacket,
    persistencePreview,
    persistencePacket,
    deploymentChecks: [{ checkId: "content", status: "pass" }],
    releaseChecks: [{ checkId: "release", status: "pass" }],
  };

  const reviewReady = assessLocalBundleReadiness(baseInput);
  assert(reviewReady.decision === "review-ready", "complete non-offline manifest must be review-ready");
  assert(reviewReady.blockers.length === 0, "complete non-offline manifest must have no blockers");
  assert(reviewReady.exportAllowed === false && reviewReady.offlineActivationAllowed === false, "review assessment must keep side effects disabled");

  const blocked = assessLocalBundleReadiness({ ...baseInput, expectedTenantId: "wrong-tenant" });
  assert(blocked.decision === "blocked", "tenant mismatch must block assessment");
  assert(blocked.blockers.some((item) => item.includes("tenant")), "tenant mismatch must be visible");

  const offlineCandidate = assessLocalBundleReadiness({
    ...baseInput,
    manifest: {
      ...manifest,
      offline_ready: true,
      cache_policy: {
        ...manifest.cache_policy,
        mode: "offline-ready",
      },
    },
  });
  assert(offlineCandidate.decision === "offline-ready-candidate", "complete offline manifest must be a candidate only");
  assert(offlineCandidate.exportAllowed === false, "offline candidate must not enable export");

  const operationallyBlocked = assessLocalBundleReadiness({
    ...baseInput,
    deploymentChecks: [{ checkId: "installer", status: "blocked" }],
  });
  assert(operationallyBlocked.decision === "blocked", "blocked deployment gate must block assessment");

  console.log("PASS local bundle readiness assessment reconciles evidence, identity, resolver, and operational gates fail-closed.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
