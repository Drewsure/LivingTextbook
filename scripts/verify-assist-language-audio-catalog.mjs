import { readFileSync } from "node:fs";

const contract = readSource("../packages/content-model/src/assistLanguageAudioCatalog.ts");
const sample = readSource("../apps/web/src/data/sampleAssistLanguageAudioCatalog.ts");
const panel = readSource("../apps/web/src/features/multimedia/TeacherAssistLanguageAudioCatalogPanel.tsx");
const route = readSource("../apps/web/src/app/teacher/media/[tenantId]/page.tsx");
const failures = [];

for (const marker of [
  "AssistLanguageAudioCatalogRecord",
  "checksum",
  "transcript",
  "spokenTextMatch",
  "rightsStatus",
  "sourceLineageRef",
  "hostedReference",
  "localBundlePath",
  "validateAssistLanguageAudioCatalogRecord",
  "No catalog admission",
  "No hosted media promotion",
  "No local bundle activation",
  "No student-facing assist audio",
  'promotionAllowed: false',
  'mode: "review-only"',
  'sideEffect: "none"',
]) {
  if (!contract.includes(marker)) failures.push(`Catalog contract missing marker: ${marker}`);
}

for (const marker of [
  "sampleAssistLanguageAudioCatalogRecords",
  "createReviewOnlyAssistLanguageAudioCatalogRecord",
  "Checksum evidence is not captured.",
  "Rights evidence is not reviewed.",
  "Transcript evidence is not captured.",
  "Spoken-text match is not verified against the reviewed gloss.",
  "Local/hosted delivery fallback evidence is not reviewed.",
]) {
  if (!sample.includes(marker)) failures.push(`Catalog sample missing marker: ${marker}`);
}

for (const marker of [
  "Support-audio catalog admission",
  "Review before catalog binding",
  "Checksum",
  "Source lineage",
  "Spoken-text match",
  "This preview does not upload",
]) {
  if (!panel.includes(marker)) failures.push(`Catalog panel missing marker: ${marker}`);
}

if (!route.includes("TeacherAssistLanguageAudioCatalogPanel") || !route.includes("sampleAssistLanguageAudioCatalogRecords")) {
  failures.push("Teacher media route must expose the support-audio catalog review panel.");
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS assist-language audio catalog admission keeps checksum, transcript, rights, accessibility, delivery, and promotion boundaries review-only.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
