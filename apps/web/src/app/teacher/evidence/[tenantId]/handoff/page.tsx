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
import { PublisherQuarantineHandoffBridgePanel } from "@/features/evidence/PublisherQuarantineHandoffBridgePanel";
import { PilotDeliveryManifestPanel } from "@/features/evidence/PilotDeliveryManifestPanel";
import { samplePilotDeliveryManifest, samplePilotDeliveryManifestErrors } from "@/data/samplePilotDeliveryManifest";
import { samplePilotDeliveryReleaseReceipt, samplePilotDeliveryReleaseReceiptErrors } from "@/data/samplePilotDeliveryReleaseReceipt";
import { PilotDeliveryReleaseReceiptPanel } from "@/features/evidence/PilotDeliveryReleaseReceiptPanel";
import { PilotDeliveryPackageIndexPanel } from "@/features/evidence/PilotDeliveryPackageIndexPanel";

export default async function TeacherEvidencePacketHandoffPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenantId: string }>;
  searchParams?: Promise<{ quarantineId?: string; packageId?: string }>;
}) {
  const { tenantId } = await params;
  const query = searchParams ? await searchParams : {};

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
        <PilotDeliveryManifestPanel manifest={samplePilotDeliveryManifest} validationErrors={samplePilotDeliveryManifestErrors} />
        <PilotDeliveryReleaseReceiptPanel receipt={samplePilotDeliveryReleaseReceipt} validationErrors={samplePilotDeliveryReleaseReceiptErrors} />
        <PilotDeliveryPackageIndexPanel manifest={samplePilotDeliveryManifest} receipt={samplePilotDeliveryReleaseReceipt} />
        {query.quarantineId ? (
          <PublisherQuarantineHandoffBridgePanel
            tenantId={tenantId}
            quarantineId={query.quarantineId}
            packageId={query.packageId}
            packageReviewPacketsEnabled={process.env.LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED === "true"}
          />
        ) : null}
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
