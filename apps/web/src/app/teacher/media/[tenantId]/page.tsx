import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  findTeacherMediaLibraryPreview,
  getTeacherMediaRightsRecords,
} from "@/data/sampleTeacherMediaLibrary";
import { TeacherMediaLibraryPanel } from "@/features/multimedia/TeacherMediaLibraryPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherMediaLibraryPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const preview = findTeacherMediaLibraryPreview(tenantId);

  if (!preview) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <TeacherMediaLibraryPanel preview={preview} rightsRecords={getTeacherMediaRightsRecords(tenantId)} />
    </AppShell>
  );
}
