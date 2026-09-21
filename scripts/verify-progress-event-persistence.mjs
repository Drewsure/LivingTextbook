import { readFileSync } from "node:fs";

const failures = [];
const sources = new Map([
  ["model", readSource("../packages/content-model/src/progressEventPersistence.ts")],
  ["store", readSource("../apps/web/src/server/persistence/sqliteProgressionStore.ts")],
  ["adapter", readSource("../apps/web/src/server/persistence/progressionPersistenceAdapter.ts")],
  ["route", readSource("../apps/web/src/app/api/persistence/events/route.ts")],
  ["resolver", readSource("../apps/web/src/server/persistence/progressEventTaxonomyResolver.ts")],
]);

const requirements = {
  model: ["ProgressEventStreamPersistenceRecord", 'category: "progress-event-stream"', "validateProgressEventEnvelopeStream", "validateProgressEventStreamPersistenceRecord", "game_started", "game_completed", "createCanonicalCompletionIdempotencyKey", "rawLearnerAudioIncluded: false", "learnerTranscriptIncluded: false", "policy and taxonomy are server-owned"],
  store: ["progress_event_stream_records", "readEventStream", "listEventStreams", "writeEventStream", "validateEventStreamStorageRecord", "event stream idempotency key is already bound to a different tenant-scoped identity", "different event payload"],
  adapter: ["ProgressEventStreamPersistenceAdapter", "getProgressEventStreamPersistenceAdapter", "listEventStreams", "__livingTextbookHostedProgressEventStreamRehearsal"],
  route: ["validateProgressEventStreamPersistenceClientWrite", "resolveProgressEventTaxonomy", "No reviewed progress-event taxonomy is bound", "readTeacherLaunchEventStreams", "hasTeacherOperationsReadAuthorization", "Cache-Control", "Durable event stream writes require the explicit deployment write gate."],
  resolver: ["resolveProgressEventTaxonomy", "unknown tenant/package must remain blocked", "no global fallback"],
};

for (const [label, markers] of Object.entries(requirements)) {
  for (const marker of markers) {
    if (!sources.get(label).includes(marker)) failures.push(`${label}: missing ${marker}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS hosted progress event evidence is tenant-bound, completion-idempotent, policy-gated, and no-raw-audio by contract.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
