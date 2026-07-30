import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleAiGameGeneratorPlan } from "@/data/sampleAiGameGeneratorPlan";
import { AiGameGeneratorPlanPanel } from "@/features/content-intake/AiGameGeneratorPlanPanel";
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
      <AiGameGeneratorPlanPanel plan={sampleAiGameGeneratorPlan} tenantId={tenantId} />
    </AppShell>
  );
}
