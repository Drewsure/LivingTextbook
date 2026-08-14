export type AiPrototypeScoringReplayReportStatus = "not-run" | "review-only" | "blocked";

export interface AiPrototypeModeScoringReplayReport<ModeId extends string = string> {
  modeId: ModeId;
  parentEngine: string;
  scoringHarness: string;
  scoreInputs: string[];
  scoringSteps: string[];
  masteryChecks: string[];
  rewardBoundaryChecks: string[];
  failureTriggers: string[];
}

export interface AiPrototypeScoringReplayReport<ModeId extends string = string> {
  reportId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeScoringReplayReportStatus;
  summary: string;
  sourceRecords: string[];
  scoringProfilePolicy: string;
  masteryPolicy: string;
  rewardBoundaryPolicy: string;
  scoringPurpose: string[];
  scoreReplayChecks: string[];
  masteryReplayChecks: string[];
  rewardBoundaryChecks: string[];
  blockedActions: string[];
  modeReports: AiPrototypeModeScoringReplayReport<ModeId>[];
}

export const AI_PROTOTYPE_SCORING_REQUIRED_SOURCE_RECORDS = [
  "prototype_scoring_replay_report",
  "ai_prototype_integration_plan",
  "game_scoring_profile_snapshot",
  "progress_event_acceptance_map",
  "collection_unlock_binding",
  "standard_event_contract",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_PURPOSE = [
  "Confirm the prototype emits answer evidence rather than direct score writes.",
  "Confirm deterministic scoring replays against the reviewed scoring profile.",
  "Confirm the 1,000 Star Dust cap and 75% mastery rule remain parent-engine rules.",
  "Confirm support-language, background media, and passive listening never produce mastery.",
  "Confirm reward and collection effects remain outside the returned prototype.",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_SCORE_CHECKS = [
  "Deterministic scoring replay",
  "game_scoring_profile_snapshot is the scoring source",
  "No direct score authority",
  "No Star Dust write from prototype",
  "1,000 Star Dust cap preserved",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_MASTERY_CHECKS = [
  "Target-language answer result required",
  "progress_event_acceptance_map required",
  "No support-language-only mastery",
  "No media-only Star Dust",
  "75% mastery threshold remains parent-engine controlled",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_REWARD_CHECKS = [
  "collection_unlock_binding is referenced only",
  "No reward inventory write",
  "No random reward",
  "No generated gacha",
  "No purchase-like unlock",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_BLOCKED_ACTIONS = [
  "No scoring profile mutation",
  "No direct score authority",
  "No Star Dust write from prototype",
  "No reward inventory write",
  "No random reward generation",
  "No media-only Star Dust",
  "No support-language-only mastery",
  "No package promotion",
  "No student assignment",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_SCORE_INPUTS = [
  "Reviewed unit JSON fixture",
  "Standard answer_result events",
  "Attempt metadata",
  "Target-language flag",
  "Support-only flag",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_STEPS = [
  "Replay correct target-language attempt.",
  "Replay incorrect target-language attempt.",
  "Replay support-language audio request.",
  "Replay media-only interaction.",
  "Compare output to scoring profile snapshot.",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_MODE_MASTERY_CHECKS = [
  "Correct target-language answer can become a mastery candidate.",
  "Support-language cue cannot unlock progress.",
  "Media-only action cannot earn Star Dust.",
  "Completion does not bypass accepted event effects.",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_MODE_REWARD_CHECKS = [
  "Prototype cannot write collection inventory.",
  "Prototype cannot issue Spin Wheel tickets.",
  "Prototype cannot evolve avatars directly.",
  "Prototype cannot generate random rewards.",
] as const;

export const AI_PROTOTYPE_SCORING_REQUIRED_FAILURE_TRIGGERS = [
  "Prototype writes score, Star Dust, mastery, reward, route, package, or assignment state.",
  "Support-language event becomes a score source.",
  "Media-only interaction becomes a score source.",
  "Scoring profile is mutated by prototype code.",
  "Reward inventory or random reward is created by prototype code.",
] as const;

export function validateAiPrototypeScoringReplayReport(report: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(report)) {
    return ["AI prototype scoring replay report must be a JSON object."];
  }

  const reportId = readString(report, "reportId");
  const tenantId = readString(report, "tenantId");
  const requestId = readString(report, "requestId");
  const integrationPlanId = readString(report, "integrationPlanId");
  const label = readString(report, "label");
  const status = readString(report, "status");
  const summary = readString(report, "summary");
  const scoringProfilePolicy = readString(report, "scoringProfilePolicy");
  const masteryPolicy = readString(report, "masteryPolicy");
  const rewardBoundaryPolicy = readString(report, "rewardBoundaryPolicy");
  const sourceRecords = readStringArray(report, "sourceRecords");
  const scoringPurpose = readStringArray(report, "scoringPurpose");
  const scoreReplayChecks = readStringArray(report, "scoreReplayChecks");
  const masteryReplayChecks = readStringArray(report, "masteryReplayChecks");
  const rewardBoundaryChecks = readStringArray(report, "rewardBoundaryChecks");
  const blockedActions = readStringArray(report, "blockedActions");
  const modeReports = readModeScoringReplayReports(report);

  if (!reportId || !tenantId || !requestId || !integrationPlanId) {
    errors.push("AI prototype scoring replay report must include reportId, tenantId, requestId, and integrationPlanId.");
  }

  if (!label.includes("prototype scoring replay report")) {
    errors.push("AI prototype scoring replay report label must name the scoring replay report.");
  }

  if (status !== "not-run" && status !== "review-only" && status !== "blocked") {
    errors.push("AI prototype scoring replay report must use a supported review-only status.");
  }

  if (!summary.includes("Review-only deterministic scoring checklist")) {
    errors.push("AI prototype scoring replay report summary must keep scoring replay review-only.");
  }

  if (!scoringProfilePolicy.includes("parent engine") || !scoringProfilePolicy.includes("game_scoring_profile_snapshot")) {
    errors.push("AI prototype scoring replay report must keep scoring profile ownership with the parent engine.");
  }

  if (!masteryPolicy.includes("target-language") || !masteryPolicy.includes("support-language")) {
    errors.push("AI prototype scoring replay report must preserve target-language mastery policy.");
  }

  if (!rewardBoundaryPolicy.includes("deterministic") || !rewardBoundaryPolicy.includes("Prototypes cannot write reward inventory")) {
    errors.push("AI prototype scoring replay report must preserve deterministic reward boundary policy.");
  }

  for (const sourceRecord of AI_PROTOTYPE_SCORING_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype scoring replay report must include source record: ${sourceRecord}.`);
    }
  }

  for (const purpose of AI_PROTOTYPE_SCORING_REQUIRED_PURPOSE) {
    if (!scoringPurpose.includes(purpose)) {
      errors.push(`AI prototype scoring replay report must include scoring purpose: ${purpose}.`);
    }
  }

  for (const check of AI_PROTOTYPE_SCORING_REQUIRED_SCORE_CHECKS) {
    if (!scoreReplayChecks.includes(check)) {
      errors.push(`AI prototype scoring replay report must include score replay check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_SCORING_REQUIRED_MASTERY_CHECKS) {
    if (!masteryReplayChecks.includes(check)) {
      errors.push(`AI prototype scoring replay report must include mastery replay check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_SCORING_REQUIRED_REWARD_CHECKS) {
    if (!rewardBoundaryChecks.includes(check)) {
      errors.push(`AI prototype scoring replay report must include reward boundary check: ${check}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_SCORING_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype scoring replay report must block action: ${blockedAction}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language scoring or release")) {
    errors.push("MiniStar AI prototype scoring replay report must block Japanese support-language scoring or release.");
  }

  if (modeReports.length === 0) {
    errors.push("AI prototype scoring replay report must include mode scoring replay reports.");
  }

  for (const modeReport of modeReports) {
    validateModeScoringReplayReport(modeReport, tenantId, errors);
  }

  return errors;
}

export function getAiPrototypeScoringReplayReportWarnings(report: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(report)) {
    return warnings;
  }

  const modeReports = readModeScoringReplayReports(report);

  if (!modeReports.every((modeReport) => modeReport.scoringHarness.includes("parent scoring profile"))) {
    warnings.push("Every scoring replay harness should feed attempts into the parent scoring profile.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.rewardBoundaryChecks, "Spin Wheel tickets"))) {
    warnings.push("Every scoring replay report should keep Spin Wheel tickets outside the prototype.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.failureTriggers, "random reward"))) {
    warnings.push("Every scoring replay report should reject random reward creation.");
  }

  return warnings;
}

export function validateAiPrototypeScoringReplayReports(reports: unknown[]): string[] {
  return reports.flatMap((report) => validateAiPrototypeScoringReplayReport(report));
}

export function getAiPrototypeScoringReplayReportCollectionWarnings(reports: unknown[]): string[] {
  return reports.flatMap((report) => getAiPrototypeScoringReplayReportWarnings(report));
}

function validateModeScoringReplayReport(
  report: AiPrototypeModeScoringReplayReport,
  tenantId: string,
  errors: string[],
) {
  if (!report.modeId || !report.parentEngine || !report.scoringHarness) {
    errors.push("AI prototype mode scoring replay report must include modeId, parentEngine, and scoringHarness.");
  }

  if (!report.scoringHarness.includes("non-student scoring replay harness") || !report.scoringHarness.includes("without writing Star Dust")) {
    errors.push("AI prototype mode scoring replay report must stay in a non-student harness without Star Dust writes.");
  }

  for (const scoreInput of AI_PROTOTYPE_SCORING_REQUIRED_SCORE_INPUTS) {
    if (!report.scoreInputs.includes(scoreInput)) {
      errors.push(`AI prototype mode scoring replay report must include score input: ${scoreInput}.`);
    }
  }

  for (const step of AI_PROTOTYPE_SCORING_REQUIRED_STEPS) {
    if (!report.scoringSteps.includes(step)) {
      errors.push(`AI prototype mode scoring replay report must include scoring step: ${step}.`);
    }
  }

  for (const check of AI_PROTOTYPE_SCORING_REQUIRED_MODE_MASTERY_CHECKS) {
    if (!report.masteryChecks.includes(check)) {
      errors.push(`AI prototype mode scoring replay report must include mastery check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_SCORING_REQUIRED_MODE_REWARD_CHECKS) {
    if (!report.rewardBoundaryChecks.includes(check)) {
      errors.push(`AI prototype mode scoring replay report must include reward boundary check: ${check}.`);
    }
  }

  for (const failureTrigger of AI_PROTOTYPE_SCORING_REQUIRED_FAILURE_TRIGGERS) {
    if (!report.failureTriggers.includes(failureTrigger)) {
      errors.push(`AI prototype mode scoring replay report must include failure trigger: ${failureTrigger}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(report.masteryChecks, "Japanese support stays support-only for English mastery.")) {
    errors.push("MiniStar AI prototype mode scoring replay report must keep Japanese support outside English mastery.");
  }
}

function readModeScoringReplayReports(source: Record<string, unknown>): AiPrototypeModeScoringReplayReport[] {
  const value = source.modeReports;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((modeReport) => ({
    modeId: readString(modeReport, "modeId"),
    parentEngine: readString(modeReport, "parentEngine"),
    scoringHarness: readString(modeReport, "scoringHarness"),
    scoreInputs: readStringArray(modeReport, "scoreInputs"),
    scoringSteps: readStringArray(modeReport, "scoringSteps"),
    masteryChecks: readStringArray(modeReport, "masteryChecks"),
    rewardBoundaryChecks: readStringArray(modeReport, "rewardBoundaryChecks"),
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
