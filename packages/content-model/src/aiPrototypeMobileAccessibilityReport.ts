export type AiPrototypeMobileAccessibilityReportStatus = "not-run" | "review-only" | "blocked";

export interface AiPrototypeModeMobileAccessibilityReport<ModeId extends string = string> {
  modeId: ModeId;
  parentEngine: string;
  accessibilityHarness: string;
  viewportEvidence: string[];
  touchAndControlChecks: string[];
  keyboardAndFocusChecks: string[];
  readableTextChecks: string[];
  failureTriggers: string[];
}

export interface AiPrototypeMobileAccessibilityReport<ModeId extends string = string> {
  reportId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeMobileAccessibilityReportStatus;
  summary: string;
  sourceRecords: string[];
  viewportPolicy: string;
  learnerControlPolicy: string;
  readabilityPolicy: string;
  accessibilityPurpose: string[];
  viewportChecks: string[];
  touchTargetChecks: string[];
  keyboardFocusChecks: string[];
  visualStabilityChecks: string[];
  blockedActions: string[];
  modeReports: AiPrototypeModeMobileAccessibilityReport<ModeId>[];
}

export const AI_PROTOTYPE_MOBILE_REQUIRED_SOURCE_RECORDS = [
  "prototype_mobile_accessibility_report",
  "ai_prototype_integration_plan",
  "activity_compatibility_snapshot",
  "template_rendering_profile",
  "font_accessibility_profile",
  "standard_event_contract",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_PURPOSE = [
  "Confirm phone-first QR entry can complete the activity without horizontal scrolling.",
  "Confirm touch targets are large enough for young learners.",
  "Confirm keyboard and focus order do not trap teachers, reviewers, or accessibility users.",
  "Confirm visible text remains readable inside buttons, tiles, cards, and game surfaces.",
  "Confirm Phaser or canvas wrappers provide DOM control labels, fallback text, and parent-engine event paths.",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_VIEWPORT_CHECKS = [
  "Mobile viewport smoke evidence",
  "No viewport overflow",
  "No layout shift when progress, rewards, or feedback appear",
  "No game canvas hides required controls",
  "Landscape and portrait classroom checks are listed",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_TOUCH_CHECKS = [
  "Touch target checks",
  "Critical controls meet child-friendly sizing",
  "Drag or tap alternatives are listed for motor accessibility",
  "Submit, replay, retry, and next controls remain separate",
  "No unreadable learner control",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_KEYBOARD_CHECKS = [
  "Keyboard and focus checks",
  "Focus order follows the learning sequence",
  "Focus states are visible without color-only cues",
  "Escape or back behavior is review-defined for overlays",
  "No keyboard trap inside wrapper or canvas surfaces",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_VISUAL_CHECKS = [
  "No text hidden inside black buttons",
  "No viewport-scaled font sizing",
  "No negative letter spacing",
  "No overlapping reward, media, or support-language panels",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_BLOCKED_ACTIONS = [
  "No student-facing preview from returned code",
  "No direct import into apps/web",
  "No route registry write",
  "No accessibility waiver from visual polish alone",
  "No Phaser wrapper without accessible DOM controls",
  "No assignment creation",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_MODE_VIEWPORT_EVIDENCE = [
  "Phone portrait screenshot required",
  "Phone landscape screenshot required",
  "Tablet screenshot required",
  "Classroom display screenshot required",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_MODE_TOUCH_CHECKS = [
  "Primary answer controls are tap-friendly.",
  "Submit, listen, replay, retry, and next controls stay visible and separate.",
  "No critical action depends on drag-only input.",
  "No color-only correct or incorrect state.",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_MODE_KEYBOARD_CHECKS = [
  "Tab order follows instruction, game surface, answer controls, audio controls, feedback, and next step.",
  "Visible focus state is present for buttons and interactive tiles.",
  "Overlays and modals have a review-defined close path.",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_MODE_READABLE_TEXT_CHECKS = [
  "Instructions, tiles, feedback, and buttons fit their containers.",
  "No text hidden inside black buttons.",
  "No negative letter spacing or viewport-scaled font sizing.",
  "Support-language text stays support-only and readable.",
] as const;

export const AI_PROTOTYPE_MOBILE_REQUIRED_FAILURE_TRIGGERS = [
  "Mobile viewport overflows horizontally.",
  "Critical button text is hidden, clipped, or low contrast.",
  "Touch target is too small for young learners.",
  "Focus order skips learning controls.",
  "Canvas or Phaser wrapper hides required DOM labels.",
  "Prototype creates a student-facing preview, route write, or assignment shortcut.",
] as const;

export function validateAiPrototypeMobileAccessibilityReport(report: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(report)) {
    return ["AI prototype mobile accessibility report must be a JSON object."];
  }

  const reportId = readString(report, "reportId");
  const tenantId = readString(report, "tenantId");
  const requestId = readString(report, "requestId");
  const integrationPlanId = readString(report, "integrationPlanId");
  const label = readString(report, "label");
  const status = readString(report, "status");
  const summary = readString(report, "summary");
  const viewportPolicy = readString(report, "viewportPolicy");
  const learnerControlPolicy = readString(report, "learnerControlPolicy");
  const readabilityPolicy = readString(report, "readabilityPolicy");
  const sourceRecords = readStringArray(report, "sourceRecords");
  const accessibilityPurpose = readStringArray(report, "accessibilityPurpose");
  const viewportChecks = readStringArray(report, "viewportChecks");
  const touchTargetChecks = readStringArray(report, "touchTargetChecks");
  const keyboardFocusChecks = readStringArray(report, "keyboardFocusChecks");
  const visualStabilityChecks = readStringArray(report, "visualStabilityChecks");
  const blockedActions = readStringArray(report, "blockedActions");
  const modeReports = readModeMobileAccessibilityReports(report);

  if (!reportId || !tenantId || !requestId || !integrationPlanId) {
    errors.push("AI prototype mobile accessibility report must include reportId, tenantId, requestId, and integrationPlanId.");
  }

  if (!label.includes("prototype mobile accessibility report")) {
    errors.push("AI prototype mobile accessibility report label must name the mobile accessibility report.");
  }

  if (status !== "not-run" && status !== "review-only" && status !== "blocked") {
    errors.push("AI prototype mobile accessibility report must use a supported review-only status.");
  }

  if (!summary.includes("Review-only mobile and accessibility checklist")) {
    errors.push("AI prototype mobile accessibility report summary must keep mobile/accessibility review-only.");
  }

  if (!viewportPolicy.includes("mobile viewport smoke evidence")) {
    errors.push("AI prototype mobile accessibility report must preserve mobile viewport policy.");
  }

  if (!learnerControlPolicy.includes("visible text") || !learnerControlPolicy.includes("touch targets")) {
    errors.push("AI prototype mobile accessibility report must preserve learner control policy.");
  }

  if (!readabilityPolicy.includes("hidden black-button text") || !readabilityPolicy.includes("unreadable support-language rendering")) {
    errors.push("AI prototype mobile accessibility report must preserve readability policy.");
  }

  for (const sourceRecord of AI_PROTOTYPE_MOBILE_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype mobile accessibility report must include source record: ${sourceRecord}.`);
    }
  }

  for (const purpose of AI_PROTOTYPE_MOBILE_REQUIRED_PURPOSE) {
    if (!accessibilityPurpose.includes(purpose)) {
      errors.push(`AI prototype mobile accessibility report must include accessibility purpose: ${purpose}.`);
    }
  }

  for (const check of AI_PROTOTYPE_MOBILE_REQUIRED_VIEWPORT_CHECKS) {
    if (!viewportChecks.includes(check)) {
      errors.push(`AI prototype mobile accessibility report must include viewport check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_MOBILE_REQUIRED_TOUCH_CHECKS) {
    if (!touchTargetChecks.includes(check)) {
      errors.push(`AI prototype mobile accessibility report must include touch target check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_MOBILE_REQUIRED_KEYBOARD_CHECKS) {
    if (!keyboardFocusChecks.includes(check)) {
      errors.push(`AI prototype mobile accessibility report must include keyboard/focus check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_MOBILE_REQUIRED_VISUAL_CHECKS) {
    if (!visualStabilityChecks.includes(check)) {
      errors.push(`AI prototype mobile accessibility report must include visual stability check: ${check}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_MOBILE_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype mobile accessibility report must block action: ${blockedAction}.`);
    }
  }

  if (tenantId === "ministar") {
    if (!textListIncludes(visualStabilityChecks, "Foundation Japanese support remains hiragana-readable")) {
      errors.push("MiniStar AI prototype mobile accessibility report must preserve hiragana-readable support text.");
    }

    if (!textListIncludes(blockedActions, "No Japanese support-language UI can unlock English progress")) {
      errors.push("MiniStar AI prototype mobile accessibility report must block Japanese support UI progress.");
    }
  }

  if (modeReports.length === 0) {
    errors.push("AI prototype mobile accessibility report must include mode mobile/accessibility reports.");
  }

  for (const modeReport of modeReports) {
    validateModeMobileAccessibilityReport(modeReport, tenantId, errors);
  }

  return errors;
}

export function getAiPrototypeMobileAccessibilityReportWarnings(report: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(report)) {
    return warnings;
  }

  const modeReports = readModeMobileAccessibilityReports(report);

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.viewportEvidence, "Phone portrait screenshot required"))) {
    warnings.push("Every mobile accessibility report should include phone portrait evidence.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.readableTextChecks, "No text hidden inside black buttons."))) {
    warnings.push("Every mobile accessibility report should explicitly reject hidden black-button text.");
  }

  if (!modeReports.every((modeReport) => textListIncludes(modeReport.failureTriggers, "student-facing preview"))) {
    warnings.push("Every mobile accessibility report should block student-facing preview shortcuts.");
  }

  return warnings;
}

export function validateAiPrototypeMobileAccessibilityReports(reports: unknown[]): string[] {
  return reports.flatMap((report) => validateAiPrototypeMobileAccessibilityReport(report));
}

export function getAiPrototypeMobileAccessibilityReportCollectionWarnings(reports: unknown[]): string[] {
  return reports.flatMap((report) => getAiPrototypeMobileAccessibilityReportWarnings(report));
}

function validateModeMobileAccessibilityReport(
  report: AiPrototypeModeMobileAccessibilityReport,
  tenantId: string,
  errors: string[],
) {
  if (!report.modeId || !report.parentEngine || !report.accessibilityHarness) {
    errors.push("AI prototype mode mobile accessibility report must include modeId, parentEngine, and accessibilityHarness.");
  }

  if (!report.accessibilityHarness.includes("non-student viewport and accessibility harness")) {
    errors.push("AI prototype mode mobile accessibility report must stay in a non-student harness.");
  }

  for (const evidence of AI_PROTOTYPE_MOBILE_REQUIRED_MODE_VIEWPORT_EVIDENCE) {
    if (!report.viewportEvidence.includes(evidence)) {
      errors.push(`AI prototype mode mobile accessibility report must include viewport evidence: ${evidence}.`);
    }
  }

  for (const check of AI_PROTOTYPE_MOBILE_REQUIRED_MODE_TOUCH_CHECKS) {
    if (!report.touchAndControlChecks.includes(check)) {
      errors.push(`AI prototype mode mobile accessibility report must include touch/control check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_MOBILE_REQUIRED_MODE_KEYBOARD_CHECKS) {
    if (!report.keyboardAndFocusChecks.includes(check)) {
      errors.push(`AI prototype mode mobile accessibility report must include keyboard/focus check: ${check}.`);
    }
  }

  for (const check of AI_PROTOTYPE_MOBILE_REQUIRED_MODE_READABLE_TEXT_CHECKS) {
    if (!report.readableTextChecks.includes(check)) {
      errors.push(`AI prototype mode mobile accessibility report must include readable text check: ${check}.`);
    }
  }

  for (const failureTrigger of AI_PROTOTYPE_MOBILE_REQUIRED_FAILURE_TRIGGERS) {
    if (!report.failureTriggers.includes(failureTrigger)) {
      errors.push(`AI prototype mode mobile accessibility report must include failure trigger: ${failureTrigger}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(report.readableTextChecks, "Foundation Japanese support remains hiragana-readable.")) {
    errors.push("MiniStar AI prototype mode mobile accessibility report must keep Japanese support text hiragana-readable.");
  }
}

function readModeMobileAccessibilityReports(source: Record<string, unknown>): AiPrototypeModeMobileAccessibilityReport[] {
  const value = source.modeReports;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((modeReport) => ({
    modeId: readString(modeReport, "modeId"),
    parentEngine: readString(modeReport, "parentEngine"),
    accessibilityHarness: readString(modeReport, "accessibilityHarness"),
    viewportEvidence: readStringArray(modeReport, "viewportEvidence"),
    touchAndControlChecks: readStringArray(modeReport, "touchAndControlChecks"),
    keyboardAndFocusChecks: readStringArray(modeReport, "keyboardAndFocusChecks"),
    readableTextChecks: readStringArray(modeReport, "readableTextChecks"),
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
