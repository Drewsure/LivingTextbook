import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { createEmptyTeacherPrivateLibraryPreview, findTeacherPrivateLibraryPreview } from "@/data/sampleTeacherPrivateLibrary";
import { TeacherPrivateLibraryPanel } from "@/features/publisher/TeacherPrivateLibraryPanel";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";

export default async function TeacherPrivateLibraryPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant = resolveTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  const library = findTeacherPrivateLibraryPreview(tenantId) ?? createEmptyTeacherPrivateLibraryPreview(tenant.id, tenant.displayName);

  return (
    <AppShell tenant={tenant}>
      <TeacherPrivateLibraryPanel library={library} />
    </AppShell>
  );
}
