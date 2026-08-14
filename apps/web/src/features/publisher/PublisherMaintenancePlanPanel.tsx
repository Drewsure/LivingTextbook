import { Card, StatusPill } from "@living-textbook/ui";
import {
  getPublisherMaintenancePlanWarnings,
  validatePublisherMaintenancePlan,
} from "@living-textbook/content-model/src/publisherMaintenance";
import type {
  PublisherMaintenanceChangeRequest,
  PublisherMaintenanceChangeStatus,
  PublisherMaintenanceDomain,
  PublisherMaintenanceItem,
  PublisherMaintenancePlan,
  PublisherMaintenanceRouteImpact,
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

const changeStatusTone: Record<PublisherMaintenanceChangeStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  draft: "neutral",
  "ready-for-release": "success",
  "review-required": "warning",
};

const routeImpactLabel: Record<PublisherMaintenanceRouteImpact, string> = {
  "alias-preserved": "Alias preserved",
  none: "No route change",
  "requires-redirect": "Redirect review",
};

export function PublisherMaintenancePlanPanel({ plan }: PublisherMaintenancePlanPanelProps) {
  const readyCount = plan.items.filter((item) => item.status === "ready").length;
  const ownerNeededCount = plan.items.filter((item) => item.status === "needs-owner").length;
  const guardrailCount = plan.items.reduce((total, item) => total + item.notAllowedYet.length, 0);
  const blockedChangeCount = plan.changeRequests.filter((change) => change.status === "blocked").length;
  const guardBlocks = validatePublisherMaintenancePlan(plan);
  const guardWarnings = getPublisherMaintenancePlanWarnings(plan);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher maintenance</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="White-label core" tone="success" />
          <StatusPill label="Maintenance guard active" tone="success" />
          <StatusPill label={`${guardBlocks.length} guard block(s)`} tone={guardBlocks.length > 0 ? "warning" : "success"} />
        </div>
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Partner promise</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.partnerPromise}</p>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <MaintenanceGuardList
          title="Maintenance guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No maintenance guard blocks."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <MaintenanceGuardList
          title="Maintenance guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No maintenance guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MaintenanceMetric label="Ready domains" value={`${readyCount}/${plan.items.length}`} tone={readyCount === plan.items.length ? "success" : "warning"} />
        <MaintenanceMetric label="Owner decisions" value={String(ownerNeededCount)} tone={ownerNeededCount > 0 ? "warning" : "success"} />
        <MaintenanceMetric label="Guardrails" value={String(guardrailCount)} tone="neutral" />
        <MaintenanceMetric label="Blocked changes" value={String(blockedChangeCount)} tone={blockedChangeCount > 0 ? "warning" : "success"} />
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

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Maintenance change queue</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Yearly content, media, game, route, and report updates</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Changes stay in a review queue until route impact, media rights, game/audio coverage, report impact, approvals, and rollback behavior are clear.
            </p>
          </div>
          <StatusPill label={`${plan.changeRequests.length} requests`} tone={blockedChangeCount > 0 ? "warning" : "success"} />
        </div>
        <div className="mt-4 grid gap-3">
          {plan.changeRequests.map((changeRequest) => (
            <MaintenanceChangeRequestCard key={changeRequest.requestId} changeRequest={changeRequest} />
          ))}
        </div>
      </section>
    </Card>
  );
}

function MaintenanceGuardList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
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

function MaintenanceChangeRequestCard({ changeRequest }: { changeRequest: PublisherMaintenanceChangeRequest }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {domainLabel[changeRequest.domain]} / {changeRequest.changeType}
          </p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{changeRequest.label}</h4>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {changeRequest.requestedBy} / {changeRequest.targetEdition}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={changeRequest.status} tone={changeStatusTone[changeRequest.status]} />
          <StatusPill label={routeImpactLabel[changeRequest.routeImpact]} tone={changeRequest.routeImpact === "requires-redirect" ? "warning" : "neutral"} />
        </div>
      </div>

      <dl className="mt-3 grid gap-3 text-sm leading-6 text-[var(--tenant-muted)] lg:grid-cols-3">
        <MaintenanceDetail label="Media impact" value={changeRequest.mediaImpact} />
        <MaintenanceDetail label="Game impact" value={changeRequest.gameImpact} />
        <MaintenanceDetail label="Report impact" value={changeRequest.reportImpact} />
      </dl>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Required approvals</p>
            <StatusPill label={String(changeRequest.requiredApprovals.length)} tone="neutral" />
          </div>
          <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
            {changeRequest.requiredApprovals.map((approval) => (
              <li key={approval}>{approval}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Blocked by</p>
            <StatusPill label={String(changeRequest.blockedBy.length)} tone={changeRequest.blockedBy.length > 0 ? "warning" : "success"} />
          </div>
          {changeRequest.blockedBy.length > 0 ? (
            <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
              {changeRequest.blockedBy.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">No open blockers.</p>
          )}
        </section>
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {changeRequest.nextAction}
      </p>
    </article>
  );
}

function MaintenanceDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
