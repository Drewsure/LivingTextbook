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
const sqliteSource = readFileSync(join(root, "apps", "web", "src", "server", "persistence", "sqliteProgressionStore.ts"), "utf8");
if (!sqliteSource.includes("cachedStore?.close();")) {
  failures.push("SQLite provider path changes must close the previous cached store before replacement.");
}

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
    runEventStreamAdapterChecks(adapter, "process-memory", "rehearsal");
    process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER = "sqlite";
    process.env.LIVING_TEXTBOOK_PROGRESSION_DB_PATH = adapterDatabasePath;
    runAdapterChecks(adapter, "sqlite", "durable");
    runEventStreamAdapterChecks(adapter, "sqlite", "durable");

    const firstStore = new sqlite.SqliteProgressionStore(databasePath);
    const durableRecord = createRecord("restart", "2026-09-19T01:00:00.000Z");
    const written = firstStore.write(durableRecord);
    if (written.status !== "accepted" || written.idempotent) failures.push("SQLite first write was not accepted as a new record.");
    firstStore.close();

    const reopenedStore = new sqlite.SqliteProgressionStore(databasePath);
    const reopened = reopenedStore.read(identityOf(durableRecord));
    if (!reopened || reopened.idempotencyKey !== durableRecord.idempotencyKey) failures.push("SQLite record did not survive a store restart.");
    const eventDatabasePath = join(output, "event-restart.sqlite");
    const firstEventStore = new sqlite.SqliteProgressionStore(eventDatabasePath);
    const durableEventRecord = createEventStreamRecord("restart-events", "2026-09-19T03:00:00.000Z");
    const eventWritten = firstEventStore.writeEventStream(durableEventRecord);
    if (eventWritten.status !== "accepted" || eventWritten.idempotent) failures.push("SQLite event stream first write was not accepted as new.");
    firstEventStore.close();
    const reopenedEventStore = new sqlite.SqliteProgressionStore(eventDatabasePath);
    const reopenedEvent = reopenedEventStore.readEventStream(identityOf(durableEventRecord));
    if (!reopenedEvent || reopenedEvent.idempotencyKey !== durableEventRecord.idempotencyKey) failures.push("SQLite event stream did not survive a store restart.");
    const listedEvents = reopenedEventStore.listEventStreams({ tenantId: durableEventRecord.tenantId, packageId: durableEventRecord.packageId, launchCode: durableEventRecord.launchCode });
    if (listedEvents.length !== 1 || listedEvents[0]?.idempotencyKey !== durableEventRecord.idempotencyKey) failures.push("SQLite launch-scoped event stream list did not survive a store restart.");
    const otherTenant = reopenedStore.read({ ...identityOf(durableRecord), tenantId: "other-tenant" });
    if (otherTenant !== undefined) failures.push("SQLite read crossed a tenant boundary.");
    reopenedStore.close();
    reopenedEventStore.close();
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

function runEventStreamAdapterChecks(adapterModule, provider, label) {
  process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER = provider;
  const adapter = adapterModule.getProgressEventStreamPersistenceAdapter();
  const record = createEventStreamRecord(`${label}-events`, "2026-09-19T02:00:00.000Z");
  const first = adapter.writeEventStream(record);
  if (first.status !== "accepted" || first.idempotent) failures.push(`${label}: event stream first write was not accepted as new.`);

  const replay = adapter.writeEventStream(Object.fromEntries(Object.entries(record).reverse()));
  if (replay.status !== "accepted" || !replay.idempotent) failures.push(`${label}: event stream exact replay was not idempotent.`);

  const changed = adapter.writeEventStream({ ...record, events: [...record.events, { ...record.events[0], event_id: `${record.events[0].event_id}-changed` }] });
  if (changed.status !== "conflict" || !changed.errors.some((error) => error.includes("different event payload"))) failures.push(`${label}: changed event stream payload was not rejected.`);

  const wrongIdentity = adapter.writeEventStream({ ...record, tenantId: "other-tenant" });
  if (wrongIdentity.status !== "conflict" || !wrongIdentity.errors.some((error) => error.includes("different tenant-scoped identity") || error.includes("canonical completion identity"))) failures.push(`${label}: event stream cross-tenant idempotency reuse was not rejected.`);

  const badPrivacy = adapter.writeEventStream({ ...record, idempotencyKey: `${record.idempotencyKey}-privacy`, rawLearnerAudioIncluded: true });
  if (badPrivacy.status !== "conflict" || !badPrivacy.errors.some((error) => error.includes("raw learner audio"))) failures.push(`${label}: event stream raw audio storage was not rejected.`);

  const badIdentity = adapter.writeEventStream({ ...record, idempotencyKey: `${record.idempotencyKey}-bad-key` });
  if (badIdentity.status !== "conflict" || !badIdentity.errors.some((error) => error.includes("canonical completion identity"))) failures.push(`${label}: event stream canonical idempotency mismatch was not rejected.`);

  const read = adapter.readEventStream(identityOf(record));
  if (!read || read.idempotencyKey !== record.idempotencyKey) failures.push(`${label}: event stream identity read did not return the stored record.`);
  const listed = adapter.listEventStreams({ tenantId: record.tenantId, packageId: record.packageId, launchCode: record.launchCode });
  if (listed.length !== 1 || listed[0]?.idempotencyKey !== record.idempotencyKey) failures.push(`${label}: launch-scoped event stream list did not return the validated record.`);
  const otherTenantList = adapter.listEventStreams({ tenantId: "other-tenant", packageId: record.packageId, launchCode: record.launchCode });
  if (otherTenantList.length !== 0) failures.push(`${label}: launch-scoped event stream list crossed a tenant boundary.`);
  const otherTenant = adapter.readEventStream({ ...identityOf(record), tenantId: "other-tenant" });
  if (otherTenant !== undefined) failures.push(`${label}: event stream read crossed a tenant boundary.`);
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

function createEventStreamRecord(suffix, writtenAt) {
  const identity = {
    tenantId: `tenant-${suffix}`,
    packageId: "package-sample",
    launchCode: `launch-${suffix}`,
    studentSessionId: `student-${suffix}`,
  };
  const eventBase = {
    event_effect: "report-only",
    taxonomy_version: "taxonomy-v2026.07.foundation",
    event_acceptance_gate_id: "gate-sample",
    settings_context: {
      game_mode_settings_profile_id: "safe-default",
      teacher_game_mode_settings_snapshot_id: "snapshot-sample",
      settings_contract_id: "settings-v1",
      progress_trigger_policy: "target-language-only",
      support_language_progress_allowed: false,
      media_only_progress_allowed: false,
      scoring_profile_override_allowed: false,
    },
    unit_key: "ministar-english:L1:U1",
    game_mode: "memory-match",
    launch_code: identity.launchCode,
    student_session_id: identity.studentSessionId,
    occurred_at: writtenAt,
    metadata: { replaySeed: "replay-v1:ministar-english-l1-u1:memory-match" },
  };
  return {
    recordVersion: 1,
    category: "progress-event-stream",
    adapterMode: "hosted-managed",
    durability: "durable-managed",
    ...identity,
    unitKey: eventBase.unit_key,
    gameMode: eventBase.game_mode,
    taxonomyVersion: eventBase.taxonomy_version,
    eventAcceptanceGateId: eventBase.event_acceptance_gate_id,
    events: [
      { ...eventBase, event_id: `event-${suffix}-start`, event_type: "game_started" },
      { ...eventBase, event_id: `event-${suffix}-complete`, event_type: "game_completed", event_effect: "progress-affecting", occurred_at: "2026-09-19T02:00:01.000Z" },
    ],
    writtenAt,
    idempotencyKey: `completion-v1:${identity.tenantId}:ministar-english%3AL1%3AU1:${identity.launchCode}:${identity.studentSessionId}:memory-match`,
    rawLearnerAudioIncluded: false,
    learnerTranscriptIncluded: false,
  };
}

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}
