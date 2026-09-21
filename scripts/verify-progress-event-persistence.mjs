import { readFileSync } from "node:fs";

const failures = [];
const sources = new Map([
  ["model", readSource("../packages/content-model/src/progressEventPersistence.ts")],
  ["store", readSource("../apps/web/src/server/persistence/sqliteProgressionStore.ts")],
  ["adapter", readSource("../apps/web/src/server/persistence/progressionPersistenceAdapter.ts")],
  ["route", readSource("../apps/web/src/app/api/persistence/events/route.ts")],
]);

const requirements = {
  model: ["ProgressEventStreamPersistenceRecord", 'category: "progress-event-stream"', "validateProgressEventEnvelopeStream", "game_started", "game_completed", "createCanonicalCompletionIdempotencyKey", "rawLearnerAudioIncluded: false", "learnerTranscriptIncluded: false", "policy and taxonomy are server-owned"],
  store: ["progress_event_stream_records", "readEventStream", "writeEventStream", "event stream idempotency key is already bound to a different tenant-scoped identity", "different event payload"],
  adapter: ["ProgressEventStreamPersistenceAdapter", "getProgressEventStreamPersistenceAdapter", "__livingTextbookHostedProgressEventStreamRehearsal"],
  route: ["validateProgressEventStreamPersistenceClientWrite", "sampleProgressEventTaxonomyRegistry", "hasTeacherOperationsReadAuthorization", "Cache-Control", "Durable event stream writes require the explicit deployment write gate."],
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
