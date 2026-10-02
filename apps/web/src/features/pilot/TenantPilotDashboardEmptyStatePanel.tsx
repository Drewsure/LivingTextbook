import { Card, StatusPill } from "@living-textbook/ui";
import type { TenantConfig } from "@living-textbook/content-model";

interface TenantPilotDashboardEmptyStatePanelProps {
  tenant: TenantConfig;
}

export function TenantPilotDashboardEmptyStatePanel({ tenant }: TenantPilotDashboardEmptyStatePanelProps) {
  const pilotLinks = [
    {
      href: `/teacher/pilot/requirements/${encodeURIComponent(tenant.id)}`,
      label: "Open pilot requirements",
      detail: "Review what the publisher and school must supply or decide.",
    },
    {
      href: `/teacher/uploads/${encodeURIComponent(tenant.id)}`,
      label: "Open controlled intake",
      detail: "Review source, image, audio, and video channels before admission.",
    },
    {
      href: `/teacher/evidence/${encodeURIComponent(tenant.id)}`,
      label: "Open evidence review",
      detail: "Inspect the empty evidence boundary before package assembly.",
    },
    {
      href: `/teacher/media/${encodeURIComponent(tenant.id)}`,
      label: "Open media review",
      detail: "Confirm that unit media is not yet bound to this tenant.",
    },
    {
      href: "/teacher/deployment",
      label: "Review delivery choices",
      detail: "Compare hosted PWA, closed-local, and hybrid evidence requirements.",
    },
    {
      href: "/teacher/persistence",
      label: "Review persistence policy",
      detail: "Inspect the opt-in hosted persistence and local recovery boundary.",
    },
  ];
  const pilotStages = [
    { id: "intake", label: "Publisher intake", detail: "Source, unit mapping, rights owner, and retention policy.", status: "Awaiting source" },
    { id: "review", label: "Content and media review", detail: "Text, images, audio, video, captions, fonts, and accessibility.", status: "Review-only" },
    { id: "package", label: "Curated package", detail: "Approved content, audio-first pathways, games, and deterministic scoring.", status: "Blocked" },
    { id: "qr", label: "QR release", detail: "Tenant-bound aliases, fallback identity, print artifact, and rollback evidence.", status: "Blocked" },
    { id: "delivery", label: "Delivery decision", detail: "Closed-local, hosted, or hybrid policy and cost choice.", status: "Blocked" },
    { id: "launch", label: "Teacher-led launch", detail: "Teacher rehearsal, student progression, reporting, and approved persistence.", status: "Blocked" },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">White-label pilot command shell</p>
          <h2 className="mt-1 text-2xl font-bold">{tenant.displayName} has no pilot package yet</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This tenant has a safe pilot workspace, but no publisher source, reviewed multimedia/game package, QR
            release, teacher assignment, or learner persistence has been created. The next step is evidence intake, not
            classroom launch.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Awaiting source package" tone="warning" />
          <StatusPill label="Student launch blocked" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {pilotLinks.map((link) => (
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
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Pilot stage rail</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">One governed path from publisher source to classroom</h3>
          </div>
          <StatusPill label="0 stages released" tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {pilotStages.map((stage) => (
            <article key={stage.id} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">{stage.label}</h4>
                <StatusPill label={stage.status} tone="warning" />
              </div>
              <p className="mt-2 text-sm leading-5 text-[var(--tenant-muted)]">{stage.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Pilot boundary</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
          This command shell is review-only. It does not accept files, write storage, approve rights, assemble a
          package, print QR codes, enable hosted persistence, activate a local companion, or launch students.
        </p>
      </section>
    </Card>
  );
}
