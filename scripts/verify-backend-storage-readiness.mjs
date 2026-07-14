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
  "game_asset_manifest",
  "label_anchor_record",
  "activity_compatibility_snapshot",
  "template_rendering_profile",
  "font_accessibility_profile",
  "teacher_draft_review_decision",
  "teacher_draft_review_evidence",
  "teacher_draft_review_audit",
  "tenant_library_item",
  "package_game_audio_coverage",
  "route_alias",
  "media_manifest",
  "media_playlist_binding",
  "background_media_policy_binding",
  "local_media_bundle_entry",
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
  "pilot_evidence_packet",
  "teacher_dry_run_rehearsal",
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
  "m024-game-asset-manifests",
  "m025-label-anchor-records",
  "m031-activity-compatibility-snapshots",
  "m029-template-rendering-profiles",
  "m030-font-accessibility-profiles",
  "m017-teacher-draft-review-decision-records",
  "m018-teacher-draft-review-evidence-records",
  "m019-teacher-draft-review-audit-records",
  "m015-tenant-library-item-records",
  "m003-route-alias-registry",
  "m004-media-manifest-rights",
  "m026-media-playlist-bindings",
  "m027-background-media-policy-bindings",
  "m028-local-media-bundle-entries",
  "m005-publish-gate-and-approval-ledger",
  "m006-launch-session-settings",
  "m007-progress-event-stream",
  "m013-earned-collection-inventory",
  "m008-local-classroom-export-store",
  "m009-teacher-report-package-boundary",
  "m010-publisher-maintenance-change-requests",
  "m011-local-companion-handoff-records",
  "m012-local-companion-release-gate-records",
  "m032-pilot-evidence-packet-records",
  "m033-teacher-dry-run-rehearsal-records",
];

const requiredMigrationSpecs = [
  "spec-tenant-entitlement",
  "spec-package-release",
  "spec-package-game-audio-coverage",
  "spec-media-manifest",
  "spec-media-playlist-binding",
  "spec-background-media-policy-binding",
  "spec-local-media-bundle-entry",
  "spec-teacher-draft-package",
  "spec-teacher-draft-review-handoff",
  "spec-teacher-draft-verifier-submission",
  "spec-upload-intake-asset",
  "spec-upload-review-decision",
  "spec-upload-promotion-gate",
  "spec-game-asset-manifest",
  "spec-label-anchor-record",
  "spec-activity-compatibility-snapshot",
  "spec-template-rendering-profile",
  "spec-font-accessibility-profile",
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
  "spec-pilot-evidence-packet",
  "spec-teacher-dry-run-rehearsal",
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
requireText(schemaDraft, "game_asset_manifest", "Backend schema must include game asset manifests.");
requireText(schemaDraft, "alt_text", "Backend schema must require image asset alt text.");
requireText(schemaDraft, "student_facing_asset_allowed", "Backend schema must block student-facing image asset use.");
requireText(schemaDraft, "label_anchor_record", "Backend schema must include label anchor records.");
requireText(schemaDraft, "target_language_label", "Backend schema must preserve target-language label text.");
requireText(schemaDraft, "label_audio_cue_id", "Backend schema must require label audio cue ids.");
requireText(schemaDraft, "support_language_progress_allowed", "Backend schema must block support-language progress triggers.");
requireText(schemaDraft, "activity_compatibility_snapshot", "Backend schema must include activity compatibility snapshots.");
requireText(schemaDraft, "payload_shape", "Backend schema must preserve payload shape for compatibility.");
requireText(schemaDraft, "allowed_activity_modes", "Backend schema must preserve allowed activity modes.");
requireText(schemaDraft, "blocked_conversions", "Backend schema must preserve blocked activity conversions.");
requireText(schemaDraft, "target_language_trigger_policy", "Backend schema must preserve target-language trigger policy.");
requireText(schemaDraft, "printable_output_policy", "Backend schema must preserve printable output policy.");
requireText(schemaDraft, "student_facing_pathway_allowed", "Backend schema must block student-facing pathway changes.");
requireText(schemaDraft, "template_rendering_profile", "Backend schema must include template rendering profiles.");
requireText(schemaDraft, "source_template", "Backend schema must preserve template source identity.");
requireText(schemaDraft, "compatible_game_families", "Backend schema must preserve curated compatible game families.");
requireText(schemaDraft, "row_shape_policy", "Backend schema must preserve template row shape policies.");
requireText(schemaDraft, "layout_constraints", "Backend schema must preserve template layout constraints.");
requireText(schemaDraft, "student_facing_rendering_allowed", "Backend schema must block student-facing rendering profiles.");
requireText(schemaDraft, "font_accessibility_profile", "Backend schema must include font accessibility profiles.");
requireText(schemaDraft, "approved_learner_font", "Backend schema must preserve approved learner fonts.");
requireText(schemaDraft, "tenant_font_pack", "Backend schema must preserve tenant font packs.");
requireText(schemaDraft, "language_rendering_rules", "Backend schema must preserve multilingual rendering rules.");
requireText(schemaDraft, "readability_checks", "Backend schema must preserve font readability checks.");
requireText(schemaDraft, "student_facing_font_allowed", "Backend schema must block student-facing font profiles.");
requireText(schemaDraft, "Arbitrary teacher font upload", "Backend schema must block arbitrary teacher font upload.");
requireText(schemaDraft, "Broken hiragana/furigana rendering", "Backend schema must block unsafe hiragana/furigana rendering.");
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
requireText(schemaDraft, "media_manifest", "Backend schema must include media manifests.");
requireText(schemaDraft, "media_playlist_binding", "Backend schema must include media playlist bindings.");
requireText(schemaDraft, "media_only_progress_allowed", "Backend schema must block media-only progress.");
requireText(schemaDraft, "background_media_policy_binding", "Backend schema must include background media policy bindings.");
requireText(schemaDraft, "learning_audio_priority", "Backend schema must preserve learning-audio priority.");
requireText(schemaDraft, "local_media_bundle_entry", "Backend schema must include local media bundle entries.");
requireText(schemaDraft, "local_activation_allowed", "Backend schema must block local media activation.");
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
requireText(migrationSpecs, "spec-game-asset-manifest", "Migration specs must include game asset manifests.");
requireText(migrationSpecs, "alt_text", "Migration specs must require image asset alt text.");
requireText(migrationSpecs, "student_facing_asset_allowed", "Migration specs must preserve image asset student-facing blocks.");
requireText(migrationSpecs, "spec-label-anchor-record", "Migration specs must include label anchor records.");
requireText(migrationSpecs, "target_language_label", "Migration specs must preserve target-language labels.");
requireText(migrationSpecs, "label_audio_cue_id", "Migration specs must require label audio cue ids.");
requireText(migrationSpecs, "support_language_progress_allowed", "Migration specs must block support-language progress triggers.");
requireText(migrationSpecs, "spec-activity-compatibility-snapshot", "Migration specs must include activity compatibility snapshots.");
requireText(migrationSpecs, "compatibility_snapshot_id", "Migration specs must preserve compatibility snapshot ids.");
requireText(migrationSpecs, "allowed_activity_modes", "Migration specs must preserve allowed activity modes.");
requireText(migrationSpecs, "student_facing_pathway_allowed", "Migration specs must block student-facing pathway changes.");
requireText(migrationSpecs, "spec-template-rendering-profile", "Migration specs must include template rendering profiles.");
requireText(migrationSpecs, "template_profile_id", "Migration specs must preserve template rendering profile ids.");
requireText(migrationSpecs, "student_facing_rendering_allowed", "Migration specs must block student-facing rendering profiles.");
requireText(migrationSpecs, "spec-font-accessibility-profile", "Migration specs must include font accessibility profiles.");
requireText(migrationSpecs, "font_profile_id", "Migration specs must preserve font profile ids.");
requireText(migrationSpecs, "student_facing_font_allowed", "Migration specs must block student-facing font profiles.");
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
requireText(migrationSpecs, "spec-media-manifest", "Migration specs must include media manifests.");
requireText(migrationSpecs, "spec-media-playlist-binding", "Migration specs must include media playlist bindings.");
requireText(migrationSpecs, "media_only_progress_allowed", "Migration specs must block media-only progress.");
requireText(migrationSpecs, "spec-background-media-policy-binding", "Migration specs must include background media policy bindings.");
requireText(migrationSpecs, "learning_audio_priority", "Migration specs must preserve learning-audio priority.");
requireText(migrationSpecs, "spec-local-media-bundle-entry", "Migration specs must include local media bundle entries.");
requireText(migrationSpecs, "local_activation_allowed", "Migration specs must block local media activation.");
requireText(migrationSpecs, "event_acceptance_gate_id", "Migration specs must require event acceptance gate ids for events.");
requireText(migrationSpecs, "spec-earned-collection-inventory", "Migration specs must include earned collection inventory.");
requireText(migrationSpecs, "unlock_source_event_id", "Migration specs must preserve collection unlock source events.");
requireText(migrationSpecs, "support-only events", "Migration specs must preserve support-only event boundaries.");
requireText(schemaDraft, "pilot_evidence_packet", "Backend schema must include pilot evidence packet records.");
requireText(schemaDraft, "gate_evidence", "Backend schema must preserve gate evidence in pilot evidence packets.");
requireText(schemaDraft, "approval_evidence", "Backend schema must preserve approval evidence in pilot evidence packets.");
requireText(schemaDraft, "signed_approval_capture_allowed", "Backend schema must block signed approval capture.");
requireText(schemaDraft, "Chat-only approval proof", "Backend schema must block chat-only approval proof.");
requireText(schemaDraft, "teacher_dry_run_rehearsal", "Backend schema must include teacher dry-run rehearsal records.");
requireText(schemaDraft, "dry_run_id", "Backend schema must preserve dry-run ids.");
requireText(schemaDraft, "route_rehearsal_results", "Backend schema must preserve route rehearsal checks.");
requireText(schemaDraft, "game_audio_rehearsal_results", "Backend schema must preserve game/audio rehearsal checks.");
requireText(schemaDraft, "media_support_language_results", "Backend schema must preserve media/support-language rehearsal checks.");
requireText(schemaDraft, "report_policy_rehearsal_results", "Backend schema must preserve report/policy rehearsal checks.");
requireText(schemaDraft, "student_launch_allowed", "Backend schema must block student launch from dry-run records.");
requireText(schemaDraft, "real_learner_data_allowed", "Backend schema must block real learner data from dry-run records.");
requireText(schemaDraft, "report_export_allowed", "Backend schema must block report export from dry-run records.");
requireText(schemaDraft, "Real learner name", "Backend schema must forbid real learner names in dry-run records.");
requireText(migrationSpecs, "spec-pilot-evidence-packet", "Migration specs must include pilot evidence packets.");
requireText(migrationSpecs, "evidence_packet_id", "Migration specs must preserve pilot evidence packet ids.");
requireText(migrationSpecs, "upload_allowed", "Migration specs must preserve evidence upload blocks.");
requireText(migrationSpecs, "signed_approval_capture_allowed", "Migration specs must preserve signed approval capture blocks.");
requireText(migrationSpecs, "spec-teacher-dry-run-rehearsal", "Migration specs must include teacher dry-run rehearsals.");
requireText(migrationSpecs, "route_rehearsal_results", "Migration specs must preserve route rehearsal checks.");
requireText(migrationSpecs, "student_launch_allowed", "Migration specs must block student launch from dry-run records.");
requireText(migrationSpecs, "real_learner_data_allowed", "Migration specs must block real learner data from dry-run records.");
requireText(migrationSpecs, "report_export_allowed", "Migration specs must block report export from dry-run records.");
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
requireText(persistenceAdapter, "hosted-game-asset-manifest-write", "Persistence adapter must include hosted game asset manifest writes.");
requireText(persistenceAdapter, "local-game-asset-manifest-write", "Persistence adapter must include local game asset manifest writes.");
requireText(persistenceAdapter, "preservesGameAssetManifest: true", "Persistence adapter must preserve game asset manifests.");
requireText(persistenceAdapter, "blocksStudentFacingGameAssetUse: true", "Persistence adapter must block student-facing game asset use.");
requireText(persistenceAdapter, "hosted-label-anchor-write", "Persistence adapter must include hosted label anchor writes.");
requireText(persistenceAdapter, "local-label-anchor-write", "Persistence adapter must include local label anchor writes.");
requireText(persistenceAdapter, "preservesLabelAnchorRecords: true", "Persistence adapter must preserve label anchor records.");
requireText(persistenceAdapter, "requiresLabelAudioCoverage: true", "Persistence adapter must require label audio coverage.");
requireText(persistenceAdapter, "blocksSupportLanguageProgress: true", "Persistence adapter must block support-language progress triggers.");
requireText(persistenceAdapter, "hosted-activity-compatibility-snapshot-write", "Persistence adapter must include hosted activity compatibility snapshot writes.");
requireText(persistenceAdapter, "local-activity-compatibility-snapshot-write", "Persistence adapter must include local activity compatibility snapshot writes.");
requireText(persistenceAdapter, "preservesActivityCompatibilitySnapshot: true", "Persistence adapter must preserve activity compatibility snapshots.");
requireText(persistenceAdapter, "blocksUncheckedActivityConversion: true", "Persistence adapter must block unchecked activity conversions.");
requireText(persistenceAdapter, "hosted-template-rendering-profile-write", "Persistence adapter must include hosted template rendering profile writes.");
requireText(persistenceAdapter, "local-template-rendering-profile-write", "Persistence adapter must include local template rendering profile writes.");
requireText(persistenceAdapter, "preservesTemplateRenderingProfile: true", "Persistence adapter must preserve template rendering profiles.");
requireText(persistenceAdapter, "blocksUnsafeTemplateRendering: true", "Persistence adapter must block unsafe template rendering.");
requireText(persistenceAdapter, "hosted-font-accessibility-profile-write", "Persistence adapter must include hosted font accessibility profile writes.");
requireText(persistenceAdapter, "local-font-accessibility-profile-write", "Persistence adapter must include local font accessibility profile writes.");
requireText(persistenceAdapter, "preservesFontAccessibilityProfile: true", "Persistence adapter must preserve font accessibility profiles.");
requireText(persistenceAdapter, "blocksUnapprovedFontUse: true", "Persistence adapter must block unapproved font use.");
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
requireText(persistenceAdapter, "hosted-pilot-evidence-packet-write", "Persistence adapter must include hosted pilot evidence packet writes.");
requireText(persistenceAdapter, "local-pilot-evidence-packet-write", "Persistence adapter must include local pilot evidence packet writes.");
requireText(persistenceAdapter, "preservesPilotEvidencePacket: true", "Persistence adapter must preserve pilot evidence packet metadata.");
requireText(persistenceAdapter, "blocksSignedApprovalCapture: true", "Persistence adapter must block signed approval capture.");
requireText(persistenceAdapter, "hosted-teacher-dry-run-rehearsal-write", "Persistence adapter must include hosted teacher dry-run rehearsal writes.");
requireText(persistenceAdapter, "local-teacher-dry-run-rehearsal-write", "Persistence adapter must include local teacher dry-run rehearsal writes.");
requireText(persistenceAdapter, "preservesTeacherDryRunRehearsal: true", "Persistence adapter must preserve teacher dry-run rehearsal checks.");
requireText(persistenceAdapter, "blocksStudentLaunchAction: true", "Persistence adapter must block student launch from dry-run records.");
requireText(persistenceAdapter, "blocksRealLearnerDataCollection: true", "Persistence adapter must block real learner data collection from dry-run records.");
requireText(persistenceAdapter, "blocksLiveReportExport: true", "Persistence adapter must block live report export from dry-run records.");
requireText(persistenceAdapter, "hosted-media-playlist-binding-write", "Persistence adapter must include hosted media playlist binding writes.");
requireText(persistenceAdapter, "local-media-playlist-binding-write", "Persistence adapter must include local media playlist binding writes.");
requireText(persistenceAdapter, "preservesMediaPlaylistBinding: true", "Persistence adapter must preserve media playlist bindings.");
requireText(persistenceAdapter, "blocksMediaOnlyProgress: true", "Persistence adapter must block media-only progress.");
requireText(persistenceAdapter, "hosted-background-media-policy-binding-write", "Persistence adapter must include hosted background media policy binding writes.");
requireText(persistenceAdapter, "local-background-media-policy-binding-write", "Persistence adapter must include local background media policy binding writes.");
requireText(persistenceAdapter, "preservesBackgroundMediaPolicy: true", "Persistence adapter must preserve background media policy.");
requireText(persistenceAdapter, "requiresLearningAudioPriority: true", "Persistence adapter must require learning-audio priority.");
requireText(persistenceAdapter, "hosted-local-media-bundle-entry-write", "Persistence adapter must include hosted local media bundle entry writes.");
requireText(persistenceAdapter, "local-media-bundle-entry-write", "Persistence adapter must include local media bundle entry writes.");
requireText(persistenceAdapter, "preservesLocalMediaBundleEntry: true", "Persistence adapter must preserve local media bundle entries.");
requireText(persistenceAdapter, "blocksLocalFolderActivation: true", "Persistence adapter must block local folder activation.");
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
requireText(durableRecords, "game-asset-manifest-record", "Durable record plan must include game asset manifest records.");
requireText(durableRecords, "preservesGameAssetManifest: true", "Durable record plan must preserve game asset manifests.");
requireText(durableRecords, "blocksStudentFacingGameAssetUse: true", "Durable record plan must block student-facing game asset use.");
requireText(durableRecords, "label-anchor-record", "Durable record plan must include label anchor records.");
requireText(durableRecords, "preservesLabelAnchorRecords: true", "Durable record plan must preserve label anchor records.");
requireText(durableRecords, "requiresLabelAudioCoverage: true", "Durable record plan must require label audio coverage.");
requireText(durableRecords, "blocksSupportLanguageProgress: true", "Durable record plan must block support-language progress triggers.");
requireText(durableRecords, "activity-compatibility-snapshot-record", "Durable record plan must include activity compatibility snapshots.");
requireText(durableRecords, "preservesActivityCompatibilitySnapshot: true", "Durable record plan must preserve activity compatibility snapshots.");
requireText(durableRecords, "blocksUncheckedActivityConversion: true", "Durable record plan must block unchecked activity conversions.");
requireText(durableRecords, "template-rendering-profile-record", "Durable record plan must include template rendering profiles.");
requireText(durableRecords, "preservesTemplateRenderingProfile: true", "Durable record plan must preserve template rendering profiles.");
requireText(durableRecords, "blocksUnsafeTemplateRendering: true", "Durable record plan must block unsafe template rendering.");
requireText(durableRecords, "font-accessibility-profile-record", "Durable record plan must include font accessibility profiles.");
requireText(durableRecords, "preservesFontAccessibilityProfile: true", "Durable record plan must preserve font accessibility profiles.");
requireText(durableRecords, "blocksUnapprovedFontUse: true", "Durable record plan must block unapproved font use.");
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
requireText(durableRecords, "pilot-evidence-packet-record", "Durable record plan must include pilot evidence packet records.");
requireText(durableRecords, "preservesPilotEvidencePacket: true", "Durable record plan must preserve pilot evidence packets.");
requireText(durableRecords, "blocksSignedApprovalCapture: true", "Durable record plan must block signed approval capture.");
requireText(durableRecords, "teacher-dry-run-rehearsal-record", "Durable record plan must include teacher dry-run rehearsal records.");
requireText(durableRecords, "preservesTeacherDryRunRehearsal: true", "Durable record plan must preserve teacher dry-run rehearsal checks.");
requireText(durableRecords, "blocksStudentLaunchAction: true", "Durable record plan must block student launch from dry-run records.");
requireText(durableRecords, "blocksRealLearnerDataCollection: true", "Durable record plan must block real learner data collection from dry-run records.");
requireText(durableRecords, "blocksLiveReportExport: true", "Durable record plan must block live report export from dry-run records.");
requireText(durableRecords, "media-playlist-binding-record", "Durable record plan must include media playlist binding records.");
requireText(durableRecords, "preservesMediaPlaylistBinding: true", "Durable record plan must preserve media playlist bindings.");
requireText(durableRecords, "blocksMediaOnlyProgress: true", "Durable record plan must block media-only progress.");
requireText(durableRecords, "background-media-policy-binding-record", "Durable record plan must include background media policy binding records.");
requireText(durableRecords, "preservesBackgroundMediaPolicy: true", "Durable record plan must preserve background media policy.");
requireText(durableRecords, "requiresLearningAudioPriority: true", "Durable record plan must require learning-audio priority.");
requireText(durableRecords, "local-media-bundle-entry-record", "Durable record plan must include local media bundle entry records.");
requireText(durableRecords, "preservesLocalMediaBundleEntry: true", "Durable record plan must preserve local media bundle entries.");
requireText(durableRecords, "blocksLocalFolderActivation: true", "Durable record plan must block local folder activation.");
requireText(durableRecords, "requiresEventAcceptanceGate: true", "Durable record plan must require event acceptance gates for student event storage.");
requireText(durableRecords, "earned-collection-inventory-record", "Durable record plan must include earned collection inventory.");
requireText(durableRecords, "preservesEarnedCollectionRules: true", "Durable record plan must preserve earned collection rules.");
requireText(durableRecords, "rejectsRandomRewardPressure: true", "Durable record plan must reject random reward pressure.");
requireText(routeVerifier, "Backend selection gate", "Active route verifier must keep backend selection gate visible on teacher intake.");
requireText(routeVerifier, "pilot_evidence_packet", "Active route verifier must keep pilot evidence packet storage visible on teacher intake.");
requireText(routeVerifier, "teacher_dry_run_rehearsal", "Active route verifier must keep teacher dry-run rehearsal storage visible on teacher intake.");

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
