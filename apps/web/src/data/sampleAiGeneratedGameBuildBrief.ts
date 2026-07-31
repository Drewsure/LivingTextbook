import type { GameModeId } from "@living-textbook/content-model";
import { sampleAiEngineBindingPlans } from "@/data/sampleAiEngineBindingPlan";
import { sampleAiGameGeneratorPlan } from "@/data/sampleAiGameGeneratorPlan";
import { sampleAiGeneratorAudioCoveragePlans } from "@/data/sampleAiGeneratorAudioCoveragePlan";
import { sampleAiGamificationMappingPlans } from "@/data/sampleAiGamificationMappingPlan";

export type AiGeneratedGameBuildBriefStatus = "review-only" | "blocked";

export interface AiGeneratedGameModeBuildBrief {
  modeId: GameModeId;
  title: string;
  parentEngine: string;
  implementationTarget: string;
  prototypeScope: string;
  jsonFixture: string;
  eventContract: string[];
  audioContract: string[];
  scoringContract: string[];
  integrationNotes: string[];
  deliverables: string[];
}

export interface AiGeneratedGameBuildBriefPacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  label: string;
  targetBuilder: string;
  summary: string;
  status: AiGeneratedGameBuildBriefStatus;
  sourceRecords: string[];
  modeBriefs: AiGeneratedGameModeBuildBrief[];
  acceptanceChecks: string[];
  blockedActions: string[];
}

const parentEngineByMode: Partial<Record<GameModeId, string>> = {
  flashcards: "pairing",
  "memory-match": "pairing",
  "sentence-builder": "text-spelling",
  quiz: "selection",
  "speak-it": "speaking-listening",
};

const modeTitleByMode: Partial<Record<GameModeId, string>> = {
  flashcards: "Entry Flashcards",
  "memory-match": "Memory Match",
  "sentence-builder": "Sentence Builder",
  quiz: "Teacher Review Quiz",
  "speak-it": "Speak It",
};

export const sampleAiGeneratedGameBuildBriefPackets: AiGeneratedGameBuildBriefPacket[] =
  sampleAiEngineBindingPlans.map((bindingPlan) => {
    const request = sampleAiGameGeneratorPlan.requests.find((item) => item.requestId === bindingPlan.requestId);
    const audioPlan = sampleAiGeneratorAudioCoveragePlans.find((plan) => plan.requestId === bindingPlan.requestId);
    const gamificationPlan = sampleAiGamificationMappingPlans.find((plan) => plan.requestId === bindingPlan.requestId);
    const isMiniStar = bindingPlan.tenantId === "ministar";

    return {
      packetId: `ai-generated-game-build-brief-${bindingPlan.requestId}`,
      tenantId: bindingPlan.tenantId,
      requestId: bindingPlan.requestId,
      label: isMiniStar ? "MiniStar generated game build brief packet" : "AI generated game build brief packet",
      targetBuilder: "Z.ai prototype brief / isolated game builder",
      summary:
        "External prototype instructions that turn the generator request into scoped game-mode build work without giving the builder authority to create live routes, assignments, scoring overrides, or package promotion.",
      status: "review-only",
      sourceRecords: [
        "ai_generation_request_packet",
        "ai_engine_binding_plan",
        "game_mode_catalog_snapshot",
        "standard_event_contract",
        "audio_cue_manifest",
        "ai_gamification_mapping_plan",
        "activity_compatibility_snapshot",
        "teacher_draft_verifier_submission",
      ],
      modeBriefs: bindingPlan.modeIds.map((modeId) =>
        createModeBuildBrief({
          modeId,
          tenantId: bindingPlan.tenantId,
          requestLabel: request?.label ?? bindingPlan.label,
          targetLanguage: request?.targetLanguage ?? "English",
          audioRule: audioPlan?.learningAudioPriorityRule ?? "Learning audio must be reviewed before student use.",
          rewardRule:
            gamificationPlan?.summary ??
            "Generated game scoring must remain deterministic and use the accepted event contract.",
          isMiniStar,
        }),
      ),
      acceptanceChecks: [
        "Prototype reads the supplied JSON fixture shape and does not invent payload fields.",
        "Prototype emits standard_event_contract events only.",
        "Every visible target-language text item has tap-to-speak or replay wiring.",
        "Scoring is deterministic and cannot create random rewards, generated gacha, or media-only mastery.",
        "Prototype remains isolated until Codex integration review binds it to a parent engine route.",
        "Phaser builds wrap the LivingTextbook event and payload contract instead of replacing it.",
      ],
      blockedActions: [
        "No standalone game promotion",
        "No Phaser bypass without parent-engine wrapper",
        "No generated game route write",
        "No scoring profile override",
        "No student assignment from build brief",
        "No media-only progress shortcut",
        ...(isMiniStar ? ["No Japanese support-language scoring or release"] : []),
      ],
    };
  });

function createModeBuildBrief({
  modeId,
  tenantId,
  requestLabel,
  targetLanguage,
  audioRule,
  rewardRule,
  isMiniStar,
}: {
  modeId: GameModeId;
  tenantId: string;
  requestLabel: string;
  targetLanguage: string;
  audioRule: string;
  rewardRule: string;
  isMiniStar: boolean;
}): AiGeneratedGameModeBuildBrief {
  const parentEngine = parentEngineByMode[modeId] ?? "selection";
  const modeTitle = modeTitleByMode[modeId] ?? modeId;

  return {
    modeId,
    title: `${modeTitle} build brief`,
    parentEngine,
    implementationTarget:
      parentEngine === "speaking-listening"
        ? "DOM reference shell first; microphone scoring remains teacher/premium gated."
        : "DOM reference shell first; Phaser or premium skin may follow only after wrapper review.",
    prototypeScope: `${tenantId} / ${requestLabel} / ${modeTitle}`,
    jsonFixture:
      "Use the generator payload fixture with unit_meta, pedagogical_payload, audio_cues, game_mode_config, scoring_profile, and blocked_actions.",
    eventContract: [
      "game_started",
      "round_shown",
      "audio_requested",
      "answer_submitted",
      "answer_result",
      "mastery_updated",
      "game_completed",
    ],
    audioContract: [
      `${targetLanguage} target-language text is the learning trigger.`,
      audioRule,
      "Instructions, terms, sentences, feedback, and critical controls need tap-to-speak or replay.",
      "Support-language audio is support-only and cannot unlock progress.",
      ...(isMiniStar ? ["Foundation MiniStar Japanese support must remain hiragana-only."] : []),
    ],
    scoringContract: [
      "Use deterministic scoring only.",
      "Emit accepted learning events before any score update.",
      rewardRule,
      "No random reward generation, generated gacha, media-only Star Dust, or support-language-only mastery.",
    ],
    integrationNotes: [
      "Keep prototype files isolated until integration review.",
      "Do not import legacy code into apps/web without a Codex integration plan.",
      "Phaser can be used for arcade polish after it reports the same JSON, audio, scoring, and event contract.",
      "No tenant branding, avatar, mascot, or media asset should be hard-coded as universal.",
    ],
    deliverables: [
      "Prototype component or game shell",
      "Sample JSON fixture",
      "README with integration notes",
      "Event log demo",
      "Audio interaction notes",
      "Known blockers and unsupported shortcuts",
    ],
  };
}

export function filterAiGeneratedGameBuildBriefPacketsByTenant(
  packets: AiGeneratedGameBuildBriefPacket[],
  tenantId: string,
): AiGeneratedGameBuildBriefPacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}
