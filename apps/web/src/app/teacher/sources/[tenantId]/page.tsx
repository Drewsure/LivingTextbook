import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleSourceReviewQueue } from "@/data/sampleSourceReviewQueue";
import { TeacherSourceReviewWorkspacePanel } from "@/features/content-intake/TeacherSourceReviewWorkspacePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherSourceReviewWorkspacePage({
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
      <TeacherSourceReviewWorkspacePanel tenantId={tenantId} tenantName={tenant.displayName} queue={sampleSourceReviewQueue} />
    </AppShell>
  );
}
