import { sampleAiPrototypeIntegrationPlans } from "@/data/sampleAiPrototypeIntegrationPlan";
import { sampleAiPrototypeAudioCoverageReports } from "@/data/sampleAiPrototypeAudioCoverageReport";
import { sampleAiPrototypeEventReplayReports } from "@/data/sampleAiPrototypeEventReplayReport";
import { sampleAiPrototypeFixtureReplayReports } from "@/data/sampleAiPrototypeFixtureReplayReport";
import { sampleAiPrototypeMobileAccessibilityReports } from "@/data/sampleAiPrototypeMobileAccessibilityReport";
import { sampleAiPrototypeScoringReplayReports } from "@/data/sampleAiPrototypeScoringReplayReport";
import { sampleAiPrototypeWrapperAdapterReviews } from "@/data/sampleAiPrototypeWrapperAdapterReview";
import {
  getAiPrototypeCodexIntegrationDecisionCollectionWarnings,
  deriveAiPrototypeCodexIntegrationDecisionStatus,
  validateAiPrototypeCodexIntegrationDecisions,
  type AiPrototypeCodexIntegrationDecision as SharedAiPrototypeCodexIntegrationDecision,
  type AiPrototypeCodexIntegrationDecisionCheck as SharedAiPrototypeCodexIntegrationDecisionCheck,
  type AiPrototypeCodexIntegrationDecisionCheckStatus,
  type AiPrototypeCodexIntegrationDecisionStatus,
} from "@living-textbook/content-model/src/aiPrototypeCodexIntegrationDecision";

export type AiPrototypeCodexIntegrationDecision = SharedAiPrototypeCodexIntegrationDecision;
export type AiPrototypeCodexIntegrationDecisionCheck = SharedAiPrototypeCodexIntegrationDecisionCheck;
export type { AiPrototypeCodexIntegrationDecisionCheckStatus, AiPrototypeCodexIntegrationDecisionStatus };

export const sampleAiPrototypeCodexIntegrationDecisions: AiPrototypeCodexIntegrationDecision[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";
    const evidenceStatuses = {
      wrapper: toDecisionCheckStatus(
        sampleAiPrototypeWrapperAdapterReviews.find((review) => review.requestId === plan.requestId)?.status,
      ),
      fixture: toDecisionCheckStatus(
        sampleAiPrototypeFixtureReplayReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      event: toDecisionCheckStatus(
        sampleAiPrototypeEventReplayReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      audio: toDecisionCheckStatus(
        sampleAiPrototypeAudioCoverageReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      mobile: toDecisionCheckStatus(
        sampleAiPrototypeMobileAccessibilityReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      scoring: toDecisionCheckStatus(
        sampleAiPrototypeScoringReplayReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
    };
    const allUpstreamEvidenceReviewed = Object.values(evidenceStatuses).every((status) => status === "reviewed");

    const decision: AiPrototypeCodexIntegrationDecision = {
      decisionId: `codex-integration-review-decision-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      label: isMiniStar
        ? "MiniStar Codex integration review decision"
        : "Codex integration review decision",
      status: "blocked",
      summary: isMiniStar
        ? "Manual Codex review remains blocked until the MiniStar prototype proves wrapper, fixture, event, audio, mobile, scoring, and hiragana-safe support-language boundaries."
        : "Manual Codex review remains blocked until the returned prototype proves wrapper, fixture, event, audio, mobile, scoring, and white-label boundaries.",
      selectedDecision: "No decision recorded",
      sourceRecords: [
        "ai_prototype_integration_plan",
        "ai_prototype_wrapper_adapter_review",
        "ai_prototype_fixture_replay_report",
        "ai_prototype_event_replay_report",
        "ai_prototype_audio_coverage_report",
        "ai_prototype_mobile_accessibility_report",
        "ai_prototype_scoring_replay_report",
        "ai_prototype_integration_readiness_gate",
        "codex_integration_review_decision",
      ],
      checks: [
        {
          label: "Wrapper adapter evidence",
          status: evidenceStatuses.wrapper,
          evidence: "Returned code must run as a removable parent-engine wrapper.",
          requiredRecord: "ai_prototype_wrapper_adapter_review",
        },
        {
          label: "Fixture replay evidence",
          status: evidenceStatuses.fixture,
          evidence: "Reviewed JSON fixture must drive all learner-facing content.",
          requiredRecord: "ai_prototype_fixture_replay_report",
        },
        {
          label: "Standard event evidence",
          status: evidenceStatuses.event,
          evidence: "Prototype must emit standard LivingTextbook events in order.",
          requiredRecord: "ai_prototype_event_replay_report",
        },
        {
          label: "Target-language audio evidence",
          status: evidenceStatuses.audio,
          evidence: "Tap-to-speak and replay controls must cover target-language terms, sentences, instructions, feedback, and controls.",
          requiredRecord: "ai_prototype_audio_coverage_report",
        },
        {
          label: "Mobile accessibility evidence",
          status: evidenceStatuses.mobile,
          evidence: "Phone-first viewport, visible controls, focus order, readable text, and accessible wrapper controls must pass.",
          requiredRecord: "ai_prototype_mobile_accessibility_report",
        },
        {
          label: "Deterministic scoring evidence",
          status: evidenceStatuses.scoring,
          evidence: "Parent scoring profile must own score, mastery, Star Dust, and reward boundaries.",
          requiredRecord: "ai_prototype_scoring_replay_report",
        },
        {
          label: "Readiness gate evidence",
          status: allUpstreamEvidenceReviewed ? "reviewed" : "blocked",
          evidence: "All evidence checks must be reviewed before a Codex decision can be recorded.",
          requiredRecord: "ai_prototype_integration_readiness_gate",
        },
        ...(isMiniStar
          ? [
              {
                label: "MiniStar Japanese support boundary",
                status: "blocked" as const,
                evidence:
                  "Japanese support remains support-only and hiragana-safe for early levels; English remains the trigger.",
                requiredRecord: "ministar_support_language_policy",
              },
            ]
          : []),
      ],
      decisionOptions: [
        "Return to external builder",
        "Approve wrapper integration review",
        "Reject integration",
      ],
      requiredBeforeDecision: [
        "All prototype evidence reviewed",
        "Manual Codex review completed",
        "No tenant hard-coding",
        "No support-language progress trigger",
        "No hidden score or reward authority",
        "No inaccessible learner controls",
      ],
      blockedActions: [
        "No integration approval",
        "No apps/web patch generation",
        "No direct import",
        "No route registry write",
        "No student-facing route",
        "No scoring profile mutation",
        "No Star Dust or reward write",
        "No audio manifest mutation",
        "No package promotion",
        "No assignment",
      ],
    };

    return {
      ...decision,
      status: deriveAiPrototypeCodexIntegrationDecisionStatus(decision.checks),
    };
  });

export const sampleAiPrototypeCodexIntegrationDecisionErrors = validateAiPrototypeCodexIntegrationDecisions(
  sampleAiPrototypeCodexIntegrationDecisions,
);

export const sampleAiPrototypeCodexIntegrationDecisionWarnings =
  getAiPrototypeCodexIntegrationDecisionCollectionWarnings(sampleAiPrototypeCodexIntegrationDecisions);

export function filterAiPrototypeCodexIntegrationDecisionsByTenant(
  decisions: AiPrototypeCodexIntegrationDecision[],
  tenantId: string,
): AiPrototypeCodexIntegrationDecision[] {
  return decisions.filter((decision) => decision.tenantId === tenantId);
}

function toDecisionCheckStatus(status: string | undefined): AiPrototypeCodexIntegrationDecisionCheckStatus {
  if (status === "reviewed" || status === "passed") {
    return "reviewed";
  }
  if (status === "pending-review" || status === "review-required") {
    return "pending-review";
  }
  return "blocked";
}
