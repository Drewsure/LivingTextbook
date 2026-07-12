import { readFileSync } from "node:fs";

const schemaDraft = readSource("../apps/web/src/data/sampleBackendSchemaDraft.ts");
const migrationCandidates = readSource("../apps/web/src/data/sampleBackendMigrationCandidates.ts");
const migrationSpecs = readSource("../apps/web/src/data/sampleBackendMigrationSpecs.ts");
const persistenceAdapter = readSource("../apps/web/src/data/samplePersistenceAdapterPlan.ts");
const durableRecords = readSource("../apps/web/src/data/samplePersistencePlan.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const failures = [];

const requiredSchemaEntities = [
  "tenant",
  "package_release",
  "teacher_draft_package",
  "tenant_library_item",
  "package_game_audio_coverage",
  "route_alias",
  "media_manifest",
  "launch_session",
  "progress_event",
  "collection_inventory",
  "teacher_report_package",
  "package_release_candidate",
  "publisher_maintenance_change",
  "local_companion_handoff",
  "local_companion_release_gate",
  "package_publish_gate",
  "package_approval_ledger",
];

const requiredMigrationCandidates = [
  "m001-tenant-and-entitlements",
  "m002-package-release-and-content",
  "m014-teacher-draft-package-records",
  "m015-tenant-library-item-records",
  "m003-route-alias-registry",
  "m004-media-manifest-rights",
  "m005-publish-gate-and-approval-ledger",
  "m006-launch-session-settings",
  "m007-progress-event-stream",
  "m013-earned-collection-inventory",
  "m008-local-classroom-export-store",
  "m009-teacher-report-package-boundary",
  "m010-publisher-maintenance-change-requests",
  "m011-local-companion-handoff-records",
  "m012-local-companion-release-gate-records",
];

const requiredMigrationSpecs = [
  "spec-tenant-entitlement",
  "spec-package-release",
  "spec-package-game-audio-coverage",
  "spec-teacher-draft-package",
  "spec-tenant-library-item",
  "spec-launch-session-settings",
  "spec-qr-alias",
  "spec-progress-event",
  "spec-earned-collection-inventory",
  "spec-teacher-report-package",
  "spec-publisher-maintenance-change",
  "spec-local-companion-handoff",
  "spec-local-companion-release-gate",
];

for (const entityId of requiredSchemaEntities) {
  requireText(schemaDraft, `entityId: "${entityId}"`, `Backend schema draft missing entity: ${entityId}.`);
}

for (const migrationId of requiredMigrationCandidates) {
  requireText(migrationCandidates, `migrationId: "${migrationId}"`, `Backend migration candidates missing: ${migrationId}.`);
}

for (const specId of requiredMigrationSpecs) {
  requireText(migrationSpecs, `specId: "${specId}"`, `Backend migration specs missing: ${specId}.`);
}

requireText(schemaDraft, "Raw learner audio", "Backend schema must explicitly forbid raw learner audio.");
requireText(schemaDraft, "Learner transcript", "Backend schema must explicitly forbid learner transcripts.");
requireText(schemaDraft, "teacher_draft_package", "Backend schema must include teacher draft packages.");
requireText(schemaDraft, "can_assign_to_students", "Backend schema must preserve direct assignment blocks for teacher drafts.");
requireText(schemaDraft, "Direct AI publish", "Backend schema must block direct AI publish in teacher draft records.");
requireText(schemaDraft, "tenant_library_item", "Backend schema must include tenant library items.");
requireText(schemaDraft, "student_data_copy_allowed", "Backend schema must block student data copies for library items.");
requireText(schemaDraft, "public_community_publish_allowed", "Backend schema must block public community publishing for library items.");
requireText(schemaDraft, "event_effect", "Backend schema must preserve event effect taxonomy.");
requireText(schemaDraft, "event_acceptance_gate", "Backend schema must preserve event acceptance gates.");
requireText(schemaDraft, "collection_inventory", "Backend schema must include collection inventory.");
requireText(schemaDraft, "unlock_source_event_id", "Backend schema must preserve collection unlock source events.");
requireText(schemaDraft, "Random reward seed", "Backend schema must forbid random reward seeds for collection ownership.");
requireText(schemaDraft, "assist_language_teacher_enablement_persisted", "Backend schema must preserve assist-language teacher enablement.");
requireText(migrationSpecs, "assist_language_teacher_enablement_persisted", "Migration specs must preserve assist-language teacher enablement.");
requireText(migrationSpecs, "spec-teacher-draft-package", "Migration specs must include teacher draft packages.");
requireText(migrationSpecs, "can_assign_to_students", "Migration specs must preserve teacher draft assignment blocks.");
requireText(migrationSpecs, "spec-tenant-library-item", "Migration specs must include tenant library items.");
requireText(migrationSpecs, "student_data_copy_allowed", "Migration specs must block student data copies for library items.");
requireText(migrationSpecs, "public_community_publish_allowed", "Migration specs must block public community publishing for library items.");
requireText(migrationSpecs, "event_acceptance_gate_id", "Migration specs must require event acceptance gate ids for events.");
requireText(migrationSpecs, "spec-earned-collection-inventory", "Migration specs must include earned collection inventory.");
requireText(migrationSpecs, "unlock_source_event_id", "Migration specs must preserve collection unlock source events.");
requireText(migrationSpecs, "support-only events", "Migration specs must preserve support-only event boundaries.");
requireText(persistenceAdapter, "hosted-launch-session-write", "Persistence adapter must include hosted launch-session writes.");
requireText(persistenceAdapter, "local-launch-session-write", "Persistence adapter must include local launch-session writes.");
requireText(persistenceAdapter, "hosted-teacher-draft-package-write", "Persistence adapter must include hosted teacher draft writes.");
requireText(persistenceAdapter, "local-teacher-draft-package-write", "Persistence adapter must include local teacher draft writes.");
requireText(persistenceAdapter, "preservesDraftReviewGate: true", "Persistence adapter must preserve teacher draft review gates.");
requireText(persistenceAdapter, "blocksDirectStudentAssignment: true", "Persistence adapter must block direct draft assignment.");
requireText(persistenceAdapter, "hosted-tenant-library-item-write", "Persistence adapter must include hosted tenant library writes.");
requireText(persistenceAdapter, "local-tenant-library-item-write", "Persistence adapter must include local tenant library writes.");
requireText(persistenceAdapter, "preservesLibrarySourceLineage: true", "Persistence adapter must preserve library source lineage.");
requireText(persistenceAdapter, "blocksStudentDataCopy: true", "Persistence adapter must block student data copies.");
requireText(persistenceAdapter, "blocksPublicCommunityPublishing: true", "Persistence adapter must block public community publishing.");
requireText(persistenceAdapter, "hosted-collection-inventory-write", "Persistence adapter must include hosted collection inventory writes.");
requireText(persistenceAdapter, "local-collection-inventory-write", "Persistence adapter must include local collection inventory writes.");
requireText(persistenceAdapter, "preservesEarnedCollectionRules: true", "Persistence adapter must preserve earned collection rules.");
requireText(persistenceAdapter, "rejectsRandomRewardPressure: true", "Persistence adapter must reject random reward pressure.");
requireText(persistenceAdapter, "preservesTeacherSessionSettingsSnapshot: true", "Persistence adapter must preserve teacher session settings snapshots.");
requireText(persistenceAdapter, "preservesTeacherSessionEventAcceptanceGate: true", "Persistence adapter must preserve teacher session event acceptance gates.");
requireText(persistenceAdapter, "rejectsRawAudio: true", "Persistence adapter write intents must reject raw audio.");
requireText(persistenceAdapter, "rejectsTranscripts: true", "Persistence adapter write intents must reject transcripts.");
requireText(durableRecords, "ownsTeacherSessionSettings: true", "Durable record plan must assign teacher session settings to launch sessions.");
requireText(durableRecords, "teacher-draft-package-record", "Durable record plan must include teacher draft packages.");
requireText(durableRecords, "preservesDraftReviewGate: true", "Durable record plan must preserve teacher draft review gates.");
requireText(durableRecords, "blocksDirectStudentAssignment: true", "Durable record plan must block direct draft assignment.");
requireText(durableRecords, "tenant-library-item-record", "Durable record plan must include tenant library items.");
requireText(durableRecords, "preservesLibrarySourceLineage: true", "Durable record plan must preserve library source lineage.");
requireText(durableRecords, "blocksStudentDataCopy: true", "Durable record plan must block student data copies.");
requireText(durableRecords, "blocksPublicCommunityPublishing: true", "Durable record plan must block public community publishing.");
requireText(durableRecords, "requiresEventAcceptanceGate: true", "Durable record plan must require event acceptance gates for student event storage.");
requireText(durableRecords, "earned-collection-inventory-record", "Durable record plan must include earned collection inventory.");
requireText(durableRecords, "preservesEarnedCollectionRules: true", "Durable record plan must preserve earned collection rules.");
requireText(durableRecords, "rejectsRandomRewardPressure: true", "Durable record plan must reject random reward pressure.");
requireText(routeVerifier, "Backend selection gate", "Active route verifier must keep backend selection gate visible on teacher intake.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS backend storage readiness covers ${requiredSchemaEntities.length} schema entity/entities, ${requiredMigrationCandidates.length} migration candidate(s), and ${requiredMigrationSpecs.length} migration spec(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
