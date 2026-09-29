import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  samplePublisherEvidencePacketHandoffPackage,
  samplePublisherEvidencePacketHandoffPackageErrors,
} from "@/data/sampleEvidencePacketHandoffPackage";
import { EvidencePacketHandoffPanel } from "@/features/evidence/EvidencePacketHandoffPanel";
import { PublisherPilotPackagePreviewPanel } from "@/features/evidence/PublisherPilotPackagePreviewPanel";
import { samplePublisherPilotPackagePreview, samplePublisherPilotPackagePreviewErrors } from "@/data/samplePublisherPilotPackagePreview";
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
      <div className="grid gap-5">
        <PublisherPilotPackagePreviewPanel preview={samplePublisherPilotPackagePreview} validationErrors={samplePublisherPilotPackagePreviewErrors} />
        <EvidencePacketHandoffPanel
          handoffPackage={samplePublisherEvidencePacketHandoffPackage}
          validationErrors={samplePublisherEvidencePacketHandoffPackageErrors}
        />
      </div>
    </AppShell>
  );
}
