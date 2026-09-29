import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sampleEvidencePacketAssemblyGate } from "@/data/sampleEvidencePacketAssemblyGate";
import {
  createEmptyEvidencePacketReviewIndex,
  samplePublisherEvidencePacketReviewIndex,
} from "@/data/sampleEvidencePacketReviewIndex";
import { sampleReviewerIdentitySignatureGate } from "@/data/sampleReviewerIdentitySignatureGate";
import { EvidencePacketAssemblyGatePanel } from "@/features/evidence/EvidencePacketAssemblyGatePanel";
import { EvidencePacketReviewIndexPanel } from "@/features/evidence/EvidencePacketReviewIndexPanel";
import { ReviewerIdentitySignatureGatePanel } from "@/features/evidence/ReviewerIdentitySignatureGatePanel";
import { TenantEvidencePacketEmptyStatePanel } from "@/features/evidence/TenantEvidencePacketEmptyStatePanel";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherEvidencePacketReviewPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  const tenant = resolveTenantConfig(tenantId);
  if (!tenant) notFound();
  const hasSampleEvidence = tenantId === samplePublisherTenant.id;

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <EvidencePacketReviewIndexPanel
          index={hasSampleEvidence ? samplePublisherEvidencePacketReviewIndex : createEmptyEvidencePacketReviewIndex(tenant.id, tenant.displayName)}
        />
        {hasSampleEvidence ? (
          <>
            <EvidencePacketAssemblyGatePanel gate={sampleEvidencePacketAssemblyGate} />
            <ReviewerIdentitySignatureGatePanel gate={sampleReviewerIdentitySignatureGate} />
          </>
        ) : (
          <TenantEvidencePacketEmptyStatePanel tenantId={tenant.id} tenantName={tenant.displayName} />
        )}
      </div>
    </AppShell>
  );
}
