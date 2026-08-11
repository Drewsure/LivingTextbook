export type AiGeneratorReviewSummaryStatus = "review-only" | "blocked" | "missing";

export interface AiGeneratorReviewSummarySection {
  sectionId: "generator-request" | "prototype-review" | "integration-gates" | "package-review" | "draft-repair";
  label: string;
  status: AiGeneratorReviewSummaryStatus;
  summary: string;
  primaryBlocker: string;
  nextRequiredRecord: string;
  blockedActions: string[];
  sourceRecords: string[];
}

export interface AiGeneratorReviewSummary {
  summaryId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiGeneratorReviewSummaryStatus;
  currentBoundary: string;
  sections: AiGeneratorReviewSummarySection[];
}

export const sampleAiGeneratorReviewSummaries: AiGeneratorReviewSummary[] = [
  {
    summaryId: "ai-generator-review-summary-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher generator readiness rollup",
    status: "blocked",
    currentBoundary:
      "The sample publisher request is review-only. It can preview evidence, but it cannot generate, patch app files, publish routes, create playlists, or assign students.",
    sections: [
      {
        sectionId: "generator-request",
        label: "Request setup",
        status: "review-only",
        summary: "Prompt, cost, request, audio, gamification, reward, and engine-binding records are visible.",
        primaryBlocker: "Premium AI cost approval and audio-rights evidence still need durable review records.",
        nextRequiredRecord: "premium_ai_cost_gate",
        blockedActions: ["No live model call", "No model billing", "No generator request submission"],
        sourceRecords: [
          "ai_game_generator_request",
          "ai_prompt_package",
          "ai_generation_request_packet",
          "ai_audio_coverage_plan",
          "ai_engine_binding_plan",
        ],
      },
      {
        sectionId: "prototype-review",
        label: "Prototype review",
        status: "review-only",
        summary: "External prototype evidence can be reviewed against wrapper, fixture, event, audio, mobile, and scoring gates.",
        primaryBlocker: "Returned prototype work cannot become product code until replay reports and Codex review agree.",
        nextRequiredRecord: "ai_prototype_return_review",
        blockedActions: ["No standalone promotion", "No direct import", "No student-facing preview from returned code"],
        sourceRecords: [
          "ai_generated_game_build_brief",
          "ai_prototype_return_review",
          "ai_prototype_fixture_replay_report",
          "ai_prototype_event_replay_report",
          "ai_prototype_audio_coverage_report",
        ],
      },
      {
        sectionId: "integration-gates",
        label: "Integration gates",
        status: "blocked",
        summary: "Codex decision, all-evidence readiness, and patch proposal records stay blocked until reviewer identity and release control are present.",
        primaryBlocker: "Codex integration decision is not accepted and release-control binding is missing.",
        nextRequiredRecord: "codex_integration_review_decision",
        blockedActions: ["No app file writes", "No apps/web patch", "No generated route write"],
        sourceRecords: [
          "codex_integration_review_decision",
          "ai_prototype_integration_readiness_gate",
          "package_publish_gate",
          "reviewer_identity_signature_gate",
        ],
      },
      {
        sectionId: "package-review",
        label: "Package review",
        status: "blocked",
        summary:
          "Verifier, manifest, promotion, publish readiness, release-candidate, writer, and harness-decision previews exist but cannot become student routes.",
        primaryBlocker:
          "Verifier approval, media rights, teacher approval, release-control, and package writer harness implementation decision records are incomplete.",
        nextRequiredRecord: "ai_generated_package_writer_harness_implementation_decision",
        blockedActions: [
          "No package assembly",
          "No route creation",
          "No playlist creation",
          "No student assignment",
          "No harness implementation approval",
        ],
        sourceRecords: [
          "ai_verifier_submission_packet",
          "ai_generated_package_manifest",
          "ai_generated_publish_readiness_gate",
          "ai_generated_package_writer_harness_implementation_decision",
          "package_approval_ledger",
        ],
      },
      {
        sectionId: "draft-repair",
        label: "Draft repair",
        status: "blocked",
        summary: "Draft JSON preview and correction queues can identify schema, audio, and progress-policy issues.",
        primaryBlocker: "Audio coverage and review corrections must be cleared before verifier submission.",
        nextRequiredRecord: "ai_draft_correction_queue",
        blockedActions: ["No auto-fix from AI draft", "No regenerate live AI", "No copy JSON to student package"],
        sourceRecords: ["ai_generated_draft_payload_preview", "ai_draft_correction_queue", "package_game_audio_coverage"],
      },
    ],
  },
  {
    summaryId: "ai-generator-review-summary-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar generator readiness rollup",
    status: "blocked",
    currentBoundary:
      "The MiniStar greetings request is review-only. English target-language actions can become future progress triggers only after review; Japanese support stays hiragana-only and support-only.",
    sections: [
      {
        sectionId: "generator-request",
        label: "Request setup",
        status: "review-only",
        summary: "MiniStar prompt, cost, request, English audio, gamification, reward, and engine records are visible.",
        primaryBlocker: "English target-language audio approval and MiniStar media-rights evidence are not yet complete.",
        nextRequiredRecord: "English audio cue approval workflow",
        blockedActions: ["No live model call", "No model billing", "No Japanese support-language unlock"],
        sourceRecords: [
          "ai_game_generator_request",
          "ai_prompt_package",
          "ai_audio_coverage_plan",
          "ai_gamification_mapping_plan",
          "ai_engine_binding_plan",
        ],
      },
      {
        sectionId: "prototype-review",
        label: "Prototype review",
        status: "review-only",
        summary: "MiniStar prototype evidence must preserve parent-engine wrappers, English audio coverage, and support-language boundaries.",
        primaryBlocker: "Returned prototype replay evidence must prove Japanese support cannot score or release progress.",
        nextRequiredRecord: "ai_prototype_audio_coverage_report",
        blockedActions: [
          "No standalone promotion",
          "No direct import",
          "No Japanese support-language scoring or release",
        ],
        sourceRecords: [
          "ai_generated_game_build_brief",
          "ai_prototype_return_review",
          "ai_prototype_audio_coverage_report",
          "ai_prototype_scoring_replay_report",
        ],
      },
      {
        sectionId: "integration-gates",
        label: "Integration gates",
        status: "blocked",
        summary: "Codex decision, all-evidence readiness, and app patch proposals remain blocked for MiniStar.",
        primaryBlocker: "Codex decision, reviewer identity, and release-control binding are not accepted.",
        nextRequiredRecord: "codex_integration_review_decision",
        blockedActions: [
          "No app file writes",
          "No generated route write",
          "No Japanese support-language trigger",
        ],
        sourceRecords: [
          "codex_integration_review_decision",
          "ai_prototype_integration_readiness_gate",
          "package_publish_gate",
          "reviewer_identity_signature_gate",
        ],
      },
      {
        sectionId: "package-review",
        label: "Package review",
        status: "blocked",
        summary:
          "MiniStar verifier, manifest, promotion, publish readiness, release-candidate, writer, and harness-decision records are blocked from student release.",
        primaryBlocker:
          "MiniStar media rights, teacher approval, release-control binding, and package writer harness implementation decision storage are incomplete.",
        nextRequiredRecord: "ai_generated_package_writer_harness_implementation_decision",
        blockedActions: [
          "No package assembly",
          "No playlist creation",
          "No student assignment",
          "No Japanese support-language release",
          "No harness implementation approval",
        ],
        sourceRecords: [
          "ai_verifier_submission_packet",
          "ai_generated_package_manifest",
          "ai_generated_publish_readiness_gate",
          "ai_generated_package_writer_harness_implementation_decision",
          "package_approval_ledger",
        ],
      },
      {
        sectionId: "draft-repair",
        label: "Draft repair",
        status: "blocked",
        summary: "MiniStar draft preview can be repaired while English remains the target-language trigger and Japanese remains support-only.",
        primaryBlocker: "Audio and progress-policy repair lanes must clear before verifier submission.",
        nextRequiredRecord: "ai_draft_correction_queue",
        blockedActions: ["No auto-fix from AI draft", "No regenerate live AI", "No Japanese support-language unlock"],
        sourceRecords: [
          "ai_generated_draft_payload_preview",
          "ai_draft_correction_queue",
          "package_game_audio_coverage",
        ],
      },
    ],
  },
];

export function filterAiGeneratorReviewSummariesByTenant(
  summaries: AiGeneratorReviewSummary[],
  tenantId: string,
): AiGeneratorReviewSummary[] {
  return summaries.filter((summary) => summary.tenantId === tenantId);
}
