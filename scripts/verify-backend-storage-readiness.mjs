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
  "teacher_draft_review_handoff",
  "teacher_draft_verifier_submission",
  "upload_intake_asset",
  "upload_review_decision",
  "upload_promotion_gate",
  "teacher_draft_review_decision",
  "teacher_draft_review_evidence",
  "teacher_draft_review_audit",
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
  "m016-teacher-draft-review-handoff-records",
  "m020-teacher-draft-verifier-submission-records",
  "m021-upload-intake-records",
  "m022-upload-review-records",
  "m023-upload-promotion-gates",
  "m017-teacher-draft-review-decision-records",
  "m018-teacher-draft-review-evidence-records",
  "m019-teacher-draft-review-audit-records",
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
  "spec-teacher-draft-review-handoff",
  "spec-teacher-draft-verifier-submission",
  "spec-upload-intake-asset",
  "spec-upload-review-decision",
  "spec-upload-promotion-gate",
  "spec-teacher-draft-review-decision",
  "spec-teacher-draft-review-evidence",
  "spec-teacher-draft-review-audit",
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
requireText(schemaDraft, "teacher_draft_review_handoff", "Backend schema must include teacher draft review handoff packets.");
requireText(schemaDraft, "schema_validation_packet", "Backend schema must preserve review handoff schema packets.");
requireText(schemaDraft, "audio_coverage_packet", "Backend schema must preserve review handoff audio packets.");
requireText(schemaDraft, "live_review_submission_allowed", "Backend schema must preserve review handoff submission blocks.");
requireText(schemaDraft, "teacher_draft_verifier_submission", "Backend schema must include teacher draft verifier submission preflights.");
requireText(schemaDraft, "schema_preflight", "Backend schema must preserve verifier schema preflight checks.");
requireText(schemaDraft, "automatic_submit_allowed", "Backend schema must preserve automatic verifier submission blocks.");
requireText(schemaDraft, "upload_intake_asset", "Backend schema must include upload intake assets.");
requireText(schemaDraft, "source_lineage", "Backend schema must preserve upload source lineage.");
requireText(schemaDraft, "student_facing_use_allowed", "Backend schema must block student-facing upload use.");
requireText(schemaDraft, "upload_review_decision", "Backend schema must include upload review decisions.");
requireText(schemaDraft, "source_lineage_packet", "Backend schema must preserve upload review source lineage packets.");
requireText(schemaDraft, "rights_proof_packet", "Backend schema must preserve upload review rights proof packets.");
requireText(schemaDraft, "promotion_allowed", "Backend schema must block upload review promotion.");
requireText(schemaDraft, "upload_promotion_gate", "Backend schema must include upload promotion gates.");
requireText(schemaDraft, "target_kind", "Backend schema must preserve upload promotion target kinds.");
requireText(schemaDraft, "student_facing_promotion_allowed", "Backend schema must block student-facing upload promotion.");
requireText(schemaDraft, "teacher_draft_review_decision", "Backend schema must include teacher draft reviewer decisions.");
requireText(schemaDraft, "evidence_required", "Backend schema must preserve reviewer decision evidence requirements.");
requireText(schemaDraft, "state_change_allowed", "Backend schema must preserve reviewer decision state-change blocks.");
requireText(schemaDraft, "teacher_draft_review_evidence", "Backend schema must include teacher draft review evidence packets.");
requireText(schemaDraft, "evidence_packet_id", "Backend schema must preserve review evidence packet ids.");
requireText(schemaDraft, "upload_allowed", "Backend schema must preserve evidence upload blocks.");
requireText(schemaDraft, "teacher_draft_review_audit", "Backend schema must include teacher draft review audit trails.");
requireText(schemaDraft, "audit_event_id", "Backend schema must preserve review audit event ids.");
requireText(schemaDraft, "state_change_allowed", "Backend schema must preserve review audit state-change blocks.");
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
requireText(migrationSpecs, "spec-teacher-draft-review-handoff", "Migration specs must include teacher draft review handoff packets.");
requireText(migrationSpecs, "route_activity_packet", "Migration specs must preserve review handoff route/activity packets.");
requireText(migrationSpecs, "live_review_submission_allowed", "Migration specs must preserve review handoff submission blocks.");
requireText(migrationSpecs, "spec-teacher-draft-verifier-submission", "Migration specs must include teacher draft verifier submission preflights.");
requireText(migrationSpecs, "language_preflight", "Migration specs must preserve verifier support-language boundary checks.");
requireText(migrationSpecs, "automatic_submit_allowed", "Migration specs must preserve automatic verifier submission blocks.");
requireText(migrationSpecs, "spec-upload-intake-asset", "Migration specs must include upload intake assets.");
requireText(migrationSpecs, "file_metadata", "Migration specs must preserve upload file metadata.");
requireText(migrationSpecs, "target_mapping", "Migration specs must preserve upload target mapping.");
requireText(migrationSpecs, "spec-upload-review-decision", "Migration specs must include upload review decisions.");
requireText(migrationSpecs, "rights_proof_packet", "Migration specs must preserve upload review rights proof packets.");
requireText(migrationSpecs, "promotion_allowed", "Migration specs must preserve upload review promotion blocks.");
requireText(migrationSpecs, "spec-upload-promotion-gate", "Migration specs must include upload promotion gates.");
requireText(migrationSpecs, "target_kind", "Migration specs must preserve upload promotion target kinds.");
requireText(migrationSpecs, "student_facing_promotion_allowed", "Migration specs must preserve upload promotion blocks.");
requireText(migrationSpecs, "spec-teacher-draft-review-decision", "Migration specs must include teacher draft reviewer decisions.");
requireText(migrationSpecs, "reviewer_id", "Migration specs must preserve reviewer identity.");
requireText(migrationSpecs, "state_change_allowed", "Migration specs must preserve reviewer decision state-change blocks.");
requireText(migrationSpecs, "spec-teacher-draft-review-evidence", "Migration specs must include teacher draft review evidence packets.");
requireText(migrationSpecs, "evidence_uri", "Migration specs must preserve evidence storage references.");
requireText(migrationSpecs, "upload_allowed", "Migration specs must preserve evidence upload blocks.");
requireText(migrationSpecs, "spec-teacher-draft-review-audit", "Migration specs must include teacher draft review audit trails.");
requireText(migrationSpecs, "audit_event_id", "Migration specs must preserve review audit event ids.");
requireText(migrationSpecs, "event_label", "Migration specs must preserve review audit event labels.");
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
requireText(persistenceAdapter, "hosted-teacher-draft-review-handoff-write", "Persistence adapter must include hosted teacher draft review handoff writes.");
requireText(persistenceAdapter, "local-teacher-draft-review-handoff-write", "Persistence adapter must include local teacher draft review handoff writes.");
requireText(persistenceAdapter, "preservesReviewPacketSections: true", "Persistence adapter must preserve teacher draft review packet sections.");
requireText(persistenceAdapter, "blocksLiveReviewSubmission: true", "Persistence adapter must block live review submission.");
requireText(persistenceAdapter, "hosted-teacher-draft-verifier-submission-write", "Persistence adapter must include hosted teacher draft verifier submission writes.");
requireText(persistenceAdapter, "local-teacher-draft-verifier-submission-write", "Persistence adapter must include local teacher draft verifier submission writes.");
requireText(persistenceAdapter, "preservesVerifierPreflightChecks: true", "Persistence adapter must preserve verifier preflight checks.");
requireText(persistenceAdapter, "blocksAutomaticVerifierSubmit: true", "Persistence adapter must block automatic verifier submission.");
requireText(persistenceAdapter, "hosted-upload-intake-write", "Persistence adapter must include hosted upload intake writes.");
requireText(persistenceAdapter, "local-upload-intake-write", "Persistence adapter must include local upload intake writes.");
requireText(persistenceAdapter, "preservesUploadSourceLineage: true", "Persistence adapter must preserve upload source lineage.");
requireText(persistenceAdapter, "blocksStudentFacingUploadUse: true", "Persistence adapter must block student-facing upload use.");
requireText(persistenceAdapter, "hosted-upload-review-write", "Persistence adapter must include hosted upload review writes.");
requireText(persistenceAdapter, "local-upload-review-write", "Persistence adapter must include local upload review writes.");
requireText(persistenceAdapter, "preservesUploadReviewPackets: true", "Persistence adapter must preserve upload review packets.");
requireText(persistenceAdapter, "blocksUploadReviewPromotion: true", "Persistence adapter must block upload review promotion.");
requireText(persistenceAdapter, "hosted-upload-promotion-write", "Persistence adapter must include hosted upload promotion writes.");
requireText(persistenceAdapter, "local-upload-promotion-write", "Persistence adapter must include local upload promotion writes.");
requireText(persistenceAdapter, "preservesUploadPromotionTargets: true", "Persistence adapter must preserve upload promotion targets.");
requireText(persistenceAdapter, "blocksStudentFacingPromotion: true", "Persistence adapter must block student-facing promotion.");
requireText(persistenceAdapter, "hosted-teacher-draft-review-decision-write", "Persistence adapter must include hosted teacher draft reviewer decision writes.");
requireText(persistenceAdapter, "local-teacher-draft-review-decision-write", "Persistence adapter must include local teacher draft reviewer decision writes.");
requireText(persistenceAdapter, "preservesReviewerEvidenceRequirements: true", "Persistence adapter must preserve reviewer evidence requirements.");
requireText(persistenceAdapter, "blocksReviewerStateChange: true", "Persistence adapter must block reviewer state changes.");
requireText(persistenceAdapter, "hosted-teacher-draft-review-evidence-write", "Persistence adapter must include hosted teacher draft review evidence writes.");
requireText(persistenceAdapter, "local-teacher-draft-review-evidence-write", "Persistence adapter must include local teacher draft review evidence writes.");
requireText(persistenceAdapter, "preservesReviewEvidencePacket: true", "Persistence adapter must preserve review evidence packets.");
requireText(persistenceAdapter, "blocksEvidenceUpload: true", "Persistence adapter must block evidence uploads.");
requireText(persistenceAdapter, "hosted-teacher-draft-review-audit-write", "Persistence adapter must include hosted teacher draft review audit writes.");
requireText(persistenceAdapter, "local-teacher-draft-review-audit-write", "Persistence adapter must include local teacher draft review audit writes.");
requireText(persistenceAdapter, "preservesReviewAuditTrail: true", "Persistence adapter must preserve review audit trails.");
requireText(persistenceAdapter, "blocksReviewAuditStateChange: true", "Persistence adapter must block review audit state changes.");
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
requireText(durableRecords, "teacher-draft-review-handoff-record", "Durable record plan must include teacher draft review handoff packets.");
requireText(durableRecords, "preservesReviewPacketSections: true", "Durable record plan must preserve review handoff packet sections.");
requireText(durableRecords, "blocksLiveReviewSubmission: true", "Durable record plan must block live review submission.");
requireText(durableRecords, "teacher-draft-verifier-submission-record", "Durable record plan must include teacher draft verifier submission preflights.");
requireText(durableRecords, "preservesVerifierPreflightChecks: true", "Durable record plan must preserve verifier preflight checks.");
requireText(durableRecords, "blocksAutomaticVerifierSubmit: true", "Durable record plan must block automatic verifier submission.");
requireText(durableRecords, "upload-intake-record", "Durable record plan must include upload intake records.");
requireText(durableRecords, "preservesUploadSourceLineage: true", "Durable record plan must preserve upload source lineage.");
requireText(durableRecords, "blocksStudentFacingUploadUse: true", "Durable record plan must block student-facing upload use.");
requireText(durableRecords, "upload-review-record", "Durable record plan must include upload review records.");
requireText(durableRecords, "preservesUploadReviewPackets: true", "Durable record plan must preserve upload review packets.");
requireText(durableRecords, "blocksUploadReviewPromotion: true", "Durable record plan must block upload review promotion.");
requireText(durableRecords, "upload-promotion-record", "Durable record plan must include upload promotion records.");
requireText(durableRecords, "preservesUploadPromotionTargets: true", "Durable record plan must preserve upload promotion targets.");
requireText(durableRecords, "blocksStudentFacingPromotion: true", "Durable record plan must block student-facing promotion.");
requireText(durableRecords, "teacher-draft-review-decision-record", "Durable record plan must include teacher draft reviewer decisions.");
requireText(durableRecords, "preservesReviewerEvidenceRequirements: true", "Durable record plan must preserve reviewer evidence requirements.");
requireText(durableRecords, "blocksReviewerStateChange: true", "Durable record plan must block reviewer state changes.");
requireText(durableRecords, "teacher-draft-review-evidence-record", "Durable record plan must include teacher draft review evidence packets.");
requireText(durableRecords, "preservesReviewEvidencePacket: true", "Durable record plan must preserve review evidence packets.");
requireText(durableRecords, "blocksEvidenceUpload: true", "Durable record plan must block evidence uploads.");
requireText(durableRecords, "teacher-draft-review-audit-record", "Durable record plan must include teacher draft review audit trails.");
requireText(durableRecords, "preservesReviewAuditTrail: true", "Durable record plan must preserve review audit trails.");
requireText(durableRecords, "blocksReviewAuditStateChange: true", "Durable record plan must block review audit state changes.");
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
