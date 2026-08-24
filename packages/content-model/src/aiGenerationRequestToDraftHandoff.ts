export type AiGenerationRequestToDraftHandoffStatus = "review-only" | "blocked";
export type AiGenerationRequestToDraftHandoffLaneStatus = "ready-for-review" | "required" | "blocked";

export interface AiGenerationRequestToDraftHandoffLane {
  laneId: string;
  label: string;
  sourceRecordType: string;
  sourceRecordId: string;
  status: AiGenerationRequestToDraftHandoffLaneStatus;
  reviewerNote: string;
  blocksDraftCreation: boolean;
}

export interface AiGenerationRequestToDraftHandoff {
  handoffId: string;
  tenantId: string;
  requestId: string;
  sourceRequestPacketId: string;
  targetDraftPreviewId: string;
  label: string;
  summary: string;
  status: AiGenerationRequestToDraftHandoffStatus;
  handoffMode: "review-only-preflight";
  targetLanguageProgressTrigger: "target-language-only";
  supportLanguageProgressAllowed: boolean;
  mediaOnlyProgressAllowed: boolean;
  liveModelDispatchAllowed: boolean;
  modelBillingAllowed: boolean;
  draftCreationAllowed: boolean;
  draftJsonWriteAllowed: boolean;
  verifierSubmissionAllowed: boolean;
  packageAssemblyAllowed: boolean;
  routeWriteAllowed: boolean;
  playlistWriteAllowed: boolean;
  studentAssignmentAllowed: boolean;
  studentReadyMarkerAllowed: boolean;
  lanes: AiGenerationRequestToDraftHandoffLane[];
  requiredBeforeDraft: string[];
  blockedActions: string[];
  reviewerNotes: string[];
}

export const AI_REQUEST_TO_DRAFT_HANDOFF_REQUIRED_LANE_RECORD_TYPES = [
  "ai_generation_request_packet",
  "ai_prompt_package",
  "premium_ai_cost_gate",
  "audio_coverage_requirement",
  "activity_compatibility_snapshot",
  "media_rights_manifest",
  "ai_generated_draft_payload_preview",
] as const;

export const AI_REQUEST_TO_DRAFT_HANDOFF_REQUIRED_BLOCKED_ACTIONS = [
  "No live model dispatch from handoff",
  "No model billing from handoff",
  "No draft generation from handoff",
  "No draft JSON write from handoff",
  "No verifier submission from handoff",
  "No package assembly from handoff",
  "No route write from handoff",
  "No playlist write from handoff",
  "No student assignment from handoff",
  "No support-language progress from handoff",
] as const;

export function validateAiGenerationRequestToDraftHandoff(handoff: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(handoff)) {
    return ["AI request-to-draft handoff must be a JSON object."];
  }

  const handoffId = readString(handoff, "handoffId");
  const tenantId = readString(handoff, "tenantId");
  const requestId = readString(handoff, "requestId");
  const sourceRequestPacketId = readString(handoff, "sourceRequestPacketId");
  const targetDraftPreviewId = readString(handoff, "targetDraftPreviewId");
  const status = readString(handoff, "status");
  const handoffMode = readString(handoff, "handoffMode");
  const lanes = readHandoffLanes(handoff);
  const laneRecordTypes = lanes.map((lane) => lane.sourceRecordType);
  const requiredBeforeDraft = readStringArray(handoff, "requiredBeforeDraft");
  const blockedActions = readStringArray(handoff, "blockedActions");

  if (!handoffId || !tenantId || !requestId || !sourceRequestPacketId || !targetDraftPreviewId) {
    errors.push(
      "AI request-to-draft handoff must include handoffId, tenantId, requestId, sourceRequestPacketId, and targetDraftPreviewId.",
    );
  }

  if (status !== "review-only" && status !== "blocked") {
    errors.push("AI request-to-draft handoff must remain review-only or blocked.");
  }

  if (handoffMode !== "review-only-preflight") {
    errors.push("AI request-to-draft handoff must use handoffMode: review-only-preflight.");
  }

  if (readString(handoff, "targetLanguageProgressTrigger") !== "target-language-only") {
    errors.push("AI request-to-draft handoff must keep targetLanguageProgressTrigger as target-language-only.");
  }

  for (const key of [
    "supportLanguageProgressAllowed",
    "mediaOnlyProgressAllowed",
    "liveModelDispatchAllowed",
    "modelBillingAllowed",
    "draftCreationAllowed",
    "draftJsonWriteAllowed",
    "verifierSubmissionAllowed",
    "packageAssemblyAllowed",
    "routeWriteAllowed",
    "playlistWriteAllowed",
    "studentAssignmentAllowed",
    "studentReadyMarkerAllowed",
  ]) {
    if (readBoolean(handoff, key) !== false) {
      errors.push(`AI request-to-draft handoff must keep ${key}: false.`);
    }
  }

  for (const recordType of AI_REQUEST_TO_DRAFT_HANDOFF_REQUIRED_LANE_RECORD_TYPES) {
    if (!laneRecordTypes.includes(recordType)) {
      errors.push(`AI request-to-draft handoff must include lane record type: ${recordType}.`);
    }
  }

  for (const blockedAction of AI_REQUEST_TO_DRAFT_HANDOFF_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(blockedAction)) {
      errors.push(`AI request-to-draft handoff must include blocked action: ${blockedAction}.`);
    }
  }

  if (requiredBeforeDraft.length === 0) {
    errors.push("AI request-to-draft handoff must name required-before-draft evidence.");
  }

  if (!lanes.some((lane) => lane.blocksDraftCreation)) {
    errors.push("AI request-to-draft handoff must include at least one draft-creation blocking lane.");
  }

  for (const lane of lanes) {
    if (!lane.laneId || !lane.label || !lane.sourceRecordType || !lane.sourceRecordId || !lane.reviewerNote) {
      errors.push("AI request-to-draft handoff lanes must include ids, record type, record id, and reviewer note.");
    }

    if (!["ready-for-review", "required", "blocked"].includes(lane.status)) {
      errors.push(`AI request-to-draft handoff lane has unknown status: ${lane.status}.`);
    }
  }

  return errors;
}

export function validateAiGenerationRequestToDraftHandoffs(handoffs: unknown[]): string[] {
  return handoffs.flatMap((handoff) => validateAiGenerationRequestToDraftHandoff(handoff));
}

export function getAiGenerationRequestToDraftHandoffWarnings(handoff: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(handoff)) {
    return warnings;
  }

  const tenantId = readString(handoff, "tenantId");
  const searchableText = [
    readString(handoff, "summary"),
    readStringArray(handoff, "requiredBeforeDraft").join(" "),
    readStringArray(handoff, "blockedActions").join(" "),
    readStringArray(handoff, "reviewerNotes").join(" "),
    readHandoffLanes(handoff)
      .map((lane) => lane.reviewerNote)
      .join(" "),
  ]
    .join(" ")
    .toLowerCase();

  if (!searchableText.includes("review-only")) {
    warnings.push("AI request-to-draft handoff should clearly say it is review-only.");
  }

  if (!searchableText.includes("target-language")) {
    warnings.push("AI request-to-draft handoff should restate target-language progress rules.");
  }

  if (tenantId === "ministar" && !searchableText.includes("hiragana")) {
    warnings.push("MiniStar request-to-draft handoff should preserve hiragana-only Japanese support rules.");
  }

  if (tenantId === "ministar" && !searchableText.includes("japanese support-language unlock")) {
    warnings.push("MiniStar request-to-draft handoff should block Japanese support-language unlocks.");
  }

  return warnings;
}

export function getAiGenerationRequestToDraftHandoffCollectionWarnings(handoffs: unknown[]): string[] {
  return handoffs.flatMap((handoff) => getAiGenerationRequestToDraftHandoffWarnings(handoff));
}

export function isAiGenerationRequestToDraftHandoffLiveBlocked(handoff: unknown): boolean {
  return validateAiGenerationRequestToDraftHandoff(handoff).length > 0 || !isRecord(handoff)
    ? true
    : readBoolean(handoff, "liveModelDispatchAllowed") === false &&
        readBoolean(handoff, "modelBillingAllowed") === false &&
        readBoolean(handoff, "draftCreationAllowed") === false &&
        readBoolean(handoff, "draftJsonWriteAllowed") === false &&
        readBoolean(handoff, "verifierSubmissionAllowed") === false &&
        readBoolean(handoff, "studentAssignmentAllowed") === false;
}

function readHandoffLanes(source: Record<string, unknown>): AiGenerationRequestToDraftHandoffLane[] {
  const value = source.lanes;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((lane) => ({
    laneId: readString(lane, "laneId"),
    label: readString(lane, "label"),
    sourceRecordType: readString(lane, "sourceRecordType"),
    sourceRecordId: readString(lane, "sourceRecordId"),
    status: readString(lane, "status") as AiGenerationRequestToDraftHandoffLaneStatus,
    reviewerNote: readString(lane, "reviewerNote"),
    blocksDraftCreation: readBoolean(lane, "blocksDraftCreation") === true,
  }));
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

function readBoolean(source: Record<string, unknown>, key: string): boolean | undefined {
  const value = source[key];
  return typeof value === "boolean" ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
