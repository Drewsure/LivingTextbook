import { sampleAiPrototypeAppPatchProposals } from "@/data/sampleAiPrototypeAppPatchProposal";
import {
  getAiPrototypePatchTestReadinessGateCollectionWarnings,
  validateAiPrototypePatchTestReadinessGates,
  type AiPrototypePatchTestLane as SharedAiPrototypePatchTestLane,
  type AiPrototypePatchTestLaneStatus,
  type AiPrototypePatchTestReadinessGate as SharedAiPrototypePatchTestReadinessGate,
  type AiPrototypePatchTestReadinessGateStatus,
} from "@living-textbook/content-model/src/aiPrototypePatchTestReadinessGate";

export type AiPrototypePatchTestLane = SharedAiPrototypePatchTestLane;
export type AiPrototypePatchTestReadinessGate = SharedAiPrototypePatchTestReadinessGate;
export type { AiPrototypePatchTestLaneStatus, AiPrototypePatchTestReadinessGateStatus };

export const sampleAiPrototypePatchTestReadinessGates: AiPrototypePatchTestReadinessGate[] =
  sampleAiPrototypeAppPatchProposals.map((proposal) => {
    const isMiniStar = proposal.tenantId === "ministar";

    return {
      gateId: `ai-prototype-patch-test-readiness-gate-${proposal.requestId}`,
      tenantId: proposal.tenantId,
      requestId: proposal.requestId,
      proposalId: proposal.proposalId,
      label: isMiniStar
        ? "MiniStar patch test readiness gate"
        : "Prototype patch test readiness gate",
      status: "blocked",
      summary: isMiniStar
        ? "MiniStar patch testing remains blocked until fixture, event, audio, mobile, scoring, route, storage, rollback, and hiragana support-only checks are named and reviewed."
        : "Patch testing remains blocked until fixture, event, audio, mobile, scoring, route, storage, and rollback checks are named and reviewed.",
      sourceRecords: [
        "ai_prototype_patch_test_readiness_gate",
        "ai_prototype_app_patch_proposal",
        "codex_integration_review_decision",
        "ai_prototype_integration_readiness_gate",
        "reviewer_identity_signature_gate",
        "package_publish_gate",
      ],
      testLanes: [
        {
          laneId: "fixture-replay",
          label: "Fixture replay test",
          status: "pending-review",
          requiredRecord: "ai_prototype_fixture_replay_report",
          evidenceNeeded: "Reviewed JSON fixture loads all target-language terms and sentences without hard-coded unit text.",
        },
        {
          laneId: "event-replay",
          label: "Standard event replay test",
          status: "pending-review",
          requiredRecord: "ai_prototype_event_replay_report",
          evidenceNeeded: "Prototype wrapper emits accepted events in order with no hidden progress stream.",
        },
        {
          laneId: "audio-coverage",
          label: "Target-language audio test",
          status: "pending-review",
          requiredRecord: "ai_prototype_audio_coverage_report",
          evidenceNeeded: "Tap-to-speak, instruction replay, feedback audio, and control audio remain available.",
        },
        {
          laneId: "mobile-accessibility",
          label: "Mobile accessibility smoke test",
          status: "pending-review",
          requiredRecord: "ai_prototype_mobile_accessibility_report",
          evidenceNeeded: "Phone viewport, touch targets, focus order, readable text, and DOM controls remain usable.",
        },
        {
          laneId: "scoring-replay",
          label: "Deterministic scoring replay test",
          status: "pending-review",
          requiredRecord: "ai_prototype_scoring_replay_report",
          evidenceNeeded: "Score, Star Dust, mastery, and collection events stay owned by parent scoring profiles.",
        },
        {
          laneId: "route-safety",
          label: "Route safety smoke test",
          status: "blocked",
          requiredRecord: "route_registry_release_gate",
          evidenceNeeded: "No generated route, route alias, student-facing route, or QR target changes are created.",
        },
        {
          laneId: "storage-contract",
          label: "Storage contract test",
          status: "planned",
          requiredRecord: "ai_prototype_app_patch_proposal",
          evidenceNeeded: "Hosted and local storage contracts preserve the proposal without enabling file writes.",
        },
        {
          laneId: "rollback-drill",
          label: "Rollback drill",
          status: "blocked",
          requiredRecord: "package_publish_gate",
          evidenceNeeded: "Future patch must name rollback owner, revert scope, feature flag, and package version.",
        },
        ...(isMiniStar
          ? [
              {
                laneId: "hiragana-support-boundary",
                label: "Hiragana support boundary test",
                status: "pending-review" as AiPrototypePatchTestLaneStatus,
                requiredRecord: "assist_language_policy",
                evidenceNeeded:
                  "Foundation Japanese support remains hiragana-only and cannot unlock English progress.",
              },
            ]
          : []),
      ],
      rollbackRequirements: [
        "Named Codex rollback owner",
        "Revert scope before file work",
        "Feature flag or route flag before exposure",
        "Package version snapshot before promotion",
        "Release-control audit entry before any student route",
      ],
      blockedActions: [
        "No test execution from this panel",
        "No app file write",
        "No generated route write",
        "No route alias mutation",
        "No scoring or reward mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No assignment",
        "No support-language progress trigger",
      ],
      nextRequiredRecords: [
        "Patch test harness plan",
        "Route safety release gate",
        "Rollback drill record",
        "Storage contract verification",
        "Codex patch approval decision",
      ],
    };
  });

export const sampleAiPrototypePatchTestReadinessGateErrors = validateAiPrototypePatchTestReadinessGates(
  sampleAiPrototypePatchTestReadinessGates,
);

export const sampleAiPrototypePatchTestReadinessGateWarnings =
  getAiPrototypePatchTestReadinessGateCollectionWarnings(sampleAiPrototypePatchTestReadinessGates);

export function filterAiPrototypePatchTestReadinessGatesByTenant(
  gates: AiPrototypePatchTestReadinessGate[],
  tenantId: string,
): AiPrototypePatchTestReadinessGate[] {
  return gates.filter((gate) => gate.tenantId === tenantId);
}
