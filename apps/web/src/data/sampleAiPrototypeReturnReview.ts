import type { GameModeId } from "@living-textbook/content-model";
import {
  sampleAiGeneratedGameBuildBriefPackets,
  type AiGeneratedGameModeBuildBrief,
} from "@/data/sampleAiGeneratedGameBuildBrief";

export type AiPrototypeReturnReviewStatus = "not-submitted" | "returned-review-only" | "blocked";

export interface AiPrototypeModeReturnReview {
  modeId: GameModeId;
  title: string;
  parentEngine: string;
  prototypeSurface: string;
  reviewFocus: string;
  wrapperRequirements: string[];
  eventEvidence: string[];
  audioEvidence: string[];
  scoringEvidence: string[];
  accessibilityEvidence: string[];
  blockers: string[];
}

export interface AiPrototypeReturnReviewPacket {
  reviewId: string;
  tenantId: string;
  requestId: string;
  buildBriefPacketId: string;
  label: string;
  submittedBy: string;
  status: AiPrototypeReturnReviewStatus;
  summary: string;
  returnedArtifacts: string[];
  requiredEvidence: string[];
  integrationReviewGates: string[];
  blockedActions: string[];
  modeReviews: AiPrototypeModeReturnReview[];
}

export const sampleAiPrototypeReturnReviewPackets: AiPrototypeReturnReviewPacket[] =
  sampleAiGeneratedGameBuildBriefPackets.map((packet) => {
    const isMiniStar = packet.tenantId === "ministar";

    return {
      reviewId: `prototype-return-review-${packet.requestId}`,
      tenantId: packet.tenantId,
      requestId: packet.requestId,
      buildBriefPacketId: packet.packetId,
      label: isMiniStar ? "MiniStar prototype return review" : "AI prototype return review",
      submittedBy: "External prototype builder / Z.ai return packet",
      status: "not-submitted",
      summary:
        "Review-only intake shape for returned prototype work. It defines what evidence a builder must provide before Codex considers parent-engine wrapping, test fixtures, route integration, or future package review.",
      returnedArtifacts: [
        "Prototype source folder or archive manifest",
        "Sample JSON fixture used by the prototype",
        "README with setup and integration notes",
        "Event log sample showing standard_event_contract output",
        "Audio cue map showing target-language tap-to-speak coverage",
        "Mobile screenshot or short rehearsal notes",
      ],
      requiredEvidence: [
        "Build brief id and request id match the original ai_generated_game_build_brief packet.",
        "Prototype reads the reviewed JSON fixture instead of hard-coded terms or sentences.",
        "Prototype emits standard events for started, round shown, audio requested, answer submitted, result, mastery, and completed.",
        "Learning audio is target-language first and support-language audio remains support-only.",
        "Scoring remains deterministic and cannot issue rewards directly.",
        "Returned files remain outside apps/web until Codex integration review accepts a wrapper plan.",
      ],
      integrationReviewGates: [
        "Parent-engine wrapper review",
        "JSON fixture conformance review",
        "Standard event replay review",
        "Audio cue coverage review",
        "Deterministic scoring review",
        "Mobile accessibility review",
        "White-label tenant branding review",
      ],
      blockedActions: [
        "No production merge from returned prototype",
        "No route registry write",
        "No scoring profile mutation",
        "No audio manifest mutation",
        "No assignment creation",
        "No student-facing preview from returned code",
        ...(isMiniStar ? ["No Japanese support-language scoring or release"] : []),
      ],
      modeReviews: packet.modeBriefs.map((brief) => createModeReturnReview(brief, isMiniStar)),
    };
  });

function createModeReturnReview(
  brief: AiGeneratedGameModeBuildBrief,
  isMiniStar: boolean,
): AiPrototypeModeReturnReview {
  const isPhaserCandidate = brief.parentEngine === "selection" || brief.parentEngine === "pairing";

  return {
    modeId: brief.modeId,
    title: `${brief.title.replace("build brief", "prototype return review")}`,
    parentEngine: brief.parentEngine,
    prototypeSurface: isPhaserCandidate ? "DOM reference or Phaser wrapper candidate" : "DOM reference shell required first",
    reviewFocus:
      "Confirm the prototype can be wrapped by the LivingTextbook parent engine without replacing payload, audio, scoring, event, tenant, or accessibility rules.",
    wrapperRequirements: [
      "No direct import into apps/web before integration plan.",
      "Expose a fixture-driven component boundary.",
      "Report standard_event_contract events through an adapter.",
      "Keep tenant theme, mascot, avatar, and media as injected config.",
      "Keep unsupported shortcuts visible in the README.",
    ],
    eventEvidence: [
      "game_started",
      "round_shown",
      "audio_requested",
      "answer_submitted",
      "answer_result",
      "mastery_updated",
      "game_completed",
    ],
    audioEvidence: [
      "Tap-to-speak terms",
      "Tap-to-speak sentences",
      "Instruction replay",
      "Feedback replay",
      "No support-language progress trigger",
      ...(isMiniStar ? ["Hiragana-only Japanese support for Foundation levels"] : []),
    ],
    scoringEvidence: [
      "Deterministic scoring profile snapshot",
      "No random rewards",
      "No generated gacha",
      "No media-only Star Dust",
      "No support-language-only mastery",
    ],
    accessibilityEvidence: [
      "Mobile-first layout evidence",
      "Readable learner text",
      "Touch target spacing",
      "Keyboard or reduced-motion fallback notes",
      "No text hidden inside black buttons",
    ],
    blockers: [
      "Prototype return cannot create a student route.",
      "Prototype return cannot create an assignment.",
      "Prototype return cannot override the selected parent engine.",
      "Prototype return cannot replace the audio cue manifest.",
      "Prototype return cannot alter reward rules.",
    ],
  };
}

export function filterAiPrototypeReturnReviewPacketsByTenant(
  packets: AiPrototypeReturnReviewPacket[],
  tenantId: string,
): AiPrototypeReturnReviewPacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}
