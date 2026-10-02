import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleSourceExtractionReviewPackets } from "@/data/sampleSourceExtractionReviewPackets";
import { sampleSourceExtractionPreviews } from "@/data/sampleSourceExtractionPreviews";
import { createEmptySourceReviewQueue, sampleSourceReviewQueue } from "@/data/sampleSourceReviewQueue";
import { sampleMinistarSourceDerivedUnitReview } from "@/data/sampleMinistarSourceDerivedUnitReview";
import { sampleMinistarUnitAuthoringProposal } from "@/data/sampleMinistarUnitAuthoringProposal";
import { TeacherSourceReviewWorkspacePanel } from "@/features/content-intake/TeacherSourceReviewWorkspacePanel";
import { MinistarSourceDerivedUnitReviewPanel } from "@/features/content-intake/MinistarSourceDerivedUnitReviewPanel";
import { MinistarUnitAuthoringProposalPanel } from "@/features/content-intake/MinistarUnitAuthoringProposalPanel";
import { PublisherSourceToPackageEvidenceBridgePanel } from "@/features/content-intake/PublisherSourceToPackageEvidenceBridgePanel";
import { LiveSourcePackageEvidenceBindingPanel } from "@/features/content-intake/LiveSourcePackageEvidenceBindingPanel";
import { sampleMinistarSourceToPackageEvidenceBridge } from "@/data/sampleMinistarSourceToPackageEvidenceBridge";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";

export default async function TeacherSourceReviewWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ tenantId: string }>;
  searchParams?: Promise<{ quarantineId?: string }>;
}) {
  const { tenantId } = await params;
  const query = searchParams ? await searchParams : {};
  const tenant = resolveTenantConfig(tenantId);

  if (!tenant) notFound();

  const hasSampleSourceReview = tenantId === "ministar" || tenantId === "sample-publisher";
  const queue = hasSampleSourceReview
    ? sampleSourceReviewQueue
    : createEmptySourceReviewQueue(tenant.id, tenant.displayName);
  const extractionPackets = hasSampleSourceReview ? sampleSourceExtractionReviewPackets : [];
  const extractionPreviews = hasSampleSourceReview ? sampleSourceExtractionPreviews : [];

  return (
    <AppShell tenant={tenant}>
      <TeacherSourceReviewWorkspacePanel
        tenantId={tenantId}
        tenantName={tenant.displayName}
        queue={queue}
        extractionPackets={extractionPackets}
        extractionPreviews={extractionPreviews}
        quarantineId={query.quarantineId}
      />
      {query.quarantineId ? (
        <LiveSourcePackageEvidenceBindingPanel tenantId={tenantId} quarantineId={query.quarantineId} />
      ) : null}
      {tenantId === "ministar" ? (
        <>
          <MinistarSourceDerivedUnitReviewPanel review={sampleMinistarSourceDerivedUnitReview} />
          <MinistarUnitAuthoringProposalPanel proposal={sampleMinistarUnitAuthoringProposal} />
          <PublisherSourceToPackageEvidenceBridgePanel bridge={sampleMinistarSourceToPackageEvidenceBridge} />
        </>
      ) : null}
    </AppShell>
  );
}
