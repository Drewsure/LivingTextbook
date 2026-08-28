import { readFileSync } from "node:fs";

const schemaDraft = readSource("../apps/web/src/data/sampleBackendSchemaDraft.ts");
const migrationCandidates = readSource("../apps/web/src/data/sampleBackendMigrationCandidates.ts");
const migrationSpecs = readSource("../apps/web/src/data/sampleBackendMigrationSpecs.ts");
const persistenceAdapter = readSource("../apps/web/src/data/samplePersistenceAdapterPlan.ts");
const durableRecords = readSource("../apps/web/src/data/samplePersistencePlan.ts");
const persistenceAdapterValidator = readSource("../packages/content-model/src/persistenceAdapter.ts");
const durableRecordValidator = readSource("../packages/content-model/src/persistenceRecords.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const failures = [];

const requiredSchemaEntities = [
  "tenant",
  "package_release",
  "teacher_draft_package",
  "teacher_draft_review_handoff",
  "teacher_draft_verifier_submission",
  "ai_generation_request_packet",
  "ai_generated_game_build_brief",
  "ai_external_prototype_task_packet",
  "prototype_intake_queue_item",
  "prototype_return_package_checklist",
  "ai_external_task_export_readiness_gate",
  "ai_prototype_return_review",
  "ai_prototype_integration_plan",
  "ai_prototype_wrapper_adapter_review",
  "ai_prototype_fixture_replay_report",
  "ai_prototype_event_replay_report",
  "ai_prototype_audio_coverage_report",
  "ai_prototype_mobile_accessibility_report",
  "ai_prototype_scoring_replay_report",
  "ai_prototype_integration_readiness_gate",
  "codex_integration_review_decision",
  "ai_prototype_app_patch_proposal",
  "ai_prototype_patch_test_readiness_gate",
  "ai_prototype_patch_test_harness_plan",
  "ai_prototype_patch_harness_implementation_proposal",
  "codex_patch_approval_decision",
  "ai_prototype_signed_approval_preflight",
  "ai_prototype_patch_authorization_release_lock",
  "ai_prototype_patch_implementation_work_order",
  "ai_prototype_patch_change_set_preview",
  "target_language_audio_approval",
  "ai_generated_package_teacher_review_packet",
  "ai_generated_package_manifest",
  "ai_generated_package_promotion_checklist",
  "ai_generated_package_release_candidate",
  "ai_generated_package_assembly_readiness",
  "ai_generated_package_assembly_dry_run",
  "ai_generated_package_writer_preflight",
  "ai_generated_package_writer_rollback_drill",
  "ai_generated_package_writer_implementation_readiness",
  "ai_generated_package_writer_module_test_plan",
  "ai_generated_package_writer_test_evidence_packet",
  "ai_generated_package_writer_test_harness_plan",
  "ai_generated_package_writer_test_harness_implementation_proposal",
  "ai_generated_package_writer_harness_implementation_decision",
  "ai_generated_package_writer_route_playlist_write_guard",
  "ai_generated_package_writer_local_companion_package_guard",
  "ai_generated_package_writer_assignment_shell_guard",
  "ai_reward_readiness_gate",
  "ai_generated_publish_readiness_gate",
  "ai_generator_tenant_coverage_gate",
  "ai_generator_review_summary",
  "ai_generator_reviewer_runbook",
  "ai_generator_responsibility_matrix",
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
  "game_mode_settings_profile",
  "teacher_game_mode_settings_snapshot",
  "game_mode_settings_change_request",
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
  "package_adoption_record_preview",
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
  "m100-ai-generation-request-packet-storage",
  "m060-ai-generated-game-build-brief-records",
  "m074-ai-external-prototype-task-packet-records",
  "m098-prototype-intake-queue-storage",
  "m099-prototype-return-package-checklist-storage",
  "m075-ai-external-task-export-readiness-gate-records",
  "m061-ai-prototype-return-review-records",
  "m062-ai-prototype-integration-plan-records",
  "m063-ai-prototype-wrapper-adapter-review-records",
  "m064-ai-prototype-fixture-replay-report-records",
  "m065-ai-prototype-event-replay-report-records",
  "m066-ai-prototype-audio-coverage-report-records",
  "m067-ai-prototype-mobile-accessibility-report-records",
  "m068-ai-prototype-scoring-replay-report-records",
  "m069-ai-prototype-integration-readiness-gate-records",
  "m070-codex-integration-review-decision-records",
  "m076-ai-prototype-app-patch-proposal-records",
  "m077-ai-prototype-patch-test-readiness-gate-records",
  "m078-ai-prototype-patch-test-harness-plan-records",
  "m079-ai-prototype-patch-harness-implementation-proposal-records",
  "m089-codex-patch-approval-decision-records",
  "m090-ai-prototype-signed-approval-preflight-records",
  "m091-ai-prototype-patch-authorization-release-lock-records",
  "m092-ai-prototype-patch-implementation-work-order-records",
  "m093-ai-prototype-patch-change-set-preview-records",
  "m094-ai-generated-package-teacher-review-packet-records",
  "m095-target-language-audio-approval-records",
  "m054-ai-generated-package-manifest-records",
  "m058-ai-generated-package-promotion-checklist-records",
  "m059-ai-generated-package-release-candidate-records",
  "m080-ai-generated-package-assembly-readiness-records",
  "m081-ai-generated-package-assembly-dry-run-records",
  "m082-ai-generated-package-writer-preflight-records",
  "m083-ai-generated-package-writer-rollback-drill-records",
  "m084-ai-generated-package-writer-implementation-readiness-records",
  "m085-ai-generated-package-writer-module-test-plan-records",
  "m086-ai-generated-package-writer-test-evidence-packet-records",
  "m087-ai-generated-package-writer-test-harness-plan-records",
  "m088-ai-generated-package-writer-test-harness-implementation-proposal-records",
  "m089-ai-generated-package-writer-harness-implementation-decision-records",
  "m101-ai-generated-package-writer-route-playlist-write-guard-records",
  "m102-ai-generated-package-writer-local-companion-package-guard-records",
  "m103-ai-generated-package-writer-assignment-shell-guard-records",
  "m055-ai-reward-readiness-gate-records",
  "m056-ai-generated-publish-readiness-gate-records",
  "m057-ai-generator-tenant-coverage-gate-records",
  "m071-ai-generator-review-summary-records",
  "m072-ai-generator-reviewer-runbook-records",
  "m073-ai-generator-responsibility-matrix-records",
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
  "m097-package-adoption-record-preview-storage",
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
  "m096-game-mode-settings-storage-records",
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
  "spec-ai-generation-request-packet",
  "spec-ai-generated-game-build-brief",
  "spec-ai-external-prototype-task-packet",
  "spec-prototype-intake-queue-item",
  "spec-prototype-return-package-checklist",
  "spec-ai-external-task-export-readiness-gate",
  "spec-ai-prototype-return-review",
  "spec-ai-prototype-integration-plan",
  "spec-ai-prototype-wrapper-adapter-review",
  "spec-ai-prototype-fixture-replay-report",
  "spec-ai-prototype-event-replay-report",
  "spec-ai-prototype-audio-coverage-report",
  "spec-ai-prototype-mobile-accessibility-report",
  "spec-ai-prototype-scoring-replay-report",
  "spec-ai-prototype-integration-readiness-gate",
  "spec-codex-integration-review-decision",
  "spec-ai-prototype-app-patch-proposal",
  "spec-ai-prototype-patch-test-readiness-gate",
  "spec-ai-prototype-patch-test-harness-plan",
  "spec-ai-prototype-patch-harness-implementation-proposal",
  "spec-codex-patch-approval-decision",
  "spec-ai-prototype-signed-approval-preflight",
  "spec-ai-prototype-patch-authorization-release-lock",
  "spec-ai-prototype-patch-implementation-work-order",
  "spec-ai-prototype-patch-change-set-preview",
  "spec-ai-generated-package-teacher-review-packet",
  "spec-target-language-audio-approval",
  "spec-ai-generated-package-manifest",
  "spec-ai-generated-package-promotion-checklist",
  "spec-ai-generated-package-release-candidate",
  "spec-ai-generated-package-assembly-readiness",
  "spec-ai-generated-package-assembly-dry-run",
  "spec-ai-generated-package-writer-preflight",
  "spec-ai-generated-package-writer-rollback-drill",
  "spec-ai-generated-package-writer-implementation-readiness",
  "spec-ai-generated-package-writer-module-test-plan",
  "spec-ai-generated-package-writer-test-evidence-packet",
  "spec-ai-generated-package-writer-test-harness-plan",
  "spec-ai-generated-package-writer-test-harness-implementation-proposal",
  "spec-ai-generated-package-writer-harness-implementation-decision",
  "spec-ai-generated-package-writer-route-playlist-write-guard",
  "spec-ai-generated-package-writer-local-companion-package-guard",
  "spec-ai-generated-package-writer-assignment-shell-guard",
  "spec-ai-reward-readiness-gate",
  "spec-ai-generated-publish-readiness-gate",
  "spec-ai-generator-tenant-coverage-gate",
  "spec-ai-generator-review-summary",
  "spec-ai-generator-reviewer-runbook",
  "spec-ai-generator-responsibility-matrix",
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
  "spec-package-adoption-record-preview",
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
  "spec-game-mode-settings-storage",
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

const requiredPackageAdoptionSchemaText = [
  "package_adoption_record_preview",
  "package_adoption_record_preview_id",
  "tenant_package_selection_id",
  "usage_budget_ceiling_id",
  "model_rate_card_snapshot_id",
  "microphone_policy_acceptance_id",
  "transcript_retention_policy_id",
  "backend_selection_gate_id",
  "report_export_plan_id",
  "accepted_adoption_record_storage_allowed",
  "billing_entitlement_write_allowed",
  "premium_feature_activation_allowed",
  "model_call_enablement_allowed",
  "microphone_scoring_enablement_allowed",
  "report_export_enablement_allowed",
  "local_companion_activation_allowed",
];

for (const text of requiredPackageAdoptionSchemaText) {
  requireText(schemaDraft, text, `Backend schema must preserve package adoption storage text: ${text}.`);
  requireText(migrationSpecs, text, `Migration specs must preserve package adoption storage text: ${text}.`);
  requireText(routeVerifier, text, `Active route verifier must keep package adoption storage visible on teacher intake: ${text}.`);
}

const requiredPackageAdoptionSharedContractText = [
  "package-adoption-record-preview",
  "preservesPackageAdoptionRecordPreview: true",
  "requiresPackageCostReview: true",
  "requiresTenantPackageSelection: true",
  "blocksAcceptedAdoptionRecordStorage: true",
  "blocksBillingEntitlementWrite: true",
  "blocksPremiumFeatureActivation: true",
  "blocksMicrophoneScoringEnablement: true",
  "blocksReportExportEnablement: true",
  "blocksLocalCompanionActivation: true",
];

for (const text of requiredPackageAdoptionSharedContractText) {
  requireText(durableRecords, text, `Durable record plan must preserve package adoption contract text: ${text}.`);
  requireText(persistenceAdapter, text, `Persistence adapter must preserve package adoption contract text: ${text}.`);
}

requireText(
  durableRecords,
  "package-adoption-record-preview-record",
  "Durable record plan must preserve the package adoption preview record id.",
);
requireText(
  persistenceAdapter,
  "hosted-package-adoption-record-preview-write",
  "Persistence adapter must preserve the hosted package adoption preview write intent.",
);
requireText(
  persistenceAdapter,
  "local-package-adoption-record-preview-write",
  "Persistence adapter must preserve the local package adoption preview write intent.",
);

for (const text of [
  "preservesPackageAdoptionRecordPreview",
  "requiresPackageCostReview",
  "requiresTenantPackageSelection",
  "blocksAcceptedAdoptionRecordStorage",
  "blocksBillingEntitlementWrite",
  "blocksPremiumFeatureActivation",
  "blocksMicrophoneScoringEnablement",
  "blocksReportExportEnablement",
  "blocksLocalCompanionActivation",
]) {
  requireText(durableRecordValidator, text, `Durable record validator must enforce package adoption flag: ${text}.`);
  requireText(persistenceAdapterValidator, text, `Persistence adapter validator must enforce package adoption flag: ${text}.`);
}

for (const text of [
  "preservesAiGenerationRequestPacket",
  "requiresRequestBuilderReviewPacket",
  "requiresPremiumAiCostGate",
  "requiresAiGenerationSourceEvidence",
  "requiresAiGenerationAudioCoverage",
  "requiresAiGenerationCompatibilitySnapshot",
]) {
  requireText(durableRecordValidator, text, `Durable record validator must enforce AI generation request packet flag: ${text}.`);
  requireText(persistenceAdapterValidator, text, `Persistence adapter validator must enforce AI generation request packet flag: ${text}.`);
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
requireText(schemaDraft, "ai_generation_request_packet", "Backend schema must include AI generation request packets.");
requireText(schemaDraft, "ai_generation_request_packet_id", "Backend schema must preserve AI generation request packet ids.");
requireText(schemaDraft, "request_builder_review_packet_id", "Backend schema must preserve request-builder review packet ids.");
requireText(schemaDraft, "source_evidence_packet_id", "Backend schema must preserve source evidence packet ids.");
requireText(schemaDraft, "premium_ai_cost_gate_id", "Backend schema must preserve premium AI cost gate ids.");
requireText(schemaDraft, "activity_compatibility_snapshot_id", "Backend schema must preserve activity compatibility snapshot ids.");
requireText(schemaDraft, "audio_coverage_requirement_id", "Backend schema must preserve AI request audio coverage requirements.");
requireText(schemaDraft, "media_rights_manifest_id", "Backend schema must preserve media-rights manifest ids.");
requireText(schemaDraft, "live_model_dispatch_allowed", "Backend schema must block live model dispatch.");
requireText(schemaDraft, "model_billing_allowed", "Backend schema must block model billing.");
requireText(schemaDraft, "draft_generation_allowed", "Backend schema must block draft generation.");
requireText(schemaDraft, "ai_generated_game_build_brief", "Backend schema must include AI generated game build briefs.");
requireText(schemaDraft, "ai_generated_game_build_brief_id", "Backend schema must preserve AI generated game build brief ids.");
requireText(schemaDraft, "target_builder", "Backend schema must preserve generated game target builders.");
requireText(schemaDraft, "mode_briefs", "Backend schema must preserve generated game mode briefs.");
requireText(schemaDraft, "parent_engine_binding_id", "Backend schema must preserve generated game parent-engine binding ids.");
requireText(schemaDraft, "standard_event_contract_id", "Backend schema must preserve generated game standard event contract ids.");
requireText(schemaDraft, "audio_cue_manifest_id", "Backend schema must preserve generated game audio cue manifest ids.");
requireText(schemaDraft, "scoring_contract_snapshot", "Backend schema must preserve generated game scoring contracts.");
requireText(schemaDraft, "standalone_game_promotion_allowed", "Backend schema must block standalone game promotion.");
requireText(schemaDraft, "phaser_bypass_allowed", "Backend schema must block Phaser bypass.");
requireText(schemaDraft, "generated_game_route_write_allowed", "Backend schema must block generated game route writes.");
requireText(schemaDraft, "scoring_profile_override_allowed", "Backend schema must block scoring profile overrides.");
requireText(schemaDraft, "ai_external_prototype_task_packet", "Backend schema must include AI external prototype task packets.");
requireText(schemaDraft, "ai_external_prototype_task_packet_id", "Backend schema must preserve AI external prototype task packet ids.");
requireText(schemaDraft, "handoff_state", "Backend schema must preserve external prototype handoff state.");
requireText(schemaDraft, "repository_scope", "Backend schema must preserve external prototype repository scope.");
requireText(schemaDraft, "permitted_handoff_contents", "Backend schema must preserve permitted external handoff contents.");
requireText(schemaDraft, "required_before_handoff", "Backend schema must preserve required-before-handoff checks.");
requireText(schemaDraft, "mode_tasks", "Backend schema must preserve external prototype mode tasks.");
requireText(schemaDraft, "return_evidence_requirements", "Backend schema must preserve external prototype return evidence requirements.");
requireText(schemaDraft, "blocked_handoff_actions", "Backend schema must preserve blocked external handoff actions.");
requireText(schemaDraft, "live_handoff_allowed", "Backend schema must block live external handoff.");
requireText(schemaDraft, "app_file_write_allowed", "Backend schema must block external app file writes.");
requireText(schemaDraft, "external_builder_scoring_authority_allowed", "Backend schema must block external scoring authority.");
requireText(schemaDraft, "route_creation_allowed", "Backend schema must block external route creation.");
requireText(schemaDraft, "reward_inventory_write_allowed", "Backend schema must block external reward writes.");
requireText(schemaDraft, "playlist_creation_allowed", "Backend schema must block external playlist creation.");
requireText(schemaDraft, "package_assembly_allowed", "Backend schema must block external package assembly.");
requireText(schemaDraft, "student_assignment_allowed", "Backend schema must block external student assignment.");
requireText(schemaDraft, "support_language_progress_allowed", "Backend schema must block support-language progress from external tasks.");
requireText(schemaDraft, "prototype_intake_queue_item", "Backend schema must include prototype intake queue items.");
requireText(schemaDraft, "prototype_intake_queue_item_id", "Backend schema must preserve prototype intake queue item ids.");
requireText(schemaDraft, "source_repository", "Backend schema must preserve prototype intake source repositories.");
requireText(schemaDraft, "source_branch_or_snapshot", "Backend schema must preserve prototype intake source snapshots.");
requireText(schemaDraft, "parent_engine_id", "Backend schema must preserve prototype intake parent engine ids.");
requireText(schemaDraft, "target_surface", "Backend schema must preserve prototype intake target surfaces.");
requireText(schemaDraft, "intake_status", "Backend schema must preserve prototype intake status.");
requireText(schemaDraft, "review_route", "Backend schema must preserve prototype intake review routes.");
requireText(schemaDraft, "missing_evidence", "Backend schema must preserve missing prototype intake evidence.");
requireText(schemaDraft, "codex_review_owner", "Backend schema must preserve Codex prototype review ownership.");
requireText(schemaDraft, "direct_import_allowed", "Backend schema must block direct prototype imports.");
requireText(schemaDraft, "active_route_replacement_allowed", "Backend schema must block active route replacement from prototypes.");
requireText(schemaDraft, "scoring_profile_mutation_allowed", "Backend schema must block prototype scoring mutations.");
requireText(schemaDraft, "playlist_write_allowed", "Backend schema must block prototype playlist writes.");
requireText(durableRecords, "prototype-intake-queue-item-record", "Durable record plan must include prototype intake queue item records.");
requireText(durableRecords, "Prototype intake queue item record", "Durable record plan must expose prototype intake queue item labels.");
requireText(durableRecords, "preservesPrototypeIntakeQueueItem: true", "Durable record plan must preserve prototype intake queue items.");
requireText(durableRecords, "requiresPrototypeIntakeRepositoryScope: true", "Durable record plan must require prototype intake repository scope.");
requireText(durableRecords, "requiresPrototypeIntakeReviewRoute: true", "Durable record plan must require prototype intake review routes.");
requireText(durableRecords, "requiresPrototypeIntakeMissingEvidence: true", "Durable record plan must preserve missing prototype evidence.");
requireText(durableRecords, "blocksPrototypeIntakeDirectImport: true", "Durable record plan must block direct prototype imports.");
requireText(durableRecords, "blocksPrototypeIntakeRouteReplacement: true", "Durable record plan must block active route replacement.");
requireText(durableRecords, "prototype-intake-queue-item-boundary", "Persistence boundary plan must include prototype intake queue item boundaries.");
requireText(persistenceAdapter, "hosted-prototype-intake-queue-item-write", "Persistence adapter must include hosted prototype intake queue item writes.");
requireText(persistenceAdapter, "local-prototype-intake-queue-item-write", "Persistence adapter must include local prototype intake queue item writes.");
requireText(persistenceAdapter, "preservesPrototypeIntakeQueueItem: true", "Persistence adapter must preserve prototype intake queue items.");
requireText(persistenceAdapter, "requiresPrototypeIntakeRepositoryScope: true", "Persistence adapter must require prototype intake repository scope.");
requireText(persistenceAdapter, "requiresPrototypeIntakeReviewRoute: true", "Persistence adapter must require prototype intake review routes.");
requireText(persistenceAdapter, "requiresPrototypeIntakeMissingEvidence: true", "Persistence adapter must preserve missing prototype evidence.");
requireText(persistenceAdapter, "blocksPrototypeIntakeDirectImport: true", "Persistence adapter must block direct prototype imports.");
requireText(persistenceAdapter, "blocksPrototypeIntakeRouteReplacement: true", "Persistence adapter must block active route replacement.");
requireText(durableRecordValidator, "preservesPrototypeIntakeQueueItem", "Durable record validator must protect prototype intake queue items.");
requireText(persistenceAdapterValidator, "preservesPrototypeIntakeQueueItem", "Persistence adapter validator must protect prototype intake queue items.");
requireText(schemaDraft, "ai_external_task_export_readiness_gate", "Backend schema must include AI external task export readiness gates.");
requireText(schemaDraft, "ai_external_task_export_readiness_gate_id", "Backend schema must preserve AI external task export readiness gate ids.");
requireText(schemaDraft, "export_channels", "Backend schema must preserve external task export channels.");
requireText(schemaDraft, "readiness_checks", "Backend schema must preserve external task export readiness checks.");
requireText(schemaDraft, "blocked_export_actions", "Backend schema must preserve blocked external task export actions.");
requireText(schemaDraft, "reviewer_identity_required", "Backend schema must require reviewer identity before external task export.");
requireText(schemaDraft, "evidence_storage_required", "Backend schema must require evidence storage before external task export.");
requireText(schemaDraft, "external_repository_policy_required", "Backend schema must require external repository policy before external task export.");
requireText(schemaDraft, "return_review_intake_required", "Backend schema must require return-review intake before external task export.");
requireText(schemaDraft, "codex_owner_confirmation_required", "Backend schema must require Codex owner confirmation before external task export.");
requireText(schemaDraft, "task_export_allowed", "Backend schema must block external task export.");
requireText(schemaDraft, "prompt_copy_allowed", "Backend schema must block prompt copy actions.");
requireText(schemaDraft, "repository_issue_creation_allowed", "Backend schema must block repository issue creation.");
requireText(schemaDraft, "archive_download_allowed", "Backend schema must block archive downloads.");
requireText(schemaDraft, "student_facing_pathway_allowed", "Backend schema must block student-facing pathways from external task export.");
requireText(schemaDraft, "ai_prototype_return_review", "Backend schema must include AI prototype return reviews.");
requireText(schemaDraft, "ai_prototype_return_review_id", "Backend schema must preserve AI prototype return review ids.");
requireText(schemaDraft, "ai_generated_game_build_brief_id", "Backend schema must link return reviews to generated game build briefs.");
requireText(schemaDraft, "returned_artifacts", "Backend schema must preserve returned prototype artifacts.");
requireText(schemaDraft, "required_evidence", "Backend schema must preserve prototype return evidence requirements.");
requireText(schemaDraft, "parent_engine_wrapper_review", "Backend schema must preserve parent-engine wrapper review.");
requireText(schemaDraft, "json_fixture_conformance", "Backend schema must preserve JSON fixture conformance.");
requireText(schemaDraft, "standard_event_replay", "Backend schema must preserve standard event replay.");
requireText(schemaDraft, "audio_cue_coverage_review", "Backend schema must preserve audio cue coverage review.");
requireText(schemaDraft, "deterministic_scoring_review", "Backend schema must preserve deterministic scoring review.");
requireText(schemaDraft, "mobile_accessibility_review", "Backend schema must preserve mobile accessibility review.");
requireText(schemaDraft, "white_label_fit_review", "Backend schema must preserve white-label fit review.");
requireText(schemaDraft, "production_merge_allowed", "Backend schema must block prototype production merge.");
requireText(schemaDraft, "audio_manifest_mutation_allowed", "Backend schema must block audio manifest mutation.");
requireText(schemaDraft, "student_facing_preview_allowed", "Backend schema must block student-facing prototype preview.");
requireText(schemaDraft, "ai_prototype_integration_plan", "Backend schema must include AI prototype integration plans.");
requireText(schemaDraft, "ai_prototype_integration_plan_id", "Backend schema must preserve AI prototype integration plan ids.");
requireText(schemaDraft, "ai_prototype_return_review_id", "Backend schema must link integration plans to prototype return reviews.");
requireText(schemaDraft, "integration_lanes", "Backend schema must preserve prototype integration lanes.");
requireText(schemaDraft, "test_harness_requirements", "Backend schema must preserve prototype integration test harness requirements.");
requireText(schemaDraft, "next_review_records", "Backend schema must preserve prototype integration next review records.");
requireText(schemaDraft, "mode_integration_plans", "Backend schema must preserve mode integration plans.");
requireText(schemaDraft, "direct_app_import_allowed", "Backend schema must block direct app imports.");
requireText(schemaDraft, "game_sequence_mutation_allowed", "Backend schema must block game sequence mutations.");
requireText(schemaDraft, "package_promotion_allowed", "Backend schema must block package promotion.");
requireText(schemaDraft, "ai_prototype_wrapper_adapter_review", "Backend schema must include AI prototype wrapper adapter reviews.");
requireText(
  schemaDraft,
  "ai_prototype_wrapper_adapter_review_id",
  "Backend schema must preserve AI prototype wrapper adapter review ids.",
);
requireText(schemaDraft, "parent_engine_adapter_boundary", "Backend schema must preserve parent-engine adapter boundaries.");
requireText(schemaDraft, "fixture_input_contract", "Backend schema must preserve wrapper fixture input contracts.");
requireText(schemaDraft, "standard_event_output_contract", "Backend schema must preserve standard event output contracts.");
requireText(schemaDraft, "state_ownership_rules", "Backend schema must preserve wrapper state ownership rules.");
requireText(schemaDraft, "wrapper_evidence", "Backend schema must preserve wrapper evidence.");
requireText(schemaDraft, "rejection_triggers", "Backend schema must preserve wrapper rejection triggers.");
requireText(schemaDraft, "event_contract_bypass_allowed", "Backend schema must block event contract bypass.");
requireText(schemaDraft, "tenant_hard_coding_allowed", "Backend schema must block tenant hard-coding.");
requireText(schemaDraft, "score_authority_allowed", "Backend schema must block wrapper score authority.");
requireText(schemaDraft, "route_state_ownership_allowed", "Backend schema must block route state ownership.");
requireText(schemaDraft, "audio_manifest_authority_allowed", "Backend schema must block audio manifest authority.");
requireText(schemaDraft, "reward_inventory_write_allowed", "Backend schema must block reward inventory writes.");
requireText(
  schemaDraft,
  "support_language_progress_trigger_allowed",
  "Backend schema must block support-language progress triggers.",
);
requireText(schemaDraft, "ai_prototype_fixture_replay_report", "Backend schema must include AI prototype fixture replay reports.");
requireText(
  schemaDraft,
  "ai_prototype_fixture_replay_report_id",
  "Backend schema must preserve AI prototype fixture replay report ids.",
);
requireText(schemaDraft, "reviewed_unit_json_fixture_id", "Backend schema must preserve reviewed unit JSON fixture ids.");
requireText(schemaDraft, "fixture_coverage", "Backend schema must preserve fixture coverage.");
requireText(schemaDraft, "input_assertions", "Backend schema must preserve fixture replay input assertions.");
requireText(schemaDraft, "output_assertions", "Backend schema must preserve fixture replay output assertions.");
requireText(schemaDraft, "replay_evidence", "Backend schema must preserve fixture replay evidence.");
requireText(schemaDraft, "failure_triggers", "Backend schema must preserve fixture replay failure triggers.");
requireText(schemaDraft, "hard_coded_unit_text_allowed", "Backend schema must block hard-coded unit text.");
requireText(
  schemaDraft,
  "target_language_progress_trigger_required",
  "Backend schema must require target-language progress triggers.",
);
requireText(schemaDraft, "ai_prototype_event_replay_report", "Backend schema must include AI prototype event replay reports.");
requireText(
  schemaDraft,
  "ai_prototype_event_replay_report_id",
  "Backend schema must preserve AI prototype event replay report ids.",
);
requireText(schemaDraft, "standard_event_contract_id", "Backend schema must preserve standard event contract ids.");
requireText(schemaDraft, "progress_event_acceptance_map_id", "Backend schema must preserve progress event acceptance map ids.");
requireText(schemaDraft, "standard_event_coverage", "Backend schema must preserve standard event coverage.");
requireText(schemaDraft, "required_event_order", "Backend schema must preserve required event order.");
requireText(schemaDraft, "allowed_payload_fields", "Backend schema must preserve allowed event payload fields.");
requireText(schemaDraft, "accepted_progress_effects", "Backend schema must preserve accepted progress effects.");
requireText(schemaDraft, "hidden_progress_stream_allowed", "Backend schema must block hidden progress streams.");
requireText(schemaDraft, "report_export_allowed", "Backend schema must block report export from event replay reports.");
requireText(schemaDraft, "playlist_write_allowed", "Backend schema must block playlist writes from event replay reports.");
requireText(schemaDraft, "ai_prototype_audio_coverage_report", "Backend schema must include AI prototype audio coverage reports.");
requireText(
  schemaDraft,
  "ai_prototype_audio_coverage_report_id",
  "Backend schema must preserve AI prototype audio coverage report ids.",
);
requireText(schemaDraft, "audio_cue_manifest_id", "Backend schema must preserve prototype audio cue manifest ids.");
requireText(
  schemaDraft,
  "package_game_audio_coverage_id",
  "Backend schema must preserve prototype package game audio coverage ids.",
);
requireText(
  schemaDraft,
  "background_media_policy_binding_id",
  "Backend schema must preserve prototype background media policy binding ids.",
);
requireText(schemaDraft, "required_cue_families", "Backend schema must preserve prototype required audio cue families.");
requireText(schemaDraft, "target_language_audio_checks", "Backend schema must preserve target-language audio checks.");
requireText(schemaDraft, "control_audio_checks", "Backend schema must preserve control audio checks.");
requireText(schemaDraft, "support_language_audio_rules", "Backend schema must preserve support-language audio rules.");
requireText(schemaDraft, "audio_replay_evidence", "Backend schema must preserve audio replay evidence.");
requireText(schemaDraft, "generated_voice_call_allowed", "Backend schema must block generated voice calls.");
requireText(schemaDraft, "voice_api_cost_allowed", "Backend schema must block voice API cost.");
requireText(schemaDraft, "audio_manifest_mutation_allowed", "Backend schema must block prototype audio manifest mutation.");
requireText(schemaDraft, "media_only_mastery_allowed", "Backend schema must block media-only mastery.");
requireText(
  schemaDraft,
  "package_audio_complete_marker_allowed",
  "Backend schema must block package audio-complete markers.",
);
requireText(
  schemaDraft,
  "ai_prototype_mobile_accessibility_report",
  "Backend schema must include AI prototype mobile accessibility reports.",
);
requireText(
  schemaDraft,
  "ai_prototype_mobile_accessibility_report_id",
  "Backend schema must preserve AI prototype mobile accessibility report ids.",
);
requireText(
  schemaDraft,
  "activity_compatibility_snapshot_id",
  "Backend schema must preserve prototype activity compatibility snapshot ids.",
);
requireText(schemaDraft, "template_rendering_profile_id", "Backend schema must preserve template rendering profile ids.");
requireText(schemaDraft, "font_accessibility_profile_id", "Backend schema must preserve font accessibility profile ids.");
requireText(schemaDraft, "viewport_evidence", "Backend schema must preserve mobile viewport evidence.");
requireText(schemaDraft, "touch_target_checks", "Backend schema must preserve touch target checks.");
requireText(schemaDraft, "keyboard_focus_checks", "Backend schema must preserve keyboard and focus checks.");
requireText(schemaDraft, "readable_text_checks", "Backend schema must preserve readable text checks.");
requireText(schemaDraft, "visual_stability_checks", "Backend schema must preserve visual stability checks.");
requireText(schemaDraft, "wrapper_control_checks", "Backend schema must preserve wrapper control checks.");
requireText(schemaDraft, "accessibility_waiver_allowed", "Backend schema must block accessibility waivers.");
requireText(schemaDraft, "student_facing_preview_allowed", "Backend schema must block student-facing previews.");
requireText(
  schemaDraft,
  "ai_prototype_scoring_replay_report",
  "Backend schema must include AI prototype scoring replay reports.",
);
requireText(
  schemaDraft,
  "ai_prototype_scoring_replay_report_id",
  "Backend schema must preserve AI prototype scoring replay report ids.",
);
requireText(
  schemaDraft,
  "game_scoring_profile_snapshot_id",
  "Backend schema must preserve prototype scoring profile snapshot ids.",
);
requireText(
  schemaDraft,
  "progress_event_acceptance_map_id",
  "Backend schema must preserve prototype progress event acceptance map ids.",
);
requireText(schemaDraft, "collection_unlock_binding_id", "Backend schema must preserve collection unlock binding ids.");
requireText(schemaDraft, "deterministic_scoring_replay", "Backend schema must preserve deterministic scoring replay evidence.");
requireText(schemaDraft, "score_replay_checks", "Backend schema must preserve score replay checks.");
requireText(schemaDraft, "mastery_replay_checks", "Backend schema must preserve mastery replay checks.");
requireText(schemaDraft, "reward_boundary_checks", "Backend schema must preserve reward boundary checks.");
requireText(schemaDraft, "scoring_profile_override_allowed", "Backend schema must block scoring profile overrides.");
requireText(schemaDraft, "star_dust_write_allowed", "Backend schema must block Star Dust writes.");
requireText(schemaDraft, "random_reward_allowed", "Backend schema must block random rewards.");
requireText(schemaDraft, "support_language_mastery_allowed", "Backend schema must block support-language mastery.");
requireText(
  schemaDraft,
  "ai_prototype_integration_readiness_gate",
  "Backend schema must include AI prototype integration readiness gates.",
);
requireText(
  schemaDraft,
  "ai_prototype_integration_readiness_gate_id",
  "Backend schema must preserve AI prototype integration readiness gate ids.",
);
requireText(
  schemaDraft,
  "codex_integration_review_decision_id",
  "Backend schema must preserve Codex integration review decision ids.",
);
requireText(schemaDraft, "evidence_readiness_checks", "Backend schema must preserve evidence readiness checks.");
requireText(
  schemaDraft,
  "all_prototype_evidence_reviewed",
  "Backend schema must preserve all-evidence-reviewed state.",
);
requireText(schemaDraft, "app_patch_allowed", "Backend schema must block app patches.");
requireText(schemaDraft, "direct_import_allowed", "Backend schema must block direct imports.");
requireText(schemaDraft, "student_facing_route_allowed", "Backend schema must block student-facing routes.");
requireText(
  schemaDraft,
  "star_dust_reward_write_allowed",
  "Backend schema must block Star Dust and reward writes.",
);
requireText(schemaDraft, "codex_integration_review_decision", "Backend schema must include Codex integration review decisions.");
requireText(
  schemaDraft,
  "codex_integration_review_decision_id",
  "Backend schema must preserve Codex integration review decision ids.",
);
requireText(
  schemaDraft,
  "ai_prototype_integration_readiness_gate_id",
  "Backend schema must link Codex decisions to AI prototype integration readiness gates.",
);
requireText(
  schemaDraft,
  "manual_codex_review_required",
  "Backend schema must preserve manual Codex review requirements.",
);
requireText(schemaDraft, "decision_recorded", "Backend schema must preserve Codex decision recorded state.");
requireText(
  schemaDraft,
  "app_patch_generation_allowed",
  "Backend schema must block Codex app patch generation.",
);
requireText(
  schemaDraft,
  "scoring_profile_mutation_allowed",
  "Backend schema must block Codex scoring profile mutations.",
);
requireText(schemaDraft, "ai_prototype_app_patch_proposal", "Backend schema must include AI prototype app patch proposals.");
requireText(schemaDraft, "ai_prototype_app_patch_proposal_id", "Backend schema must preserve AI prototype app patch proposal ids.");
requireText(
  schemaDraft,
  "ai_prototype_patch_test_readiness_gate",
  "Backend schema must include AI prototype patch test readiness gates.",
);
requireText(
  schemaDraft,
  "ai_prototype_patch_test_readiness_gate_id",
  "Backend schema must preserve AI prototype patch test readiness gate ids.",
);
requireText(
  schemaDraft,
  "ai_prototype_patch_test_harness_plan",
  "Backend schema must include AI prototype patch test harness plans.",
);
requireText(
  schemaDraft,
  "ai_prototype_patch_test_harness_plan_id",
  "Backend schema must preserve AI prototype patch test harness plan ids.",
);
requireText(
  schemaDraft,
  "ai_prototype_patch_harness_implementation_proposal",
  "Backend schema must include AI prototype patch harness implementation proposals.",
);
requireText(
  schemaDraft,
  "ai_prototype_patch_harness_implementation_proposal_id",
  "Backend schema must preserve AI prototype patch harness implementation proposal ids.",
);
requireText(schemaDraft, "implementation_boundaries", "Backend schema must preserve harness implementation boundaries.");
requireText(schemaDraft, "required_review_gates", "Backend schema must preserve harness implementation review gates.");
requireText(schemaDraft, "dry_run_only_checks", "Backend schema must preserve dry-run-only harness checks.");
requireText(schemaDraft, "blocked_implementation_actions", "Backend schema must preserve blocked harness implementation actions.");
requireText(schemaDraft, "harness_implementation_allowed", "Backend schema must block harness implementation.");
requireText(schemaDraft, "codex_patch_approval_decision", "Backend schema must include Codex patch approval decisions.");
requireText(
  schemaDraft,
  "codex_patch_approval_decision_id",
  "Backend schema must preserve Codex patch approval decision ids.",
);
requireText(schemaDraft, "patch_scope_reviewed", "Backend schema must preserve patch scope review state.");
requireText(schemaDraft, "approval_evidence_checks", "Backend schema must preserve patch approval evidence checks.");
requireText(schemaDraft, "blocked_patch_actions", "Backend schema must preserve blocked Codex patch approval actions.");
requireText(
  schemaDraft,
  "ai_prototype_signed_approval_preflight",
  "Backend schema must include AI prototype signed approval preflights.",
);
requireText(
  schemaDraft,
  "signed_approval_preflight_id",
  "Backend schema must preserve signed approval preflight ids.",
);
requireText(schemaDraft, "required_identity_lanes", "Backend schema must preserve approval identity lanes.");
requireText(schemaDraft, "scope_locks", "Backend schema must preserve signed approval scope locks.");
requireText(
  schemaDraft,
  "approval_record_draft_fields",
  "Backend schema must preserve approval record draft fields.",
);
requireText(schemaDraft, "cannot_approve_while", "Backend schema must preserve cannot-approve blockers.");
requireText(schemaDraft, "blocked_approval_actions", "Backend schema must preserve blocked approval actions.");
requireText(schemaDraft, "approve_button_allowed", "Backend schema must block approve buttons.");
requireText(schemaDraft, "patch_authorization_allowed", "Backend schema must block patch authorization.");
requireText(
  schemaDraft,
  "ai_prototype_patch_authorization_release_lock",
  "Backend schema must include AI prototype patch authorization release locks.",
);
requireText(
  schemaDraft,
  "patch_authorization_release_lock_id",
  "Backend schema must preserve patch authorization release lock ids.",
);
requireText(schemaDraft, "required_release_locks", "Backend schema must preserve patch authorization release locks.");
requireText(schemaDraft, "authorization_scope", "Backend schema must preserve patch authorization scope.");
requireText(schemaDraft, "forbidden_until_unlocked", "Backend schema must preserve forbidden-until-unlocked blockers.");
requireText(schemaDraft, "release_evidence", "Backend schema must preserve patch release evidence.");
requireText(
  schemaDraft,
  "ai_prototype_patch_implementation_work_order",
  "Backend schema must include AI prototype patch implementation work orders.",
);
requireText(
  schemaDraft,
  "patch_implementation_work_order_id",
  "Backend schema must preserve patch implementation work order ids.",
);
requireText(schemaDraft, "required_before_work", "Backend schema must preserve patch implementation required-before-work records.");
requireText(schemaDraft, "allowed_future_file_groups", "Backend schema must preserve patch implementation file groups.");
requireText(schemaDraft, "dry_run_verification_order", "Backend schema must preserve patch implementation dry-run order.");
requireText(schemaDraft, "rollback_plan", "Backend schema must preserve patch implementation rollback plans.");
requireText(schemaDraft, "work_order_execution_allowed", "Backend schema must block work order execution.");
requireText(
  schemaDraft,
  "ai_prototype_patch_change_set_preview",
  "Backend schema must include AI prototype patch change set previews.",
);
requireText(schemaDraft, "patch_change_set_preview_id", "Backend schema must preserve patch change set preview ids.");
requireText(schemaDraft, "planned_file_changes", "Backend schema must preserve patch change set planned file changes.");
requireText(schemaDraft, "invariant_checks", "Backend schema must preserve patch change set invariant checks.");
requireText(schemaDraft, "review_blockers", "Backend schema must preserve patch change set review blockers.");
requireText(schemaDraft, "blocked_change_set_actions", "Backend schema must preserve blocked patch change set actions.");
requireText(schemaDraft, "apply_patch_allowed", "Backend schema must block apply-patch actions.");
requireText(schemaDraft, "generated_file_write_allowed", "Backend schema must block generated file writes.");
requireText(schemaDraft, "proposed_file_scope", "Backend schema must preserve prototype app patch proposed file scope.");
requireText(schemaDraft, "required_before_patch", "Backend schema must preserve prototype app patch pre-patch gates.");
requireText(schemaDraft, "required_test_gates", "Backend schema must preserve prototype app patch test gates.");
requireText(schemaDraft, "rollback_requirements", "Backend schema must preserve prototype app patch rollback requirements.");
requireText(schemaDraft, "blocked_patch_actions", "Backend schema must preserve blocked prototype app patch actions.");
requireText(schemaDraft, "app_file_write_allowed", "Backend schema must block app file writes.");
requireText(schemaDraft, "reviewer_identity_signature_gate_id", "Backend schema must link app patch proposals to reviewer identity gates.");
requireText(schemaDraft, "package_publish_gate_id", "Backend schema must link app patch proposals to release-control gates.");
requireText(schemaDraft, "target_language_audio_approval", "Backend schema must include target-language audio approvals.");
requireText(
  schemaDraft,
  "target_language_audio_approval_id",
  "Backend schema must preserve target-language audio approval ids.",
);
requireText(schemaDraft, "cue_review_items", "Backend schema must preserve target-language audio cue review items.");
requireText(schemaDraft, "progress_boundaries", "Backend schema must preserve target-language audio progress boundaries.");
requireText(schemaDraft, "audio_approval_capture_allowed", "Backend schema must block audio approval capture.");
requireText(schemaDraft, "voice_generation_allowed", "Backend schema must block voice generation.");
requireText(schemaDraft, "speech_api_billing_allowed", "Backend schema must block speech API billing.");
requireText(schemaDraft, "package_audio_complete_allowed", "Backend schema must block package audio-complete markers.");
requireText(schemaDraft, "media_only_progress_allowed", "Backend schema must block media-only progress.");
requireText(
  schemaDraft,
  "ai_generated_package_teacher_review_packet",
  "Backend schema must include AI generated package teacher review packets.",
);
requireText(
  schemaDraft,
  "ai_generated_package_teacher_review_packet_id",
  "Backend schema must preserve generated package teacher review packet ids.",
);
requireText(schemaDraft, "decision_lanes", "Backend schema must preserve generated teacher review decision lanes.");
requireText(schemaDraft, "missing_evidence", "Backend schema must preserve generated teacher review missing evidence.");
requireText(
  schemaDraft,
  "approval_capture_allowed",
  "Backend schema must preserve generated teacher review approval-capture blocks.",
);
requireText(
  schemaDraft,
  "support_language_progress_allowed",
  "Backend schema must preserve generated teacher review support-language progress blocks.",
);
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
requireText(
  schemaDraft,
  "ai_generated_package_promotion_checklist",
  "Backend schema must include AI generated package promotion checklists.",
);
requireText(
  schemaDraft,
  "ai_generated_package_promotion_checklist_id",
  "Backend schema must preserve AI generated package promotion checklist ids.",
);
requireText(schemaDraft, "ai_generator_lineage_map_id", "Backend schema must preserve generated package lineage map ids.");
requireText(
  schemaDraft,
  "package_game_audio_coverage_id",
  "Backend schema must preserve generated package game audio coverage ids.",
);
requireText(schemaDraft, "promotion_checklist_steps", "Backend schema must preserve generated package promotion checklist steps.");
requireText(schemaDraft, "blocked_promotion_actions", "Backend schema must preserve generated package promotion action blocks.");
requireText(
  schemaDraft,
  "generated_package_promotion_allowed",
  "Backend schema must block generated package promotion.",
);
requireText(
  schemaDraft,
  "support_language_promotion_allowed",
  "Backend schema must block support-language-only generated package promotion.",
);
requireText(
  schemaDraft,
  "ai_generated_package_release_candidate",
  "Backend schema must include AI generated package release candidates.",
);
requireText(
  schemaDraft,
  "ai_generated_package_release_candidate_id",
  "Backend schema must preserve AI generated package release candidate ids.",
);
requireText(schemaDraft, "private_library_target", "Backend schema must preserve generated package private library targets.");
requireText(schemaDraft, "future_tenant_library_item_id", "Backend schema must preserve future tenant library item ids.");
requireText(
  schemaDraft,
  "future_package_release_candidate_id",
  "Backend schema must preserve future package release candidate ids.",
);
requireText(schemaDraft, "candidate_signals", "Backend schema must preserve generated package release candidate signals.");
requireText(schemaDraft, "candidate_records", "Backend schema must preserve generated package release candidate records.");
requireText(schemaDraft, "blocked_release_actions", "Backend schema must preserve generated package release action blocks.");
requireText(
  schemaDraft,
  "generated_package_library_publish_allowed",
  "Backend schema must block generated package library publish.",
);
requireText(schemaDraft, "release_candidate_write_allowed", "Backend schema must block release candidate writes.");
requireText(schemaDraft, "tenant_library_item_write_allowed", "Backend schema must block tenant library item writes.");
requireText(schemaDraft, "student_facing_release_allowed", "Backend schema must block student-facing release.");
requireText(schemaDraft, "local_bundle_release_allowed", "Backend schema must block local bundle release.");
requireText(schemaDraft, "support_language_release_allowed", "Backend schema must block support-language-only release.");
requireText(
  schemaDraft,
  "ai_generated_package_assembly_readiness",
  "Backend schema must include AI generated package assembly readiness.",
);
requireText(
  schemaDraft,
  "ai_generated_package_assembly_readiness_id",
  "Backend schema must preserve AI generated package assembly readiness ids.",
);
requireText(schemaDraft, "assembly_readiness_lanes", "Backend schema must preserve package assembly readiness lanes.");
requireText(schemaDraft, "blocked_assembly_actions", "Backend schema must preserve package assembly action blocks.");
requireText(schemaDraft, "media_rights_evidence_id", "Backend schema must require media rights evidence.");
requireText(schemaDraft, "package_game_audio_coverage_id", "Backend schema must require target-language audio evidence.");
requireText(schemaDraft, "support_language_assembly_allowed", "Backend schema must block support-language-only assembly.");
requireText(
  schemaDraft,
  "ai_generated_package_assembly_dry_run",
  "Backend schema must include AI generated package assembly dry runs.",
);
requireText(
  schemaDraft,
  "ai_generated_package_assembly_dry_run_id",
  "Backend schema must preserve AI generated package assembly dry-run ids.",
);
requireText(schemaDraft, "artifact_map", "Backend schema must preserve generated package artifact maps.");
requireText(schemaDraft, "source_record_ids", "Backend schema must preserve generated package dry-run source records.");
requireText(schemaDraft, "blocked_dry_run_actions", "Backend schema must preserve generated package dry-run action blocks.");
requireText(schemaDraft, "package_json_write_allowed", "Backend schema must block package JSON writes.");
requireText(
  schemaDraft,
  "ai_generated_package_writer_preflight",
  "Backend schema must include AI generated package writer preflights.",
);
requireText(
  schemaDraft,
  "ai_generated_package_writer_preflight_id",
  "Backend schema must preserve AI generated package writer preflight ids.",
);
requireText(schemaDraft, "writer_targets", "Backend schema must preserve generated package writer targets.");
requireText(schemaDraft, "required_evidence", "Backend schema must preserve writer preflight required evidence.");
requireText(schemaDraft, "blocked_writer_actions", "Backend schema must preserve generated package writer action blocks.");
requireText(schemaDraft, "writer_execution_allowed", "Backend schema must block writer execution.");
requireText(schemaDraft, "support_language_writer_allowed", "Backend schema must block support-language-only writers.");
requireText(
  schemaDraft,
  "ai_generated_package_writer_rollback_drill",
  "Backend schema must include AI generated package writer rollback drills.",
);
requireText(
  schemaDraft,
  "ai_generated_package_writer_rollback_drill_id",
  "Backend schema must preserve AI generated package writer rollback drill ids.",
);
requireText(schemaDraft, "pre_write_snapshots", "Backend schema must preserve generated package pre-write snapshots.");
requireText(schemaDraft, "post_write_verification", "Backend schema must preserve generated package post-write verification.");
requireText(schemaDraft, "rollback_steps", "Backend schema must preserve generated package rollback steps.");
requireText(schemaDraft, "blocked_rollback_actions", "Backend schema must preserve generated package rollback action blocks.");
requireText(schemaDraft, "rollback_execution_allowed", "Backend schema must block rollback execution.");
requireText(schemaDraft, "production_qr_redirect_mutation_allowed", "Backend schema must block production QR redirect mutation.");
requireText(
  schemaDraft,
  "support_language_rollback_evidence_allowed",
  "Backend schema must block support-language-only rollback evidence.",
);
requireText(
  schemaDraft,
  "ai_generated_package_writer_implementation_readiness",
  "Backend schema must include AI generated package writer implementation readiness gates.",
);
requireText(
  schemaDraft,
  "ai_generated_package_writer_implementation_readiness_id",
  "Backend schema must preserve AI generated package writer implementation readiness ids.",
);
requireText(schemaDraft, "module_plan", "Backend schema must preserve package writer module plans.");
requireText(schemaDraft, "required_test_gates", "Backend schema must preserve package writer required test gates.");
requireText(schemaDraft, "release_controls", "Backend schema must preserve package writer release controls.");
requireText(schemaDraft, "blocked_implementation_actions", "Backend schema must preserve package writer implementation action blocks.");
requireText(schemaDraft, "package_writer_implementation_allowed", "Backend schema must block package writer implementation.");
requireText(schemaDraft, "generated_app_file_write_allowed", "Backend schema must block generated app file writes.");
requireText(schemaDraft, "support_language_implementation_evidence_allowed", "Backend schema must block support-language-only implementation evidence.");
requireText(schemaDraft, "ai_generated_package_writer_module_test_plan", "Backend schema must include AI generated package writer module test plans.");
requireText(
  schemaDraft,
  "ai_generated_package_writer_module_test_plan_id",
  "Backend schema must preserve AI generated package writer module test plan ids.",
);
requireText(schemaDraft, "module_test_suites", "Backend schema must preserve package writer module test suites.");
requireText(schemaDraft, "required_fixtures", "Backend schema must preserve package writer required fixtures.");
requireText(schemaDraft, "required_assertions", "Backend schema must preserve package writer required assertions.");
requireText(schemaDraft, "required_evidence", "Backend schema must preserve package writer required evidence.");
requireText(schemaDraft, "blocked_test_actions", "Backend schema must preserve package writer blocked test actions.");
requireText(schemaDraft, "package_writer_test_execution_allowed", "Backend schema must block package writer test execution.");
requireText(schemaDraft, "writer_mutation_browser_run_allowed", "Backend schema must block writer mutation browser runs.");
requireText(schemaDraft, "app_file_patch_allowed", "Backend schema must block app file patches.");
requireText(schemaDraft, "support_language_test_pass_allowed", "Backend schema must block support-language-only test passes.");
requireText(schemaDraft, "ai_generated_package_writer_test_evidence_packet", "Backend schema must include AI generated package writer test evidence packets.");
requireText(
  schemaDraft,
  "ai_generated_package_writer_test_evidence_packet_id",
  "Backend schema must preserve AI generated package writer test evidence packet ids.",
);
requireText(schemaDraft, "evidence_lanes", "Backend schema must preserve package writer evidence lanes.");
requireText(schemaDraft, "source_records", "Backend schema must preserve package writer evidence source records.");
requireText(schemaDraft, "acceptance_checks", "Backend schema must preserve package writer evidence acceptance checks.");
requireText(schemaDraft, "missing_evidence", "Backend schema must preserve package writer missing evidence.");
requireText(schemaDraft, "blocked_evidence_actions", "Backend schema must preserve package writer blocked evidence actions.");
requireText(schemaDraft, "evidence_upload_allowed", "Backend schema must block evidence upload.");
requireText(schemaDraft, "signed_approval_capture_allowed", "Backend schema must block signed approval capture.");
requireText(schemaDraft, "support_language_evidence_pass_allowed", "Backend schema must block support-language-only evidence passes.");
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
requireText(schemaDraft, "ai_generated_publish_readiness_gate", "Backend schema must include AI generated publish readiness gates.");
requireText(
  schemaDraft,
  "ai_generated_publish_readiness_gate_id",
  "Backend schema must preserve AI generated publish readiness gate ids.",
);
requireText(
  schemaDraft,
  "ai_generated_package_manifest_id",
  "Backend schema must preserve generated publish manifest ids.",
);
requireText(
  schemaDraft,
  "ai_verifier_submission_packet_id",
  "Backend schema must preserve generated publish verifier packet ids.",
);
requireText(schemaDraft, "package_publish_gate_id", "Backend schema must preserve generated publish package gate ids.");
requireText(schemaDraft, "package_approval_ledger_id", "Backend schema must preserve generated publish approval ledger ids.");
requireText(schemaDraft, "future_student_route", "Backend schema must preserve preview-only generated student routes.");
requireText(schemaDraft, "publish_readiness_checks", "Backend schema must preserve generated publish readiness checks.");
requireText(schemaDraft, "blocked_publish_actions", "Backend schema must preserve generated publish action blocks.");
requireText(schemaDraft, "student_route_publish_allowed", "Backend schema must block generated student route publishing.");
requireText(schemaDraft, "ai_generator_tenant_coverage_gate", "Backend schema must include AI generator tenant coverage gates.");
requireText(
  schemaDraft,
  "ai_generator_tenant_coverage_gate_id",
  "Backend schema must preserve AI generator tenant coverage gate ids.",
);
requireText(schemaDraft, "ai_game_generator_request_id", "Backend schema must preserve generator request ids.");
requireText(schemaDraft, "ai_prompt_package_id", "Backend schema must preserve prompt package ids.");
requireText(schemaDraft, "premium_ai_cost_gate_id", "Backend schema must preserve premium AI cost gate ids.");
requireText(schemaDraft, "ai_generation_request_packet_id", "Backend schema must preserve AI request builder packet ids.");
requireText(schemaDraft, "tenant_coverage_lanes", "Backend schema must preserve tenant coverage lanes.");
requireText(schemaDraft, "covered_record_count", "Backend schema must preserve covered generator record counts.");
requireText(schemaDraft, "partial_record_count", "Backend schema must preserve partial generator record counts.");
requireText(schemaDraft, "missing_record_count", "Backend schema must preserve missing generator record counts.");
requireText(schemaDraft, "blocked_generator_actions", "Backend schema must preserve blocked generator actions.");
requireText(schemaDraft, "next_tenant_requirements", "Backend schema must preserve next tenant generator requirements.");
requireText(schemaDraft, "generator_request_submission_allowed", "Backend schema must block generator request submission.");
requireText(schemaDraft, "live_model_call_allowed", "Backend schema must block live model calls.");
requireText(schemaDraft, "verifier_submission_allowed", "Backend schema must block verifier submission.");
requireText(schemaDraft, "ai_generator_review_summary", "Backend schema must include AI generator review summaries.");
requireText(
  schemaDraft,
  "ai_generator_review_summary_id",
  "Backend schema must preserve AI generator review summary ids.",
);
requireText(schemaDraft, "section_readiness_rollup", "Backend schema must preserve generator section readiness.");
requireText(schemaDraft, "primary_blockers", "Backend schema must preserve generator primary blockers.");
requireText(schemaDraft, "next_required_records", "Backend schema must preserve generator next required records.");
requireText(schemaDraft, "source_record_links", "Backend schema must preserve generator source record links.");
requireText(schemaDraft, "app_patch_allowed", "Backend schema must block app patch permission from summary records.");
requireText(schemaDraft, "ai_generator_reviewer_runbook", "Backend schema must include AI generator reviewer runbooks.");
requireText(
  schemaDraft,
  "ai_generator_reviewer_runbook_id",
  "Backend schema must preserve AI generator reviewer runbook ids.",
);
requireText(schemaDraft, "human_review_order", "Backend schema must preserve generator human review order.");
requireText(schemaDraft, "standing_rules", "Backend schema must preserve generator reviewer standing rules.");
requireText(schemaDraft, "evidence_lanes", "Backend schema must preserve generator reviewer evidence lanes.");
requireText(schemaDraft, "required_record_ids", "Backend schema must preserve generator reviewer required records.");
requireText(schemaDraft, "blocked_shortcuts", "Backend schema must preserve generator reviewer blocked shortcuts.");
requireText(schemaDraft, "target_language_trigger_rule", "Backend schema must preserve target-language trigger rules.");
requireText(schemaDraft, "assist_language_support_rule", "Backend schema must preserve assist-language support rules.");
requireText(schemaDraft, "ai_generator_responsibility_matrix", "Backend schema must include AI generator responsibility matrices.");
requireText(
  schemaDraft,
  "ai_generator_responsibility_matrix_id",
  "Backend schema must preserve AI generator responsibility matrix ids.",
);
requireText(schemaDraft, "role_ownership_map", "Backend schema must preserve generator role ownership.");
requireText(schemaDraft, "owner_duties", "Backend schema must preserve generator owner duties.");
requireText(schemaDraft, "handoff_record_ids", "Backend schema must preserve generator handoff records.");
requireText(schemaDraft, "cannot_do_rules", "Backend schema must preserve generator cannot-do rules.");
requireText(schemaDraft, "external_builder_app_write_allowed", "Backend schema must block external-builder app writes.");
requireText(schemaDraft, "external_builder_scoring_authority_allowed", "Backend schema must block external-builder scoring authority.");
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
requireText(schemaDraft, "settings_context", "Backend schema must preserve progress event settings context.");
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
requireText(migrationCandidates, "m100-ai-generation-request-packet-storage", "Migration candidates must include AI generation request packet storage.");
requireText(migrationSpecs, "spec-ai-generation-request-packet", "Migration specs must include AI generation request packets.");
requireText(migrationSpecs, "ai_generation_request_packet_id", "Migration specs must preserve AI generation request packet ids.");
requireText(migrationSpecs, "request_builder_review_packet_id", "Migration specs must preserve request-builder review packet ids.");
requireText(migrationSpecs, "source_evidence_packet_id", "Migration specs must preserve source evidence packet ids.");
requireText(migrationSpecs, "premium_ai_cost_gate_id", "Migration specs must preserve premium AI cost gate ids.");
requireText(migrationSpecs, "activity_compatibility_snapshot_id", "Migration specs must preserve activity compatibility snapshot ids.");
requireText(migrationSpecs, "audio_coverage_requirement_id", "Migration specs must preserve AI request audio coverage requirements.");
requireText(migrationSpecs, "media_rights_manifest_id", "Migration specs must preserve media-rights manifest ids.");
requireText(migrationSpecs, "live_model_dispatch_allowed", "Migration specs must block live model dispatch.");
requireText(migrationSpecs, "model_billing_allowed", "Migration specs must block model billing.");
requireText(migrationSpecs, "spec-ai-generated-game-build-brief", "Migration specs must include AI generated game build briefs.");
requireText(migrationSpecs, "ai_generated_game_build_brief_id", "Migration specs must preserve generated game build brief ids.");
requireText(migrationSpecs, "target_builder", "Migration specs must preserve generated game target builders.");
requireText(migrationSpecs, "mode_briefs", "Migration specs must preserve generated game mode briefs.");
requireText(migrationSpecs, "parent_engine_binding_id", "Migration specs must preserve generated game parent-engine binding ids.");
requireText(migrationSpecs, "standard_event_contract_id", "Migration specs must preserve generated game standard event contract ids.");
requireText(migrationSpecs, "audio_cue_manifest_id", "Migration specs must preserve generated game audio cue manifest ids.");
requireText(migrationSpecs, "scoring_contract_snapshot", "Migration specs must preserve generated game scoring contracts.");
requireText(migrationSpecs, "standalone_game_promotion_allowed", "Migration specs must block standalone game promotion.");
requireText(migrationSpecs, "phaser_bypass_allowed", "Migration specs must block Phaser bypass.");
requireText(migrationSpecs, "generated_game_route_write_allowed", "Migration specs must block generated game route writes.");
requireText(migrationSpecs, "scoring_profile_override_allowed", "Migration specs must block scoring profile overrides.");
requireText(migrationSpecs, "student_assignment_allowed", "Migration specs must block generated game student assignment.");
requireText(migrationSpecs, "spec-ai-external-prototype-task-packet", "Migration specs must include AI external prototype task packets.");
requireText(migrationSpecs, "ai_external_prototype_task_packet_id", "Migration specs must preserve AI external prototype task packet ids.");
requireText(migrationSpecs, "handoff_state", "Migration specs must preserve external prototype handoff state.");
requireText(migrationSpecs, "repository_scope", "Migration specs must preserve external prototype repository scope.");
requireText(migrationSpecs, "permitted_handoff_contents", "Migration specs must preserve permitted external handoff contents.");
requireText(migrationSpecs, "required_before_handoff", "Migration specs must preserve required-before-handoff checks.");
requireText(migrationSpecs, "mode_tasks", "Migration specs must preserve external prototype mode tasks.");
requireText(migrationSpecs, "return_evidence_requirements", "Migration specs must preserve external prototype return evidence requirements.");
requireText(migrationSpecs, "blocked_handoff_actions", "Migration specs must preserve blocked external handoff actions.");
requireText(migrationSpecs, "live_handoff_allowed", "Migration specs must block live external handoff.");
requireText(migrationSpecs, "app_file_write_allowed", "Migration specs must block external app file writes.");
requireText(migrationSpecs, "external_builder_scoring_authority_allowed", "Migration specs must block external scoring authority.");
requireText(migrationSpecs, "route_creation_allowed", "Migration specs must block external route creation.");
requireText(migrationSpecs, "reward_inventory_write_allowed", "Migration specs must block external reward writes.");
requireText(migrationSpecs, "playlist_creation_allowed", "Migration specs must block external playlist creation.");
requireText(migrationSpecs, "package_assembly_allowed", "Migration specs must block external package assembly.");
requireText(migrationSpecs, "support_language_progress_allowed", "Migration specs must block support-language progress from external tasks.");
requireText(migrationSpecs, "spec-ai-external-task-export-readiness-gate", "Migration specs must include AI external task export readiness gates.");
requireText(migrationSpecs, "ai_external_task_export_readiness_gate_id", "Migration specs must preserve AI external task export readiness gate ids.");
requireText(migrationSpecs, "export_channels", "Migration specs must preserve external task export channels.");
requireText(migrationSpecs, "readiness_checks", "Migration specs must preserve external task export readiness checks.");
requireText(migrationSpecs, "blocked_export_actions", "Migration specs must preserve blocked external task export actions.");
requireText(migrationSpecs, "task_export_allowed", "Migration specs must block external task export.");
requireText(migrationSpecs, "prompt_copy_allowed", "Migration specs must block prompt copy actions.");
requireText(migrationSpecs, "repository_issue_creation_allowed", "Migration specs must block repository issue creation.");
requireText(migrationSpecs, "archive_download_allowed", "Migration specs must block archive downloads.");
requireText(migrationSpecs, "student_facing_pathway_allowed", "Migration specs must block student-facing pathways from external task export.");
requireText(migrationSpecs, "spec-ai-prototype-return-review", "Migration specs must include AI prototype return reviews.");
requireText(migrationSpecs, "ai_prototype_return_review_id", "Migration specs must preserve AI prototype return review ids.");
requireText(migrationSpecs, "ai_generated_game_build_brief_id", "Migration specs must link return reviews to generated game build briefs.");
requireText(migrationSpecs, "submitted_by", "Migration specs must preserve prototype return submitter labels.");
requireText(migrationSpecs, "returned_artifacts", "Migration specs must preserve returned prototype artifacts.");
requireText(migrationSpecs, "required_evidence", "Migration specs must preserve prototype return evidence requirements.");
requireText(migrationSpecs, "parent_engine_wrapper_review", "Migration specs must preserve parent-engine wrapper review.");
requireText(migrationSpecs, "json_fixture_conformance", "Migration specs must preserve JSON fixture conformance.");
requireText(migrationSpecs, "standard_event_replay", "Migration specs must preserve standard event replay.");
requireText(migrationSpecs, "audio_cue_coverage_review", "Migration specs must preserve audio cue coverage review.");
requireText(migrationSpecs, "deterministic_scoring_review", "Migration specs must preserve deterministic scoring review.");
requireText(migrationSpecs, "mobile_accessibility_review", "Migration specs must preserve mobile accessibility review.");
requireText(migrationSpecs, "white_label_fit_review", "Migration specs must preserve white-label fit review.");
requireText(migrationSpecs, "blocked_return_actions", "Migration specs must preserve prototype return action blocks.");
requireText(migrationSpecs, "production_merge_allowed", "Migration specs must block prototype production merge.");
requireText(migrationSpecs, "scoring_profile_mutation_allowed", "Migration specs must block scoring profile mutation.");
requireText(migrationSpecs, "audio_manifest_mutation_allowed", "Migration specs must block audio manifest mutation.");
requireText(migrationSpecs, "assignment_creation_allowed", "Migration specs must block assignment creation.");
requireText(migrationSpecs, "student_facing_preview_allowed", "Migration specs must block student-facing prototype preview.");
requireText(migrationSpecs, "spec-ai-prototype-integration-plan", "Migration specs must include AI prototype integration plans.");
requireText(migrationSpecs, "ai_prototype_integration_plan_id", "Migration specs must preserve AI prototype integration plan ids.");
requireText(migrationSpecs, "ai_prototype_return_review_id", "Migration specs must link integration plans to prototype return reviews.");
requireText(migrationSpecs, "integration_lanes", "Migration specs must preserve prototype integration lanes.");
requireText(migrationSpecs, "test_harness_requirements", "Migration specs must preserve prototype integration test harness requirements.");
requireText(migrationSpecs, "next_review_records", "Migration specs must preserve prototype integration next review records.");
requireText(migrationSpecs, "mode_integration_plans", "Migration specs must preserve mode integration plans.");
requireText(migrationSpecs, "direct_app_import_allowed", "Migration specs must block direct app imports.");
requireText(migrationSpecs, "game_sequence_mutation_allowed", "Migration specs must block game sequence mutations.");
requireText(migrationSpecs, "package_promotion_allowed", "Migration specs must block package promotion.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-wrapper-adapter-review",
  "Migration specs must include AI prototype wrapper adapter reviews.",
);
requireText(
  migrationSpecs,
  "ai_prototype_wrapper_adapter_review_id",
  "Migration specs must preserve AI prototype wrapper adapter review ids.",
);
requireText(migrationSpecs, "parent_engine_adapter_boundary", "Migration specs must preserve parent-engine adapter boundaries.");
requireText(migrationSpecs, "fixture_input_contract", "Migration specs must preserve wrapper fixture input contracts.");
requireText(migrationSpecs, "standard_event_output_contract", "Migration specs must preserve standard event output contracts.");
requireText(migrationSpecs, "state_ownership_rules", "Migration specs must preserve wrapper state ownership rules.");
requireText(migrationSpecs, "wrapper_evidence", "Migration specs must preserve wrapper evidence.");
requireText(migrationSpecs, "rejection_triggers", "Migration specs must preserve wrapper rejection triggers.");
requireText(migrationSpecs, "event_contract_bypass_allowed", "Migration specs must block event contract bypass.");
requireText(migrationSpecs, "tenant_hard_coding_allowed", "Migration specs must block tenant hard-coding.");
requireText(migrationSpecs, "score_authority_allowed", "Migration specs must block wrapper score authority.");
requireText(migrationSpecs, "route_state_ownership_allowed", "Migration specs must block route state ownership.");
requireText(migrationSpecs, "audio_manifest_authority_allowed", "Migration specs must block audio manifest authority.");
requireText(migrationSpecs, "reward_inventory_write_allowed", "Migration specs must block reward inventory writes.");
requireText(
  migrationSpecs,
  "support_language_progress_trigger_allowed",
  "Migration specs must block support-language progress triggers.",
);
requireText(
  migrationSpecs,
  "spec-ai-prototype-fixture-replay-report",
  "Migration specs must include AI prototype fixture replay reports.",
);
requireText(
  migrationSpecs,
  "ai_prototype_fixture_replay_report_id",
  "Migration specs must preserve AI prototype fixture replay report ids.",
);
requireText(migrationSpecs, "reviewed_unit_json_fixture_id", "Migration specs must preserve reviewed unit JSON fixture ids.");
requireText(migrationSpecs, "fixture_coverage", "Migration specs must preserve fixture coverage.");
requireText(migrationSpecs, "input_assertions", "Migration specs must preserve fixture replay input assertions.");
requireText(migrationSpecs, "output_assertions", "Migration specs must preserve fixture replay output assertions.");
requireText(migrationSpecs, "replay_evidence", "Migration specs must preserve fixture replay evidence.");
requireText(migrationSpecs, "failure_triggers", "Migration specs must preserve fixture replay failure triggers.");
requireText(migrationSpecs, "hard_coded_unit_text_allowed", "Migration specs must block hard-coded unit text.");
requireText(
  migrationSpecs,
  "target_language_progress_trigger_required",
  "Migration specs must require target-language progress triggers.",
);
requireText(
  migrationSpecs,
  "spec-ai-prototype-event-replay-report",
  "Migration specs must include AI prototype event replay reports.",
);
requireText(
  migrationSpecs,
  "ai_prototype_event_replay_report_id",
  "Migration specs must preserve AI prototype event replay report ids.",
);
requireText(migrationSpecs, "standard_event_contract_id", "Migration specs must preserve standard event contract ids.");
requireText(
  migrationSpecs,
  "progress_event_acceptance_map_id",
  "Migration specs must preserve progress event acceptance map ids.",
);
requireText(migrationSpecs, "standard_event_coverage", "Migration specs must preserve standard event coverage.");
requireText(migrationSpecs, "required_event_order", "Migration specs must preserve required event order.");
requireText(migrationSpecs, "allowed_payload_fields", "Migration specs must preserve allowed event payload fields.");
requireText(migrationSpecs, "accepted_progress_effects", "Migration specs must preserve accepted progress effects.");
requireText(migrationSpecs, "hidden_progress_stream_allowed", "Migration specs must block hidden progress streams.");
requireText(migrationSpecs, "report_export_allowed", "Migration specs must block report export from event replay reports.");
requireText(migrationSpecs, "playlist_write_allowed", "Migration specs must block playlist writes from event replay reports.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-audio-coverage-report",
  "Migration specs must include AI prototype audio coverage reports.",
);
requireText(
  migrationSpecs,
  "ai_prototype_audio_coverage_report_id",
  "Migration specs must preserve AI prototype audio coverage report ids.",
);
requireText(migrationSpecs, "audio_cue_manifest_id", "Migration specs must preserve prototype audio cue manifest ids.");
requireText(
  migrationSpecs,
  "package_game_audio_coverage_id",
  "Migration specs must preserve prototype package game audio coverage ids.",
);
requireText(
  migrationSpecs,
  "background_media_policy_binding_id",
  "Migration specs must preserve prototype background media policy binding ids.",
);
requireText(migrationSpecs, "required_cue_families", "Migration specs must preserve prototype required audio cue families.");
requireText(migrationSpecs, "target_language_audio_checks", "Migration specs must preserve target-language audio checks.");
requireText(migrationSpecs, "control_audio_checks", "Migration specs must preserve control audio checks.");
requireText(migrationSpecs, "support_language_audio_rules", "Migration specs must preserve support-language audio rules.");
requireText(migrationSpecs, "audio_replay_evidence", "Migration specs must preserve audio replay evidence.");
requireText(migrationSpecs, "generated_voice_call_allowed", "Migration specs must block generated voice calls.");
requireText(migrationSpecs, "voice_api_cost_allowed", "Migration specs must block voice API cost.");
requireText(migrationSpecs, "audio_manifest_mutation_allowed", "Migration specs must block prototype audio manifest mutation.");
requireText(migrationSpecs, "media_only_mastery_allowed", "Migration specs must block media-only mastery.");
requireText(
  migrationSpecs,
  "package_audio_complete_marker_allowed",
  "Migration specs must block package audio-complete markers.",
);
requireText(
  migrationSpecs,
  "spec-ai-prototype-mobile-accessibility-report",
  "Migration specs must include AI prototype mobile accessibility reports.",
);
requireText(
  migrationSpecs,
  "ai_prototype_mobile_accessibility_report_id",
  "Migration specs must preserve AI prototype mobile accessibility report ids.",
);
requireText(
  migrationSpecs,
  "activity_compatibility_snapshot_id",
  "Migration specs must preserve prototype activity compatibility snapshot ids.",
);
requireText(migrationSpecs, "template_rendering_profile_id", "Migration specs must preserve template rendering profile ids.");
requireText(migrationSpecs, "font_accessibility_profile_id", "Migration specs must preserve font accessibility profile ids.");
requireText(migrationSpecs, "viewport_evidence", "Migration specs must preserve mobile viewport evidence.");
requireText(migrationSpecs, "touch_target_checks", "Migration specs must preserve touch target checks.");
requireText(migrationSpecs, "keyboard_focus_checks", "Migration specs must preserve keyboard and focus checks.");
requireText(migrationSpecs, "readable_text_checks", "Migration specs must preserve readable text checks.");
requireText(migrationSpecs, "visual_stability_checks", "Migration specs must preserve visual stability checks.");
requireText(migrationSpecs, "wrapper_control_checks", "Migration specs must preserve wrapper control checks.");
requireText(migrationSpecs, "accessibility_waiver_allowed", "Migration specs must block accessibility waivers.");
requireText(migrationSpecs, "student_facing_preview_allowed", "Migration specs must block student-facing previews.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-scoring-replay-report",
  "Migration specs must include AI prototype scoring replay reports.",
);
requireText(
  migrationSpecs,
  "ai_prototype_scoring_replay_report_id",
  "Migration specs must preserve AI prototype scoring replay report ids.",
);
requireText(
  migrationSpecs,
  "game_scoring_profile_snapshot_id",
  "Migration specs must preserve prototype scoring profile snapshot ids.",
);
requireText(
  migrationSpecs,
  "progress_event_acceptance_map_id",
  "Migration specs must preserve prototype progress event acceptance map ids.",
);
requireText(migrationSpecs, "collection_unlock_binding_id", "Migration specs must preserve collection unlock binding ids.");
requireText(
  migrationSpecs,
  "deterministic_scoring_replay",
  "Migration specs must preserve deterministic scoring replay evidence.",
);
requireText(migrationSpecs, "score_replay_checks", "Migration specs must preserve score replay checks.");
requireText(migrationSpecs, "mastery_replay_checks", "Migration specs must preserve mastery replay checks.");
requireText(migrationSpecs, "reward_boundary_checks", "Migration specs must preserve reward boundary checks.");
requireText(migrationSpecs, "scoring_profile_override_allowed", "Migration specs must block scoring profile overrides.");
requireText(migrationSpecs, "star_dust_write_allowed", "Migration specs must block Star Dust writes.");
requireText(migrationSpecs, "random_reward_allowed", "Migration specs must block random rewards.");
requireText(migrationSpecs, "support_language_mastery_allowed", "Migration specs must block support-language mastery.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-integration-readiness-gate",
  "Migration specs must include AI prototype integration readiness gates.",
);
requireText(
  migrationSpecs,
  "ai_prototype_integration_readiness_gate_id",
  "Migration specs must preserve AI prototype integration readiness gate ids.",
);
requireText(
  migrationSpecs,
  "codex_integration_review_decision_id",
  "Migration specs must preserve Codex integration review decision ids.",
);
requireText(migrationSpecs, "evidence_readiness_checks", "Migration specs must preserve evidence readiness checks.");
requireText(
  migrationSpecs,
  "all_prototype_evidence_reviewed",
  "Migration specs must preserve all-evidence-reviewed state.",
);
requireText(migrationSpecs, "app_patch_allowed", "Migration specs must block app patches.");
requireText(migrationSpecs, "direct_import_allowed", "Migration specs must block direct imports.");
requireText(migrationSpecs, "student_facing_route_allowed", "Migration specs must block student-facing routes.");
requireText(
  migrationSpecs,
  "star_dust_reward_write_allowed",
  "Migration specs must block Star Dust and reward writes.",
);
requireText(
  migrationSpecs,
  "spec-codex-integration-review-decision",
  "Migration specs must include Codex integration review decisions.",
);
requireText(
  migrationSpecs,
  "codex_integration_review_decision_id",
  "Migration specs must preserve Codex integration review decision ids.",
);
requireText(
  migrationSpecs,
  "ai_prototype_integration_readiness_gate_id",
  "Migration specs must link Codex decisions to AI prototype integration readiness gates.",
);
requireText(
  migrationSpecs,
  "manual_codex_review_required",
  "Migration specs must preserve manual Codex review requirements.",
);
requireText(migrationSpecs, "decision_recorded", "Migration specs must preserve Codex decision recorded state.");
requireText(
  migrationSpecs,
  "app_patch_generation_allowed",
  "Migration specs must block Codex app patch generation.",
);
requireText(
  migrationSpecs,
  "scoring_profile_mutation_allowed",
  "Migration specs must block Codex scoring profile mutations.",
);
requireText(migrationSpecs, "spec-ai-prototype-app-patch-proposal", "Migration specs must include AI prototype app patch proposals.");
requireText(
  migrationSpecs,
  "ai_prototype_app_patch_proposal_id",
  "Migration specs must preserve AI prototype app patch proposal ids.",
);
requireText(migrationSpecs, "proposed_file_scope", "Migration specs must preserve prototype app patch proposed file scope.");
requireText(migrationSpecs, "required_before_patch", "Migration specs must preserve prototype app patch pre-patch gates.");
requireText(migrationSpecs, "required_test_gates", "Migration specs must preserve prototype app patch test gates.");
requireText(migrationSpecs, "rollback_requirements", "Migration specs must preserve prototype app patch rollback requirements.");
requireText(migrationSpecs, "blocked_patch_actions", "Migration specs must preserve blocked prototype app patch actions.");
requireText(migrationSpecs, "app_file_write_allowed", "Migration specs must block app file writes.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-patch-test-readiness-gate",
  "Migration specs must include AI prototype patch test readiness gates.",
);
requireText(
  migrationSpecs,
  "ai_prototype_patch_test_readiness_gate_id",
  "Migration specs must preserve AI prototype patch test readiness gate ids.",
);
requireText(
  migrationSpecs,
  "patch_test_harness_plan_id",
  "Migration specs must preserve patch test harness plan ids.",
);
requireText(
  migrationSpecs,
  "route_safety_release_gate_id",
  "Migration specs must preserve route safety release gate ids.",
);
requireText(migrationSpecs, "rollback_drill_record_id", "Migration specs must preserve rollback drill record ids.");
requireText(
  migrationSpecs,
  "storage_contract_verification_id",
  "Migration specs must preserve storage contract verification ids.",
);
requireText(
  migrationSpecs,
  "codex_patch_approval_decision_id",
  "Migration specs must preserve Codex patch approval decision ids.",
);
requireText(migrationSpecs, "required_test_lanes", "Migration specs must preserve patch test lanes.");
requireText(migrationSpecs, "blocked_test_actions", "Migration specs must preserve blocked patch test actions.");
requireText(migrationSpecs, "test_execution_allowed", "Migration specs must block patch test execution.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-patch-test-harness-plan",
  "Migration specs must include AI prototype patch test harness plans.",
);
requireText(
  migrationSpecs,
  "ai_prototype_patch_test_harness_plan_id",
  "Migration specs must preserve AI prototype patch test harness plan ids.",
);
requireText(migrationSpecs, "runtime_policy", "Migration specs must preserve harness runtime policy.");
requireText(migrationSpecs, "required_inputs", "Migration specs must preserve harness required inputs.");
requireText(migrationSpecs, "harness_sections", "Migration specs must preserve harness sections.");
requireText(migrationSpecs, "non_execution_outputs", "Migration specs must preserve non-execution outputs.");
requireText(migrationSpecs, "blocked_harness_actions", "Migration specs must preserve blocked harness actions.");
requireText(migrationSpecs, "playwright_run_allowed", "Migration specs must block Playwright runs.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-patch-harness-implementation-proposal",
  "Migration specs must include AI prototype patch harness implementation proposals.",
);
requireText(
  migrationSpecs,
  "ai_prototype_patch_harness_implementation_proposal_id",
  "Migration specs must preserve AI prototype patch harness implementation proposal ids.",
);
requireText(migrationSpecs, "implementation_proposal_status", "Migration specs must preserve implementation proposal status.");
requireText(migrationSpecs, "implementation_boundaries", "Migration specs must preserve harness implementation boundaries.");
requireText(migrationSpecs, "required_review_gates", "Migration specs must preserve harness implementation review gates.");
requireText(migrationSpecs, "dry_run_only_checks", "Migration specs must preserve dry-run-only harness checks.");
requireText(migrationSpecs, "next_required_records", "Migration specs must preserve harness implementation next records.");
requireText(migrationSpecs, "blocked_implementation_actions", "Migration specs must preserve blocked harness implementation actions.");
requireText(migrationSpecs, "harness_implementation_allowed", "Migration specs must block harness implementation.");
requireText(
  migrationSpecs,
  "spec-codex-patch-approval-decision",
  "Migration specs must include Codex patch approval decisions.",
);
requireText(
  migrationSpecs,
  "codex_patch_approval_decision_id",
  "Migration specs must preserve Codex patch approval decision ids.",
);
requireText(migrationSpecs, "patch_scope_reviewed", "Migration specs must preserve patch scope review state.");
requireText(migrationSpecs, "approval_evidence_checks", "Migration specs must preserve patch approval evidence checks.");
requireText(migrationSpecs, "blocked_patch_actions", "Migration specs must preserve blocked Codex patch approval actions.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-signed-approval-preflight",
  "Migration specs must include AI prototype signed approval preflights.",
);
requireText(
  migrationSpecs,
  "signed_approval_preflight_id",
  "Migration specs must preserve signed approval preflight ids.",
);
requireText(migrationSpecs, "required_identity_lanes", "Migration specs must preserve approval identity lanes.");
requireText(migrationSpecs, "scope_locks", "Migration specs must preserve signed approval scope locks.");
requireText(
  migrationSpecs,
  "approval_record_draft_fields",
  "Migration specs must preserve approval record draft fields.",
);
requireText(migrationSpecs, "cannot_approve_while", "Migration specs must preserve cannot-approve blockers.");
requireText(migrationSpecs, "blocked_approval_actions", "Migration specs must preserve blocked approval actions.");
requireText(migrationSpecs, "approve_button_allowed", "Migration specs must block approve buttons.");
requireText(migrationSpecs, "patch_authorization_allowed", "Migration specs must block patch authorization.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-patch-authorization-release-lock",
  "Migration specs must include AI prototype patch authorization release locks.",
);
requireText(
  migrationSpecs,
  "patch_authorization_release_lock_id",
  "Migration specs must preserve patch authorization release lock ids.",
);
requireText(migrationSpecs, "required_release_locks", "Migration specs must preserve required release locks.");
requireText(migrationSpecs, "authorization_scope", "Migration specs must preserve patch authorization scope.");
requireText(
  migrationSpecs,
  "forbidden_until_unlocked",
  "Migration specs must preserve forbidden-until-unlocked blockers.",
);
requireText(migrationSpecs, "release_evidence", "Migration specs must preserve patch release evidence.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-patch-implementation-work-order",
  "Migration specs must include AI prototype patch implementation work orders.",
);
requireText(
  migrationSpecs,
  "patch_implementation_work_order_id",
  "Migration specs must preserve patch implementation work order ids.",
);
requireText(migrationSpecs, "required_before_work", "Migration specs must preserve patch implementation required-before-work records.");
requireText(migrationSpecs, "allowed_future_file_groups", "Migration specs must preserve patch implementation file groups.");
requireText(migrationSpecs, "dry_run_verification_order", "Migration specs must preserve patch implementation dry-run order.");
requireText(migrationSpecs, "rollback_plan", "Migration specs must preserve patch implementation rollback plans.");
requireText(migrationSpecs, "work_order_execution_allowed", "Migration specs must block work order execution.");
requireText(
  migrationSpecs,
  "spec-ai-prototype-patch-change-set-preview",
  "Migration specs must include AI prototype patch change set previews.",
);
requireText(migrationSpecs, "patch_change_set_preview_id", "Migration specs must preserve patch change set preview ids.");
requireText(migrationSpecs, "planned_file_changes", "Migration specs must preserve patch change set planned file changes.");
requireText(migrationSpecs, "invariant_checks", "Migration specs must preserve patch change set invariant checks.");
requireText(migrationSpecs, "review_blockers", "Migration specs must preserve patch change set review blockers.");
requireText(migrationSpecs, "blocked_change_set_actions", "Migration specs must preserve blocked patch change set actions.");
requireText(migrationSpecs, "apply_patch_allowed", "Migration specs must block apply-patch actions.");
requireText(migrationSpecs, "generated_file_write_allowed", "Migration specs must block generated file writes.");
requireText(
  migrationSpecs,
  "spec-target-language-audio-approval",
  "Migration specs must include target-language audio approvals.",
);
requireText(
  migrationSpecs,
  "target_language_audio_approval_id",
  "Migration specs must preserve target-language audio approval ids.",
);
requireText(migrationSpecs, "cue_review_items", "Migration specs must preserve target-language audio cue review items.");
requireText(migrationSpecs, "progress_boundaries", "Migration specs must preserve target-language audio progress boundaries.");
requireText(migrationSpecs, "audio_approval_capture_allowed", "Migration specs must block audio approval capture.");
requireText(migrationSpecs, "voice_generation_allowed", "Migration specs must block voice generation.");
requireText(migrationSpecs, "speech_api_billing_allowed", "Migration specs must block speech API billing.");
requireText(migrationSpecs, "package_audio_complete_allowed", "Migration specs must block package audio-complete markers.");
requireText(migrationSpecs, "media_only_progress_allowed", "Migration specs must block media-only progress.");
requireText(
  migrationSpecs,
  "spec-ai-generated-package-teacher-review-packet",
  "Migration specs must include AI generated package teacher review packets.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_teacher_review_packet_id",
  "Migration specs must preserve generated package teacher review packet ids.",
);
requireText(migrationSpecs, "decision_lanes", "Migration specs must preserve generated teacher review decision lanes.");
requireText(migrationSpecs, "missing_evidence", "Migration specs must preserve generated teacher review missing evidence.");
requireText(
  migrationSpecs,
  "approval_capture_allowed",
  "Migration specs must keep generated teacher review approval capture blocked.",
);
requireText(
  migrationSpecs,
  "support_language_progress_allowed",
  "Migration specs must keep generated teacher review support-language progress blocked.",
);
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
requireText(
  migrationSpecs,
  "spec-ai-generated-package-promotion-checklist",
  "Migration specs must include AI generated package promotion checklists.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_promotion_checklist_id",
  "Migration specs must preserve generated package promotion checklist ids.",
);
requireText(migrationSpecs, "ai_generator_lineage_map_id", "Migration specs must preserve generated package lineage ids.");
requireText(
  migrationSpecs,
  "package_game_audio_coverage_id",
  "Migration specs must preserve generated package game audio coverage ids.",
);
requireText(
  migrationSpecs,
  "promotion_checklist_steps",
  "Migration specs must preserve generated package promotion checklist steps.",
);
requireText(
  migrationSpecs,
  "blocked_promotion_actions",
  "Migration specs must preserve generated package promotion action blocks.",
);
requireText(
  migrationSpecs,
  "generated_package_promotion_allowed",
  "Migration specs must block generated package promotion.",
);
requireText(
  migrationSpecs,
  "support_language_promotion_allowed",
  "Migration specs must block support-language-only generated package promotion.",
);
requireText(
  migrationSpecs,
  "spec-ai-generated-package-release-candidate",
  "Migration specs must include AI generated package release candidates.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_release_candidate_id",
  "Migration specs must preserve generated package release candidate ids.",
);
requireText(
  migrationSpecs,
  "private_library_target",
  "Migration specs must preserve generated package private library targets.",
);
requireText(
  migrationSpecs,
  "future_tenant_library_item_id",
  "Migration specs must preserve future tenant library item ids.",
);
requireText(
  migrationSpecs,
  "candidate_signals",
  "Migration specs must preserve generated package release candidate signals.",
);
requireText(
  migrationSpecs,
  "generated_package_library_publish_allowed",
  "Migration specs must block generated package library publish.",
);
requireText(migrationSpecs, "release_candidate_write_allowed", "Migration specs must block release candidate writes.");
requireText(migrationSpecs, "tenant_library_item_write_allowed", "Migration specs must block tenant library writes.");
requireText(migrationSpecs, "student_facing_release_allowed", "Migration specs must block student-facing release.");
requireText(migrationSpecs, "local_bundle_release_allowed", "Migration specs must block local bundle release.");
requireText(migrationSpecs, "support_language_release_allowed", "Migration specs must block support-language release.");
requireText(
  migrationSpecs,
  "spec-ai-generated-package-assembly-readiness",
  "Migration specs must include AI generated package assembly readiness.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_assembly_readiness_id",
  "Migration specs must preserve generated package assembly readiness ids.",
);
requireText(migrationSpecs, "assembly_readiness_lanes", "Migration specs must preserve package assembly readiness lanes.");
requireText(migrationSpecs, "blocked_assembly_actions", "Migration specs must preserve package assembly action blocks.");
requireText(migrationSpecs, "media_rights_evidence_id", "Migration specs must require media rights evidence.");
requireText(migrationSpecs, "support_language_assembly_allowed", "Migration specs must block support-language assembly.");
requireText(
  migrationSpecs,
  "spec-ai-generated-package-assembly-dry-run",
  "Migration specs must include AI generated package assembly dry runs.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_assembly_dry_run_id",
  "Migration specs must preserve generated package assembly dry-run ids.",
);
requireText(migrationSpecs, "artifact_map", "Migration specs must preserve generated package artifact maps.");
requireText(migrationSpecs, "source_record_ids", "Migration specs must preserve generated package dry-run source records.");
requireText(migrationSpecs, "blocked_dry_run_actions", "Migration specs must preserve generated package dry-run action blocks.");
requireText(migrationSpecs, "package_json_write_allowed", "Migration specs must block package JSON writes.");
requireText(
  migrationSpecs,
  "spec-ai-generated-package-writer-preflight",
  "Migration specs must include AI generated package writer preflights.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_writer_preflight_id",
  "Migration specs must preserve generated package writer preflight ids.",
);
requireText(migrationSpecs, "writer_targets", "Migration specs must preserve generated package writer targets.");
requireText(migrationSpecs, "required_evidence", "Migration specs must preserve writer preflight required evidence.");
requireText(migrationSpecs, "blocked_writer_actions", "Migration specs must preserve generated package writer action blocks.");
requireText(migrationSpecs, "writer_execution_allowed", "Migration specs must block writer execution.");
requireText(migrationSpecs, "support_language_writer_allowed", "Migration specs must block support-language-only writers.");
requireText(
  migrationSpecs,
  "spec-ai-generated-package-writer-rollback-drill",
  "Migration specs must include AI generated package writer rollback drills.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_writer_rollback_drill_id",
  "Migration specs must preserve generated package writer rollback drill ids.",
);
requireText(migrationSpecs, "pre_write_snapshots", "Migration specs must preserve generated package pre-write snapshots.");
requireText(
  migrationSpecs,
  "post_write_verification",
  "Migration specs must preserve generated package post-write verification.",
);
requireText(migrationSpecs, "rollback_steps", "Migration specs must preserve generated package rollback steps.");
requireText(
  migrationSpecs,
  "blocked_rollback_actions",
  "Migration specs must preserve generated package rollback action blocks.",
);
requireText(migrationSpecs, "rollback_execution_allowed", "Migration specs must block rollback execution.");
requireText(
  migrationSpecs,
  "production_qr_redirect_mutation_allowed",
  "Migration specs must block production QR redirect mutation.",
);
requireText(
  migrationSpecs,
  "support_language_rollback_evidence_allowed",
  "Migration specs must block support-language-only rollback evidence.",
);
requireText(
  migrationSpecs,
  "spec-ai-generated-package-writer-implementation-readiness",
  "Migration specs must include AI generated package writer implementation readiness gates.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_writer_implementation_readiness_id",
  "Migration specs must preserve generated package writer implementation readiness ids.",
);
requireText(migrationSpecs, "module_plan", "Migration specs must preserve package writer module plans.");
requireText(migrationSpecs, "required_test_gates", "Migration specs must preserve package writer required test gates.");
requireText(migrationSpecs, "release_controls", "Migration specs must preserve package writer release controls.");
requireText(migrationSpecs, "blocked_implementation_actions", "Migration specs must preserve package writer implementation action blocks.");
requireText(migrationSpecs, "package_writer_implementation_allowed", "Migration specs must block package writer implementation.");
requireText(migrationSpecs, "generated_app_file_write_allowed", "Migration specs must block generated app file writes.");
requireText(
  migrationSpecs,
  "support_language_implementation_evidence_allowed",
  "Migration specs must block support-language-only implementation evidence.",
);
requireText(
  migrationSpecs,
  "spec-ai-generated-package-writer-module-test-plan",
  "Migration specs must include AI generated package writer module test plans.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_writer_module_test_plan_id",
  "Migration specs must preserve generated package writer module test plan ids.",
);
requireText(migrationSpecs, "module_test_suites", "Migration specs must preserve package writer module test suites.");
requireText(migrationSpecs, "required_fixtures", "Migration specs must preserve package writer required fixtures.");
requireText(migrationSpecs, "required_assertions", "Migration specs must preserve package writer required assertions.");
requireText(migrationSpecs, "required_evidence", "Migration specs must preserve package writer required evidence.");
requireText(migrationSpecs, "blocked_test_actions", "Migration specs must preserve package writer blocked test actions.");
requireText(migrationSpecs, "package_writer_test_execution_allowed", "Migration specs must block package writer test execution.");
requireText(migrationSpecs, "writer_mutation_browser_run_allowed", "Migration specs must block writer mutation browser runs.");
requireText(migrationSpecs, "app_file_patch_allowed", "Migration specs must block app file patches.");
requireText(migrationSpecs, "support_language_test_pass_allowed", "Migration specs must block support-language-only test passes.");
requireText(
  migrationSpecs,
  "spec-ai-generated-package-writer-test-evidence-packet",
  "Migration specs must include AI generated package writer test evidence packets.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_writer_test_evidence_packet_id",
  "Migration specs must preserve generated package writer test evidence packet ids.",
);
requireText(migrationSpecs, "evidence_lanes", "Migration specs must preserve package writer evidence lanes.");
requireText(migrationSpecs, "source_records", "Migration specs must preserve package writer evidence source records.");
requireText(migrationSpecs, "acceptance_checks", "Migration specs must preserve package writer evidence acceptance checks.");
requireText(migrationSpecs, "missing_evidence", "Migration specs must preserve package writer missing evidence.");
requireText(migrationSpecs, "blocked_evidence_actions", "Migration specs must preserve package writer blocked evidence actions.");
requireText(migrationSpecs, "evidence_upload_allowed", "Migration specs must block evidence upload.");
requireText(migrationSpecs, "signed_approval_capture_allowed", "Migration specs must block signed approval capture.");
requireText(migrationSpecs, "support_language_evidence_pass_allowed", "Migration specs must block support-language-only evidence passes.");
requireText(schemaDraft, "ai_generated_package_writer_test_harness_plan", "Backend schema must include AI generated package writer test harness plans.");
requireText(
  schemaDraft,
  "ai_generated_package_writer_test_harness_plan_id",
  "Backend schema must preserve AI generated package writer test harness plan ids.",
);
requireText(schemaDraft, "harness_phases", "Backend schema must preserve package writer harness phases.");
requireText(schemaDraft, "environment_adapters", "Backend schema must preserve package writer harness environment adapters.");
requireText(schemaDraft, "required_before_harness", "Backend schema must preserve package writer harness prerequisites.");
requireText(schemaDraft, "blocked_harness_actions", "Backend schema must preserve package writer blocked harness actions.");
requireText(schemaDraft, "harness_implementation_allowed", "Backend schema must block harness implementation.");
requireText(schemaDraft, "support_language_harness_pass_allowed", "Backend schema must block support-language-only harness passes.");
requireText(
  migrationSpecs,
  "spec-ai-generated-package-writer-test-harness-plan",
  "Migration specs must include AI generated package writer test harness plans.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_writer_test_harness_plan_id",
  "Migration specs must preserve generated package writer test harness plan ids.",
);
requireText(migrationSpecs, "harness_phases", "Migration specs must preserve package writer harness phases.");
requireText(migrationSpecs, "environment_adapters", "Migration specs must preserve package writer harness environment adapters.");
requireText(migrationSpecs, "required_before_harness", "Migration specs must preserve package writer harness prerequisites.");
requireText(migrationSpecs, "blocked_harness_actions", "Migration specs must preserve package writer blocked harness actions.");
requireText(migrationSpecs, "harness_implementation_allowed", "Migration specs must block harness implementation.");
requireText(migrationSpecs, "support_language_harness_pass_allowed", "Migration specs must block support-language-only harness passes.");
requireText(
  schemaDraft,
  "ai_generated_package_writer_test_harness_implementation_proposal",
  "Backend schema must include AI generated package writer test harness implementation proposals.",
);
requireText(
  schemaDraft,
  "ai_generated_package_writer_test_harness_implementation_proposal_id",
  "Backend schema must preserve AI generated package writer test harness implementation proposal ids.",
);
requireText(schemaDraft, "proposed_module_scope", "Backend schema must preserve package writer harness implementation module scope.");
requireText(schemaDraft, "implementation_boundaries", "Backend schema must preserve package writer harness implementation boundaries.");
requireText(schemaDraft, "required_review_gates", "Backend schema must preserve package writer harness implementation review gates.");
requireText(schemaDraft, "dry_run_only_checks", "Backend schema must preserve package writer harness dry-run-only checks.");
requireText(
  migrationSpecs,
  "spec-ai-generated-package-writer-test-harness-implementation-proposal",
  "Migration specs must include AI generated package writer test harness implementation proposals.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_writer_test_harness_implementation_proposal_id",
  "Migration specs must preserve generated package writer test harness implementation proposal ids.",
);
requireText(migrationSpecs, "proposed_module_scope", "Migration specs must preserve package writer harness implementation module scope.");
requireText(migrationSpecs, "implementation_boundaries", "Migration specs must preserve package writer harness implementation boundaries.");
requireText(migrationSpecs, "required_review_gates", "Migration specs must preserve package writer harness implementation review gates.");
requireText(migrationSpecs, "dry_run_only_checks", "Migration specs must preserve package writer harness dry-run-only checks.");
requireText(
  schemaDraft,
  "ai_generated_package_writer_harness_implementation_decision",
  "Backend schema must include AI generated package writer harness implementation decisions.",
);
requireText(
  schemaDraft,
  "ai_generated_package_writer_harness_implementation_decision_id",
  "Backend schema must preserve AI generated package writer harness implementation decision ids.",
);
requireText(schemaDraft, "required_evidence", "Backend schema must preserve package writer harness decision evidence.");
requireText(schemaDraft, "file_scope_rules", "Backend schema must preserve package writer harness decision file scope.");
requireText(schemaDraft, "decision_options", "Backend schema must preserve package writer harness decision options.");
requireText(
  schemaDraft,
  "harness_implementation_approval_allowed",
  "Backend schema must block harness implementation approval.",
);
requireText(
  schemaDraft,
  "support_language_implementation_decision_allowed",
  "Backend schema must block support-language-only implementation decisions.",
);
requireText(
  migrationSpecs,
  "spec-ai-generated-package-writer-harness-implementation-decision",
  "Migration specs must include AI generated package writer harness implementation decisions.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_writer_harness_implementation_decision_id",
  "Migration specs must preserve generated package writer harness implementation decision ids.",
);
requireText(migrationSpecs, "required_evidence", "Migration specs must preserve package writer harness decision evidence.");
requireText(migrationSpecs, "file_scope_rules", "Migration specs must preserve package writer harness decision file scope.");
requireText(migrationSpecs, "decision_options", "Migration specs must preserve package writer harness decision options.");
requireText(
  migrationSpecs,
  "harness_implementation_approval_allowed",
  "Migration specs must block harness implementation approval.",
);
requireText(migrationSpecs, "spec-ai-reward-readiness-gate", "Migration specs must include AI reward readiness gates.");
requireText(migrationSpecs, "ai_reward_readiness_gate_id", "Migration specs must preserve AI reward readiness gate ids.");
requireText(migrationSpecs, "ai_draft_correction_queue_id", "Migration specs must preserve AI draft correction queue ids.");
requireText(migrationSpecs, "star_dust_cap_check", "Migration specs must preserve AI reward Star Dust cap checks.");
requireText(migrationSpecs, "deterministic_unlock_check", "Migration specs must preserve deterministic unlock checks.");
requireText(migrationSpecs, "reward_publishing_allowed", "Migration specs must block reward publishing.");
requireText(migrationSpecs, "collection_inventory_write_allowed", "Migration specs must block collection inventory writes.");
requireText(
  migrationSpecs,
  "spec-ai-generated-publish-readiness-gate",
  "Migration specs must include AI generated publish readiness gates.",
);
requireText(
  migrationSpecs,
  "ai_generated_publish_readiness_gate_id",
  "Migration specs must preserve AI generated publish readiness gate ids.",
);
requireText(
  migrationSpecs,
  "ai_generated_package_manifest_id",
  "Migration specs must preserve generated publish manifest ids.",
);
requireText(
  migrationSpecs,
  "ai_verifier_submission_packet_id",
  "Migration specs must preserve generated publish verifier packet ids.",
);
requireText(migrationSpecs, "package_publish_gate_id", "Migration specs must preserve generated publish package gate ids.");
requireText(
  migrationSpecs,
  "package_approval_ledger_id",
  "Migration specs must preserve generated publish approval ledger ids.",
);
requireText(migrationSpecs, "publish_readiness_checks", "Migration specs must preserve generated publish readiness checks.");
requireText(migrationSpecs, "student_route_publish_allowed", "Migration specs must block generated route publishing.");
requireText(
  migrationSpecs,
  "spec-ai-generator-tenant-coverage-gate",
  "Migration specs must include AI generator tenant coverage gates.",
);
requireText(
  migrationSpecs,
  "ai_generator_tenant_coverage_gate_id",
  "Migration specs must preserve AI generator tenant coverage gate ids.",
);
requireText(migrationSpecs, "ai_game_generator_request_id", "Migration specs must preserve generator request ids.");
requireText(migrationSpecs, "tenant_coverage_lanes", "Migration specs must preserve tenant coverage lanes.");
requireText(migrationSpecs, "missing_record_count", "Migration specs must preserve missing record counts.");
requireText(migrationSpecs, "blocked_generator_actions", "Migration specs must preserve blocked generator actions.");
requireText(migrationSpecs, "generator_request_submission_allowed", "Migration specs must block generator request submission.");
requireText(migrationSpecs, "live_model_call_allowed", "Migration specs must block live model calls.");
requireText(migrationSpecs, "verifier_submission_allowed", "Migration specs must block verifier submission.");
requireText(
  migrationSpecs,
  "spec-ai-generator-review-summary",
  "Migration specs must include AI generator review summaries.",
);
requireText(
  migrationSpecs,
  "ai_generator_review_summary_id",
  "Migration specs must preserve AI generator review summary ids.",
);
requireText(migrationSpecs, "section_readiness_rollup", "Migration specs must preserve generator section readiness.");
requireText(migrationSpecs, "primary_blockers", "Migration specs must preserve generator primary blockers.");
requireText(migrationSpecs, "next_required_records", "Migration specs must preserve generator next records.");
requireText(migrationSpecs, "source_record_links", "Migration specs must preserve generator source record links.");
requireText(migrationSpecs, "app_patch_allowed", "Migration specs must block app patch permission from summary records.");
requireText(
  migrationSpecs,
  "spec-ai-generator-reviewer-runbook",
  "Migration specs must include AI generator reviewer runbooks.",
);
requireText(
  migrationSpecs,
  "ai_generator_reviewer_runbook_id",
  "Migration specs must preserve AI generator reviewer runbook ids.",
);
requireText(migrationSpecs, "human_review_order", "Migration specs must preserve generator human review order.");
requireText(migrationSpecs, "standing_rules", "Migration specs must preserve generator reviewer standing rules.");
requireText(migrationSpecs, "evidence_lanes", "Migration specs must preserve generator reviewer evidence lanes.");
requireText(migrationSpecs, "required_record_ids", "Migration specs must preserve generator reviewer required records.");
requireText(migrationSpecs, "blocked_shortcuts", "Migration specs must preserve generator reviewer blocked shortcuts.");
requireText(
  migrationSpecs,
  "spec-ai-generator-responsibility-matrix",
  "Migration specs must include AI generator responsibility matrices.",
);
requireText(
  migrationSpecs,
  "ai_generator_responsibility_matrix_id",
  "Migration specs must preserve AI generator responsibility matrix ids.",
);
requireText(migrationSpecs, "role_ownership_map", "Migration specs must preserve generator role ownership.");
requireText(migrationSpecs, "owner_duties", "Migration specs must preserve generator owner duties.");
requireText(migrationSpecs, "handoff_record_ids", "Migration specs must preserve generator handoff records.");
requireText(migrationSpecs, "cannot_do_rules", "Migration specs must preserve generator cannot-do rules.");
requireText(migrationSpecs, "external_builder_app_write_allowed", "Migration specs must block external-builder app writes.");
requireText(migrationSpecs, "external_builder_scoring_authority_allowed", "Migration specs must block external-builder scoring authority.");
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
requireText(migrationSpecs, "settings_context", "Migration specs must require settings context for events.");
requireText(migrationCandidates, "Preserve settings_context", "Migration candidates must preserve progress event settings context.");
requireText(persistenceAdapter, "preservesSettingsContext", "Persistence adapter plans must preserve progress event settings context.");
requireText(durableRecords, "preservesSettingsContext", "Durable record plans must preserve progress event settings context.");
requireText(schemaDraft, "settings_context_summary", "Backend schema must preserve report package settings context summaries.");
requireText(migrationSpecs, "settings_context_summary", "Migration specs must preserve report package settings context summaries.");
requireText(migrationCandidates, "settings context summary", "Migration candidates must preserve report package settings context summaries.");
requireText(persistenceAdapterValidator, "Teacher report package write intent", "Persistence adapter validator must cover teacher report package write intents.");
requireText(persistenceAdapterValidator, "settings context summaries", "Persistence adapter validator must require teacher report package settings context summaries.");
requireText(durableRecordValidator, "Teacher report package durable record", "Durable record validator must cover teacher report package records.");
requireText(durableRecordValidator, "settings context summaries", "Durable record validator must require teacher report package settings context summaries.");
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
requireText(persistenceAdapter, "hosted-ai-generation-request-packet-write", "Persistence adapter must include hosted AI generation request packet writes.");
requireText(persistenceAdapter, "local-ai-generation-request-packet-write", "Persistence adapter must include local AI generation request packet writes.");
requireText(persistenceAdapter, "preservesAiGenerationRequestPacket: true", "Persistence adapter must preserve AI generation request packets.");
requireText(persistenceAdapter, "requiresRequestBuilderReviewPacket: true", "Persistence adapter must require request-builder review packets.");
requireText(persistenceAdapter, "requiresPremiumAiCostGate: true", "Persistence adapter must require premium AI cost gates.");
requireText(persistenceAdapter, "requiresAiGenerationSourceEvidence: true", "Persistence adapter must require AI generation source evidence.");
requireText(persistenceAdapter, "requiresAiGenerationAudioCoverage: true", "Persistence adapter must require AI generation audio coverage.");
requireText(persistenceAdapter, "requiresAiGenerationCompatibilitySnapshot: true", "Persistence adapter must require AI generation compatibility snapshots.");
requireText(
  persistenceAdapter,
  "hosted-ai-generated-game-build-brief-write",
  "Persistence adapter must include hosted AI generated game build brief writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-game-build-brief-write",
  "Persistence adapter must include local AI generated game build brief writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedGameBuildBrief: true",
  "Persistence adapter must preserve AI generated game build brief packets.",
);
requireText(
  persistenceAdapter,
  "requiresParentEngineBinding: true",
  "Persistence adapter must require parent-engine binding for generated game build briefs.",
);
requireText(
  persistenceAdapter,
  "requiresStandardEventContract: true",
  "Persistence adapter must require standard event contracts for generated game build briefs.",
);
requireText(
  persistenceAdapter,
  "requiresAudioCueManifest: true",
  "Persistence adapter must require audio cue manifests for generated game build briefs.",
);
requireText(
  persistenceAdapter,
  "preservesDeterministicScoringContract: true",
  "Persistence adapter must preserve deterministic scoring contracts for generated game build briefs.",
);
requireText(
  persistenceAdapter,
  "blocksStandaloneGamePromotion: true",
  "Persistence adapter must block standalone game promotion from generated game build briefs.",
);
requireText(persistenceAdapter, "blocksPhaserBypass: true", "Persistence adapter must block Phaser bypass.");
requireText(
  persistenceAdapter,
  "blocksGeneratedGameRouteWrite: true",
  "Persistence adapter must block generated game route writes.",
);
requireText(
  persistenceAdapter,
  "blocksScoringProfileOverride: true",
  "Persistence adapter must block generated game scoring profile overrides.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-external-prototype-task-packet-write",
  "Persistence adapter must include hosted AI external prototype task packet writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-external-prototype-task-packet-write",
  "Persistence adapter must include local AI external prototype task packet writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiExternalPrototypeTaskPacket: true",
  "Persistence adapter must preserve AI external prototype task packets.",
);
requireText(
  persistenceAdapter,
  "requiresExternalPrototypeTaskScope: true",
  "Persistence adapter must require external prototype task scope.",
);
requireText(
  persistenceAdapter,
  "requiresExternalPrototypeHandoffContents: true",
  "Persistence adapter must require external prototype handoff contents.",
);
requireText(
  persistenceAdapter,
  "requiresExternalPrototypeReturnEvidence: true",
  "Persistence adapter must require external prototype return evidence.",
);
requireText(
  persistenceAdapter,
  "blocksExternalPrototypeLiveHandoff: true",
  "Persistence adapter must block live external prototype handoff.",
);
requireText(
  persistenceAdapter,
  "blocksExternalBuilderAuthority: true",
  "Persistence adapter must block external builder authority.",
);
requireText(
  persistenceAdapter,
  "blocksExternalPrototypeTaskShortcuts: true",
  "Persistence adapter must block external prototype task shortcuts.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-external-task-export-readiness-gate-write",
  "Persistence adapter must include hosted AI external task export readiness gate writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-external-task-export-readiness-gate-write",
  "Persistence adapter must include local AI external task export readiness gate writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiExternalTaskExportReadinessGate: true",
  "Persistence adapter must preserve AI external task export readiness gates.",
);
requireText(
  persistenceAdapter,
  "requiresExternalTaskExportChannels: true",
  "Persistence adapter must require external task export channels.",
);
requireText(
  persistenceAdapter,
  "requiresExternalTaskExportReadinessChecks: true",
  "Persistence adapter must require external task export readiness checks.",
);
requireText(persistenceAdapter, "blocksExternalTaskExport: true", "Persistence adapter must block external task export.");
requireText(persistenceAdapter, "blocksPromptCopyAction: true", "Persistence adapter must block prompt copy actions.");
requireText(
  persistenceAdapter,
  "blocksRepositoryIssueCreation: true",
  "Persistence adapter must block repository issue creation.",
);
requireText(persistenceAdapter, "blocksArchiveDownload: true", "Persistence adapter must block archive downloads.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-return-review-write",
  "Persistence adapter must include hosted AI prototype return review writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-return-review-write",
  "Persistence adapter must include local AI prototype return review writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeReturnReview: true",
  "Persistence adapter must preserve AI prototype return review sections.",
);
requireText(
  persistenceAdapter,
  "requiresPrototypeArtifactEvidence: true",
  "Persistence adapter must require returned prototype artifact evidence.",
);
requireText(
  persistenceAdapter,
  "requiresJsonFixtureConformance: true",
  "Persistence adapter must require JSON fixture conformance.",
);
requireText(
  persistenceAdapter,
  "requiresStandardEventReplay: true",
  "Persistence adapter must require standard event replay.",
);
requireText(
  persistenceAdapter,
  "requiresAudioCueCoverageReview: true",
  "Persistence adapter must require audio cue coverage review.",
);
requireText(
  persistenceAdapter,
  "requiresMobileAccessibilityReview: true",
  "Persistence adapter must require mobile accessibility review.",
);
requireText(persistenceAdapter, "blocksProductionMerge: true", "Persistence adapter must block prototype production merge.");
requireText(
  persistenceAdapter,
  "blocksAudioManifestMutation: true",
  "Persistence adapter must block audio manifest mutations.",
);
requireText(
  persistenceAdapter,
  "blocksStudentFacingPrototypePreview: true",
  "Persistence adapter must block student-facing prototype previews.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-integration-plan-write",
  "Persistence adapter must include hosted AI prototype integration plan writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-integration-plan-write",
  "Persistence adapter must include local AI prototype integration plan writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeIntegrationPlan: true",
  "Persistence adapter must preserve AI prototype integration plan sections.",
);
requireText(persistenceAdapter, "requiresWrapperAdapterReview: true", "Persistence adapter must require wrapper adapter review.");
requireText(persistenceAdapter, "requiresFixtureReplayReport: true", "Persistence adapter must require fixture replay reports.");
requireText(persistenceAdapter, "requiresEventReplayReport: true", "Persistence adapter must require event replay reports.");
requireText(persistenceAdapter, "requiresAudioCoverageReport: true", "Persistence adapter must require audio coverage reports.");
requireText(persistenceAdapter, "requiresScoringReplayReport: true", "Persistence adapter must require scoring replay reports.");
requireText(persistenceAdapter, "blocksDirectAppImport: true", "Persistence adapter must block direct app imports.");
requireText(persistenceAdapter, "blocksGameSequenceMutation: true", "Persistence adapter must block game sequence mutations.");
requireText(persistenceAdapter, "blocksPackagePromotion: true", "Persistence adapter must block package promotion.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-wrapper-adapter-review-write",
  "Persistence adapter must include hosted AI prototype wrapper adapter review writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-wrapper-adapter-review-write",
  "Persistence adapter must include local AI prototype wrapper adapter review writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeWrapperAdapterReview: true",
  "Persistence adapter must preserve AI prototype wrapper adapter review sections.",
);
requireText(persistenceAdapter, "requiresFixtureInputContract: true", "Persistence adapter must require fixture input contracts.");
requireText(
  persistenceAdapter,
  "requiresStandardEventOutputContract: true",
  "Persistence adapter must require standard event output contracts.",
);
requireText(persistenceAdapter, "requiresStateOwnershipRules: true", "Persistence adapter must require state ownership rules.");
requireText(persistenceAdapter, "requiresWrapperEvidence: true", "Persistence adapter must require wrapper evidence.");
requireText(persistenceAdapter, "requiresRejectionTriggers: true", "Persistence adapter must require rejection triggers.");
requireText(persistenceAdapter, "blocksEventContractBypass: true", "Persistence adapter must block event contract bypass.");
requireText(persistenceAdapter, "blocksTenantHardCoding: true", "Persistence adapter must block tenant hard-coding.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-fixture-replay-report-write",
  "Persistence adapter must include hosted AI prototype fixture replay report writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-fixture-replay-report-write",
  "Persistence adapter must include local AI prototype fixture replay report writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeFixtureReplayReport: true",
  "Persistence adapter must preserve AI prototype fixture replay report sections.",
);
requireText(
  persistenceAdapter,
  "requiresReviewedUnitJsonFixture: true",
  "Persistence adapter must require reviewed unit JSON fixtures.",
);
requireText(persistenceAdapter, "requiresFixtureCoverage: true", "Persistence adapter must require fixture coverage.");
requireText(
  persistenceAdapter,
  "requiresFixtureReplayEvidence: true",
  "Persistence adapter must require fixture replay evidence.",
);
requireText(
  persistenceAdapter,
  "requiresTargetLanguageProgressTrigger: true",
  "Persistence adapter must require target-language progress triggers.",
);
requireText(persistenceAdapter, "blocksHardCodedUnitText: true", "Persistence adapter must block hard-coded unit text.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-event-replay-report-write",
  "Persistence adapter must include hosted AI prototype event replay report writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-event-replay-report-write",
  "Persistence adapter must include local AI prototype event replay report writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeEventReplayReport: true",
  "Persistence adapter must preserve AI prototype event replay report sections.",
);
requireText(
  persistenceAdapter,
  "requiresStandardEventCoverage: true",
  "Persistence adapter must require standard event coverage.",
);
requireText(persistenceAdapter, "requiresRequiredEventOrder: true", "Persistence adapter must require event order checks.");
requireText(
  persistenceAdapter,
  "requiresAllowedEventPayloadFields: true",
  "Persistence adapter must require allowed event payload fields.",
);
requireText(
  persistenceAdapter,
  "requiresAcceptedProgressEffects: true",
  "Persistence adapter must require accepted progress effects.",
);
requireText(persistenceAdapter, "blocksHiddenProgressStream: true", "Persistence adapter must block hidden progress streams.");
requireText(persistenceAdapter, "blocksScoreAuthority: true", "Persistence adapter must block wrapper score authority.");
requireText(persistenceAdapter, "blocksRouteStateOwnership: true", "Persistence adapter must block route state ownership.");
requireText(persistenceAdapter, "blocksAudioManifestAuthority: true", "Persistence adapter must block audio manifest authority.");
requireText(persistenceAdapter, "blocksRewardInventoryWrite: true", "Persistence adapter must block reward inventory writes.");
requireText(
  persistenceAdapter,
  "blocksSupportLanguageProgressTrigger: true",
  "Persistence adapter must block support-language progress triggers.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-audio-coverage-report-write",
  "Persistence adapter must include hosted AI prototype audio coverage report writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-audio-coverage-report-write",
  "Persistence adapter must include local AI prototype audio coverage report writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeAudioCoverageReport: true",
  "Persistence adapter must preserve AI prototype audio coverage report sections.",
);
requireText(
  persistenceAdapter,
  "requiresTargetLanguageAudioCoverage: true",
  "Persistence adapter must require target-language audio coverage.",
);
requireText(persistenceAdapter, "requiresControlAudioCoverage: true", "Persistence adapter must require control audio coverage.");
requireText(
  persistenceAdapter,
  "requiresSupportLanguageAudioRules: true",
  "Persistence adapter must require support-language audio rules.",
);
requireText(persistenceAdapter, "requiresAudioReplayEvidence: true", "Persistence adapter must require audio replay evidence.");
requireText(persistenceAdapter, "blocksGeneratedVoiceCall: true", "Persistence adapter must block generated voice calls.");
requireText(persistenceAdapter, "blocksVoiceApiCost: true", "Persistence adapter must block voice API cost.");
requireText(persistenceAdapter, "blocksMediaOnlyMastery: true", "Persistence adapter must block media-only mastery.");
requireText(
  persistenceAdapter,
  "blocksPackageAudioCompleteMarker: true",
  "Persistence adapter must block package audio-complete markers.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-mobile-accessibility-report-write",
  "Persistence adapter must include hosted AI prototype mobile accessibility report writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-mobile-accessibility-report-write",
  "Persistence adapter must include local AI prototype mobile accessibility report writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeMobileAccessibilityReport: true",
  "Persistence adapter must preserve AI prototype mobile accessibility report sections.",
);
requireText(
  persistenceAdapter,
  "requiresMobileViewportEvidence: true",
  "Persistence adapter must require mobile viewport evidence.",
);
requireText(persistenceAdapter, "requiresTouchTargetChecks: true", "Persistence adapter must require touch target checks.");
requireText(
  persistenceAdapter,
  "requiresKeyboardFocusChecks: true",
  "Persistence adapter must require keyboard and focus checks.",
);
requireText(persistenceAdapter, "requiresReadableTextChecks: true", "Persistence adapter must require readable text checks.");
requireText(
  persistenceAdapter,
  "requiresVisualStabilityChecks: true",
  "Persistence adapter must require visual stability checks.",
);
requireText(
  persistenceAdapter,
  "requiresAccessibleWrapperControls: true",
  "Persistence adapter must require accessible wrapper controls.",
);
requireText(persistenceAdapter, "blocksAccessibilityWaiver: true", "Persistence adapter must block accessibility waivers.");
requireText(
  persistenceAdapter,
  "blocksStudentFacingPrototypePreview: true",
  "Persistence adapter must block student-facing prototype previews.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-scoring-replay-report-write",
  "Persistence adapter must include hosted AI prototype scoring replay report writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-scoring-replay-report-write",
  "Persistence adapter must include local AI prototype scoring replay report writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeScoringReplayReport: true",
  "Persistence adapter must preserve AI prototype scoring replay report sections.",
);
requireText(
  persistenceAdapter,
  "requiresDeterministicScoringReplay: true",
  "Persistence adapter must require deterministic scoring replay.",
);
requireText(
  persistenceAdapter,
  "requiresScoringProfileSnapshot: true",
  "Persistence adapter must require scoring profile snapshots.",
);
requireText(
  persistenceAdapter,
  "requiresMasteryThresholdReplay: true",
  "Persistence adapter must require mastery threshold replay.",
);
requireText(
  persistenceAdapter,
  "requiresRewardBoundaryChecks: true",
  "Persistence adapter must require reward boundary checks.",
);
requireText(persistenceAdapter, "blocksScoringProfileOverride: true", "Persistence adapter must block scoring profile overrides.");
requireText(persistenceAdapter, "blocksStarDustWrite: true", "Persistence adapter must block Star Dust writes.");
requireText(
  persistenceAdapter,
  "blocksGeneratedSurpriseRewards: true",
  "Persistence adapter must block generated surprise rewards.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-integration-readiness-gate-write",
  "Persistence adapter must include hosted AI prototype integration readiness gate writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-integration-readiness-gate-write",
  "Persistence adapter must include local AI prototype integration readiness gate writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeIntegrationReadinessGate: true",
  "Persistence adapter must preserve AI prototype integration readiness gate sections.",
);
requireText(
  persistenceAdapter,
  "requiresAllPrototypeEvidenceReviewed: true",
  "Persistence adapter must require all prototype evidence reviewed.",
);
requireText(
  persistenceAdapter,
  "requiresCodexIntegrationReviewDecision: true",
  "Persistence adapter must require Codex integration review decisions.",
);
requireText(persistenceAdapter, "blocksStudentFacingRoute: true", "Persistence adapter must block student-facing routes.");
requireText(
  persistenceAdapter,
  "hosted-codex-integration-review-decision-write",
  "Persistence adapter must include hosted Codex integration review decision writes.",
);
requireText(
  persistenceAdapter,
  "local-codex-integration-review-decision-write",
  "Persistence adapter must include local Codex integration review decision writes.",
);
requireText(
  persistenceAdapter,
  "preservesCodexIntegrationReviewDecision: true",
  "Persistence adapter must preserve Codex integration review decisions.",
);
requireText(
  persistenceAdapter,
  "requiresManualCodexReview: true",
  "Persistence adapter must require manual Codex reviews.",
);
requireText(
  persistenceAdapter,
  "blocksAppPatchGeneration: true",
  "Persistence adapter must block app patch generation.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-app-patch-proposal-write",
  "Persistence adapter must include hosted AI prototype app patch proposal writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-app-patch-proposal-write",
  "Persistence adapter must include local AI prototype app patch proposal writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeAppPatchProposal: true",
  "Persistence adapter must preserve AI prototype app patch proposals.",
);
requireText(
  persistenceAdapter,
  "requiresProposedPatchFileScope: true",
  "Persistence adapter must require proposed app patch file scope.",
);
requireText(persistenceAdapter, "requiresPrePatchGates: true", "Persistence adapter must require pre-patch gates.");
requireText(persistenceAdapter, "requiresPatchTestGates: true", "Persistence adapter must require patch test gates.");
requireText(
  persistenceAdapter,
  "requiresReviewerIdentitySignatureGate: true",
  "Persistence adapter must require reviewer identity signature gates for app patch proposals.",
);
requireText(
  persistenceAdapter,
  "requiresReleaseControlBinding: true",
  "Persistence adapter must require release-control binding for app patch proposals.",
);
requireText(persistenceAdapter, "blocksAppFileWrite: true", "Persistence adapter must block app file writes.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-patch-test-readiness-gate-write",
  "Persistence adapter must include hosted AI prototype patch test readiness gate writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-patch-test-readiness-gate-write",
  "Persistence adapter must include local AI prototype patch test readiness gate writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypePatchTestReadinessGate: true",
  "Persistence adapter must preserve AI prototype patch test readiness gates.",
);
requireText(
  persistenceAdapter,
  "requiresPatchTestHarnessPlan: true",
  "Persistence adapter must require patch test harness plans.",
);
requireText(
  persistenceAdapter,
  "requiresRouteSafetyReleaseGate: true",
  "Persistence adapter must require route safety release gates.",
);
requireText(
  persistenceAdapter,
  "requiresRollbackDrillRecord: true",
  "Persistence adapter must require rollback drill records.",
);
requireText(
  persistenceAdapter,
  "requiresStorageContractVerification: true",
  "Persistence adapter must require storage contract verification.",
);
requireText(
  persistenceAdapter,
  "requiresCodexPatchApprovalDecision: true",
  "Persistence adapter must require Codex patch approval decisions.",
);
requireText(persistenceAdapter, "blocksTestExecution: true", "Persistence adapter must block patch test execution.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-patch-test-harness-plan-write",
  "Persistence adapter must include hosted AI prototype patch test harness plan writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-patch-test-harness-plan-write",
  "Persistence adapter must include local AI prototype patch test harness plan writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypePatchTestHarnessPlan: true",
  "Persistence adapter must preserve AI prototype patch test harness plans.",
);
requireText(
  persistenceAdapter,
  "requiresHarnessRuntimePolicy: true",
  "Persistence adapter must require harness runtime policy.",
);
requireText(
  persistenceAdapter,
  "requiresHarnessRequiredInputs: true",
  "Persistence adapter must require harness required inputs.",
);
requireText(
  persistenceAdapter,
  "requiresHarnessSectionCoverage: true",
  "Persistence adapter must require harness section coverage.",
);
requireText(
  persistenceAdapter,
  "requiresHarnessNonExecutionOutputs: true",
  "Persistence adapter must require non-execution outputs.",
);
requireText(persistenceAdapter, "blocksPlaywrightRun: true", "Persistence adapter must block Playwright runs.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-patch-harness-implementation-proposal-write",
  "Persistence adapter must include hosted AI prototype patch harness implementation proposal writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-patch-harness-implementation-proposal-write",
  "Persistence adapter must include local AI prototype patch harness implementation proposal writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypePatchHarnessImplementationProposal: true",
  "Persistence adapter must preserve AI prototype patch harness implementation proposals.",
);
requireText(
  persistenceAdapter,
  "requiresHarnessImplementationFileScopeReview: true",
  "Persistence adapter must require harness implementation file-scope review.",
);
requireText(
  persistenceAdapter,
  "requiresHarnessImplementationReviewGates: true",
  "Persistence adapter must require harness implementation review gates.",
);
requireText(persistenceAdapter, "requiresDryRunOnlyChecks: true", "Persistence adapter must require dry-run-only checks.");
requireText(persistenceAdapter, "blocksHarnessImplementation: true", "Persistence adapter must block harness implementation.");
requireText(persistenceAdapter, "hosted-ai-generated-package-manifest-write", "Persistence adapter must include hosted AI generated package manifest writes.");
requireText(persistenceAdapter, "local-ai-generated-package-manifest-write", "Persistence adapter must include local AI generated package manifest writes.");
requireText(persistenceAdapter, "preservesAiGeneratedPackageManifest: true", "Persistence adapter must preserve AI generated package manifest links.");
requireText(persistenceAdapter, "blocksGeneratedPackageAssembly: true", "Persistence adapter must block generated package assembly.");
requireText(persistenceAdapter, "blocksGeneratedPackageRouteWrite: true", "Persistence adapter must block generated package route registry writes.");
requireText(persistenceAdapter, "blocksGeneratedPackagePlaylistWrite: true", "Persistence adapter must block generated package media playlist writes.");
requireText(persistenceAdapter, "blocksGeneratedPackageAssignment: true", "Persistence adapter must block generated package assignments.");
requireText(persistenceAdapter, "blocksGeneratedPackageLocalBundleWrite: true", "Persistence adapter must block generated package local bundle writes.");
requireText(persistenceAdapter, "blocksStudentReadyMarker: true", "Persistence adapter must block generated package student-ready markers.");
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-promotion-checklist-write",
  "Persistence adapter must include hosted AI generated package promotion checklist writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-promotion-checklist-write",
  "Persistence adapter must include local AI generated package promotion checklist writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackagePromotionChecklist: true",
  "Persistence adapter must preserve AI generated package promotion checklist steps.",
);
requireText(persistenceAdapter, "requiresLineageMap: true", "Persistence adapter must require generated package lineage maps.");
requireText(
  persistenceAdapter,
  "requiresTargetLanguageAudioApproval: true",
  "Persistence adapter must require target-language audio approval before generated package promotion.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratedPackagePromotion: true",
  "Persistence adapter must block generated package promotion.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-release-candidate-write",
  "Persistence adapter must include hosted AI generated package release candidate writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-release-candidate-write",
  "Persistence adapter must include local AI generated package release candidate writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageReleaseCandidate: true",
  "Persistence adapter must preserve AI generated package release candidate signals.",
);
requireText(
  persistenceAdapter,
  "requiresPrivateLibraryTarget: true",
  "Persistence adapter must require private library targets.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratedPackageLibraryPublish: true",
  "Persistence adapter must block generated package library publish.",
);
requireText(
  persistenceAdapter,
  "blocksReleaseCandidateWrite: true",
  "Persistence adapter must block release candidate writes.",
);
requireText(
  persistenceAdapter,
  "blocksTenantLibraryItemWrite: true",
  "Persistence adapter must block tenant library item writes.",
);
requireText(
  persistenceAdapter,
  "blocksStudentFacingRelease: true",
  "Persistence adapter must block student-facing release.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratedLocalBundleRelease: true",
  "Persistence adapter must block generated local bundle release.",
);
requireText(
  persistenceAdapter,
  "blocksSupportLanguageRelease: true",
  "Persistence adapter must block support-language release.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-assembly-readiness-write",
  "Persistence adapter must include hosted AI generated package assembly readiness writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-assembly-readiness-write",
  "Persistence adapter must include local AI generated package assembly readiness writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageAssemblyReadiness: true",
  "Persistence adapter must preserve AI generated package assembly readiness lanes.",
);
requireText(
  persistenceAdapter,
  "requiresPackageAssemblyReadinessLanes: true",
  "Persistence adapter must require package assembly readiness lanes.",
);
requireText(
  persistenceAdapter,
  "requiresMediaRightsEvidence: true",
  "Persistence adapter must require media rights evidence.",
);
requireText(
  persistenceAdapter,
  "blocksSupportLanguageAssembly: true",
  "Persistence adapter must block support-language-only assembly.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-assembly-dry-run-write",
  "Persistence adapter must include hosted AI generated package assembly dry-run writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-assembly-dry-run-write",
  "Persistence adapter must include local AI generated package assembly dry-run writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageAssemblyDryRun: true",
  "Persistence adapter must preserve AI generated package assembly dry-run artifact maps.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratedPackageArtifactMap: true",
  "Persistence adapter must require generated package artifact maps.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratedPackageJsonWrite: true",
  "Persistence adapter must block generated package JSON writes.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-writer-preflight-write",
  "Persistence adapter must include hosted AI generated package writer preflight writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-writer-preflight-write",
  "Persistence adapter must include local AI generated package writer preflight writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageWriterPreflight: true",
  "Persistence adapter must preserve AI generated package writer preflight maps.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratedPackageWriterTargets: true",
  "Persistence adapter must require generated package writer targets.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratedPackageWriterExecution: true",
  "Persistence adapter must block generated package writer execution.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-writer-rollback-drill-write",
  "Persistence adapter must include hosted AI generated package writer rollback drill writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-writer-rollback-drill-write",
  "Persistence adapter must include local AI generated package writer rollback drill writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageWriterRollbackDrill: true",
  "Persistence adapter must preserve AI generated package writer rollback drills.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratedPackageRollbackSnapshots: true",
  "Persistence adapter must require generated package rollback snapshots.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratedPackageRollbackVerification: true",
  "Persistence adapter must require generated package rollback verification.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratedPackageRollbackExecution: true",
  "Persistence adapter must block generated package rollback execution.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-writer-implementation-readiness-write",
  "Persistence adapter must include hosted AI generated package writer implementation readiness writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-writer-implementation-readiness-write",
  "Persistence adapter must include local AI generated package writer implementation readiness writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageWriterImplementationReadiness: true",
  "Persistence adapter must preserve AI generated package writer implementation readiness gates.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterModulePlan: true",
  "Persistence adapter must require package writer module plans.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterTestGates: true",
  "Persistence adapter must require package writer test gates.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterReleaseControls: true",
  "Persistence adapter must require package writer release controls.",
);
requireText(
  persistenceAdapter,
  "requiresCodexPackageWriterImplementationDecision: true",
  "Persistence adapter must require Codex package writer implementation decisions.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratedPackageWriterImplementation: true",
  "Persistence adapter must block generated package writer implementation.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-writer-module-test-plan-write",
  "Persistence adapter must include hosted AI generated package writer module test plan writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-writer-module-test-plan-write",
  "Persistence adapter must include local AI generated package writer module test plan writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageWriterModuleTestPlan: true",
  "Persistence adapter must preserve AI generated package writer module test plans.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterModuleTestSuites: true",
  "Persistence adapter must require package writer module test suites.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterTestEvidence: true",
  "Persistence adapter must require package writer test evidence.",
);
requireText(
  persistenceAdapter,
  "blocksPackageWriterTestExecution: true",
  "Persistence adapter must block package writer test execution.",
);
requireText(persistenceAdapter, "blocksPlaywrightRun: true", "Persistence adapter must block writer mutation browser runs.");
requireText(persistenceAdapter, "blocksAppFileWrite: true", "Persistence adapter must block app file patches.");
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-writer-test-evidence-packet-write",
  "Persistence adapter must include hosted AI generated package writer test evidence packet writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-writer-test-evidence-packet-write",
  "Persistence adapter must include local AI generated package writer test evidence packet writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageWriterTestEvidencePacket: true",
  "Persistence adapter must preserve AI generated package writer test evidence packets.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterEvidenceLanes: true",
  "Persistence adapter must require package writer evidence lanes.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterAcceptanceChecks: true",
  "Persistence adapter must require package writer acceptance checks.",
);
requireText(persistenceAdapter, "blocksEvidenceUpload: true", "Persistence adapter must block evidence upload.");
requireText(persistenceAdapter, "blocksSignedApprovalCapture: true", "Persistence adapter must block signed approval capture.");
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-writer-test-harness-plan-write",
  "Persistence adapter must include hosted AI generated package writer test harness plan writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-writer-test-harness-plan-write",
  "Persistence adapter must include local AI generated package writer test harness plan writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageWriterTestHarnessPlan: true",
  "Persistence adapter must preserve AI generated package writer test harness plans.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessPhases: true",
  "Persistence adapter must require package writer harness phases.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessAdapters: true",
  "Persistence adapter must require package writer harness adapters.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessPrerequisites: true",
  "Persistence adapter must require package writer harness prerequisites.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-writer-test-harness-implementation-proposal-write",
  "Persistence adapter must include hosted AI generated package writer test harness implementation proposal writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-writer-test-harness-implementation-proposal-write",
  "Persistence adapter must include local AI generated package writer test harness implementation proposal writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageWriterTestHarnessImplementationProposal: true",
  "Persistence adapter must preserve AI generated package writer test harness implementation proposals.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessImplementationModuleScope: true",
  "Persistence adapter must require package writer harness implementation module scope.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessImplementationReviewGates: true",
  "Persistence adapter must require package writer harness implementation review gates.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessDryRunOnlyChecks: true",
  "Persistence adapter must require package writer harness dry-run-only checks.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-writer-harness-implementation-decision-write",
  "Persistence adapter must include hosted AI generated package writer harness implementation decision writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-writer-harness-implementation-decision-write",
  "Persistence adapter must include local AI generated package writer harness implementation decision writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageWriterHarnessImplementationDecision: true",
  "Persistence adapter must preserve AI generated package writer harness implementation decisions.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessDecisionEvidence: true",
  "Persistence adapter must require package writer harness decision evidence.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessDecisionFileScope: true",
  "Persistence adapter must require package writer harness decision file scope.",
);
requireText(
  persistenceAdapter,
  "requiresPackageWriterHarnessDecisionOptions: true",
  "Persistence adapter must require package writer harness decision options.",
);
requireText(
  persistenceAdapter,
  "blocksHarnessImplementationApproval: true",
  "Persistence adapter must block harness implementation approval.",
);
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
requireText(
  persistenceAdapter,
  "hosted-ai-generated-publish-readiness-gate-write",
  "Persistence adapter must include hosted AI generated publish readiness gate writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-publish-readiness-gate-write",
  "Persistence adapter must include local AI generated publish readiness gate writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPublishReadinessGate: true",
  "Persistence adapter must preserve AI generated publish readiness checks.",
);
requireText(persistenceAdapter, "requiresVerifierPacketApproval: true", "Persistence adapter must require verifier packet approval.");
requireText(persistenceAdapter, "requiresManifestCompleteness: true", "Persistence adapter must require manifest completeness.");
requireText(persistenceAdapter, "requiresReleaseControlBinding: true", "Persistence adapter must require release-control binding.");
requireText(persistenceAdapter, "requiresTeacherApprovalLedger: true", "Persistence adapter must require teacher approval ledgers.");
requireText(
  persistenceAdapter,
  "hosted-ai-generator-tenant-coverage-gate-write",
  "Persistence adapter must include hosted AI generator tenant coverage gate writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generator-tenant-coverage-gate-write",
  "Persistence adapter must include local AI generator tenant coverage gate writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratorTenantCoverageGate: true",
  "Persistence adapter must preserve AI generator tenant coverage checks.",
);
requireText(
  persistenceAdapter,
  "requiresTenantSpecificGeneratorRecords: true",
  "Persistence adapter must require tenant-specific generator records.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratorRequestSubmission: true",
  "Persistence adapter must block generator request submission.",
);
requireText(persistenceAdapter, "blocksLiveModelCall: true", "Persistence adapter must block live model calls.");
requireText(persistenceAdapter, "blocksVerifierSubmission: true", "Persistence adapter must block verifier submission.");
requireText(
  persistenceAdapter,
  "hosted-ai-generator-review-summary-write",
  "Persistence adapter must include hosted AI generator review summary writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generator-review-summary-write",
  "Persistence adapter must include local AI generator review summary writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratorReviewSummary: true",
  "Persistence adapter must preserve AI generator review summaries.",
);
requireText(
  persistenceAdapter,
  "preservesGeneratorSectionReadiness: true",
  "Persistence adapter must preserve generator section readiness.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratorPrimaryBlockers: true",
  "Persistence adapter must require generator primary blockers.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratorNextRecords: true",
  "Persistence adapter must require generator next records.",
);
requireText(
  persistenceAdapter,
  "blocksAppPatchGeneration: true",
  "Persistence adapter must block app patch generation from review summaries.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generator-reviewer-runbook-write",
  "Persistence adapter must include hosted AI generator reviewer runbook writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generator-reviewer-runbook-write",
  "Persistence adapter must include local AI generator reviewer runbook writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratorReviewerRunbook: true",
  "Persistence adapter must preserve AI generator reviewer runbooks.",
);
requireText(
  persistenceAdapter,
  "preservesGeneratorReviewOrder: true",
  "Persistence adapter must preserve generator human review order.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratorRunbookEvidence: true",
  "Persistence adapter must require generator runbook evidence.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratorRunbookRequiredRecords: true",
  "Persistence adapter must require generator runbook source records.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratorRunbookShortcuts: true",
  "Persistence adapter must block generator runbook shortcuts.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generator-responsibility-matrix-write",
  "Persistence adapter must include hosted AI generator responsibility matrix writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generator-responsibility-matrix-write",
  "Persistence adapter must include local AI generator responsibility matrix writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratorResponsibilityMatrix: true",
  "Persistence adapter must preserve AI generator responsibility matrices.",
);
requireText(
  persistenceAdapter,
  "preservesGeneratorRoleOwnership: true",
  "Persistence adapter must preserve generator role ownership.",
);
requireText(
  persistenceAdapter,
  "requiresGeneratorHandoffRecords: true",
  "Persistence adapter must require generator handoff records.",
);
requireText(
  persistenceAdapter,
  "blocksExternalBuilderAuthority: true",
  "Persistence adapter must block external builder authority.",
);
requireText(
  persistenceAdapter,
  "blocksGeneratorResponsibilityShortcuts: true",
  "Persistence adapter must block generator responsibility shortcuts.",
);
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
requireText(persistenceAdapter, "preservesTeacherSessionSettingsReviewPacket: true", "Persistence adapter must preserve teacher session settings review packets.");
requireText(persistenceAdapter, "preservesTeacherSessionEventAcceptanceGate: true", "Persistence adapter must preserve teacher session event acceptance gates.");
requireText(schemaDraft, "settings_review_packet", "Backend schema draft must preserve teacher session settings review packets.");
requireText(migrationCandidates, "settings review packet", "Backend migration candidates must preserve teacher session settings review packets.");
requireText(migrationSpecs, "settings_review_packet", "Backend migration specs must preserve teacher session settings review packets.");
requireText(persistenceAdapter, "rejectsRawAudio: true", "Persistence adapter write intents must reject raw audio.");
requireText(persistenceAdapter, "rejectsTranscripts: true", "Persistence adapter write intents must reject transcripts.");
requireText(persistenceAdapter, "hosted-school-rollback-safe-fallback-restoration-preview-write", "Persistence adapter must include hosted school rollback safe fallback restoration preview writes.");
requireText(persistenceAdapter, "local-school-rollback-safe-fallback-restoration-preview-write", "Persistence adapter must include local school rollback safe fallback restoration preview writes.");
requireText(persistenceAdapter, "preservesSchoolRollbackSafeFallbackRestorationPreview: true", "Persistence adapter must preserve school rollback safe fallback restoration preview records.");
requireText(persistenceAdapter, "blocksLocalBundleRestoration: true", "Persistence adapter must block local bundle restoration.");
requireText(schemaDraft, "game_mode_settings_profile", "Backend schema must include game mode settings profiles.");
requireText(schemaDraft, "teacher_game_mode_settings_snapshot", "Backend schema must include teacher game mode settings snapshots.");
requireText(schemaDraft, "game_mode_settings_change_request", "Backend schema must include game mode settings change requests.");
requireText(schemaDraft, "learning_audio_priority", "Backend schema must preserve game mode settings learning-audio priority.");
requireText(schemaDraft, "support_language_progress_allowed", "Backend schema must block support-language progress in game settings.");
requireText(schemaDraft, "scoring_profile_id", "Backend schema must preserve game settings scoring profile authority.");
requireText(migrationCandidates, "m096-game-mode-settings-storage-records", "Backend migration candidates must include game mode settings storage records.");
requireText(migrationCandidates, "Game mode settings records must preserve learning-audio priority", "Backend migration candidates must include game mode settings standing rule.");
requireText(migrationSpecs, "spec-game-mode-settings-storage", "Backend migration specs must include game mode settings storage.");
requireText(migrationSpecs, "Support-language progress must remain false.", "Backend migration specs must keep support-language progress false for game settings.");
requireText(persistenceAdapter, "hosted-game-mode-settings-profile-write", "Persistence adapter must include hosted game mode settings profile writes.");
requireText(persistenceAdapter, "hosted-teacher-game-mode-settings-snapshot-write", "Persistence adapter must include hosted teacher game mode settings snapshot writes.");
requireText(persistenceAdapter, "hosted-game-mode-settings-change-request-write", "Persistence adapter must include hosted game mode settings change request writes.");
requireText(persistenceAdapter, "local-game-mode-settings-profile-write", "Persistence adapter must include local game mode settings profile writes.");
requireText(persistenceAdapter, "local-teacher-game-mode-settings-snapshot-write", "Persistence adapter must include local teacher game mode settings snapshot writes.");
requireText(persistenceAdapter, "local-game-mode-settings-change-request-write", "Persistence adapter must include local game mode settings change request writes.");
requireText(persistenceAdapter, "preservesGameModeSettingsProfile: true", "Persistence adapter must preserve game mode settings profiles.");
requireText(persistenceAdapter, "preservesTeacherGameModeSettingsSnapshot: true", "Persistence adapter must preserve teacher game mode settings snapshots.");
requireText(persistenceAdapter, "preservesGameModeSettingsChangeRequest: true", "Persistence adapter must preserve game mode settings change requests.");
requireText(persistenceAdapter, "blocksSupportLanguageProgress: true", "Persistence adapter must block support-language progress from game settings.");
requireText(persistenceAdapter, "blocksScoringProfileOverride: true", "Persistence adapter must block scoring profile overrides from game settings.");
requireText(persistenceAdapter, "blocksLiveTeacherSettingSave: true", "Persistence adapter must block live teacher setting saves.");
requireText(durableRecords, "ownsTeacherSessionSettings: true", "Durable record plan must assign teacher session settings to launch sessions.");
requireText(durableRecords, "preservesTeacherSessionSettingsReviewPacket: true", "Durable record plan must preserve teacher session settings review packets.");
requireText(durableRecords, "teacher-draft-package-record", "Durable record plan must include teacher draft packages.");
requireText(durableRecords, "preservesDraftReviewGate: true", "Durable record plan must preserve teacher draft review gates.");
requireText(durableRecords, "blocksDirectStudentAssignment: true", "Durable record plan must block direct draft assignment.");
requireText(durableRecords, "teacher-draft-review-handoff-record", "Durable record plan must include teacher draft review handoff packets.");
requireText(durableRecords, "preservesReviewPacketSections: true", "Durable record plan must preserve review handoff packet sections.");
requireText(durableRecords, "blocksLiveReviewSubmission: true", "Durable record plan must block live review submission.");
requireText(durableRecords, "teacher-draft-verifier-submission-record", "Durable record plan must include teacher draft verifier submission preflights.");
requireText(durableRecords, "preservesVerifierPreflightChecks: true", "Durable record plan must preserve verifier preflight checks.");
requireText(durableRecords, "blocksAutomaticVerifierSubmit: true", "Durable record plan must block automatic verifier submission.");
requireText(durableRecords, "ai-generation-request-packet-record", "Durable record plan must include AI generation request packet records.");
requireText(durableRecords, "ai-generation-request-packet-boundary", "Durable record plan must include AI generation request packet boundaries.");
requireText(durableRecords, "AI generation request packet record", "Durable record plan must expose AI generation request packet labels.");
requireText(durableRecords, "preservesAiGenerationRequestPacket: true", "Durable record plan must preserve AI generation request packets.");
requireText(durableRecords, "requiresRequestBuilderReviewPacket: true", "Durable record plan must require request-builder review packets.");
requireText(durableRecords, "requiresPremiumAiCostGate: true", "Durable record plan must require premium AI cost gates.");
requireText(durableRecords, "requiresAiGenerationSourceEvidence: true", "Durable record plan must require AI generation source evidence.");
requireText(durableRecords, "requiresAiGenerationAudioCoverage: true", "Durable record plan must require AI generation audio coverage.");
requireText(durableRecords, "requiresAiGenerationCompatibilitySnapshot: true", "Durable record plan must require AI generation compatibility snapshots.");
requireText(durableRecords, "ai-generated-game-build-brief-record", "Durable record plan must include AI generated game build brief records.");
requireText(durableRecords, "AI generated game build brief record", "Durable record plan must expose AI generated game build brief labels.");
requireText(
  durableRecords,
  "preservesAiGeneratedGameBuildBrief: true",
  "Durable record plan must preserve AI generated game build brief packets.",
);
requireText(
  durableRecords,
  "requiresParentEngineBinding: true",
  "Durable record plan must require parent-engine binding for generated game build briefs.",
);
requireText(
  durableRecords,
  "requiresStandardEventContract: true",
  "Durable record plan must require standard event contracts for generated game build briefs.",
);
requireText(
  durableRecords,
  "requiresAudioCueManifest: true",
  "Durable record plan must require audio cue manifests for generated game build briefs.",
);
requireText(
  durableRecords,
  "preservesDeterministicScoringContract: true",
  "Durable record plan must preserve deterministic scoring contracts for generated game build briefs.",
);
requireText(
  durableRecords,
  "blocksStandaloneGamePromotion: true",
  "Durable record plan must block standalone game promotion from generated game build briefs.",
);
requireText(durableRecords, "blocksPhaserBypass: true", "Durable record plan must block Phaser bypass.");
requireText(durableRecords, "blocksGeneratedGameRouteWrite: true", "Durable record plan must block generated game route writes.");
requireText(durableRecords, "blocksScoringProfileOverride: true", "Durable record plan must block generated game scoring profile overrides.");
requireText(durableRecords, "ai-external-prototype-task-packet-record", "Durable record plan must include AI external prototype task packet records.");
requireText(durableRecords, "AI external prototype task packet record", "Durable record plan must expose AI external prototype task packet labels.");
requireText(
  durableRecords,
  "preservesAiExternalPrototypeTaskPacket: true",
  "Durable record plan must preserve AI external prototype task packets.",
);
requireText(
  durableRecords,
  "requiresExternalPrototypeTaskScope: true",
  "Durable record plan must require external prototype task scope.",
);
requireText(
  durableRecords,
  "requiresExternalPrototypeHandoffContents: true",
  "Durable record plan must require external prototype handoff contents.",
);
requireText(
  durableRecords,
  "requiresExternalPrototypeReturnEvidence: true",
  "Durable record plan must require external prototype return evidence.",
);
requireText(
  durableRecords,
  "blocksExternalPrototypeLiveHandoff: true",
  "Durable record plan must block live external prototype handoff.",
);
requireText(
  durableRecords,
  "blocksExternalBuilderAuthority: true",
  "Durable record plan must block external builder authority.",
);
requireText(
  durableRecords,
  "blocksExternalPrototypeTaskShortcuts: true",
  "Durable record plan must block external prototype task shortcuts.",
);
requireText(
  durableRecords,
  "ai-external-task-export-readiness-gate-record",
  "Durable record plan must include AI external task export readiness gate records.",
);
requireText(
  durableRecords,
  "AI external task export readiness gate record",
  "Durable record plan must expose AI external task export readiness gate labels.",
);
requireText(
  durableRecords,
  "preservesAiExternalTaskExportReadinessGate: true",
  "Durable record plan must preserve AI external task export readiness gates.",
);
requireText(
  durableRecords,
  "requiresExternalTaskExportChannels: true",
  "Durable record plan must require external task export channels.",
);
requireText(
  durableRecords,
  "requiresExternalTaskExportReadinessChecks: true",
  "Durable record plan must require external task export readiness checks.",
);
requireText(durableRecords, "blocksExternalTaskExport: true", "Durable record plan must block external task export.");
requireText(durableRecords, "blocksPromptCopyAction: true", "Durable record plan must block prompt copy actions.");
requireText(durableRecords, "blocksRepositoryIssueCreation: true", "Durable record plan must block repository issue creation.");
requireText(durableRecords, "blocksArchiveDownload: true", "Durable record plan must block archive downloads.");
requireText(durableRecords, "ai-prototype-return-review-record", "Durable record plan must include AI prototype return review records.");
requireText(durableRecords, "AI prototype return review record", "Durable record plan must expose AI prototype return review labels.");
requireText(
  durableRecords,
  "preservesAiPrototypeReturnReview: true",
  "Durable record plan must preserve AI prototype return review sections.",
);
requireText(
  durableRecords,
  "requiresPrototypeArtifactEvidence: true",
  "Durable record plan must require returned prototype artifact evidence.",
);
requireText(durableRecords, "requiresJsonFixtureConformance: true", "Durable record plan must require JSON fixture conformance.");
requireText(durableRecords, "requiresStandardEventReplay: true", "Durable record plan must require standard event replay.");
requireText(durableRecords, "requiresAudioCueCoverageReview: true", "Durable record plan must require audio cue coverage review.");
requireText(durableRecords, "requiresMobileAccessibilityReview: true", "Durable record plan must require mobile accessibility review.");
requireText(durableRecords, "blocksProductionMerge: true", "Durable record plan must block prototype production merge.");
requireText(durableRecords, "blocksAudioManifestMutation: true", "Durable record plan must block audio manifest mutations.");
requireText(
  durableRecords,
  "blocksStudentFacingPrototypePreview: true",
  "Durable record plan must block student-facing prototype previews.",
);
requireText(durableRecords, "ai-prototype-integration-plan-record", "Durable record plan must include AI prototype integration plan records.");
requireText(durableRecords, "AI prototype integration plan record", "Durable record plan must expose AI prototype integration plan labels.");
requireText(
  durableRecords,
  "preservesAiPrototypeIntegrationPlan: true",
  "Durable record plan must preserve AI prototype integration plan sections.",
);
requireText(durableRecords, "requiresWrapperAdapterReview: true", "Durable record plan must require wrapper adapter review.");
requireText(durableRecords, "requiresFixtureReplayReport: true", "Durable record plan must require fixture replay reports.");
requireText(durableRecords, "requiresEventReplayReport: true", "Durable record plan must require event replay reports.");
requireText(durableRecords, "requiresAudioCoverageReport: true", "Durable record plan must require audio coverage reports.");
requireText(durableRecords, "requiresScoringReplayReport: true", "Durable record plan must require scoring replay reports.");
requireText(durableRecords, "blocksDirectAppImport: true", "Durable record plan must block direct app imports.");
requireText(durableRecords, "blocksGameSequenceMutation: true", "Durable record plan must block game sequence mutations.");
requireText(durableRecords, "blocksPackagePromotion: true", "Durable record plan must block package promotion.");
requireText(
  durableRecords,
  "ai-prototype-wrapper-adapter-review-record",
  "Durable record plan must include AI prototype wrapper adapter review records.",
);
requireText(
  durableRecords,
  "AI prototype wrapper adapter review record",
  "Durable record plan must expose AI prototype wrapper adapter review labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypeWrapperAdapterReview: true",
  "Durable record plan must preserve AI prototype wrapper adapter review sections.",
);
requireText(durableRecords, "requiresFixtureInputContract: true", "Durable record plan must require fixture input contracts.");
requireText(
  durableRecords,
  "requiresStandardEventOutputContract: true",
  "Durable record plan must require standard event output contracts.",
);
requireText(durableRecords, "requiresStateOwnershipRules: true", "Durable record plan must require state ownership rules.");
requireText(durableRecords, "requiresWrapperEvidence: true", "Durable record plan must require wrapper evidence.");
requireText(durableRecords, "requiresRejectionTriggers: true", "Durable record plan must require rejection triggers.");
requireText(durableRecords, "blocksEventContractBypass: true", "Durable record plan must block event contract bypass.");
requireText(durableRecords, "blocksTenantHardCoding: true", "Durable record plan must block tenant hard-coding.");
requireText(
  durableRecords,
  "ai-prototype-fixture-replay-report-record",
  "Durable record plan must include AI prototype fixture replay report records.",
);
requireText(
  durableRecords,
  "AI prototype fixture replay report record",
  "Durable record plan must expose AI prototype fixture replay report labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypeFixtureReplayReport: true",
  "Durable record plan must preserve AI prototype fixture replay report sections.",
);
requireText(
  durableRecords,
  "requiresReviewedUnitJsonFixture: true",
  "Durable record plan must require reviewed unit JSON fixtures.",
);
requireText(durableRecords, "requiresFixtureCoverage: true", "Durable record plan must require fixture coverage.");
requireText(
  durableRecords,
  "requiresFixtureReplayEvidence: true",
  "Durable record plan must require fixture replay evidence.",
);
requireText(
  durableRecords,
  "requiresTargetLanguageProgressTrigger: true",
  "Durable record plan must require target-language progress triggers.",
);
requireText(durableRecords, "blocksHardCodedUnitText: true", "Durable record plan must block hard-coded unit text.");
requireText(
  durableRecords,
  "ai-prototype-event-replay-report-record",
  "Durable record plan must include AI prototype event replay report records.",
);
requireText(
  durableRecords,
  "AI prototype event replay report record",
  "Durable record plan must expose AI prototype event replay report labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypeEventReplayReport: true",
  "Durable record plan must preserve AI prototype event replay report sections.",
);
requireText(durableRecords, "requiresStandardEventCoverage: true", "Durable record plan must require standard event coverage.");
requireText(durableRecords, "requiresRequiredEventOrder: true", "Durable record plan must require event order checks.");
requireText(
  durableRecords,
  "requiresAllowedEventPayloadFields: true",
  "Durable record plan must require allowed event payload fields.",
);
requireText(durableRecords, "requiresAcceptedProgressEffects: true", "Durable record plan must require accepted progress effects.");
requireText(durableRecords, "blocksHiddenProgressStream: true", "Durable record plan must block hidden progress streams.");
requireText(durableRecords, "blocksScoreAuthority: true", "Durable record plan must block wrapper score authority.");
requireText(durableRecords, "blocksRouteStateOwnership: true", "Durable record plan must block route state ownership.");
requireText(durableRecords, "blocksAudioManifestAuthority: true", "Durable record plan must block audio manifest authority.");
requireText(durableRecords, "blocksRewardInventoryWrite: true", "Durable record plan must block reward inventory writes.");
requireText(
  durableRecords,
  "blocksSupportLanguageProgressTrigger: true",
  "Durable record plan must block support-language progress triggers.",
);
requireText(
  durableRecords,
  "ai-prototype-audio-coverage-report-record",
  "Durable record plan must include AI prototype audio coverage report records.",
);
requireText(
  durableRecords,
  "AI prototype audio coverage report record",
  "Durable record plan must expose AI prototype audio coverage report labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypeAudioCoverageReport: true",
  "Durable record plan must preserve AI prototype audio coverage report sections.",
);
requireText(
  durableRecords,
  "requiresTargetLanguageAudioCoverage: true",
  "Durable record plan must require target-language audio coverage.",
);
requireText(durableRecords, "requiresControlAudioCoverage: true", "Durable record plan must require control audio coverage.");
requireText(
  durableRecords,
  "requiresSupportLanguageAudioRules: true",
  "Durable record plan must require support-language audio rules.",
);
requireText(durableRecords, "requiresAudioReplayEvidence: true", "Durable record plan must require audio replay evidence.");
requireText(durableRecords, "blocksGeneratedVoiceCall: true", "Durable record plan must block generated voice calls.");
requireText(durableRecords, "blocksVoiceApiCost: true", "Durable record plan must block voice API cost.");
requireText(durableRecords, "blocksMediaOnlyMastery: true", "Durable record plan must block media-only mastery.");
requireText(
  durableRecords,
  "blocksPackageAudioCompleteMarker: true",
  "Durable record plan must block package audio-complete markers.",
);
requireText(
  durableRecords,
  "ai-prototype-mobile-accessibility-report-record",
  "Durable record plan must include AI prototype mobile accessibility report records.",
);
requireText(
  durableRecords,
  "AI prototype mobile accessibility report record",
  "Durable record plan must expose AI prototype mobile accessibility report labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypeMobileAccessibilityReport: true",
  "Durable record plan must preserve AI prototype mobile accessibility report sections.",
);
requireText(
  durableRecords,
  "requiresMobileViewportEvidence: true",
  "Durable record plan must require mobile viewport evidence.",
);
requireText(durableRecords, "requiresTouchTargetChecks: true", "Durable record plan must require touch target checks.");
requireText(durableRecords, "requiresKeyboardFocusChecks: true", "Durable record plan must require keyboard and focus checks.");
requireText(durableRecords, "requiresReadableTextChecks: true", "Durable record plan must require readable text checks.");
requireText(durableRecords, "requiresVisualStabilityChecks: true", "Durable record plan must require visual stability checks.");
requireText(
  durableRecords,
  "requiresAccessibleWrapperControls: true",
  "Durable record plan must require accessible wrapper controls.",
);
requireText(durableRecords, "blocksAccessibilityWaiver: true", "Durable record plan must block accessibility waivers.");
requireText(
  durableRecords,
  "blocksStudentFacingPrototypePreview: true",
  "Durable record plan must block student-facing prototype previews.",
);
requireText(
  durableRecords,
  "ai-prototype-scoring-replay-report-record",
  "Durable record plan must include AI prototype scoring replay report records.",
);
requireText(
  durableRecords,
  "AI prototype scoring replay report record",
  "Durable record plan must expose AI prototype scoring replay report labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypeScoringReplayReport: true",
  "Durable record plan must preserve AI prototype scoring replay report sections.",
);
requireText(
  durableRecords,
  "requiresDeterministicScoringReplay: true",
  "Durable record plan must require deterministic scoring replay.",
);
requireText(
  durableRecords,
  "requiresScoringProfileSnapshot: true",
  "Durable record plan must require scoring profile snapshots.",
);
requireText(
  durableRecords,
  "requiresMasteryThresholdReplay: true",
  "Durable record plan must require mastery threshold replay.",
);
requireText(
  durableRecords,
  "requiresRewardBoundaryChecks: true",
  "Durable record plan must require reward boundary checks.",
);
requireText(durableRecords, "blocksScoringProfileOverride: true", "Durable record plan must block scoring profile overrides.");
requireText(durableRecords, "blocksStarDustWrite: true", "Durable record plan must block Star Dust writes.");
requireText(
  durableRecords,
  "blocksGeneratedSurpriseRewards: true",
  "Durable record plan must block generated surprise rewards.",
);
requireText(
  durableRecords,
  "ai-prototype-integration-readiness-gate-record",
  "Durable record plan must include AI prototype integration readiness gate records.",
);
requireText(
  durableRecords,
  "AI prototype integration readiness gate record",
  "Durable record plan must expose AI prototype integration readiness gate labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypeIntegrationReadinessGate: true",
  "Durable record plan must preserve AI prototype integration readiness gate sections.",
);
requireText(
  durableRecords,
  "requiresAllPrototypeEvidenceReviewed: true",
  "Durable record plan must require all prototype evidence reviewed.",
);
requireText(
  durableRecords,
  "requiresCodexIntegrationReviewDecision: true",
  "Durable record plan must require Codex integration review decisions.",
);
requireText(durableRecords, "blocksStudentFacingRoute: true", "Durable record plan must block student-facing routes.");
requireText(
  durableRecords,
  "codex-integration-review-decision-record",
  "Durable record plan must include Codex integration review decision records.",
);
requireText(
  durableRecords,
  "Codex integration review decision record",
  "Durable record plan must expose Codex integration review decision labels.",
);
requireText(
  durableRecords,
  "preservesCodexIntegrationReviewDecision: true",
  "Durable record plan must preserve Codex integration review decisions.",
);
requireText(
  durableRecords,
  "requiresManualCodexReview: true",
  "Durable record plan must require manual Codex reviews.",
);
requireText(
  durableRecords,
  "blocksAppPatchGeneration: true",
  "Durable record plan must block app patch generation.",
);
requireText(durableRecords, "ai-prototype-app-patch-proposal-record", "Durable record plan must include AI prototype app patch proposal records.");
requireText(durableRecords, "AI prototype app patch proposal record", "Durable record plan must expose AI prototype app patch proposal labels.");
requireText(
  durableRecords,
  "preservesAiPrototypeAppPatchProposal: true",
  "Durable record plan must preserve AI prototype app patch proposals.",
);
requireText(
  durableRecords,
  "requiresProposedPatchFileScope: true",
  "Durable record plan must require proposed app patch file scope.",
);
requireText(durableRecords, "requiresPrePatchGates: true", "Durable record plan must require pre-patch gates.");
requireText(durableRecords, "requiresPatchTestGates: true", "Durable record plan must require patch test gates.");
requireText(
  durableRecords,
  "requiresReviewerIdentitySignatureGate: true",
  "Durable record plan must require reviewer identity signature gates for app patch proposals.",
);
requireText(
  durableRecords,
  "requiresReleaseControlBinding: true",
  "Durable record plan must require release-control binding for app patch proposals.",
);
requireText(durableRecords, "blocksAppFileWrite: true", "Durable record plan must block app file writes.");
requireText(
  durableRecords,
  "ai-prototype-patch-test-readiness-gate-record",
  "Durable record plan must include AI prototype patch test readiness gate records.",
);
requireText(
  durableRecords,
  "AI prototype patch test readiness gate record",
  "Durable record plan must expose AI prototype patch test readiness gate labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypePatchTestReadinessGate: true",
  "Durable record plan must preserve AI prototype patch test readiness gates.",
);
requireText(
  durableRecords,
  "requiresPatchTestHarnessPlan: true",
  "Durable record plan must require patch test harness plans.",
);
requireText(
  durableRecords,
  "requiresRouteSafetyReleaseGate: true",
  "Durable record plan must require route safety release gates.",
);
requireText(
  durableRecords,
  "requiresRollbackDrillRecord: true",
  "Durable record plan must require rollback drill records.",
);
requireText(
  durableRecords,
  "requiresStorageContractVerification: true",
  "Durable record plan must require storage contract verification.",
);
requireText(
  durableRecords,
  "requiresCodexPatchApprovalDecision: true",
  "Durable record plan must require Codex patch approval decisions.",
);
requireText(durableRecords, "blocksTestExecution: true", "Durable record plan must block patch test execution.");
requireText(
  durableRecords,
  "ai-prototype-patch-test-harness-plan-record",
  "Durable record plan must include AI prototype patch test harness plan records.",
);
requireText(
  durableRecords,
  "AI prototype patch test harness plan record",
  "Durable record plan must expose AI prototype patch test harness plan labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypePatchTestHarnessPlan: true",
  "Durable record plan must preserve AI prototype patch test harness plans.",
);
requireText(
  durableRecords,
  "requiresHarnessRuntimePolicy: true",
  "Durable record plan must require harness runtime policy.",
);
requireText(
  durableRecords,
  "requiresHarnessRequiredInputs: true",
  "Durable record plan must require harness required inputs.",
);
requireText(
  durableRecords,
  "requiresHarnessSectionCoverage: true",
  "Durable record plan must require harness section coverage.",
);
requireText(
  durableRecords,
  "requiresHarnessNonExecutionOutputs: true",
  "Durable record plan must require non-execution outputs.",
);
requireText(durableRecords, "blocksPlaywrightRun: true", "Durable record plan must block Playwright runs.");
requireText(
  durableRecords,
  "ai-prototype-patch-harness-implementation-proposal-record",
  "Durable record plan must include AI prototype patch harness implementation proposal records.",
);
requireText(
  durableRecords,
  "AI prototype patch harness implementation proposal record",
  "Durable record plan must expose AI prototype patch harness implementation proposal labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypePatchHarnessImplementationProposal: true",
  "Durable record plan must preserve AI prototype patch harness implementation proposals.",
);
requireText(
  durableRecords,
  "requiresHarnessImplementationFileScopeReview: true",
  "Durable record plan must require harness implementation file-scope review.",
);
requireText(
  durableRecords,
  "requiresHarnessImplementationReviewGates: true",
  "Durable record plan must require harness implementation review gates.",
);
requireText(durableRecords, "requiresDryRunOnlyChecks: true", "Durable record plan must require dry-run-only checks.");
requireText(durableRecords, "blocksHarnessImplementation: true", "Durable record plan must block harness implementation.");
requireText(
  durableRecords,
  "codex-patch-approval-decision-record",
  "Durable record plan must include Codex patch approval decision records.",
);
requireText(
  durableRecords,
  "Codex patch approval decision record",
  "Durable record plan must expose Codex patch approval decision labels.",
);
requireText(
  durableRecords,
  "preservesCodexPatchApprovalDecision: true",
  "Durable record plan must preserve Codex patch approval decisions.",
);
requireText(
  durableRecords,
  "requiresPatchApprovalEvidenceChecks: true",
  "Durable record plan must require patch approval evidence checks.",
);
requireText(durableRecords, "requiresPatchScopeReview: true", "Durable record plan must require patch scope review.");
requireText(
  durableRecords,
  "codex-patch-approval-decision-boundary",
  "Durable record plan must include Codex patch approval decision boundaries.",
);
requireText(
  durableRecords,
  "ai-prototype-signed-approval-preflight-record",
  "Durable record plan must include AI prototype signed approval preflight records.",
);
requireText(
  durableRecords,
  "AI prototype signed approval preflight record",
  "Durable record plan must expose AI prototype signed approval preflight labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypeSignedApprovalPreflight: true",
  "Durable record plan must preserve AI prototype signed approval preflights.",
);
requireText(
  durableRecords,
  "requiresSignedApprovalPreflightScopeLocks: true",
  "Durable record plan must require signed approval scope locks.",
);
requireText(
  durableRecords,
  "requiresApprovalRecordDraftFields: true",
  "Durable record plan must require approval record draft fields.",
);
requireText(
  durableRecords,
  "requiresCannotApproveWhileChecks: true",
  "Durable record plan must require cannot-approve-while checks.",
);
requireText(
  durableRecords,
  "requiresSignedApprovalEvidenceChecklist: true",
  "Durable record plan must require signed approval evidence checklists.",
);
requireText(
  durableRecords,
  "ai-prototype-signed-approval-preflight-boundary",
  "Durable record plan must include AI prototype signed approval preflight boundaries.",
);
requireText(
  durableRecords,
  "ai-prototype-patch-authorization-release-lock-record",
  "Durable record plan must include AI prototype patch authorization release lock records.",
);
requireText(
  durableRecords,
  "AI prototype patch authorization release lock record",
  "Durable record plan must expose AI prototype patch authorization release lock labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypePatchAuthorizationReleaseLock: true",
  "Durable record plan must preserve AI prototype patch authorization release locks.",
);
requireText(
  durableRecords,
  "requiresPatchAuthorizationReleaseLocks: true",
  "Durable record plan must require patch authorization release locks.",
);
requireText(
  durableRecords,
  "requiresPatchAuthorizationScope: true",
  "Durable record plan must require patch authorization scope.",
);
requireText(
  durableRecords,
  "requiresForbiddenUntilUnlockedChecks: true",
  "Durable record plan must require forbidden-until-unlocked checks.",
);
requireText(durableRecords, "requiresReleaseEvidence: true", "Durable record plan must require release evidence.");
requireText(
  durableRecords,
  "ai-prototype-patch-authorization-release-lock-boundary",
  "Durable record plan must include AI prototype patch authorization release lock boundaries.",
);
requireText(
  durableRecords,
  "ai-prototype-patch-implementation-work-order-record",
  "Durable record plan must include AI prototype patch implementation work order records.",
);
requireText(
  durableRecords,
  "AI prototype patch implementation work order record",
  "Durable record plan must expose AI prototype patch implementation work order labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypePatchImplementationWorkOrder: true",
  "Durable record plan must preserve AI prototype patch implementation work orders.",
);
requireText(
  durableRecords,
  "requiresPatchImplementationRequiredBeforeWork: true",
  "Durable record plan must require patch implementation required-before-work records.",
);
requireText(
  durableRecords,
  "requiresPatchImplementationFileGroups: true",
  "Durable record plan must require patch implementation file groups.",
);
requireText(
  durableRecords,
  "requiresPatchImplementationDryRunOrder: true",
  "Durable record plan must require patch implementation dry-run order.",
);
requireText(
  durableRecords,
  "requiresPatchImplementationRollbackPlan: true",
  "Durable record plan must require patch implementation rollback plans.",
);
requireText(durableRecords, "blocksWorkOrderExecution: true", "Durable record plan must block work order execution.");
requireText(
  durableRecords,
  "ai-prototype-patch-implementation-work-order-boundary",
  "Durable record plan must include AI prototype patch implementation work order boundaries.",
);
requireText(
  durableRecords,
  "ai-prototype-patch-change-set-preview-record",
  "Durable record plan must include AI prototype patch change set preview records.",
);
requireText(
  durableRecords,
  "AI prototype patch change set preview record",
  "Durable record plan must expose AI prototype patch change set preview labels.",
);
requireText(
  durableRecords,
  "preservesAiPrototypePatchChangeSetPreview: true",
  "Durable record plan must preserve AI prototype patch change set previews.",
);
requireText(
  durableRecords,
  "requiresPatchChangeSetPlannedFileChanges: true",
  "Durable record plan must require patch change set planned file changes.",
);
requireText(
  durableRecords,
  "requiresPatchChangeSetInvariantChecks: true",
  "Durable record plan must require patch change set invariant checks.",
);
requireText(
  durableRecords,
  "requiresPatchChangeSetReviewBlockers: true",
  "Durable record plan must require patch change set review blockers.",
);
requireText(
  durableRecords,
  "requiresPatchChangeSetNextRecords: true",
  "Durable record plan must require patch change set next records.",
);
requireText(durableRecords, "blocksApplyPatch: true", "Durable record plan must block apply-patch actions.");
requireText(durableRecords, "blocksGeneratedFileWrite: true", "Durable record plan must block generated file writes.");
requireText(
  durableRecords,
  "ai-prototype-patch-change-set-preview-boundary",
  "Durable record plan must include AI prototype patch change set preview boundaries.",
);
requireText(
  persistenceAdapter,
  "hosted-codex-patch-approval-decision-write",
  "Persistence adapter must include hosted Codex patch approval decision writes.",
);
requireText(
  persistenceAdapter,
  "local-codex-patch-approval-decision-write",
  "Persistence adapter must include local Codex patch approval decision writes.",
);
requireText(
  persistenceAdapter,
  "preservesCodexPatchApprovalDecision: true",
  "Persistence adapter must preserve Codex patch approval decisions.",
);
requireText(
  persistenceAdapter,
  "requiresPatchApprovalEvidenceChecks: true",
  "Persistence adapter must require patch approval evidence checks.",
);
requireText(persistenceAdapter, "requiresPatchScopeReview: true", "Persistence adapter must require patch scope review.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-signed-approval-preflight-write",
  "Persistence adapter must include hosted AI prototype signed approval preflight writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-signed-approval-preflight-write",
  "Persistence adapter must include local AI prototype signed approval preflight writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypeSignedApprovalPreflight: true",
  "Persistence adapter must preserve AI prototype signed approval preflights.",
);
requireText(
  persistenceAdapter,
  "requiresSignedApprovalPreflightScopeLocks: true",
  "Persistence adapter must require signed approval scope locks.",
);
requireText(
  persistenceAdapter,
  "requiresApprovalRecordDraftFields: true",
  "Persistence adapter must require approval record draft fields.",
);
requireText(
  persistenceAdapter,
  "requiresCannotApproveWhileChecks: true",
  "Persistence adapter must require cannot-approve-while checks.",
);
requireText(
  persistenceAdapter,
  "requiresSignedApprovalEvidenceChecklist: true",
  "Persistence adapter must require signed approval evidence checklists.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-patch-authorization-release-lock-write",
  "Persistence adapter must include hosted AI prototype patch authorization release lock writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-patch-authorization-release-lock-write",
  "Persistence adapter must include local AI prototype patch authorization release lock writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypePatchAuthorizationReleaseLock: true",
  "Persistence adapter must preserve AI prototype patch authorization release locks.",
);
requireText(
  persistenceAdapter,
  "requiresPatchAuthorizationReleaseLocks: true",
  "Persistence adapter must require patch authorization release locks.",
);
requireText(
  persistenceAdapter,
  "requiresPatchAuthorizationScope: true",
  "Persistence adapter must require patch authorization scope.",
);
requireText(
  persistenceAdapter,
  "requiresForbiddenUntilUnlockedChecks: true",
  "Persistence adapter must require forbidden-until-unlocked checks.",
);
requireText(persistenceAdapter, "requiresReleaseEvidence: true", "Persistence adapter must require release evidence.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-patch-implementation-work-order-write",
  "Persistence adapter must include hosted AI prototype patch implementation work order writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-patch-implementation-work-order-write",
  "Persistence adapter must include local AI prototype patch implementation work order writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypePatchImplementationWorkOrder: true",
  "Persistence adapter must preserve AI prototype patch implementation work orders.",
);
requireText(
  persistenceAdapter,
  "requiresPatchImplementationRequiredBeforeWork: true",
  "Persistence adapter must require patch implementation required-before-work records.",
);
requireText(
  persistenceAdapter,
  "requiresPatchImplementationFileGroups: true",
  "Persistence adapter must require patch implementation file groups.",
);
requireText(
  persistenceAdapter,
  "requiresPatchImplementationDryRunOrder: true",
  "Persistence adapter must require patch implementation dry-run order.",
);
requireText(
  persistenceAdapter,
  "requiresPatchImplementationRollbackPlan: true",
  "Persistence adapter must require patch implementation rollback plans.",
);
requireText(persistenceAdapter, "blocksWorkOrderExecution: true", "Persistence adapter must block work order execution.");
requireText(
  persistenceAdapter,
  "hosted-ai-prototype-patch-change-set-preview-write",
  "Persistence adapter must include hosted AI prototype patch change set preview writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-prototype-patch-change-set-preview-write",
  "Persistence adapter must include local AI prototype patch change set preview writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiPrototypePatchChangeSetPreview: true",
  "Persistence adapter must preserve AI prototype patch change set previews.",
);
requireText(
  persistenceAdapter,
  "requiresPatchChangeSetPlannedFileChanges: true",
  "Persistence adapter must require patch change set planned file changes.",
);
requireText(
  persistenceAdapter,
  "requiresPatchChangeSetInvariantChecks: true",
  "Persistence adapter must require patch change set invariant checks.",
);
requireText(
  persistenceAdapter,
  "requiresPatchChangeSetReviewBlockers: true",
  "Persistence adapter must require patch change set review blockers.",
);
requireText(
  persistenceAdapter,
  "requiresPatchChangeSetNextRecords: true",
  "Persistence adapter must require patch change set next records.",
);
requireText(persistenceAdapter, "blocksApplyPatch: true", "Persistence adapter must block apply-patch actions.");
requireText(persistenceAdapter, "blocksGeneratedFileWrite: true", "Persistence adapter must block generated file writes.");
requireText(
  durableRecords,
  "target-language-audio-approval-record",
  "Durable record plan must include target-language audio approval records.",
);
requireText(
  durableRecords,
  "Target-language audio approval record",
  "Durable record plan must expose target-language audio approval labels.",
);
requireText(
  durableRecords,
  "preservesTargetLanguageAudioApproval: true",
  "Durable record plan must preserve target-language audio approval packets.",
);
requireText(
  durableRecords,
  "requiresAudioApprovalCueReview: true",
  "Durable record plan must require target-language audio cue review.",
);
requireText(
  durableRecords,
  "requiresAudioApprovalProgressBoundaries: true",
  "Durable record plan must require target-language audio progress boundaries.",
);
requireText(
  durableRecords,
  "target-language-audio-approval-boundary",
  "Durable record plan must include target-language audio approval boundaries.",
);
requireText(
  persistenceAdapter,
  "hosted-target-language-audio-approval-write",
  "Persistence adapter must include hosted target-language audio approval writes.",
);
requireText(
  persistenceAdapter,
  "local-target-language-audio-approval-write",
  "Persistence adapter must include local target-language audio approval writes.",
);
requireText(
  persistenceAdapter,
  "preservesTargetLanguageAudioApproval: true",
  "Persistence adapter must preserve target-language audio approval packets.",
);
requireText(
  persistenceAdapter,
  "requiresAudioApprovalCueReview: true",
  "Persistence adapter must require target-language audio cue review.",
);
requireText(
  persistenceAdapter,
  "requiresAudioApprovalProgressBoundaries: true",
  "Persistence adapter must require target-language audio progress boundaries.",
);
requireText(
  durableRecords,
  "ai-generated-package-teacher-review-packet-record",
  "Durable record plan must include AI generated package teacher review packet records.",
);
requireText(
  durableRecords,
  "AI generated package teacher review packet record",
  "Durable record plan must expose AI generated package teacher review packet labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageTeacherReviewPacket: true",
  "Durable record plan must preserve AI generated package teacher review packets.",
);
requireText(
  durableRecords,
  "requiresTeacherReviewDecisionLanes: true",
  "Durable record plan must require generated teacher review decision lanes.",
);
requireText(
  durableRecords,
  "requiresTeacherReviewMissingEvidence: true",
  "Durable record plan must require generated teacher review missing evidence.",
);
requireText(
  durableRecords,
  "blocksApprovalCapture: true",
  "Durable record plan must block generated teacher review approval capture.",
);
requireText(
  durableRecords,
  "ai-generated-package-teacher-review-packet-boundary",
  "Durable record plan must include AI generated package teacher review packet boundaries.",
);
requireText(
  persistenceAdapter,
  "hosted-ai-generated-package-teacher-review-packet-write",
  "Persistence adapter must include hosted AI generated package teacher review packet writes.",
);
requireText(
  persistenceAdapter,
  "local-ai-generated-package-teacher-review-packet-write",
  "Persistence adapter must include local AI generated package teacher review packet writes.",
);
requireText(
  persistenceAdapter,
  "preservesAiGeneratedPackageTeacherReviewPacket: true",
  "Persistence adapter must preserve AI generated package teacher review packets.",
);
requireText(durableRecords, "ai-generated-package-manifest-record", "Durable record plan must include AI generated package manifest records.");
requireText(durableRecords, "AI generated package manifest record", "Durable record plan must expose AI generated package manifest record labels.");
requireText(durableRecords, "preservesAiGeneratedPackageManifest: true", "Durable record plan must preserve AI generated package manifest links.");
requireText(durableRecords, "blocksGeneratedPackageAssembly: true", "Durable record plan must block generated package assembly.");
requireText(durableRecords, "blocksGeneratedPackageRouteWrite: true", "Durable record plan must block generated package route registry writes.");
requireText(durableRecords, "blocksGeneratedPackagePlaylistWrite: true", "Durable record plan must block generated package media playlist writes.");
requireText(durableRecords, "blocksGeneratedPackageAssignment: true", "Durable record plan must block generated package assignments.");
requireText(durableRecords, "blocksGeneratedPackageLocalBundleWrite: true", "Durable record plan must block generated package local bundle writes.");
requireText(durableRecords, "blocksStudentReadyMarker: true", "Durable record plan must block generated package student-ready markers.");
requireText(
  durableRecords,
  "ai-generated-package-promotion-checklist-record",
  "Durable record plan must include AI generated package promotion checklist records.",
);
requireText(
  durableRecords,
  "AI generated package promotion checklist record",
  "Durable record plan must expose AI generated package promotion checklist labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackagePromotionChecklist: true",
  "Durable record plan must preserve AI generated package promotion checklist steps.",
);
requireText(durableRecords, "requiresLineageMap: true", "Durable record plan must require generated package lineage maps.");
requireText(
  durableRecords,
  "requiresTargetLanguageAudioApproval: true",
  "Durable record plan must require target-language audio approval before generated package promotion.",
);
requireText(
  durableRecords,
  "blocksGeneratedPackagePromotion: true",
  "Durable record plan must block generated package promotion.",
);
requireText(
  durableRecords,
  "ai-generated-package-release-candidate-record",
  "Durable record plan must include AI generated package release candidate records.",
);
requireText(
  durableRecords,
  "AI generated package release candidate record",
  "Durable record plan must expose AI generated package release candidate labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageReleaseCandidate: true",
  "Durable record plan must preserve AI generated package release candidate signals.",
);
requireText(durableRecords, "requiresPrivateLibraryTarget: true", "Durable record plan must require private library targets.");
requireText(
  durableRecords,
  "blocksGeneratedPackageLibraryPublish: true",
  "Durable record plan must block generated package library publish.",
);
requireText(durableRecords, "blocksReleaseCandidateWrite: true", "Durable record plan must block release candidate writes.");
requireText(durableRecords, "blocksTenantLibraryItemWrite: true", "Durable record plan must block tenant library item writes.");
requireText(durableRecords, "blocksStudentFacingRelease: true", "Durable record plan must block student-facing release.");
requireText(
  durableRecords,
  "blocksGeneratedLocalBundleRelease: true",
  "Durable record plan must block generated local bundle release.",
);
requireText(durableRecords, "blocksSupportLanguageRelease: true", "Durable record plan must block support-language release.");
requireText(
  durableRecords,
  "ai-generated-package-assembly-readiness-record",
  "Durable record plan must include AI generated package assembly readiness records.",
);
requireText(
  durableRecords,
  "AI generated package assembly readiness record",
  "Durable record plan must expose AI generated package assembly readiness labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageAssemblyReadiness: true",
  "Durable record plan must preserve AI generated package assembly readiness lanes.",
);
requireText(
  durableRecords,
  "requiresPackageAssemblyReadinessLanes: true",
  "Durable record plan must require package assembly readiness lanes.",
);
requireText(
  durableRecords,
  "requiresMediaRightsEvidence: true",
  "Durable record plan must require media rights evidence.",
);
requireText(
  durableRecords,
  "blocksSupportLanguageAssembly: true",
  "Durable record plan must block support-language-only assembly.",
);
requireText(
  durableRecords,
  "ai-generated-package-assembly-dry-run-record",
  "Durable record plan must include AI generated package assembly dry-run records.",
);
requireText(
  durableRecords,
  "AI generated package assembly dry run record",
  "Durable record plan must expose AI generated package assembly dry-run labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageAssemblyDryRun: true",
  "Durable record plan must preserve AI generated package assembly dry-run artifact maps.",
);
requireText(
  durableRecords,
  "requiresGeneratedPackageArtifactMap: true",
  "Durable record plan must require generated package artifact maps.",
);
requireText(
  durableRecords,
  "blocksGeneratedPackageJsonWrite: true",
  "Durable record plan must block generated package JSON writes.",
);
requireText(
  durableRecords,
  "ai-generated-package-writer-preflight-record",
  "Durable record plan must include AI generated package writer preflight records.",
);
requireText(
  durableRecords,
  "AI generated package writer preflight record",
  "Durable record plan must expose AI generated package writer preflight labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageWriterPreflight: true",
  "Durable record plan must preserve AI generated package writer preflight maps.",
);
requireText(
  durableRecords,
  "requiresGeneratedPackageWriterTargets: true",
  "Durable record plan must require generated package writer targets.",
);
requireText(
  durableRecords,
  "blocksGeneratedPackageWriterExecution: true",
  "Durable record plan must block generated package writer execution.",
);
requireText(
  durableRecords,
  "ai-generated-package-writer-rollback-drill-record",
  "Durable record plan must include AI generated package writer rollback drill records.",
);
requireText(
  durableRecords,
  "AI generated package writer rollback drill record",
  "Durable record plan must expose AI generated package writer rollback drill labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageWriterRollbackDrill: true",
  "Durable record plan must preserve AI generated package writer rollback drills.",
);
requireText(
  durableRecords,
  "requiresGeneratedPackageRollbackSnapshots: true",
  "Durable record plan must require generated package rollback snapshots.",
);
requireText(
  durableRecords,
  "requiresGeneratedPackageRollbackVerification: true",
  "Durable record plan must require generated package rollback verification.",
);
requireText(
  durableRecords,
  "blocksGeneratedPackageRollbackExecution: true",
  "Durable record plan must block generated package rollback execution.",
);
requireText(
  durableRecords,
  "ai-generated-package-writer-implementation-readiness-record",
  "Durable record plan must include AI generated package writer implementation readiness records.",
);
requireText(
  durableRecords,
  "AI generated package writer implementation readiness record",
  "Durable record plan must expose AI generated package writer implementation readiness labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageWriterImplementationReadiness: true",
  "Durable record plan must preserve AI generated package writer implementation readiness gates.",
);
requireText(
  durableRecords,
  "requiresPackageWriterModulePlan: true",
  "Durable record plan must require package writer module plans.",
);
requireText(
  durableRecords,
  "requiresPackageWriterTestGates: true",
  "Durable record plan must require package writer test gates.",
);
requireText(
  durableRecords,
  "requiresPackageWriterReleaseControls: true",
  "Durable record plan must require package writer release controls.",
);
requireText(
  durableRecords,
  "requiresCodexPackageWriterImplementationDecision: true",
  "Durable record plan must require Codex package writer implementation decisions.",
);
requireText(
  durableRecords,
  "blocksGeneratedPackageWriterImplementation: true",
  "Durable record plan must block generated package writer implementation.",
);
requireText(
  durableRecords,
  "ai-generated-package-writer-module-test-plan-record",
  "Durable record plan must include AI generated package writer module test plan records.",
);
requireText(
  durableRecords,
  "AI generated package writer module test plan record",
  "Durable record plan must expose AI generated package writer module test plan labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageWriterModuleTestPlan: true",
  "Durable record plan must preserve AI generated package writer module test plans.",
);
requireText(
  durableRecords,
  "requiresPackageWriterModuleTestSuites: true",
  "Durable record plan must require package writer module test suites.",
);
requireText(
  durableRecords,
  "requiresPackageWriterTestEvidence: true",
  "Durable record plan must require package writer test evidence.",
);
requireText(
  durableRecords,
  "blocksPackageWriterTestExecution: true",
  "Durable record plan must block package writer test execution.",
);
requireText(durableRecords, "blocksPlaywrightRun: true", "Durable record plan must block writer mutation browser runs.");
requireText(durableRecords, "blocksAppFileWrite: true", "Durable record plan must block app file patches.");
requireText(
  durableRecords,
  "ai-generated-package-writer-test-evidence-packet-record",
  "Durable record plan must include AI generated package writer test evidence packet records.",
);
requireText(
  durableRecords,
  "AI generated package writer test evidence packet record",
  "Durable record plan must expose AI generated package writer test evidence packet labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageWriterTestEvidencePacket: true",
  "Durable record plan must preserve AI generated package writer test evidence packets.",
);
requireText(
  durableRecords,
  "requiresPackageWriterEvidenceLanes: true",
  "Durable record plan must require package writer evidence lanes.",
);
requireText(
  durableRecords,
  "requiresPackageWriterAcceptanceChecks: true",
  "Durable record plan must require package writer acceptance checks.",
);
requireText(durableRecords, "blocksEvidenceUpload: true", "Durable record plan must block evidence upload.");
requireText(durableRecords, "blocksSignedApprovalCapture: true", "Durable record plan must block signed approval capture.");
requireText(
  durableRecords,
  "ai-generated-package-writer-test-harness-plan-record",
  "Durable record plan must include AI generated package writer test harness plan records.",
);
requireText(
  durableRecords,
  "AI generated package writer test harness plan record",
  "Durable record plan must expose AI generated package writer test harness plan labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageWriterTestHarnessPlan: true",
  "Durable record plan must preserve AI generated package writer test harness plans.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessPhases: true",
  "Durable record plan must require package writer harness phases.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessAdapters: true",
  "Durable record plan must require package writer harness adapters.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessPrerequisites: true",
  "Durable record plan must require package writer harness prerequisites.",
);
requireText(
  durableRecords,
  "ai-generated-package-writer-test-harness-implementation-proposal-record",
  "Durable record plan must include AI generated package writer test harness implementation proposal records.",
);
requireText(
  durableRecords,
  "AI generated package writer test harness implementation proposal record",
  "Durable record plan must expose AI generated package writer test harness implementation proposal labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageWriterTestHarnessImplementationProposal: true",
  "Durable record plan must preserve AI generated package writer test harness implementation proposals.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessImplementationModuleScope: true",
  "Durable record plan must require package writer harness implementation module scope.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessImplementationReviewGates: true",
  "Durable record plan must require package writer harness implementation review gates.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessDryRunOnlyChecks: true",
  "Durable record plan must require package writer harness dry-run-only checks.",
);
requireText(
  durableRecords,
  "ai-generated-package-writer-harness-implementation-decision-record",
  "Durable record plan must include AI generated package writer harness implementation decision records.",
);
requireText(
  durableRecords,
  "AI generated package writer harness implementation decision record",
  "Durable record plan must expose AI generated package writer harness implementation decision labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPackageWriterHarnessImplementationDecision: true",
  "Durable record plan must preserve AI generated package writer harness implementation decisions.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessDecisionEvidence: true",
  "Durable record plan must require package writer harness decision evidence.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessDecisionFileScope: true",
  "Durable record plan must require package writer harness decision file scope.",
);
requireText(
  durableRecords,
  "requiresPackageWriterHarnessDecisionOptions: true",
  "Durable record plan must require package writer harness decision options.",
);
requireText(
  durableRecords,
  "blocksHarnessImplementationApproval: true",
  "Durable record plan must block harness implementation approval.",
);
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
requireText(
  durableRecords,
  "ai-generated-publish-readiness-gate-record",
  "Durable record plan must include AI generated publish readiness gate records.",
);
requireText(
  durableRecords,
  "AI generated publish readiness gate record",
  "Durable record plan must expose AI generated publish readiness gate labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratedPublishReadinessGate: true",
  "Durable record plan must preserve AI generated publish readiness checks.",
);
requireText(durableRecords, "requiresVerifierPacketApproval: true", "Durable record plan must require verifier packet approval.");
requireText(durableRecords, "requiresManifestCompleteness: true", "Durable record plan must require manifest completeness.");
requireText(durableRecords, "requiresReleaseControlBinding: true", "Durable record plan must require release-control binding.");
requireText(durableRecords, "requiresTeacherApprovalLedger: true", "Durable record plan must require teacher approval ledgers.");
requireText(
  durableRecords,
  "ai-generator-tenant-coverage-gate-record",
  "Durable record plan must include AI generator tenant coverage gate records.",
);
requireText(
  durableRecords,
  "AI generator tenant coverage gate record",
  "Durable record plan must expose AI generator tenant coverage gate labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratorTenantCoverageGate: true",
  "Durable record plan must preserve AI generator tenant coverage checks.",
);
requireText(
  durableRecords,
  "requiresTenantSpecificGeneratorRecords: true",
  "Durable record plan must require tenant-specific generator records.",
);
requireText(durableRecords, "blocksGeneratorRequestSubmission: true", "Durable record plan must block generator request submission.");
requireText(durableRecords, "blocksLiveModelCall: true", "Durable record plan must block live model calls.");
requireText(durableRecords, "blocksVerifierSubmission: true", "Durable record plan must block verifier submission.");
requireText(
  durableRecords,
  "ai-generator-review-summary-record",
  "Durable record plan must include AI generator review summary records.",
);
requireText(
  durableRecords,
  "AI generator review summary record",
  "Durable record plan must expose AI generator review summary labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratorReviewSummary: true",
  "Durable record plan must preserve AI generator review summaries.",
);
requireText(
  durableRecords,
  "preservesGeneratorSectionReadiness: true",
  "Durable record plan must preserve generator section readiness.",
);
requireText(
  durableRecords,
  "requiresGeneratorPrimaryBlockers: true",
  "Durable record plan must require generator primary blockers.",
);
requireText(
  durableRecords,
  "requiresGeneratorNextRecords: true",
  "Durable record plan must require generator next records.",
);
requireText(
  durableRecords,
  "blocksAppPatchGeneration: true",
  "Durable record plan must block app patch generation from review summaries.",
);
requireText(
  durableRecords,
  "ai-generator-reviewer-runbook-record",
  "Durable record plan must include AI generator reviewer runbook records.",
);
requireText(
  durableRecords,
  "AI generator reviewer runbook record",
  "Durable record plan must expose AI generator reviewer runbook labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratorReviewerRunbook: true",
  "Durable record plan must preserve AI generator reviewer runbooks.",
);
requireText(
  durableRecords,
  "preservesGeneratorReviewOrder: true",
  "Durable record plan must preserve generator human review order.",
);
requireText(
  durableRecords,
  "requiresGeneratorRunbookEvidence: true",
  "Durable record plan must require generator runbook evidence.",
);
requireText(
  durableRecords,
  "requiresGeneratorRunbookRequiredRecords: true",
  "Durable record plan must require generator runbook source records.",
);
requireText(
  durableRecords,
  "blocksGeneratorRunbookShortcuts: true",
  "Durable record plan must block generator runbook shortcuts.",
);
requireText(
  durableRecords,
  "ai-generator-responsibility-matrix-record",
  "Durable record plan must include AI generator responsibility matrix records.",
);
requireText(
  durableRecords,
  "AI generator responsibility matrix record",
  "Durable record plan must expose AI generator responsibility matrix labels.",
);
requireText(
  durableRecords,
  "preservesAiGeneratorResponsibilityMatrix: true",
  "Durable record plan must preserve AI generator responsibility matrices.",
);
requireText(
  durableRecords,
  "preservesGeneratorRoleOwnership: true",
  "Durable record plan must preserve generator role ownership.",
);
requireText(
  durableRecords,
  "requiresGeneratorHandoffRecords: true",
  "Durable record plan must require generator handoff records.",
);
requireText(
  durableRecords,
  "blocksExternalBuilderAuthority: true",
  "Durable record plan must block external builder authority.",
);
requireText(
  durableRecords,
  "blocksGeneratorResponsibilityShortcuts: true",
  "Durable record plan must block generator responsibility shortcuts.",
);
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
requireText(routeVerifier, "settings_context_summary", "Active route verifier must keep report settings context storage visible on teacher intake.");
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
requireText(routeVerifier, "prototype_intake_queue_item", "Active route verifier must keep prototype intake queue item storage visible on teacher intake.");
requireText(routeVerifier, "Prototype intake queue item record", "Active route verifier must keep prototype intake queue item durable records visible on teacher intake.");
requireText(routeVerifier, "prototype_return_package_checklist", "Active route verifier must keep prototype return package checklist storage visible on teacher intake.");
requireText(
  routeVerifier,
  "Prototype return package checklist record",
  "Active route verifier must keep prototype return package checklist durable records visible on teacher intake.",
);
for (const text of [
  "prototype_return_package_checklist_id",
  "m099-prototype-return-package-checklist-storage",
  "spec-prototype-return-package-checklist",
  "archive_import_allowed",
  "direct_app_file_copy_allowed",
]) {
  requireText(schemaDraft + migrationCandidates + migrationSpecs, text, `Backend schema/migration must preserve prototype return package checklist text: ${text}.`);
}
for (const text of [
  "prototype-return-package-checklist-record",
  "prototype-return-package-checklist-boundary",
  "hosted-prototype-return-package-checklist-write",
  "local-prototype-return-package-checklist-write",
  "preservesPrototypeReturnPackageChecklist: true",
  "requiresPrototypeReturnSourceManifest: true",
  "requiresPrototypeReturnFixtureFolder: true",
  "blocksPrototypeReturnArchiveImport: true",
]) {
  requireText(durableRecords + persistenceAdapter, text, `Persistence plan/adapter must preserve prototype return package checklist text: ${text}.`);
}
for (const text of [
  "preservesPrototypeReturnPackageChecklist",
  "requiresPrototypeReturnSourceManifest",
  "requiresPrototypeReturnFixtureFolder",
  "blocksPrototypeReturnArchiveImport",
]) {
  requireText(durableRecordValidator, text, `Durable record validator must enforce prototype return package checklist flag: ${text}.`);
  requireText(persistenceAdapterValidator, text, `Persistence adapter validator must enforce prototype return package checklist flag: ${text}.`);
}
requireText(routeVerifier, "ai_prototype_return_review", "Active route verifier must keep AI prototype return review storage visible on teacher intake.");
requireText(routeVerifier, "AI prototype return review record", "Active route verifier must keep AI prototype return review durable records visible on teacher intake.");
requireText(routeVerifier, "ai_prototype_integration_plan", "Active route verifier must keep AI prototype integration plan storage visible on teacher intake.");
requireText(routeVerifier, "AI prototype integration plan record", "Active route verifier must keep AI prototype integration plan durable records visible on teacher intake.");
requireText(
  routeVerifier,
  "ai_prototype_wrapper_adapter_review",
  "Active route verifier must keep AI prototype wrapper adapter review storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype wrapper adapter review record",
  "Active route verifier must keep AI prototype wrapper adapter review durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_prototype_fixture_replay_report",
  "Active route verifier must keep AI prototype fixture replay report storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype fixture replay report record",
  "Active route verifier must keep AI prototype fixture replay report durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_prototype_event_replay_report",
  "Active route verifier must keep AI prototype event replay report storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype event replay report record",
  "Active route verifier must keep AI prototype event replay report durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_prototype_audio_coverage_report",
  "Active route verifier must keep AI prototype audio coverage report storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype audio coverage report record",
  "Active route verifier must keep AI prototype audio coverage report durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_prototype_mobile_accessibility_report",
  "Active route verifier must keep AI prototype mobile accessibility report storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype mobile accessibility report record",
  "Active route verifier must keep AI prototype mobile accessibility report durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_prototype_scoring_replay_report",
  "Active route verifier must keep AI prototype scoring replay report storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype scoring replay report record",
  "Active route verifier must keep AI prototype scoring replay report durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_prototype_integration_readiness_gate",
  "Active route verifier must keep AI prototype integration readiness gate storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype integration readiness gate record",
  "Active route verifier must keep AI prototype integration readiness gate durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "codex_integration_review_decision",
  "Active route verifier must keep Codex integration review decision storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "Codex integration review decision record",
  "Active route verifier must keep Codex integration review decision durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "target_language_audio_approval",
  "Active route verifier must keep target-language audio approval storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generation_request_packet",
  "Active route verifier must keep AI generation request packet storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generation request packet record",
  "Active route verifier must keep AI generation request packet durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai-generation-request-packet",
  "Active route verifier must keep AI generation request packet boundaries visible on teacher intake.",
);
requireText(
  routeVerifier,
  "Target-language audio approval record",
  "Active route verifier must keep target-language audio approval durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_teacher_review_packet",
  "Active route verifier must keep AI generated package teacher review packet storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package teacher review packet record",
  "Active route verifier must keep AI generated package teacher review packet durable records visible on teacher intake.",
);
requireText(routeVerifier, "ai_generated_package_manifest", "Active route verifier must keep AI generated package manifest storage visible on teacher intake.");
requireText(routeVerifier, "AI generated package manifest record", "Active route verifier must keep AI generated package manifest durable records visible on teacher intake.");
requireText(
  routeVerifier,
  "ai_generated_package_promotion_checklist",
  "Active route verifier must keep AI generated package promotion checklist storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package promotion checklist record",
  "Active route verifier must keep AI generated package promotion checklist durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_release_candidate",
  "Active route verifier must keep AI generated package release candidate storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package release candidate record",
  "Active route verifier must keep AI generated package release candidate durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_assembly_readiness",
  "Active route verifier must keep AI generated package assembly readiness storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package assembly readiness record",
  "Active route verifier must keep AI generated package assembly readiness durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_assembly_dry_run",
  "Active route verifier must keep AI generated package assembly dry-run storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package assembly dry run record",
  "Active route verifier must keep AI generated package assembly dry-run durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_prototype_patch_implementation_work_order",
  "Active route verifier must keep AI prototype patch implementation work order storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype patch implementation work order record",
  "Active route verifier must keep AI prototype patch implementation work order durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_prototype_patch_change_set_preview",
  "Active route verifier must keep AI prototype patch change set preview storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI prototype patch change set preview record",
  "Active route verifier must keep AI prototype patch change set preview durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_preflight",
  "Active route verifier must keep AI generated package writer preflight storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer preflight record",
  "Active route verifier must keep AI generated package writer preflight durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_rollback_drill",
  "Active route verifier must keep AI generated package writer rollback drill storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer rollback drill record",
  "Active route verifier must keep AI generated package writer rollback drill durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_implementation_readiness",
  "Active route verifier must keep AI generated package writer implementation readiness storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer implementation readiness record",
  "Active route verifier must keep AI generated package writer implementation readiness durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_module_test_plan",
  "Active route verifier must keep AI generated package writer module test plan storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer module test plan record",
  "Active route verifier must keep AI generated package writer module test plan durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_test_evidence_packet",
  "Active route verifier must keep AI generated package writer test evidence packet storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer test evidence packet record",
  "Active route verifier must keep AI generated package writer test evidence packet durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_test_harness_plan",
  "Active route verifier must keep AI generated package writer test harness plan storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer test harness plan record",
  "Active route verifier must keep AI generated package writer test harness plan durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_test_harness_implementation_proposal",
  "Active route verifier must keep AI generated package writer test harness implementation proposal storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer test harness implementation proposal record",
  "Active route verifier must keep AI generated package writer test harness implementation proposal durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_harness_implementation_decision",
  "Active route verifier must keep AI generated package writer harness implementation decision storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer harness implementation decision record",
  "Active route verifier must keep AI generated package writer harness implementation decision durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_route_playlist_write_guard",
  "Active route verifier must keep AI generated package writer route and playlist write guard storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer route and playlist write guard record",
  "Active route verifier must keep AI generated package writer route and playlist write guard durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai-generated-package-writer-route-playlist-write-guard-record",
  "Active route verifier must keep AI generated package writer route and playlist write guard record ids visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_local_companion_package_guard",
  "Active route verifier must keep AI generated package writer local companion package guard storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer local companion package guard record",
  "Active route verifier must keep AI generated package writer local companion package guard durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai-generated-package-writer-local-companion-package-guard-record",
  "Active route verifier must keep AI generated package writer local companion package guard record ids visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai_generated_package_writer_assignment_shell_guard",
  "Active route verifier must keep AI generated package writer assignment shell guard storage visible on teacher intake.",
);
requireText(
  routeVerifier,
  "AI generated package writer assignment shell guard record",
  "Active route verifier must keep AI generated package writer assignment shell guard durable records visible on teacher intake.",
);
requireText(
  routeVerifier,
  "ai-generated-package-writer-assignment-shell-guard-record",
  "Active route verifier must keep AI generated package writer assignment shell guard record ids visible on teacher intake.",
);
for (const text of [
  "ai_generated_package_writer_route_playlist_write_guard_id",
  "protected_surfaces",
  "route_safety_checks",
  "playlist_safety_checks",
  "production_qr_redirect_mutation_allowed",
  "support_language_route_playlist_approval_allowed",
  "m101-ai-generated-package-writer-route-playlist-write-guard-records",
  "spec-ai-generated-package-writer-route-playlist-write-guard",
]) {
  requireText(
    schemaDraft + migrationCandidates + migrationSpecs,
    text,
    `Backend schema/migration must preserve route and playlist write guard storage text: ${text}.`,
  );
}
for (const text of [
  "ai_generated_package_writer_local_companion_package_guard_id",
  "protected_artifacts",
  "local_safety_checks",
  "offline_fallback_checks",
  "media_file_copy_allowed",
  "student_data_copy_allowed",
  "support_language_local_package_approval_allowed",
  "m102-ai-generated-package-writer-local-companion-package-guard-records",
  "spec-ai-generated-package-writer-local-companion-package-guard",
]) {
  requireText(
    schemaDraft + migrationCandidates + migrationSpecs,
    text,
    `Backend schema/migration must preserve local companion package guard storage text: ${text}.`,
  );
}
for (const text of [
  "ai-generated-package-writer-route-playlist-write-guard-record",
  "ai-generated-package-writer-route-playlist-write-guard-boundary",
  "preservesAiGeneratedPackageWriterRoutePlaylistWriteGuard: true",
  "requiresRoutePlaylistProtectedSurfaces: true",
]) {
  requireText(durableRecords, text, `Durable record plan must preserve route and playlist write guard text: ${text}.`);
}
for (const text of [
  "ai-generated-package-writer-local-companion-package-guard-record",
  "ai-generated-package-writer-local-companion-package-guard-boundary",
  "preservesAiGeneratedPackageWriterLocalCompanionPackageGuard: true",
  "requiresLocalCompanionProtectedArtifacts: true",
  "requiresStudentDataExclusion: true",
]) {
  requireText(durableRecords, text, `Durable record plan must preserve local companion package guard text: ${text}.`);
}
for (const text of [
  "ai_generated_package_writer_assignment_shell_guard_id",
  "protected_assignment_surfaces",
  "assignment_safety_checks",
  "reporting_safety_checks",
  "private_assignment_link_activation_allowed",
  "class_roster_binding_allowed",
  "progress_event_stream_activation_allowed",
  "support_language_assignment_approval_allowed",
  "m103-ai-generated-package-writer-assignment-shell-guard-records",
  "spec-ai-generated-package-writer-assignment-shell-guard",
]) {
  requireText(
    schemaDraft + migrationCandidates + migrationSpecs,
    text,
    `Backend schema/migration must preserve assignment shell guard storage text: ${text}.`,
  );
}
for (const text of [
  "ai-generated-package-writer-assignment-shell-guard-record",
  "ai-generated-package-writer-assignment-shell-guard-boundary",
  "preservesAiGeneratedPackageWriterAssignmentShellGuard: true",
  "requiresAssignmentShellProtectedSurfaces: true",
  "requiresNoRealLearnerDataCheck: true",
]) {
  requireText(durableRecords, text, `Durable record plan must preserve assignment shell guard text: ${text}.`);
}
for (const text of [
  "preservesAiGeneratedPackageWriterRoutePlaylistWriteGuard",
  "preservesAiGeneratedPackageWriterLocalCompanionPackageGuard",
  "preservesAiGeneratedPackageWriterAssignmentShellGuard",
  "requiresRoutePlaylistProtectedSurfaces",
  "requiresLocalCompanionProtectedArtifacts",
  "requiresAssignmentShellProtectedSurfaces",
  "requiresOfflineRouteMapReview",
  "requiresStudentDataExclusion",
  "requiresNoRealLearnerDataCheck",
]) {
  requireText(durableRecordValidator, text, `Durable record validator must expose generated package guard flag: ${text}.`);
}
requireText(routeVerifier, "ai_reward_readiness_gate", "Active route verifier must keep AI reward readiness storage visible on teacher intake.");
requireText(routeVerifier, "AI reward readiness gate record", "Active route verifier must keep AI reward readiness durable records visible on teacher intake.");
requireText(routeVerifier, "ai_generated_publish_readiness_gate", "Active route verifier must keep AI generated publish readiness storage visible on teacher intake.");
requireText(routeVerifier, "AI generated publish readiness gate record", "Active route verifier must keep AI generated publish readiness durable records visible on teacher intake.");
requireText(routeVerifier, "ai_generator_tenant_coverage_gate", "Active route verifier must keep AI generator tenant coverage storage visible on teacher intake.");
requireText(routeVerifier, "AI generator tenant coverage gate record", "Active route verifier must keep AI generator tenant coverage durable records visible on teacher intake.");
requireText(routeVerifier, "ai_generator_review_summary", "Active route verifier must keep AI generator review summary storage visible on teacher intake.");
requireText(routeVerifier, "AI generator review summary record", "Active route verifier must keep AI generator review summary durable records visible on teacher intake.");
requireText(routeVerifier, "ai_generator_reviewer_runbook", "Active route verifier must keep AI generator reviewer runbook storage visible on teacher intake.");
requireText(routeVerifier, "AI generator reviewer runbook record", "Active route verifier must keep AI generator reviewer runbook durable records visible on teacher intake.");
requireText(routeVerifier, "ai_generator_responsibility_matrix", "Active route verifier must keep AI generator responsibility matrix storage visible on teacher intake.");
requireText(routeVerifier, "AI generator responsibility matrix record", "Active route verifier must keep AI generator responsibility matrix durable records visible on teacher intake.");
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
