import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleLabelledDiagramAssetReadinessPlan } from "@/data/sampleLabelledDiagramAssetReadiness";
import { sampleMultimediaAssetReadinessPlan } from "@/data/sampleMultimediaAssetReadiness";
import { sampleUploadChannelReadinessPlan } from "@/data/sampleUploadChannelReadiness";
import { sampleUploadPromotionReadinessPlan } from "@/data/sampleUploadPromotionReadiness";
import { sampleUploadReviewQueue } from "@/data/sampleUploadReviewQueue";
import { TeacherUploadWorkspacePanel } from "@/features/content-intake/TeacherUploadWorkspacePanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherUploadWorkspacePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  if (tenantId !== samplePublisherTenant.id) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <TeacherUploadWorkspacePanel
        tenantId={tenantId}
        channelPlan={sampleUploadChannelReadinessPlan}
        reviewQueue={sampleUploadReviewQueue}
        promotionPlan={sampleUploadPromotionReadinessPlan}
        labelledDiagramPlan={sampleLabelledDiagramAssetReadinessPlan}
        multimediaPlan={sampleMultimediaAssetReadinessPlan}
      />
    </AppShell>
  );
}
