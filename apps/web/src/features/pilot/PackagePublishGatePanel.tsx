import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PackagePublishGate,
  PackagePublishGateDomain,
  PackagePublishGateItem,
  PackagePublishGateStatus,
} from "@/data/samplePackagePublishGate";

interface PackagePublishGatePanelProps {
  gate: PackagePublishGate;
}

const statusTone: Record<PackagePublishGateStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-review": "warning",
  blocked: "warning",
};

const statusLabel: Record<PackagePublishGateStatus, string> = {
  ready: "Ready",
  "needs-review": "Review",
  blocked: "Blocked",
};

const domainLabel: Record<PackagePublishGateDomain, string> = {
  content: "Content",
  media: "Media",
  games: "Games",
  qr: "QR",
  reports: "Reports",
  policy: "Policy",
  deployment: "Deployment",
  persistence: "Persistence",
};

export function PackagePublishGatePanel({ gate }: PackagePublishGatePanelProps) {
  const readyCount = gate.items.filter((item) => item.status === "ready").length;
  const reviewCount = gate.items.filter((item) => item.status === "needs-review").length;
  const blockedCount = gate.items.filter((item) => item.status === "blocked").length;
  const releaseBlockers = gate.items.filter((item) => item.blocksRelease && item.status !== "ready");
  const blockedReleaseCount = releaseBlockers.length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package publish gate</p>
          <h2 className="mt-1 text-lg font-bold">{gate.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
        </div>
        <StatusPill
          label={blockedReleaseCount > 0 ? "Do not publish yet" : "Pilot publishable"}
          tone={blockedReleaseCount > 0 ? "warning" : "success"}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PublishMetric label="Candidate" value={gate.releaseCandidate} tone="neutral" />
        <PublishMetric label="Ready gates" value={`${readyCount}/${gate.items.length}`} tone={readyCount === gate.items.length ? "success" : "warning"} />
        <PublishMetric label="Needs review" value={String(reviewCount)} tone={reviewCount > 0 ? "warning" : "success"} />
        <PublishMetric label="Blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release decision rule</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{gate.decisionRule}</p>
          </div>
          <StatusPill label={gate.targetPilotRoute} tone="neutral" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release-blocking gates</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What must be closed before a real pilot</h3>
            </div>
            <StatusPill label={`${blockedReleaseCount} open`} tone={blockedReleaseCount > 0 ? "warning" : "success"} />
          </div>
          <div className="mt-3 grid gap-3">
            {gate.items.map((item) => (
              <PublishGateCard key={item.gateId} item={item} />
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing release rules</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Protect the product from accidental overpromise</h3>
              </div>
              <StatusPill label="Required" tone="success" />
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {gate.standingRules.map((rule) => (
                <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release notes</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What this gate does and does not do</h3>
              </div>
              <StatusPill label="Scaffold" tone="neutral" />
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {gate.releaseNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </Card>
  );
}

function PublishMetric({
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

function PublishGateCard({ item }: { item: PackagePublishGateItem }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {domainLabel[item.domain]} / Owner: {item.owner}
          </p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
          <StatusPill label={item.blocksRelease ? "Blocks release" : "Info"} tone={item.blocksRelease ? "warning" : "neutral"} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{item.evidence}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {item.nextStep}
      </p>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <PublishList title="Required before pilot" items={item.requiredBeforePilot} tone="success" />
        <PublishList title="Not allowed yet" items={item.notAllowedYet} tone="warning" />
      </div>
    </article>
  );
}

function PublishList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h5>
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
