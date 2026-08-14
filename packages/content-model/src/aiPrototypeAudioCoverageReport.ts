export type AiPrototypeAudioCoverageReportStatus = "not-run" | "review-only" | "blocked";

export type AiPrototypeAudioCueKind =
  | "term"
  | "sentence"
  | "instruction"
  | "feedback"
  | "control"
  | "support-language"
  | "background-media";

export interface AiPrototypeModeAudioCoverageReport<ModeId extends string = string> {
  modeId: ModeId;
  parentEngine: string;
  audioHarness: string;
  requiredCueKinds: AiPrototypeAudioCueKind[];
  targetLanguageAudioChecks: string[];
  controlAudioChecks: string[];
  supportLanguageRules: string[];
  replayEvidence: string[];
  failureTriggers: string[];
}

export interface AiPrototypeAudioCoverageReport<ModeId extends string = string> {
  reportId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeAudioCoverageReportStatus;
  summary: string;
  sourceRecords: string[];
  targetLanguage: string;
  assistLanguagePolicy: string;
  learningAudioPriorityRule: string;
  coveragePurpose: string[];
  requiredCueFamilies: string[];
  coverageChecks: string[];
  blockedActions: string[];
  modeReports: AiPrototypeModeAudioCoverageReport<ModeId>[];
}

export const AI_PROTOTYPE_AUDIO_REQUIRED_SOURCE_RECORDS = [
  "prototype_audio_coverage_report",
  "prototype_event_replay_report",
  "prototype_fixture_replay_report",
  "ai_audio_coverage_plan",
  "audio_cue_manifest",
  "package_game_audio_coverage",
  "background_media_policy_binding",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_CUE_KINDS = [
  "term",
  "sentence",
  "instruction",
  "feedback",
  "control",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_COVERAGE_PURPOSE = [
  "Confirm every target-language vocabulary term has a tap-to-speak cue.",
  "Confirm every target sentence has replay audio before syntax or speaking play.",
  "Confirm all instructions, feedback lines, and critical controls have accessible replay support.",
  "Confirm audio_requested events are emitted without writing progress, score, reward, route, playlist, or report state.",
  "Confirm support-language audio and background media remain support-only.",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_CUE_FAMILIES = [
  "Term audio",
  "Sentence audio",
  "Instruction audio",
  "Feedback audio",
  "Critical control audio",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_COVERAGE_CHECKS = [
  "No target-language text without audio",
  "Tap-to-speak coverage is present for learner text",
  "Submit controls have separate listen or replay controls where needed",
  "Audio cues reference the shared audio_cue_manifest",
  "Audio events are support evidence, not score authority",
  "Background media never overrides learning audio",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_BLOCKED_ACTIONS = [
  "No audio manifest mutation from prototype",
  "No generated voice call",
  "No voice API cost",
  "No media-only mastery",
  "No support-language progress trigger",
  "No playlist write",
  "No package audio-complete marker",
  "No student assignment",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_TARGET_LANGUAGE_CHECKS = [
  "Vocabulary tiles request target-language term audio.",
  "Sentence prompts request target-language sentence audio.",
  "Instructions can be tapped or replayed without advancing progress.",
  "Feedback audio is supportive and never a standalone score event.",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_CONTROL_CHECKS = [
  "Start, submit, retry, and next controls have visible text and a separate listen or replay pathway where age-appropriate.",
  "No critical button hides its text or depends on color alone.",
  "Audio playback never blocks the target-language answer interaction.",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_SUPPORT_RULES = [
  "Support-language cues are marked support-only.",
  "Support-language cues cannot emit mastery_updated.",
  "Background music and video sound duck or pause for learning audio.",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_REPLAY_EVIDENCE = [
  "Tap-to-speak coverage snapshot",
  "Audio cue manifest reference sample",
  "audio_requested event log sample",
  "Missing cue list",
  "Control replay audit",
  "Background media conflict check",
] as const;

export const AI_PROTOTYPE_AUDIO_REQUIRED_FAILURE_TRIGGERS = [
  "Target-language text appears without audio coverage.",
  "Critical control lacks visible text or replay audio.",
  "Prototype generates voice or triggers billable API use.",
  "Support-language audio unlocks progress.",
  "Media-only listening counts toward mastery.",
  "Prototype mutates audio manifest, playlist, route, score, reward, report, or assignment state.",
] as const;

export function validateAiPrototypeAudioCoverageReport(report: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(report)) {
    return ["AI prototype audio coverage report must be a JSON object."];
  }

  const reportId = readString(report, "reportId");
  const tenantId = readString(report, "tenantId");
  const requestId = readString(report, "requestId");
  const integrationPlanId = readString(report, "integrationPlanId");
  const label = readString(report, "label");
  const status = readString(report, "status");
  const summary = readString(report, "summary");
  const targetLanguage = readString(report, "targetLanguage");
  const assistLanguagePolicy = readString(report, "assistLanguagePolicy");
  const learningAudioPriorityRule = readString(report, "learningAudioPriorityRule");
  const sourceRecords = readStringArray(report, "sourceRecords");
  const coveragePurpose = readStringArray(report, "coveragePurpose");
  const requiredCueFamilies = readStringArray(report, "requiredCueFamilies");
  const coverageChecks = readStringArray(report, "coverageChecks");
  const blockedActions = readStringArray(report, "blockedActions");
  const modeReports = readModeAudioCoverageReports(report);

  if (!reportId || !tenantId || !requestId || !integrationPlanId) {
    errors.push("AI prototype audio coverage report must include reportId, tenantId, requestId, and integrationPlanId.");
  }

  if (!label.includes("prototype audio coverage report")) {
    errors.push("AI prototype audio coverage report label must name the audio coverage report.");
  }

  if (status !== "not-run" && status !== "review-only" && status !== "blocked") {
    errors.push("AI prototype audio coverage report must use a supported review-only status.");
  }

  if (!summary.includes("Review-only tap-to-speak and replay-audio checklist")) {
    errors.push("AI prototype audio coverage report summary must keep audio coverage review-only.");
  }

  if (!targetLanguage) {
    errors.push("AI prototype audio coverage report must include targetLanguage.");
  }

  if (!assistLanguagePolicy.toLowerCase().includes("support")) {
    errors.push("AI prototype audio coverage report must state support-language policy.");
  }

  if (!learningAudioPriorityRule.includes("Learning audio wins")) {
    errors.push("AI prototype audio coverage report must preserve learning-audio priority.");
  }

  for (const sourceRecord of AI_PROTOTYPE_AUDIO_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype audio coverage report must include source record: ${sourceRecord}.`);
    }
  }

  for (const purpose of AI_PROTOTYPE_AUDIO_REQUIRED_COVERAGE_PURPOSE) {
    if (!coveragePurpose.includes(purpose)) {
      errors.push(`AI prototype audio coverage report must include coverage purpose: ${purpose}.`);
    }
  }

  for (const family of AI_PROTOTYPE_AUDIO_REQUIRED_CUE_FAMILIES) {
    if (!requiredCueFamilies.includes(family)) {
      errors.push(`AI prototype audio coverage report must include cue family: ${family}.`);
    }
  }

  for (const check of AI_PROTOTYPE_AUDIO_REQUIRED_COVERAGE_CHECKS) {
    if (!coverageChecks.includes(check)) {
      errors.push(`AI prototype audio coverage report must include coverage check: ${check}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_AUDIO_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype audio coverage report must block action: ${blockedAction}.`);
    }
  }

  if (tenantId === "ministar") {
    if (!textListIncludes(coverageChecks, "Foundation Japanese support remains hiragana-only and support-only")) {
      errors.push("MiniStar AI prototype audio coverage report must preserve hiragana-only support coverage.");
    }

    if (!textListIncludes(blockedActions, "No Japanese support-language audio can unlock English progress")) {
      errors.push("MiniStar AI prototype audio coverage report must block Japanese support audio progress.");
    }
  }

  if (modeReports.length === 0) {
    errors.push("AI prototype audio coverage report must include mode audio coverage reports.");
  }

  for (const modeReport of modeReports) {
    validateModeAudioCoverageReport(modeReport, tenantId, errors);
  }

  return errors;
}

export function getAiPrototypeAudioCoverageReportWarnings(report: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(report)) {
    return warnings;
  }

  const modeReports = readModeAudioCoverageReports(report);

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.replayEvidence, "Background media conflict check"))) {
    warnings.push("Every audio coverage report should include background media conflict evidence.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.controlAudioChecks, "visible text"))) {
    warnings.push("Every audio coverage report should prove critical controls have visible text.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.failureTriggers, "billable API use"))) {
    warnings.push("Every audio coverage report should reject generated voice or billable API use.");
  }

  return warnings;
}

export function validateAiPrototypeAudioCoverageReports(reports: unknown[]): string[] {
  return reports.flatMap((report) => validateAiPrototypeAudioCoverageReport(report));
}

export function getAiPrototypeAudioCoverageReportCollectionWarnings(reports: unknown[]): string[] {
  return reports.flatMap((report) => getAiPrototypeAudioCoverageReportWarnings(report));
}

function validateModeAudioCoverageReport(
  report: AiPrototypeModeAudioCoverageReport,
  tenantId: string,
  errors: string[],
) {
  if (!report.modeId || !report.parentEngine || !report.audioHarness) {
    errors.push("AI prototype mode audio coverage report must include modeId, parentEngine, and audioHarness.");
  }

  if (!report.audioHarness.includes("non-student audio replay harness") || !report.audioHarness.includes("audio_requested events only")) {
    errors.push("AI prototype mode audio coverage report must stay in a non-student audio replay harness.");
  }

  for (const cueKind of AI_PROTOTYPE_AUDIO_REQUIRED_CUE_KINDS) {
    if (!report.requiredCueKinds.includes(cueKind)) {
      errors.push(`AI prototype mode audio coverage report must include required cue kind: ${cueKind}.`);
    }
  }

  for (const check of AI_PROTOTYPE_AUDIO_REQUIRED_TARGET_LANGUAGE_CHECKS) {
    if (!report.targetLanguageAudioChecks.includes(check)) {
      errors.push(`AI prototype mode audio coverage report must include target-language check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_AUDIO_REQUIRED_CONTROL_CHECKS) {
    if (!report.controlAudioChecks.includes(check)) {
      errors.push(`AI prototype mode audio coverage report must include control check: ${check}.`);
    }
  }

  for (const rule of AI_PROTOTYPE_AUDIO_REQUIRED_SUPPORT_RULES) {
    if (!report.supportLanguageRules.includes(rule)) {
      errors.push(`AI prototype mode audio coverage report must include support-language rule: ${rule}.`);
    }
  }

  for (const evidence of AI_PROTOTYPE_AUDIO_REQUIRED_REPLAY_EVIDENCE) {
    if (!report.replayEvidence.includes(evidence)) {
      errors.push(`AI prototype mode audio coverage report must include replay evidence: ${evidence}.`);
    }
  }

  for (const failureTrigger of AI_PROTOTYPE_AUDIO_REQUIRED_FAILURE_TRIGGERS) {
    if (!report.failureTriggers.includes(failureTrigger)) {
      errors.push(`AI prototype mode audio coverage report must include failure trigger: ${failureTrigger}.`);
    }
  }

  if (report.modeId === "speak-it" && !textListIncludes(report.targetLanguageAudioChecks, "Speech matching prompts require replay audio")) {
    errors.push("Speak It prototype audio coverage must require replay audio before microphone scoring.");
  }

  if (tenantId === "ministar" && !textListIncludes(report.supportLanguageRules, "Japanese support audio remains hiragana-only")) {
    errors.push("MiniStar AI prototype mode audio coverage report must keep Japanese support audio hiragana-only.");
  }
}

function readModeAudioCoverageReports(source: Record<string, unknown>): AiPrototypeModeAudioCoverageReport[] {
  const value = source.modeReports;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((modeReport) => ({
    modeId: readString(modeReport, "modeId"),
    parentEngine: readString(modeReport, "parentEngine"),
    audioHarness: readString(modeReport, "audioHarness"),
    requiredCueKinds: readAudioCueKinds(modeReport),
    targetLanguageAudioChecks: readStringArray(modeReport, "targetLanguageAudioChecks"),
    controlAudioChecks: readStringArray(modeReport, "controlAudioChecks"),
    supportLanguageRules: readStringArray(modeReport, "supportLanguageRules"),
    replayEvidence: readStringArray(modeReport, "replayEvidence"),
    failureTriggers: readStringArray(modeReport, "failureTriggers"),
  }));
}

function readAudioCueKinds(source: Record<string, unknown>): AiPrototypeAudioCueKind[] {
  const value = source.requiredCueKinds;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isAudioCueKind);
}

function isAudioCueKind(value: unknown): value is AiPrototypeAudioCueKind {
  return (
    value === "term" ||
    value === "sentence" ||
    value === "instruction" ||
    value === "feedback" ||
    value === "control" ||
    value === "support-language" ||
    value === "background-media"
  );
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
