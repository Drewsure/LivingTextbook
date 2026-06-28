import { AppShell } from "@/components/layout/AppShell";
import { StudentLaunchFlow } from "@/features/student/StudentLaunchFlow";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default async function LaunchPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <AppShell tenant={ministarTenant} compact>
      <StudentLaunchFlow launchCode={code} tenant={ministarTenant} unit={levelOneUnitOne} />
    </AppShell>
  );
}
