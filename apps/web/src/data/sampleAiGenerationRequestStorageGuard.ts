export type AiGenerationRequestStorageGuardStatus = "review-only" | "storage-required" | "blocked";

export interface AiGenerationRequestStorageGuard {
  guardId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiGenerationRequestStorageGuardStatus;
  summary: string;
  requiredRecordIds: string[];
  visibleFields: string[];
  requiredBeforeLiveRequest: string[];
  blockedActions: string[];
}

const sharedVisibleFields = [
  "ai_generation_request_packet_id",
  "tenant_id",
  "request_id",
  "source_evidence_packet_id",
  "target_level",
  "unit_theme",
  "target_language",
  "support_language_policy",
  "curated_mode_pathway",
  "audio_coverage_requirement",
  "premium_ai_cost_gate_id",
  "teacher_draft_package_id",
  "teacher_draft_verifier_submission_id",
  "support_language_progress_allowed",
  "live_model_dispatch_allowed",
  "student_assignment_allowed",
];

const sharedRequiredRecords = [
  "ai_generation_request_packet",
  "request_builder_review_packet",
  "premium_ai_cost_gate",
  "package_game_audio_coverage",
  "activity_compatibility_snapshot",
  "media_rights_manifest",
  "teacher_draft_package",
  "teacher_draft_verifier_submission",
];

const sharedBlockedActions = [
  "No live model dispatch",
  "No model billing",
  "No generator request submission",
  "No draft generation",
  "No verifier submission",
  "No package assembly",
  "No route creation",
  "No playlist creation",
  "No student assignment",
  "No support-language progress trigger",
];

export const sampleAiGenerationRequestStorageGuards: AiGenerationRequestStorageGuard[] = [
  {
    guardId: "request-storage-guard-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher request storage guard",
    status: "storage-required",
    summary:
      "The sample publisher request builder is a review-only setup preview. It needs durable request, cost, audio, compatibility, rights, draft, and verifier records before any live AI generation request can exist.",
    requiredRecordIds: sharedRequiredRecords,
    visibleFields: sharedVisibleFields,
    requiredBeforeLiveRequest: [
      "Reviewed source extraction packet linked to the request",
      "Tenant AI generation entitlement and cost ceiling approved",
      "Target-language audio coverage requirement accepted",
      "Activity compatibility snapshot prepared for the curated pathway",
      "Media rights manifest reviewed",
      "Teacher draft and verifier submission storage contracts available",
    ],
    blockedActions: sharedBlockedActions,
  },
  {
    guardId: "request-storage-guard-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar request storage guard",
    status: "storage-required",
    summary:
      "The MiniStar request builder remains a review-only setup preview. English target-language audio, hiragana-only Japanese support policy, premium AI entitlement, media rights, draft, and verifier records must be durable before live AI generation can be considered.",
    requiredRecordIds: sharedRequiredRecords,
    visibleFields: sharedVisibleFields,
    requiredBeforeLiveRequest: [
      "MiniStar source extraction packet linked to the request",
      "Premium AI generation entitlement and cost ceiling approved",
      "English target-language audio coverage requirement accepted",
      "Japanese support-language policy confirmed as hiragana-only and support-only",
      "MiniStar media rights manifest reviewed",
      "Teacher draft and verifier submission storage contracts available",
    ],
    blockedActions: [...sharedBlockedActions, "No Japanese support-language unlock"],
  },
];

export function filterAiGenerationRequestStorageGuardsByTenant(
  guards: AiGenerationRequestStorageGuard[],
  tenantId: string,
): AiGenerationRequestStorageGuard[] {
  return guards.filter((guard) => guard.tenantId === tenantId);
}
