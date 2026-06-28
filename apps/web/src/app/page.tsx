import { AppShell } from "@/components/layout/AppShell";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default function HomePage() {
  return (
    <AppShell tenant={ministarTenant}>
      <DashboardOverview tenant={ministarTenant} unit={levelOneUnitOne} />
    </AppShell>
  );
}
