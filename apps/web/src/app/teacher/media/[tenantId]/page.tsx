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
import { TeacherAssistLanguageAudioCatalogApprovalPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogApprovalPanel";
import { TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
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

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <TeacherMediaLibraryPanel preview={preview} rightsRecords={getTeacherMediaRightsRecords(tenantId)} />
        <TeacherAssistLanguageAudioCatalogPanel records={tenantCatalogRecords} />
        <TeacherAssistLanguageAudioCatalogApprovalPanel packets={approvalPackets} />
        <TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel reconciliations={buildAssistLanguageAudioCatalogApprovalReconciliations(approvalPackets, tenantCatalogRecords)} />
      </div>
    </AppShell>
  );
}
