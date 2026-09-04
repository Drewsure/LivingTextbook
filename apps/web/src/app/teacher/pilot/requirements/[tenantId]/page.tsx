import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getPartnerPilotRequirementsIntake } from "@/data/samplePartnerPilotRequirementsIntake";
import { PartnerPilotRequirementsIntakePanel } from "@/features/pilot/PartnerPilotRequirementsIntakePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherPilotRequirementsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant =
    tenantId === samplePublisherTenant.id ? samplePublisherTenant : tenantId === ministarTenant.id ? ministarTenant : null;
  const intake = getPartnerPilotRequirementsIntake(tenantId);

  if (!tenant || !intake) {
    notFound();
  }

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Partner pilot requirements intake</p>
              <h2 className="mt-1 text-2xl font-bold">What we need before a real classroom pilot</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This route is a requirements conversation guide, not a live upload form. It keeps publisher supplies,
                school decisions, deployment choices, and optional premium AI Tutor adoption visible before any classroom
                launch or learner-data workflow exists.
              </p>
            </div>
            <a
              href="/teacher/pilot"
              className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-[var(--tenant-primary-text)] underline-offset-4 hover:brightness-95"
            >
              Back to pilot dashboard
            </a>
          </div>
        </section>

        <PartnerPilotRequirementsIntakePanel intake={intake} />
      </div>
    </AppShell>
  );
}
