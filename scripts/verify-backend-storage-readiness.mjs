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
  "ai_generated_package_manifest",
  "ai_reward_readiness_gate",
  "teacher_assignment_rollout_gate",
  "private_assignment_link",
  "class_roster_plan",
  "source_extraction_review_packet",
  "upload_file_policy_profile",
  "upload_intake_asset",
  "upload_review_decision",
  "upload_promotion_gate",
  "evidence_packet",
  "evidence_attachment",
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
  "reviewer_identity_signature_gate",
  "teacher_dry_run_rehearsal",
  "classroom_launch_gate",
  "school_launch_policy_gate",
  "school_policy_handoff_packet",
  "school_policy_acceptance_preflight",
  "school_policy_text_pack",
  "school_policy_acceptance_record_preview",
  "school_policy_revocation_rollback_preview",
  "school_policy_rollback_impact_matrix",
  "school_rollback_safe_fallback_plan",
  "school_rollback_safe_fallback_preflight",
  "school_rollback_safe_fallback_activation_preview",
  "school_rollback_safe_fallback_restoration_preview",
];

const requiredMigrationCandidates = [
  "m001-tenant-and-entitlements",
  "m002-package-release-and-content",
  "m014-teacher-draft-package-records",
  "m016-teacher-draft-review-handoff-records",
  "m020-teacher-draft-verifier-submission-records",
  "m054-ai-generated-package-manifest-records",
  "m055-ai-reward-readiness-gate-records",
  "m049-teacher-assignment-rollout-gate-records",
  "m050-private-assignment-link-records",
  "m051-class-roster-plan-records",
  "m053-source-extraction-review-packet-records",
  "m052-upload-file-policy-profile-records",
  "m021-upload-intake-records",
  "m022-upload-review-records",
  "m023-upload-promotion-gates",
  "m035-evidence-packet-records",
  "m036-evidence-attachment-records",
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
  "m037-reviewer-identity-signature-gates",
  "m033-teacher-dry-run-rehearsal-records",
  "m034-classroom-launch-gate-records",
  "m038-school-launch-policy-gate-records",
  "m039-school-policy-handoff-packet-records",
  "m040-school-policy-acceptance-preflight-records",
  "m041-school-policy-text-pack-records",
  "m042-school-policy-acceptance-record-preview-records",
  "m043-school-policy-revocation-rollback-preview-records",
  "m044-school-policy-rollback-impact-matrix-records",
  "m045-school-rollback-safe-fallback-plan-records",
  "m046-school-rollback-safe-fallback-preflight-records",
  "m047-school-rollback-safe-fallback-activation-preview-records",
  "m048-school-rollback-safe-fallback-restoration-preview-records",
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
  "spec-ai-generated-package-manifest",
  "spec-ai-reward-readiness-gate",
  "spec-teacher-assignment-rollout-gate",
  "spec-private-assignment-link",
  "spec-class-roster-plan",
  "spec-source-extraction-review-packet",
  "spec-upload-file-policy-profile",
  "spec-upload-intake-asset",
  "spec-upload-review-decision",
  "spec-upload-promotion-gate",
  "spec-evidence-packet",
  "spec-evidence-attachment",
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
  "spec-reviewer-identity-signature-gate",
  "spec-teacher-dry-run-rehearsal",
  "spec-classroom-launch-gate",
  "spec-school-launch-policy-gate",
  "spec-school-policy-handoff-packet",
  "spec-school-policy-acceptance-preflight",
  "spec-school-policy-text-pack",
  "spec-school-policy-acceptance-record-preview",
  "spec-school-policy-revocation-rollback-preview",
  "spec-school-policy-rollback-impact-matrix",
  "spec-school-rollback-safe-fallback-plan",
  "spec-school-rollback-safe-fallback-preflight",
  "spec-school-rollback-safe-fallback-activation-preview",
  "spec-school-rollback-safe-fallback-restoration-preview",
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
requireText(schemaDraft, "ai_generated_package_manifest", "Backend schema must include AI generated package manifests.");
requireText(schemaDraft, "ai_generated_package_manifest_id", "Backend schema must preserve generated package manifest ids.");
requireText(schemaDraft, "generation_request_id", "Backend schema must preserve AI generation request ids.");
requireText(schemaDraft, "prompt_package_id", "Backend schema must preserve generated package prompt package ids.");
requireText(schemaDraft, "draft_preview_id", "Backend schema must preserve generated package draft preview ids.");
requireText(schemaDraft, "audio_coverage_plan_id", "Backend schema must preserve generated package audio coverage plan ids.");
requireText(schemaDraft, "engine_binding_plan_id", "Backend schema must preserve generated package engine binding plan ids.");
requireText(schemaDraft, "gamification_mapping_id", "Backend schema must preserve generated package gamification mapping ids.");
requireText(schemaDraft, "verifier_submission_packet_id", "Backend schema must preserve generated package verifier packet ids.");
requireText(schemaDraft, "review_queue_item_id", "Backend schema must preserve generated package review queue item ids.");
requireText(schemaDraft, "media_rights_packet_id", "Backend schema must preserve generated package media-rights packet ids.");
requireText(schemaDraft, "release_locks", "Backend schema must preserve generated package release locks.");
requireText(schemaDraft, "package_assembly_allowed", "Backend schema must block generated package assembly.");
requireText(schemaDraft, "route_registry_write_allowed", "Backend schema must block generated package route registry writes.");
requireText(schemaDraft, "media_playlist_write_allowed", "Backend schema must block generated package media playlist writes.");
requireText(schemaDraft, "assignment_write_allowed", "Backend schema must block generated package assignments.");
requireText(schemaDraft, "local_bundle_write_allowed", "Backend schema must block generated package local bundle writes.");
requireText(schemaDraft, "student_ready_marker_allowed", "Backend schema must block generated package student-ready markers.");
requireText(schemaDraft, "ai_reward_readiness_gate", "Backend schema must include AI reward readiness gates.");
requireText(schemaDraft, "ai_reward_readiness_gate_id", "Backend schema must preserve AI reward readiness gate ids.");
requireText(schemaDraft, "ai_draft_correction_queue_id", "Backend schema must preserve AI draft correction queue ids.");
requireText(schemaDraft, "star_dust_cap_check", "Backend schema must preserve AI reward Star Dust cap checks.");
requireText(schemaDraft, "mastery_threshold_check", "Backend schema must preserve AI reward mastery threshold checks.");
requireText(schemaDraft, "deterministic_unlock_check", "Backend schema must preserve deterministic unlock checks.");
requireText(schemaDraft, "accepted_event_source_check", "Backend schema must preserve accepted event source checks.");
requireText(schemaDraft, "reward_publishing_allowed", "Backend schema must block reward publishing.");
requireText(schemaDraft, "collection_inventory_write_allowed", "Backend schema must block collection inventory writes.");
requireText(schemaDraft, "spin_wheel_ticket_issuance_allowed", "Backend schema must block Spin Wheel ticket issuance.");
requireText(schemaDraft, "avatar_evolution_write_allowed", "Backend schema must block avatar evolution writes.");
requireText(schemaDraft, "teacher_assignment_rollout_gate", "Backend schema must include teacher assignment rollout gate records.");
requireText(schemaDraft, "rollout_gate_id", "Backend schema must preserve teacher assignment rollout gate ids.");
requireText(schemaDraft, "rollout_status", "Backend schema must preserve teacher assignment rollout status.");
requireText(schemaDraft, "gate_evidence", "Backend schema must preserve teacher assignment rollout gate evidence.");
requireText(schemaDraft, "scheduling_allowed", "Backend schema must block teacher assignment scheduling.");
requireText(schemaDraft, "student_launch_allowed", "Backend schema must block student launch from assignment rollout gates.");
requireText(schemaDraft, "real_learner_data_collection_allowed", "Backend schema must block real learner data collection from assignment rollout gates.");
requireText(schemaDraft, "private_assignment_link", "Backend schema must include private assignment link records.");
requireText(schemaDraft, "private_assignment_link_id", "Backend schema must preserve private assignment link ids.");
requireText(schemaDraft, "assignment_path", "Backend schema must preserve private assignment paths.");
requireText(schemaDraft, "student_target_path", "Backend schema must preserve private assignment student target paths.");
requireText(schemaDraft, "public_sharing_allowed", "Backend schema must block public sharing for private assignment links.");
requireText(schemaDraft, "iframe_embed_allowed", "Backend schema must block iframe embeds for private assignment links.");
requireText(schemaDraft, "teacher_admin_controls_exposed", "Backend schema must block teacher/admin controls on private assignment links.");
requireText(schemaDraft, "class_roster_plan", "Backend schema must include class roster plan records.");
requireText(schemaDraft, "class_roster_plan_id", "Backend schema must preserve class roster plan ids.");
requireText(schemaDraft, "learner_code_slots", "Backend schema must preserve coded learner slots.");
requireText(schemaDraft, "data_boundaries", "Backend schema must preserve class roster data boundaries.");
requireText(schemaDraft, "real_learner_name_storage_allowed", "Backend schema must block real learner name storage.");
requireText(schemaDraft, "family_contact_storage_allowed", "Backend schema must block family contact storage.");
requireText(schemaDraft, "raw_audio_storage_allowed", "Backend schema must block raw audio storage for class rosters.");
requireText(schemaDraft, "transcript_storage_allowed", "Backend schema must block transcript storage for class rosters.");
requireText(schemaDraft, "source_extraction_review_packet", "Backend schema must include source extraction review packets.");
requireText(schemaDraft, "source_extraction_review_packet_id", "Backend schema must preserve source extraction review packet ids.");
requireText(schemaDraft, "extraction_method", "Backend schema must preserve extraction methods.");
requireText(schemaDraft, "ocr_confidence_summary", "Backend schema must preserve OCR confidence summaries.");
requireText(schemaDraft, "segmentation_review_packet", "Backend schema must preserve segmentation review packets.");
requireText(schemaDraft, "candidate_payload_summary", "Backend schema must preserve candidate payload summaries.");
requireText(schemaDraft, "teacher_draft_creation_allowed", "Backend schema must block teacher draft creation from extraction packets.");
requireText(schemaDraft, "student_facing_payload_allowed", "Backend schema must block student-facing extraction payloads.");
requireText(schemaDraft, "upload_file_policy_profile", "Backend schema must include upload file policy profiles.");
requireText(schemaDraft, "upload_file_policy_profile_id", "Backend schema must preserve upload file policy profile ids.");
requireText(schemaDraft, "accepted_extensions", "Backend schema must preserve accepted upload extensions.");
requireText(schemaDraft, "accepted_mime_types", "Backend schema must preserve accepted MIME types.");
requireText(schemaDraft, "maximum_size_mb", "Backend schema must preserve upload size maximums.");
requireText(schemaDraft, "required_checks", "Backend schema must preserve required upload checks.");
requireText(schemaDraft, "scan_and_file_policy_packet", "Backend schema must preserve scan and file policy packets.");
requireText(schemaDraft, "blocked_shortcuts", "Backend schema must preserve blocked upload shortcuts.");
requireText(schemaDraft, "student_facing_upload_allowed", "Backend schema must block student-facing uploads.");
requireText(schemaDraft, "upload_intake_asset", "Backend schema must include upload intake assets.");
requireText(schemaDraft, "source_lineage", "Backend schema must preserve upload source lineage.");
requireText(schemaDraft, "student_facing_use_allowed", "Backend schema must block student-facing upload use.");
requireText(schemaDraft, "upload_review_decision", "Backend schema must include upload review decisions.");
requireText(schemaDraft, "source_lineage_packet", "Backend schema must preserve upload review source lineage packets.");
requireText(schemaDraft, "rights_proof_packet", "Backend schema must preserve upload review rights proof packets.");
requireText(schemaDraft, "target_mapping_packet", "Backend schema must preserve upload target mapping packets.");
requireText(schemaDraft, "promotion_allowed", "Backend schema must block upload review promotion.");
requireText(schemaDraft, "upload_promotion_gate", "Backend schema must include upload promotion gates.");
requireText(schemaDraft, "target_kind", "Backend schema must preserve upload promotion target kinds.");
requireText(schemaDraft, "student_facing_promotion_allowed", "Backend schema must block student-facing upload promotion.");
requireText(schemaDraft, "evidence_packet", "Backend schema must include generic evidence packet records.");
requireText(schemaDraft, "evidence_packet_id", "Backend schema must preserve evidence packet ids.");
requireText(schemaDraft, "packet_key", "Backend schema must preserve evidence packet keys.");
requireText(schemaDraft, "missing_evidence", "Backend schema must preserve missing evidence.");
requireText(schemaDraft, "blocked_live_actions", "Backend schema must preserve blocked live actions.");
requireText(schemaDraft, "signed_approval_capture_allowed", "Backend schema must block signed approval capture.");
requireText(schemaDraft, "evidence_attachment", "Backend schema must include evidence attachment records.");
requireText(schemaDraft, "attachment_id", "Backend schema must preserve evidence attachment ids.");
requireText(schemaDraft, "storage_candidate", "Backend schema must preserve evidence attachment storage candidates.");
requireText(schemaDraft, "quarantine_path", "Backend schema must preserve evidence attachment quarantine paths.");
requireText(schemaDraft, "checksum_required", "Backend schema must require evidence attachment checksums.");
requireText(schemaDraft, "malware_scan_status", "Backend schema must preserve malware scan status.");
requireText(schemaDraft, "retention_period", "Backend schema must preserve evidence attachment retention period.");
requireText(schemaDraft, "delete_export_policy", "Backend schema must preserve delete/export policy.");
requireText(schemaDraft, "storage_write_allowed", "Backend schema must block storage writes.");
requireText(schemaDraft, "download_allowed", "Backend schema must block attachment downloads.");
requireText(schemaDraft, "student_facing_attachment_allowed", "Backend schema must block student-facing attachments.");
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
requireText(migrationSpecs, "spec-ai-generated-package-manifest", "Migration specs must include AI generated package manifests.");
requireText(migrationSpecs, "ai_generated_package_manifest_id", "Migration specs must preserve generated package manifest ids.");
requireText(migrationSpecs, "prompt_package_id", "Migration specs must preserve generated package prompt package ids.");
requireText(migrationSpecs, "draft_preview_id", "Migration specs must preserve generated package draft preview ids.");
requireText(migrationSpecs, "audio_coverage_plan_id", "Migration specs must preserve generated package audio coverage plan ids.");
requireText(migrationSpecs, "engine_binding_plan_id", "Migration specs must preserve generated package engine binding plan ids.");
requireText(migrationSpecs, "gamification_mapping_id", "Migration specs must preserve generated package gamification mapping ids.");
requireText(migrationSpecs, "verifier_submission_packet_id", "Migration specs must preserve generated package verifier packet ids.");
requireText(migrationSpecs, "review_queue_item_id", "Migration specs must preserve generated package review queue item ids.");
requireText(migrationSpecs, "release_locks", "Migration specs must preserve generated package release locks.");
requireText(migrationSpecs, "package_assembly_allowed", "Migration specs must block generated package assembly.");
requireText(migrationSpecs, "route_registry_write_allowed", "Migration specs must block generated package route registry writes.");
requireText(migrationSpecs, "media_playlist_write_allowed", "Migration specs must block generated package media playlist writes.");
requireText(migrationSpecs, "assignment_write_allowed", "Migration specs must block generated package assignments.");
requireText(migrationSpecs, "local_bundle_write_allowed", "Migration specs must block generated package local bundle writes.");
requireText(migrationSpecs, "student_ready_marker_allowed", "Migration specs must block generated package student-ready markers.");
requireText(migrationSpecs, "spec-ai-reward-readiness-gate", "Migration specs must include AI reward readiness gates.");
requireText(migrationSpecs, "ai_reward_readiness_gate_id", "Migration specs must preserve AI reward readiness gate ids.");
requireText(migrationSpecs, "ai_draft_correction_queue_id", "Migration specs must preserve AI draft correction queue ids.");
requireText(migrationSpecs, "star_dust_cap_check", "Migration specs must preserve AI reward Star Dust cap checks.");
requireText(migrationSpecs, "deterministic_unlock_check", "Migration specs must preserve deterministic unlock checks.");
requireText(migrationSpecs, "reward_publishing_allowed", "Migration specs must block reward publishing.");
requireText(migrationSpecs, "collection_inventory_write_allowed", "Migration specs must block collection inventory writes.");
requireText(migrationSpecs, "spec-upload-intake-asset", "Migration specs must include upload intake assets.");
requireText(migrationSpecs, "file_metadata", "Migration specs must preserve upload file metadata.");
requireText(migrationSpecs, "target_mapping", "Migration specs must preserve upload target mapping.");
requireText(migrationSpecs, "spec-upload-review-decision", "Migration specs must include upload review decisions.");
requireText(migrationSpecs, "rights_proof_packet", "Migration specs must preserve upload review rights proof packets.");
requireText(migrationSpecs, "target_mapping_packet", "Migration specs must preserve upload target mapping packets.");
requireText(migrationSpecs, "promotion_allowed", "Migration specs must preserve upload review promotion blocks.");
requireText(migrationSpecs, "spec-upload-promotion-gate", "Migration specs must include upload promotion gates.");
requireText(migrationSpecs, "target_kind", "Migration specs must preserve upload promotion target kinds.");
requireText(migrationSpecs, "student_facing_promotion_allowed", "Migration specs must preserve upload promotion blocks.");
requireText(migrationSpecs, "spec-evidence-packet", "Migration specs must include evidence packet records.");
requireText(migrationSpecs, "evidence_packet_id", "Migration specs must preserve evidence packet ids.");
requireText(migrationSpecs, "packet_key", "Migration specs must preserve evidence packet keys.");
requireText(migrationSpecs, "missing_evidence", "Migration specs must preserve missing evidence.");
requireText(migrationSpecs, "blocked_live_actions", "Migration specs must preserve blocked live actions.");
requireText(migrationSpecs, "signed_approval_capture_allowed", "Migration specs must block signed approval capture.");
requireText(migrationSpecs, "spec-evidence-attachment", "Migration specs must include evidence attachment records.");
requireText(migrationSpecs, "attachment_id", "Migration specs must preserve evidence attachment ids.");
requireText(migrationSpecs, "storage_candidate", "Migration specs must preserve storage candidates.");
requireText(migrationSpecs, "quarantine_path", "Migration specs must preserve quarantine paths.");
requireText(migrationSpecs, "checksum_required", "Migration specs must require checksums.");
requireText(migrationSpecs, "malware_scan_status", "Migration specs must preserve malware scan status.");
requireText(migrationSpecs, "delete_export_policy", "Migration specs must preserve delete/export policy.");
requireText(migrationSpecs, "storage_write_allowed", "Migration specs must block storage writes.");
requireText(migrationSpecs, "download_allowed", "Migration specs must block downloads.");
requireText(migrationSpecs, "student_facing_attachment_allowed", "Migration specs must block student-facing attachments.");
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
requireText(schemaDraft, "reviewer_identity_signature_gate", "Backend schema must include reviewer identity and signature gate records.");
requireText(schemaDraft, "identity_signature_gate_id", "Backend schema must preserve reviewer identity signature gate ids.");
requireText(schemaDraft, "reviewer_identity_requirements", "Backend schema must preserve reviewer identity requirements.");
requireText(schemaDraft, "approval_intent_requirements", "Backend schema must preserve approval intent requirements.");
requireText(schemaDraft, "signature_policy_requirements", "Backend schema must preserve signature policy requirements.");
requireText(schemaDraft, "audit_retention_requirements", "Backend schema must preserve audit retention requirements.");
requireText(schemaDraft, "approval_capture_allowed", "Backend schema must block approval capture.");
requireText(schemaDraft, "signature_attachment_upload_allowed", "Backend schema must block signature attachment upload.");
requireText(schemaDraft, "approval_driven_assignment_allowed", "Backend schema must block approval-driven assignment.");
requireText(schemaDraft, "Anonymous approval", "Backend schema must block anonymous approvals.");
requireText(schemaDraft, "Signed PDF packet", "Backend schema must block signed PDF packets.");
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
requireText(schemaDraft, "classroom_launch_gate", "Backend schema must include classroom launch gate records.");
requireText(schemaDraft, "classroom_launch_gate_id", "Backend schema must preserve classroom launch gate ids.");
requireText(schemaDraft, "source_gate_ids", "Backend schema must preserve classroom launch source gate ids.");
requireText(schemaDraft, "required_before_launch", "Backend schema must preserve required-before-launch items.");
requireText(schemaDraft, "live_classroom_launch_allowed", "Backend schema must block live classroom launch.");
requireText(schemaDraft, "Manual launch-ready override", "Backend schema must forbid manual launch-ready overrides.");
requireText(schemaDraft, "school_launch_policy_gate", "Backend schema must include school launch policy gate records.");
requireText(schemaDraft, "school_launch_policy_gate_id", "Backend schema must preserve school launch policy gate ids.");
requireText(schemaDraft, "ownership_lanes", "Backend schema must preserve school launch ownership lanes.");
requireText(schemaDraft, "school_policy_acceptance_allowed", "Backend schema must block school policy acceptance workflows.");
requireText(schemaDraft, "Support-language-only mastery trigger", "Backend schema must forbid support-language-only mastery triggers.");
requireText(schemaDraft, "school_policy_handoff_packet", "Backend schema must include school policy handoff packet records.");
requireText(schemaDraft, "school_policy_handoff_packet_id", "Backend schema must preserve school policy handoff packet ids.");
requireText(schemaDraft, "packet_sections", "Backend schema must preserve school policy handoff packet sections.");
requireText(schemaDraft, "evidence_needed", "Backend schema must preserve school policy handoff evidence needs.");
requireText(schemaDraft, "deferred_decisions", "Backend schema must preserve school policy handoff deferred decisions.");
requireText(schemaDraft, "policy_handoff_acceptance_allowed", "Backend schema must block policy acceptance from handoff packets.");
requireText(schemaDraft, "handoff_evidence_export_allowed", "Backend schema must block handoff evidence export.");
requireText(schemaDraft, "Production QR promise", "Backend schema must forbid production QR promises from handoff packets.");
requireText(schemaDraft, "school_policy_acceptance_preflight", "Backend schema must include school policy acceptance preflight records.");
requireText(schemaDraft, "school_policy_acceptance_preflight_id", "Backend schema must preserve school policy acceptance preflight ids.");
requireText(schemaDraft, "reviewer_identity_signature_gate_id", "Backend schema must link acceptance preflight to reviewer identity/signature gate.");
requireText(schemaDraft, "missing_before_acceptance", "Backend schema must preserve missing acceptance requirements.");
requireText(schemaDraft, "minimum_acceptance_record", "Backend schema must preserve minimum acceptance record fields.");
requireText(schemaDraft, "preflight_storage_activation_allowed", "Backend schema must block preflight storage activation.");
requireText(schemaDraft, "launch_ready_status_allowed", "Backend schema must block launch-ready status from preflight records.");
requireText(schemaDraft, "school_policy_text_pack", "Backend schema must include school policy text pack records.");
requireText(schemaDraft, "school_policy_text_pack_id", "Backend schema must preserve school policy text pack ids.");
requireText(schemaDraft, "policy_text_version", "Backend schema must preserve school policy text versions.");
requireText(schemaDraft, "policy_clauses", "Backend schema must preserve school policy clauses.");
requireText(schemaDraft, "minimum_version_fields", "Backend schema must preserve school policy minimum version fields.");
requireText(schemaDraft, "policy_text_acceptance_allowed", "Backend schema must block school policy text acceptance.");
requireText(schemaDraft, "policy_text_signature_capture_allowed", "Backend schema must block school policy text signature capture.");
requireText(schemaDraft, "policy_text_storage_activation_allowed", "Backend schema must block school policy text storage activation.");
requireText(schemaDraft, "school_policy_acceptance_record_preview", "Backend schema must include school policy acceptance record preview records.");
requireText(schemaDraft, "school_policy_acceptance_record_preview_id", "Backend schema must preserve school policy acceptance record preview ids.");
requireText(schemaDraft, "minimum_accepted_record_fields", "Backend schema must preserve future accepted-record fields.");
requireText(schemaDraft, "non_accepted_markers", "Backend schema must preserve non-accepted markers.");
requireText(schemaDraft, "accepted_terms_storage_allowed", "Backend schema must block accepted terms storage.");
requireText(schemaDraft, "acceptance_signature_capture_allowed", "Backend schema must block acceptance signature capture.");
requireText(schemaDraft, "acceptance_storage_activation_allowed", "Backend schema must block acceptance storage activation.");
requireText(schemaDraft, "school_policy_revocation_rollback_preview", "Backend schema must include school policy revocation rollback preview records.");
requireText(schemaDraft, "school_policy_revocation_rollback_preview_id", "Backend schema must preserve school policy revocation rollback preview ids.");
requireText(schemaDraft, "rollback_lanes", "Backend schema must preserve school policy rollback lanes.");
requireText(schemaDraft, "minimum_rollback_record_fields", "Backend schema must preserve minimum rollback record fields.");
requireText(schemaDraft, "revocation_action_allowed", "Backend schema must block revocation actions.");
requireText(schemaDraft, "rollback_action_allowed", "Backend schema must block rollback actions.");
requireText(schemaDraft, "production_qr_redirect_mutation_allowed", "Backend schema must block production QR redirect mutation.");
requireText(schemaDraft, "learner_data_deletion_workflow_allowed", "Backend schema must block learner-data deletion workflows.");
requireText(schemaDraft, "media_replacement_allowed", "Backend schema must block media replacement.");
requireText(schemaDraft, "local_bundle_deactivation_allowed", "Backend schema must block local bundle deactivation.");
requireText(schemaDraft, "ai_tutor_entitlement_change_allowed", "Backend schema must block AI Tutor entitlement changes.");
requireText(schemaDraft, "school_policy_rollback_impact_matrix", "Backend schema must include school rollback impact matrix records.");
requireText(schemaDraft, "school_policy_rollback_impact_matrix_id", "Backend schema must preserve school rollback impact matrix ids.");
requireText(schemaDraft, "impact_rows", "Backend schema must preserve school rollback impact rows.");
requireText(schemaDraft, "affected_records", "Backend schema must preserve school rollback affected records.");
requireText(schemaDraft, "required_evidence", "Backend schema must preserve school rollback required evidence.");
requireText(schemaDraft, "release_state_mutation_allowed", "Backend schema must block rollback impact matrix release-state mutation.");
requireText(schemaDraft, "school_rollback_safe_fallback_plan", "Backend schema must include school rollback safe fallback plan records.");
requireText(schemaDraft, "school_rollback_safe_fallback_plan_id", "Backend schema must preserve school rollback safe fallback plan ids.");
requireText(schemaDraft, "message_drafts", "Backend schema must preserve school rollback safe fallback message drafts.");
requireText(schemaDraft, "route_fallbacks", "Backend schema must preserve school rollback route fallbacks.");
requireText(schemaDraft, "live_notification_allowed", "Backend schema must block live fallback notifications.");
requireText(schemaDraft, "student_reassignment_allowed", "Backend schema must block fallback student reassignment.");
requireText(schemaDraft, "school_rollback_safe_fallback_preflight", "Backend schema must include school rollback safe fallback preflight records.");
requireText(schemaDraft, "school_rollback_safe_fallback_preflight_id", "Backend schema must preserve school rollback safe fallback preflight ids.");
requireText(schemaDraft, "preflight_lanes", "Backend schema must preserve school rollback safe fallback preflight lanes.");
requireText(schemaDraft, "minimum_activation_fields", "Backend schema must preserve school rollback safe fallback minimum activation fields.");
requireText(schemaDraft, "fallback_activation_allowed", "Backend schema must block fallback activation.");
requireText(schemaDraft, "school_rollback_safe_fallback_activation_preview", "Backend schema must include school rollback safe fallback activation preview records.");
requireText(schemaDraft, "school_rollback_safe_fallback_activation_preview_id", "Backend schema must preserve school rollback safe fallback activation preview ids.");
requireText(schemaDraft, "minimum_activation_record_fields", "Backend schema must preserve school rollback safe fallback activation fields.");
requireText(schemaDraft, "non_activated_markers", "Backend schema must preserve school rollback safe fallback non-activated markers.");
requireText(schemaDraft, "school_rollback_safe_fallback_restoration_preview", "Backend schema must include school rollback safe fallback restoration preview records.");
requireText(schemaDraft, "school_rollback_safe_fallback_restoration_preview_id", "Backend schema must preserve school rollback safe fallback restoration preview ids.");
requireText(schemaDraft, "minimum_restoration_record_fields", "Backend schema must preserve school rollback safe fallback restoration fields.");
requireText(schemaDraft, "non_restored_markers", "Backend schema must preserve school rollback safe fallback non-restored markers.");
requireText(schemaDraft, "restoration_activation_allowed", "Backend schema must block safe fallback restoration activation.");
requireText(schemaDraft, "live_classroom_restart_allowed", "Backend schema must block safe fallback classroom restart.");
requireText(schemaDraft, "media_restoration_allowed", "Backend schema must block safe fallback media restoration.");
requireText(schemaDraft, "local_bundle_restoration_allowed", "Backend schema must block safe fallback local bundle restoration.");
requireText(migrationSpecs, "spec-pilot-evidence-packet", "Migration specs must include pilot evidence packets.");
requireText(migrationSpecs, "evidence_packet_id", "Migration specs must preserve pilot evidence packet ids.");
requireText(migrationSpecs, "upload_allowed", "Migration specs must preserve evidence upload blocks.");
requireText(migrationSpecs, "signed_approval_capture_allowed", "Migration specs must preserve signed approval capture blocks.");
requireText(migrationSpecs, "spec-reviewer-identity-signature-gate", "Migration specs must include reviewer identity and signature gate records.");
requireText(migrationSpecs, "identity_signature_gate_id", "Migration specs must preserve reviewer identity signature gate ids.");
requireText(migrationSpecs, "reviewer_identity_requirements", "Migration specs must preserve reviewer identity requirements.");
requireText(migrationSpecs, "approval_intent_requirements", "Migration specs must preserve approval intent requirements.");
requireText(migrationSpecs, "signature_policy_requirements", "Migration specs must preserve signature policy requirements.");
requireText(migrationSpecs, "audit_retention_requirements", "Migration specs must preserve audit retention requirements.");
requireText(migrationSpecs, "approval_capture_allowed", "Migration specs must block approval capture.");
requireText(migrationSpecs, "signature_attachment_upload_allowed", "Migration specs must block signature attachment upload.");
requireText(migrationSpecs, "approval_driven_assignment_allowed", "Migration specs must block approval-driven assignment.");
requireText(migrationSpecs, "spec-teacher-dry-run-rehearsal", "Migration specs must include teacher dry-run rehearsals.");
requireText(migrationSpecs, "route_rehearsal_results", "Migration specs must preserve route rehearsal checks.");
requireText(migrationSpecs, "student_launch_allowed", "Migration specs must block student launch from dry-run records.");
requireText(migrationSpecs, "real_learner_data_allowed", "Migration specs must block real learner data from dry-run records.");
requireText(migrationSpecs, "report_export_allowed", "Migration specs must block report export from dry-run records.");
requireText(migrationSpecs, "spec-classroom-launch-gate", "Migration specs must include classroom launch gates.");
requireText(migrationSpecs, "classroom_launch_gate_id", "Migration specs must preserve classroom launch gate ids.");
requireText(migrationSpecs, "source_gate_ids", "Migration specs must preserve classroom launch source gate ids.");
requireText(migrationSpecs, "live_classroom_launch_allowed", "Migration specs must block live classroom launch.");
requireText(migrationSpecs, "spec-school-launch-policy-gate", "Migration specs must include school launch policy gates.");
requireText(migrationSpecs, "school_launch_policy_gate_id", "Migration specs must preserve school launch policy gate ids.");
requireText(migrationSpecs, "ownership_lanes", "Migration specs must preserve school launch ownership lanes.");
requireText(migrationSpecs, "school_policy_acceptance_allowed", "Migration specs must block school policy acceptance workflows.");
requireText(migrationSpecs, "spec-school-policy-handoff-packet", "Migration specs must include school policy handoff packets.");
requireText(migrationSpecs, "school_policy_handoff_packet_id", "Migration specs must preserve school policy handoff packet ids.");
requireText(migrationSpecs, "packet_sections", "Migration specs must preserve school policy handoff packet sections.");
requireText(migrationSpecs, "policy_handoff_acceptance_allowed", "Migration specs must block handoff policy acceptance.");
requireText(migrationSpecs, "handoff_evidence_export_allowed", "Migration specs must block handoff evidence export.");
requireText(migrationSpecs, "spec-school-policy-acceptance-preflight", "Migration specs must include school policy acceptance preflights.");
requireText(migrationSpecs, "school_policy_acceptance_preflight_id", "Migration specs must preserve school policy acceptance preflight ids.");
requireText(migrationSpecs, "missing_before_acceptance", "Migration specs must preserve missing acceptance requirements.");
requireText(migrationSpecs, "minimum_acceptance_record", "Migration specs must preserve minimum acceptance record fields.");
requireText(migrationSpecs, "preflight_storage_activation_allowed", "Migration specs must block preflight storage activation.");
requireText(migrationSpecs, "launch_ready_status_allowed", "Migration specs must block preflight launch-ready status.");
requireText(migrationSpecs, "spec-school-policy-text-pack", "Migration specs must include school policy text packs.");
requireText(migrationSpecs, "school_policy_text_pack_id", "Migration specs must preserve school policy text pack ids.");
requireText(migrationSpecs, "policy_text_version", "Migration specs must preserve school policy text versions.");
requireText(migrationSpecs, "policy_clauses", "Migration specs must preserve school policy clauses.");
requireText(migrationSpecs, "policy_text_acceptance_allowed", "Migration specs must block school policy text acceptance.");
requireText(migrationSpecs, "policy_text_signature_capture_allowed", "Migration specs must block school policy text signature capture.");
requireText(migrationSpecs, "policy_text_storage_activation_allowed", "Migration specs must block school policy text storage activation.");
requireText(migrationSpecs, "spec-school-policy-acceptance-record-preview", "Migration specs must include school policy acceptance record previews.");
requireText(migrationSpecs, "school_policy_acceptance_record_preview_id", "Migration specs must preserve school policy acceptance record preview ids.");
requireText(migrationSpecs, "minimum_accepted_record_fields", "Migration specs must preserve future accepted-record fields.");
requireText(migrationSpecs, "non_accepted_markers", "Migration specs must preserve non-accepted markers.");
requireText(migrationSpecs, "accepted_terms_storage_allowed", "Migration specs must block accepted terms storage.");
requireText(migrationSpecs, "acceptance_signature_capture_allowed", "Migration specs must block acceptance signature capture.");
requireText(migrationSpecs, "acceptance_storage_activation_allowed", "Migration specs must block acceptance storage activation.");
requireText(migrationSpecs, "spec-school-policy-revocation-rollback-preview", "Migration specs must include school policy revocation rollback previews.");
requireText(migrationSpecs, "school_policy_revocation_rollback_preview_id", "Migration specs must preserve school policy revocation rollback preview ids.");
requireText(migrationSpecs, "rollback_lanes", "Migration specs must preserve school policy rollback lanes.");
requireText(migrationSpecs, "minimum_rollback_record_fields", "Migration specs must preserve minimum rollback record fields.");
requireText(migrationSpecs, "revocation_action_allowed", "Migration specs must block revocation actions.");
requireText(migrationSpecs, "rollback_action_allowed", "Migration specs must block rollback actions.");
requireText(migrationSpecs, "production_qr_redirect_mutation_allowed", "Migration specs must block production QR redirect mutation.");
requireText(migrationSpecs, "learner_data_deletion_workflow_allowed", "Migration specs must block learner-data deletion workflows.");
requireText(migrationSpecs, "media_replacement_allowed", "Migration specs must block media replacement.");
requireText(migrationSpecs, "local_bundle_deactivation_allowed", "Migration specs must block local bundle deactivation.");
requireText(migrationSpecs, "ai_tutor_entitlement_change_allowed", "Migration specs must block AI Tutor entitlement changes.");
requireText(migrationSpecs, "spec-school-policy-rollback-impact-matrix", "Migration specs must include school rollback impact matrices.");
requireText(migrationSpecs, "school_policy_rollback_impact_matrix_id", "Migration specs must preserve school rollback impact matrix ids.");
requireText(migrationSpecs, "impact_matrix_revision", "Migration specs must preserve school rollback impact matrix revisions.");
requireText(migrationSpecs, "spec-school-rollback-safe-fallback-plan", "Migration specs must include school rollback safe fallback plans.");
requireText(migrationSpecs, "school_rollback_safe_fallback_plan_id", "Migration specs must preserve school rollback safe fallback plan ids.");
requireText(migrationSpecs, "safe_fallback_revision", "Migration specs must preserve school rollback safe fallback revisions.");
requireText(migrationSpecs, "spec-school-rollback-safe-fallback-preflight", "Migration specs must include school rollback safe fallback preflights.");
requireText(migrationSpecs, "school_rollback_safe_fallback_preflight_id", "Migration specs must preserve school rollback safe fallback preflight ids.");
requireText(migrationSpecs, "safe_fallback_preflight_revision", "Migration specs must preserve school rollback safe fallback preflight revisions.");
requireText(migrationSpecs, "fallback_activation_allowed", "Migration specs must block fallback activation.");
requireText(migrationSpecs, "spec-school-rollback-safe-fallback-activation-preview", "Migration specs must include school rollback safe fallback activation previews.");
requireText(migrationSpecs, "school_rollback_safe_fallback_activation_preview_id", "Migration specs must preserve school rollback safe fallback activation preview ids.");
requireText(migrationSpecs, "safe_fallback_activation_preview_revision", "Migration specs must preserve school rollback safe fallback activation preview revisions.");
requireText(migrationSpecs, "spec-school-rollback-safe-fallback-restoration-preview", "Migration specs must include school rollback safe fallback restoration previews.");
requireText(migrationSpecs, "school_rollback_safe_fallback_restoration_preview_id", "Migration specs must preserve school rollback safe fallback restoration preview ids.");
requireText(migrationSpecs, "safe_fallback_restoration_preview_revision", "Migration specs must preserve school rollback safe fallback restoration preview revisions.");
requireText(migrationSpecs, "minimum_restoration_record_fields", "Migration specs must preserve school rollback safe fallback restoration fields.");
requireText(migrationSpecs, "restoration_activation_allowed", "Migration specs must block safe fallback restoration activation.");
requireText(migrationSpecs, "local_bundle_restoration_allowed", "Migration specs must block safe fallback local bundle restoration.");
requireText(migrationSpecs, "spec-teacher-assignment-rollout-gate", "Migration specs must include teacher assignment rollout gates.");
requireText(migrationSpecs, "rollout_gate_id", "Migration specs must preserve teacher assignment rollout gate ids.");
requireText(migrationSpecs, "rollout_gate_revision", "Migration specs must preserve teacher assignment rollout gate revisions.");
requireText(migrationSpecs, "gate_evidence", "Migration specs must preserve teacher assignment rollout gate evidence.");
requireText(migrationSpecs, "scheduling_allowed", "Migration specs must block teacher assignment scheduling.");
requireText(migrationSpecs, "real_learner_data_collection_allowed", "Migration specs must block real learner data collection.");
requireText(migrationSpecs, "spec-private-assignment-link", "Migration specs must include private assignment links.");
requireText(migrationSpecs, "private_assignment_link_id", "Migration specs must preserve private assignment link ids.");
requireText(migrationSpecs, "assignment_link_revision", "Migration specs must preserve private assignment link revisions.");
requireText(migrationSpecs, "public_sharing_allowed", "Migration specs must block private assignment public sharing.");
requireText(migrationSpecs, "iframe_embed_allowed", "Migration specs must block private assignment iframe embeds.");
requireText(migrationSpecs, "teacher_admin_controls_exposed", "Migration specs must block teacher/admin controls on assignment links.");
requireText(migrationSpecs, "spec-class-roster-plan", "Migration specs must include class roster plans.");
requireText(migrationSpecs, "class_roster_plan_id", "Migration specs must preserve class roster plan ids.");
requireText(migrationSpecs, "roster_plan_revision", "Migration specs must preserve class roster plan revisions.");
requireText(migrationSpecs, "learner_code_slots", "Migration specs must preserve coded learner slots.");
requireText(migrationSpecs, "data_boundaries", "Migration specs must preserve class roster data boundaries.");
requireText(migrationSpecs, "real_learner_name_storage_allowed", "Migration specs must block real learner name storage.");
requireText(migrationSpecs, "family_contact_storage_allowed", "Migration specs must block family contact storage.");
requireText(migrationSpecs, "raw_audio_storage_allowed", "Migration specs must block raw audio storage for class rosters.");
requireText(migrationSpecs, "transcript_storage_allowed", "Migration specs must block transcript storage for class rosters.");
requireText(migrationSpecs, "spec-source-extraction-review-packet", "Migration specs must include source extraction review packets.");
requireText(migrationSpecs, "source_extraction_review_packet_id", "Migration specs must preserve source extraction review packet ids.");
requireText(migrationSpecs, "extraction_revision", "Migration specs must preserve extraction revisions.");
requireText(migrationSpecs, "ocr_confidence_summary", "Migration specs must preserve OCR confidence summaries.");
requireText(migrationSpecs, "segmentation_review_packet", "Migration specs must preserve segmentation review packets.");
requireText(migrationSpecs, "candidate_payload_summary", "Migration specs must preserve candidate payload summaries.");
requireText(migrationSpecs, "student_facing_payload_allowed", "Migration specs must block student-facing extraction payloads.");
requireText(migrationSpecs, "spec-upload-file-policy-profile", "Migration specs must include upload file policy profiles.");
requireText(migrationSpecs, "upload_file_policy_profile_id", "Migration specs must preserve upload file policy profile ids.");
requireText(migrationSpecs, "policy_revision", "Migration specs must preserve upload file policy revisions.");
requireText(migrationSpecs, "accepted_mime_types", "Migration specs must preserve accepted MIME types.");
requireText(migrationSpecs, "scan_and_file_policy_packet", "Migration specs must preserve scan and file policy packets.");
requireText(migrationSpecs, "student_facing_upload_allowed", "Migration specs must block student-facing uploads.");
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
requireText(persistenceAdapter, "hosted-ai-generated-package-manifest-write", "Persistence adapter must include hosted AI generated package manifest writes.");
requireText(persistenceAdapter, "local-ai-generated-package-manifest-write", "Persistence adapter must include local AI generated package manifest writes.");
requireText(persistenceAdapter, "preservesAiGeneratedPackageManifest: true", "Persistence adapter must preserve AI generated package manifest links.");
requireText(persistenceAdapter, "blocksGeneratedPackageAssembly: true", "Persistence adapter must block generated package assembly.");
requireText(persistenceAdapter, "blocksGeneratedPackageRouteWrite: true", "Persistence adapter must block generated package route registry writes.");
requireText(persistenceAdapter, "blocksGeneratedPackagePlaylistWrite: true", "Persistence adapter must block generated package media playlist writes.");
requireText(persistenceAdapter, "blocksGeneratedPackageAssignment: true", "Persistence adapter must block generated package assignments.");
requireText(persistenceAdapter, "blocksGeneratedPackageLocalBundleWrite: true", "Persistence adapter must block generated package local bundle writes.");
requireText(persistenceAdapter, "blocksStudentReadyMarker: true", "Persistence adapter must block generated package student-ready markers.");
requireText(persistenceAdapter, "hosted-ai-reward-readiness-gate-write", "Persistence adapter must include hosted AI reward readiness gate writes.");
requireText(persistenceAdapter, "local-ai-reward-readiness-gate-write", "Persistence adapter must include local AI reward readiness gate writes.");
requireText(persistenceAdapter, "preservesAiRewardReadinessGate: true", "Persistence adapter must preserve AI reward readiness checks.");
requireText(persistenceAdapter, "preservesDeterministicRewardRules: true", "Persistence adapter must preserve deterministic reward rules.");
requireText(persistenceAdapter, "blocksRewardPublishing: true", "Persistence adapter must block reward publishing.");
requireText(persistenceAdapter, "blocksCollectionInventoryWrite: true", "Persistence adapter must block collection inventory writes.");
requireText(persistenceAdapter, "blocksGeneratedSurpriseRewards: true", "Persistence adapter must block generated surprise rewards.");
requireText(persistenceAdapter, "blocksSpinWheelTicketIssuance: true", "Persistence adapter must block Spin Wheel ticket issuance.");
requireText(persistenceAdapter, "blocksAvatarEvolutionWrite: true", "Persistence adapter must block avatar evolution writes.");
requireText(persistenceAdapter, "requiresAiDraftCorrectionQueueClearance: true", "Persistence adapter must require AI draft correction queue clearance.");
requireText(persistenceAdapter, "hosted-teacher-assignment-rollout-gate-write", "Persistence adapter must include hosted teacher assignment rollout gate writes.");
requireText(persistenceAdapter, "local-teacher-assignment-rollout-gate-write", "Persistence adapter must include local teacher assignment rollout gate writes.");
requireText(persistenceAdapter, "preservesTeacherAssignmentRolloutGate: true", "Persistence adapter must preserve teacher assignment rollout gates.");
requireText(persistenceAdapter, "blocksStudentLaunchAction: true", "Persistence adapter must block student launch actions.");
requireText(persistenceAdapter, "blocksLiveClassroomLaunch: true", "Persistence adapter must block live classroom launch.");
requireText(persistenceAdapter, "blocksRealLearnerDataCollection: true", "Persistence adapter must block real learner data collection.");
requireText(persistenceAdapter, "hosted-private-assignment-link-write", "Persistence adapter must include hosted private assignment link writes.");
requireText(persistenceAdapter, "local-private-assignment-link-write", "Persistence adapter must include local private assignment link writes.");
requireText(persistenceAdapter, "preservesPrivateAssignmentLink: true", "Persistence adapter must preserve private assignment links.");
requireText(persistenceAdapter, "blocksPublicSharing: true", "Persistence adapter must block public sharing.");
requireText(persistenceAdapter, "blocksIframeEmbed: true", "Persistence adapter must block iframe embeds.");
requireText(persistenceAdapter, "blocksTeacherAdminControlExposure: true", "Persistence adapter must block teacher/admin controls.");
requireText(persistenceAdapter, "hosted-class-roster-plan-write", "Persistence adapter must include hosted class roster plan writes.");
requireText(persistenceAdapter, "local-class-roster-plan-write", "Persistence adapter must include local class roster plan writes.");
requireText(persistenceAdapter, "preservesClassRosterPlan: true", "Persistence adapter must preserve class roster plans.");
requireText(persistenceAdapter, "blocksRealLearnerNameStorage: true", "Persistence adapter must block real learner name storage.");
requireText(persistenceAdapter, "blocksFamilyContactStorage: true", "Persistence adapter must block family contact storage.");
requireText(persistenceAdapter, "blocksRawAudioStorage: true", "Persistence adapter must block raw audio storage.");
requireText(persistenceAdapter, "blocksTranscriptStorage: true", "Persistence adapter must block transcript storage.");
requireText(persistenceAdapter, "hosted-source-extraction-review-packet-write", "Persistence adapter must include hosted source extraction review writes.");
requireText(persistenceAdapter, "local-source-extraction-review-packet-write", "Persistence adapter must include local source extraction review writes.");
requireText(persistenceAdapter, "preservesSourceExtractionReviewPacket: true", "Persistence adapter must preserve source extraction review packets.");
requireText(persistenceAdapter, "blocksUnreviewedExtractionPromotion: true", "Persistence adapter must block unreviewed extraction promotion.");
requireText(persistenceAdapter, "blocksRawPdfStudentPayload: true", "Persistence adapter must block raw PDF student payloads.");
requireText(persistenceAdapter, "blocksUnreviewedOcrAssignment: true", "Persistence adapter must block unreviewed OCR assignments.");
requireText(persistenceAdapter, "hosted-upload-file-policy-profile-write", "Persistence adapter must include hosted upload file policy writes.");
requireText(persistenceAdapter, "local-upload-file-policy-profile-write", "Persistence adapter must include local upload file policy writes.");
requireText(persistenceAdapter, "preservesUploadFilePolicyProfile: true", "Persistence adapter must preserve upload file policy profiles.");
requireText(persistenceAdapter, "requiresScanAndFilePolicyPacket: true", "Persistence adapter must require scan and file policy packets.");
requireText(persistenceAdapter, "blocksUploadWithoutFilePolicy: true", "Persistence adapter must block uploads without file policy.");
requireText(persistenceAdapter, "blocksUnsafeMimeType: true", "Persistence adapter must block unsafe MIME types.");
requireText(persistenceAdapter, "blocksOversizeUpload: true", "Persistence adapter must block oversize uploads.");
requireText(persistenceAdapter, "blocksUncheckedFileScan: true", "Persistence adapter must block unchecked file scans.");
requireText(persistenceAdapter, "hosted-upload-intake-write", "Persistence adapter must include hosted upload intake writes.");
requireText(persistenceAdapter, "local-upload-intake-write", "Persistence adapter must include local upload intake writes.");
requireText(persistenceAdapter, "preservesUploadSourceLineage: true", "Persistence adapter must preserve upload source lineage.");
requireText(persistenceAdapter, "blocksStudentFacingUploadUse: true", "Persistence adapter must block student-facing upload use.");
requireText(persistenceAdapter, "hosted-upload-review-write", "Persistence adapter must include hosted upload review writes.");
requireText(persistenceAdapter, "local-upload-review-write", "Persistence adapter must include local upload review writes.");
requireText(persistenceAdapter, "preservesUploadReviewPackets: true", "Persistence adapter must preserve upload review packets.");
requireText(persistenceAdapter, "preservesUploadTargetMappingPacket: true", "Persistence adapter must preserve upload target mapping packets.");
requireText(persistenceAdapter, "blocksUploadReviewPromotion: true", "Persistence adapter must block upload review promotion.");
requireText(persistenceAdapter, "hosted-upload-promotion-write", "Persistence adapter must include hosted upload promotion writes.");
requireText(persistenceAdapter, "local-upload-promotion-write", "Persistence adapter must include local upload promotion writes.");
requireText(persistenceAdapter, "preservesUploadPromotionTargets: true", "Persistence adapter must preserve upload promotion targets.");
requireText(persistenceAdapter, "blocksStudentFacingPromotion: true", "Persistence adapter must block student-facing promotion.");
requireText(persistenceAdapter, "hosted-evidence-packet-write", "Persistence adapter must include hosted evidence packet writes.");
requireText(persistenceAdapter, "local-evidence-packet-write", "Persistence adapter must include local evidence packet writes.");
requireText(persistenceAdapter, "preservesEvidencePacketFlow: true", "Persistence adapter must preserve evidence packet flows.");
requireText(persistenceAdapter, "blocksEvidencePacketPromotion: true", "Persistence adapter must block evidence packet promotion.");
requireText(persistenceAdapter, "hosted-evidence-attachment-write", "Persistence adapter must include hosted evidence attachment writes.");
requireText(persistenceAdapter, "local-evidence-attachment-write", "Persistence adapter must include local evidence attachment writes.");
requireText(persistenceAdapter, "preservesEvidenceAttachmentMetadata: true", "Persistence adapter must preserve evidence attachment metadata.");
requireText(persistenceAdapter, "blocksAttachmentUpload: true", "Persistence adapter must block attachment upload.");
requireText(persistenceAdapter, "blocksAttachmentDownload: true", "Persistence adapter must block attachment download.");
requireText(persistenceAdapter, "blocksStorageWrite: true", "Persistence adapter must block storage writes.");
requireText(persistenceAdapter, "blocksStudentFacingAttachment: true", "Persistence adapter must block student-facing attachments.");
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
requireText(persistenceAdapter, "hosted-reviewer-identity-signature-gate-write", "Persistence adapter must include hosted reviewer identity signature gate writes.");
requireText(persistenceAdapter, "local-reviewer-identity-signature-gate-write", "Persistence adapter must include local reviewer identity signature gate writes.");
requireText(persistenceAdapter, "preservesReviewerIdentitySignatureGate: true", "Persistence adapter must preserve reviewer identity and signature gates.");
requireText(persistenceAdapter, "blocksApprovalCapture: true", "Persistence adapter must block approval capture.");
requireText(persistenceAdapter, "blocksSignatureAttachmentUpload: true", "Persistence adapter must block signature attachment upload.");
requireText(persistenceAdapter, "blocksApprovalDrivenAssignment: true", "Persistence adapter must block approval-driven assignment.");
requireText(persistenceAdapter, "hosted-teacher-dry-run-rehearsal-write", "Persistence adapter must include hosted teacher dry-run rehearsal writes.");
requireText(persistenceAdapter, "local-teacher-dry-run-rehearsal-write", "Persistence adapter must include local teacher dry-run rehearsal writes.");
requireText(persistenceAdapter, "preservesTeacherDryRunRehearsal: true", "Persistence adapter must preserve teacher dry-run rehearsal checks.");
requireText(persistenceAdapter, "blocksStudentLaunchAction: true", "Persistence adapter must block student launch from dry-run records.");
requireText(persistenceAdapter, "blocksRealLearnerDataCollection: true", "Persistence adapter must block real learner data collection from dry-run records.");
requireText(persistenceAdapter, "blocksLiveReportExport: true", "Persistence adapter must block live report export from dry-run records.");
requireText(persistenceAdapter, "hosted-classroom-launch-gate-write", "Persistence adapter must include hosted classroom launch gate writes.");
requireText(persistenceAdapter, "local-classroom-launch-gate-write", "Persistence adapter must include local classroom launch gate writes.");
requireText(persistenceAdapter, "preservesClassroomLaunchGate: true", "Persistence adapter must preserve classroom launch gate checks.");
requireText(persistenceAdapter, "blocksLiveClassroomLaunch: true", "Persistence adapter must block live classroom launch.");
requireText(persistenceAdapter, "blocksLaunchWithoutPolicy: true", "Persistence adapter must block launch without policy.");
requireText(persistenceAdapter, "blocksLaunchWithoutPersistence: true", "Persistence adapter must block launch without persistence.");
requireText(persistenceAdapter, "hosted-school-launch-policy-gate-write", "Persistence adapter must include hosted school launch policy gate writes.");
requireText(persistenceAdapter, "local-school-launch-policy-gate-write", "Persistence adapter must include local school launch policy gate writes.");
requireText(persistenceAdapter, "preservesSchoolLaunchPolicyGate: true", "Persistence adapter must preserve school launch policy gates.");
requireText(persistenceAdapter, "blocksPolicyAcceptanceWorkflow: true", "Persistence adapter must block policy acceptance workflows.");
requireText(persistenceAdapter, "blocksLaunchWithoutSchoolPolicy: true", "Persistence adapter must block launch without school policy.");
requireText(persistenceAdapter, "hosted-school-policy-handoff-packet-write", "Persistence adapter must include hosted school policy handoff packet writes.");
requireText(persistenceAdapter, "local-school-policy-handoff-packet-write", "Persistence adapter must include local school policy handoff packet writes.");
requireText(persistenceAdapter, "preservesSchoolPolicyHandoffPacket: true", "Persistence adapter must preserve school policy handoff packets.");
requireText(persistenceAdapter, "blocksPolicyHandoffAcceptance: true", "Persistence adapter must block policy acceptance from handoff packets.");
requireText(persistenceAdapter, "blocksHandoffEvidenceExport: true", "Persistence adapter must block evidence export from handoff packets.");
requireText(persistenceAdapter, "hosted-school-policy-acceptance-preflight-write", "Persistence adapter must include hosted school policy acceptance preflight writes.");
requireText(persistenceAdapter, "local-school-policy-acceptance-preflight-write", "Persistence adapter must include local school policy acceptance preflight writes.");
requireText(persistenceAdapter, "preservesSchoolPolicyAcceptancePreflight: true", "Persistence adapter must preserve school policy acceptance preflight records.");
requireText(persistenceAdapter, "blocksPreflightPolicyAcceptance: true", "Persistence adapter must block preflight policy acceptance.");
requireText(persistenceAdapter, "blocksPreflightEvidenceExport: true", "Persistence adapter must block preflight evidence export.");
requireText(persistenceAdapter, "blocksPreflightStorageActivation: true", "Persistence adapter must block preflight storage activation.");
requireText(persistenceAdapter, "blocksPreflightLaunchReadyStatus: true", "Persistence adapter must block preflight launch-ready status.");
requireText(persistenceAdapter, "hosted-school-policy-text-pack-write", "Persistence adapter must include hosted school policy text pack writes.");
requireText(persistenceAdapter, "local-school-policy-text-pack-write", "Persistence adapter must include local school policy text pack writes.");
requireText(persistenceAdapter, "preservesSchoolPolicyTextPack: true", "Persistence adapter must preserve school policy text pack records.");
requireText(persistenceAdapter, "blocksPolicyTextAcceptance: true", "Persistence adapter must block school policy text acceptance.");
requireText(persistenceAdapter, "blocksPolicyTextSignatureCapture: true", "Persistence adapter must block school policy text signature capture.");
requireText(persistenceAdapter, "blocksPolicyTextEvidenceExport: true", "Persistence adapter must block school policy text evidence export.");
requireText(persistenceAdapter, "blocksPolicyTextStorageActivation: true", "Persistence adapter must block school policy text storage activation.");
requireText(persistenceAdapter, "blocksPolicyTextLaunchReadyStatus: true", "Persistence adapter must block school policy text launch-ready status.");
requireText(persistenceAdapter, "hosted-school-policy-acceptance-record-preview-write", "Persistence adapter must include hosted school policy acceptance record preview writes.");
requireText(persistenceAdapter, "local-school-policy-acceptance-record-preview-write", "Persistence adapter must include local school policy acceptance record preview writes.");
requireText(persistenceAdapter, "preservesSchoolPolicyAcceptanceRecordPreview: true", "Persistence adapter must preserve school policy acceptance record previews.");
requireText(persistenceAdapter, "blocksAcceptedTermsStorage: true", "Persistence adapter must block accepted terms storage.");
requireText(persistenceAdapter, "blocksAcceptanceSignatureCapture: true", "Persistence adapter must block acceptance signature capture.");
requireText(persistenceAdapter, "blocksAcceptanceEvidenceExport: true", "Persistence adapter must block acceptance evidence export.");
requireText(persistenceAdapter, "blocksAcceptanceStorageActivation: true", "Persistence adapter must block acceptance storage activation.");
requireText(persistenceAdapter, "blocksAcceptanceLaunchReadyStatus: true", "Persistence adapter must block acceptance launch-ready status.");
requireText(persistenceAdapter, "hosted-school-policy-revocation-rollback-preview-write", "Persistence adapter must include hosted school policy revocation rollback preview writes.");
requireText(persistenceAdapter, "local-school-policy-revocation-rollback-preview-write", "Persistence adapter must include local school policy revocation rollback preview writes.");
requireText(persistenceAdapter, "preservesSchoolPolicyRevocationRollbackPreview: true", "Persistence adapter must preserve school policy revocation rollback previews.");
requireText(persistenceAdapter, "blocksRevocationAction: true", "Persistence adapter must block revocation actions.");
requireText(persistenceAdapter, "blocksRollbackAction: true", "Persistence adapter must block rollback actions.");
requireText(persistenceAdapter, "blocksProductionQrRedirectMutation: true", "Persistence adapter must block production QR redirect mutation.");
requireText(persistenceAdapter, "blocksLearnerDataDeletionWorkflow: true", "Persistence adapter must block learner-data deletion workflows.");
requireText(persistenceAdapter, "blocksMediaReplacement: true", "Persistence adapter must block media replacement.");
requireText(persistenceAdapter, "blocksLocalBundleDeactivation: true", "Persistence adapter must block local bundle deactivation.");
requireText(persistenceAdapter, "blocksAiTutorEntitlementChange: true", "Persistence adapter must block AI Tutor entitlement changes.");
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
requireText(persistenceAdapter, "hosted-school-rollback-safe-fallback-restoration-preview-write", "Persistence adapter must include hosted school rollback safe fallback restoration preview writes.");
requireText(persistenceAdapter, "local-school-rollback-safe-fallback-restoration-preview-write", "Persistence adapter must include local school rollback safe fallback restoration preview writes.");
requireText(persistenceAdapter, "preservesSchoolRollbackSafeFallbackRestorationPreview: true", "Persistence adapter must preserve school rollback safe fallback restoration preview records.");
requireText(persistenceAdapter, "blocksLocalBundleRestoration: true", "Persistence adapter must block local bundle restoration.");
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
requireText(durableRecords, "ai-generated-package-manifest-record", "Durable record plan must include AI generated package manifest records.");
requireText(durableRecords, "AI generated package manifest record", "Durable record plan must expose AI generated package manifest record labels.");
requireText(durableRecords, "preservesAiGeneratedPackageManifest: true", "Durable record plan must preserve AI generated package manifest links.");
requireText(durableRecords, "blocksGeneratedPackageAssembly: true", "Durable record plan must block generated package assembly.");
requireText(durableRecords, "blocksGeneratedPackageRouteWrite: true", "Durable record plan must block generated package route registry writes.");
requireText(durableRecords, "blocksGeneratedPackagePlaylistWrite: true", "Durable record plan must block generated package media playlist writes.");
requireText(durableRecords, "blocksGeneratedPackageAssignment: true", "Durable record plan must block generated package assignments.");
requireText(durableRecords, "blocksGeneratedPackageLocalBundleWrite: true", "Durable record plan must block generated package local bundle writes.");
requireText(durableRecords, "blocksStudentReadyMarker: true", "Durable record plan must block generated package student-ready markers.");
requireText(durableRecords, "ai-reward-readiness-gate-record", "Durable record plan must include AI reward readiness gate records.");
requireText(durableRecords, "AI reward readiness gate record", "Durable record plan must expose AI reward readiness gate labels.");
requireText(durableRecords, "preservesAiRewardReadinessGate: true", "Durable record plan must preserve AI reward readiness checks.");
requireText(durableRecords, "preservesDeterministicRewardRules: true", "Durable record plan must preserve deterministic reward rules.");
requireText(durableRecords, "blocksRewardPublishing: true", "Durable record plan must block reward publishing.");
requireText(durableRecords, "blocksCollectionInventoryWrite: true", "Durable record plan must block collection inventory writes.");
requireText(durableRecords, "blocksGeneratedSurpriseRewards: true", "Durable record plan must block generated surprise rewards.");
requireText(durableRecords, "blocksSpinWheelTicketIssuance: true", "Durable record plan must block Spin Wheel ticket issuance.");
requireText(durableRecords, "blocksAvatarEvolutionWrite: true", "Durable record plan must block avatar evolution writes.");
requireText(durableRecords, "requiresAiDraftCorrectionQueueClearance: true", "Durable record plan must require AI draft correction queue clearance.");
requireText(durableRecords, "teacher-assignment-rollout-gate-record", "Durable record plan must include teacher assignment rollout gate records.");
requireText(durableRecords, "preservesTeacherAssignmentRolloutGate: true", "Durable record plan must preserve teacher assignment rollout gates.");
requireText(durableRecords, "blocksStudentLaunchAction: true", "Durable record plan must block student launch actions.");
requireText(durableRecords, "blocksRealLearnerDataCollection: true", "Durable record plan must block real learner data collection.");
requireText(durableRecords, "private-assignment-link-record", "Durable record plan must include private assignment link records.");
requireText(durableRecords, "preservesPrivateAssignmentLink: true", "Durable record plan must preserve private assignment links.");
requireText(durableRecords, "blocksPublicSharing: true", "Durable record plan must block public sharing.");
requireText(durableRecords, "blocksIframeEmbed: true", "Durable record plan must block iframe embeds.");
requireText(durableRecords, "blocksTeacherAdminControlExposure: true", "Durable record plan must block teacher/admin controls.");
requireText(durableRecords, "class-roster-plan-record", "Durable record plan must include class roster plan records.");
requireText(durableRecords, "preservesClassRosterPlan: true", "Durable record plan must preserve class roster plans.");
requireText(durableRecords, "blocksRealLearnerNameStorage: true", "Durable record plan must block real learner name storage.");
requireText(durableRecords, "blocksFamilyContactStorage: true", "Durable record plan must block family contact storage.");
requireText(durableRecords, "blocksRawAudioStorage: true", "Durable record plan must block raw audio storage.");
requireText(durableRecords, "blocksTranscriptStorage: true", "Durable record plan must block transcript storage.");
requireText(durableRecords, "source-extraction-review-packet-record", "Durable record plan must include source extraction review packets.");
requireText(durableRecords, "preservesSourceExtractionReviewPacket: true", "Durable record plan must preserve source extraction review packets.");
requireText(durableRecords, "blocksUnreviewedExtractionPromotion: true", "Durable record plan must block unreviewed extraction promotion.");
requireText(durableRecords, "blocksRawPdfStudentPayload: true", "Durable record plan must block raw PDF student payloads.");
requireText(durableRecords, "blocksUnreviewedOcrAssignment: true", "Durable record plan must block unreviewed OCR assignments.");
requireText(durableRecords, "upload-file-policy-profile-record", "Durable record plan must include upload file policy profiles.");
requireText(durableRecords, "preservesUploadFilePolicyProfile: true", "Durable record plan must preserve upload file policy profiles.");
requireText(durableRecords, "requiresScanAndFilePolicyPacket: true", "Durable record plan must require scan and file policy packets.");
requireText(durableRecords, "blocksUploadWithoutFilePolicy: true", "Durable record plan must block uploads without file policy.");
requireText(durableRecords, "blocksUnsafeMimeType: true", "Durable record plan must block unsafe MIME types.");
requireText(durableRecords, "blocksOversizeUpload: true", "Durable record plan must block oversize uploads.");
requireText(durableRecords, "blocksUncheckedFileScan: true", "Durable record plan must block unchecked file scans.");
requireText(durableRecords, "upload-intake-record", "Durable record plan must include upload intake records.");
requireText(durableRecords, "preservesUploadSourceLineage: true", "Durable record plan must preserve upload source lineage.");
requireText(durableRecords, "blocksStudentFacingUploadUse: true", "Durable record plan must block student-facing upload use.");
requireText(durableRecords, "upload-review-record", "Durable record plan must include upload review records.");
requireText(durableRecords, "preservesUploadReviewPackets: true", "Durable record plan must preserve upload review packets.");
requireText(durableRecords, "preservesUploadTargetMappingPacket: true", "Durable record plan must preserve upload target mapping packets.");
requireText(durableRecords, "blocksUploadReviewPromotion: true", "Durable record plan must block upload review promotion.");
requireText(durableRecords, "upload-promotion-record", "Durable record plan must include upload promotion records.");
requireText(durableRecords, "preservesUploadPromotionTargets: true", "Durable record plan must preserve upload promotion targets.");
requireText(durableRecords, "blocksStudentFacingPromotion: true", "Durable record plan must block student-facing promotion.");
requireText(durableRecords, "evidence-packet-record", "Durable record plan must include evidence packet records.");
requireText(durableRecords, "preservesEvidencePacketFlow: true", "Durable record plan must preserve evidence packet flows.");
requireText(durableRecords, "blocksEvidencePacketPromotion: true", "Durable record plan must block evidence packet promotion.");
requireText(durableRecords, "evidence-attachment-record", "Durable record plan must include evidence attachment records.");
requireText(durableRecords, "preservesEvidenceAttachmentMetadata: true", "Durable record plan must preserve evidence attachment metadata.");
requireText(durableRecords, "blocksAttachmentUpload: true", "Durable record plan must block attachment upload.");
requireText(durableRecords, "blocksAttachmentDownload: true", "Durable record plan must block attachment download.");
requireText(durableRecords, "blocksStorageWrite: true", "Durable record plan must block storage writes.");
requireText(durableRecords, "blocksStudentFacingAttachment: true", "Durable record plan must block student-facing attachments.");
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
requireText(durableRecords, "reviewer-identity-signature-gate-record", "Durable record plan must include reviewer identity signature gate records.");
requireText(durableRecords, "preservesReviewerIdentitySignatureGate: true", "Durable record plan must preserve reviewer identity and signature gates.");
requireText(durableRecords, "blocksApprovalCapture: true", "Durable record plan must block approval capture.");
requireText(durableRecords, "blocksSignatureAttachmentUpload: true", "Durable record plan must block signature attachment upload.");
requireText(durableRecords, "blocksApprovalDrivenAssignment: true", "Durable record plan must block approval-driven assignment.");
requireText(durableRecords, "teacher-dry-run-rehearsal-record", "Durable record plan must include teacher dry-run rehearsal records.");
requireText(durableRecords, "preservesTeacherDryRunRehearsal: true", "Durable record plan must preserve teacher dry-run rehearsal checks.");
requireText(durableRecords, "blocksStudentLaunchAction: true", "Durable record plan must block student launch from dry-run records.");
requireText(durableRecords, "blocksRealLearnerDataCollection: true", "Durable record plan must block real learner data collection from dry-run records.");
requireText(durableRecords, "blocksLiveReportExport: true", "Durable record plan must block live report export from dry-run records.");
requireText(durableRecords, "classroom-launch-gate-record", "Durable record plan must include classroom launch gate records.");
requireText(durableRecords, "preservesClassroomLaunchGate: true", "Durable record plan must preserve classroom launch gate checks.");
requireText(durableRecords, "blocksLiveClassroomLaunch: true", "Durable record plan must block live classroom launch.");
requireText(durableRecords, "blocksLaunchWithoutPolicy: true", "Durable record plan must block launch without policy.");
requireText(durableRecords, "blocksLaunchWithoutPersistence: true", "Durable record plan must block launch without persistence.");
requireText(durableRecords, "school-launch-policy-gate-record", "Durable record plan must include school launch policy gate records.");
requireText(durableRecords, "preservesSchoolLaunchPolicyGate: true", "Durable record plan must preserve school launch policy gates.");
requireText(durableRecords, "blocksPolicyAcceptanceWorkflow: true", "Durable record plan must block policy acceptance workflows.");
requireText(durableRecords, "blocksLaunchWithoutSchoolPolicy: true", "Durable record plan must block launch without school policy.");
requireText(durableRecords, "school-policy-handoff-packet-record", "Durable record plan must include school policy handoff packet records.");
requireText(durableRecords, "preservesSchoolPolicyHandoffPacket: true", "Durable record plan must preserve school policy handoff packets.");
requireText(durableRecords, "blocksPolicyHandoffAcceptance: true", "Durable record plan must block policy handoff acceptance.");
requireText(durableRecords, "blocksHandoffEvidenceExport: true", "Durable record plan must block handoff evidence export.");
requireText(durableRecords, "school-policy-acceptance-preflight-record", "Durable record plan must include school policy acceptance preflight records.");
requireText(durableRecords, "preservesSchoolPolicyAcceptancePreflight: true", "Durable record plan must preserve school policy acceptance preflight records.");
requireText(durableRecords, "blocksPreflightPolicyAcceptance: true", "Durable record plan must block preflight policy acceptance.");
requireText(durableRecords, "blocksPreflightEvidenceExport: true", "Durable record plan must block preflight evidence export.");
requireText(durableRecords, "blocksPreflightStorageActivation: true", "Durable record plan must block preflight storage activation.");
requireText(durableRecords, "blocksPreflightLaunchReadyStatus: true", "Durable record plan must block preflight launch-ready status.");
requireText(durableRecords, "school-policy-text-pack-record", "Durable record plan must include school policy text pack records.");
requireText(durableRecords, "preservesSchoolPolicyTextPack: true", "Durable record plan must preserve school policy text pack records.");
requireText(durableRecords, "blocksPolicyTextAcceptance: true", "Durable record plan must block school policy text acceptance.");
requireText(durableRecords, "blocksPolicyTextSignatureCapture: true", "Durable record plan must block school policy text signature capture.");
requireText(durableRecords, "blocksPolicyTextEvidenceExport: true", "Durable record plan must block school policy text evidence export.");
requireText(durableRecords, "blocksPolicyTextStorageActivation: true", "Durable record plan must block school policy text storage activation.");
requireText(durableRecords, "blocksPolicyTextLaunchReadyStatus: true", "Durable record plan must block school policy text launch-ready status.");
requireText(durableRecords, "school-policy-acceptance-record-preview-record", "Durable record plan must include school policy acceptance record preview records.");
requireText(durableRecords, "preservesSchoolPolicyAcceptanceRecordPreview: true", "Durable record plan must preserve school policy acceptance record previews.");
requireText(durableRecords, "blocksAcceptedTermsStorage: true", "Durable record plan must block accepted terms storage.");
requireText(durableRecords, "blocksAcceptanceSignatureCapture: true", "Durable record plan must block acceptance signature capture.");
requireText(durableRecords, "blocksAcceptanceEvidenceExport: true", "Durable record plan must block acceptance evidence export.");
requireText(durableRecords, "blocksAcceptanceStorageActivation: true", "Durable record plan must block acceptance storage activation.");
requireText(durableRecords, "blocksAcceptanceLaunchReadyStatus: true", "Durable record plan must block acceptance launch-ready status.");
requireText(durableRecords, "school-policy-revocation-rollback-preview-record", "Durable record plan must include school policy revocation rollback preview records.");
requireText(durableRecords, "preservesSchoolPolicyRevocationRollbackPreview: true", "Durable record plan must preserve school policy revocation rollback previews.");
requireText(durableRecords, "blocksRevocationAction: true", "Durable record plan must block revocation actions.");
requireText(durableRecords, "blocksRollbackAction: true", "Durable record plan must block rollback actions.");
requireText(durableRecords, "blocksProductionQrRedirectMutation: true", "Durable record plan must block production QR redirect mutation.");
requireText(durableRecords, "blocksLearnerDataDeletionWorkflow: true", "Durable record plan must block learner-data deletion workflows.");
requireText(durableRecords, "blocksMediaReplacement: true", "Durable record plan must block media replacement.");
requireText(durableRecords, "blocksLocalBundleDeactivation: true", "Durable record plan must block local bundle deactivation.");
requireText(durableRecords, "blocksAiTutorEntitlementChange: true", "Durable record plan must block AI Tutor entitlement changes.");
requireText(durableRecords, "school-policy-rollback-impact-matrix-record", "Durable record plan must include school rollback impact matrix records.");
requireText(durableRecords, "preservesSchoolPolicyRollbackImpactMatrix: true", "Durable record plan must preserve school rollback impact matrix records.");
requireText(durableRecords, "blocksReleaseStateMutation: true", "Durable record plan must block rollback impact matrix release-state mutation.");
requireText(durableRecords, "school-rollback-safe-fallback-plan-record", "Durable record plan must include school rollback safe fallback plan records.");
requireText(durableRecords, "preservesSchoolRollbackSafeFallbackPlan: true", "Durable record plan must preserve school rollback safe fallback plan records.");
requireText(durableRecords, "blocksLiveNotification: true", "Durable record plan must block live fallback notifications.");
requireText(durableRecords, "blocksStudentReassignment: true", "Durable record plan must block fallback student reassignment.");
requireText(durableRecords, "school-rollback-safe-fallback-preflight-record", "Durable record plan must include school rollback safe fallback preflight records.");
requireText(durableRecords, "preservesSchoolRollbackSafeFallbackPreflight: true", "Durable record plan must preserve school rollback safe fallback preflight records.");
requireText(durableRecords, "blocksReleaseStateMutation: true", "Durable record plan must block safe fallback preflight release-state mutation.");
requireText(durableRecords, "school-rollback-safe-fallback-activation-preview-record", "Durable record plan must include school rollback safe fallback activation preview records.");
requireText(durableRecords, "preservesSchoolRollbackSafeFallbackActivationPreview: true", "Durable record plan must preserve school rollback safe fallback activation preview records.");
requireText(durableRecords, "school-rollback-safe-fallback-restoration-preview-record", "Durable record plan must include school rollback safe fallback restoration preview records.");
requireText(durableRecords, "preservesSchoolRollbackSafeFallbackRestorationPreview: true", "Durable record plan must preserve school rollback safe fallback restoration preview records.");
requireText(durableRecords, "blocksLocalBundleRestoration: true", "Durable record plan must block local bundle restoration.");
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
requireText(routeVerifier, "evidence_packet", "Active route verifier must keep generic evidence packet storage visible on teacher intake.");
requireText(routeVerifier, "Evidence packet record", "Active route verifier must keep evidence packet durable records visible on teacher intake.");
requireText(routeVerifier, "evidence_attachment", "Active route verifier must keep evidence attachment storage visible on teacher intake.");
requireText(routeVerifier, "Evidence attachment record", "Active route verifier must keep evidence attachment durable records visible on teacher intake.");
requireText(routeVerifier, "pilot_evidence_packet", "Active route verifier must keep pilot evidence packet storage visible on teacher intake.");
requireText(routeVerifier, "reviewer_identity_signature_gate", "Active route verifier must keep reviewer identity signature gate storage visible on teacher intake.");
requireText(routeVerifier, "Reviewer identity and signature gate record", "Active route verifier must keep reviewer identity signature durable records visible on teacher intake.");
requireText(routeVerifier, "teacher_dry_run_rehearsal", "Active route verifier must keep teacher dry-run rehearsal storage visible on teacher intake.");
requireText(routeVerifier, "classroom_launch_gate", "Active route verifier must keep classroom launch gate storage visible on teacher intake.");
requireText(routeVerifier, "school_launch_policy_gate", "Active route verifier must keep school launch policy gate storage visible on teacher intake.");
requireText(routeVerifier, "school_policy_handoff_packet", "Active route verifier must keep school policy handoff packet storage visible on teacher intake.");
requireText(routeVerifier, "school_policy_text_pack", "Active route verifier must keep school policy text pack storage visible on teacher intake.");
requireText(routeVerifier, "school_policy_acceptance_record_preview", "Active route verifier must keep school policy acceptance record preview storage visible on teacher intake.");
requireText(routeVerifier, "school_policy_revocation_rollback_preview", "Active route verifier must keep school policy revocation rollback preview storage visible on teacher intake.");
requireText(routeVerifier, "school_policy_rollback_impact_matrix", "Active route verifier must keep school rollback impact matrix storage visible on teacher intake.");
requireText(routeVerifier, "school_rollback_safe_fallback_plan", "Active route verifier must keep school rollback safe fallback plan storage visible on teacher intake.");
requireText(routeVerifier, "school_rollback_safe_fallback_preflight", "Active route verifier must keep school rollback safe fallback preflight storage visible on teacher intake.");
requireText(routeVerifier, "school_rollback_safe_fallback_activation_preview", "Active route verifier must keep school rollback safe fallback activation preview storage visible on teacher intake.");
requireText(routeVerifier, "school_rollback_safe_fallback_restoration_preview", "Active route verifier must keep school rollback safe fallback restoration preview storage visible on teacher intake.");
requireText(routeVerifier, "teacher_assignment_rollout_gate", "Active route verifier must keep teacher assignment rollout gate storage visible on teacher intake.");
requireText(routeVerifier, "ai_generated_package_manifest", "Active route verifier must keep AI generated package manifest storage visible on teacher intake.");
requireText(routeVerifier, "AI generated package manifest record", "Active route verifier must keep AI generated package manifest durable records visible on teacher intake.");
requireText(routeVerifier, "ai_reward_readiness_gate", "Active route verifier must keep AI reward readiness storage visible on teacher intake.");
requireText(routeVerifier, "AI reward readiness gate record", "Active route verifier must keep AI reward readiness durable records visible on teacher intake.");
requireText(routeVerifier, "private_assignment_link", "Active route verifier must keep private assignment link storage visible on teacher intake.");
requireText(routeVerifier, "class_roster_plan", "Active route verifier must keep class roster plan storage visible on teacher intake.");
requireText(routeVerifier, "Class roster plan record", "Active route verifier must keep class roster durable records visible on teacher intake.");
requireText(routeVerifier, "source_extraction_review_packet", "Active route verifier must keep source extraction review storage visible on teacher intake.");
requireText(routeVerifier, "Source extraction review packet record", "Active route verifier must keep source extraction durable records visible on teacher intake.");
requireText(routeVerifier, "upload_file_policy_profile", "Active route verifier must keep upload file policy storage visible on teacher intake.");
requireText(routeVerifier, "Upload file policy profile record", "Active route verifier must keep upload file policy durable records visible on teacher intake.");

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
