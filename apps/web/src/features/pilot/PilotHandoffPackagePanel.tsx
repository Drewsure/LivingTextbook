import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotHandoffAsset,
  PilotHandoffDecision,
  PilotHandoffPackage,
  PilotHandoffStatus,
} from "@/data/samplePilotHandoffPackage";

interface PilotHandoffPackagePanelProps {
  handoffPackage: PilotHandoffPackage;
}

const statusTone: Record<PilotHandoffStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-review": "warning",
  blocked: "neutral",
};

const statusLabel: Record<PilotHandoffStatus, string> = {
  ready: "Ready",
  "needs-review": "Review",
  blocked: "Blocked",
};

export function PilotHandoffPackagePanel({ handoffPackage }: PilotHandoffPackagePanelProps) {
  const readyAssets = handoffPackage.assets.filter((asset) => asset.status === "ready").length;
  const blockedDecisions = handoffPackage.decisions.filter((decision) => decision.status === "blocked").length;
  const routeCount = handoffPackage.routes.length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot handoff package</p>
          <h2 className="mt-1 text-lg font-bold">{handoffPackage.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{handoffPackage.summary}</p>
        </div>
        <StatusPill label={handoffPackage.recommendedPilotWindow} tone="success" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <HandoffMetric label="Deployment" value={handoffPackage.recommendedDeployment} tone="success" />
        <HandoffMetric label="Routes" value={String(routeCount)} tone="success" />
        <HandoffMetric label="Ready assets" value={`${readyAssets}/${handoffPackage.assets.length}`} tone={readyAssets === handoffPackage.assets.length ? "success" : "warning"} />
        <HandoffMetric label="Blocked decisions" value={String(blockedDecisions)} tone={blockedDecisions > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Routes to show</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Partner-facing path map</h3>
            </div>
            <StatusPill label={`${routeCount} routes`} tone="success" />
          </div>
          <div className="mt-3 grid gap-2">
            {handoffPackage.routes.map((route) => (
              <div key={route.routeId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[var(--tenant-text)]">{route.label}</p>
                    <p className="mt-1 break-words text-xs font-semibold text-[var(--tenant-muted)]">{route.path}</p>
                  </div>
                  <StatusPill label={statusLabel[route.status]} tone={statusTone[route.status]} />
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{route.purpose}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Assets and work packages</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What exists versus what the partner must provide</h3>
            </div>
            <StatusPill label="Review first" tone="warning" />
          </div>
          <div className="mt-3 grid gap-2">
            {handoffPackage.assets.map((asset) => (
              <HandoffAssetRow key={asset.assetId} asset={asset} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Human decisions before pilot</p>
          <div className="mt-3 grid gap-2">
            {handoffPackage.decisions.map((decision) => (
              <HandoffDecisionRow key={decision.decisionId} decision={decision} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Handoff notes</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What to say and not overpromise</h3>
            </div>
            <StatusPill label="Partner-safe" tone="success" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {handoffPackage.handoffNotes.map((note) => (
              <li key={note} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}

function HandoffMetric({
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

function HandoffAssetRow({ asset }: { asset: PilotHandoffAsset }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--tenant-text)]">{asset.label}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">Owner: {asset.owner}</p>
        </div>
        <StatusPill label={statusLabel[asset.status]} tone={statusTone[asset.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{asset.evidence}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]"><span className="font-semibold text-[var(--tenant-text)]">Next:</span> {asset.nextStep}</p>
    </article>
  );
}

function HandoffDecisionRow({ decision }: { decision: PilotHandoffDecision }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--tenant-text)]">{decision.label}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">Owner: {decision.owner} / Cost: {decision.costImpact}</p>
        </div>
        <StatusPill label={statusLabel[decision.status]} tone={statusTone[decision.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{decision.note}</p>
    </article>
  );
}
