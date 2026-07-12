import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { findTeacherPrivateLibraryPreview } from "@/data/sampleTeacherPrivateLibrary";
import { TeacherPrivateLibraryPanel } from "@/features/publisher/TeacherPrivateLibraryPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherPrivateLibraryPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const library = findTeacherPrivateLibraryPreview(tenantId);

  if (!library) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <TeacherPrivateLibraryPanel library={library} />
    </AppShell>
  );
}
