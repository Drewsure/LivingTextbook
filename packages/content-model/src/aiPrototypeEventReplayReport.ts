export type AiPrototypeEventReplayReportStatus = "not-run" | "review-only" | "blocked";

export interface AiPrototypeModeEventReplayReport<ModeId extends string = string> {
  modeId: ModeId;
  parentEngine: string;
  replayHarness: string;
  requiredEventOrder: string[];
  allowedPayloadFields: string[];
  acceptedProgressEffects: string[];
  failureTriggers: string[];
}

export interface AiPrototypeEventReplayReport<ModeId extends string = string> {
  reportId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeEventReplayReportStatus;
  summary: string;
  sourceRecords: string[];
  replayPurpose: string[];
  standardEventCoverage: string[];
  eventAcceptanceChecks: string[];
  blockedActions: string[];
  modeReports: AiPrototypeModeEventReplayReport<ModeId>[];
}

export const AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_SOURCE_RECORDS = [
  "prototype_event_replay_report",
  "prototype_fixture_replay_report",
  "prototype_wrapper_adapter_review",
  "ai_prototype_integration_plan",
  "standard_event_contract",
  "progress_event_acceptance_map",
] as const;

export const AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_PURPOSE = [
  "Confirm standard events are emitted in the expected learning sequence.",
  "Confirm answer and mastery events carry metadata only, not score authority.",
  "Confirm target-language learning events are the only progress triggers.",
  "Confirm support-language, media-only, and background-audio events remain support-only.",
  "Confirm reportable events are compatible with teacher summaries and collection gates.",
] as const;

export const AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_EVENTS = [
  "game_started",
  "round_shown",
  "audio_requested",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
] as const;

export const AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_ACCEPTANCE_CHECKS = [
  "Event order is deterministic",
  "Every event includes tenant, package, unit, mode, and source ids",
  "answer_result does not directly write Star Dust",
  "mastery_updated is derived from accepted target-language results",
  "game_completed does not write reward inventory",
  "Support-language events are marked support-only",
  "No hidden local progress counter bypasses the event stream",
] as const;

export const AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_BLOCKED_ACTIONS = [
  "No progress event write from prototype",
  "No direct score authority",
  "No reward inventory write",
  "No route registry write",
  "No student assignment",
  "No report export",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_PAYLOAD_FIELDS = [
  "tenantId",
  "packageId",
  "unitId",
  "gameMode",
  "roundId",
  "sourceText",
  "targetLanguage",
  "attemptMetadata",
  "supportOnly",
] as const;

export const AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_ACCEPTED_EFFECTS = [
  "target_language_attempt_recorded",
  "target_language_answer_result_recorded",
  "mastery_candidate_marked_for_parent_engine",
  "teacher_report_event_previewed",
  "collection_gate_input_previewed",
] as const;

export const AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_FAILURE_TRIGGERS = [
  "Missing game_started or game_completed",
  "answer_result emitted before answer_submitted",
  "mastery_updated emitted from support-language text",
  "Prototype writes score or Star Dust directly",
  "Prototype writes reward inventory directly",
  "Prototype mutates route, playlist, report, assignment, or local bundle state",
] as const;

export function validateAiPrototypeEventReplayReport(report: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(report)) {
    return ["AI prototype event replay report must be a JSON object."];
  }

  const reportId = readString(report, "reportId");
  const tenantId = readString(report, "tenantId");
  const requestId = readString(report, "requestId");
  const integrationPlanId = readString(report, "integrationPlanId");
  const label = readString(report, "label");
  const status = readString(report, "status");
  const summary = readString(report, "summary");
  const sourceRecords = readStringArray(report, "sourceRecords");
  const replayPurpose = readStringArray(report, "replayPurpose");
  const standardEventCoverage = readStringArray(report, "standardEventCoverage");
  const eventAcceptanceChecks = readStringArray(report, "eventAcceptanceChecks");
  const blockedActions = readStringArray(report, "blockedActions");
  const modeReports = readModeEventReplayReports(report);

  if (!reportId || !tenantId || !requestId || !integrationPlanId) {
    errors.push("AI prototype event replay report must include reportId, tenantId, requestId, and integrationPlanId.");
  }

  if (!label.includes("prototype event replay report")) {
    errors.push("AI prototype event replay report label must name the event replay report.");
  }

  if (status !== "not-run" && status !== "review-only" && status !== "blocked") {
    errors.push("AI prototype event replay report must use a supported review-only status.");
  }

  if (!summary.includes("Review-only standard event replay checklist")) {
    errors.push("AI prototype event replay report summary must keep event replay review-only.");
  }

  for (const sourceRecord of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype event replay report must include source record: ${sourceRecord}.`);
    }
  }

  for (const purpose of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_PURPOSE) {
    if (!replayPurpose.includes(purpose)) {
      errors.push(`AI prototype event replay report must include replay purpose: ${purpose}.`);
    }
  }

  for (const eventName of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_EVENTS) {
    if (!standardEventCoverage.includes(eventName)) {
      errors.push(`AI prototype event replay report must include standard event: ${eventName}.`);
    }
  }

  for (const acceptanceCheck of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_ACCEPTANCE_CHECKS) {
    if (!eventAcceptanceChecks.includes(acceptanceCheck)) {
      errors.push(`AI prototype event replay report must include acceptance check: ${acceptanceCheck}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype event replay report must block action: ${blockedAction}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language event can unlock English progress")) {
    errors.push("MiniStar AI prototype event replay report must block Japanese support-language progress events.");
  }

  if (modeReports.length === 0) {
    errors.push("AI prototype event replay report must include mode event replay reports.");
  }

  for (const modeReport of modeReports) {
    validateModeEventReplayReport(modeReport, tenantId, errors);
  }

  return errors;
}

export function getAiPrototypeEventReplayReportWarnings(report: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(report)) {
    return warnings;
  }

  const modeReports = readModeEventReplayReports(report);

  if (!modeReports.every((modeReport) => modeReport.replayHarness.includes("without writing progress"))) {
    warnings.push("Every event replay harness should explicitly block progress writes.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.acceptedProgressEffects, "teacher_report_event_previewed"))) {
    warnings.push("Every event replay report should keep teacher reporting preview-only.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.failureTriggers, "Prototype mutates route"))) {
    warnings.push("Every event replay report should reject route, playlist, report, assignment, or local bundle mutation.");
  }

  return warnings;
}

export function validateAiPrototypeEventReplayReports(reports: unknown[]): string[] {
  return reports.flatMap((report) => validateAiPrototypeEventReplayReport(report));
}

export function getAiPrototypeEventReplayReportCollectionWarnings(reports: unknown[]): string[] {
  return reports.flatMap((report) => getAiPrototypeEventReplayReportWarnings(report));
}

function validateModeEventReplayReport(report: AiPrototypeModeEventReplayReport, tenantId: string, errors: string[]) {
  if (!report.modeId || !report.parentEngine || !report.replayHarness) {
    errors.push("AI prototype mode event replay report must include modeId, parentEngine, and replayHarness.");
  }

  if (!report.replayHarness.includes("non-student event replay harness") || !report.replayHarness.includes("without writing progress")) {
    errors.push("AI prototype mode event replay report must stay in a non-student harness without progress writes.");
  }

  for (const eventName of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_EVENTS) {
    if (!report.requiredEventOrder.includes(eventName)) {
      errors.push(`AI prototype mode event replay report must include required event order item: ${eventName}.`);
    }
  }

  for (const payloadField of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_PAYLOAD_FIELDS) {
    if (!report.allowedPayloadFields.includes(payloadField)) {
      errors.push(`AI prototype mode event replay report must include allowed payload field: ${payloadField}.`);
    }
  }

  for (const acceptedEffect of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_ACCEPTED_EFFECTS) {
    if (!report.acceptedProgressEffects.includes(acceptedEffect)) {
      errors.push(`AI prototype mode event replay report must include accepted progress effect: ${acceptedEffect}.`);
    }
  }

  for (const failureTrigger of AI_PROTOTYPE_EVENT_REPLAY_REQUIRED_FAILURE_TRIGGERS) {
    if (!report.failureTriggers.includes(failureTrigger)) {
      errors.push(`AI prototype mode event replay report must include failure trigger: ${failureTrigger}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(report.acceptedProgressEffects, "ja_hiragana_support_event_marked_support_only")) {
    errors.push("MiniStar AI prototype mode event replay report must keep Japanese support events support-only.");
  }
}

function readModeEventReplayReports(source: Record<string, unknown>): AiPrototypeModeEventReplayReport[] {
  const value = source.modeReports;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((modeReport) => ({
    modeId: readString(modeReport, "modeId"),
    parentEngine: readString(modeReport, "parentEngine"),
    replayHarness: readString(modeReport, "replayHarness"),
    requiredEventOrder: readStringArray(modeReport, "requiredEventOrder"),
    allowedPayloadFields: readStringArray(modeReport, "allowedPayloadFields"),
    acceptedProgressEffects: readStringArray(modeReport, "acceptedProgressEffects"),
    failureTriggers: readStringArray(modeReport, "failureTriggers"),
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

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
