import { sampleAiPrototypeIntegrationPlans } from "@/data/sampleAiPrototypeIntegrationPlan";
import { sampleAiPrototypeAudioCoverageReports } from "@/data/sampleAiPrototypeAudioCoverageReport";
import { sampleAiPrototypeCodexIntegrationDecisions } from "@/data/sampleAiPrototypeCodexIntegrationDecision";
import { sampleAiPrototypeEventReplayReports } from "@/data/sampleAiPrototypeEventReplayReport";
import { sampleAiPrototypeFixtureReplayReports } from "@/data/sampleAiPrototypeFixtureReplayReport";
import { sampleAiPrototypeMobileAccessibilityReports } from "@/data/sampleAiPrototypeMobileAccessibilityReport";
import { sampleAiPrototypeScoringReplayReports } from "@/data/sampleAiPrototypeScoringReplayReport";
import { sampleAiPrototypeWrapperAdapterReviews } from "@/data/sampleAiPrototypeWrapperAdapterReview";
import {
  getAiPrototypeIntegrationReadinessGateCollectionWarnings,
  deriveAiPrototypeIntegrationReadinessGateStatus,
  validateAiPrototypeIntegrationReadinessGates,
  type AiPrototypeIntegrationEvidenceCheck as SharedAiPrototypeIntegrationEvidenceCheck,
  type AiPrototypeIntegrationEvidenceStatus,
  type AiPrototypeIntegrationReadinessGate as SharedAiPrototypeIntegrationReadinessGate,
  type AiPrototypeIntegrationReadinessGateStatus,
} from "@living-textbook/content-model/src/aiPrototypeIntegrationReadinessGate";

export type AiPrototypeIntegrationEvidenceCheck = SharedAiPrototypeIntegrationEvidenceCheck;
export type AiPrototypeIntegrationReadinessGate = SharedAiPrototypeIntegrationReadinessGate;
export type { AiPrototypeIntegrationEvidenceStatus, AiPrototypeIntegrationReadinessGateStatus };

export const sampleAiPrototypeIntegrationReadinessGates: AiPrototypeIntegrationReadinessGate[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";
    const evidenceStatuses = {
      wrapper: toIntegrationEvidenceStatus(
        sampleAiPrototypeWrapperAdapterReviews.find((review) => review.requestId === plan.requestId)?.status,
      ),
      fixture: toIntegrationEvidenceStatus(
        sampleAiPrototypeFixtureReplayReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      event: toIntegrationEvidenceStatus(
        sampleAiPrototypeEventReplayReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      audio: toIntegrationEvidenceStatus(
        sampleAiPrototypeAudioCoverageReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      mobile: toIntegrationEvidenceStatus(
        sampleAiPrototypeMobileAccessibilityReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      scoring: toIntegrationEvidenceStatus(
        sampleAiPrototypeScoringReplayReports.find((report) => report.requestId === plan.requestId)?.status,
      ),
      codex: toIntegrationEvidenceStatus(
        sampleAiPrototypeCodexIntegrationDecisions.find((decision) => decision.requestId === plan.requestId)?.status,
      ),
    };
    const allUpstreamEvidenceReviewed = Object.values(evidenceStatuses).every((status) => status === "reviewed");

    const gate: AiPrototypeIntegrationReadinessGate = {
      gateId: `prototype-integration-readiness-gate-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      integrationPlanId: plan.planId,
      label: isMiniStar
        ? "MiniStar prototype integration readiness gate"
        : "AI prototype integration readiness gate",
      status: "blocked",
      summary:
        "Review-only rollup proving that every returned prototype has wrapper, fixture, event, audio, mobile, scoring, and Codex decision evidence before any apps/web integration patch can be proposed.",
      sourceRecords: [
        "ai_prototype_integration_readiness_gate",
        "ai_prototype_integration_plan",
        "ai_prototype_wrapper_adapter_review",
        "ai_prototype_fixture_replay_report",
        "ai_prototype_event_replay_report",
        "ai_prototype_audio_coverage_report",
        "ai_prototype_mobile_accessibility_report",
        "ai_prototype_scoring_replay_report",
        "codex_integration_review_decision",
      ],
      evidenceChecks: [
        createEvidenceCheck(
          "wrapper-adapter-review",
          "Wrapper adapter review",
          "prototype_wrapper_adapter_review",
          "Missing accepted wrapper adapter evidence; parent-engine wrapper only.",
          evidenceStatuses.wrapper,
        ),
        createEvidenceCheck(
          "fixture-replay-report",
          "Fixture replay report",
          "prototype_fixture_replay_report",
          "Missing reviewed JSON fixture replay; no hard-coded unit content allowed.",
          evidenceStatuses.fixture,
        ),
        createEvidenceCheck(
          "event-replay-report",
          "Event replay report",
          "prototype_event_replay_report",
          "Missing standard event replay; no hidden progress stream allowed.",
          evidenceStatuses.event,
        ),
        createEvidenceCheck(
          "audio-coverage-report",
          "Audio coverage report",
          "prototype_audio_coverage_report",
          "Missing tap-to-speak and control replay evidence.",
          evidenceStatuses.audio,
        ),
        createEvidenceCheck(
          "mobile-accessibility-report",
          "Mobile accessibility report",
          "prototype_mobile_accessibility_report",
          "Missing mobile viewport, touch target, focus, and readable-control evidence.",
          evidenceStatuses.mobile,
        ),
        createEvidenceCheck(
          "scoring-replay-report",
          "Scoring replay report",
          "prototype_scoring_replay_report",
          "Missing deterministic scoring replay; no score, Star Dust, mastery, or reward authority allowed.",
          evidenceStatuses.scoring,
        ),
        createEvidenceCheck(
          "readiness-gate",
          "Integration readiness gate",
          "ai_prototype_integration_readiness_gate",
          "All evidence checks must be reviewed before a Codex decision can be recorded.",
          allUpstreamEvidenceReviewed ? "reviewed" : "blocked",
        ),
        createEvidenceCheck(
          "codex-integration-review-decision",
          "Codex integration decision",
          "codex_integration_review_decision",
          "Codex integration decision missing; no apps/web patch can be proposed.",
          evidenceStatuses.codex,
        ),
      ],
      integrationPolicy: [
        "All prototype evidence before integration",
        "Parent-engine wrapper only",
        "Reviewed JSON fixture required",
        "Standard events required",
        "Target-language audio required",
        "Phone-first accessibility required",
        "Deterministic scoring replay required",
        ...(isMiniStar ? ["Japanese support remains hiragana-only and support-only"] : []),
      ],
      blockedActions: [
        "No apps/web patch",
        "No direct import",
        "No route registry write",
        "No student-facing route",
        "No scoring profile mutation",
        "No Star Dust or reward write",
        "No audio manifest mutation",
        "No package promotion",
        "No student assignment",
        ...(isMiniStar ? ["No Japanese support-language scoring or release"] : []),
      ],
      nextRequiredRecords: [
        "Accepted wrapper adapter review",
        "Accepted fixture replay report",
        "Accepted event replay report",
        "Accepted audio coverage report",
        "Accepted mobile accessibility report",
        "Accepted scoring replay report",
        "Codex integration decision",
      ],
    };

    return {
      ...gate,
      status: deriveAiPrototypeIntegrationReadinessGateStatus(gate.evidenceChecks),
    };
  });

export const sampleAiPrototypeIntegrationReadinessGateErrors = validateAiPrototypeIntegrationReadinessGates(
  sampleAiPrototypeIntegrationReadinessGates,
);

export const sampleAiPrototypeIntegrationReadinessGateWarnings =
  getAiPrototypeIntegrationReadinessGateCollectionWarnings(sampleAiPrototypeIntegrationReadinessGates);

function createEvidenceCheck(
  checkId: string,
  label: string,
  sourceRecord: string,
  blocker: string,
  status: AiPrototypeIntegrationEvidenceStatus,
): AiPrototypeIntegrationEvidenceCheck {
  return {
    checkId,
    label,
    sourceRecord,
    status,
    requiredBeforeIntegration: true,
    blocker,
  };
}

function toIntegrationEvidenceStatus(status: string | undefined): AiPrototypeIntegrationEvidenceStatus {
  if (status === "reviewed" || status === "passed") {
    return "reviewed";
  }
  if (status === "pending-review" || status === "review-required") {
    return "pending-review";
  }
  return "blocked";
}

export function filterAiPrototypeIntegrationReadinessGatesByTenant(
  gates: AiPrototypeIntegrationReadinessGate[],
  tenantId: string,
): AiPrototypeIntegrationReadinessGate[] {
  return gates.filter((gate) => gate.tenantId === tenantId);
}
