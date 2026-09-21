import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-persistence-conformance-"));
const failures = [];

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const compiled = join(output, "persistence");
  mkdirSync(compiled, { recursive: true });
  for (const sourceName of ["progressionRecordFingerprint.ts", "sqliteProgressionStore.ts", "progressionPersistenceAdapter.ts"]) {
    const sourcePath = join(root, "apps", "web", "src", "server", "persistence", sourceName);
    writeFileSync(join(compiled, sourceName.replace(/\.ts$/, ".js")), ts.transpileModule(readFileSync(sourcePath, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, "utf8");
  }

  const adapter = require(join(compiled, "progressionPersistenceAdapter.js"));
  const sqlite = require(join(compiled, "sqliteProgressionStore.js"));
  const databasePath = join(output, "restart.sqlite");
  const adapterDatabasePath = join(output, "adapter.sqlite");
  const originalProvider = process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER;
  const originalDatabasePath = process.env.LIVING_TEXTBOOK_PROGRESSION_DB_PATH;

  try {
    runAdapterChecks(adapter, "process-memory", "rehearsal");
    process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER = "sqlite";
    process.env.LIVING_TEXTBOOK_PROGRESSION_DB_PATH = adapterDatabasePath;
    runAdapterChecks(adapter, "sqlite", "durable");

    const firstStore = new sqlite.SqliteProgressionStore(databasePath);
    const durableRecord = createRecord("restart", "2026-09-19T01:00:00.000Z");
    const written = firstStore.write(durableRecord);
    if (written.status !== "accepted" || written.idempotent) failures.push("SQLite first write was not accepted as a new record.");
    firstStore.close();

    const reopenedStore = new sqlite.SqliteProgressionStore(databasePath);
    const reopened = reopenedStore.read(identityOf(durableRecord));
    if (!reopened || reopened.idempotencyKey !== durableRecord.idempotencyKey) failures.push("SQLite record did not survive a store restart.");
    const otherTenant = reopenedStore.read({ ...identityOf(durableRecord), tenantId: "other-tenant" });
    if (otherTenant !== undefined) failures.push("SQLite read crossed a tenant boundary.");
    reopenedStore.close();
  } finally {
    sqlite.closeDurableProgressionStore();
    restoreEnv("LIVING_TEXTBOOK_PERSISTENCE_PROVIDER", originalProvider);
    restoreEnv("LIVING_TEXTBOOK_PROGRESSION_DB_PATH", originalDatabasePath);
  }
} catch (error) {
  failures.push(`Provider conformance smoke test failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS process-memory and SQLite adapters agree on idempotency, conflicts, tenant isolation, and SQLite restart durability.");
}

function runAdapterChecks(adapterModule, provider, label) {
  process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER = provider;
  const adapter = adapterModule.getProgressionPersistenceAdapter();
  const record = createRecord(`${label}-primary`, "2026-09-19T00:00:00.000Z");
  const first = adapter.write(record);
  if (first.status !== "accepted" || first.idempotent) failures.push(`${label}: first write was not accepted as new.`);

  const replay = adapter.write(Object.fromEntries(Object.entries(record).reverse()));
  if (replay.status !== "accepted" || !replay.idempotent) failures.push(`${label}: exact replay was not idempotent.`);

  const changed = adapter.write({ ...record, progression: { ...record.progression, earnedStarDust: 999 } });
  if (changed.status !== "conflict" || !changed.errors.some((error) => error.includes("different progression payload"))) {
    failures.push(`${label}: changed payload was not rejected as an idempotency conflict.`);
  }

  const wrongIdentity = adapter.write({ ...record, tenantId: "other-tenant" });
  if (wrongIdentity.status !== "conflict" || !wrongIdentity.errors.some((error) => error.includes("different tenant-scoped identity"))) {
    failures.push(`${label}: cross-tenant idempotency reuse was not rejected.`);
  }

  const newer = adapter.write({
    ...record,
    writtenAt: "2026-09-19T00:00:01.000Z",
    idempotencyKey: `${record.idempotencyKey}-newer`,
    continuity: { ...record.continuity, continuityId: `${record.continuity.continuityId}-newer` },
    progression: { ...record.progression, earnedStarDust: 301, lastEventAt: "2026-09-19T00:00:01.000Z" },
  });
  if (newer.status !== "accepted" || newer.idempotent) failures.push(`${label}: newer identity event was not accepted as new.`);

  const read = adapter.read(identityOf(record));
  if (!read || read.tenantId !== record.tenantId || read.idempotencyKey !== newer.record?.idempotencyKey) {
    failures.push(`${label}: identity read did not return the newest record.`);
  }
  const otherTenant = adapter.read({ ...identityOf(record), tenantId: "other-tenant" });
  if (otherTenant !== undefined) failures.push(`${label}: identity read crossed a tenant boundary.`);
}

function createRecord(suffix, writtenAt) {
  const identity = {
    tenantId: `tenant-${suffix}`,
    packageId: "package-sample",
    launchCode: `launch-${suffix}`,
    studentSessionId: `student-${suffix}`,
  };
  const snapshot = {
    ...identity,
    currentStep: "memory-match",
    unlockedGameModes: ["flashcards", "memory-match"],
    completedGameModes: ["flashcards"],
    earnedStarDust: 300,
    masteryStatus: "in-progress",
    lastEventAt: writtenAt,
  };
  return {
    recordVersion: 1,
    category: "progression-continuity",
    adapterMode: "hosted-managed",
    durability: "durable-managed",
    ...identity,
    continuity: { ...identity, continuityId: `completion-${suffix}`, destinationRoute: "/memory/demo-unit-1", snapshot },
    progression: snapshot,
    writtenAt,
    idempotencyKey: `completion-${suffix}`,
  };
}

function identityOf(record) {
  return {
    tenantId: record.tenantId,
    packageId: record.packageId,
    launchCode: record.launchCode,
    studentSessionId: record.studentSessionId,
  };
}

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}
