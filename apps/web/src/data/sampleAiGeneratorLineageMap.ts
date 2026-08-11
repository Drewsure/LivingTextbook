import {
  getAiGeneratorLineageMapCollectionWarnings,
  validateAiGeneratorLineageMaps,
  type AiGeneratorLineageMap,
  type AiGeneratorLineageStep,
  type AiGeneratorLineageStepStatus,
} from "@living-textbook/content-model/src/aiGeneratorLineageMap";

export type { AiGeneratorLineageMap, AiGeneratorLineageStep, AiGeneratorLineageStepStatus };

export const sampleAiGeneratorLineageMaps: AiGeneratorLineageMap[] = [
  {
    lineageId: "ai-generator-lineage-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher request-to-review lineage",
    summary:
      "Review-only lineage showing how the sample publisher generated draft moves from request evidence to draft JSON, correction, verifier, manifest, publish readiness, and teacher review without live package actions.",
    currentState: "Lineage review only",
    steps: [
      {
        stepId: "sample-request-draft",
        label: "Request draft",
        recordType: "ai_game_generator_request",
        status: "covered",
        evidence: "Sample publisher daily routines game draft exists.",
        releaseBoundary: "No live model call.",
      },
      {
        stepId: "sample-prompt-package",
        label: "Prompt package",
        recordType: "ai_prompt_package",
        status: "covered",
        evidence: "Versioned prompt package exists.",
        releaseBoundary: "No raw student data or live prompt dispatch.",
      },
      {
        stepId: "sample-draft-preview",
        label: "Draft JSON preview",
        recordType: "ai_generated_draft_payload_preview",
        status: "blocked",
        evidence: "Draft preview exists with required-not-approved audio.",
        releaseBoundary: "No copy, verifier submit, publish, playlist, or assignment.",
      },
      {
        stepId: "sample-correction-queue",
        label: "Correction queue",
        recordType: "ai_draft_correction_queue",
        status: "blocked",
        evidence: "Schema guard output creates repair lanes.",
        releaseBoundary: "No auto-fix or regeneration.",
      },
      {
        stepId: "sample-verifier-packet",
        label: "Verifier packet",
        recordType: "ai_verifier_submission_packet",
        status: "blocked",
        evidence: "Verifier packet exists but submission is blocked.",
        releaseBoundary: "No verifier workflow or approval.",
      },
      {
        stepId: "sample-manifest",
        label: "Generated package manifest",
        recordType: "ai_generated_package_manifest",
        status: "blocked",
        evidence: "Manifest preview links prompt, draft, audio, engine, gamification, verifier, and review records.",
        releaseBoundary: "No package assembly write.",
      },
      {
        stepId: "sample-publish-readiness",
        label: "Publish readiness gate",
        recordType: "ai_generated_publish_readiness_gate",
        status: "blocked",
        evidence: "Publish readiness exists and blocks route, playlist, assignment, local bundle, and student-ready writes.",
        releaseBoundary: "No student route publish.",
      },
      {
        stepId: "sample-review-queue",
        label: "Teacher review queue item",
        recordType: "teacher_draft_review_handoff",
        status: "review-only",
        evidence: "AI-generated daily routines draft is read-only in the normal teacher review queue.",
        releaseBoundary: "No live review transition.",
      },
    ],
    blockedActions: [
      "No live generation from lineage map",
      "No verifier submission from lineage map",
      "No package assembly from lineage map",
      "No route creation from lineage map",
      "No playlist creation from lineage map",
      "No local bundle write from lineage map",
      "No student assignment from lineage map",
      "No student-ready marker from lineage map",
    ],
    nextRecords: [
      "durable_lineage_snapshot",
      "reviewer_identity_signature_gate",
      "audio_cue_approval_workflow",
      "media_rights_manifest",
      "package_approval_ledger",
      "release_control_binding",
    ],
  },
  {
    lineageId: "ai-generator-lineage-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar request-to-review lineage",
    summary:
      "Review-only lineage showing how the MiniStar greetings generator request moves through prompt, Draft JSON, correction queue, verifier, manifest, publish readiness, and teacher review while English remains the target-language trigger.",
    currentState: "Lineage review only",
    steps: [
      {
        stepId: "ministar-request-draft",
        label: "Request draft",
        recordType: "ai_game_generator_request",
        status: "covered",
        evidence: "MiniStar greetings entry-sequence draft exists.",
        releaseBoundary: "No live model call.",
      },
      {
        stepId: "ministar-prompt-package",
        label: "Prompt package",
        recordType: "ai_prompt_package",
        status: "covered",
        evidence: "MiniStar generator prompt package exists.",
        releaseBoundary: "No raw student data or live prompt dispatch.",
      },
      {
        stepId: "ministar-draft-preview",
        label: "Draft JSON preview",
        recordType: "ai_generated_draft_payload_preview",
        status: "blocked",
        evidence: "MiniStar Draft JSON preview keeps 8 terms, exactly 2 target sentences, English progress trigger, and ja-hiragana support-only metadata.",
        releaseBoundary: "No copy, verifier submit, publish, playlist, or assignment.",
      },
      {
        stepId: "ministar-correction-queue",
        label: "Correction queue",
        recordType: "ai_draft_correction_queue",
        status: "blocked",
        evidence: "MiniStar correction queue exposes audio and review repair lanes.",
        releaseBoundary: "No auto-fix or regeneration.",
      },
      {
        stepId: "ministar-verifier-packet",
        label: "Verifier packet",
        recordType: "ai_verifier_submission_packet",
        status: "blocked",
        evidence: "MiniStar AI verifier packet exists with hiragana support boundary and media-rights blockers.",
        releaseBoundary: "No verifier workflow or approval.",
      },
      {
        stepId: "ministar-manifest",
        label: "Generated package manifest",
        recordType: "ai_generated_package_manifest",
        status: "blocked",
        evidence: "MiniStar generated package manifest links prompt, draft, audio, engine, gamification, verifier, and review records.",
        releaseBoundary: "No package assembly write.",
      },
      {
        stepId: "ministar-publish-readiness",
        label: "Publish readiness gate",
        recordType: "ai_generated_publish_readiness_gate",
        status: "blocked",
        evidence: "MiniStar publish readiness gate blocks route, playlist, assignment, local bundle, and student-ready writes.",
        releaseBoundary: "No student route publish.",
      },
      {
        stepId: "ministar-review-queue",
        label: "Teacher review queue item",
        recordType: "teacher_draft_review_handoff",
        status: "review-only",
        evidence: "AI-generated MiniStar greetings draft is read-only in the normal teacher review queue.",
        releaseBoundary: "No live review transition.",
      },
    ],
    blockedActions: [
      "No live generation from lineage map",
      "No verifier submission from lineage map",
      "No package assembly from lineage map",
      "No route creation from lineage map",
      "No playlist creation from lineage map",
      "No local bundle write from lineage map",
      "No student assignment from lineage map",
      "No student-ready marker from lineage map",
      "No Japanese support-language unlock from lineage map",
    ],
    nextRecords: [
      "durable_lineage_snapshot",
      "reviewer_identity_signature_gate",
      "English audio cue approval workflow",
      "MiniStar media rights manifest",
      "package_approval_ledger",
      "release_control_binding",
    ],
  },
];

export const sampleAiGeneratorLineageMapErrors = validateAiGeneratorLineageMaps(sampleAiGeneratorLineageMaps);

export const sampleAiGeneratorLineageMapWarnings =
  getAiGeneratorLineageMapCollectionWarnings(sampleAiGeneratorLineageMaps);

export function filterAiGeneratorLineageMapsByTenant(
  maps: AiGeneratorLineageMap[],
  tenantId: string,
): AiGeneratorLineageMap[] {
  return maps.filter((map) => map.tenantId === tenantId);
}
