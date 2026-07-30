import { Card, StatusPill } from "@living-textbook/ui";
import type { AiEngineBindingPlan } from "@/data/sampleAiEngineBindingPlan";
import { getGameModeCatalogItem } from "@/features/game-shell/gameModeCatalog";
import { getGameScoringProfileForMode } from "@/features/game-shell/scoringProfiles";

interface AiEngineBindingPlanPanelProps {
  plans: AiEngineBindingPlan[];
}

export function AiEngineBindingPlanPanel({ plans }: AiEngineBindingPlanPanelProps) {
  const blockedActionCount = plans.reduce((total, plan) => total + plan.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI engine binding preview</p>
          <h2 className="mt-1 text-lg font-bold">Use existing parent engines</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            AI generation may choose reviewed modes and payload mappings, but it must bind to the existing game catalog,
            parent engines, scoring profiles, and event contract. It cannot generate independent game code.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Parent engine binding" tone="success" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => {
          const catalogItems = plan.modeIds.map((modeId) => getGameModeCatalogItem(modeId));
          const parentEngines = Array.from(new Set(catalogItems.map((item) => item?.engineId).filter(Boolean)));
          const scoringProfiles = Array.from(
            new Set(plan.modeIds.map((modeId) => getGameScoringProfileForMode(modeId)?.id).filter(Boolean)),
          );

          return (
            <article key={plan.bindingPlanId} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.requestId}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
                </div>
                <StatusPill label="No generated game code" tone="warning" />
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <EngineMetric label="Bound modes" value={String(plan.modeIds.length)} />
                <EngineMetric label="Parent engines" value={String(parentEngines.length)} />
                <EngineMetric label="Scoring profiles" value={String(scoringProfiles.length)} />
              </dl>

              <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[var(--tenant-text)]">Game mode catalog binding</h4>
                  <StatusPill label="Mode config required" tone="warning" />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {plan.modeIds.map((modeId) => (
                    <EngineModeCard key={modeId} modeId={modeId} />
                  ))}
                </div>
              </section>

              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                <EngineList title="Required engine records" items={plan.requiredRecords} />
                <EngineList title="Integration rules" items={plan.integrationRules} />
                <EngineList title="Blocked engine actions" items={plan.blockedActions} tone="warning" />
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}

function EngineModeCard({ modeId }: { modeId: AiEngineBindingPlan["modeIds"][number] }) {
  const mode = getGameModeCatalogItem(modeId);
  const scoringProfile = getGameScoringProfileForMode(modeId);

  if (!mode) {
    return (
      <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-sm font-bold text-[var(--tenant-text)]">{modeId}</h5>
          <StatusPill label="Unmapped mode blocked" tone="warning" />
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{mode.family}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{mode.label}</h5>
        </div>
        <StatusPill label={mode.engineId} tone="success" />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <EngineFact label="Parent engine" value={mode.engineId} />
        <EngineFact label="Scoring profile" value={scoringProfile?.id ?? mode.scoringProfileId} />
        <EngineFact label="Audio requirement" value={mode.audioRequirement} />
        <EngineFact label="Skill focus" value={mode.skillFocus} />
        <EngineFact label="Mode summary" value={mode.summary} />
      </dl>
    </article>
  );
}

function EngineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function EngineFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function EngineList({
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
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
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
