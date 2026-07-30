import type { GameModeId } from "@living-textbook/content-model";

export interface AiEngineBindingPlan {
  bindingPlanId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  modeIds: GameModeId[];
  requiredRecords: string[];
  integrationRules: string[];
  blockedActions: string[];
}

export const sampleAiEngineBindingPlans: AiEngineBindingPlan[] = [
  {
    bindingPlanId: "engine-binding-sample-publisher-ai-game-request-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher generated-mode engine binding",
    summary:
      "Review-only binding that maps generated activity proposals to existing mode catalog entries, parent engines, scoring profiles, and standard events.",
    modeIds: ["flashcards", "memory-match", "sentence-builder", "quiz"],
    requiredRecords: [
      "ai_engine_binding_plan",
      "game_mode_catalog_snapshot",
      "engine_mode_config_binding",
      "scoring_profile_binding",
      "standard_event_contract",
      "teacher_draft_verifier_submission",
    ],
    integrationRules: [
      "Mode config required before generated content can target a game.",
      "Parent engine binding required before playable route creation.",
      "Standard progress events required for every generated activity.",
      "Phaser or premium skins must wrap parent-engine logic rather than replace it.",
      "Z.ai prototypes stay isolated until integration review.",
    ],
    blockedActions: [
      "Generated game code blocked",
      "One-off generated game blocked",
      "Bypass parent engine blocked",
      "Unmapped mode blocked",
      "Scoring profile override blocked",
      "Student route creation blocked",
    ],
  },
  {
    bindingPlanId: "engine-binding-ministar-ai-game-request-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar generated-mode engine binding",
    summary:
      "Review-only binding that maps the MiniStar greetings generator pathway to existing mode catalog entries, parent engines, scoring profiles, audio requirements, and standard events.",
    modeIds: ["flashcards", "memory-match", "speak-it", "quiz"],
    requiredRecords: [
      "ai_engine_binding_plan",
      "game_mode_catalog_snapshot",
      "engine_mode_config_binding",
      "scoring_profile_binding",
      "standard_event_contract",
      "teacher_draft_verifier_submission",
    ],
    integrationRules: [
      "Mode config required before generated MiniStar content can target a game.",
      "Parent engine binding required before playable route creation.",
      "Standard progress events required for every generated activity.",
      "Speaking games must preserve teacher microphone approval and premium speech scoring gates.",
      "Phaser or premium skins must wrap parent-engine logic rather than replace it.",
      "Z.ai prototypes stay isolated until integration review.",
    ],
    blockedActions: [
      "Generated game code blocked",
      "One-off generated game blocked",
      "Bypass parent engine blocked",
      "Unmapped mode blocked",
      "Scoring profile override blocked",
      "Microphone scoring bypass blocked",
      "Student route creation blocked",
    ],
  },
];

export function filterAiEngineBindingPlansByTenant(
  plans: AiEngineBindingPlan[],
  tenantId: string,
): AiEngineBindingPlan[] {
  return plans.filter((plan) => plan.tenantId === tenantId);
}
