import { sampleAiPrototypePatchTestReadinessGates } from "@/data/sampleAiPrototypePatchTestReadinessGate";

export type AiPrototypePatchTestHarnessPlanStatus = "blocked" | "review-only" | "ready-for-harness-design";
export type AiPrototypePatchHarnessSectionStatus = "blocked" | "needs-record" | "planned";

export interface AiPrototypePatchHarnessSection {
  sectionId: string;
  label: string;
  status: AiPrototypePatchHarnessSectionStatus;
  requiredInput: string;
  plannedChecks: string[];
  blockedActions: string[];
}

export interface AiPrototypePatchTestHarnessPlan {
  planId: string;
  tenantId: string;
  requestId: string;
  readinessGateId: string;
  label: string;
  status: AiPrototypePatchTestHarnessPlanStatus;
  summary: string;
  runtimePolicy: string[];
  requiredInputs: string[];
  harnessSections: AiPrototypePatchHarnessSection[];
  nonExecutionOutputs: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const sampleAiPrototypePatchTestHarnessPlans: AiPrototypePatchTestHarnessPlan[] =
  sampleAiPrototypePatchTestReadinessGates.map((gate) => {
    const isMiniStar = gate.tenantId === "ministar";

    return {
      planId: `ai-prototype-patch-test-harness-plan-${gate.requestId}`,
      tenantId: gate.tenantId,
      requestId: gate.requestId,
      readinessGateId: gate.gateId,
      label: isMiniStar ? "MiniStar patch test harness plan" : "Prototype patch test harness plan",
      status: "blocked",
      summary: isMiniStar
        ? "MiniStar patch harness design remains blocked until fixture, event, audio, mobile, scoring, route, storage, rollback, and hiragana support-only checks are reviewed."
        : "Patch harness design remains blocked until fixture, event, audio, mobile, scoring, route, storage, and rollback checks are reviewed.",
      runtimePolicy: [
        "Review-only plan; no runnable harness is exposed here.",
        "Harness design must use fixture data and wrapper boundaries only.",
        "Target-language events remain the only progress candidates.",
        "Support language can be checked for display and audio support, never mastery.",
        "No app files, routes, package state, score state, reward state, or audio manifests can be mutated from this plan.",
      ],
      requiredInputs: [
        "ai_prototype_patch_test_readiness_gate",
        "ai_prototype_app_patch_proposal",
        "reviewed_unit_json_fixture",
        "standard_event_contract",
        "audio_cue_manifest",
        "game_scoring_profile_snapshot",
        "route_safety_release_gate",
        "rollback_drill_record",
        "storage_contract_verification",
        "codex_patch_approval_decision",
      ],
      harnessSections: [
        {
          sectionId: "fixture-replay-harness",
          label: "Fixture replay harness",
          status: "planned",
          requiredInput: "reviewed_unit_json_fixture",
          plannedChecks: [
            "Load generated unit JSON without hard-coded unit text.",
            "Verify 8-12 vocabulary terms and exactly 2 target sentence structures.",
            "Verify teacher launch protocol exists before package review.",
          ],
          blockedActions: ["No fixture mutation", "No package assembly", "No student route"],
        },
        {
          sectionId: "standard-event-harness",
          label: "Standard event harness",
          status: "planned",
          requiredInput: "standard_event_contract",
          plannedChecks: [
            "Replay game_started, round_shown, audio_requested, answer_submitted, answer_result, mastery_updated, and game_completed events.",
            "Reject hidden progress streams and unsupported payload fields.",
            "Keep report previews read-only.",
          ],
          blockedActions: ["No progress stream write", "No report export", "No assignment write"],
        },
        {
          sectionId: "audio-coverage-harness",
          label: "Target-language audio harness",
          status: "planned",
          requiredInput: "audio_cue_manifest",
          plannedChecks: [
            "Verify tap-to-speak cues for target-language text.",
            "Verify instruction, feedback, listen, replay, and submit controls have separate audio cue coverage.",
            "Reject generated voice calls unless a future premium entitlement exists.",
          ],
          blockedActions: ["No audio manifest mutation", "No live voice API call", "No media-only mastery"],
        },
        {
          sectionId: "mobile-accessibility-harness",
          label: "Mobile accessibility harness",
          status: "planned",
          requiredInput: "template_rendering_profile",
          plannedChecks: [
            "Check phone viewport layout, touch targets, focus order, readable text, and stable DOM controls.",
            "Confirm canvas or Phaser views keep accessible wrapper controls.",
            "Confirm teacher-facing panels stay usable on tablets.",
          ],
          blockedActions: ["No accessibility waiver", "No student-facing preview", "No route promotion"],
        },
        {
          sectionId: "deterministic-scoring-harness",
          label: "Deterministic scoring harness",
          status: "planned",
          requiredInput: "game_scoring_profile_snapshot",
          plannedChecks: [
            "Replay score outcomes against parent scoring profiles.",
            "Confirm Star Dust, mastery, and collection events remain parent-owned.",
            "Reject random rewards and support-language-only mastery.",
          ],
          blockedActions: ["No score write", "No Star Dust write", "No reward inventory write"],
        },
        {
          sectionId: "route-safety-harness",
          label: "Route safety harness",
          status: "needs-record",
          requiredInput: "route_safety_release_gate",
          plannedChecks: [
            "Dry-check proposed route aliases without mutating the registry.",
            "Reject direct student-facing route creation.",
            "Confirm QR targets remain controlled front-door paths.",
          ],
          blockedActions: ["No route registry write", "No QR mutation", "No student-facing route"],
        },
        {
          sectionId: "storage-contract-harness",
          label: "Storage contract harness",
          status: "planned",
          requiredInput: "storage_contract_verification",
          plannedChecks: [
            "Check hosted and local adapters preserve patch readiness records.",
            "Confirm local backup/export cannot enable offline test execution.",
            "Confirm raw learner audio and transcripts stay rejected.",
          ],
          blockedActions: ["No migration execution", "No object storage write", "No local folder activation"],
        },
        {
          sectionId: "rollback-dry-run-harness",
          label: "Rollback dry-run harness",
          status: "needs-record",
          requiredInput: "rollback_drill_record",
          plannedChecks: [
            "Verify rollback owner, revert scope, feature flag, package snapshot, and release audit entry.",
            "Confirm rollback planning cannot delete learner data or mutate production QR redirects.",
            "Confirm fallback messaging exists before a live pilot.",
          ],
          blockedActions: ["No file revert", "No production redirect mutation", "No live notification"],
        },
        ...(isMiniStar
          ? [
              {
                sectionId: "hiragana-support-harness",
                label: "Hiragana support-language harness",
                status: "planned" as AiPrototypePatchHarnessSectionStatus,
                requiredInput: "assist_language_policy",
                plannedChecks: [
                  "Confirm Foundation Japanese support text is hiragana-only.",
                  "Confirm Japanese support audio cannot unlock English progress.",
                  "Confirm English remains the target-language trigger for scoring and mastery.",
                ],
                blockedActions: [
                  "No Japanese support-language scoring",
                  "No support-language progress trigger",
                  "No Japanese support release",
                ],
              },
            ]
          : []),
      ],
      nonExecutionOutputs: [
        "Fixture test manifest",
        "Event assertion map",
        "Audio cue coverage checklist",
        "Mobile viewport checklist",
        "Scoring replay checklist",
        "Route safety smoke checklist",
        "Storage adapter checklist",
        "Rollback dry-run checklist",
      ],
      blockedActions: [
        "No test execution from this plan",
        "No Playwright run from this plan",
        "No app file write",
        "No app patch generation",
        "No route mutation",
        "No scoring or reward mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No assignment",
        "No support-language progress trigger",
      ],
      nextRequiredRecords: [
        "Patch harness implementation proposal",
        "Route safety release gate",
        "Rollback drill record",
        "Storage contract verification",
        "Codex patch approval decision",
      ],
    };
  });

export function filterAiPrototypePatchTestHarnessPlansByTenant(
  plans: AiPrototypePatchTestHarnessPlan[],
  tenantId: string,
): AiPrototypePatchTestHarnessPlan[] {
  return plans.filter((plan) => plan.tenantId === tenantId);
}
