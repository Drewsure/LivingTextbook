import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-local-evidence-"));
const source = readFileSync(join(root, "apps", "web", "src", "features", "persistence", "localSessionEvidenceStore.ts"), "utf8");

writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
writeFileSync(join(output, "localSessionEvidenceStore.js"), ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, "utf8");

const storage = new Map();
globalThis.window = {
  localStorage: {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
  },
  addEventListener() {},
  removeEventListener() {},
};

try {
  const {
    appendLocalSessionEvidence,
    getLocalSessionEvidenceStorageKey,
    readLocalSessionEvidence,
  } = require(join(output, "localSessionEvidenceStore.js"));

  const launchSession = {
    tenantId: "tenant-a",
    unitKey: "tenant-a:curriculum-a:L1:U1",
    launchCode: "launch-a",
    studentSessionId: "launch-a:student-a",
    entryMode: "flashcards",
  };
  const progression = {
    studentSessionId: "launch-a:student-a",
    launchCode: "launch-a",
    unitKey: launchSession.unitKey,
    currentStep: "entry-practice",
    unlockedGameModes: ["flashcards"],
    completedGameModes: [],
    earnedStarDust: 0,
    masteryStatus: "in-progress",
  };
  const validEvent = {
    type: "game_started",
    unitKey: launchSession.unitKey,
    gameMode: "flashcards",
    launchCode: launchSession.launchCode,
    studentSessionId: progression.studentSessionId,
    occurredAt: "2026-09-21T00:00:00.000Z",
    metadata: { tenantId: launchSession.tenantId },
  };
  const baseArgs = {
    packageId: "package-a",
    launchSession,
    progression,
    events: [validEvent],
    savedAt: "2026-09-21T00:00:01.000Z",
  };

  const accepted = appendLocalSessionEvidence(baseArgs);
  assert(accepted.errors.length === 0 && accepted.evidence, "valid browser evidence must be accepted");

  const lookup = {
    tenantId: launchSession.tenantId,
    packageId: baseArgs.packageId,
    launchCode: launchSession.launchCode,
    unitKey: launchSession.unitKey,
    studentSessionId: progression.studentSessionId,
  };
  assert(readLocalSessionEvidence(lookup)?.events.length === 1, "valid browser evidence must be readable");
  assert(readLocalSessionEvidence({ ...lookup, tenantId: "tenant-b" }) === undefined, "cross-tenant lookup must not read evidence");

  const mixedEventResult = appendLocalSessionEvidence({
    ...baseArgs,
    events: [{ ...validEvent, studentSessionId: "launch-a:student-b" }],
  });
  assert(mixedEventResult.errors.some((error) => error.includes("different student session")), "mixed student event must be rejected");
  assert(readLocalSessionEvidence(lookup)?.events.length === 1, "rejected mixed event must not mutate evidence");

  const storageKey = getLocalSessionEvidenceStorageKey(lookup);
  storage.set(storageKey, JSON.stringify({
    ...accepted.evidence,
    unitKey: " ",
  }));
  assert(readLocalSessionEvidence(lookup) === undefined, "malformed blank identity record must be hidden");

  console.log("PASS browser rehearsal evidence runtime rejects cross-tenant, mixed-session, and blank-identity records without mutation.");
} finally {
  rmSync(output, { recursive: true, force: true });
  delete globalThis.window;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
