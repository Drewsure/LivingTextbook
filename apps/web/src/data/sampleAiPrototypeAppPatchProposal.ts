import { sampleAiPrototypeCodexIntegrationDecisions } from "@/data/sampleAiPrototypeCodexIntegrationDecision";

export type AiPrototypeAppPatchProposalStatus = "blocked" | "review-only" | "ready-for-planning";
export type AiPrototypePatchGateStatus = "missing" | "blocked" | "pending-review" | "reviewed";

export interface AiPrototypePatchFileScope {
  path: string;
  action: "wrapper-only" | "fixture-only" | "route-preview" | "test-only";
  note: string;
}

export interface AiPrototypePatchGate {
  label: string;
  status: AiPrototypePatchGateStatus;
  requiredRecord: string;
  note: string;
}

export interface AiPrototypeAppPatchProposal {
  proposalId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiPrototypeAppPatchProposalStatus;
  summary: string;
  sourceRecords: string[];
  proposedScope: AiPrototypePatchFileScope[];
  requiredBeforePatch: AiPrototypePatchGate[];
  requiredTestGates: AiPrototypePatchGate[];
  blockedActions: string[];
}

export const sampleAiPrototypeAppPatchProposals: AiPrototypeAppPatchProposal[] =
  sampleAiPrototypeCodexIntegrationDecisions.map((decision) => {
    const isMiniStar = decision.tenantId === "ministar";

    return {
      proposalId: `ai-prototype-app-patch-proposal-${decision.requestId}`,
      tenantId: decision.tenantId,
      requestId: decision.requestId,
      label: isMiniStar
        ? "MiniStar prototype app patch proposal preview"
        : "Prototype app patch proposal preview",
      status: "blocked",
      summary: isMiniStar
        ? "MiniStar prototype patch planning remains blocked until Codex records an accepted decision, support-language boundaries are confirmed, and every integration test gate is named."
        : "Prototype patch planning remains blocked until Codex records an accepted decision and every integration test gate is named.",
      sourceRecords: [
        "codex_integration_review_decision",
        "ai_prototype_integration_readiness_gate",
        "ai_prototype_integration_plan",
        "ai_prototype_wrapper_adapter_review",
        "ai_prototype_fixture_replay_report",
        "ai_prototype_event_replay_report",
        "ai_prototype_audio_coverage_report",
        "ai_prototype_mobile_accessibility_report",
        "ai_prototype_scoring_replay_report",
      ],
      proposedScope: [
        {
          path: "apps/web/src/features/games/adapters/*",
          action: "wrapper-only",
          note: "Future patch may add a removable parent-engine adapter only after Codex decision acceptance.",
        },
        {
          path: "apps/web/src/data/reviewed-fixtures/*",
          action: "fixture-only",
          note: "Future patch may add reviewed JSON fixtures, not hard-coded unit text inside game code.",
        },
        {
          path: "apps/web/src/app/*",
          action: "route-preview",
          note: "Future route changes remain preview-only until release-control and launch-safety gates pass.",
        },
        {
          path: "scripts/verify-*",
          action: "test-only",
          note: "Future patch must add route, event, audio, scoring, accessibility, and storage verifier coverage.",
        },
      ],
      requiredBeforePatch: [
        {
          label: "Accepted Codex decision",
          status: "blocked",
          requiredRecord: "codex_integration_review_decision",
          note: "No decision is recorded yet, so patch generation stays blocked.",
        },
        {
          label: "All-evidence readiness gate",
          status: "blocked",
          requiredRecord: "ai_prototype_integration_readiness_gate",
          note: "Wrapper, fixture, event, audio, mobile, scoring, and Codex evidence must be reviewed together.",
        },
        {
          label: "Reviewer identity signature",
          status: "blocked",
          requiredRecord: "reviewer_identity_signature_gate",
          note: "Future patch proposals need accountable reviewer identity before app files can be changed.",
        },
        {
          label: "Release-control binding",
          status: "blocked",
          requiredRecord: "package_publish_gate",
          note: "No generated route or package promotion can be created outside release control.",
        },
      ],
      requiredTestGates: [
        {
          label: "Fixture replay",
          status: "pending-review",
          requiredRecord: "ai_prototype_fixture_replay_report",
          note: "Patch scope must prove reviewed JSON fixtures drive all learner-facing content.",
        },
        {
          label: "Standard event replay",
          status: "pending-review",
          requiredRecord: "ai_prototype_event_replay_report",
          note: "Patch scope must keep standard LivingTextbook events in order.",
        },
        {
          label: "Target-language audio coverage",
          status: "pending-review",
          requiredRecord: "ai_prototype_audio_coverage_report",
          note: "Patch scope must preserve tap-to-speak and control replay coverage.",
        },
        {
          label: "Mobile accessibility",
          status: "pending-review",
          requiredRecord: "ai_prototype_mobile_accessibility_report",
          note: "Patch scope must keep phone-first controls visible and accessible.",
        },
        {
          label: "Deterministic scoring replay",
          status: "pending-review",
          requiredRecord: "ai_prototype_scoring_replay_report",
          note: "Patch scope must not own score, Star Dust, rewards, or mastery outside parent profiles.",
        },
      ],
      blockedActions: [
        "No app file writes",
        "No generated route write",
        "No student-facing route",
        "No scoring or reward mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No assignment",
        ...(isMiniStar ? ["No Japanese support-language trigger"] : []),
      ],
    };
  });

export function filterAiPrototypeAppPatchProposalsByTenant(
  proposals: AiPrototypeAppPatchProposal[],
  tenantId: string,
): AiPrototypeAppPatchProposal[] {
  return proposals.filter((proposal) => proposal.tenantId === tenantId);
}
