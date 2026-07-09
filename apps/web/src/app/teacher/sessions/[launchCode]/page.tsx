import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleTeacherSessionMonitorContext } from "@/data/sampleTeacherSessionMonitor";
import { TeacherSessionMonitorPanel } from "@/features/teacher/TeacherSessionMonitorPanel";
import { TeacherSessionPreflightPanel } from "@/features/teacher/TeacherSessionPreflightPanel";
import { TeacherSessionRosterIdentityCard } from "@/features/teacher/TeacherSessionRosterIdentityCard";

export default async function TeacherSessionMonitorPage({
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
        <TeacherSessionRosterIdentityCard launchCode={context.launchSession.launchCode} />
        <TeacherSessionPreflightPanel checks={context.preflightChecks} />
        <TeacherSessionMonitorPanel context={context} />
      </div>
    </AppShell>
  );
}
