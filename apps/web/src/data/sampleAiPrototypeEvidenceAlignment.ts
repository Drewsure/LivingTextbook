import {
  validateAiPrototypeEvidenceAlignment,
  type AiPrototypeEvidenceAlignmentBundle,
} from "@living-textbook/content-model/src/aiPrototypeEvidenceAlignment";
import { sampleAiPrototypeAudioCoverageReports } from "@/data/sampleAiPrototypeAudioCoverageReport";
import { sampleAiPrototypeCodexIntegrationDecisions } from "@/data/sampleAiPrototypeCodexIntegrationDecision";
import { sampleAiPrototypeEventReplayReports } from "@/data/sampleAiPrototypeEventReplayReport";
import { sampleAiPrototypeFixtureReplayReports } from "@/data/sampleAiPrototypeFixtureReplayReport";
import { sampleAiPrototypeIntegrationPlans } from "@/data/sampleAiPrototypeIntegrationPlan";
import { sampleAiPrototypeIntegrationReadinessGates } from "@/data/sampleAiPrototypeIntegrationReadinessGate";
import { sampleAiPrototypeMobileAccessibilityReports } from "@/data/sampleAiPrototypeMobileAccessibilityReport";
import { sampleAiPrototypeReturnReviewPackets } from "@/data/sampleAiPrototypeReturnReview";
import { sampleAiPrototypeScoringReplayReports } from "@/data/sampleAiPrototypeScoringReplayReport";
import { sampleAiPrototypeWrapperAdapterReviews } from "@/data/sampleAiPrototypeWrapperAdapterReview";

export const sampleAiPrototypeEvidenceAlignmentBundles: AiPrototypeEvidenceAlignmentBundle[] =
  sampleAiPrototypeReturnReviewPackets.flatMap((returnReview) => {
    const byRequest = <T extends { requestId: string }>(records: T[]) =>
      records.find((record) => record.requestId === returnReview.requestId);
    const integrationPlan = byRequest(sampleAiPrototypeIntegrationPlans);
    const wrapperAdapterReview = byRequest(sampleAiPrototypeWrapperAdapterReviews);
    const fixtureReplayReport = byRequest(sampleAiPrototypeFixtureReplayReports);
    const eventReplayReport = byRequest(sampleAiPrototypeEventReplayReports);
    const audioCoverageReport = byRequest(sampleAiPrototypeAudioCoverageReports);
    const mobileAccessibilityReport = byRequest(sampleAiPrototypeMobileAccessibilityReports);
    const scoringReplayReport = byRequest(sampleAiPrototypeScoringReplayReports);
    const codexIntegrationDecision = byRequest(sampleAiPrototypeCodexIntegrationDecisions);
    const integrationReadinessGate = byRequest(sampleAiPrototypeIntegrationReadinessGates);

    if (
      !integrationPlan ||
      !wrapperAdapterReview ||
      !fixtureReplayReport ||
      !eventReplayReport ||
      !audioCoverageReport ||
      !mobileAccessibilityReport ||
      !scoringReplayReport ||
      !codexIntegrationDecision ||
      !integrationReadinessGate
    ) {
      return [];
    }

    return [
      {
        returnReview,
        integrationPlan,
        wrapperAdapterReview,
        fixtureReplayReport,
        eventReplayReport,
        audioCoverageReport,
        mobileAccessibilityReport,
        scoringReplayReport,
        codexIntegrationDecision,
        integrationReadinessGate,
      },
    ];
  });

export const sampleAiPrototypeEvidenceAlignmentErrors = sampleAiPrototypeEvidenceAlignmentBundles.flatMap(
  (bundle) => validateAiPrototypeEvidenceAlignment(bundle).map((error) => `${bundle.returnReview.requestId}: ${error}`),
);
