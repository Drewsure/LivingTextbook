import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageWriterRoutePlaylistWriteGuardCollectionWarnings,
  validateAiGeneratedPackageWriterRoutePlaylistWriteGuards,
} from "@living-textbook/content-model/src/aiPackageWriterRoutePlaylistWriteGuard";

import type {
  AiGeneratedPackageWriterRoutePlaylistSurface,
  AiGeneratedPackageWriterRoutePlaylistWriteGuard,
  AiGeneratedPackageWriterRoutePlaylistWriteGuardStatus,
} from "@/data/sampleAiGeneratedPackageWriterRoutePlaylistWriteGuard";

interface AiGeneratedPackageWriterRoutePlaylistWriteGuardPanelProps {
  guards: AiGeneratedPackageWriterRoutePlaylistWriteGuard[];
}

const statusTone: Record<AiGeneratedPackageWriterRoutePlaylistWriteGuardStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "review-only": "neutral",
};

const statusLabel: Record<AiGeneratedPackageWriterRoutePlaylistWriteGuardStatus, string> = {
  blocked: "Writes blocked",
  "review-only": "Review only",
};

export function AiGeneratedPackageWriterRoutePlaylistWriteGuardPanel({
  guards,
}: AiGeneratedPackageWriterRoutePlaylistWriteGuardPanelProps) {
  const guardBlocks = validateAiGeneratedPackageWriterRoutePlaylistWriteGuards(guards);
  const guardWarnings = getAiGeneratedPackageWriterRoutePlaylistWriteGuardCollectionWarnings(guards);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer route and playlist write guard
          </p>
          <h2 className="mt-1 text-lg font-bold">Route and playlist writes stay locked</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This guard reviews student routes, teacher routes, media playlists, and QR deep links before any future
            generated package writer can mutate them.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Route and playlist guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No route writes" tone="warning" />
          <StatusPill label="No playlist writes" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <GuardList
          title="Route and playlist guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared route and playlist guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <GuardList
          title="Route and playlist guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared route and playlist guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {guards.map((guard) => (
          <article key={guard.guardId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{guard.packageIdPreview}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{guard.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{guard.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={statusLabel[guard.status]} tone={statusTone[guard.status]} />
                <StatusPill label={guard.guardState} tone="warning" />
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Protected route and playlist surfaces</h4>
                <StatusPill label={String(guard.protectedSurfaces.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {guard.protectedSurfaces.map((surface) => (
                  <ProtectedSurfaceCard key={surface.surfaceId} surface={surface} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <GuardList title="Route safety checks" items={guard.routeSafetyChecks} />
              <GuardList title="Playlist safety checks" items={guard.playlistSafetyChecks} />
              <GuardList title="Blocked write actions" items={guard.blockedWriteActions} tone="warning" />
              <GuardList title="Next required records" items={guard.nextRequiredRecords} />
              <GuardList title="Support-language boundary" items={guard.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ProtectedSurfaceCard({ surface }: { surface: AiGeneratedPackageWriterRoutePlaylistSurface }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{surface.surfaceKind}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{surface.label}</h5>
          <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{surface.sourceRecord}</p>
        </div>
        <StatusPill label={surface.status} tone="warning" />
      </div>
      <div className="mt-3 grid gap-3">
        <GuardList title="Required proofs" items={surface.requiredProofs} />
        <GuardList title="Blocked mutations" items={surface.blockedMutations} tone="warning" />
      </div>
    </article>
  );
}

function GuardList({
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
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
