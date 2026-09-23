import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-browser-observation-runtime-"));
const storeSource = readFileSync(join(root, "apps", "web", "src", "features", "persistence", "browserRehearsalObservationStore.ts"), "utf8");
const contractSource = readFileSync(join(root, "packages", "content-model", "src", "browserRehearsalObservation.ts"), "utf8");

mkdirSync(join(output, "node_modules", "@living-textbook", "content-model"), { recursive: true });
writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
writeFileSync(join(output, "browserRehearsalObservation.js"), transpile(contractSource), "utf8");
writeFileSync(join(output, "node_modules", "@living-textbook", "content-model", "package.json"), '{"main":"index.js"}\n', "utf8");
writeFileSync(join(output, "node_modules", "@living-textbook", "content-model", "index.js"), 'module.exports = require("../../../browserRehearsalObservation.js");\n', "utf8");
writeFileSync(join(output, "browserRehearsalObservationStore.js"), transpile(storeSource), "utf8");

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
  const {
    createHumanObservedBrowserRehearsalObservation,
    getBrowserRehearsalObservationStorageKey,
    readBrowserRehearsalObservation,
    saveBrowserRehearsalObservation,
  } = require(join(output, "browserRehearsalObservationStore.js"));

  const lookup = {
    tenantId: "tenant-a",
    packageId: "package-a",
    launchCode: "launch-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    studentSessionId: "launch-a:student-a",
  };
  const observation = createHumanObservedBrowserRehearsalObservation({
    ...lookup,
    routePaths: ["/launch/launch-a", "/memory/launch-a", "/teacher/sessions/launch-a"],
    checkIds: ["identity", "memory-match", "teacher-report"],
    observationId: "observation-a",
    observedAt: "2026-09-23T00:00:00.000Z",
  });
  const saved = saveBrowserRehearsalObservation(observation);
  assert(saved.errors.length === 0, "valid teacher observation must save");
  assert(readBrowserRehearsalObservation(lookup)?.observationId === "observation-a", "saved observation must be readable");
  assert(readBrowserRehearsalObservation({ ...lookup, tenantId: "tenant-b" }) === undefined, "cross-tenant observation lookup must be hidden");

  const storageKey = getBrowserRehearsalObservationStorageKey(lookup);
  storage.set(storageKey, JSON.stringify({ ...observation, releasePromotionAllowed: true }));
  assert(readBrowserRehearsalObservation(lookup) === undefined, "promotion-enabled observation must be hidden");

  console.log("PASS browser observation runtime stores valid teacher receipts, isolates tenants, and hides promotion drift.");
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
