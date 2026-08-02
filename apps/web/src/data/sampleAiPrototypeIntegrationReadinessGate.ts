import { sampleAiPrototypeIntegrationPlans } from "@/data/sampleAiPrototypeIntegrationPlan";

export type AiPrototypeIntegrationReadinessGateStatus = "blocked" | "review-only" | "ready-for-codex-review";
export type AiPrototypeIntegrationEvidenceStatus = "missing" | "pending-review" | "blocked" | "reviewed";

export interface AiPrototypeIntegrationEvidenceCheck {
  checkId: string;
  label: string;
  sourceRecord: string;
  status: AiPrototypeIntegrationEvidenceStatus;
  requiredBeforeIntegration: boolean;
  blocker: string;
}

export interface AiPrototypeIntegrationReadinessGate {
  gateId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeIntegrationReadinessGateStatus;
  summary: string;
  sourceRecords: string[];
  evidenceChecks: AiPrototypeIntegrationEvidenceCheck[];
  integrationPolicy: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const sampleAiPrototypeIntegrationReadinessGates: AiPrototypeIntegrationReadinessGate[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";

    return {
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
        ),
        createEvidenceCheck(
          "fixture-replay-report",
          "Fixture replay report",
          "prototype_fixture_replay_report",
          "Missing reviewed JSON fixture replay; no hard-coded unit content allowed.",
        ),
        createEvidenceCheck(
          "event-replay-report",
          "Event replay report",
          "prototype_event_replay_report",
          "Missing standard event replay; no hidden progress stream allowed.",
        ),
        createEvidenceCheck(
          "audio-coverage-report",
          "Audio coverage report",
          "prototype_audio_coverage_report",
          "Missing tap-to-speak and control replay evidence.",
        ),
        createEvidenceCheck(
          "mobile-accessibility-report",
          "Mobile accessibility report",
          "prototype_mobile_accessibility_report",
          "Missing mobile viewport, touch target, focus, and readable-control evidence.",
        ),
        createEvidenceCheck(
          "scoring-replay-report",
          "Scoring replay report",
          "prototype_scoring_replay_report",
          "Missing deterministic scoring replay; no score, Star Dust, mastery, or reward authority allowed.",
        ),
        createEvidenceCheck(
          "codex-integration-review-decision",
          "Codex integration decision",
          "codex_integration_review_decision",
          "Codex integration decision missing; no apps/web patch can be proposed.",
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
  });

function createEvidenceCheck(
  checkId: string,
  label: string,
  sourceRecord: string,
  blocker: string,
): AiPrototypeIntegrationEvidenceCheck {
  return {
    checkId,
    label,
    sourceRecord,
    status: "blocked",
    requiredBeforeIntegration: true,
    blocker,
  };
}

export function filterAiPrototypeIntegrationReadinessGatesByTenant(
  gates: AiPrototypeIntegrationReadinessGate[],
  tenantId: string,
): AiPrototypeIntegrationReadinessGate[] {
  return gates.filter((gate) => gate.tenantId === tenantId);
}
