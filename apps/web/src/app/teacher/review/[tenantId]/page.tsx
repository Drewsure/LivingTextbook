import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  filterTeacherDraftReviewQueueByTenant,
  sampleTeacherDraftReviewQueue,
} from "@/data/sampleTeacherDraftReviewQueue";
import { TeacherDraftReviewQueuePanel } from "@/features/content-intake/TeacherDraftReviewQueuePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TenantTeacherDraftReviewQueuePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant =
    tenantId === samplePublisherTenant.id
      ? samplePublisherTenant
      : tenantId === ministarTenant.id
        ? ministarTenant
        : null;

  if (!tenant) {
    notFound();
  }

  const queue = filterTeacherDraftReviewQueueByTenant(
    sampleTeacherDraftReviewQueue,
    tenant.id,
    tenant.displayName,
  );

  return (
    <AppShell tenant={tenant}>
      <TeacherDraftReviewQueuePanel queue={queue} />
    </AppShell>
  );
}
