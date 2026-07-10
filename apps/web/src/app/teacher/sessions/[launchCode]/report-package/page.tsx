import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleTeacherSessionMonitorContext } from "@/data/sampleTeacherSessionMonitor";
import { TeacherReportPackagePreviewPanel } from "@/features/teacher/TeacherReportPackagePreviewPanel";

export default async function TeacherReportPackagePreviewPage({
  params,
}: {
  params: Promise<{ launchCode: string }>;
}) {
  const { launchCode } = await params;
  const context = resolveSampleTeacherSessionMonitorContext(launchCode);

  if (!context.unit) {
    notFound();
  }

  return (
    <AppShell tenant={context.tenant}>
      <TeacherReportPackagePreviewPanel context={context} />
    </AppShell>
  );
}
