import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleTeacherSessionMonitorContext } from "@/data/sampleTeacherSessionMonitor";
import { TeacherReportPackagePreviewPanel } from "@/features/teacher/TeacherReportPackagePreviewPanel";
import { TeacherReportPersistenceRehearsalPanel } from "@/features/teacher/TeacherReportPersistenceRehearsalPanel";
import { TeacherSessionLaunchGateBoundaryPanel } from "@/features/teacher/TeacherSessionLaunchGateBoundaryPanel";
import { resolveSampleTeacherReportPersistenceRehearsal } from "@/data/sampleTeacherReportPersistenceRehearsal";
import { HostedProgressEventReviewPanel } from "@/features/persistence/HostedProgressEventReviewPanel";
import { resolveSampleTeacherReportSnapshotRecoveryRehearsal } from "@/data/sampleTeacherReportSnapshotRecoveryRehearsal";
import { TeacherReportSnapshotRecoveryRehearsalPanel } from "@/features/persistence/TeacherReportSnapshotRecoveryRehearsalPanel";

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
        <TeacherReportPersistenceRehearsalPanel
          result={resolveSampleTeacherReportPersistenceRehearsal(context)}
        />
        <TeacherReportPackagePreviewPanel context={context} />
        <TeacherReportSnapshotRecoveryRehearsalPanel
          rehearsal={resolveSampleTeacherReportSnapshotRecoveryRehearsal(context)}
        />
        <HostedProgressEventReviewPanel
          request={{
            tenantId: context.tenant.id,
            packageId: context.contentPackage.meta.packageId,
            launchCode: context.launchSession.launchCode,
          }}
        />
      </div>
    </AppShell>
  );
}
