import { readFileSync } from "node:fs";

const contentModelPath = new URL("../packages/content-model/src/index.ts", import.meta.url);
const validatorPath = new URL("../packages/content-model/src/progressEventTaxonomy.ts", import.meta.url);
const taxonomyPath = new URL("../apps/web/src/data/sampleProgressEventTaxonomy.ts", import.meta.url);
const panelPath = new URL("../apps/web/src/features/progression/ProgressEventTaxonomyPanel.tsx", import.meta.url);
const teacherSessionDataPath = new URL("../apps/web/src/data/sampleTeacherSessionMonitor.ts", import.meta.url);
const teacherSessionPanelPath = new URL("../apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx", import.meta.url);

const contentModel = readFileSync(contentModelPath, "utf8");
const validator = readFileSync(validatorPath, "utf8");
const taxonomy = readFileSync(taxonomyPath, "utf8");
const panel = readFileSync(panelPath, "utf8");
const teacherSessionData = readFileSync(teacherSessionDataPath, "utf8");
const teacherSessionPanel = readFileSync(teacherSessionPanelPath, "utf8");

const gameEventTypeMatch = contentModel.match(/export type GameEventType =([\s\S]*?);/);

if (!gameEventTypeMatch) {
  console.error("FAIL Could not find GameEventType union in packages/content-model/src/index.ts.");
  process.exit(1);
}

const modelEvents = Array.from(gameEventTypeMatch[1].matchAll(/\|\s*"([^"]+)"/g), (match) => match[1]).sort();
const taxonomyEvents = Array.from(taxonomy.matchAll(/eventType:\s*"([^"]+)"/g), (match) => match[1]).sort();
const duplicateTaxonomyEvents = taxonomyEvents.filter((event, index) => taxonomyEvents.indexOf(event) !== index);
const missingFromTaxonomy = modelEvents.filter((event) => !taxonomyEvents.includes(event));
const extraInTaxonomy = taxonomyEvents.filter((event) => !modelEvents.includes(event));
const taxonomyVersion = taxonomy.match(/taxonomyVersion:\s*"([^"]+)"/)?.[1] ?? "";
const requiredFields = [
  "event_id",
  "event_type",
  "event_effect",
  "taxonomy_version",
  "event_acceptance_gate_id",
  "settings_context",
  "metadata",
  "occurred_at",
];
const missingRequiredFields = requiredFields.filter((field) => !taxonomy.includes(`"${field}"`));

if (taxonomyVersion.trim().length === 0) {
  console.error("FAIL Progress event taxonomy registry must include taxonomyVersion.");
  process.exit(1);
}

if (duplicateTaxonomyEvents.length > 0) {
  console.error(`FAIL Duplicate taxonomy event(s): ${[...new Set(duplicateTaxonomyEvents)].join(", ")}`);
  process.exit(1);
}

if (missingFromTaxonomy.length > 0) {
  console.error(`FAIL GameEventType event(s) missing from taxonomy: ${missingFromTaxonomy.join(", ")}`);
  process.exit(1);
}

if (extraInTaxonomy.length > 0) {
  console.error(`FAIL Taxonomy event(s) not present in GameEventType: ${extraInTaxonomy.join(", ")}`);
  process.exit(1);
}

if (missingRequiredFields.length > 0) {
  console.error(`FAIL Required taxonomy storage field(s) missing: ${missingRequiredFields.join(", ")}`);
  process.exit(1);
}

for (const [label, source, requiredText] of [
  [
    "shared taxonomy sample",
    taxonomy,
    [
      "sampleProgressEventTaxonomyErrors",
      "sampleProgressEventTaxonomyWarnings",
      "validateProgressEventTaxonomyRegistry",
    ],
  ],
  [
    "shared taxonomy validator",
    validator,
    [
      "validateProgressEventTaxonomyRegistry",
      "PROGRESS_EVENT_REQUIRED_FIELDS",
      "STANDARD_PROGRESS_EVENT_CONTRACT_ID",
      "PROGRESS_EVENT_ENVELOPE_REQUIRED_FIELDS",
      "createProgressEventEnvelope",
      "validateProgressEventEnvelope",
      "validateProgressEventEnvelopeStream",
      "ProgressEventSettingsContext",
      "settings_context must preserve target-language-only progress",
      "settings_context must block support-language progress",
      "settings_context must block media-only progress",
      "settings_context must block scoring profile overrides",
      "must remain support-only",
      "must remain report-only",
      "must remain progress-affecting",
      "must block progress, mastery, Star Dust, or scoring effects",
    ],
  ],
  [
    "teacher taxonomy panel",
    panel,
    [
      "Event taxonomy guard active",
      "Event taxonomy guard blocks",
      "Event taxonomy guard warnings",
    ],
  ],
  [
    "teacher session envelope data",
    teacherSessionData,
    [
      "createTeacherSessionProgressEventEnvelopeGate",
      "createProgressEventSettingsContext",
      "eventEnvelopeGate",
      "validateProgressEventEnvelopeStream",
      "STANDARD_PROGRESS_EVENT_CONTRACT_ID",
      "game-mode-settings-backend-contract-map-v1",
    ],
  ],
  [
    "teacher session envelope panel",
    teacherSessionPanel,
    [
      "Progress event envelope gate",
      "Envelope guard active",
      "Standard event contract",
      "Settings context",
      "scoring profile override blocked",
      "Sample event envelope",
    ],
  ],
]) {
  const missingText = requiredText.filter((text) => !source.includes(text));

  if (missingText.length > 0) {
    console.error(`FAIL ${label} missing required guard text: ${missingText.join(", ")}`);
    process.exit(1);
  }
}

console.log(`PASS ${taxonomyVersion} covers ${modelEvents.length} shared GameEventType event(s).`);
