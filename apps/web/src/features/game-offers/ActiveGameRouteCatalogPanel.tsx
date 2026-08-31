import { Card, StatusPill } from "@living-textbook/ui";
import type { LaunchCode } from "@living-textbook/content-model";
import { gameModeCatalog } from "@/features/game-shell/gameModeCatalog";
import type { GameModeCatalogItem } from "@/features/game-shell/gameModeCatalog";
import { getGameModeRoutePath } from "@/features/routes/gameModeRoutePaths";

interface RouteCatalogLaunchTarget {
  label: string;
  launchCode: LaunchCode;
}

interface ActiveGameRouteCatalogPanelProps {
  launchTargets: RouteCatalogLaunchTarget[];
}

const sortedCatalogItems = Object.values(gameModeCatalog).sort(compareCatalogItems);

export function ActiveGameRouteCatalogPanel({ launchTargets }: ActiveGameRouteCatalogPanelProps) {
  const engineCount = new Set(sortedCatalogItems.map((item) => item.engineId)).size;
  const backgroundMediaCount = sortedCatalogItems.filter((item) => item.allowsBackgroundMedia).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Active game route catalog</p>
          <h2 className="mt-1 text-lg font-bold">Shared playable route map</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Every active game mode must resolve through `getGameModeRoutePath` before it appears in launch,
            activity hub, recommendation, completion, teacher shortcut, or partner demo surfaces.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${sortedCatalogItems.length} modes`} tone="success" />
          <StatusPill label={`${engineCount} engines`} tone="neutral" />
          <StatusPill label={`${backgroundMediaCount} media-ready`} tone="neutral" />
        </div>
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Route helper guard</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              The route helper is exhaustive for every `GameModeId`. Unit offer maps may still override a route with a reviewed
              package-specific `launchRoute`, but private switch statements and direct prototype promotion stay blocked.
            </p>
          </div>
          <StatusPill label="Exhaustive map" tone="success" />
        </div>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {sortedCatalogItems.map((mode) => (
          <GameRouteCatalogCard key={mode.id} mode={mode} launchTargets={launchTargets} />
        ))}
      </div>
    </Card>
  );
}

function GameRouteCatalogCard({
  mode,
  launchTargets,
}: {
  mode: GameModeCatalogItem;
  launchTargets: RouteCatalogLaunchTarget[];
}) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {mode.engineId} / {mode.family}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{mode.label}</h3>
          <p className="mt-1 text-xs font-semibold text-[var(--tenant-muted)]">{mode.id}</p>
        </div>
        <StatusPill label={mode.role} tone={mode.role === "assessment" ? "warning" : "success"} />
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <RouteFact label="Skill focus" value={mode.skillFocus} />
        <RouteFact label="Scoring profile" value={mode.scoringProfileId} />
        <RouteFact label="Term range" value={`${mode.recommendedTermRange.min}-${mode.recommendedTermRange.max}`} />
        <RouteFact label="Learning audio" value={mode.audioRequirement} />
      </dl>

      <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">{mode.summary}</p>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">Shared route links</h4>
          <StatusPill label={mode.allowsBackgroundMedia ? "Media optional" : "Learning audio first"} tone="neutral" />
        </div>
        <div className="mt-3 grid gap-2">
          {launchTargets.map((target) => {
            const href = getGameModeRoutePath(mode.id, target.launchCode);

            return (
              <a
                key={`${mode.id}-${target.launchCode}`}
                href={href}
                className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3 text-sm transition hover:bg-[var(--tenant-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
              >
                <span className="font-semibold text-[var(--tenant-text)]">{target.label}</span>
                <span className="mt-1 block break-all text-xs font-semibold text-[var(--tenant-muted)]">{href}</span>
              </a>
            );
          })}
        </div>
      </section>
    </article>
  );
}

function RouteFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function compareCatalogItems(first: GameModeCatalogItem, second: GameModeCatalogItem): number {
  if (first.engineId !== second.engineId) {
    return first.engineId.localeCompare(second.engineId);
  }

  if (first.family !== second.family) {
    return first.family.localeCompare(second.family);
  }

  return first.label.localeCompare(second.label);
}
