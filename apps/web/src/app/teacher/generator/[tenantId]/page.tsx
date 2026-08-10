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
  filterAiGeneratedPackageAssemblyReadinessByTenant,
  sampleAiGeneratedPackageAssemblyReadiness,
} from "@/data/sampleAiGeneratedPackageAssemblyReadiness";
import {
  filterAiGeneratedPackageAssemblyDryRunsByTenant,
  sampleAiGeneratedPackageAssemblyDryRuns,
} from "@/data/sampleAiGeneratedPackageAssemblyDryRun";
import {
  filterAiGeneratedPackageWriterPreflightsByTenant,
  sampleAiGeneratedPackageWriterPreflights,
} from "@/data/sampleAiGeneratedPackageWriterPreflight";
import {
  filterAiGeneratedPackageWriterRollbackDrillsByTenant,
  sampleAiGeneratedPackageWriterRollbackDrills,
} from "@/data/sampleAiGeneratedPackageWriterRollbackDrill";
import {
  filterAiGeneratedPackageWriterImplementationReadinessByTenant,
  sampleAiGeneratedPackageWriterImplementationReadiness,
} from "@/data/sampleAiGeneratedPackageWriterImplementationReadiness";
import {
  filterAiGeneratedPackageWriterModuleTestPlansByTenant,
  sampleAiGeneratedPackageWriterModuleTestPlans,
} from "@/data/sampleAiGeneratedPackageWriterModuleTestPlan";
import {
  filterAiGeneratedPackageWriterTestEvidencePacketsByTenant,
  sampleAiGeneratedPackageWriterTestEvidencePackets,
} from "@/data/sampleAiGeneratedPackageWriterTestEvidencePacket";
import {
  filterAiGeneratedPackageWriterTestHarnessPlansByTenant,
  sampleAiGeneratedPackageWriterTestHarnessPlans,
} from "@/data/sampleAiGeneratedPackageWriterTestHarnessPlan";
import {
  filterAiGeneratedPackageWriterTestHarnessImplementationProposalsByTenant,
  sampleAiGeneratedPackageWriterTestHarnessImplementationProposals,
} from "@/data/sampleAiGeneratedPackageWriterTestHarnessImplementationProposal";
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
  filterAiGeneratorReviewSummariesByTenant,
  sampleAiGeneratorReviewSummaries,
} from "@/data/sampleAiGeneratorReviewSummary";
import {
  filterAiGeneratorReviewerRunbooksByTenant,
  sampleAiGeneratorReviewerRunbooks,
} from "@/data/sampleAiGeneratorReviewerRunbook";
import {
  filterAiGeneratorResponsibilityMatricesByTenant,
  sampleAiGeneratorResponsibilityMatrices,
} from "@/data/sampleAiGeneratorResponsibilityMatrix";
import {
  filterAiGeneratorAudioCoveragePlansByTenant,
  sampleAiGeneratorAudioCoveragePlans,
} from "@/data/sampleAiGeneratorAudioCoveragePlan";
import {
  filterAiGeneratedGameBuildBriefPacketsByTenant,
  sampleAiGeneratedGameBuildBriefPackets,
} from "@/data/sampleAiGeneratedGameBuildBrief";
import {
  filterAiExternalPrototypeTaskPacketsByTenant,
  sampleAiExternalPrototypeTaskPackets,
} from "@/data/sampleAiExternalPrototypeTaskPacket";
import {
  filterAiExternalPrototypeTaskExportReadinessGatesByTenant,
  sampleAiExternalPrototypeTaskExportReadinessGates,
} from "@/data/sampleAiExternalPrototypeTaskExportReadinessGate";
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
  filterAiPrototypeScoringReplayReportsByTenant,
  sampleAiPrototypeScoringReplayReports,
} from "@/data/sampleAiPrototypeScoringReplayReport";
import {
  filterAiPrototypeIntegrationReadinessGatesByTenant,
  sampleAiPrototypeIntegrationReadinessGates,
} from "@/data/sampleAiPrototypeIntegrationReadinessGate";
import {
  filterAiPrototypeCodexIntegrationDecisionsByTenant,
  sampleAiPrototypeCodexIntegrationDecisions,
} from "@/data/sampleAiPrototypeCodexIntegrationDecision";
import {
  filterAiPrototypeAppPatchProposalsByTenant,
  sampleAiPrototypeAppPatchProposals,
} from "@/data/sampleAiPrototypeAppPatchProposal";
import {
  filterAiPrototypePatchTestReadinessGatesByTenant,
  sampleAiPrototypePatchTestReadinessGates,
} from "@/data/sampleAiPrototypePatchTestReadinessGate";
import {
  filterAiPrototypePatchTestHarnessPlansByTenant,
  sampleAiPrototypePatchTestHarnessPlans,
} from "@/data/sampleAiPrototypePatchTestHarnessPlan";
import {
  filterAiPrototypePatchHarnessImplementationProposalsByTenant,
  sampleAiPrototypePatchHarnessImplementationProposals,
} from "@/data/sampleAiPrototypePatchHarnessImplementationProposal";
import {
  filterAiPrototypeCodexPatchApprovalDecisionsByTenant,
  sampleAiPrototypeCodexPatchApprovalDecisions,
} from "@/data/sampleAiPrototypeCodexPatchApprovalDecision";
import {
  filterAiPrototypeSignedApprovalPreflightsByTenant,
  sampleAiPrototypeSignedApprovalPreflights,
} from "@/data/sampleAiPrototypeSignedApprovalPreflight";
import {
  filterAiPrototypePatchAuthorizationReleaseLocksByTenant,
  sampleAiPrototypePatchAuthorizationReleaseLocks,
} from "@/data/sampleAiPrototypePatchAuthorizationReleaseLock";
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
import { AiGeneratedPackageAssemblyReadinessPanel } from "@/features/content-intake/AiGeneratedPackageAssemblyReadinessPanel";
import { AiGeneratedPackageAssemblyDryRunPanel } from "@/features/content-intake/AiGeneratedPackageAssemblyDryRunPanel";
import { AiGeneratedPackageWriterPreflightPanel } from "@/features/content-intake/AiGeneratedPackageWriterPreflightPanel";
import { AiGeneratedPackageWriterRollbackDrillPanel } from "@/features/content-intake/AiGeneratedPackageWriterRollbackDrillPanel";
import { AiGeneratedPackageWriterImplementationReadinessPanel } from "@/features/content-intake/AiGeneratedPackageWriterImplementationReadinessPanel";
import { AiGeneratedPackageWriterModuleTestPlanPanel } from "@/features/content-intake/AiGeneratedPackageWriterModuleTestPlanPanel";
import { AiGeneratedPackageWriterTestEvidencePacketPanel } from "@/features/content-intake/AiGeneratedPackageWriterTestEvidencePacketPanel";
import { AiGeneratedPackageWriterTestHarnessPlanPanel } from "@/features/content-intake/AiGeneratedPackageWriterTestHarnessPlanPanel";
import { AiGeneratedPackageWriterTestHarnessImplementationProposalPanel } from "@/features/content-intake/AiGeneratedPackageWriterTestHarnessImplementationProposalPanel";
import { AiGeneratedPublishReadinessGatePanel } from "@/features/content-intake/AiGeneratedPublishReadinessGatePanel";
import { AiEngineBindingPlanPanel } from "@/features/content-intake/AiEngineBindingPlanPanel";
import { AiExternalPrototypeTaskExportReadinessGatePanel } from "@/features/content-intake/AiExternalPrototypeTaskExportReadinessGatePanel";
import { AiExternalPrototypeTaskPacketPanel } from "@/features/content-intake/AiExternalPrototypeTaskPacketPanel";
import { AiGeneratedGameBuildBriefPanel } from "@/features/content-intake/AiGeneratedGameBuildBriefPanel";
import { AiGeneratorSectionHeader, AiGeneratorSectionNav } from "@/features/content-intake/AiGeneratorSectionNav";
import { AiPrototypeReturnReviewPanel } from "@/features/content-intake/AiPrototypeReturnReviewPanel";
import { AiPrototypeIntegrationPlanPanel } from "@/features/content-intake/AiPrototypeIntegrationPlanPanel";
import { AiPrototypeWrapperAdapterReviewPanel } from "@/features/content-intake/AiPrototypeWrapperAdapterReviewPanel";
import { AiPrototypeFixtureReplayReportPanel } from "@/features/content-intake/AiPrototypeFixtureReplayReportPanel";
import { AiPrototypeEventReplayReportPanel } from "@/features/content-intake/AiPrototypeEventReplayReportPanel";
import { AiPrototypeAudioCoverageReportPanel } from "@/features/content-intake/AiPrototypeAudioCoverageReportPanel";
import { AiPrototypeMobileAccessibilityReportPanel } from "@/features/content-intake/AiPrototypeMobileAccessibilityReportPanel";
import { AiPrototypeScoringReplayReportPanel } from "@/features/content-intake/AiPrototypeScoringReplayReportPanel";
import { AiPrototypeCodexIntegrationDecisionPanel } from "@/features/content-intake/AiPrototypeCodexIntegrationDecisionPanel";
import { AiPrototypeIntegrationReadinessGatePanel } from "@/features/content-intake/AiPrototypeIntegrationReadinessGatePanel";
import { AiPrototypeAppPatchProposalPanel } from "@/features/content-intake/AiPrototypeAppPatchProposalPanel";
import { AiPrototypePatchTestReadinessGatePanel } from "@/features/content-intake/AiPrototypePatchTestReadinessGatePanel";
import { AiPrototypePatchTestHarnessPlanPanel } from "@/features/content-intake/AiPrototypePatchTestHarnessPlanPanel";
import { AiPrototypePatchHarnessImplementationProposalPanel } from "@/features/content-intake/AiPrototypePatchHarnessImplementationProposalPanel";
import { AiPrototypeCodexPatchApprovalDecisionPanel } from "@/features/content-intake/AiPrototypeCodexPatchApprovalDecisionPanel";
import { AiPrototypeSignedApprovalPreflightPanel } from "@/features/content-intake/AiPrototypeSignedApprovalPreflightPanel";
import { AiPrototypePatchAuthorizationReleaseLockPanel } from "@/features/content-intake/AiPrototypePatchAuthorizationReleaseLockPanel";
import { AiGamificationMappingPanel } from "@/features/content-intake/AiGamificationMappingPanel";
import { AiGeneratorAudioCoveragePlanPanel } from "@/features/content-intake/AiGeneratorAudioCoveragePlanPanel";
import { AiGameGeneratorPlanPanel } from "@/features/content-intake/AiGameGeneratorPlanPanel";
import { AiGeneratorLineageMapPanel } from "@/features/content-intake/AiGeneratorLineageMapPanel";
import { AiGeneratorReviewSummaryPanel } from "@/features/content-intake/AiGeneratorReviewSummaryPanel";
import { AiGeneratorReviewerRunbookPanel } from "@/features/content-intake/AiGeneratorReviewerRunbookPanel";
import { AiGeneratorResponsibilityMatrixPanel } from "@/features/content-intake/AiGeneratorResponsibilityMatrixPanel";
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
        <AiGeneratorSectionNav />
        <AiGeneratorReviewSummaryPanel
          summaries={filterAiGeneratorReviewSummariesByTenant(sampleAiGeneratorReviewSummaries, tenantId)}
        />
        <AiGeneratorReviewerRunbookPanel
          runbooks={filterAiGeneratorReviewerRunbooksByTenant(sampleAiGeneratorReviewerRunbooks, tenantId)}
        />
        <AiGeneratorResponsibilityMatrixPanel
          matrices={filterAiGeneratorResponsibilityMatricesByTenant(sampleAiGeneratorResponsibilityMatrices, tenantId)}
        />
        <section id="generator-request" className="grid scroll-mt-6 gap-5">
          <AiGeneratorSectionHeader
            eyebrow="Generator section"
            title="Request setup"
            summary="Review prompt, cost, request, audio, gamification, rewards, and engine binding before any live model call exists."
            status="review-only"
          />
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
        </section>
        <section id="prototype-review" className="grid scroll-mt-6 gap-5">
          <AiGeneratorSectionHeader
            eyebrow="Generator section"
            title="Prototype review"
            summary="Check outside prototype briefs and returned evidence for wrapper, fixture, event, audio, mobile, and scoring discipline."
            status="review-only"
          />
        <AiGeneratedGameBuildBriefPanel
          packets={filterAiGeneratedGameBuildBriefPacketsByTenant(sampleAiGeneratedGameBuildBriefPackets, tenantId)}
        />
        <AiExternalPrototypeTaskPacketPanel
          packets={filterAiExternalPrototypeTaskPacketsByTenant(sampleAiExternalPrototypeTaskPackets, tenantId)}
        />
        <AiExternalPrototypeTaskExportReadinessGatePanel
          gates={filterAiExternalPrototypeTaskExportReadinessGatesByTenant(
            sampleAiExternalPrototypeTaskExportReadinessGates,
            tenantId,
          )}
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
        <AiPrototypeScoringReplayReportPanel
          reports={filterAiPrototypeScoringReplayReportsByTenant(sampleAiPrototypeScoringReplayReports, tenantId)}
        />
        </section>
        <section id="integration-gates" className="grid scroll-mt-6 gap-5">
          <AiGeneratorSectionHeader
            eyebrow="Generator section"
            title="Integration gates"
            summary="Keep Codex decision, all-evidence readiness, and app patch proposal planning blocked until every review gate is satisfied."
            status="blocked"
          />
        <AiPrototypeCodexIntegrationDecisionPanel
          decisions={filterAiPrototypeCodexIntegrationDecisionsByTenant(
            sampleAiPrototypeCodexIntegrationDecisions,
            tenantId,
          )}
        />
        <AiPrototypeIntegrationReadinessGatePanel
          gates={filterAiPrototypeIntegrationReadinessGatesByTenant(
            sampleAiPrototypeIntegrationReadinessGates,
            tenantId,
          )}
        />
        <AiPrototypeAppPatchProposalPanel
          proposals={filterAiPrototypeAppPatchProposalsByTenant(sampleAiPrototypeAppPatchProposals, tenantId)}
        />
        <AiPrototypePatchTestReadinessGatePanel
          gates={filterAiPrototypePatchTestReadinessGatesByTenant(
            sampleAiPrototypePatchTestReadinessGates,
            tenantId,
          )}
        />
        <AiPrototypePatchTestHarnessPlanPanel
          plans={filterAiPrototypePatchTestHarnessPlansByTenant(sampleAiPrototypePatchTestHarnessPlans, tenantId)}
        />
        <AiPrototypePatchHarnessImplementationProposalPanel
          proposals={filterAiPrototypePatchHarnessImplementationProposalsByTenant(
            sampleAiPrototypePatchHarnessImplementationProposals,
            tenantId,
          )}
        />
        <AiPrototypeCodexPatchApprovalDecisionPanel
          decisions={filterAiPrototypeCodexPatchApprovalDecisionsByTenant(
            sampleAiPrototypeCodexPatchApprovalDecisions,
            tenantId,
          )}
        />
        <AiPrototypeSignedApprovalPreflightPanel
          preflights={filterAiPrototypeSignedApprovalPreflightsByTenant(
            sampleAiPrototypeSignedApprovalPreflights,
            tenantId,
          )}
        />
        <AiPrototypePatchAuthorizationReleaseLockPanel
          locks={filterAiPrototypePatchAuthorizationReleaseLocksByTenant(
            sampleAiPrototypePatchAuthorizationReleaseLocks,
            tenantId,
          )}
        />
        </section>
        <section id="package-review" className="grid scroll-mt-6 gap-5">
          <AiGeneratorSectionHeader
            eyebrow="Generator section"
            title="Package review"
            summary="Review verifier packets, curated modes, manifests, promotion, publish readiness, and release candidates before student routes."
            status="blocked"
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
        <AiGeneratedPackageAssemblyReadinessPanel
          readiness={filterAiGeneratedPackageAssemblyReadinessByTenant(
            sampleAiGeneratedPackageAssemblyReadiness,
            tenantId,
          )}
        />
        <AiGeneratedPackageAssemblyDryRunPanel
          dryRuns={filterAiGeneratedPackageAssemblyDryRunsByTenant(sampleAiGeneratedPackageAssemblyDryRuns, tenantId)}
        />
        <AiGeneratedPackageWriterPreflightPanel
          preflights={filterAiGeneratedPackageWriterPreflightsByTenant(
            sampleAiGeneratedPackageWriterPreflights,
            tenantId,
          )}
        />
        <AiGeneratedPackageWriterRollbackDrillPanel
          drills={filterAiGeneratedPackageWriterRollbackDrillsByTenant(
            sampleAiGeneratedPackageWriterRollbackDrills,
            tenantId,
          )}
        />
        <AiGeneratedPackageWriterImplementationReadinessPanel
          readiness={filterAiGeneratedPackageWriterImplementationReadinessByTenant(
            sampleAiGeneratedPackageWriterImplementationReadiness,
            tenantId,
          )}
        />
        <AiGeneratedPackageWriterModuleTestPlanPanel
          plans={filterAiGeneratedPackageWriterModuleTestPlansByTenant(
            sampleAiGeneratedPackageWriterModuleTestPlans,
            tenantId,
          )}
        />
        <AiGeneratedPackageWriterTestEvidencePacketPanel
          packets={filterAiGeneratedPackageWriterTestEvidencePacketsByTenant(
            sampleAiGeneratedPackageWriterTestEvidencePackets,
            tenantId,
          )}
        />
        <AiGeneratedPackageWriterTestHarnessPlanPanel
          plans={filterAiGeneratedPackageWriterTestHarnessPlansByTenant(
            sampleAiGeneratedPackageWriterTestHarnessPlans,
            tenantId,
          )}
        />
        <AiGeneratedPackageWriterTestHarnessImplementationProposalPanel
          proposals={filterAiGeneratedPackageWriterTestHarnessImplementationProposalsByTenant(
            sampleAiGeneratedPackageWriterTestHarnessImplementationProposals,
            tenantId,
          )}
        />
        </section>
        <section id="draft-repair" className="grid scroll-mt-6 gap-5">
          <AiGeneratorSectionHeader
            eyebrow="Generator section"
            title="Draft repair"
            summary="Use draft JSON preview and correction queues to repair schema, audio, and progress issues before review."
            status="blocked"
          />
        <AiGeneratedDraftPayloadPreviewPanel
          previews={filterAiGeneratedDraftPayloadPreviewsByTenant(sampleAiGeneratedDraftPayloadPreviews, tenantId)}
        />
        <AiDraftCorrectionQueuePanel
          queues={filterAiDraftCorrectionQueuesByTenant(sampleAiDraftCorrectionQueues, tenantId)}
        />
        </section>
      </div>
    </AppShell>
  );
}
