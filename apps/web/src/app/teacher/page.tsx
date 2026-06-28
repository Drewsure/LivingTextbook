import { AppShell } from "@/components/layout/AppShell";
import { TeacherLaunchPanel } from "@/features/teacher/TeacherLaunchPanel";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default function TeacherPage() {
  return (
    <AppShell tenant={ministarTenant}>
      <TeacherLaunchPanel unit={levelOneUnitOne} />
    </AppShell>
  );
}
