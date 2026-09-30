import { Card, StatusPill } from "@living-textbook/ui";
import type { TenantConfig } from "@living-textbook/content-model";

export function TenantReleaseControlEmptyStatePanel({ tenant }: { tenant: TenantConfig }) {
  const links = [
    { href: `/teacher/pilot/${encodeURIComponent(tenant.id)}`, label: "Pilot readiness", detail: "Review the tenant-scoped path before a release candidate exists." },
    { href: `/teacher/sources/${encodeURIComponent(tenant.id)}`, label: "Source review", detail: "Confirm source, unit, language, and provenance evidence." },
    { href: `/teacher/evidence/${encodeURIComponent(tenant.id)}`, label: "Evidence review", detail: "Prepare the package evidence boundary without approving release." },
    { href: `/teacher/library/${encodeURIComponent(tenant.id)}`, label: "Private library", detail: "Keep this tenant's drafts and packages separate from reference tenants." },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Tenant release-control workspace</p>
          <h2 className="mt-1 text-2xl font-bold">No release candidate exists for {tenant.displayName}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This tenant has a safe release review shell, but no reviewed package, media rights packet, QR registry,
            delivery receipt, or human approval has been created. The next step is evidence intake, not printing or
            classroom launch.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Awaiting package evidence" tone="warning" />
          <StatusPill label="Production release blocked" tone="warning" />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 underline-offset-4 hover:border-[var(--tenant-accent)] hover:underline">
            <span className="block text-sm font-bold text-[var(--tenant-text)]">{link.label}</span>
            <span className="mt-1 block text-sm leading-5 text-[var(--tenant-muted)]">{link.detail}</span>
          </a>
        ))}
      </div>
      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Blocked release actions</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
          No package promotion, QR registry write, QR print authorization, hosted persistence activation, local bundle
          release, assignment activation, or student-ready state can be inferred from this empty workspace.
        </p>
      </section>
    </Card>
  );
}
