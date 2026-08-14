import { notFound } from "next/navigation";
import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { samplePublisherMaintenancePlan } from "@/data/samplePublisherMaintenancePlan";
import { PublisherMaintenancePlanPanel } from "@/features/publisher/PublisherMaintenancePlanPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherMaintenanceWorkspacePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  if (tenantId !== samplePublisherTenant.id) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher maintenance route workspace</p>
              <h2 className="mt-1 text-2xl font-bold">Yearly maintenance review</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                This focused route is for partner conversations about annual textbook, audio, music, video, game,
                printed QR, local package, and report updates. It is a review workspace only; it cannot change a
                package release or active classroom route.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="White-label maintenance" tone="success" />
              <StatusPill label="No live maintenance workflow" tone="warning" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Blocked live actions</p>
              <h3 className="mt-1 text-lg font-bold">Review first, release-control second</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                The route makes future maintenance obligations visible without giving partners a direct file,
                route, media, report, or self-maintenance control.
              </p>
            </div>
            <StatusPill label="Preview only" tone="warning" />
          </div>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
            {[
              "No route mutation",
              "No media replacement",
              "No game availability publish",
              "No report policy change",
              "No local bundle release",
              "No partner self-maintenance action",
            ].map((rule) => (
              <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                {rule}
              </li>
            ))}
          </ul>
        </Card>

        <PublisherMaintenancePlanPanel plan={samplePublisherMaintenancePlan} />
      </div>
    </AppShell>
  );
}
