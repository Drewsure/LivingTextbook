export type AiVerifierCheckStatus = "ready-for-review" | "blocked" | "draft-only";

export interface AiVerifierSubmissionCheck {
  checkId: string;
  label: string;
  status: AiVerifierCheckStatus;
  evidence: string;
  rejectionRule: string;
}

export interface AiVerifierSubmissionPacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  verifierVersion: string;
  submissionState: string;
  requiredPackets: string[];
  checks: AiVerifierSubmissionCheck[];
  blockedActions: string[];
  nextRequirements: string[];
}

export const sampleAiVerifierSubmissionPackets: AiVerifierSubmissionPacket[] = [
  {
    packetId: "ai-verifier-submission-sample-publisher-game-draft-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher AI verifier packet",
    summary:
      "Review-only packet showing what the Vision/Reasoning verifier must inspect before generated game-package data can enter teacher approval.",
    verifierVersion: "ai-verifier-v2026.07.foundation",
    submissionState: "Submit verifier packet blocked",
    requiredPackets: [
      "ai_verifier_submission_packet",
      "schema_validation_packet",
      "pedagogical_lock_packet",
      "audio_coverage_packet",
      "engine_binding_packet",
      "gamification_mapping_packet",
      "activity_compatibility_snapshot",
      "media_rights_manifest",
      "teacher_approval_packet",
    ],
    checks: [
      {
        checkId: "schema-validation",
        label: "Schema validation packet",
        status: "ready-for-review",
        evidence: "Draft JSON preview exists with unit_meta, pedagogical_payload, audio_cues, and progress_policy.",
        rejectionRule: "Reject if JSON contains markdown, missing fields, unknown modes, or cross-tenant references.",
      },
      {
        checkId: "pedagogical-lock",
        label: "Pedagogical lock",
        status: "ready-for-review",
        evidence: "8 default vocabulary terms and exactly 2 target sentence structures are present.",
        rejectionRule: "Reject if term count falls outside 8-12 or sentence structures are missing.",
      },
      {
        checkId: "target-language-trigger",
        label: "Target-language progression",
        status: "ready-for-review",
        evidence: "target_language_progress_trigger remains target-language-only.",
        rejectionRule: "Reject support-language-only progression, media-only progress, or route-guidance unlocks.",
      },
      {
        checkId: "audio-coverage",
        label: "Audio coverage packet",
        status: "blocked",
        evidence: "Audio cue manifest is planned but not approved.",
        rejectionRule: "Reject silent learner-facing text, missing instruction audio, or unapproved voice generation.",
      },
      {
        checkId: "engine-binding",
        label: "Engine binding packet",
        status: "ready-for-review",
        evidence: "Modes bind to existing game catalog, parent engines, scoring profiles, and standard events.",
        rejectionRule: "Reject one-off generated game code or parent-engine bypass.",
      },
      {
        checkId: "gamification",
        label: "Gamification mapping packet",
        status: "ready-for-review",
        evidence: "Star Dust lanes, mastery thresholds, accepted events, and collection bindings are named.",
        rejectionRule: "Reject random reward generation, generated gacha, or media-only Star Dust.",
      },
      {
        checkId: "media-rights",
        label: "Media rights manifest",
        status: "blocked",
        evidence: "Partner audio/video rights proof has not been attached.",
        rejectionRule: "Reject unknown ownership, missing captions/transcripts, or playlist creation from unreviewed media.",
      },
      {
        checkId: "teacher-approval",
        label: "Teacher approval packet",
        status: "blocked",
        evidence: "Teacher/package reviewer decision has not been captured.",
        rejectionRule: "Reject direct AI publish, route creation, assignment, or launch without approval evidence.",
      },
    ],
    blockedActions: [
      "Submit verifier packet blocked",
      "Approve generated package blocked",
      "Create route from verifier packet blocked",
      "Create playlist from verifier packet blocked",
      "Create student assignment from verifier packet blocked",
      "Mark package student-ready blocked",
    ],
    nextRequirements: [
      "Durable verifier submission storage",
      "Reviewer identity and signature policy",
      "Media rights evidence attachments",
      "Audio cue approval workflow",
      "Package approval ledger binding",
      "Release-control binding",
    ],
  },
];

export function filterAiVerifierSubmissionPacketsByTenant(
  packets: AiVerifierSubmissionPacket[],
  tenantId: string,
): AiVerifierSubmissionPacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}
