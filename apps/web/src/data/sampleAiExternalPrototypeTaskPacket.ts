import type { GameModeId } from "@living-textbook/content-model";
import {
  sampleAiGeneratedGameBuildBriefPackets,
  type AiGeneratedGameModeBuildBrief,
} from "@/data/sampleAiGeneratedGameBuildBrief";
import {
  sampleGamePrototypeAssignmentPlan,
  type GamePrototypeAssignment,
  type PrototypeBuildSurface,
} from "@/data/sampleGamePrototypeAssignmentPlan";

export type AiExternalPrototypeTaskPacketStatus = "review-only" | "blocked";
export type AiExternalPrototypeTaskStatus = "copy-ready-preview" | "needs-contract" | "deferred";
export type AiExternalPrototypeTaskSurface = "dom-reference" | "phaser-wrapper" | "hybrid-wrapper" | "defer";

export const aiExternalPrototypeTaskSurfaceLabels: Record<AiExternalPrototypeTaskSurface, string> = {
  "dom-reference": "DOM reference required",
  "phaser-wrapper": "Phaser wrapper candidate",
  "hybrid-wrapper": "Hybrid wrapper candidate",
  defer: "Deferred",
};

export interface AiExternalPrototypeTask {
  taskId: string;
  modeId: GameModeId;
  title: string;
  parentEngine: string;
  recommendedSurface: AiExternalPrototypeTaskSurface;
  status: AiExternalPrototypeTaskStatus;
  repositoryScope: string;
  outputFolderRule: string;
  builderCommandSummary: string;
  fixtureRequirements: string[];
  eventRequirements: string[];
  audioRequirements: string[];
  scoringRequirements: string[];
  deliverables: string[];
  returnEvidence: string[];
  blockedActions: string[];
}

export interface AiExternalPrototypeTaskPacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  buildBriefPacketId: string;
  label: string;
  targetBuilder: string;
  status: AiExternalPrototypeTaskPacketStatus;
  handoffState: string;
  summary: string;
  sourceRecords: string[];
  permittedHandoffContents: string[];
  requiredBeforeHandoff: string[];
  blockedHandoffActions: string[];
  tasks: AiExternalPrototypeTask[];
}

const assignmentByMode = new Map(
  sampleGamePrototypeAssignmentPlan.assignments.map((assignment) => [assignment.gameMode, assignment]),
);

const surfaceByPrototypeSurface: Record<PrototypeBuildSurface, AiExternalPrototypeTaskSurface> = {
  "dom-reference": "dom-reference",
  phaser: "phaser-wrapper",
  hybrid: "hybrid-wrapper",
  defer: "defer",
};

export const sampleAiExternalPrototypeTaskPackets: AiExternalPrototypeTaskPacket[] =
  sampleAiGeneratedGameBuildBriefPackets.map((packet) => {
    const isMiniStar = packet.tenantId === "ministar";

    return {
      packetId: `ai-external-prototype-task-packet-${packet.requestId}`,
      tenantId: packet.tenantId,
      requestId: packet.requestId,
      buildBriefPacketId: packet.packetId,
      label: isMiniStar ? "MiniStar external prototype task packet" : "AI external prototype task packet",
      targetBuilder: "External builder task handoff / Z.ai",
      status: "review-only",
      handoffState: "No live handoff",
      summary:
        "Copy-ready task brief preview for outside prototype builders. It turns the generated build brief into scoped work instructions while keeping all app writes, route creation, scoring, rewards, playlists, package promotion, and student assignment blocked.",
      sourceRecords: [
        "ai_generated_game_build_brief",
        "ai_generator_responsibility_matrix",
        "ai_generator_reviewer_runbook",
        "ai_engine_binding_plan",
        "standard_event_contract",
        "audio_cue_manifest",
        "ai_reward_readiness_gate",
      ],
      permittedHandoffContents: [
        "Mode-specific task summary",
        "Reviewed JSON fixture shape",
        "Accepted event list",
        "Target-language audio rules",
        "Deterministic scoring rules",
        "Return evidence checklist",
      ],
      requiredBeforeHandoff: [
        "Teacher source evidence has been reviewed.",
        "AI cost and entitlement gate is acknowledged for any future live model or voice work.",
        "Codex confirms the parent-engine target and wrapper expectations.",
        "External builder understands Drewsure/ministar-lab only for prototype output.",
      ],
      blockedHandoffActions: [
        "No live handoff",
        "No app file writes",
        "No route creation",
        "No scoring authority",
        "No reward inventory writes",
        "No playlist creation",
        "No package assembly",
        "No student assignment",
        ...(isMiniStar ? ["No Japanese support-language progress"] : []),
      ],
      tasks: packet.modeBriefs.map((brief) => createExternalPrototypeTask(brief, isMiniStar)),
    };
  });

function createExternalPrototypeTask(
  brief: AiGeneratedGameModeBuildBrief,
  isMiniStar: boolean,
): AiExternalPrototypeTask {
  const assignment = assignmentByMode.get(brief.modeId);
  const recommendedSurface = getRecommendedSurface(brief, assignment);
  const status = getTaskStatus(assignment);
  const isPhaser = recommendedSurface === "phaser-wrapper" || recommendedSurface === "hybrid-wrapper";

  return {
    taskId: `external-prototype-task-${brief.modeId}`,
    modeId: brief.modeId,
    title: `${brief.title.replace("build brief", "external prototype task")}`,
    parentEngine: brief.parentEngine,
    recommendedSurface,
    status,
    repositoryScope: "Drewsure/ministar-lab only",
    outputFolderRule:
      "Place prototype files in an isolated preservation/prototype folder with a README. Do not modify LivingTextbook apps/web.",
    builderCommandSummary:
      assignment?.zaiInstruction ??
      (isPhaser
        ? "Build an isolated Phaser wrapper candidate that reads JSON and emits LivingTextbook events."
        : "Build an isolated DOM reference prototype that proves payload, audio, event, and scoring behavior."),
    fixtureRequirements: [
      "Use supplied unit_meta, pedagogical_payload, audio_cues, game_mode_config, scoring_profile, and blocked_actions.",
      "No hard-coded vocabulary, sentences, tenant name, mascot, avatar, media, route, score, or reward state.",
      "Fixture replay required before Codex integration review.",
    ],
    eventRequirements: [
      "game_started",
      "round_shown",
      "audio_requested",
      "answer_submitted",
      "answer_result",
      "mastery_updated",
      "game_completed",
      "Event log evidence required",
    ],
    audioRequirements: [
      "Audio cue coverage required for every target-language term, sentence, instruction, feedback, and critical control.",
      "Submit actions need a separate listen/replay control when text is involved.",
      "Support language remains support-only and cannot unlock progress.",
      ...(isMiniStar ? ["Foundation Japanese support must remain hiragana-only."] : []),
    ],
    scoringRequirements: [
      "Use deterministic scoring only.",
      "Report answer evidence through events before mastery changes.",
      "Do not write Star Dust, collection inventory, random rewards, generated gacha, or media-only mastery.",
      "No support-language-only scoring.",
    ],
    deliverables: [
      "Prototype source folder",
      "Sample JSON fixture",
      "README with setup, integration notes, and known blockers",
      "Event log sample",
      "Audio coverage notes",
      "Mobile screenshot or short rehearsal notes",
    ],
    returnEvidence: [
      "Parent-engine wrapper evidence",
      "Fixture replay evidence",
      "Standard event replay evidence",
      "Audio cue coverage evidence",
      "Deterministic scoring replay evidence",
      "Mobile accessibility evidence",
      "White-label configuration evidence",
      "Codex integration review required",
    ],
    blockedActions: [
      "No production merge",
      "No direct import into apps/web",
      "No route registry write",
      "No scoring profile mutation",
      "No audio manifest mutation",
      "No playlist write",
      "No assignment creation",
      "No student-facing preview",
      ...(isMiniStar ? ["No Japanese support-language scoring or release"] : []),
    ],
  };
}

function getRecommendedSurface(
  brief: AiGeneratedGameModeBuildBrief,
  assignment: GamePrototypeAssignment | undefined,
): AiExternalPrototypeTaskSurface {
  if (assignment) {
    return surfaceByPrototypeSurface[assignment.recommendedSurface];
  }

  if (brief.parentEngine === "selection" || brief.parentEngine === "pairing") {
    return "hybrid-wrapper";
  }

  return "dom-reference";
}

function getTaskStatus(assignment: GamePrototypeAssignment | undefined): AiExternalPrototypeTaskStatus {
  if (!assignment) {
    return "needs-contract";
  }

  if (assignment.status === "defer") {
    return "deferred";
  }

  if (assignment.status === "needs-contract") {
    return "needs-contract";
  }

  return "copy-ready-preview";
}

export function filterAiExternalPrototypeTaskPacketsByTenant(
  packets: AiExternalPrototypeTaskPacket[],
  tenantId: string,
): AiExternalPrototypeTaskPacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}
