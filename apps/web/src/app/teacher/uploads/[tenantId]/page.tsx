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
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";

export const dynamic = "force-dynamic";

export default async function TeacherUploadWorkspacePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  const tenant = resolveTenantConfig(tenantId);
  if (!tenant) notFound();

  return (
    <AppShell tenant={tenant}>
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
        quarantineUploadsEnabled={process.env.LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED === "true"}
        reviewDecisionsEnabled={process.env.LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED === "true"}
      />
    </AppShell>
  );
}
