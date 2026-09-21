import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleTeacherSessionMonitorContext } from "@/data/sampleTeacherSessionMonitor";
import { TeacherSessionLaunchGateBoundaryPanel } from "@/features/teacher/TeacherSessionLaunchGateBoundaryPanel";
import { TeacherSessionMonitorPanel } from "@/features/teacher/TeacherSessionMonitorPanel";
import { TeacherSessionPreflightPanel } from "@/features/teacher/TeacherSessionPreflightPanel";
import { TeacherSessionRosterIdentityCard } from "@/features/teacher/TeacherSessionRosterIdentityCard";
import { TeacherSessionLocalEvidencePanel } from "@/features/teacher/TeacherSessionLocalEvidencePanel";

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
        <TeacherSessionRosterIdentityCard rosterPlan={context.classRosterPlan} />
        <TeacherSessionLaunchGateBoundaryPanel boundary={context.launchGateBoundary} />
        <TeacherSessionPreflightPanel checks={context.preflightChecks} />
        <TeacherSessionMonitorPanel context={context} />
        <TeacherSessionLocalEvidencePanel
          launchCode={context.launchSession.launchCode}
          expectedTenantId={context.tenant.id}
          expectedPackageId={context.contentPackage.meta.packageId}
          expectedUnitKey={context.launchSession.unitKey}
          expectedStudentSessionId={context.progression.studentSessionId}
          targetLanguage={context.contentPackage.audioSupportPlans?.find((plan) => plan.unitKey === context.launchSession.unitKey)?.targetLanguage ?? context.tenant.languageSettings?.targetLanguage ?? "en"}
        />
      </div>
    </AppShell>
  );
}
