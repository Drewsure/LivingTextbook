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
import { PublisherPilotPackageReadinessBindingPanel } from "@/features/evidence/PublisherPilotPackageReadinessBindingPanel";
import { samplePublisherPilotPackageReadinessBinding, samplePublisherPilotPackageReadinessBindingErrors } from "@/data/samplePublisherPilotPackageReadinessBinding";
import { TenantEvidencePacketHandoffEmptyStatePanel } from "@/features/evidence/TenantEvidencePacketHandoffEmptyStatePanel";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";
import { samplePilotQrAliasRegistry, samplePilotQrAliasRegistryErrors } from "@/data/samplePilotQrAliasRegistry";
import { PilotQrAliasRegistryPreviewPanel } from "@/features/evidence/PilotQrAliasRegistryPreviewPanel";
import { PilotQrPrintAuthorizationPreflightPanel } from "@/features/evidence/PilotQrPrintAuthorizationPreflightPanel";
import { samplePilotQrPrintAuthorizationPreflight, samplePilotQrPrintAuthorizationPreflightErrors } from "@/data/samplePilotQrPrintAuthorizationPreflight";

export default async function TeacherEvidencePacketHandoffPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenantId: string }>;
  searchParams?: Promise<{ quarantineId?: string; packageId?: string }>;
}) {
  const { tenantId } = await params;
  const query = searchParams ? await searchParams : {};

  const tenant = resolveTenantConfig(tenantId);
  if (!tenant) notFound();
  const hasSampleHandoff = tenantId === samplePublisherTenant.id;

  const publisherReconciliations = samplePackageReadinessReconciliations.filter(
    (reconciliation) => reconciliation.tenantId === tenantId,
  );
  const publisherReconciliationIds = new Set(publisherReconciliations.map((reconciliation) => reconciliation.reconciliationId));
  const publisherReconciliationFindings = samplePackageReadinessReconciliationErrors.filter((error) =>
    [...publisherReconciliationIds].some((reconciliationId) => error.includes(reconciliationId)),
  );

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        {query.quarantineId ? (
          <>
            <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Live publisher submission</p>
              <h1 className="mt-1 text-xl font-bold">Review this quarantine before comparing pilot reference contracts</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">The handoff below is derived from the submitted tenant and quarantine identity. The reference panels that follow are static contract examples only and never prove that this publisher package is assembled, released, or ready for QR printing.</p>
            </section>
            <PublisherQuarantineHandoffBridgePanel
              tenantId={tenantId}
              quarantineId={query.quarantineId}
              packageId={query.packageId}
              packageReviewPacketsEnabled={process.env.LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED === "true"}
              evidenceReviewsEnabled={process.env.LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED === "true"}
              deliveryModeDecisionsEnabled={process.env.LIVING_TEXTBOOOK_DELIVERY_MODE_DECISIONS_ENABLED === "true"}
              promotionAdapterDecisionsEnabled={process.env.LIVING_TEXTBOOOK_PROMOTION_ADAPTER_DECISIONS_ENABLED === "true"}
              packageEvidenceReviewsEnabled={process.env.LIVING_TEXTBOOOK_PACKAGE_EVIDENCE_REVIEWS_ENABLED === "true"}
              reviewDecisionsEnabled={process.env.LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED === "true"}
            />
          </>
        ) : null}
        {hasSampleHandoff ? (
          <>
            <PublisherPilotPackageReadinessBindingPanel binding={samplePublisherPilotPackageReadinessBinding} validationErrors={samplePublisherPilotPackageReadinessBindingErrors} />
            <PublisherPilotPackagePreviewPanel preview={samplePublisherPilotPackagePreview} validationErrors={samplePublisherPilotPackagePreviewErrors} />
            <PilotDeliveryManifestPanel manifest={samplePilotDeliveryManifest} validationErrors={samplePilotDeliveryManifestErrors} />
            <PilotQrAliasRegistryPreviewPanel registry={samplePilotQrAliasRegistry} validationErrors={samplePilotQrAliasRegistryErrors} />
            <PilotQrPrintAuthorizationPreflightPanel preflight={samplePilotQrPrintAuthorizationPreflight} validationErrors={samplePilotQrPrintAuthorizationPreflightErrors} />
            <PilotDeliveryReleaseReceiptPanel receipt={samplePilotDeliveryReleaseReceipt} validationErrors={samplePilotDeliveryReleaseReceiptErrors} />
            <PilotDeliveryPackageIndexPanel manifest={samplePilotDeliveryManifest} receipt={samplePilotDeliveryReleaseReceipt} />
            <PackageReadinessReconciliationPanel
              reconciliations={publisherReconciliations}
              evidenceFindings={publisherReconciliationFindings}
            />
            <EvidencePacketHandoffPanel
              handoffPackage={samplePublisherEvidencePacketHandoffPackage}
              validationErrors={samplePublisherEvidencePacketHandoffPackageErrors}
            />
          </>
        ) : (
          <TenantEvidencePacketHandoffEmptyStatePanel tenantId={tenant.id} tenantName={tenant.displayName} />
        )}
      </div>
    </AppShell>
  );
}
