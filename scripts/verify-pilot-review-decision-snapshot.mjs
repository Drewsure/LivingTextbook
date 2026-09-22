import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const model = readSource("../packages/content-model/src/pilotReviewDecisionPersistence.ts");
const index = readSource("../packages/content-model/src/index.ts");
const fixture = readSource("../apps/web/src/data/samplePilotReviewDecisionSnapshots.ts");
const panel = readSource("../apps/web/src/features/persistence/PilotReviewDecisionPersistenceSnapshotPanel.tsx");
const page = readSource("../apps/web/src/app/teacher/persistence/page.tsx");
const failures = [];

requireText(model, 'category: "pilot-review-decision-snapshot"', "Snapshot model must use the canonical review decision snapshot category.");
requireText(model, 'storageMode: "provider-neutral"', "Snapshot model must remain provider-neutral.");
requireText(model, "decisionFingerprint", "Snapshot model must carry a decision fingerprint.");
requireText(model, "restoreAllowed: false", "Snapshot model must block restore.");
requireText(model, "exportAllowed: false", "Snapshot model must block export.");
requireText(model, "writesAllowed: false", "Snapshot model must block writes.");
requireText(model, "activationAllowed: false", "Snapshot model must block activation.");
requireText(model, "rawLearnerAudioIncluded", "Snapshot model must exclude raw learner audio.");
requireText(model, "learnerTranscriptIncluded", "Snapshot model must exclude learner transcripts.");
requireText(model, "fingerprintPilotReviewDecision", "Snapshot model must validate fingerprints.");
requireText(model, "createReviewOnlyPilotReviewDecisionPersistenceAdapter", "Snapshot model must expose a review-only adapter.");
requireText(model, 'sideEffect: "none"', "Snapshot adapter must prove no side effects.");
requireText(model, "No review decision activation", "Snapshot adapter must block activation.");
requireText(index, 'export * from "./pilotReviewDecisionPersistence";', "Snapshot model must be exposed through the public content-model root.");
requireText(fixture, "hosted-managed", "Snapshot fixture must cover hosted-managed persistence.");
requireText(fixture, "local-classroom", "Snapshot fixture must cover local-classroom persistence.");
requireText(fixture, "samplePilotReviewDecisionSnapshotErrors", "Snapshot fixture must expose validation results.");
requireText(fixture, "samplePilotReviewDecisionSnapshotAdapterResults", "Snapshot fixture must expose adapter rehearsal results.");
requireText(panel, "Provider-neutral recovery without activation authority", "Persistence workbench must explain the snapshot boundary.");
requireText(panel, "Restore / export", "Persistence workbench must show blocked recovery actions.");
requireText(page, "PilotReviewDecisionPersistenceSnapshotPanel", "Persistence workbench must mount the snapshot panel.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS pilot review decision snapshots are versioned, fingerprinted, provider-neutral, and activation-blocked.");

function readSource(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
