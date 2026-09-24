import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  findTeacherMediaLibraryPreview,
  getTeacherMediaRightsRecords,
} from "@/data/sampleTeacherMediaLibrary";
import { TeacherMediaLibraryPanel } from "@/features/multimedia/TeacherMediaLibraryPanel";
import { TeacherAssistLanguageAudioCatalogPanel } from "@/features/multimedia/TeacherAssistLanguageAudioCatalogPanel";
import { sampleAssistLanguageAudioCatalogRecords } from "@/data/sampleAssistLanguageAudioCatalog";
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

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <TeacherMediaLibraryPanel preview={preview} rightsRecords={getTeacherMediaRightsRecords(tenantId)} />
        <TeacherAssistLanguageAudioCatalogPanel records={sampleAssistLanguageAudioCatalogRecords.filter((record) => record.tenantId === tenantId)} />
      </div>
    </AppShell>
  );
}
