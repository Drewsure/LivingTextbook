import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const model = readSource("../packages/content-model/src/persistenceProviderSelectionPreflight.ts");
const index = readSource("../packages/content-model/src/index.ts");
const fixture = readSource("../apps/web/src/data/samplePersistenceProviderSelectionPreflight.ts");
const panel = readSource("../apps/web/src/features/persistence/PersistenceProviderSelectionPreflightPanel.tsx");
const page = readSource("../apps/web/src/app/teacher/persistence/page.tsx");
const failures = [];

for (const marker of [
  "PersistenceProviderSelectionPreflight",
  "backendMatrixId",
  "evidenceStorageGateId",
  "implementationReadinessId",
  "recommendedCandidateId",
  "selectionEvidence",
  "selectionGateId",
  "openCriterionCount",
  "sourceRecords",
  "No provider selected",
  "No provider-specific implementation",
  "No migration",
  "No persistence writes",
  "No activation",
]) {
  if (!model.includes(marker)) failures.push(`Provider selection preflight model missing marker: ${marker}`);
}
requireText(index, 'export * from "./persistenceProviderSelectionPreflight";', "Provider selection preflight must be exposed through the public content-model root.");
requireText(fixture, 'status: "blocked"', "Sample provider selection preflight must remain blocked.");
requireText(fixture, "providerSelected: false", "Sample provider selection preflight must keep provider selection false.");
requireText(fixture, "selectionAllowed: false", "Sample provider selection preflight must block selection.");
requireText(fixture, "migrationAllowed: false", "Sample provider selection preflight must block migration.");
requireText(panel, "Compare the deployment paths before selecting one", "Persistence workbench must show provider comparison preflight.");
requireText(panel, "Cross-source provider recommendation reconciliation", "Provider comparison must show cross-source selection evidence.");
requireText(panel, "No provider selected", "Provider comparison preflight must show provider selection remains blocked.");
requireText(page, "PersistenceProviderSelectionPreflightPanel", "Persistence workbench must mount provider selection preflight.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS provider comparison preflight binds backend, evidence, and implementation readiness while selection and migration remain blocked.");

function readSource(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
