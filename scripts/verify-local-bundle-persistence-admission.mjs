import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-local-admission-"));
const moduleNames = ["localBundleHandoff", "reviewSurfaceScope", "packageReadinessPersistence", "persistenceRecords", "persistenceHandoff", "localBundleHandoffPersistence"];

for (const moduleName of moduleNames) {
  const source = readFileSync(join(root, "packages", "content-model", "src", `${moduleName}.ts`), "utf8");
  writeFileSync(join(output, `${moduleName}.js`), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
}

try {
  const { validateLocalBundleHandoffPersistencePreview } = require(join(output, "localBundleHandoffPersistence.js"));
  const { validatePersistenceHandoffPacket } = require(join(output, "persistenceHandoff.js"));
  const { TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES } = require(join(output, "persistenceRecords.js"));
  const handoffPacket = {
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
  const preview = {
    previewId: "sample-review-handoff-persistence-review",
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
  const admissionErrors = validateLocalBundleHandoffPersistencePreview(preview, handoffPacket, persistencePacket);
  assert(admissionErrors.length === 0, "valid admission preview must pass");

  const unsafePreview = { ...preview, durableWriteAllowed: true };
  const errors = validateLocalBundleHandoffPersistencePreview(unsafePreview, handoffPacket, persistencePacket);
  assert(errors.some((error) => error.includes("durableWriteAllowed")), "durable write must remain blocked");
  const incompletePersistencePacket = {
    ...persistencePacket,
    categoryCoverage: persistencePacket.categoryCoverage.filter((coverage) => coverage.category !== "local-companion-handoff"),
  };
  assert(validatePersistenceHandoffPacket(incompletePersistencePacket).some((error) => error.includes("local-companion-handoff")), "persistence coverage must retain the local handoff category");

  console.log("PASS local bundle persistence admission preserves shared coverage and keeps all side effects disabled.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
