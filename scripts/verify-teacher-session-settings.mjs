import { readFileSync } from "node:fs";

const contract = readSource("../packages/content-model/src/sessionSettings.ts");
const settingsHelper = readSource("../apps/web/src/data/sampleTeacherSessionSettings.ts");
const launchResolver = readSource("../apps/web/src/data/sampleLaunchResolver.ts");
const frontDoorRegistry = readSource("../apps/web/src/data/sampleTenantRouteRegistry.ts");
const backendSchema = readSource("../apps/web/src/data/sampleBackendSchemaDraft.ts");
const migrationSpecs = readSource("../apps/web/src/data/sampleBackendMigrationSpecs.ts");
const persistenceAdapter = readSource("../apps/web/src/data/samplePersistenceAdapterPlan.ts");
const sampleMonitor = readSource("../apps/web/src/data/sampleTeacherSessionMonitor.ts");
const monitorPanel = readSource("../apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx");
const routeVerifier = readSource("./verify-active-routes.mjs");
const settingsDoc = readSource("../docs/TEACHER_SESSION_SETTINGS_CONTRACT.md");
const assistDoc = readSource("../docs/ASSIST_LANGUAGE_STANDARD.md");
const failures = [];

const safetyGuards = [
  ["audio-required", "if (!settings.audioRequired)"],
  ["assist-unlock-block", "if (settings.assistLanguage.unlockAllowed)"],
  ["assist-mastery-block", "if (settings.assistLanguage.masteryCreditAllowed)"],
  ["enabled-assist-not-teacher-only", 'settings.assistLanguage.visibility === "teacher-only"'],
  ["demo-raw-audio-block", "Demo-only sessions must not store raw audio."],
  ["background-audio-priority", "Background media must pause, duck, or mute when learner-facing audio plays."],
  ["background-unlock-block", "if (settings.backgroundMedia.unlockAllowed)"],
  ["background-mastery-block", "if (settings.backgroundMedia.masteryCreditAllowed)"],
  ["ai-tutor-tier", "Enabled AI Tutor session settings must require premium or enterprise entitlement."],
  ["speech-scoring-gate", "Speech scoring cannot be enabled when AI Tutor is disabled."],
  ["transcript-demo-block", "Demo-only sessions must not store transcripts."],
];

const persistenceWarnings = [
  "Assist-language visibility requires persisted teacher enablement",
  "Teacher microphone approval is still demo-local",
  "Background media requires persisted teacher enablement",
  "Training Academy trigger thresholds are demo-local",
  "Teacher reporting is demo-only",
  "Teacher report export is not enabled",
];

const sampleMarkers = [
  "requiresTeacherEnablement: true",
  "teacherEnablementPersisted: args.teacherEnablementPersisted ?? false",
  "unlockAllowed: false",
  "masteryCreditAllowed: false",
  "pausesForLearningAudio: true",
  "storesRawAudio: false",
  "storesTranscript: false",
  "settingsPersisted: false",
];

requireText(contract, "requiresTeacherEnablement: boolean", "TeacherSessionSettings must model assist-language teacher enablement.");
requireText(contract, "teacherEnablementPersisted: boolean", "TeacherSessionSettings must model persisted assist-language teacher enablement.");

for (const [guardId, marker] of safetyGuards) {
  requireText(contract, marker, `Teacher session settings safety guard missing: ${guardId}.`);
}

for (const warning of persistenceWarnings) {
  requireText(contract, warning, `Teacher session settings persistence warning missing: ${warning}.`);
}

for (const marker of sampleMarkers) {
  requireText(settingsHelper, marker, `Sample teacher session settings helper missing marker: ${marker}.`);
}

requireText(launchResolver, "sessionSettings", "Direct launch context must carry teacher session settings.");
requireText(frontDoorRegistry, "sessionSettings", "Front-door context must carry teacher session settings.");
requireText(backendSchema, "assist_language_teacher_enablement_persisted", "Backend schema draft must preserve assist-language teacher enablement.");
requireText(migrationSpecs, "assist_language_teacher_enablement_persisted", "Backend migration specs must preserve assist-language teacher enablement.");
requireText(persistenceAdapter, "assist-language teacher enablement", "Persistence adapter plan must preserve assist-language teacher enablement.");
requireText(sampleMonitor, "createSampleTeacherSessionSettings", "Teacher session monitor must reuse the shared sample settings helper.");
requireText(sampleMonitor, "Assist text can support comprehension, but the teacher's on/off choice must persist", "Sample settings copy must explain persisted assist-language choice.");
requireText(monitorPanel, "teacher_enablement_persisted", "Teacher session settings snapshot must expose assist-language persistence state.");
requireText(routeVerifier, "teacher_enablement_persisted", "Active route verifier must guard assist-language persistence snapshot text.");
requireText(settingsDoc, "Both enabling and disabling support language must persist", "Teacher session settings contract must explain persisted assist-language on/off state.");
requireText(assistDoc, "teacher-session settings contract now models the durable setting", "Assist-language standard must reference the durable session settings contract.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS teacher session settings covers ${safetyGuards.length} safety guard(s), ${persistenceWarnings.length} persistence warning(s), and ${sampleMarkers.length} sample marker(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
