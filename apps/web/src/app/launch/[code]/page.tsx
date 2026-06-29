import { AppShell } from "@/components/layout/AppShell";
import { getSampleLaunchSession, getSampleStudentProgression } from "@/data/sampleLaunchSession";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import { StudentLaunchFlow } from "@/features/student/StudentLaunchFlow";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default async function LaunchPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const launchSession = getSampleLaunchSession(code);
  const progression = getSampleStudentProgression(code);
  const unit = sampleMultimediaContentPackage.units[0];
  const assistLanguagePlan = sampleMultimediaContentPackage.assistLanguagePlans?.find(
    (plan) => plan.unitKey === launchSession.unitKey && plan.studentVisibility !== "teacher-only",
  );

  return (
    <AppShell tenant={ministarTenant} compact>
      <StudentLaunchFlow
        tenant={ministarTenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        audioCues={sampleMultimediaContentPackage.audioCues}
        assistLanguagePlan={assistLanguagePlan}
      />
    </AppShell>
  );
}
