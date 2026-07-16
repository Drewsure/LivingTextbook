import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleBackendDecisionMatrix } from "@/data/sampleBackendDecisionMatrix";
import { sampleBackendMigrationPlan } from "@/data/sampleBackendMigrationCandidates";
import { sampleBackendMigrationSpecPlan } from "@/data/sampleBackendMigrationSpecs";
import { sampleBackendSchemaDraft } from "@/data/sampleBackendSchemaDraft";
import { samplePilotBackendSelectionGate } from "@/data/samplePilotBackendSelectionGate";
import { samplePrintableOutputPlan } from "@/data/samplePrintableOutputPlan";
import { sampleActiveRouteMatrix } from "@/data/sampleActiveRouteMatrix";
import { sampleAuthoringVerifierPlan } from "@/data/sampleAuthoringVerifierPlan";
import { sampleTeacherAuthoringReadinessPlan } from "@/data/sampleTeacherAuthoringReadiness";
import { sampleContentEntryOptionScaffold } from "@/data/sampleContentEntryOptionScaffold";
import { sampleTemplateRenderingFontProfilePlan } from "@/data/sampleTemplateRenderingFontProfiles";
import { sampleLabelledDiagramAssetReadinessPlan } from "@/data/sampleLabelledDiagramAssetReadiness";
import { sampleMultimediaAssetReadinessPlan } from "@/data/sampleMultimediaAssetReadiness";
import { sampleUploadChannelReadinessPlan } from "@/data/sampleUploadChannelReadiness";
import { sampleUploadPromotionReadinessPlan } from "@/data/sampleUploadPromotionReadiness";
import { sampleUploadReviewQueue } from "@/data/sampleUploadReviewQueue";
import { sampleTargetLanguageExpansionPlan } from "@/data/sampleTargetLanguageExpansionPlan";
import {
  sampleClassRosterErrors,
  sampleClassRosterPlans,
  sampleClassRosterWarnings,
} from "@/data/sampleClassRosterPlans";
import { sampleContentIntakeRuns, samplePackageReleases } from "@/data/sampleContentIntakePlan";
import { sampleDeploymentProfiles } from "@/data/sampleDeploymentProfiles";
import { sampleEditionQrAliasPlan } from "@/data/sampleEditionQrAliasPlan";
import { sampleEvidenceAttachmentStorageReadinessPlan } from "@/data/sampleEvidenceAttachmentStorageReadiness";
import { sampleEvidenceExportReadinessPlan } from "@/data/sampleEvidenceExportReadiness";
import { sampleEvidenceStorageAdapterSelectionGate } from "@/data/sampleEvidenceStorageAdapterSelectionGate";
import { sampleGameBackgroundMediaPolicy } from "@/data/sampleGameBackgroundMediaPolicy";
import { sampleGamePrototypeAssignmentPlan } from "@/data/sampleGamePrototypeAssignmentPlan";
import { sampleFoundationVerificationGate } from "@/data/sampleFoundationVerificationGate";
import { sampleCompetitiveFeatureCoverageMatrix } from "@/data/sampleCompetitiveFeatureCoverage";
import { sampleLocalBundleManifests } from "@/data/sampleLocalBundlePlan";
import { sampleLocalDeploymentPreflightPlan } from "@/data/sampleLocalDeploymentPreflight";
import { sampleMediaRightsPlan } from "@/data/sampleMediaRightsPlan";
import { samplePackageApprovalLedger } from "@/data/samplePackageApprovalLedger";
import { samplePackagePublishGate } from "@/data/samplePackagePublishGate";
import { samplePilotEvidencePacket } from "@/data/samplePilotEvidencePacket";
import { samplePilotHandoffPackage } from "@/data/samplePilotHandoffPackage";
import { samplePilotLaunchChecklist } from "@/data/samplePilotLaunchChecklist";
import { samplePilotReadinessSummary } from "@/data/samplePilotReadinessSummary";
import { samplePilotSourceStrategy } from "@/data/samplePilotSourceStrategy";
import { sampleClassroomLaunchGate } from "@/data/sampleClassroomLaunchGate";
import { sampleSchoolLaunchPolicyGate } from "@/data/sampleSchoolLaunchPolicyGate";
import { sampleSchoolPolicyAcceptancePreflight } from "@/data/sampleSchoolPolicyAcceptancePreflight";
import { sampleSchoolPolicyAcceptanceRecordPreview } from "@/data/sampleSchoolPolicyAcceptanceRecordPreview";
import { sampleSchoolPolicyHandoffPacket } from "@/data/sampleSchoolPolicyHandoffPacket";
import { sampleSchoolPolicyRollbackImpactMatrix } from "@/data/sampleSchoolPolicyRollbackImpactMatrix";
import { sampleSchoolPolicyRevocationRollbackPlan } from "@/data/sampleSchoolPolicyRevocationRollbackPlan";
import { sampleSchoolPolicyTextPack } from "@/data/sampleSchoolPolicyTextPack";
import { sampleSchoolRollbackSafeFallbackPreflight } from "@/data/sampleSchoolRollbackSafeFallbackPreflight";
import { sampleSchoolRollbackSafeFallbackPlan } from "@/data/sampleSchoolRollbackSafeFallbackPlan";
import { sampleTeacherDryRunRehearsal } from "@/data/sampleTeacherDryRunRehearsal";
import { sampleProgressEventTaxonomyRegistry } from "@/data/sampleProgressEventTaxonomy";
import {
  samplePersistenceAdapterErrors,
  samplePersistenceAdapterPlans,
  samplePersistenceAdapterWarnings,
} from "@/data/samplePersistenceAdapterPlan";
import {
  samplePilotPolicyErrors,
  samplePilotPolicyPlans,
  samplePilotPolicyWarnings,
} from "@/data/samplePilotPolicyPlan";
import { samplePublisherMaintenancePlan } from "@/data/samplePublisherMaintenancePlan";
import { sampleShareEmbedReadinessPlan } from "@/data/sampleShareEmbedReadinessPlan";
import { sampleTenantLibraryPlan } from "@/data/sampleTenantLibraryPlan";
import { sampleQrPrintReadinessRecords } from "@/data/sampleQrPrintReadiness";
import { sampleSourceReviewQueue } from "@/data/sampleSourceReviewQueue";
import { sampleFrontDoorRouteRegistry } from "@/data/sampleTenantRouteRegistry";
import {
  sampleTeacherAssignmentErrors,
  sampleTeacherAssignmentPlans,
  sampleTeacherAssignmentWarnings,
} from "@/data/sampleTeacherAssignmentPlans";
import { sampleAssignmentRolloutPlans } from "@/data/sampleAssignmentRolloutPlan";
import { sampleActivityPathwayCompatibilityMatrix } from "@/data/sampleActivityPathwayCompatibility";
import { sampleUnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import { sampleUnitPackageReadiness } from "@/data/sampleUnitPackageReadiness";
import { whiteLabelPilotReadiness } from "@/data/whiteLabelPilotReadiness";
import {
  sampleDurableRecordContracts,
  sampleDurableRecordErrors,
  sampleDurableRecordWarnings,
  samplePersistenceBoundaries,
  samplePersistenceStrategyOptions,
} from "@/data/samplePersistencePlan";
import { ContentIntakeReviewPanel } from "@/features/content-intake/ContentIntakeReviewPanel";
import { AuthoringVerifierPlanPanel } from "@/features/content-intake/AuthoringVerifierPlanPanel";
import { ContentEntryOptionScaffoldPanel } from "@/features/content-intake/ContentEntryOptionScaffoldPanel";
import { LabelledDiagramAssetReadinessPanel } from "@/features/content-intake/LabelledDiagramAssetReadinessPanel";
import { MultimediaAssetReadinessPanel } from "@/features/content-intake/MultimediaAssetReadinessPanel";
import { PilotSourceStrategyPanel } from "@/features/content-intake/PilotSourceStrategyPanel";
import { PrintableOutputReadinessPanel } from "@/features/content-intake/PrintableOutputReadinessPanel";
import { SourceReviewQueuePanel } from "@/features/content-intake/SourceReviewQueuePanel";
import { TeacherAuthoringReadinessPanel } from "@/features/content-intake/TeacherAuthoringReadinessPanel";
import { TemplateRenderingFontProfilePanel } from "@/features/content-intake/TemplateRenderingFontProfilePanel";
import { UploadChannelReadinessPanel } from "@/features/content-intake/UploadChannelReadinessPanel";
import { UploadPromotionReadinessPanel } from "@/features/content-intake/UploadPromotionReadinessPanel";
import { UploadReviewQueuePanel } from "@/features/content-intake/UploadReviewQueuePanel";
import { UnitPackageReadinessPanel } from "@/features/content-intake/UnitPackageReadinessPanel";
import { DeploymentProfilePanel } from "@/features/deployment/DeploymentProfilePanel";
import { LocalDeploymentPreflightPanel } from "@/features/deployment/LocalDeploymentPreflightPanel";
import { LocalBundleManifestPanel } from "@/features/deployment/LocalBundleManifestPanel";
import { ActivityPathwayCompatibilityPanel } from "@/features/game-offers/ActivityPathwayCompatibilityPanel";
import { GamePrototypeAssignmentPanel } from "@/features/game-offers/GamePrototypeAssignmentPanel";
import { UnitGameOfferMapPanel } from "@/features/game-offers/UnitGameOfferMapPanel";
import { TargetLanguageExpansionPanel } from "@/features/language/TargetLanguageExpansionPanel";
import { GameBackgroundMediaPolicyPanel } from "@/features/multimedia/GameBackgroundMediaPolicyPanel";
import { CompetitiveFeatureCoveragePanel } from "@/features/policy/CompetitiveFeatureCoveragePanel";
import { FoundationVerificationGatePanel } from "@/features/policy/FoundationVerificationGatePanel";
import { MediaRightsReadinessPanel } from "@/features/multimedia/MediaRightsReadinessPanel";
import { PilotPolicyReadinessPanel } from "@/features/policy/PilotPolicyReadinessPanel";
import { PackageApprovalLedgerPanel } from "@/features/pilot/PackageApprovalLedgerPanel";
import { PackagePublishGatePanel } from "@/features/pilot/PackagePublishGatePanel";
import { PilotEvidencePacketPanel } from "@/features/pilot/PilotEvidencePacketPanel";
import { PilotHandoffPackagePanel } from "@/features/pilot/PilotHandoffPackagePanel";
import { PilotLaunchChecklistPanel } from "@/features/pilot/PilotLaunchChecklistPanel";
import { PilotReadinessGatePanel } from "@/features/pilot/PilotReadinessGatePanel";
import { PilotReleaseCandidatePanel } from "@/features/pilot/PilotReleaseCandidatePanel";
import { PilotReadinessSummaryPanel } from "@/features/pilot/PilotReadinessSummaryPanel";
import { ClassroomLaunchGatePanel } from "@/features/pilot/ClassroomLaunchGatePanel";
import { SchoolPolicyAcceptanceRecordPreviewPanel } from "@/features/pilot/SchoolPolicyAcceptanceRecordPreviewPanel";
import { SchoolPolicyAcceptancePreflightPanel } from "@/features/pilot/SchoolPolicyAcceptancePreflightPanel";
import { SchoolLaunchPolicyGatePanel } from "@/features/pilot/SchoolLaunchPolicyGatePanel";
import { SchoolPolicyHandoffPacketPanel } from "@/features/pilot/SchoolPolicyHandoffPacketPanel";
import { SchoolPolicyRollbackImpactMatrixPanel } from "@/features/pilot/SchoolPolicyRollbackImpactMatrixPanel";
import { SchoolPolicyRevocationRollbackPanel } from "@/features/pilot/SchoolPolicyRevocationRollbackPanel";
import { SchoolPolicyTextPackPanel } from "@/features/pilot/SchoolPolicyTextPackPanel";
import { SchoolRollbackSafeFallbackPreflightPanel } from "@/features/pilot/SchoolRollbackSafeFallbackPreflightPanel";
import { SchoolRollbackSafeFallbackPanel } from "@/features/pilot/SchoolRollbackSafeFallbackPanel";
import { TeacherDryRunRehearsalPanel } from "@/features/pilot/TeacherDryRunRehearsalPanel";
import { EvidenceExportReadinessPanel } from "@/features/evidence/EvidenceExportReadinessPanel";
import { EvidenceAttachmentStorageReadinessPanel } from "@/features/evidence/EvidenceAttachmentStorageReadinessPanel";
import { EvidenceStorageAdapterSelectionGatePanel } from "@/features/evidence/EvidenceStorageAdapterSelectionGatePanel";
import { BackendDecisionMatrixPanel } from "@/features/persistence/BackendDecisionMatrixPanel";
import { BackendMigrationPlanPanel } from "@/features/persistence/BackendMigrationPlanPanel";
import { BackendMigrationSpecPanel } from "@/features/persistence/BackendMigrationSpecPanel";
import { BackendSchemaDraftPanel } from "@/features/persistence/BackendSchemaDraftPanel";
import { PilotBackendSelectionGatePanel } from "@/features/persistence/PilotBackendSelectionGatePanel";
import { PersistenceAdapterReadinessPanel } from "@/features/persistence/PersistenceAdapterReadinessPanel";
import { PersistenceBoundaryPanel } from "@/features/persistence/PersistenceBoundaryPanel";
import { ProgressEventTaxonomyPanel } from "@/features/progression/ProgressEventTaxonomyPanel";
import { PublisherMaintenancePlanPanel } from "@/features/publisher/PublisherMaintenancePlanPanel";
import { TenantLibraryPlanPanel } from "@/features/publisher/TenantLibraryPlanPanel";
import { EditionQrAliasPanel } from "@/features/routes/EditionQrAliasPanel";
import { ActiveRouteMatrixPanel } from "@/features/routes/ActiveRouteMatrixPanel";
import { QrPrintReadinessPanel } from "@/features/routes/QrPrintReadinessPanel";
import { ShareEmbedReadinessPanel } from "@/features/routes/ShareEmbedReadinessPanel";
import { TenantRouteRegistryPanel } from "@/features/routes/TenantRouteRegistryPanel";
import { ClassRosterReadinessPanel } from "@/features/teacher/ClassRosterReadinessPanel";
import { TeacherAssignmentRolloutPanel } from "@/features/teacher/TeacherAssignmentRolloutPanel";
import { TeacherAssignmentReadinessPanel } from "@/features/teacher/TeacherAssignmentReadinessPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default function TeacherIntakePage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher/admin review</p>
              <h2 className="mt-1 text-2xl font-bold">Content, routes, deployment, and persistence</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                This scaffold shows how a textbook or school partner moves from source files to a reviewed, audio-supported, route-ready Living Textbook package. It is intentionally review-first: no raw PDF or AI draft becomes student-facing automatically.
              </p>
            </div>
            <StatusPill label="Foundation scaffold" tone="success" />
          </div>
        </Card>
        <FoundationVerificationGatePanel gate={sampleFoundationVerificationGate} />
        <CompetitiveFeatureCoveragePanel matrix={sampleCompetitiveFeatureCoverageMatrix} />
        <PilotReadinessGatePanel
          readiness={whiteLabelPilotReadiness}
          policyPlans={samplePilotPolicyPlans}
          persistencePlans={samplePersistenceAdapterPlans}
        />
        <PilotReadinessSummaryPanel summary={samplePilotReadinessSummary} />
        <PilotEvidencePacketPanel packet={samplePilotEvidencePacket} />
        <EvidenceExportReadinessPanel plan={sampleEvidenceExportReadinessPlan} />
        <EvidenceAttachmentStorageReadinessPanel plan={sampleEvidenceAttachmentStorageReadinessPlan} />
        <EvidenceStorageAdapterSelectionGatePanel gate={sampleEvidenceStorageAdapterSelectionGate} />
        <PilotLaunchChecklistPanel checklist={samplePilotLaunchChecklist} />
        <TeacherDryRunRehearsalPanel rehearsal={sampleTeacherDryRunRehearsal} />
        <ClassroomLaunchGatePanel gate={sampleClassroomLaunchGate} />
        <SchoolLaunchPolicyGatePanel gate={sampleSchoolLaunchPolicyGate} />
        <SchoolPolicyHandoffPacketPanel packet={sampleSchoolPolicyHandoffPacket} />
        <SchoolPolicyAcceptancePreflightPanel preflight={sampleSchoolPolicyAcceptancePreflight} />
        <SchoolPolicyTextPackPanel pack={sampleSchoolPolicyTextPack} />
        <SchoolPolicyAcceptanceRecordPreviewPanel preview={sampleSchoolPolicyAcceptanceRecordPreview} />
        <SchoolPolicyRevocationRollbackPanel plan={sampleSchoolPolicyRevocationRollbackPlan} />
        <SchoolPolicyRollbackImpactMatrixPanel matrix={sampleSchoolPolicyRollbackImpactMatrix} />
        <SchoolRollbackSafeFallbackPanel plan={sampleSchoolRollbackSafeFallbackPlan} />
        <SchoolRollbackSafeFallbackPreflightPanel preflight={sampleSchoolRollbackSafeFallbackPreflight} />
        <PilotSourceStrategyPanel strategy={samplePilotSourceStrategy} />
        <PilotHandoffPackagePanel handoffPackage={samplePilotHandoffPackage} />
        <PilotReleaseCandidatePanel gate={samplePackagePublishGate} ledger={samplePackageApprovalLedger} />
        <PackagePublishGatePanel gate={samplePackagePublishGate} />
        <PackageApprovalLedgerPanel ledger={samplePackageApprovalLedger} />
        <PublisherMaintenancePlanPanel plan={samplePublisherMaintenancePlan} />
        <TenantLibraryPlanPanel plan={sampleTenantLibraryPlan} />
        <ShareEmbedReadinessPanel plan={sampleShareEmbedReadinessPlan} />
        <TargetLanguageExpansionPanel plan={sampleTargetLanguageExpansionPlan} />
        <ActivityPathwayCompatibilityPanel matrix={sampleActivityPathwayCompatibilityMatrix} />
        <PrintableOutputReadinessPanel plan={samplePrintableOutputPlan} />
        <UnitGameOfferMapPanel map={sampleUnitGameOfferMap} />
        <GamePrototypeAssignmentPanel plan={sampleGamePrototypeAssignmentPlan} />
        <UnitPackageReadinessPanel packages={sampleUnitPackageReadiness} />
        <TeacherAssignmentReadinessPanel
          plans={sampleTeacherAssignmentPlans}
          errors={sampleTeacherAssignmentErrors}
          warnings={sampleTeacherAssignmentWarnings}
        />
        <TeacherAssignmentRolloutPanel plans={sampleAssignmentRolloutPlans} />
        <ProgressEventTaxonomyPanel taxonomy={sampleProgressEventTaxonomyRegistry} />
        <ClassRosterReadinessPanel
          plans={sampleClassRosterPlans}
          errors={sampleClassRosterErrors}
          warnings={sampleClassRosterWarnings}
        />
        <UploadChannelReadinessPanel plan={sampleUploadChannelReadinessPlan} />
        <ContentEntryOptionScaffoldPanel scaffold={sampleContentEntryOptionScaffold} />
        <TemplateRenderingFontProfilePanel plan={sampleTemplateRenderingFontProfilePlan} />
        <UploadReviewQueuePanel queue={sampleUploadReviewQueue} />
        <UploadPromotionReadinessPanel plan={sampleUploadPromotionReadinessPlan} />
        <LabelledDiagramAssetReadinessPanel plan={sampleLabelledDiagramAssetReadinessPlan} />
        <MultimediaAssetReadinessPanel plan={sampleMultimediaAssetReadinessPlan} />
        <SourceReviewQueuePanel queue={sampleSourceReviewQueue} />
        <TeacherAuthoringReadinessPanel plan={sampleTeacherAuthoringReadinessPlan} />
        <AuthoringVerifierPlanPanel plan={sampleAuthoringVerifierPlan} />
        <ContentIntakeReviewPanel runs={sampleContentIntakeRuns} releases={samplePackageReleases} />
        <ActiveRouteMatrixPanel routes={sampleActiveRouteMatrix} />
        <TenantRouteRegistryPanel routes={sampleFrontDoorRouteRegistry} />
        <EditionQrAliasPanel plan={sampleEditionQrAliasPlan} />
        <QrPrintReadinessPanel records={sampleQrPrintReadinessRecords} />
        <GameBackgroundMediaPolicyPanel policy={sampleGameBackgroundMediaPolicy} />
        <MediaRightsReadinessPanel plan={sampleMediaRightsPlan} />
        <DeploymentProfilePanel profiles={sampleDeploymentProfiles} />
        <LocalDeploymentPreflightPanel plan={sampleLocalDeploymentPreflightPlan} />
        <LocalBundleManifestPanel manifests={sampleLocalBundleManifests} />
        <BackendDecisionMatrixPanel matrix={sampleBackendDecisionMatrix} />
        <PilotBackendSelectionGatePanel gate={samplePilotBackendSelectionGate} />
        <BackendSchemaDraftPanel draft={sampleBackendSchemaDraft} />
        <BackendMigrationPlanPanel plan={sampleBackendMigrationPlan} />
        <BackendMigrationSpecPanel plan={sampleBackendMigrationSpecPlan} />
        <PersistenceBoundaryPanel
          boundaries={samplePersistenceBoundaries}
          strategyOptions={samplePersistenceStrategyOptions}
          durableRecords={sampleDurableRecordContracts}
          durableRecordErrors={sampleDurableRecordErrors}
          durableRecordWarnings={sampleDurableRecordWarnings}
        />
        <PilotPolicyReadinessPanel
          plans={samplePilotPolicyPlans}
          errors={samplePilotPolicyErrors}
          warnings={samplePilotPolicyWarnings}
        />
        <PersistenceAdapterReadinessPanel
          plans={samplePersistenceAdapterPlans}
          errors={samplePersistenceAdapterErrors}
          warnings={samplePersistenceAdapterWarnings}
        />
      </div>
    </AppShell>
  );
}
