import type { AiPrototypeAudioCoverageReport } from "./aiPrototypeAudioCoverageReport";
import type { AiPrototypeCodexIntegrationDecision } from "./aiPrototypeCodexIntegrationDecision";
import type { AiPrototypeEventReplayReport } from "./aiPrototypeEventReplayReport";
import type { AiPrototypeFixtureReplayReport } from "./aiPrototypeFixtureReplayReport";
import type { AiPrototypeIntegrationPlan } from "./aiPrototypeIntegrationPlan";
import type { AiPrototypeIntegrationReadinessGate } from "./aiPrototypeIntegrationReadinessGate";
import type { AiPrototypeMobileAccessibilityReport } from "./aiPrototypeMobileAccessibilityReport";
import type { AiPrototypeReturnReviewPacket } from "./aiPrototypeReturnReview";
import type { AiPrototypeScoringReplayReport } from "./aiPrototypeScoringReplayReport";
import type { AiPrototypeWrapperAdapterReview } from "./aiPrototypeWrapperAdapterReview";

export interface AiPrototypeEvidenceAlignmentBundle {
  returnReview: AiPrototypeReturnReviewPacket;
  integrationPlan: AiPrototypeIntegrationPlan;
  wrapperAdapterReview: AiPrototypeWrapperAdapterReview;
  fixtureReplayReport: AiPrototypeFixtureReplayReport;
  eventReplayReport: AiPrototypeEventReplayReport;
  audioCoverageReport: AiPrototypeAudioCoverageReport;
  mobileAccessibilityReport: AiPrototypeMobileAccessibilityReport;
  scoringReplayReport: AiPrototypeScoringReplayReport;
  codexIntegrationDecision: AiPrototypeCodexIntegrationDecision;
  integrationReadinessGate: AiPrototypeIntegrationReadinessGate;
}

type ModeRecord = { modeId: string; parentEngine: string };

export function validateAiPrototypeEvidenceAlignment(
  bundle: AiPrototypeEvidenceAlignmentBundle,
): string[] {
  const errors: string[] = [];
  const records = [
    ["return review", bundle.returnReview],
    ["integration plan", bundle.integrationPlan],
    ["wrapper adapter review", bundle.wrapperAdapterReview],
    ["fixture replay report", bundle.fixtureReplayReport],
    ["event replay report", bundle.eventReplayReport],
    ["audio coverage report", bundle.audioCoverageReport],
    ["mobile accessibility report", bundle.mobileAccessibilityReport],
    ["scoring replay report", bundle.scoringReplayReport],
    ["Codex integration decision", bundle.codexIntegrationDecision],
    ["integration readiness gate", bundle.integrationReadinessGate],
  ] as const;

  const tenantId = bundle.returnReview.tenantId;
  const requestId = bundle.returnReview.requestId;
  for (const [label, record] of records) {
    if (record.tenantId !== tenantId) {
      errors.push(`${label} tenantId does not match the return review tenant.`);
    }
    if (record.requestId !== requestId) {
      errors.push(`${label} requestId does not match the return review request.`);
    }
  }

  const planId = bundle.integrationPlan.planId;
  if (bundle.integrationPlan.returnReviewId !== bundle.returnReview.reviewId) {
    errors.push("Integration plan returnReviewId does not point to the return review.");
  }
  for (const [label, record] of [
    ["wrapper adapter review", bundle.wrapperAdapterReview],
    ["fixture replay report", bundle.fixtureReplayReport],
    ["event replay report", bundle.eventReplayReport],
    ["audio coverage report", bundle.audioCoverageReport],
    ["mobile accessibility report", bundle.mobileAccessibilityReport],
    ["scoring replay report", bundle.scoringReplayReport],
  ] as const) {
    if (record.integrationPlanId !== planId) {
      errors.push(`${label} integrationPlanId does not point to the integration plan.`);
    }
  }
  if (bundle.integrationReadinessGate.integrationPlanId !== planId) {
    errors.push("Integration readiness gate integrationPlanId does not point to the integration plan.");
  }

  const expectedModes = toModeMap("return review", bundle.returnReview.modeReviews, errors);
  compareModes("integration plan", bundle.integrationPlan.modePlans, expectedModes, errors);
  compareModes("wrapper adapter review", bundle.wrapperAdapterReview.modeReviews, expectedModes, errors);
  compareModes("fixture replay report", bundle.fixtureReplayReport.modeReports, expectedModes, errors);
  compareModes("event replay report", bundle.eventReplayReport.modeReports, expectedModes, errors);
  compareModes("audio coverage report", bundle.audioCoverageReport.modeReports, expectedModes, errors);
  compareModes("mobile accessibility report", bundle.mobileAccessibilityReport.modeReports, expectedModes, errors);
  compareModes("scoring replay report", bundle.scoringReplayReport.modeReports, expectedModes, errors);

  return errors;
}

function toModeMap(label: string, records: ModeRecord[], errors: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const record of records) {
    if (map.has(record.modeId)) {
      errors.push(`${label} contains duplicate modeId ${record.modeId}.`);
    }
    map.set(record.modeId, record.parentEngine);
  }
  if (map.size === 0) {
    errors.push(`${label} contains no mode evidence.`);
  }
  return map;
}

function compareModes(
  label: string,
  records: ModeRecord[],
  expectedModes: Map<string, string>,
  errors: string[],
): void {
  const actualModes = toModeMap(label, records, errors);
  for (const [modeId, parentEngine] of expectedModes) {
    if (!actualModes.has(modeId)) {
      errors.push(`${label} is missing mode ${modeId}.`);
      continue;
    }
    if (actualModes.get(modeId) !== parentEngine) {
      errors.push(`${label} changes the parent engine for mode ${modeId}.`);
    }
  }
  for (const modeId of actualModes.keys()) {
    if (!expectedModes.has(modeId)) {
      errors.push(`${label} contains unexpected mode ${modeId}.`);
    }
  }
}
