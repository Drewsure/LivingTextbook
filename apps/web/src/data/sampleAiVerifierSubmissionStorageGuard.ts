import {
  getAiVerifierSubmissionStorageGuardCollectionWarnings,
  validateAiVerifierSubmissionStorageGuards,
  type AiVerifierSubmissionStorageGuard,
  type AiVerifierSubmissionStorageGuardStatus,
} from "@living-textbook/content-model/src/aiVerifierSubmissionStorageGuard";

export type { AiVerifierSubmissionStorageGuard, AiVerifierSubmissionStorageGuardStatus };

const sharedRequiredRecordIds = [
  "teacher_draft_verifier_submission",
  "ai_verifier_submission_packet",
  "ai_draft_repair_evidence_packet",
  "reviewer_identity",
  "evidence_attachment",
  "target_language_audio_approval",
  "media_rights_evidence_attachment",
  "teacher_approval_ledger",
  "release_control_binding",
];

const sharedVisibleFields = [
  "teacher_draft_verifier_submission_id",
  "ai_verifier_submission_packet_id",
  "ai_draft_repair_evidence_packet_id",
  "tenant_id",
  "request_id",
  "verifier_packet_id",
  "verifier_version",
  "reviewer_identity_id",
  "evidence_attachment_ids",
  "media_rights_evidence_attachment_id",
  "target_language_audio_approval_id",
  "teacher_approval_ledger_id",
  "release_control_binding_id",
  "storage_adapter",
  "retention_policy_id",
  "audit_trail_id",
  "verifier_submission_allowed",
  "support_language_progress_allowed",
];

const sharedRequiredBeforeVerifierSubmission = [
  "Durable verifier submission storage accepted",
  "Reviewer identity and signature policy accepted",
  "Media rights evidence attachments accepted",
  "Audio cue approval workflow accepted",
  "Approval ledger binding accepted",
  "Release-control binding accepted",
];

const sharedBlockedActions = [
  "No live verifier submission",
  "No package approval from verifier storage",
  "No route write from verifier storage",
  "No playlist write from verifier storage",
  "No student assignment from verifier storage",
  "No student-ready marker from verifier storage",
  "No support-language progress from verifier storage",
];

const sharedAdapterRequirements = [
  {
    adapterType: "hosted" as const,
    label: "Hosted verifier storage adapter",
    requiredRecords: [
      "tenant-scoped verifier submission row",
      "reviewer identity row",
      "evidence attachment object references",
      "audit trail row",
    ],
    blockedWrites: [
      "No hosted verifier submit mutation",
      "No hosted package approval mutation",
      "No hosted route registry mutation",
      "No hosted assignment mutation",
    ],
    note: "Hosted storage must preserve tenant scope, evidence links, reviewer identity, retention policy, and audit trail before a live verifier can run.",
  },
  {
    adapterType: "local-companion" as const,
    label: "Local companion verifier storage adapter",
    requiredRecords: [
      "local verifier submission JSON",
      "local reviewer identity manifest",
      "local evidence attachment manifest",
      "local audit manifest",
    ],
    blockedWrites: [
      "No local verifier submit export",
      "No local package approval export",
      "No local route manifest mutation",
      "No local assignment export",
    ],
    note: "Local companion storage must preserve the same verifier evidence without requiring a cloud vendor or live internet connection.",
  },
];

export const sampleAiVerifierSubmissionStorageGuards: AiVerifierSubmissionStorageGuard[] = [
  {
    guardId: "verifier-storage-guard-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    verifierPacketId: "ai-verifier-submission-sample-publisher-game-draft-v1",
    label: "Sample publisher verifier storage guard",
    status: "storage-required",
    summary:
      "Review-only storage guard for the sample publisher verifier packet. It shows the records required before any live verifier submission, approval, package write, route, playlist, or assignment workflow can exist.",
    storageRecordType: "teacher_draft_verifier_submission",
    requiredRecordIds: sharedRequiredRecordIds,
    visibleFields: sharedVisibleFields,
    requiredBeforeVerifierSubmission: sharedRequiredBeforeVerifierSubmission,
    blockedActions: sharedBlockedActions,
    adapterRequirements: sharedAdapterRequirements,
    reviewerNotes: [
      "Evidence attachments must be durable before verifier submission.",
      "Retention and audit policy must be accepted before storage is live.",
      "Target-language progress remains the only mastery trigger.",
    ],
    verifierSubmissionAllowed: false,
    packageApprovalAllowed: false,
    routeWriteAllowed: false,
    playlistWriteAllowed: false,
    assignmentWriteAllowed: false,
    studentReadyMarkerAllowed: false,
    supportLanguageProgressAllowed: false,
  },
  {
    guardId: "verifier-storage-guard-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    verifierPacketId: "ai-verifier-submission-ministar-l1-greetings-v1",
    label: "MiniStar verifier storage guard",
    status: "storage-required",
    summary:
      "Review-only storage guard for the MiniStar verifier packet. English remains the target-language trigger while Japanese support remains hiragana-only, support-language-only, and unable to unlock progress.",
    storageRecordType: "teacher_draft_verifier_submission",
    requiredRecordIds: sharedRequiredRecordIds,
    visibleFields: [
      ...sharedVisibleFields,
      "target_language: English",
      "assist_language: Japanese",
      "support_language_level_policy: hiragana-only",
    ],
    requiredBeforeVerifierSubmission: [
      "Durable verifier submission storage accepted",
      "Reviewer identity and signature policy accepted",
      "MiniStar media rights evidence attachments accepted",
      "English audio cue approval workflow accepted",
      "MiniStar approval ledger binding accepted",
      "Release-control binding accepted",
      "Japanese support-language policy accepted as hiragana-only and support-only",
    ],
    blockedActions: [...sharedBlockedActions, "No Japanese support-language unlock"],
    adapterRequirements: sharedAdapterRequirements,
    reviewerNotes: [
      "English evidence must be reviewed before verifier submission.",
      "Japanese support-language text must remain hiragana-only for Foundation/Bronze/Plus.",
      "Japanese support-language taps, audio, or hints cannot unlock progress.",
      "Retention and audit policy must be accepted before storage is live.",
    ],
    verifierSubmissionAllowed: false,
    packageApprovalAllowed: false,
    routeWriteAllowed: false,
    playlistWriteAllowed: false,
    assignmentWriteAllowed: false,
    studentReadyMarkerAllowed: false,
    supportLanguageProgressAllowed: false,
  },
];

export function filterAiVerifierSubmissionStorageGuardsByTenant(
  guards: AiVerifierSubmissionStorageGuard[],
  tenantId: string,
): AiVerifierSubmissionStorageGuard[] {
  return guards.filter((guard) => guard.tenantId === tenantId);
}

export const sampleAiVerifierSubmissionStorageGuardErrors = validateAiVerifierSubmissionStorageGuards(
  sampleAiVerifierSubmissionStorageGuards,
);

export const sampleAiVerifierSubmissionStorageGuardWarnings =
  getAiVerifierSubmissionStorageGuardCollectionWarnings(sampleAiVerifierSubmissionStorageGuards);
