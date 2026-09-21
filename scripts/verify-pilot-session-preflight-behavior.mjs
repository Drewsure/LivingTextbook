import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-pilot-preflight-"));

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const tsconfig = join(output, "tsconfig.json");
  writeFileSync(tsconfig, JSON.stringify({
    compilerOptions: {
      module: "commonjs",
      target: "ES2022",
      moduleResolution: "node",
      resolveJsonModule: true,
      esModuleInterop: true,
      skipLibCheck: true,
      rootDir: root,
      outDir: output,
      baseUrl: root,
      paths: { "@living-textbook/content-model": ["packages/content-model/src/index.ts"] },
    },
    files: [
      join(root, "apps", "web", "src", "features", "persistence", "pilotSessionEvidenceEnvelope.ts"),
      join(root, "apps", "web", "src", "features", "persistence", "pilotSessionPreflight.ts"),
      join(root, "apps", "web", "src", "features", "persistence", "localSessionEvidenceStore.ts"),
      join(root, "packages", "content-model", "src", "index.ts"),
    ],
  }, null, 2), "utf8");

  const compile = spawnSync(process.execPath, [tsc, "-p", tsconfig], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const contentModelAlias = join(output, "node_modules", "@living-textbook", "content-model");
  mkdirSync(contentModelAlias, { recursive: true });
  writeFileSync(join(contentModelAlias, "package.json"), JSON.stringify({
    name: "@living-textbook/content-model",
    main: "../../../packages/content-model/src/index.js",
  }), "utf8");

  const envelopeModule = require(join(output, "apps", "web", "src", "features", "persistence", "pilotSessionEvidenceEnvelope.js"));
  const preflightModule = require(join(output, "apps", "web", "src", "features", "persistence", "pilotSessionPreflight.js"));
  const envelope = createEnvelope(envelopeModule);

  const healthyPersistence = {
    status: "healthy",
    tenantId: "sample-tenant",
    checkedAt: "2026-09-18T00:00:00.000Z",
    durability: "durable-managed",
    healthy: true,
    deploymentGate: { status: "ready", ready: true, blockedReasons: [] },
    errors: [],
  };
  const preflightNow = Date.parse("2026-09-18T00:04:00.000Z");
  const ready = preflightModule.evaluatePilotSessionPreflight(envelope, healthyPersistence, preflightNow);
  assert(ready.status === "ready-for-review", "complete evidence should be ready for review");
  assert(ready.launchAllowed === false, "review preflight must never authorize launch");
  assert(ready.durableWriteAllowed === false, "review preflight must never authorize durable writes");
  assert(ready.checks.filter((check) => check.status === "pass").length === 5, "complete evidence should pass five readiness checks");
  assert(ready.checks.find((check) => check.checkId === "launch-boundary")?.status === "blocked", "launch boundary must remain blocked");

  const uncheckedPersistence = preflightModule.evaluatePilotSessionPreflight(envelope);
  assert(uncheckedPersistence.status === "incomplete", "evidence without authoritative persistence status should remain incomplete");
  assert(uncheckedPersistence.checks.find((check) => check.checkId === "persistence")?.status === "open", "missing persistence status should remain open");

  const wrongTenantPersistence = preflightModule.evaluatePilotSessionPreflight(envelope, {
    ...healthyPersistence,
    tenantId: "other-tenant",
  }, preflightNow);
  assert(wrongTenantPersistence.status === "incomplete", "persistence status for another tenant should remain incomplete");
  assert(wrongTenantPersistence.checks.find((check) => check.checkId === "persistence")?.status === "blocked", "mismatched persistence tenant should be blocked");

  const rehearsalPersistence = preflightModule.evaluatePilotSessionPreflight(envelope, {
    ...healthyPersistence,
    durability: "non-durable-rehearsal",
  }, preflightNow);
  assert(rehearsalPersistence.status === "incomplete", "non-durable persistence must not satisfy pilot readiness");

  const blockedGatePersistence = preflightModule.evaluatePilotSessionPreflight(envelope, {
    ...healthyPersistence,
    deploymentGate: { status: "blocked", ready: false, blockedReasons: ["Durable write approval is not enabled for this deployment."] },
  }, preflightNow);
  assert(blockedGatePersistence.status === "incomplete", "blocked deployment gate must not satisfy pilot readiness");
  assert(blockedGatePersistence.checks.find((check) => check.checkId === "persistence")?.detail.includes("Durable write approval"), "pilot preflight should expose the authoritative gate blocker");

  const stalePersistence = preflightModule.evaluatePilotSessionPreflight(envelope, {
    ...healthyPersistence,
    checkedAt: "2026-09-17T23:00:00.000Z",
  }, preflightNow);
  assert(stalePersistence.status === "incomplete", "stale persistence status must not satisfy pilot readiness");

  const futurePersistence = preflightModule.evaluatePilotSessionPreflight(envelope, {
    ...healthyPersistence,
    checkedAt: "2026-09-18T00:05:00.000Z",
  }, preflightNow);
  assert(futurePersistence.status === "incomplete", "future persistence status must not satisfy pilot readiness");

  const incomplete = preflightModule.evaluatePilotSessionPreflight({
    ...envelope,
    stages: envelope.stages.map((stage, index) => index === 2 ? { ...stage, status: "pending" } : stage),
    journeyStatus: "incomplete",
  }, healthyPersistence, preflightNow);
  assert(incomplete.status === "incomplete", "unfinished evidence should remain incomplete");
  assert(incomplete.launchAllowed === false && incomplete.durableWriteAllowed === false, "incomplete evidence must remain side-effect free");

  const invalid = preflightModule.evaluatePilotSessionPreflight({
    ...envelope,
    privacy: { ...envelope.privacy, learnerTranscriptIncluded: true },
  }, healthyPersistence, preflightNow);
  assert(invalid.status === "invalid", "privacy violations should invalidate evidence");
  assert(invalid.validationErrors.length > 0, "invalid evidence should explain its validation errors");

  console.log("PASS pilot session preflight behavior covers ready, incomplete, invalid, launch-blocked, and durable-write-blocked states.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function createEnvelope({ PILOT_SESSION_EVIDENCE_ENVELOPE_VERSION }) {
  const stages = ["flashcards", "memory-match", "sentence-builder"].map((stageId) => ({
    stageId,
    routePath: `/${stageId === "memory-match" ? "memory" : stageId}/${encodeURIComponent("demo-unit-1")}`,
    gameMode: stageId,
    status: "complete",
    eventCount: 2,
    eventTypes: ["game_started", "game_completed"],
  }));
  return {
    version: PILOT_SESSION_EVIDENCE_ENVELOPE_VERSION,
    envelopeKind: "pilot-session-evidence",
    storageMode: "browser-rehearsal-only",
    tenantId: "sample-tenant",
    packageId: "sample-package",
    launchCode: "demo-unit-1",
    unitKey: "sample-tenant:starter:L1:U1",
    studentSessionId: "demo-unit-1:student",
    targetLanguage: "en",
    workflow: ["front-door", "flashcards", "memory-match", "sentence-builder", "teacher-report"],
    stages,
    eventCursor: 6,
    eventCount: 6,
    completedModes: ["flashcards", "memory-match", "sentence-builder"],
    journeyStatus: "complete",
    progression: {
      studentSessionId: "demo-unit-1:student",
      launchCode: "demo-unit-1",
      unitKey: "sample-tenant:starter:L1:U1",
      currentStep: "complete",
      unlockedGameModes: ["flashcards", "memory-match", "sentence-builder"],
      completedGameModes: ["flashcards", "memory-match", "sentence-builder"],
      earnedStarDust: 900,
      masteryStatus: "mastered",
    },
    capturedAt: "2026-09-18T00:00:00.000Z",
    idempotencyKey: "pilot-session-v1:sample-tenant:sample-package:demo-unit-1:demo-unit-1:student",
    privacy: {
      rawLearnerAudioIncluded: false,
      learnerTranscriptIncluded: false,
      supportLanguageEvidenceIncluded: false,
      mediaOnlyEvidenceIncluded: false,
      durableWritePerformed: false,
      liveClassroomRecord: false,
    },
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL ${message}`);
}
