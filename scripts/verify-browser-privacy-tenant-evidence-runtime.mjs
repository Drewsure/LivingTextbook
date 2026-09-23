import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-negative-evidence-runtime-"));
const observationSource = readFileSync(join(root, "packages", "content-model", "src", "browserRehearsalObservation.ts"), "utf8");
const packetSource = readFileSync(join(root, "packages", "content-model", "src", "browserPrivacyTenantEvidencePacket.ts"), "utf8");
const storeSource = readFileSync(join(root, "apps", "web", "src", "features", "persistence", "browserPrivacyTenantEvidencePacketStore.ts"), "utf8");
mkdirSync(join(output, "node_modules", "@living-textbook", "content-model"), { recursive: true });
writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
writeFileSync(join(output, "browserRehearsalObservation.js"), transpile(observationSource), "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidencePacket.js"), transpile(packetSource), "utf8");
writeFileSync(join(output, "node_modules", "@living-textbook", "content-model", "package.json"), '{"main":"index.js"}\n', "utf8");
writeFileSync(join(output, "node_modules", "@living-textbook", "content-model", "index.js"), 'module.exports = { ...require("../../../browserRehearsalObservation.js"), ...require("../../../browserPrivacyTenantEvidencePacket.js") };\n', "utf8");
writeFileSync(join(output, "browserPrivacyTenantEvidencePacketStore.js"), transpile(storeSource), "utf8");

const storage = new Map();
globalThis.window = {
  localStorage: {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
  },
  addEventListener() {},
  removeEventListener() {},
};

try {
  const model = require(join(output, "browserPrivacyTenantEvidencePacket.js"));
  const store = require(join(output, "browserPrivacyTenantEvidencePacketStore.js"));
  const observation = {
    version: 1,
    observationId: "observation-runtime-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    launchCode: "launch-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    studentSessionId: "launch-a:student-a",
    mode: "human-observed",
    reviewerRole: "teacher",
    reviewerRef: "teacher-session:launch-a",
    observedAt: "2026-09-24T00:00:00.000Z",
    routePaths: ["/teacher/sessions/launch-a", "/memory/launch-a"],
    checkIds: ["route-continuity", "student-to-teacher-handoff"],
    status: "review-only",
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
  };
  let packet = model.createBrowserPrivacyTenantEvidencePacketFromObservation(observation, {
    verificationRunId: "run-runtime-a",
    verificationRevision: "legacy-source-import:runtime-test",
  });
  packet = model.recordBrowserPrivacyTenantNegativeLane(packet, "privacy", {
    reviewerRef: "teacher-session:launch-a",
    captureId: "capture-privacy-a",
    observedAt: "2026-09-24T00:01:00.000Z",
    notes: "Teacher observed the privacy boundary.",
  });
  packet = model.recordBrowserPrivacyTenantNegativeLane(packet, "tenant-isolation", {
    reviewerRef: "teacher-session:launch-a",
    captureId: "capture-tenant-a",
    observedAt: "2026-09-24T00:02:00.000Z",
    notes: "Teacher observed the tenant isolation boundary.",
  });
  assert(model.validateBrowserPrivacyTenantEvidencePacket(packet).length === 0, "complete review packet must pass");
  assert(store.saveBrowserPrivacyTenantEvidencePacket(packet).errors.length === 0, "packet must save locally");
  const lookup = {
    tenantId: "tenant-a",
    packageId: "package-a",
    launchCode: "launch-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    studentSessionId: "launch-a:student-a",
    observationId: "observation-runtime-a",
  };
  assert(store.readBrowserPrivacyTenantEvidencePacket(lookup)?.lanes.every((lane) => lane.status === "passed"), "saved lanes must be readable");
  assert(store.readBrowserPrivacyTenantEvidencePacket({ ...lookup, tenantId: "tenant-b" }) === undefined, "cross-tenant lookup must be hidden");
  const key = store.getBrowserPrivacyTenantEvidencePacketStorageKey(lookup);
  storage.set(key, JSON.stringify({ ...packet, releasePromotionAllowed: true }));
  assert(store.readBrowserPrivacyTenantEvidencePacket(lookup) === undefined, "promotion drift must be hidden");
  console.log("PASS local negative evidence storage preserves lane capture, tenant isolation, and promotion fail-closed behavior.");
} finally {
  rmSync(output, { recursive: true, force: true });
  delete globalThis.window;
}

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
