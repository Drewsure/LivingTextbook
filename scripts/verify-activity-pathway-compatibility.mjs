import { readFileSync } from "node:fs";

const matrix = readSource("../apps/web/src/data/sampleActivityPathwayCompatibility.ts");
const panel = readSource("../apps/web/src/features/game-offers/ActivityPathwayCompatibilityPanel.tsx");
const routeVerifier = readSource("./verify-active-routes.mjs");
const docs = readSource("../docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md");
const pathwayDocs = readSource("../docs/ACTIVITY_PATHWAY_COMPATIBILITY_MATRIX.md");
const backendStorageVerifier = readSource("./verify-backend-storage-readiness.mjs");

const failures = [];
const requiredOfferedItems = ["entry-flashcards", "match-up", "label-it", "memory-match", "teacher-review-quiz", "true-false", "type-answer", "spelling-practice", "fill-in-the-blank", "sentence-builder"];
const requiredPlannedItems = ["printable-vocabulary-sheet", "printable-sentence-practice"];
const requiredBlockedItems = ["word-search", "crossword"];
const requiredPolicyText = [
  "targetLanguageTrigger",
  "support language cannot unlock",
  "Printable vocabulary sheet",
  "Crossword",
  "teacherPromise",
];

for (const itemId of requiredOfferedItems) {
  requireItemStatus(itemId, "offered");
}

for (const itemId of requiredPlannedItems) {
  requireItemStatus(itemId, "planned");
}

for (const itemId of requiredBlockedItems) {
  requireItemStatus(itemId, "blocked");
}

for (const text of requiredPolicyText) {
  requireText(matrix, text, `Activity pathway matrix missing policy text: ${text}`);
}

requireText(panel, "Activity pathway compatibility", "Activity pathway panel must expose its review heading.");
requireText(panel, "Target-language trigger", "Activity pathway panel must show target-language trigger rules.");
requireText(routeVerifier, "Activity pathway compatibility", "Active route verifier must check teacher intake pathway panel.");
requireText(routeVerifier, "Printable vocabulary sheet", "Active route verifier must check printable pathway visibility.");
requireText(routeVerifier, "Target-language trigger", "Active route verifier must check target-language trigger visibility.");
requireText(docs, "curated teacher-approved pathways", "Competitive matrix docs must preserve curated pathway stance.");
requireText(docs, "Add printable/PDF activity output", "Competitive matrix docs must preserve printable planning.");
requireText(pathwayDocs, "activity_compatibility_snapshot", "Activity pathway docs must preserve compatibility snapshot storage contract.");
requireText(pathwayDocs, "student-facing pathway blocks", "Activity pathway docs must preserve student-facing pathway blocks.");
requireText(backendStorageVerifier, "activity_compatibility_snapshot", "Backend storage verifier must require activity compatibility snapshots.");
requireText(backendStorageVerifier, "blocksUncheckedActivityConversion: true", "Backend storage verifier must require unchecked conversion blocks.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS activity pathway compatibility covers ${requiredOfferedItems.length} offered output(s), ${requiredPlannedItems.length} planned printable output(s), and ${requiredBlockedItems.length} blocked conversion(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function requireItemStatus(itemId, status) {
  const escaped = itemId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`itemId:\\s*"${escaped}"[\\s\\S]*?status:\\s*"${status}"`, "m");

  if (!pattern.test(matrix)) {
    failures.push(`Activity pathway item ${itemId} must have status ${status}.`);
  }
}
