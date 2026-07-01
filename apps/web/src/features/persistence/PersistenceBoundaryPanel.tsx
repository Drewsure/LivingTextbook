import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PersistenceBoundary,
  PersistenceReadinessStatus,
  PersistenceStrategyOption,
} from "@/data/samplePersistencePlan";

interface PersistenceBoundaryPanelProps {
  boundaries: PersistenceBoundary[];
  strategyOptions: PersistenceStrategyOption[];
}

const statusTone: Record<PersistenceReadinessStatus, "neutral" | "success" | "warning"> = {
  "demo-static": "neutral",
  "needs-backend": "warning",
  "needs-policy": "warning",
};

const costTone: Record<PersistenceStrategyOption["costPosture"], "neutral" | "success" | "warning"> = {
  lowest: "success",
  controlled: "neutral",
  higher: "warning",
};

export function PersistenceBoundaryPanel({ boundaries, strategyOptions }: PersistenceBoundaryPanelProps) {
  const backendNeeded = boundaries.filter((boundary) => boundary.status !== "demo-static").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Persistence boundary</p>
          <h2 className="mt-1 text-lg font-bold">What must become durable before a pilot</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The current app can prove the flow with static sample data and local state. A real white-label pilot needs durable records for route registry, reviewed packages, launch sessions, progress events, media manifests, and deployment profile decisions.
          </p>
        </div>
        <StatusPill label={`${backendNeeded} backend decisions`} tone={backendNeeded > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {boundaries.map((boundary) => (
          <article key={boundary.boundaryId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{boundary.category}</p>
                <h3 className="mt-1 text-base font-bold">{boundary.label}</h3>
              </div>
              <StatusPill label={boundary.status} tone={statusTone[boundary.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{boundary.whyItMatters}</p>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <dt className="font-semibold">Record shape</dt>
                <dd className="mt-1 text-[var(--tenant-muted)]">{boundary.recordShape}</dd>
              </div>
              <div>
                <dt className="font-semibold">Visible to</dt>
                <dd className="mt-1 text-[var(--tenant-muted)]">{boundary.visibleTo.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-semibold">Deployment fit</dt>
                <dd className="mt-1 text-[var(--tenant-muted)]">{boundary.deploymentChannels.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-semibold">Next decision</dt>
                <dd className="mt-1 text-[var(--tenant-muted)]">{boundary.nextDecision}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">Backend strategy options</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
              This keeps cost control explicit: static samples stay cheap, hosted managed storage is the likely first pilot step, and local-first storage is reserved for closed companion deployments.
            </p>
          </div>
          <StatusPill label="No vendor lock yet" tone="success" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {strategyOptions.map((option) => (
            <section key={option.optionId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="text-sm font-bold">{option.label}</h4>
                <StatusPill label={option.recommendedForFirstPilot ? "Pilot fit" : option.costPosture} tone={option.recommendedForFirstPilot ? "success" : costTone[option.costPosture]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{option.fit}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{option.caution}</p>
            </section>
          ))}
        </div>
      </div>
    </Card>
  );
}
