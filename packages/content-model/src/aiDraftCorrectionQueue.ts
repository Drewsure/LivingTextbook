export type AiDraftCorrectionQueueStatus = "blocked" | "needs-review" | "ready-for-review";
export type AiDraftCorrectionItemSeverity = "validation block" | "review warning";

export interface AiDraftCorrectionItem {
  itemId: string;
  severity: AiDraftCorrectionItemSeverity;
  lane: string;
  requiredOwner: string;
  issue: string;
  nextRecord: string;
  studentUseEffect: string;
}

export interface AiDraftCorrectionQueue {
  queueId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  status: AiDraftCorrectionQueueStatus;
  validationBlockCount: number;
  warningCount: number;
  items: AiDraftCorrectionItem[];
  blockedActions: string[];
  nextRequirements: string[];
}

export const AI_DRAFT_CORRECTION_QUEUE_REQUIRED_BLOCKED_ACTIONS = [
  "No auto-fix from AI draft",
  "No regenerate live AI",
  "No verifier submission from correction queue",
  "No package assembly from correction queue",
  "No route or playlist creation",
  "No student assignment",
] as const;

export const AI_DRAFT_CORRECTION_QUEUE_REQUIRED_NEXT_REQUIREMENTS = [
  "Teacher content repair",
  "Target-language audio approval",
  "Media rights evidence",
  "Schema validation packet",
  "AI verifier submission packet",
  "Package approval ledger binding",
] as const;

export function validateAiDraftCorrectionQueue(queue: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(queue)) {
    return ["AI draft correction queue must be a JSON object."];
  }

  const queueId = readString(queue, "queueId");
  const tenantId = readString(queue, "tenantId");
  const requestId = readString(queue, "requestId");
  const status = readString(queue, "status");
  const validationBlockCount = readNumber(queue, "validationBlockCount");
  const warningCount = readNumber(queue, "warningCount");
  const items = readCorrectionItems(queue);
  const blockedActions = readStringArray(queue, "blockedActions");
  const nextRequirements = readStringArray(queue, "nextRequirements");

  if (!queueId || !tenantId || !requestId) {
    errors.push("AI draft correction queue must include queueId, tenantId, and requestId.");
  }

  if (!["blocked", "needs-review", "ready-for-review"].includes(status)) {
    errors.push("AI draft correction queue status must be blocked, needs-review, or ready-for-review.");
  }

  const expectedStatus =
    validationBlockCount > 0 ? "blocked" : warningCount > 0 ? "needs-review" : "ready-for-review";

  if (status !== expectedStatus) {
    errors.push(`AI draft correction queue status must match validation output: ${expectedStatus}.`);
  }

  const actualBlockCount = items.filter((item) => item.severity === "validation block").length;
  const actualWarningCount = items.filter((item) => item.severity === "review warning").length;

  if (validationBlockCount !== actualBlockCount) {
    errors.push("AI draft correction queue validationBlockCount must match validation block items.");
  }

  if (warningCount !== actualWarningCount) {
    errors.push("AI draft correction queue warningCount must match review warning items.");
  }

  for (const requiredAction of AI_DRAFT_CORRECTION_QUEUE_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(requiredAction)) {
      errors.push(`AI draft correction queue must block: ${requiredAction}.`);
    }
  }

  for (const requiredRequirement of AI_DRAFT_CORRECTION_QUEUE_REQUIRED_NEXT_REQUIREMENTS) {
    if (!nextRequirements.includes(requiredRequirement)) {
      errors.push(`AI draft correction queue must require next step: ${requiredRequirement}.`);
    }
  }

  for (const item of items) {
    if (!item.itemId || !item.lane || !item.requiredOwner || !item.issue || !item.nextRecord) {
      errors.push("AI draft correction queue items must include lane, owner, issue, and next record.");
    }

    if (!item.studentUseEffect.toLowerCase().includes("block")) {
      errors.push("AI draft correction queue item student-use effect must explain the student-use block.");
    }
  }

  return errors;
}

export function getAiDraftCorrectionQueueWarnings(queue: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(queue)) {
    return warnings;
  }

  const summary = readString(queue, "summary").toLowerCase();
  const items = readCorrectionItems(queue);
  const laneText = items.map((item) => item.lane).join(" ").toLowerCase();

  if (!summary.includes("before verifier submission")) {
    warnings.push("AI draft correction queue should state that repair happens before verifier submission.");
  }

  if (!laneText.includes("audio")) {
    warnings.push("AI draft correction queue should expose an audio repair lane when audio coverage is incomplete.");
  }

  if (!laneText.includes("progress")) {
    warnings.push("AI draft correction queue should expose a progress policy repair lane when progress locks are incomplete.");
  }

  return warnings;
}

export function validateAiDraftCorrectionQueues(queues: unknown[]): string[] {
  return queues.flatMap((queue) => validateAiDraftCorrectionQueue(queue));
}

export function getAiDraftCorrectionQueueCollectionWarnings(queues: unknown[]): string[] {
  return queues.flatMap((queue) => getAiDraftCorrectionQueueWarnings(queue));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function readCorrectionItems(source: Record<string, unknown>): AiDraftCorrectionItem[] {
  const value = source.items;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    itemId: readString(item, "itemId"),
    severity: readSeverity(item),
    lane: readString(item, "lane"),
    requiredOwner: readString(item, "requiredOwner"),
    issue: readString(item, "issue"),
    nextRecord: readString(item, "nextRecord"),
    studentUseEffect: readString(item, "studentUseEffect"),
  }));
}

function readSeverity(source: Record<string, unknown>): AiDraftCorrectionItemSeverity {
  return readString(source, "severity") === "review warning" ? "review warning" : "validation block";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
