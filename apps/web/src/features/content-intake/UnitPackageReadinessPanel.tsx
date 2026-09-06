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
        {packages.map((packageSummary) => {
          const assistGateStatus = packageSummary.gates.find((gate) => gate.gateId === "assist-language")?.status ?? "review";

          return (
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
              <ReadinessMetric label="Audio-covered modes" value={String(packageSummary.audioCoveredGameModeCount)} />
              <ReadinessMetric label="Audio / video" value={`${packageSummary.audioAssetCount} / ${packageSummary.videoAssetCount}`} />
              <ReadinessMetric label="Assist plans" value={String(packageSummary.assistLanguageCount)} />
              <ReadinessMetric
                label="Assist policy"
                value={packageSummary.assistLanguageCount > 0 ? assistGateStatus : "Optional / none"}
              />
              <ReadinessMetric label="Media assets" value={String(packageSummary.mediaAssetCount)} />
              <ReadinessMetric label="Validation issues" value={String(packageSummary.validationErrorCount)} />
            </dl>

            {packageSummary.audioCoveredGameModes.length > 0 && (
              <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[var(--tenant-text)]">Audio-covered game modes</h4>
                    <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
                      These modes have explicit package-level cue coverage before student assignment.
                    </p>
                  </div>
                  <StatusPill label={`${packageSummary.audioCoveredGameModeCount} modes`} tone="success" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {packageSummary.audioCoveredGameModes.map((mode) => (
                    <span
                      key={mode}
                      className="rounded-full border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-1 text-xs font-semibold text-[var(--tenant-text)]"
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {packageSummary.assistLanguagePolicies.length > 0 && (
              <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[var(--tenant-text)]">Assist-language policy coverage</h4>
                    <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
                      Script policy travels with the package and remains separate from the target-language progression trigger.
                    </p>
                  </div>
                  <StatusPill label={`${packageSummary.assistLanguagePolicies.length} plan(s)`} tone="success" />
                </div>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  {packageSummary.assistLanguagePolicies.map((policy) => (
                    <div key={`${policy.unitKey}-${policy.assistLanguage}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                      <p className="font-semibold text-[var(--tenant-text)]">{policy.assistLanguage} / {policy.unitKey}</p>
                      <p className="mt-1 text-[var(--tenant-muted)]">Script: {policy.scriptPolicy}</p>
                      <p className="text-[var(--tenant-muted)]">Band: {policy.levelBand}</p>
                      <p className="text-[var(--tenant-muted)]">Review: {policy.reviewStatus}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

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
          );
        })}
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
