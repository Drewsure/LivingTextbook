import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { findSampleTeacherDraftPackage } from "@/data/sampleTeacherDraftPackage";
import { TeacherDraftPackagePreviewPanel } from "@/features/content-intake/TeacherDraftPackagePreviewPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherDraftPackagePage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;
  const draft = findSampleTeacherDraftPackage(draftId);

  if (!draft) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <TeacherDraftPackagePreviewPanel draft={draft} />
    </AppShell>
  );
}
