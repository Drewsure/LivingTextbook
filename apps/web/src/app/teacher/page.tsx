import { AppShell } from "@/components/layout/AppShell";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { sampleLaunchSession } from "@/data/sampleLaunchSession";
import { TeacherLaunchPanel } from "@/features/teacher/TeacherLaunchPanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default function TeacherPage() {
  return (
    <AppShell tenant={ministarTenant}>
      <TeacherLaunchPanel unit={levelOneUnitOne} launchSession={sampleLaunchSession} />
    </AppShell>
  );
}
