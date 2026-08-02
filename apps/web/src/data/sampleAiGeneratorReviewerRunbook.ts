export type AiGeneratorReviewerRunbookStatus = "review-only" | "blocked";

export interface AiGeneratorReviewerRunbookStep {
  stepId: string;
  order: number;
  label: string;
  sectionId: "generator-request" | "prototype-review" | "integration-gates" | "package-review" | "draft-repair";
  objective: string;
  evidenceToReview: string[];
  requiredRecord: string;
  blockedShortcuts: string[];
}

export interface AiGeneratorReviewerRunbook {
  runbookId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiGeneratorReviewerRunbookStatus;
  summary: string;
  standingRules: string[];
  steps: AiGeneratorReviewerRunbookStep[];
}

const sharedStandingRules = [
  "Reviewer runbook is guidance only",
  "Detailed source records remain authoritative",
  "No live model call",
  "No app patch generation",
  "No package assembly",
  "No route or playlist creation",
  "No student assignment",
];

export const sampleAiGeneratorReviewerRunbooks: AiGeneratorReviewerRunbook[] = [
  {
    runbookId: "ai-generator-reviewer-runbook-sample-publisher-l1-routines-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher AI generator reviewer runbook",
    status: "review-only",
    summary:
      "Human review order for the sample publisher AI game generator request. It tells reviewers what to inspect first without enabling any generation, patch, package, route, playlist, or assignment action.",
    standingRules: sharedStandingRules,
    steps: [
      {
        stepId: "sample-runbook-request-setup",
        order: 1,
        label: "Confirm request setup",
        sectionId: "generator-request",
        objective: "Check prompt, cost, request-builder, audio, reward, gamification, and engine records before any model call.",
        evidenceToReview: [
          "ai_game_generator_request",
          "ai_prompt_package",
          "premium_ai_cost_gate",
          "ai_generation_request_packet",
          "ai_audio_coverage_plan",
          "ai_engine_binding_plan",
        ],
        requiredRecord: "ai_generator_tenant_coverage_gate",
        blockedShortcuts: ["No generator request submission", "No live model call", "No model billing"],
      },
      {
        stepId: "sample-runbook-prototype-review",
        order: 2,
        label: "Inspect prototype evidence",
        sectionId: "prototype-review",
        objective: "Review returned prototype evidence against wrapper, fixture, event, audio, mobile, and scoring reports.",
        evidenceToReview: [
          "ai_prototype_return_review",
          "ai_prototype_wrapper_adapter_review",
          "ai_prototype_fixture_replay_report",
          "ai_prototype_event_replay_report",
          "ai_prototype_audio_coverage_report",
          "ai_prototype_scoring_replay_report",
        ],
        requiredRecord: "ai_prototype_integration_readiness_gate",
        blockedShortcuts: ["No direct import", "No standalone promotion", "No student-facing preview from returned code"],
      },
      {
        stepId: "sample-runbook-integration-gates",
        order: 3,
        label: "Check integration gates",
        sectionId: "integration-gates",
        objective: "Confirm Codex decision, all-evidence readiness, reviewer identity, and release-control binding before patch planning.",
        evidenceToReview: [
          "codex_integration_review_decision",
          "ai_prototype_integration_readiness_gate",
          "ai_prototype_app_patch_proposal",
          "reviewer_identity_signature_gate",
          "package_publish_gate",
        ],
        requiredRecord: "codex_integration_review_decision",
        blockedShortcuts: ["No app file writes", "No apps/web patch", "No generated route write"],
      },
      {
        stepId: "sample-runbook-package-review",
        order: 4,
        label: "Review package path",
        sectionId: "package-review",
        objective: "Check verifier, compatibility, manifest, promotion, publish readiness, and release candidate before student routes.",
        evidenceToReview: [
          "ai_verifier_submission_packet",
          "activity_compatibility_snapshot",
          "ai_generated_package_manifest",
          "ai_generated_package_promotion_checklist",
          "ai_generated_publish_readiness_gate",
        ],
        requiredRecord: "package_approval_ledger",
        blockedShortcuts: ["No package assembly", "No route creation", "No playlist creation", "No student assignment"],
      },
      {
        stepId: "sample-runbook-draft-repair",
        order: 5,
        label: "Clear draft repair",
        sectionId: "draft-repair",
        objective: "Review schema, audio, and progress-policy repairs before verifier submission can be considered.",
        evidenceToReview: ["ai_generated_draft_payload_preview", "ai_draft_correction_queue", "package_game_audio_coverage"],
        requiredRecord: "ai_draft_correction_queue",
        blockedShortcuts: ["No auto-fix from AI draft", "No regenerate live AI", "No copy JSON to student package"],
      },
    ],
  },
  {
    runbookId: "ai-generator-reviewer-runbook-ministar-l1-greetings-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar AI generator reviewer runbook",
    status: "review-only",
    summary:
      "Human review order for the MiniStar AI game generator request. English remains the target-language trigger, while Japanese support remains hiragana-only and support-only.",
    standingRules: [
      ...sharedStandingRules,
      "English is the target-language trigger",
      "Japanese support remains hiragana-only",
      "No Japanese support-language trigger",
    ],
    steps: [
      {
        stepId: "ministar-runbook-request-setup",
        order: 1,
        label: "Confirm MiniStar request setup",
        sectionId: "generator-request",
        objective: "Check MiniStar prompt, cost, request-builder, English audio, reward, gamification, and engine records.",
        evidenceToReview: [
          "ai_game_generator_request",
          "ai_prompt_package",
          "ai_audio_coverage_plan",
          "ai_gamification_mapping_plan",
          "ai_reward_readiness_gate",
          "ai_engine_binding_plan",
        ],
        requiredRecord: "English audio cue approval workflow",
        blockedShortcuts: ["No live model call", "No model billing", "No Japanese support-language unlock"],
      },
      {
        stepId: "ministar-runbook-prototype-review",
        order: 2,
        label: "Inspect MiniStar prototype evidence",
        sectionId: "prototype-review",
        objective: "Review prototype wrapper, fixture, event, audio, mobile, and scoring evidence for English-only progress.",
        evidenceToReview: [
          "ai_prototype_return_review",
          "ai_prototype_audio_coverage_report",
          "ai_prototype_mobile_accessibility_report",
          "ai_prototype_scoring_replay_report",
        ],
        requiredRecord: "ai_prototype_integration_readiness_gate",
        blockedShortcuts: ["No direct import", "No Japanese support-language scoring or release", "No standalone promotion"],
      },
      {
        stepId: "ministar-runbook-integration-gates",
        order: 3,
        label: "Check MiniStar integration gates",
        sectionId: "integration-gates",
        objective: "Confirm Codex decision and all-evidence readiness before any MiniStar app patch planning.",
        evidenceToReview: [
          "codex_integration_review_decision",
          "ai_prototype_integration_readiness_gate",
          "ai_prototype_app_patch_proposal",
          "reviewer_identity_signature_gate",
          "package_publish_gate",
        ],
        requiredRecord: "codex_integration_review_decision",
        blockedShortcuts: ["No app file writes", "No generated route write", "No Japanese support-language trigger"],
      },
      {
        stepId: "ministar-runbook-package-review",
        order: 4,
        label: "Review MiniStar package path",
        sectionId: "package-review",
        objective: "Check verifier, compatibility, manifest, promotion, publish readiness, and release candidate before student routes.",
        evidenceToReview: [
          "ai_verifier_submission_packet",
          "ai_generated_package_manifest",
          "ai_generated_package_promotion_checklist",
          "ai_generated_publish_readiness_gate",
          "MiniStar media rights manifest",
        ],
        requiredRecord: "package_approval_ledger",
        blockedShortcuts: ["No package assembly", "No playlist creation", "No student assignment", "No Japanese support-language release"],
      },
      {
        stepId: "ministar-runbook-draft-repair",
        order: 5,
        label: "Clear MiniStar draft repair",
        sectionId: "draft-repair",
        objective: "Review schema, English audio, hiragana support, and progress-policy repairs before verifier submission.",
        evidenceToReview: ["ai_generated_draft_payload_preview", "ai_draft_correction_queue", "package_game_audio_coverage"],
        requiredRecord: "ai_draft_correction_queue",
        blockedShortcuts: ["No auto-fix from AI draft", "No regenerate live AI", "No Japanese support-language unlock"],
      },
    ],
  },
];

export function filterAiGeneratorReviewerRunbooksByTenant(
  runbooks: AiGeneratorReviewerRunbook[],
  tenantId: string,
): AiGeneratorReviewerRunbook[] {
  return runbooks.filter((runbook) => runbook.tenantId === tenantId);
}
