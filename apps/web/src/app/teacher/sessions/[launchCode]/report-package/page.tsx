import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleTeacherSessionMonitorContext } from "@/data/sampleTeacherSessionMonitor";
import { TeacherReportPackagePreviewPanel } from "@/features/teacher/TeacherReportPackagePreviewPanel";
import { TeacherSessionLaunchGateBoundaryPanel } from "@/features/teacher/TeacherSessionLaunchGateBoundaryPanel";

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
      <div className="grid gap-5">
        <TeacherSessionLaunchGateBoundaryPanel boundary={context.launchGateBoundary} />
        <TeacherReportPackagePreviewPanel context={context} />
      </div>
    </AppShell>
  );
}
