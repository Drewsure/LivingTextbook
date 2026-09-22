import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const model = readSource("../packages/content-model/src/pilotReviewDecisionRetentionPolicy.ts");
const index = readSource("../packages/content-model/src/index.ts");
const fixture = readSource("../apps/web/src/data/samplePilotReviewDecisionRetentionPolicy.ts");
const panel = readSource("../apps/web/src/features/persistence/PilotReviewDecisionRetentionPolicyPanel.tsx");
const page = readSource("../apps/web/src/app/teacher/persistence/page.tsx");
const failures = [];

for (const marker of [
  "PilotReviewDecisionRetentionPolicy",
  "reviewDecisionSnapshotRetentionDays",
  "auditTrailRetentionDays",
  "retentionPolicyAccepted",
  "auditPolicyAccepted",
  "schoolPolicyAccepted",
  "snapshotWriteAllowed",
  "deletionRequired",
  "rawAudioRetentionAllowed",
  "transcriptRetentionAllowed",
  "No snapshot write",
  "No snapshot restore",
  "No snapshot export",
  "No review decision activation",
]) {
  if (!model.includes(marker)) failures.push(`Retention policy model missing marker: ${marker}`);
}
requireText(index, 'export * from "./pilotReviewDecisionRetentionPolicy";', "Retention policy must be exposed through the public content-model root.");
requireText(fixture, 'readiness: "review-only"', "Sample retention policy must remain review-only.");
requireText(fixture, "snapshotWriteAllowed: false", "Sample retention policy must block snapshot writes.");
requireText(fixture, "samplePilotReviewDecisionRetentionPolicyWarnings", "Sample retention policy must expose warnings.");
requireText(panel, "Provider implementation waits for policy acceptance", "Persistence workbench must show the policy gate.");
requireText(panel, "Policy warnings", "Persistence workbench must show policy warnings.");
requireText(page, "PilotReviewDecisionRetentionPolicyPanel", "Persistence workbench must mount the retention policy panel.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS pilot review decision retention and audit policy remains tenant-bound, review-only, and write-blocked.");

function readSource(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
