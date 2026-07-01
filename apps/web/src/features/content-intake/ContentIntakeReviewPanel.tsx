import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ContentIntakeRun,
  ContentIntakeStatus,
  ContentPackageRelease,
  ContentPackageReleaseStatus,
} from "@/data/sampleContentIntakePlan";
import { countIntakeGatesByStatus } from "@/data/sampleContentIntakePlan";

interface ContentIntakeReviewPanelProps {
  runs: ContentIntakeRun[];
  releases: ContentPackageRelease[];
}

const statusTone: Record<ContentIntakeStatus, "neutral" | "success" | "warning"> = {
  complete: "success",
  "in-review": "warning",
  blocked: "warning",
  "not-started": "neutral",
};

const releaseTone: Record<ContentPackageReleaseStatus, "neutral" | "success" | "warning"> = {
  draft: "neutral",
  reviewed: "success",
  active: "success",
  retired: "neutral",
  blocked: "warning",
};

export function ContentIntakeReviewPanel({ runs, releases }: ContentIntakeReviewPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Content intake</p>
          <h2 className="mt-1 text-lg font-bold">Reviewed package pipeline</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            PDF, DOCX, spreadsheet, and media-folder sources become assignable packages only after source metadata, human review, audio support, media rights, route registry, and teacher approval gates are clear.
          </p>
        </div>
        <StatusPill label={`${runs.length} sample intakes`} tone="success" />
      </div>

      <div className="mt-5 grid gap-4">
        {runs.map((run) => (
          <article key={run.intakeId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{run.tenantName}</p>
                <h3 className="mt-1 text-base font-bold">{run.sourceName}</h3>
                <p className="mt-1 text-sm text-[var(--tenant-muted)]">
                  {run.sourceKind} / {run.unitCount} unit / {run.mediaAssetCount} media assets / route {run.targetRoutePath}
                </p>
              </div>
              <StatusPill label={run.status} tone={statusTone[run.status]} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
              <Metric label="Reviewed units" value={`${run.reviewedUnitCount}/${run.unitCount}`} />
              <Metric label="Complete gates" value={String(countIntakeGatesByStatus(run, "complete"))} />
              <Metric label="In review" value={String(countIntakeGatesByStatus(run, "in-review"))} />
              <Metric label="Not started" value={String(countIntakeGatesByStatus(run, "not-started"))} />
            </dl>

            <div className="mt-4 grid gap-3">
              {run.gates.map((gate) => (
                <section key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold">{gate.label}</h4>
                      <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{gate.note}</p>
                    </div>
                    <StatusPill label={`${gate.owner}: ${gate.status}`} tone={statusTone[gate.status]} />
                  </div>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package releases</p>
            <h3 className="mt-1 text-base font-bold">Year-on-year package versioning</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Stable routes and printed QR codes should point to an approved active package release, while yearly curriculum, media, and game updates create new reviewed versions behind the same front door.
            </p>
          </div>
          <StatusPill label={`${releases.length} release records`} tone="success" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {releases.map((release) => (
            <section key={release.releaseId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{release.tenantName}</p>
                  <h4 className="mt-1 text-sm font-bold">{release.edition}</h4>
                  <p className="mt-1 text-sm text-[var(--tenant-muted)]">
                    v{release.version} / {release.stableRoutePath}
                  </p>
                </div>
                <StatusPill label={release.activeForQr ? "QR active" : release.status} tone={release.activeForQr ? "success" : releaseTone[release.status]} />
              </div>

              <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                <Metric label="Units" value={String(release.unitCount)} />
                <Metric label="Media" value={String(release.mediaAssetCount)} />
                <Metric label="Games" value={String(release.gameModeCount)} />
              </dl>

              <div className="mt-3 grid gap-3 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
                <div>
                  <p className="font-semibold text-[var(--tenant-text)]">Changes</p>
                  <ul className="mt-1 grid gap-1">
                    {release.changedSincePrevious.map((change) => (
                      <li key={change}>{change}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[var(--tenant-text)]">Release gates</p>
                  <ul className="mt-1 grid gap-1">
                    {release.releaseGateNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
