import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  findTeacherMediaLibraryPreview,
  getTeacherMediaRightsRecords,
} from "@/data/sampleTeacherMediaLibrary";
import { TeacherMediaLibraryPanel } from "@/features/multimedia/TeacherMediaLibraryPanel";
import { TeacherAssistLanguageAudioCatalogPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogPanel";
import { sampleAssistLanguageAudioCatalogRecords } from "@/data/sampleAssistLanguageAudioCatalog";
import { buildAssistLanguageAudioCatalogApprovalPackets } from "@/data/sampleAssistLanguageAudioCatalogApproval";
import { buildAssistLanguageAudioCatalogApprovalReconciliations } from "@/data/sampleAssistLanguageAudioCatalogApprovalReconciliation";
import { buildAssistLanguageAudioCatalogReviewerGateBindings } from "@/data/sampleAssistLanguageAudioCatalogReviewerGateBinding";
import { buildAssistLanguageAudioCatalogReleaseReviewBindings } from "@/data/sampleAssistLanguageAudioCatalogReleaseReviewBinding";
import { TeacherAssistLanguageAudioCatalogApprovalPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogApprovalPanel";
import { TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel";
import { TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel";
import { TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { sampleReviewerIdentitySignatureGate } from "@/data/sampleReviewerIdentitySignatureGate";
import { sampleWhiteLabelReleaseReadiness } from "@/data/sampleWhiteLabelReleaseReadiness";
import { sampleControlledPilotHumanReviewPacket } from "@/data/sampleControlledPilotHumanReviewPacket";
import type { TenantConfig } from "@/features/tenant/types";

function findTenantConfig(tenantId: string): TenantConfig | undefined {
  return [ministarTenant, samplePublisherTenant].find((tenant) => tenant.id === tenantId);
}

export default async function TeacherMediaLibraryPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const preview = findTeacherMediaLibraryPreview(tenantId);
  const tenant = findTenantConfig(tenantId);

  if (!preview || !tenant) {
    notFound();
  }

  const tenantCatalogRecords = sampleAssistLanguageAudioCatalogRecords.filter((record) => record.tenantId === tenantId);
  const approvalPackets = buildAssistLanguageAudioCatalogApprovalPackets(tenantCatalogRecords);
  const reconciliations = buildAssistLanguageAudioCatalogApprovalReconciliations(approvalPackets, tenantCatalogRecords);
  const reviewerGate = sampleReviewerIdentitySignatureGate.tenantId === tenantId ? sampleReviewerIdentitySignatureGate : undefined;
  const reviewerBindings = buildAssistLanguageAudioCatalogReviewerGateBindings(reconciliations, reviewerGate);
  const releaseReadiness = sampleWhiteLabelReleaseReadiness.tenantId === tenantId ? sampleWhiteLabelReleaseReadiness : undefined;
  const humanReviewPacket = sampleControlledPilotHumanReviewPacket.tenantId === tenantId ? sampleControlledPilotHumanReviewPacket : undefined;

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <TeacherMediaLibraryPanel preview={preview} rightsRecords={getTeacherMediaRightsRecords(tenantId)} />
        <TeacherAssistLanguageAudioCatalogPanel records={tenantCatalogRecords} />
        <TeacherAssistLanguageAudioCatalogApprovalPanel packets={approvalPackets} />
        <TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel reconciliations={reconciliations} />
        <TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel bindings={reviewerBindings} />
        <TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel bindings={buildAssistLanguageAudioCatalogReleaseReviewBindings(reconciliations, reviewerBindings, releaseReadiness, humanReviewPacket)} />
      </div>
    </AppShell>
  );
}
