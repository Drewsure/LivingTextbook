import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PublisherMaintenanceDomain,
  PublisherMaintenanceItem,
  PublisherMaintenancePlan,
  PublisherMaintenanceStatus,
  PublisherReleaseWindow,
} from "@/data/samplePublisherMaintenancePlan";

interface PublisherMaintenancePlanPanelProps {
  plan: PublisherMaintenancePlan;
}

const statusTone: Record<PublisherMaintenanceStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-owner": "warning",
  blocked: "neutral",
};

const statusLabel: Record<PublisherMaintenanceStatus, string> = {
  ready: "Ready",
  "needs-owner": "Needs owner",
  blocked: "Blocked",
};

const domainLabel: Record<PublisherMaintenanceDomain, string> = {
  content: "Content",
  media: "Media",
  games: "Games",
  routes: "Routes",
  reports: "Reports",
};

export function PublisherMaintenancePlanPanel({ plan }: PublisherMaintenancePlanPanelProps) {
  const readyCount = plan.items.filter((item) => item.status === "ready").length;
  const ownerNeededCount = plan.items.filter((item) => item.status === "needs-owner").length;
  const guardrailCount = plan.items.reduce((total, item) => total + item.notAllowedYet.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher maintenance</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label="White-label core" tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Partner promise</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.partnerPromise}</p>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MaintenanceMetric label="Ready domains" value={`${readyCount}/${plan.items.length}`} tone={readyCount === plan.items.length ? "success" : "warning"} />
        <MaintenanceMetric label="Owner decisions" value={String(ownerNeededCount)} tone={ownerNeededCount > 0 ? "warning" : "success"} />
        <MaintenanceMetric label="Guardrails" value={String(guardrailCount)} tone="neutral" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release windows</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">How yearly textbook packages stay maintainable</h3>
            </div>
            <StatusPill label={`${plan.releaseWindows.length} windows`} tone="success" />
          </div>
          <div className="mt-3 grid gap-2">
            {plan.releaseWindows.map((releaseWindow) => (
              <ReleaseWindowCard key={releaseWindow.releaseId} releaseWindow={releaseWindow} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing rules</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Rules that protect printed books and school trust</h3>
            </div>
            <StatusPill label="Required" tone="warning" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {plan.standingRules.map((rule) => (
              <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                {rule}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-5 grid gap-3">
        {plan.items.map((item) => (
          <MaintenanceItemCard key={item.itemId} item={item} />
        ))}
      </div>
    </Card>
  );
}

function MaintenanceMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function ReleaseWindowCard({ releaseWindow }: { releaseWindow: PublisherReleaseWindow }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--tenant-text)]">{releaseWindow.label}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{releaseWindow.timing}</p>
        </div>
        <StatusPill label={`${releaseWindow.requiredProof.length} checks`} tone="success" />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{releaseWindow.purpose}</p>
      <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
        {releaseWindow.requiredProof.map((proof) => (
          <li key={proof}>{proof}</li>
        ))}
      </ul>
    </article>
  );
}

function MaintenanceItemCard({ item }: { item: PublisherMaintenanceItem }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {domainLabel[item.domain]} / {item.cadence}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{item.label}</h3>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">Owner: {item.owner}</p>
        </div>
        <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
      </div>
      <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <p>
          <span className="font-semibold text-[var(--tenant-text)]">Rule:</span> {item.whiteLabelRule}
        </p>
        <p>
          <span className="font-semibold text-[var(--tenant-text)]">Evidence:</span> {item.evidence}
        </p>
        <p>
          <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {item.nextStep}
        </p>
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {item.notAllowedYet.map((guardrail) => (
          <li key={guardrail} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            {guardrail}
          </li>
        ))}
      </ul>
    </article>
  );
}
