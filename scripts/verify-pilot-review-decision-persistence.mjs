import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const recordModel = readSource("../packages/content-model/src/persistenceRecords.ts");
const adapterModel = readSource("../packages/content-model/src/persistenceAdapter.ts");
const recordFixture = readSource("../apps/web/src/data/samplePilotReviewDecisionPersistence.ts");
const persistencePlan = readSource("../apps/web/src/data/samplePersistencePlan.ts");
const adapterPlan = readSource("../apps/web/src/data/samplePersistenceAdapterPlan.ts");
const persistencePage = readSource("../apps/web/src/app/teacher/persistence/page.tsx");
const failures = [];

requireText(recordModel, '"pilot-review-decision"', "Persistence records must define the pilot review decision category.");
requireText(recordModel, "preservesPilotReviewDecision", "Durable record contracts must preserve the canonical review decision.");
requireText(recordModel, "blocksPilotReviewDecisionActivation", "Durable record contracts must block review decision activation.");
requireText(adapterModel, "preservesPilotReviewDecision", "Adapter intents must preserve the canonical review decision.");
requireText(adapterModel, "blocksPilotReviewDecisionActivation", "Adapter intents must block review decision activation.");
requireText(recordFixture, "samplePilotReviewDecisionRecord", "A canonical pilot review decision durable record fixture is required.");
requireText(recordFixture, "samplePilotReviewDecisionWriteIntents", "Hosted and local pilot review decision write intents are required.");
requireText(recordFixture, "tenantBoundaryKey: \"tenantId\"", "Pilot review decision persistence must name its tenant boundary.");
requireText(recordFixture, "blocksPilotReviewDecisionActivation: true", "Pilot review decision persistence must block activation.");
requireText(recordFixture, "validateDurableRecordContracts", "The persistence fixture must expose durable record validation.");
requireText(recordFixture, "validatePersistenceAdapterPlan", "The persistence fixture must expose adapter plan validation.");
requireText(persistencePlan, "samplePilotReviewDecisionRecord", "The durable record map must include the pilot review decision record.");
requireText(adapterPlan, "samplePilotReviewDecisionWriteIntents", "The hosted and local adapter plans must include review decision intents.");
requireText(persistencePage, "samplePilotReviewDecisionPersistenceErrors", "The persistence workbench must surface review decision contract errors.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS pilot review decision has a tenant-bound durable record and hosted/local activation-blocking adapter intents.");

function readSource(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
