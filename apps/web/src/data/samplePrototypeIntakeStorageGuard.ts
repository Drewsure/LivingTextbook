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
];
