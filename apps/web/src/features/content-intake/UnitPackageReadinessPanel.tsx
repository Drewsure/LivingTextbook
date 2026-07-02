import { Card, StatusPill } from "@living-textbook/ui";
import type { UnitPackageGateStatus, UnitPackageReadinessSummary } from "@/data/sampleUnitPackageReadiness";

interface UnitPackageReadinessPanelProps {
  packages: UnitPackageReadinessSummary[];
}

const gateTone: Record<UnitPackageGateStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  review: "neutral",
  blocked: "warning",
};

export function UnitPackageReadinessPanel({ packages }: UnitPackageReadinessPanelProps) {
  const blockedCount = packages.reduce(
    (total, packageSummary) => total + packageSummary.gates.filter((gate) => gate.blocksPilot).length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Unit package readiness</p>
          <h2 className="mt-1 text-lg font-bold">Launchable unit coverage</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Each package must show reviewed unit payloads, target-language audio support, route and game coverage, media rights status, and teacher release state before it moves from demo to classroom use.
          </p>
        </div>
        <StatusPill label={blockedCount > 0 ? `${blockedCount} blockers` : "No blockers"} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-4">
        {packages.map((packageSummary) => (
          <article key={packageSummary.packageId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packageSummary.tenantId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packageSummary.sourceName}</h3>
                <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">
                  {packageSummary.packageId} / {packageSummary.stableRoutePath}
                </p>
              </div>
              <StatusPill label={packageSummary.activeForQr ? "QR active" : packageSummary.reviewStatus} tone={packageSummary.activeForQr ? "success" : "neutral"} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <ReadinessMetric label="Units" value={String(packageSummary.unitCount)} />
              <ReadinessMetric label="Terms / sentences" value={`${packageSummary.termCount} / ${packageSummary.sentenceCount}`} />
              <ReadinessMetric label="Game modes" value={String(packageSummary.gameModeCount)} />
              <ReadinessMetric label="Audio cues" value={String(packageSummary.audioCueCount)} />
              <ReadinessMetric label="Audio / video" value={`${packageSummary.audioAssetCount} / ${packageSummary.videoAssetCount}`} />
              <ReadinessMetric label="Assist plans" value={String(packageSummary.assistLanguageCount)} />
              <ReadinessMetric label="Media assets" value={String(packageSummary.mediaAssetCount)} />
              <ReadinessMetric label="Validation issues" value={String(packageSummary.validationErrorCount)} />
            </dl>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {packageSummary.gates.map((gate) => (
                <section key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h4>
                    <StatusPill label={gate.status} tone={gateTone[gate.status]} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{gate.evidence}</p>
                  <p className="mt-2 text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                    {gate.blocksPilot ? "Blocks pilot" : "Does not block pilot"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{gate.nextStep}</p>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ReadinessMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
