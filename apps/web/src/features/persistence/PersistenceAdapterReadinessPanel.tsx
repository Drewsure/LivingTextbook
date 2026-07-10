import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PersistenceAdapterMode,
  PersistenceAdapterPlan,
  PersistenceWriteReadiness,
} from "@living-textbook/content-model";

interface PersistenceAdapterReadinessPanelProps {
  plans: PersistenceAdapterPlan[];
  errors: string[];
  warnings: string[];
}

const readinessTone: Record<PersistenceWriteReadiness, "neutral" | "success" | "warning"> = {
  "demo-only": "neutral",
  "requires-backend": "warning",
  "requires-policy": "warning",
  "pilot-ready": "success",
};

const modeTone: Record<PersistenceAdapterMode, "neutral" | "success" | "warning"> = {
  "static-demo": "neutral",
  "hosted-managed": "success",
  "local-classroom": "warning",
};

const costTone: Record<PersistenceAdapterPlan["costPosture"], "neutral" | "success" | "warning"> = {
  lowest: "success",
  controlled: "neutral",
  higher: "warning",
};

export function PersistenceAdapterReadinessPanel({
  plans,
  errors,
  warnings,
}: PersistenceAdapterReadinessPanelProps) {
  const adapterMapValid = errors.length === 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Persistence adapter readiness</p>
          <h2 className="mt-1 text-lg font-bold">How storage stays replaceable</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is the handoff map between static demos and real storage. It names what a hosted pilot or local classroom deployment must be able to write without choosing a vendor too early.
          </p>
        </div>
        <StatusPill label={adapterMapValid ? "Adapter map valid" : "Adapter review"} tone={adapterMapValid ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          <p className="font-semibold text-[var(--tenant-text)]">Safety contract</p>
          {adapterMapValid ? (
            <p className="mt-2">All adapter plans reject raw learner audio and transcripts in core storage. Student-data writes require school or tenant policy.</p>
          ) : (
            <ul className="mt-2 grid gap-2">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          <p className="font-semibold text-[var(--tenant-text)]">Readiness warnings</p>
          <ul className="mt-2 grid gap-2">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <section key={plan.planId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.mode}</p>
                <h3 className="mt-1 text-base font-bold">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.note}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={plan.recommendedForFirstPilot ? "Pilot fit" : plan.costPosture} tone={plan.recommendedForFirstPilot ? "success" : costTone[plan.costPosture]} />
                <StatusPill label={plan.mode} tone={modeTone[plan.mode]} />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {plan.writeIntents.map((intent) => (
                <article key={intent.intentId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-sm font-bold">{intent.label}</h4>
                    <StatusPill label={intent.readiness} tone={readinessTone[intent.readiness]} />
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{intent.category}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{intent.note}</p>
                  <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-[var(--tenant-text)]">Store path</dt>
                      <dd className="mt-1">{intent.targetStore.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--tenant-text)]">Deployment</dt>
                      <dd className="mt-1">{intent.deploymentChannels.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--tenant-text)]">Offline</dt>
                      <dd className="mt-1">{intent.canRunOffline ? "Supported" : "Not required"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--tenant-text)]">Export</dt>
                      <dd className="mt-1">{intent.allowsExport ? "Policy gated" : "No export"}</dd>
                    </div>
                    {intent.category === "progress-event-stream" && (
                      <div>
                        <dt className="font-semibold text-[var(--tenant-text)]">Event taxonomy</dt>
                        <dd className="mt-1">{intent.preservesEventEffectTaxonomy ? "Preserved" : "Needs review"}</dd>
                      </div>
                    )}
                  </dl>
                </article>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <h4 className="text-sm font-bold">Handoff steps</h4>
              <ol className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                {plan.handoffSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </div>
    </Card>
  );
}
