import { readFileSync } from "node:fs";

const queueData = readSource("../apps/web/src/data/sampleSourceReviewQueue.ts");
const queuePanel = readSource("../apps/web/src/features/content-intake/SourceReviewQueuePanel.tsx");
const teacherIntakePage = readSource("../apps/web/src/app/teacher/intake/page.tsx");
const backendSchema = readSource("../apps/web/src/data/sampleBackendSchemaDraft.ts");
const migrationSpecs = readSource("../apps/web/src/data/sampleBackendMigrationSpecs.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const sourceReviewChecks = readSource("../docs/verification/SOURCE_REVIEW_QUEUE_CHECKS.md");
const failures = [];

const requiredSourceIds = [
  "src-ministar-master-docx",
  "src-sample-publisher-unit-pdf",
  "src-sample-publisher-audio-folder",
  "src-sample-publisher-video-folder",
];

const requiredKinds = ["curriculum-docx", "textbook-pdf", "media-audio", "media-video"];

const requiredRecords = [
  "source_extraction_review_packet",
  "upload_file_policy_profile",
  "upload_intake_asset",
  "teacher_draft_package",
  "teacher_draft_review_handoff",
];

const blockedShortcuts = [
  "No raw PDF as student payload",
  "No unreviewed OCR assignment",
  "No automatic PDF-to-game publish",
  "No AI extraction direct assignment",
  "No parser output as a route target",
];

const hardRules = [
  "Original source files are preserved",
  "AI extraction can propose structure",
  "Media files require rights/ownership notes",
  "Support-language text is reviewed content support only",
  "Every source item must map to a package",
];

for (const sourceId of requiredSourceIds) {
  requireText(queueData, `sourceId: "${sourceId}"`, `Source review queue missing source id: ${sourceId}.`);
}

for (const kind of requiredKinds) {
  requireText(queueData, `kind: "${kind}"`, `Source review queue missing source kind: ${kind}.`);
}

for (const record of requiredRecords) {
  requireText(queueData, `"${record}"`, `Source review queue missing required record: ${record}.`);
  requireText(routeVerifier, record, `Active route verifier must check source review record: ${record}.`);
}

for (const shortcut of blockedShortcuts) {
  requireText(queueData, `"${shortcut}"`, `Source review queue missing blocked shortcut: ${shortcut}.`);
  requireText(routeVerifier, shortcut, `Active route verifier must check blocked source shortcut: ${shortcut}.`);
  requireText(sourceReviewChecks, shortcut, `Source review checklist must name blocked shortcut: ${shortcut}.`);
}

for (const rule of hardRules) {
  requireText(queueData, rule, `Source review queue missing hard rule text: ${rule}.`);
}

requireText(queueData, "ready-for-extraction", "Source review queue must support ready-for-extraction status.");
requireText(queueData, "needs-owner", "Source review queue must support needs-owner status.");
requireText(queueData, "rights-review", "Source review queue must assign media ownership to rights-review.");
requireText(queueData, "Real source PDF must be supplied for production pilot.", "Source review queue must block missing real PDFs.");
requireText(queueData, "Rights proof and real files are not present in the scaffold.", "Source review queue must block missing media rights.");
requireText(queueData, "Rights proof and bundle strategy are unresolved.", "Source review queue must block unresolved video bundle strategy.");
requireText(queuePanel, "Source review queue", "Source review panel must expose the queue heading.");
requireText(queuePanel, "What source intake cannot skip", "Source review panel must expose hard rules.");
requireText(queuePanel, "Required records before extraction promotion", "Source review panel must show extraction-promotion records.");
requireText(queuePanel, "Blocked extraction shortcuts", "Source review panel must show blocked extraction shortcuts.");
requireText(queuePanel, "Review first", "Source review panel must preserve review-first status.");
requireText(teacherIntakePage, "SourceReviewQueuePanel", "Teacher intake page must render the source review queue panel.");
requireText(teacherIntakePage, "sampleSourceReviewQueue", "Teacher intake page must pass the sample source review queue.");
requireText(backendSchema, "source_extraction_review_packet", "Backend schema must include source extraction review packets.");
requireText(backendSchema, "teacher_draft_creation_allowed", "Backend schema must block draft creation from unreviewed extraction.");
requireText(backendSchema, "student_facing_payload_allowed", "Backend schema must block student-facing extraction payloads.");
requireText(migrationSpecs, "spec-source-extraction-review-packet", "Migration specs must include source extraction review packet records.");
requireText(routeVerifier, "Required records before extraction promotion", "Active route verifier must check required source review records.");
requireText(routeVerifier, "Blocked extraction shortcuts", "Active route verifier must check blocked source review shortcuts.");
requireText(sourceReviewChecks, "Extraction review packets remain review evidence", "Source review checklist must preserve evidence-only extraction boundary.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS source review queue covers ${requiredSourceIds.length} source item(s), ${requiredRecords.length} required record(s), and ${blockedShortcuts.length} blocked shortcut(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
