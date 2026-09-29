import { Card, StatusPill } from "@living-textbook/ui";
import type { TenantConfig } from "@living-textbook/content-model";

interface TenantPilotRequirementsEmptyStatePanelProps {
  tenant: TenantConfig;
}

export function TenantPilotRequirementsEmptyStatePanel({
  tenant,
}: TenantPilotRequirementsEmptyStatePanelProps) {
  const reviewLinks = [
    {
      href: `/teacher/uploads/${encodeURIComponent(tenant.id)}`,
      label: "Open source and media intake",
      detail: "Review the controlled channels before any file is admitted.",
    },
    {
      href: `/teacher/sources/${encodeURIComponent(tenant.id)}`,
      label: "Open source review",
      detail: "Confirm that no publisher source has been received yet.",
    },
    {
      href: `/teacher/media/${encodeURIComponent(tenant.id)}`,
      label: "Open media library review",
      detail: "Confirm that no audio, video, image, or music records are bound yet.",
    },
    {
      href: `/teacher/evidence/${encodeURIComponent(tenant.id)}`,
      label: "Open evidence packet review",
      detail: "Prepare the review boundary without creating an approval record.",
    },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Tenant pilot requirements</p>
          <h2 className="mt-1 text-lg font-bold">No pilot requirements packet exists yet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            {tenant.displayName} has a safe white-label review shell, but no publisher source, media inventory, school
            policy, or pilot decisions have been admitted. Start with review surfaces; do not treat the sample tenant as
            this publisher&apos;s content.
          </p>
        </div>
        <StatusPill label="Awaiting publisher intake" tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next evidence gate</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
          A requirements packet can be assembled only after an authorized publisher supplies the first source unit and
          identifies the rights, accessibility, entry, reporting, and delivery decisions for review.
        </p>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {reviewLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 underline-offset-4 hover:border-[var(--tenant-accent)] hover:underline"
          >
            <span className="block text-sm font-bold text-[var(--tenant-text)]">{link.label}</span>
            <span className="mt-1 block text-sm leading-5 text-[var(--tenant-muted)]">{link.detail}</span>
          </a>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Review-only boundary</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              This shell does not upload, store, extract, generate, accept policy, create a package, print QR codes,
              enable persistence, or launch students.
            </p>
          </div>
          <StatusPill label="No live capture" tone="warning" />
        </div>
      </section>
    </Card>
  );
}
