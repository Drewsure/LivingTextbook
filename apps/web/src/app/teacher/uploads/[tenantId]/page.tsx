import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleUploadEvidencePacketFlow } from "@/data/sampleEvidencePacketFlows";
import { sampleLabelledDiagramAssetReadinessPlan } from "@/data/sampleLabelledDiagramAssetReadiness";
import { sampleMultimediaAssetReadinessPlan } from "@/data/sampleMultimediaAssetReadiness";
import { sampleUploadChannelReadinessPlan } from "@/data/sampleUploadChannelReadiness";
import { sampleUploadFilePolicyPlan } from "@/data/sampleUploadFilePolicy";
import { sampleUploadPromotionReadinessPlan } from "@/data/sampleUploadPromotionReadiness";
import { sampleUploadReviewQueue } from "@/data/sampleUploadReviewQueue";
import { sampleUploadTargetMappingPlan } from "@/data/sampleUploadTargetMapping";
import { sampleUploadQuarantineAdmissionPreviews } from "@/data/sampleUploadQuarantineAdmission";
import { TeacherUploadWorkspacePanel } from "@/features/content-intake/TeacherUploadWorkspacePanel";
import { TenantUploadWorkspaceEmptyStatePanel } from "@/features/content-intake/TenantUploadWorkspaceEmptyStatePanel";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";
import { createPublisherSubmissionManifestTemplate } from "@/data/publisherSubmissionManifest";
import { PublisherSubmissionManifestPanel } from "@/features/content-intake/PublisherSubmissionManifestPanel";
import { PublisherSourceManifestStarterPanel } from "@/features/content-intake/PublisherSourceManifestStarterPanel";
import { PublisherSubmissionReviewHandoffPanel } from "@/features/content-intake/PublisherSubmissionReviewHandoffPanel";
import {
  createPublisherSubmissionReviewHandoffPreview,
  validatePublisherSubmissionReviewHandoffPreview,
} from "@/data/publisherSubmissionReviewHandoff";
import {
  createPublisherSubmissionPackageEvidenceReconciliation,
  validatePublisherSubmissionPackageEvidenceReconciliationPreview,
} from "@/data/publisherSubmissionPackageEvidenceReconciliation";
import { PublisherSubmissionPackageEvidenceReconciliationPanel } from "@/features/content-intake/PublisherSubmissionPackageEvidenceReconciliationPanel";
import {
  createPublisherSubmissionPackageReviewJourney,
  validatePublisherSubmissionPackageReviewJourneyPreview,
} from "@/data/publisherSubmissionPackageReviewJourney";
import { PublisherSubmissionPackageReviewJourneyPanel } from "@/features/content-intake/PublisherSubmissionPackageReviewJourneyPanel";

export const dynamic = "force-dynamic";

export default async function TeacherUploadWorkspacePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  const tenant = resolveTenantConfig(tenantId);
  if (!tenant) notFound();

  const hasSamplePreview = tenantId === "sample-publisher";
  const quarantineUploadsEnabled = process.env.LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED === "true";
  const reviewDecisionsEnabled = process.env.LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED === "true";
  const languageSettings = tenant.languageSettings ?? { targetLanguage: "en", assistLanguages: [] };
  const submissionManifest = createPublisherSubmissionManifestTemplate({
    tenantId: tenant.id,
    packageId: hasSamplePreview ? "sample-publisher-l1-u1-routines-package" : `${tenant.id}-pilot-unit-1-package`,
    targetLanguage: languageSettings.targetLanguage,
    supportLanguages: languageSettings.assistLanguages ?? [],
  });
  const submissionReviewHandoff = createPublisherSubmissionReviewHandoffPreview(submissionManifest, tenant.id);
  const submissionReviewHandoffErrors = validatePublisherSubmissionReviewHandoffPreview(submissionReviewHandoff, submissionManifest);
  const packageEvidenceReconciliation = createPublisherSubmissionPackageEvidenceReconciliation(submissionManifest);
  const packageEvidenceReconciliationErrors = validatePublisherSubmissionPackageEvidenceReconciliationPreview(packageEvidenceReconciliation, submissionManifest);
  const packageReviewJourney = createPublisherSubmissionPackageReviewJourney(submissionManifest, packageEvidenceReconciliation.reconciliationId);
  const packageReviewJourneyErrors = validatePublisherSubmissionPackageReviewJourneyPreview(packageReviewJourney);

  return (
    <AppShell tenant={tenant}>
      <PublisherSubmissionManifestPanel manifest={submissionManifest} />
      <PublisherSourceManifestStarterPanel manifest={submissionManifest} />
      <PublisherSubmissionReviewHandoffPanel handoff={submissionReviewHandoff} validationErrors={submissionReviewHandoffErrors} />
      <PublisherSubmissionPackageEvidenceReconciliationPanel reconciliation={packageEvidenceReconciliation} validationErrors={packageEvidenceReconciliationErrors} />
      <PublisherSubmissionPackageReviewJourneyPanel journey={packageReviewJourney} validationErrors={packageReviewJourneyErrors} />
      {hasSamplePreview ? (
        <TeacherUploadWorkspacePanel
          tenantId={tenantId}
          channelPlan={sampleUploadChannelReadinessPlan}
          filePolicyPlan={sampleUploadFilePolicyPlan}
          targetMappingPlan={sampleUploadTargetMappingPlan}
          reviewQueue={sampleUploadReviewQueue}
          promotionPlan={sampleUploadPromotionReadinessPlan}
          labelledDiagramPlan={sampleLabelledDiagramAssetReadinessPlan}
          multimediaPlan={sampleMultimediaAssetReadinessPlan}
          evidenceFlow={sampleUploadEvidencePacketFlow}
          quarantineAdmissionPreviews={sampleUploadQuarantineAdmissionPreviews}
          quarantineUploadsEnabled={quarantineUploadsEnabled}
          reviewDecisionsEnabled={reviewDecisionsEnabled}
        />
      ) : (
        <TenantUploadWorkspaceEmptyStatePanel
          tenantId={tenantId}
          tenantName={tenant.displayName}
          channelPlan={sampleUploadChannelReadinessPlan}
          quarantineUploadsEnabled={quarantineUploadsEnabled}
          reviewDecisionsEnabled={reviewDecisionsEnabled}
        />
      )}
    </AppShell>
  );
}
