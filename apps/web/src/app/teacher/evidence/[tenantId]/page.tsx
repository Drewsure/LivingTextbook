import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleEvidencePacketAssemblyGate } from "@/data/sampleEvidencePacketAssemblyGate";
import { samplePublisherEvidencePacketReviewIndex } from "@/data/sampleEvidencePacketReviewIndex";
import { EvidencePacketAssemblyGatePanel } from "@/features/evidence/EvidencePacketAssemblyGatePanel";
import { EvidencePacketReviewIndexPanel } from "@/features/evidence/EvidencePacketReviewIndexPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherEvidencePacketReviewPage({
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
      <div className="grid gap-5">
        <EvidencePacketReviewIndexPanel index={samplePublisherEvidencePacketReviewIndex} />
        <EvidencePacketAssemblyGatePanel gate={sampleEvidencePacketAssemblyGate} />
      </div>
    </AppShell>
  );
}
