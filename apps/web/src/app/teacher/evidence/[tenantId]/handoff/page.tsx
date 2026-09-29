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
import {
  samplePackageReadinessReconciliationErrors,
  samplePackageReadinessReconciliations,
} from "@/data/samplePackageReadinessReconciliation";
import { PackageReadinessReconciliationPanel } from "@/features/content-intake/PackageReadinessReconciliationPanel";

export default async function TeacherEvidencePacketHandoffPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  if (tenantId !== samplePublisherTenant.id) {
    notFound();
  }

  const publisherReconciliations = samplePackageReadinessReconciliations.filter(
    (reconciliation) => reconciliation.tenantId === samplePublisherTenant.id,
  );
  const publisherReconciliationIds = new Set(publisherReconciliations.map((reconciliation) => reconciliation.reconciliationId));
  const publisherReconciliationFindings = samplePackageReadinessReconciliationErrors.filter((error) =>
    [...publisherReconciliationIds].some((reconciliationId) => error.includes(reconciliationId)),
  );

  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <PublisherPilotPackagePreviewPanel preview={samplePublisherPilotPackagePreview} validationErrors={samplePublisherPilotPackagePreviewErrors} />
        <PackageReadinessReconciliationPanel
          reconciliations={publisherReconciliations}
          evidenceFindings={publisherReconciliationFindings}
        />
        <EvidencePacketHandoffPanel
          handoffPackage={samplePublisherEvidencePacketHandoffPackage}
          validationErrors={samplePublisherEvidencePacketHandoffPackageErrors}
        />
      </div>
    </AppShell>
  );
}
