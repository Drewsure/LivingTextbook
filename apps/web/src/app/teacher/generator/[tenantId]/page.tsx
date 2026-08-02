import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { filterAiDraftCorrectionQueuesByTenant, sampleAiDraftCorrectionQueues } from "@/data/sampleAiDraftCorrectionQueue";
import {
  filterAiGeneratedDraftPayloadPreviewsByTenant,
  sampleAiGeneratedDraftPayloadPreviews,
} from "@/data/sampleAiGeneratedDraftPayloadPreview";
import {
  filterAiGeneratedPackageManifestsByTenant,
  sampleAiGeneratedPackageManifests,
} from "@/data/sampleAiGeneratedPackageManifest";
import {
  filterAiGeneratedPackagePromotionChecklistsByTenant,
  sampleAiGeneratedPackagePromotionChecklists,
} from "@/data/sampleAiGeneratedPackagePromotionChecklist";
import {
  filterAiGeneratedPackageReleaseCandidatesByTenant,
  sampleAiGeneratedPackageReleaseCandidates,
} from "@/data/sampleAiGeneratedPackageReleaseCandidate";
import {
  filterAiGeneratedPublishReadinessGatesByTenant,
  sampleAiGeneratedPublishReadinessGates,
} from "@/data/sampleAiGeneratedPublishReadinessGate";
import { filterAiEngineBindingPlansByTenant, sampleAiEngineBindingPlans } from "@/data/sampleAiEngineBindingPlan";
import {
  filterAiGenerationRequestBuildersByTenant,
  sampleAiGenerationRequestBuilders,
} from "@/data/sampleAiGenerationRequestBuilder";
import {
  filterAiGeneratorCostEntitlementGatesByTenant,
  sampleAiGeneratorCostEntitlementGates,
} from "@/data/sampleAiGeneratorCostEntitlementGate";
import { sampleAiGameGeneratorPlan } from "@/data/sampleAiGameGeneratorPlan";
import {
  filterAiGeneratorTenantCoverageByTenant,
  sampleAiGeneratorTenantCoverage,
} from "@/data/sampleAiGeneratorTenantCoverage";
import { filterAiGeneratorLineageMapsByTenant, sampleAiGeneratorLineageMaps } from "@/data/sampleAiGeneratorLineageMap";
import {
  filterAiGeneratorAudioCoveragePlansByTenant,
  sampleAiGeneratorAudioCoveragePlans,
} from "@/data/sampleAiGeneratorAudioCoveragePlan";
import {
  filterAiGeneratedGameBuildBriefPacketsByTenant,
  sampleAiGeneratedGameBuildBriefPackets,
} from "@/data/sampleAiGeneratedGameBuildBrief";
import {
  filterAiPrototypeReturnReviewPacketsByTenant,
  sampleAiPrototypeReturnReviewPackets,
} from "@/data/sampleAiPrototypeReturnReview";
import {
  filterAiPrototypeIntegrationPlansByTenant,
  sampleAiPrototypeIntegrationPlans,
} from "@/data/sampleAiPrototypeIntegrationPlan";
import {
  filterAiPrototypeWrapperAdapterReviewsByTenant,
  sampleAiPrototypeWrapperAdapterReviews,
} from "@/data/sampleAiPrototypeWrapperAdapterReview";
import {
  filterAiPrototypeFixtureReplayReportsByTenant,
  sampleAiPrototypeFixtureReplayReports,
} from "@/data/sampleAiPrototypeFixtureReplayReport";
import {
  filterAiPrototypeEventReplayReportsByTenant,
  sampleAiPrototypeEventReplayReports,
} from "@/data/sampleAiPrototypeEventReplayReport";
import {
  filterAiPrototypeAudioCoverageReportsByTenant,
  sampleAiPrototypeAudioCoverageReports,
} from "@/data/sampleAiPrototypeAudioCoverageReport";
import {
  filterAiPrototypeMobileAccessibilityReportsByTenant,
  sampleAiPrototypeMobileAccessibilityReports,
} from "@/data/sampleAiPrototypeMobileAccessibilityReport";
import {
  filterAiGamificationMappingPlansByTenant,
  sampleAiGamificationMappingPlans,
} from "@/data/sampleAiGamificationMappingPlan";
import { filterAiRewardReadinessGatesByTenant, sampleAiRewardReadinessGates } from "@/data/sampleAiRewardReadinessGate";
import { filterAiPromptPackagePlansByTenant, sampleAiPromptPackagePlans } from "@/data/sampleAiPromptPackagePlan";
import {
  filterAiVerifierSubmissionPacketsByTenant,
  sampleAiVerifierSubmissionPackets,
} from "@/data/sampleAiVerifierSubmissionPacket";
import { sampleActivityPathwayCompatibilityMatrix } from "@/data/sampleActivityPathwayCompatibility";
import { AiDraftCorrectionQueuePanel } from "@/features/content-intake/AiDraftCorrectionQueuePanel";
import { AiGenerationRequestBuilderPanel } from "@/features/content-intake/AiGenerationRequestBuilderPanel";
import { AiGeneratorCostEntitlementGatePanel } from "@/features/content-intake/AiGeneratorCostEntitlementGatePanel";
import { AiGeneratedDraftPayloadPreviewPanel } from "@/features/content-intake/AiGeneratedDraftPayloadPreviewPanel";
import { AiGeneratedPackageManifestPanel } from "@/features/content-intake/AiGeneratedPackageManifestPanel";
import { AiGeneratedPackagePromotionChecklistPanel } from "@/features/content-intake/AiGeneratedPackagePromotionChecklistPanel";
import { AiGeneratedPackageReleaseCandidatePanel } from "@/features/content-intake/AiGeneratedPackageReleaseCandidatePanel";
import { AiGeneratedPublishReadinessGatePanel } from "@/features/content-intake/AiGeneratedPublishReadinessGatePanel";
import { AiEngineBindingPlanPanel } from "@/features/content-intake/AiEngineBindingPlanPanel";
import { AiGeneratedGameBuildBriefPanel } from "@/features/content-intake/AiGeneratedGameBuildBriefPanel";
import { AiPrototypeReturnReviewPanel } from "@/features/content-intake/AiPrototypeReturnReviewPanel";
import { AiPrototypeIntegrationPlanPanel } from "@/features/content-intake/AiPrototypeIntegrationPlanPanel";
import { AiPrototypeWrapperAdapterReviewPanel } from "@/features/content-intake/AiPrototypeWrapperAdapterReviewPanel";
import { AiPrototypeFixtureReplayReportPanel } from "@/features/content-intake/AiPrototypeFixtureReplayReportPanel";
import { AiPrototypeEventReplayReportPanel } from "@/features/content-intake/AiPrototypeEventReplayReportPanel";
import { AiPrototypeAudioCoverageReportPanel } from "@/features/content-intake/AiPrototypeAudioCoverageReportPanel";
import { AiPrototypeMobileAccessibilityReportPanel } from "@/features/content-intake/AiPrototypeMobileAccessibilityReportPanel";
import { AiGamificationMappingPanel } from "@/features/content-intake/AiGamificationMappingPanel";
import { AiGeneratorAudioCoveragePlanPanel } from "@/features/content-intake/AiGeneratorAudioCoveragePlanPanel";
import { AiGameGeneratorPlanPanel } from "@/features/content-intake/AiGameGeneratorPlanPanel";
import { AiGeneratorLineageMapPanel } from "@/features/content-intake/AiGeneratorLineageMapPanel";
import { AiGeneratorTenantCoveragePanel } from "@/features/content-intake/AiGeneratorTenantCoveragePanel";
import { AiModeRecommendationPanel } from "@/features/content-intake/AiModeRecommendationPanel";
import { AiPromptPackagePlanPanel } from "@/features/content-intake/AiPromptPackagePlanPanel";
import { AiRewardReadinessGatePanel } from "@/features/content-intake/AiRewardReadinessGatePanel";
import { AiVerifierSubmissionPacketPanel } from "@/features/content-intake/AiVerifierSubmissionPacketPanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherAiGameGeneratorPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant =
    tenantId === samplePublisherTenant.id ? samplePublisherTenant : tenantId === ministarTenant.id ? ministarTenant : null;

  if (!tenant) {
    notFound();
  }

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <AiGameGeneratorPlanPanel plan={sampleAiGameGeneratorPlan} tenantId={tenantId} />
        <AiGeneratorTenantCoveragePanel
          coverages={filterAiGeneratorTenantCoverageByTenant(sampleAiGeneratorTenantCoverage, tenantId)}
        />
        <AiGeneratorLineageMapPanel maps={filterAiGeneratorLineageMapsByTenant(sampleAiGeneratorLineageMaps, tenantId)} />
        <AiPromptPackagePlanPanel plans={filterAiPromptPackagePlansByTenant(sampleAiPromptPackagePlans, tenantId)} />
        <AiGeneratorCostEntitlementGatePanel
          gates={filterAiGeneratorCostEntitlementGatesByTenant(sampleAiGeneratorCostEntitlementGates, tenantId)}
        />
        <AiGenerationRequestBuilderPanel
          builders={filterAiGenerationRequestBuildersByTenant(sampleAiGenerationRequestBuilders, tenantId)}
        />
        <AiGeneratorAudioCoveragePlanPanel
          plans={filterAiGeneratorAudioCoveragePlansByTenant(sampleAiGeneratorAudioCoveragePlans, tenantId)}
        />
        <AiGamificationMappingPanel
          plans={filterAiGamificationMappingPlansByTenant(sampleAiGamificationMappingPlans, tenantId)}
        />
        <AiRewardReadinessGatePanel
          gates={filterAiRewardReadinessGatesByTenant(sampleAiRewardReadinessGates, tenantId)}
        />
        <AiEngineBindingPlanPanel plans={filterAiEngineBindingPlansByTenant(sampleAiEngineBindingPlans, tenantId)} />
        <AiGeneratedGameBuildBriefPanel
          packets={filterAiGeneratedGameBuildBriefPacketsByTenant(sampleAiGeneratedGameBuildBriefPackets, tenantId)}
        />
        <AiPrototypeReturnReviewPanel
          packets={filterAiPrototypeReturnReviewPacketsByTenant(sampleAiPrototypeReturnReviewPackets, tenantId)}
        />
        <AiPrototypeIntegrationPlanPanel
          plans={filterAiPrototypeIntegrationPlansByTenant(sampleAiPrototypeIntegrationPlans, tenantId)}
        />
        <AiPrototypeWrapperAdapterReviewPanel
          reviews={filterAiPrototypeWrapperAdapterReviewsByTenant(sampleAiPrototypeWrapperAdapterReviews, tenantId)}
        />
        <AiPrototypeFixtureReplayReportPanel
          reports={filterAiPrototypeFixtureReplayReportsByTenant(sampleAiPrototypeFixtureReplayReports, tenantId)}
        />
        <AiPrototypeEventReplayReportPanel
          reports={filterAiPrototypeEventReplayReportsByTenant(sampleAiPrototypeEventReplayReports, tenantId)}
        />
        <AiPrototypeAudioCoverageReportPanel
          reports={filterAiPrototypeAudioCoverageReportsByTenant(sampleAiPrototypeAudioCoverageReports, tenantId)}
        />
        <AiPrototypeMobileAccessibilityReportPanel
          reports={filterAiPrototypeMobileAccessibilityReportsByTenant(
            sampleAiPrototypeMobileAccessibilityReports,
            tenantId,
          )}
        />
        <AiVerifierSubmissionPacketPanel
          packets={filterAiVerifierSubmissionPacketsByTenant(sampleAiVerifierSubmissionPackets, tenantId)}
        />
        <AiModeRecommendationPanel matrix={sampleActivityPathwayCompatibilityMatrix} />
        <AiGeneratedPackageManifestPanel
          manifests={filterAiGeneratedPackageManifestsByTenant(sampleAiGeneratedPackageManifests, tenantId)}
        />
        <AiGeneratedPackagePromotionChecklistPanel
          checklists={filterAiGeneratedPackagePromotionChecklistsByTenant(
            sampleAiGeneratedPackagePromotionChecklists,
            tenantId,
          )}
        />
        <AiGeneratedPublishReadinessGatePanel
          gates={filterAiGeneratedPublishReadinessGatesByTenant(sampleAiGeneratedPublishReadinessGates, tenantId)}
        />
        <AiGeneratedPackageReleaseCandidatePanel
          candidates={filterAiGeneratedPackageReleaseCandidatesByTenant(
            sampleAiGeneratedPackageReleaseCandidates,
            tenantId,
          )}
        />
        <AiGeneratedDraftPayloadPreviewPanel
          previews={filterAiGeneratedDraftPayloadPreviewsByTenant(sampleAiGeneratedDraftPayloadPreviews, tenantId)}
        />
        <AiDraftCorrectionQueuePanel
          queues={filterAiDraftCorrectionQueuesByTenant(sampleAiDraftCorrectionQueues, tenantId)}
        />
      </div>
    </AppShell>
  );
}
