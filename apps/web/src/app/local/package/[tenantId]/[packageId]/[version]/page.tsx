import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LocalPilotPackageRuntimePanel } from "@/features/deployment/LocalPilotPackageRuntimePanel";
import { readLocalPilotPackageRuntime } from "@/server/delivery/localPilotPackageRuntimeReader";
import { resolveLocalPilotPackageTenant } from "@/server/delivery/localPilotPackageTenantResolver";

export default async function LocalPilotPackageRuntimePage({
  params,
}: {
  params: Promise<{ tenantId: string; packageId: string; version: string }>;
}) {
  const { tenantId, packageId, version } = await params;
  const runtimeResult = await readLocalPilotPackageRuntime({ tenantId, packageId, version });
  const tenant = resolveLocalPilotPackageTenant(tenantId, runtimeResult.status === "available" ? runtimeResult.summary.tenantConfig : undefined);
  if (!tenant) notFound();

  return (
    <AppShell tenant={tenant} compact>
      <LocalPilotPackageRuntimePanel result={runtimeResult} tenantDisplayName={tenant.displayName} />
    </AppShell>
  );
}
