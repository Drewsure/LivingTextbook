import {
  sampleAiPrototypeIntegrationPlans,
  type AiPrototypeModeIntegrationPlan,
} from "@/data/sampleAiPrototypeIntegrationPlan";
import {
  getAiPrototypeMobileAccessibilityReportCollectionWarnings,
  validateAiPrototypeMobileAccessibilityReports,
  type AiPrototypeMobileAccessibilityReport as SharedAiPrototypeMobileAccessibilityReport,
  type AiPrototypeMobileAccessibilityReportStatus,
  type AiPrototypeModeMobileAccessibilityReport as SharedAiPrototypeModeMobileAccessibilityReport,
} from "@living-textbook/content-model/src/aiPrototypeMobileAccessibilityReport";

export type AiPrototypeModeMobileAccessibilityReport = SharedAiPrototypeModeMobileAccessibilityReport;
export type AiPrototypeMobileAccessibilityReport = SharedAiPrototypeMobileAccessibilityReport;
export type { AiPrototypeMobileAccessibilityReportStatus };

export const sampleAiPrototypeMobileAccessibilityReports: AiPrototypeMobileAccessibilityReport[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";

    return {
      reportId: `prototype-mobile-accessibility-report-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      integrationPlanId: plan.planId,
      label: isMiniStar
        ? "MiniStar prototype mobile accessibility report"
        : "AI prototype mobile accessibility report",
      status: "not-run",
      summary:
        "Review-only mobile and accessibility checklist for proving that a returned prototype works for phone-first classroom QR use before integration.",
      sourceRecords: [
        "prototype_mobile_accessibility_report",
        "ai_prototype_integration_plan",
        "activity_compatibility_snapshot",
        "template_rendering_profile",
        "font_accessibility_profile",
        "standard_event_contract",
      ],
      viewportPolicy:
        "Prototype evidence must include mobile viewport smoke evidence for narrow phones, tablets, and classroom display widths before apps/web integration.",
      learnerControlPolicy:
        "Learner controls must have visible text, accessible names, adequate touch targets, and no color-only state.",
      readabilityPolicy:
        "Learner text must avoid overflow, hidden black-button text, viewport-scaled fonts, negative letter spacing, and unreadable support-language rendering.",
      accessibilityPurpose: [
        "Confirm phone-first QR entry can complete the activity without horizontal scrolling.",
        "Confirm touch targets are large enough for young learners.",
        "Confirm keyboard and focus order do not trap teachers, reviewers, or accessibility users.",
        "Confirm visible text remains readable inside buttons, tiles, cards, and game surfaces.",
        "Confirm Phaser or canvas wrappers provide DOM control labels, fallback text, and parent-engine event paths.",
      ],
      viewportChecks: [
        "Mobile viewport smoke evidence",
        "No viewport overflow",
        "No layout shift when progress, rewards, or feedback appear",
        "No game canvas hides required controls",
        "Landscape and portrait classroom checks are listed",
      ],
      touchTargetChecks: [
        "Touch target checks",
        "Critical controls meet child-friendly sizing",
        "Drag or tap alternatives are listed for motor accessibility",
        "Submit, replay, retry, and next controls remain separate",
        "No unreadable learner control",
      ],
      keyboardFocusChecks: [
        "Keyboard and focus checks",
        "Focus order follows the learning sequence",
        "Focus states are visible without color-only cues",
        "Escape or back behavior is review-defined for overlays",
        "No keyboard trap inside wrapper or canvas surfaces",
      ],
      visualStabilityChecks: [
        "No text hidden inside black buttons",
        "No viewport-scaled font sizing",
        "No negative letter spacing",
        "No overlapping reward, media, or support-language panels",
        ...(isMiniStar ? ["Foundation Japanese support remains hiragana-readable"] : []),
      ],
      blockedActions: [
        "No student-facing preview from returned code",
        "No direct import into apps/web",
        "No route registry write",
        "No accessibility waiver from visual polish alone",
        "No Phaser wrapper without accessible DOM controls",
        "No assignment creation",
        ...(isMiniStar ? ["No Japanese support-language UI can unlock English progress"] : []),
      ],
      modeReports: plan.modePlans.map((modePlan) => createModeMobileAccessibilityReport(modePlan, isMiniStar)),
    };
  });

export const sampleAiPrototypeMobileAccessibilityReportErrors = validateAiPrototypeMobileAccessibilityReports(
  sampleAiPrototypeMobileAccessibilityReports,
);

export const sampleAiPrototypeMobileAccessibilityReportWarnings =
  getAiPrototypeMobileAccessibilityReportCollectionWarnings(sampleAiPrototypeMobileAccessibilityReports);

function createModeMobileAccessibilityReport(
  modePlan: AiPrototypeModeIntegrationPlan,
  isMiniStar: boolean,
): AiPrototypeModeMobileAccessibilityReport {
  const isPhaserCandidate = modePlan.proposedSurface.includes("Phaser");

  return {
    modeId: modePlan.modeId,
    parentEngine: modePlan.parentEngine,
    accessibilityHarness:
      "A non-student viewport and accessibility harness that checks mobile layout, readable text, touch targets, focus order, and parent-engine control labels before integration.",
    viewportEvidence: [
      "Phone portrait screenshot required",
      "Phone landscape screenshot required",
      "Tablet screenshot required",
      "Classroom display screenshot required",
      ...(isPhaserCandidate ? ["Canvas pixel nonblank and correctly framed evidence required"] : []),
    ],
    touchAndControlChecks: [
      "Primary answer controls are tap-friendly.",
      "Submit, listen, replay, retry, and next controls stay visible and separate.",
      "No critical action depends on drag-only input.",
      "No color-only correct or incorrect state.",
    ],
    keyboardAndFocusChecks: [
      "Tab order follows instruction, game surface, answer controls, audio controls, feedback, and next step.",
      "Visible focus state is present for buttons and interactive tiles.",
      "Overlays and modals have a review-defined close path.",
      ...(isPhaserCandidate ? ["Canvas wrapper exposes DOM controls for critical learning actions."] : []),
    ],
    readableTextChecks: [
      "Instructions, tiles, feedback, and buttons fit their containers.",
      "No text hidden inside black buttons.",
      "No negative letter spacing or viewport-scaled font sizing.",
      "Support-language text stays support-only and readable.",
      ...(isMiniStar ? ["Foundation Japanese support remains hiragana-readable."] : []),
    ],
    failureTriggers: [
      "Mobile viewport overflows horizontally.",
      "Critical button text is hidden, clipped, or low contrast.",
      "Touch target is too small for young learners.",
      "Focus order skips learning controls.",
      "Canvas or Phaser wrapper hides required DOM labels.",
      "Prototype creates a student-facing preview, route write, or assignment shortcut.",
    ],
  };
}

export function filterAiPrototypeMobileAccessibilityReportsByTenant(
  reports: AiPrototypeMobileAccessibilityReport[],
  tenantId: string,
): AiPrototypeMobileAccessibilityReport[] {
  return reports.filter((report) => report.tenantId === tenantId);
}
