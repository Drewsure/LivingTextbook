import { AppShell } from "@/components/layout/AppShell";
import { getSampleLaunchSession, getSampleStudentProgression } from "@/data/sampleLaunchSession";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { StudentLaunchFlow } from "@/features/student/StudentLaunchFlow";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default async function LaunchPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const launchSession = getSampleLaunchSession(code);
  const progression = getSampleStudentProgression(code);

  return (
    <AppShell tenant={ministarTenant} compact>
      <StudentLaunchFlow
        tenant={ministarTenant}
        unit={levelOneUnitOne}
        launchSession={launchSession}
        progression={progression}
      />
    </AppShell>
  );
}
