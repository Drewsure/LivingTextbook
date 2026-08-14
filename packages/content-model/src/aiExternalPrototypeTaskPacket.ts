export type AiExternalPrototypeTaskPacketStatus = "review-only" | "blocked";
export type AiExternalPrototypeTaskStatus = "copy-ready-preview" | "needs-contract" | "deferred";
export type AiExternalPrototypeTaskSurface = "dom-reference" | "phaser-wrapper" | "hybrid-wrapper" | "defer";

export interface AiExternalPrototypeTask<ModeId extends string = string> {
  taskId: string;
  modeId: ModeId;
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

export interface AiExternalPrototypeTaskPacket<ModeId extends string = string> {
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
  tasks: AiExternalPrototypeTask<ModeId>[];
}

export const AI_EXTERNAL_PROTOTYPE_TASK_REQUIRED_SOURCE_RECORDS = [
  "ai_generated_game_build_brief",
  "ai_generator_responsibility_matrix",
  "ai_generator_reviewer_runbook",
  "ai_engine_binding_plan",
  "standard_event_contract",
  "audio_cue_manifest",
  "ai_reward_readiness_gate",
] as const;

export const AI_EXTERNAL_PROTOTYPE_TASK_REQUIRED_EVENTS = [
  "game_started",
  "round_shown",
  "audio_requested",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
  "Event log evidence required",
] as const;

export const AI_EXTERNAL_PROTOTYPE_TASK_REQUIRED_BLOCKED_HANDOFF_ACTIONS = [
  "No live handoff",
  "No app file writes",
  "No route creation",
  "No scoring authority",
  "No reward inventory writes",
  "No playlist creation",
  "No package assembly",
  "No student assignment",
] as const;

export const AI_EXTERNAL_PROTOTYPE_TASK_REQUIRED_BLOCKED_TASK_ACTIONS = [
  "No production merge",
  "No direct import into apps/web",
  "No route registry write",
  "No scoring profile mutation",
  "No audio manifest mutation",
  "No playlist write",
  "No assignment creation",
  "No student-facing preview",
] as const;

export function validateAiExternalPrototypeTaskPacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI external prototype task packet must be a JSON object."];
  }

  const packetId = readString(packet, "packetId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const buildBriefPacketId = readString(packet, "buildBriefPacketId");
  const targetBuilder = readString(packet, "targetBuilder");
  const status = readString(packet, "status");
  const handoffState = readString(packet, "handoffState");
  const sourceRecords = readStringArray(packet, "sourceRecords");
  const permittedHandoffContents = readStringArray(packet, "permittedHandoffContents");
  const requiredBeforeHandoff = readStringArray(packet, "requiredBeforeHandoff");
  const blockedHandoffActions = readStringArray(packet, "blockedHandoffActions");
  const tasks = readExternalPrototypeTasks(packet);

  if (!packetId || !tenantId || !requestId || !buildBriefPacketId) {
    errors.push("AI external prototype task packet must include packetId, tenantId, requestId, and buildBriefPacketId.");
  }

  if (status !== "review-only") {
    errors.push("AI external prototype task packet must stay review-only.");
  }

  if (handoffState !== "No live handoff") {
    errors.push("AI external prototype task packet must keep live handoff blocked.");
  }

  if (!targetBuilder.includes("Z.ai")) {
    errors.push("AI external prototype task packet must name Z.ai or an equivalent external builder handoff.");
  }

  for (const requiredRecord of AI_EXTERNAL_PROTOTYPE_TASK_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(requiredRecord)) {
      errors.push(`AI external prototype task packet must include source record: ${requiredRecord}.`);
    }
  }

  if (permittedHandoffContents.length === 0) {
    errors.push("AI external prototype task packet must list permitted handoff contents.");
  }

  if (!textListIncludes(requiredBeforeHandoff, "Codex confirms")) {
    errors.push("AI external prototype task packet must require Codex confirmation before handoff.");
  }

  if (!textListIncludes(requiredBeforeHandoff, "Drewsure/ministar-lab only")) {
    errors.push("AI external prototype task packet must require Drewsure/ministar-lab only scope before handoff.");
  }

  for (const requiredAction of AI_EXTERNAL_PROTOTYPE_TASK_REQUIRED_BLOCKED_HANDOFF_ACTIONS) {
    if (!textListIncludes(blockedHandoffActions, requiredAction)) {
      errors.push(`AI external prototype task packet must block handoff action: ${requiredAction}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedHandoffActions, "No Japanese support-language progress")) {
    errors.push("MiniStar AI external prototype task packet must block Japanese support-language progress.");
  }

  if (tasks.length === 0) {
    errors.push("AI external prototype task packet must include mode tasks.");
  }

  for (const task of tasks) {
    validateExternalPrototypeTask(task, errors);
  }

  return errors;
}

export function getAiExternalPrototypeTaskPacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const tasks = readExternalPrototypeTasks(packet);

  if (!tasks.some((task) => task.recommendedSurface === "phaser-wrapper" || task.recommendedSurface === "hybrid-wrapper")) {
    warnings.push("AI external prototype task packet may have no Phaser or hybrid wrapper candidates.");
  }

  if (!tasks.every((task) => textListIncludes(task.returnEvidence, "Codex integration review required"))) {
    warnings.push("Every external prototype task should require Codex integration review evidence.");
  }

  return warnings;
}

export function validateAiExternalPrototypeTaskPackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiExternalPrototypeTaskPacket(packet));
}

export function getAiExternalPrototypeTaskPacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiExternalPrototypeTaskPacketWarnings(packet));
}

function validateExternalPrototypeTask(task: AiExternalPrototypeTask, errors: string[]) {
  if (!task.taskId || !task.modeId || !task.title || !task.parentEngine || !task.builderCommandSummary) {
    errors.push("AI external prototype tasks must include task id, mode id, title, parent engine, and command summary.");
  }

  if (task.repositoryScope !== "Drewsure/ministar-lab only") {
    errors.push("AI external prototype tasks must stay scoped to Drewsure/ministar-lab only.");
  }

  if (!task.outputFolderRule.includes("isolated") || !task.outputFolderRule.includes("Do not modify LivingTextbook apps/web")) {
    errors.push("AI external prototype tasks must require isolated output and block LivingTextbook apps/web writes.");
  }

  if (!textListIncludes(task.fixtureRequirements, "Use supplied unit_meta")) {
    errors.push("AI external prototype tasks must require supplied fixture fields.");
  }

  if (!textListIncludes(task.fixtureRequirements, "No hard-coded vocabulary")) {
    errors.push("AI external prototype tasks must block hard-coded content and tenant data.");
  }

  for (const requiredEvent of AI_EXTERNAL_PROTOTYPE_TASK_REQUIRED_EVENTS) {
    if (!task.eventRequirements.includes(requiredEvent)) {
      errors.push(`AI external prototype task must include event requirement: ${requiredEvent}.`);
    }
  }

  if (!textListIncludes(task.audioRequirements, "Audio cue coverage required")) {
    errors.push("AI external prototype tasks must require audio cue coverage.");
  }

  if (!textListIncludes(task.audioRequirements, "Support language remains support-only")) {
    errors.push("AI external prototype tasks must keep support language support-only.");
  }

  if (!textListIncludes(task.scoringRequirements, "Use deterministic scoring only")) {
    errors.push("AI external prototype tasks must require deterministic scoring.");
  }

  if (!textListIncludes(task.scoringRequirements, "Do not write Star Dust")) {
    errors.push("AI external prototype tasks must block Star Dust and reward writes.");
  }

  if (task.deliverables.length === 0 || task.returnEvidence.length === 0) {
    errors.push("AI external prototype tasks must include deliverables and return evidence.");
  }

  for (const requiredAction of AI_EXTERNAL_PROTOTYPE_TASK_REQUIRED_BLOCKED_TASK_ACTIONS) {
    if (!textListIncludes(task.blockedActions, requiredAction)) {
      errors.push(`AI external prototype task must block task action: ${requiredAction}.`);
    }
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

function readExternalPrototypeTasks(source: Record<string, unknown>): AiExternalPrototypeTask[] {
  const value = source.tasks;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((task) => ({
    taskId: readString(task, "taskId"),
    modeId: readString(task, "modeId"),
    title: readString(task, "title"),
    parentEngine: readString(task, "parentEngine"),
    recommendedSurface: readString(task, "recommendedSurface") as AiExternalPrototypeTaskSurface,
    status: readString(task, "status") as AiExternalPrototypeTaskStatus,
    repositoryScope: readString(task, "repositoryScope"),
    outputFolderRule: readString(task, "outputFolderRule"),
    builderCommandSummary: readString(task, "builderCommandSummary"),
    fixtureRequirements: readStringArray(task, "fixtureRequirements"),
    eventRequirements: readStringArray(task, "eventRequirements"),
    audioRequirements: readStringArray(task, "audioRequirements"),
    scoringRequirements: readStringArray(task, "scoringRequirements"),
    deliverables: readStringArray(task, "deliverables"),
    returnEvidence: readStringArray(task, "returnEvidence"),
    blockedActions: readStringArray(task, "blockedActions"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
