import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleSourceExtractionReviewPackets } from "@/data/sampleSourceExtractionReviewPackets";
import { sampleSourceExtractionPreviews } from "@/data/sampleSourceExtractionPreviews";
import { sampleSourceReviewQueue } from "@/data/sampleSourceReviewQueue";
import { TeacherSourceReviewWorkspacePanel } from "@/features/content-intake/TeacherSourceReviewWorkspacePanel";
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

  return (
    <AppShell tenant={tenant}>
      <TeacherSourceReviewWorkspacePanel
        tenantId={tenantId}
        tenantName={tenant.displayName}
        queue={sampleSourceReviewQueue}
        extractionPackets={sampleSourceExtractionReviewPackets}
        extractionPreviews={sampleSourceExtractionPreviews}
        quarantineId={query.quarantineId}
      />
    </AppShell>
  );
}
