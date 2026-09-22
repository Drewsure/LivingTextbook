import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const model = readSource("../packages/content-model/src/pilotReviewDecisionImplementationReadiness.ts");
const index = readSource("../packages/content-model/src/index.ts");
const fixture = readSource("../apps/web/src/data/samplePilotReviewDecisionImplementationReadiness.ts");
const panel = readSource("../apps/web/src/features/persistence/PilotReviewDecisionImplementationReadinessPanel.tsx");
const page = readSource("../apps/web/src/app/teacher/persistence/page.tsx");
const failures = [];

for (const marker of [
  "PilotReviewDecisionImplementationReadiness",
  "snapshotContractValid",
  "adapterContractValid",
  "retentionPolicyValid",
  "providerSelectionAllowed",
  "implementationAllowed",
  "No provider selection",
  "No provider implementation",
  "No snapshot write",
  "No snapshot restore",
  "No snapshot export",
  "No review decision activation",
]) {
  if (!model.includes(marker)) failures.push(`Implementation readiness model missing marker: ${marker}`);
}
requireText(index, 'export * from "./pilotReviewDecisionImplementationReadiness";', "Implementation readiness must be exposed through the public content-model root.");
requireText(fixture, 'status: "blocked"', "Sample implementation readiness must remain blocked.");
requireText(fixture, "providerSelectionAllowed: false", "Sample implementation readiness must block provider selection.");
requireText(fixture, "implementationAllowed: false", "Sample implementation readiness must block implementation.");
requireText(panel, "Persistence evidence is complete enough to plan, not to activate", "Persistence workbench must show implementation readiness.");
requireText(page, "PilotReviewDecisionImplementationReadinessPanel", "Persistence workbench must mount implementation readiness.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS provider-neutral implementation readiness reconciles persistence evidence while selection and implementation remain blocked.");

function readSource(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
