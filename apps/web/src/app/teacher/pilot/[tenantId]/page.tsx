import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TenantPilotDashboardEmptyStatePanel } from "@/features/pilot/TenantPilotDashboardEmptyStatePanel";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TenantPilotDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant = resolveTenantConfig(tenantId);

  if (!tenant) notFound();
  if (tenant.id === samplePublisherTenant.id) redirect("/teacher/pilot");

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Tenant pilot readiness</p>
              <h2 className="mt-1 text-2xl font-bold">A review path for this publisher</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This route keeps the first saleable pilot tenant-scoped from the beginning. It becomes the command view
                for a real publisher package after authorized source and rights evidence are admitted.
              </p>
            </div>
            <a
              href="/teacher"
              className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-[var(--tenant-primary-text)] underline-offset-4 hover:brightness-95"
            >
              Back to teacher home
            </a>
          </div>
        </section>
        <TenantPilotDashboardEmptyStatePanel tenant={tenant} />
      </div>
    </AppShell>
  );
}
