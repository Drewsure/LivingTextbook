export type AiGeneratedGameBuildBriefStatus = "review-only" | "blocked";

export interface AiGeneratedGameModeBuildBrief<ModeId extends string = string> {
  modeId: ModeId;
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

export interface AiGeneratedGameBuildBriefPacket<ModeId extends string = string> {
  packetId: string;
  tenantId: string;
  requestId: string;
  label: string;
  targetBuilder: string;
  summary: string;
  status: AiGeneratedGameBuildBriefStatus;
  sourceRecords: string[];
  modeBriefs: AiGeneratedGameModeBuildBrief<ModeId>[];
  acceptanceChecks: string[];
  blockedActions: string[];
}

export const AI_GENERATED_GAME_BUILD_BRIEF_REQUIRED_SOURCE_RECORDS = [
  "ai_generation_request_packet",
  "ai_engine_binding_plan",
  "game_mode_catalog_snapshot",
  "standard_event_contract",
  "audio_cue_manifest",
  "ai_gamification_mapping_plan",
  "activity_compatibility_snapshot",
  "teacher_draft_verifier_submission",
] as const;

export const AI_GENERATED_GAME_BUILD_BRIEF_REQUIRED_EVENTS = [
  "game_started",
  "round_shown",
  "audio_requested",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
] as const;

export const AI_GENERATED_GAME_BUILD_BRIEF_REQUIRED_BLOCKED_ACTIONS = [
  "No standalone game promotion",
  "No Phaser bypass without parent-engine wrapper",
  "No generated game route write",
  "No scoring profile override",
  "No student assignment from build brief",
  "No media-only progress shortcut",
] as const;

export function validateAiGeneratedGameBuildBriefPacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI generated game build brief packet must be a JSON object."];
  }

  const packetId = readString(packet, "packetId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const targetBuilder = readString(packet, "targetBuilder");
  const status = readString(packet, "status");
  const sourceRecords = readStringArray(packet, "sourceRecords");
  const acceptanceChecks = readStringArray(packet, "acceptanceChecks");
  const blockedActions = readStringArray(packet, "blockedActions");
  const modeBriefs = readModeBriefs(packet);

  if (!packetId || !tenantId || !requestId) {
    errors.push("AI generated game build brief packet must include packetId, tenantId, and requestId.");
  }

  if (status !== "review-only") {
    errors.push("AI generated game build brief packet must stay review-only.");
  }

  if (!targetBuilder.includes("Z.ai") || !targetBuilder.toLowerCase().includes("isolated")) {
    errors.push("AI generated game build brief packet must target Z.ai or an isolated external prototype builder.");
  }

  for (const requiredRecord of AI_GENERATED_GAME_BUILD_BRIEF_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(requiredRecord)) {
      errors.push(`AI generated game build brief packet must include source record: ${requiredRecord}.`);
    }
  }

  for (const requiredAction of AI_GENERATED_GAME_BUILD_BRIEF_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, requiredAction)) {
      errors.push(`AI generated game build brief packet must block: ${requiredAction}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language scoring or release")) {
    errors.push("MiniStar AI generated game build brief packet must block Japanese support-language scoring or release.");
  }

  if (acceptanceChecks.length === 0) {
    errors.push("AI generated game build brief packet must include acceptance checks.");
  }

  if (modeBriefs.length === 0) {
    errors.push("AI generated game build brief packet must include mode build briefs.");
  }

  for (const brief of modeBriefs) {
    validateModeBuildBrief(brief, errors);
  }

  return errors;
}

export function getAiGeneratedGameBuildBriefPacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const summary = readString(packet, "summary").toLowerCase();
  const modeBriefs = readModeBriefs(packet);

  if (!summary.includes("parent-engine")) {
    warnings.push("AI generated game build brief packet should state the parent-engine boundary.");
  }

  if (!modeBriefs.some((brief) => brief.integrationNotes.join(" ").toLowerCase().includes("phaser"))) {
    warnings.push("AI generated game build brief packet should explain when Phaser is allowed.");
  }

  return warnings;
}

export function validateAiGeneratedGameBuildBriefPackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiGeneratedGameBuildBriefPacket(packet));
}

export function getAiGeneratedGameBuildBriefPacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiGeneratedGameBuildBriefPacketWarnings(packet));
}

function validateModeBuildBrief(brief: AiGeneratedGameModeBuildBrief, errors: string[]) {
  if (!brief.modeId || !brief.title || !brief.parentEngine || !brief.implementationTarget || !brief.prototypeScope) {
    errors.push("AI generated game mode build briefs must include mode id, title, parent engine, target, and scope.");
  }

  if (!brief.jsonFixture.includes("unit_meta") || !brief.jsonFixture.includes("pedagogical_payload")) {
    errors.push("AI generated game mode build briefs must require unit_meta and pedagogical_payload in the JSON fixture.");
  }

  for (const requiredEvent of AI_GENERATED_GAME_BUILD_BRIEF_REQUIRED_EVENTS) {
    if (!brief.eventContract.includes(requiredEvent)) {
      errors.push(`AI generated game mode build brief must include event: ${requiredEvent}.`);
    }
  }

  if (!textListIncludes(brief.audioContract, "target-language text is the learning trigger")) {
    errors.push("AI generated game mode build brief must keep target-language text as the learning trigger.");
  }

  if (!textListIncludes(brief.audioContract, "tap-to-speak or replay")) {
    errors.push("AI generated game mode build brief must require tap-to-speak or replay audio.");
  }

  if (!textListIncludes(brief.audioContract, "Support-language audio is support-only")) {
    errors.push("AI generated game mode build brief must keep support-language audio support-only.");
  }

  if (!textListIncludes(brief.scoringContract, "Use deterministic scoring only")) {
    errors.push("AI generated game mode build brief must require deterministic scoring.");
  }

  if (!textListIncludes(brief.scoringContract, "No random reward generation")) {
    errors.push("AI generated game mode build brief must block random reward generation.");
  }

  if (!textListIncludes(brief.integrationNotes, "Phaser can be used")) {
    errors.push("AI generated game mode build brief must allow Phaser only behind the wrapper and event contract.");
  }

  if (brief.deliverables.length === 0) {
    errors.push("AI generated game mode build brief must include deliverables.");
  }
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function readModeBriefs(source: Record<string, unknown>): AiGeneratedGameModeBuildBrief[] {
  const value = source.modeBriefs;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((brief) => ({
    modeId: readString(brief, "modeId"),
    title: readString(brief, "title"),
    parentEngine: readString(brief, "parentEngine"),
    implementationTarget: readString(brief, "implementationTarget"),
    prototypeScope: readString(brief, "prototypeScope"),
    jsonFixture: readString(brief, "jsonFixture"),
    eventContract: readStringArray(brief, "eventContract"),
    audioContract: readStringArray(brief, "audioContract"),
    scoringContract: readStringArray(brief, "scoringContract"),
    integrationNotes: readStringArray(brief, "integrationNotes"),
    deliverables: readStringArray(brief, "deliverables"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
