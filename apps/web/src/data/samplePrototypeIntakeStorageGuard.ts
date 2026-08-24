export type PrototypeIntakeStorageGuardStatus = "contracted-preview" | "evidence-required" | "blocked";

export interface PrototypeIntakeStorageGuard {
  guardId: string;
  label: string;
  status: PrototypeIntakeStorageGuardStatus;
  summary: string;
  storageContractIds: string[];
  visibleStorageFields: string[];
  requiredBeforeReview: string[];
  blockedActions: string[];
}

export const samplePrototypeIntakeStorageGuards: PrototypeIntakeStorageGuard[] = [
  {
    guardId: "prototype-intake-queue-storage-contract",
    label: "Prototype intake queue storage contract",
    status: "contracted-preview",
    summary:
      "Future Z.ai or outside game inventory must be represented as reviewable hosted/local queue records before it can become return-review, wrapper-review, route, scoring, reward, playlist, package, or assignment work.",
    storageContractIds: [
      "prototype-intake-queue-item-record",
      "prototype-intake-queue-item-boundary",
      "hosted-prototype-intake-queue-item-write",
      "local-prototype-intake-queue-item-write",
      "m098-prototype-intake-queue-storage",
      "spec-prototype-intake-queue-item",
    ],
    visibleStorageFields: [
      "prototype_intake_queue_item_id",
      "tenant_id",
      "source_repository",
      "source_branch_or_snapshot",
      "game_mode",
      "parent_engine_id",
      "target_surface",
      "priority",
      "intake_status",
      "review_route",
      "required_evidence",
      "missing_evidence",
      "codex_review_owner",
      "direct_import_allowed",
      "active_route_replacement_allowed",
      "scoring_profile_mutation_allowed",
      "playlist_write_allowed",
      "student_assignment_allowed",
    ],
    requiredBeforeReview: [
      "Source repository and branch/snapshot recorded",
      "Reviewed JSON fixture attached",
      "Event log and scoring notes attached",
      "Target-language audio coverage notes attached",
      "Mobile accessibility evidence attached",
      "Codex confirms parent-engine and wrapper review ownership",
    ],
    blockedActions: [
      "No direct prototype import",
      "No app file write",
      "No active route replacement",
      "No scoring profile mutation",
      "No reward inventory write",
      "No playlist write",
      "No package promotion",
      "No student assignment",
      "No support-language progress trigger",
    ],
  },
  {
    guardId: "prototype-return-package-checklist-storage-contract",
    label: "Prototype return package checklist storage contract",
    status: "evidence-required",
    summary:
      "Returned outside game work must become a durable evidence-package checklist before Codex can review wrapper, fixture, event, scoring, audio, mobile, route, reward, playlist, package, or assignment implications.",
    storageContractIds: [
      "prototype-return-package-checklist-record",
      "prototype-return-package-checklist-boundary",
      "hosted-prototype-return-package-checklist-write",
      "local-prototype-return-package-checklist-write",
      "m099-prototype-return-package-checklist-storage",
      "spec-prototype-return-package-checklist",
    ],
    visibleStorageFields: [
      "prototype_return_package_checklist_id",
      "tenant_id",
      "prototype_intake_queue_item_id",
      "source_repository",
      "target_game_mode",
      "parent_engine_id",
      "target_surface",
      "source_archive_manifest_required",
      "reviewed_fixture_folder_required",
      "event_scoring_replay_required",
      "target_language_audio_map_required",
      "mobile_accessibility_capture_required",
      "wrapper_boundary_notes_required",
      "required_before_codex_review",
      "blocked_actions",
      "archive_import_allowed",
      "direct_app_file_copy_allowed",
      "student_assignment_allowed",
      "support_language_progress_allowed",
    ],
    requiredBeforeReview: [
      "Source archive manifest is tied to one exact returned snapshot",
      "Reviewed fixture folder proves payload-driven behavior",
      "Event and deterministic scoring replay are attached",
      "Target-language audio map covers learner-facing text",
      "Mobile accessibility capture proves QR-classroom usability",
      "Wrapper boundary notes confirm parent-engine ownership",
    ],
    blockedActions: [
      "No archive import",
      "No direct app file copy",
      "No active route replacement",
      "No scoring profile mutation",
      "No reward inventory write",
      "No playlist write",
      "No generated package promotion",
      "No student assignment",
      "No support-language progress trigger",
    ],
  },
];
