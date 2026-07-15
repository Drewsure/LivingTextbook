import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { samplePublisherEvidencePacketHandoffPackage } from "@/data/sampleEvidencePacketHandoffPackage";
import { EvidencePacketHandoffPanel } from "@/features/evidence/EvidencePacketHandoffPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherEvidencePacketHandoffPage({
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
      <EvidencePacketHandoffPanel handoffPackage={samplePublisherEvidencePacketHandoffPackage} />
    </AppShell>
  );
}
