import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { LocalPilotPackageRuntimePanel } from "@/features/deployment/LocalPilotPackageRuntimePanel";
import { readLocalPilotPackageRuntime } from "@/server/delivery/localPilotPackageRuntimeReader";

const tenants = {
  ministar: ministarTenant,
  "sample-publisher": samplePublisherTenant,
} as const;

export default async function LocalPilotPackageRuntimePage({
  params,
}: {
  params: Promise<{ tenantId: string; packageId: string; version: string }>;
}) {
  const { tenantId, packageId, version } = await params;
  const tenant = tenants[tenantId as keyof typeof tenants];
  if (!tenant) notFound();

  const result = await readLocalPilotPackageRuntime({ tenantId, packageId, version });
  return (
    <AppShell tenant={tenant} compact>
      <LocalPilotPackageRuntimePanel result={result} tenantDisplayName={tenant.displayName} />
    </AppShell>
  );
}
