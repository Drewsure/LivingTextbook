export type AiPrototypeFixtureReplayReportStatus = "not-run" | "review-only" | "blocked";

export interface AiPrototypeModeFixtureReplayReport<ModeId extends string = string> {
  modeId: ModeId;
  parentEngine: string;
  fixtureName: string;
  replaySurface: string;
  inputAssertions: string[];
  outputAssertions: string[];
  replayEvidence: string[];
  failureTriggers: string[];
}

export interface AiPrototypeFixtureReplayReport<ModeId extends string = string> {
  reportId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeFixtureReplayReportStatus;
  summary: string;
  sourceRecords: string[];
  replayPurpose: string[];
  fixtureCoverage: string[];
  replayAcceptanceChecks: string[];
  blockedActions: string[];
  modeReports: AiPrototypeModeFixtureReplayReport<ModeId>[];
}

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_SOURCE_RECORDS = [
  "prototype_fixture_replay_report",
  "prototype_wrapper_adapter_review",
  "ai_prototype_integration_plan",
  "ai_prototype_return_review",
  "reviewed_unit_json_fixture",
  "ai_generated_draft_payload_preview",
] as const;

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_PURPOSE = [
  "Confirm the prototype receives reviewed unit JSON through a wrapper input.",
  "Confirm vocabulary terms and target sentences are read from the fixture.",
  "Confirm audio cues are requested from the fixture manifest.",
  "Confirm support language remains metadata for support only.",
  "Confirm scoring, rewards, and mastery stay outside the prototype.",
] as const;

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_COVERAGE = [
  "unit_meta",
  "pedagogical_payload",
  "audio_cues",
  "game_mode_config",
  "scoring_profile",
  "assist_language_policy",
  "tenant_theme_tokens",
] as const;

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_ACCEPTANCE_CHECKS = [
  "No hard-coded unit text",
  "8-12 vocabulary terms accepted from fixture",
  "Exactly 2 target sentences accepted from fixture",
  "Target-language text remains the only progress trigger",
  "Support language is support-only",
  "No missing target-language audio cue references",
  "No tenant hard-coded assets or mascot assumptions",
] as const;

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_BLOCKED_ACTIONS = [
  "No live model call",
  "No direct import into apps/web",
  "No route registry write",
  "No scoring profile mutation",
  "No audio manifest mutation",
  "No reward inventory write",
  "No student assignment",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_INPUT_ASSERTIONS = [
  "unit_meta.game_mode matches requested mode",
  "unit_meta.engine_id matches parent engine",
  "pedagogical_payload.vocabulary_terms is read from fixture",
  "pedagogical_payload.target_sentences is read from fixture",
  "audio_cues are referenced by text and language",
  "tenant theme tokens are injected, not hard-coded",
] as const;

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_OUTPUT_ASSERTIONS = [
  "game_started emitted after fixture load",
  "round_shown emitted with fixture-derived terms or sentences",
  "audio_requested emitted for target-language text",
  "answer_submitted emitted with learner interaction metadata only",
  "answer_result emitted without direct score authority",
  "game_completed emitted without reward inventory writes",
] as const;

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_EVIDENCE = [
  "Fixture parse result",
  "Parsed term count",
  "Parsed target sentence count",
  "Audio cue request sample",
  "Standard event log sample",
  "Tenant theme injection sample",
] as const;

export const AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_FAILURE_TRIGGERS = [
  "Hard-coded vocabulary or sentence text",
  "Hard-coded tenant, mascot, media, or theme token",
  "Missing target-language audio cue request",
  "Support-language progress trigger",
  "Score or reward write inside prototype",
  "Route or assignment side effect",
] as const;

export function validateAiPrototypeFixtureReplayReport(report: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(report)) {
    return ["AI prototype fixture replay report must be a JSON object."];
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
  const fixtureCoverage = readStringArray(report, "fixtureCoverage");
  const replayAcceptanceChecks = readStringArray(report, "replayAcceptanceChecks");
  const blockedActions = readStringArray(report, "blockedActions");
  const modeReports = readModeFixtureReplayReports(report);

  if (!reportId || !tenantId || !requestId || !integrationPlanId) {
    errors.push("AI prototype fixture replay report must include reportId, tenantId, requestId, and integrationPlanId.");
  }

  if (!label.includes("prototype fixture replay report")) {
    errors.push("AI prototype fixture replay report label must name the fixture replay report.");
  }

  if (status !== "not-run" && status !== "review-only" && status !== "blocked") {
    errors.push("AI prototype fixture replay report must use a supported review-only status.");
  }

  if (!summary.includes("Review-only fixture replay checklist")) {
    errors.push("AI prototype fixture replay report summary must keep fixture replay review-only.");
  }

  for (const sourceRecord of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype fixture replay report must include source record: ${sourceRecord}.`);
    }
  }

  for (const purpose of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_PURPOSE) {
    if (!replayPurpose.includes(purpose)) {
      errors.push(`AI prototype fixture replay report must include replay purpose: ${purpose}.`);
    }
  }

  for (const coverage of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_COVERAGE) {
    if (!fixtureCoverage.includes(coverage)) {
      errors.push(`AI prototype fixture replay report must include fixture coverage: ${coverage}.`);
    }
  }

  for (const acceptanceCheck of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_ACCEPTANCE_CHECKS) {
    if (!replayAcceptanceChecks.includes(acceptanceCheck)) {
      errors.push(`AI prototype fixture replay report must include acceptance check: ${acceptanceCheck}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype fixture replay report must block action: ${blockedAction}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language scoring or release")) {
    errors.push("MiniStar AI prototype fixture replay report must block Japanese support-language scoring or release.");
  }

  if (modeReports.length === 0) {
    errors.push("AI prototype fixture replay report must include mode fixture replay reports.");
  }

  for (const modeReport of modeReports) {
    validateModeFixtureReplayReport(modeReport, tenantId, errors);
  }

  return errors;
}

export function getAiPrototypeFixtureReplayReportWarnings(report: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(report)) {
    return warnings;
  }

  const modeReports = readModeFixtureReplayReports(report);

  if (!modeReports.every((modeReport) => modeReport.replaySurface.includes("standard events"))) {
    warnings.push("Every fixture replay surface should capture standard events.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.replayEvidence, "Tenant theme injection sample"))) {
    warnings.push("Every fixture replay report should include tenant theme injection evidence.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.failureTriggers, "Route or assignment side effect"))) {
    warnings.push("Every fixture replay report should reject route or assignment side effects.");
  }

  return warnings;
}

export function validateAiPrototypeFixtureReplayReports(reports: unknown[]): string[] {
  return reports.flatMap((report) => validateAiPrototypeFixtureReplayReport(report));
}

export function getAiPrototypeFixtureReplayReportCollectionWarnings(reports: unknown[]): string[] {
  return reports.flatMap((report) => getAiPrototypeFixtureReplayReportWarnings(report));
}

function validateModeFixtureReplayReport(
  report: AiPrototypeModeFixtureReplayReport,
  tenantId: string,
  errors: string[],
) {
  if (!report.modeId || !report.parentEngine || !report.fixtureName || !report.replaySurface) {
    errors.push("AI prototype mode fixture replay report must include modeId, parentEngine, fixtureName, and replaySurface.");
  }

  if (!report.fixtureName.includes(report.modeId) || !report.fixtureName.includes("reviewed-unit-json-fixture")) {
    errors.push("AI prototype mode fixture replay report fixtureName must bind the mode to a reviewed unit JSON fixture.");
  }

  if (!report.replaySurface.includes("non-student replay harness") || !report.replaySurface.includes("standard events")) {
    errors.push("AI prototype mode fixture replay report must stay in a non-student harness and capture standard events.");
  }

  for (const inputAssertion of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_INPUT_ASSERTIONS) {
    if (!report.inputAssertions.includes(inputAssertion)) {
      errors.push(`AI prototype mode fixture replay report must include input assertion: ${inputAssertion}.`);
    }
  }

  for (const outputAssertion of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_OUTPUT_ASSERTIONS) {
    if (!report.outputAssertions.includes(outputAssertion)) {
      errors.push(`AI prototype mode fixture replay report must include output assertion: ${outputAssertion}.`);
    }
  }

  for (const evidence of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_EVIDENCE) {
    if (!report.replayEvidence.includes(evidence)) {
      errors.push(`AI prototype mode fixture replay report must include replay evidence: ${evidence}.`);
    }
  }

  for (const failureTrigger of AI_PROTOTYPE_FIXTURE_REPLAY_REQUIRED_FAILURE_TRIGGERS) {
    if (!report.failureTriggers.includes(failureTrigger)) {
      errors.push(`AI prototype mode fixture replay report must include failure trigger: ${failureTrigger}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(report.inputAssertions, "ja-hiragana support language remains support-only")) {
    errors.push("MiniStar AI prototype mode fixture replay report must preserve hiragana-only support-language evidence.");
  }
}

function readModeFixtureReplayReports(source: Record<string, unknown>): AiPrototypeModeFixtureReplayReport[] {
  const value = source.modeReports;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((modeReport) => ({
    modeId: readString(modeReport, "modeId"),
    parentEngine: readString(modeReport, "parentEngine"),
    fixtureName: readString(modeReport, "fixtureName"),
    replaySurface: readString(modeReport, "replaySurface"),
    inputAssertions: readStringArray(modeReport, "inputAssertions"),
    outputAssertions: readStringArray(modeReport, "outputAssertions"),
    replayEvidence: readStringArray(modeReport, "replayEvidence"),
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
