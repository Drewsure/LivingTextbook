import { Card, StatusPill } from "@living-textbook/ui";
import type {
  LocalBundleManifestSummary,
  LocalBundleReadiness,
  LocalCompanionGameStatus,
  LocalCompanionHandoffStatus,
} from "@/data/sampleLocalBundlePlan";
import type {
  LocalCompanionReleaseGate,
  LocalCompanionReleaseGateStatus,
  LocalDeploymentPreflightPlan,
  LocalDeploymentPreflightStatus,
} from "@/data/sampleLocalDeploymentPreflight";
import { countLocalCompanionReleaseGateItems, countLocalDeploymentChecks } from "@/data/sampleLocalDeploymentPreflight";

interface LocalCompanionPackagePreviewPanelProps {
  manifest: LocalBundleManifestSummary;
  preflight: LocalDeploymentPreflightPlan;
  releaseGate: LocalCompanionReleaseGate;
}

const readinessTone: Record<LocalBundleReadiness, "neutral" | "success" | "warning"> = {
  planning: "neutral",
  "media-missing": "warning",
  "offline-ready": "success",
};

const preflightTone: Record<LocalDeploymentPreflightStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  pass: "success",
  warning: "warning",
};

const releaseGateTone: Record<LocalCompanionReleaseGateStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  pass: "success",
  warning: "warning",
};

const handoffTone: Record<LocalCompanionHandoffStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  needed: "warning",
  provided: "success",
};

const gameTone: Record<LocalCompanionGameStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  included: "success",
  planned: "neutral",
};

export function LocalCompanionPackagePreviewPanel({ manifest, preflight, releaseGate }: LocalCompanionPackagePreviewPanelProps) {
  const blockedCount = countLocalDeploymentChecks(preflight, "blocked");
  const warningCount = countLocalDeploymentChecks(preflight, "warning");
  const releaseBlockedCount = countLocalCompanionReleaseGateItems(releaseGate, "blocked");
  const releaseWarningCount = countLocalCompanionReleaseGateItems(releaseGate, "warning");
  const releasePassCount = countLocalCompanionReleaseGateItems(releaseGate, "pass");
  const handoffBlockedCount = manifest.handoffItems.filter((item) => item.status === "blocked").length;
  const handoffNeededCount = manifest.handoffItems.filter((item) => item.status === "needed").length;
  const manifestSnapshot = createLocalCompanionManifestSnapshot(manifest, {
    handoffBlockedCount,
    preflightBlockedCount: blockedCount,
    releaseBlockedCount,
  });

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local companion package preview</p>
            <h2 className="mt-1 text-2xl font-bold">Closed local companion</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This preview shows how a publisher-owned textbook unit can travel as a closed companion package with content, games, audio, video, local QR fallback, and reporting/export preflight rules. It is a planning package, not an offline-ready installer.
            </p>
          </div>
          <StatusPill label={manifest.readiness} tone={readinessTone[manifest.readiness]} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          <a className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-[var(--tenant-text)]" href="/teacher/intake">
            Back to intake review
          </a>
          <a className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-4 py-2 text-[var(--tenant-text)]" href="/enter/sample-publisher">
            Open publisher front door
          </a>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">{releaseGate.label}</p>
            <h3 className="mt-1 text-lg font-bold">{releaseGate.decision}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{releaseGate.summary}</p>
          </div>
          <StatusPill label={`${releaseBlockedCount} blocked`} tone={releaseBlockedCount > 0 ? "warning" : "success"} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <BundleFact label="Passed" value={String(releasePassCount)} />
          <BundleFact label="Warnings" value={String(releaseWarningCount)} />
          <BundleFact label="Blocked" value={String(releaseBlockedCount)} />
        </dl>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {releaseGate.items.map((item) => (
            <section key={item.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.owner}</p>
                  <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
                </div>
                <StatusPill label={item.status} tone={releaseGateTone[item.status]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                <span className="font-semibold text-[var(--tenant-text)]">Evidence:</span> {item.evidence}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                <span className="font-semibold text-[var(--tenant-text)]">Blocker:</span> {item.blocker}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {item.nextAction}
              </p>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Bundled game routes</p>
            <h3 className="mt-1 text-lg font-bold">Game modes inside the local package</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Local companion packages must preserve the same reusable engine route, audio coverage, and progress-reporting contract as hosted routes.
            </p>
          </div>
          <StatusPill label={`${manifest.games.length} games`} tone="success" />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {manifest.games.map((game) => (
            <section key={game.gameId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{game.gameMode} / {game.engineId}</p>
                  <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{game.label}</h4>
                </div>
                <StatusPill label={game.status} tone={gameTone[game.status]} />
              </div>
              <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-3">
                <BundleFact label="Audio" value={game.audioCovered ? "Covered" : "Needs review"} />
                <BundleFact label="Reports" value={game.reportsProgress ? "Progress events" : "No events"} />
                <BundleFact label="Route" value={game.localPath} />
              </dl>
              <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{game.note}</p>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Generated manifest snapshot</p>
            <h3 className="mt-1 text-lg font-bold">Machine-readable package preview</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This is the shape a future exporter can write into a closed package. It is rendered from reviewed scaffold data and still marks the package as not offline-ready.
            </p>
          </div>
          <StatusPill label="Preview only" tone="warning" />
        </div>
        <pre className="mt-5 max-h-96 overflow-auto rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-xs leading-5 text-[var(--tenant-text)]">
          {JSON.stringify(manifestSnapshot, null, 2)}
        </pre>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">{manifest.tenantName}</p>
            <h3 className="mt-1 text-lg font-bold">{manifest.bundleId}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{manifest.notes}</p>
          </div>
          <StatusPill label={`v${manifest.version}`} tone="neutral" />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <BundleFact label="Content package" value={manifest.contentPackagePath} />
          <BundleFact label="Media root" value={manifest.mediaRoot} />
          <BundleFact label="Offline ready" value={manifest.offlineReady ? "Yes" : "No"} />
          <BundleFact label="Hosted redirect" value={manifest.requiresHostedRedirect ? "Required" : "Not required"} />
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package handoff checklist</p>
            <h3 className="mt-1 text-lg font-bold">What must exist before a closed companion package</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This checklist separates publisher-provided source material, platform-generated manifests, and school policy decisions. A package can be previewed before these are complete, but it cannot be called offline-ready.
            </p>
          </div>
          <StatusPill label={`${handoffBlockedCount} blocked`} tone={handoffBlockedCount > 0 ? "warning" : "success"} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <BundleFact label="Checklist items" value={String(manifest.handoffItems.length)} />
          <BundleFact label="Needed" value={String(handoffNeededCount)} />
          <BundleFact label="Blocked" value={String(handoffBlockedCount)} />
        </dl>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {manifest.handoffItems.map((item) => (
            <section key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.owner} / {item.artifact}</p>
                  <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
                </div>
                <StatusPill label={item.status} tone={handoffTone[item.status]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{item.whyNeeded}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {item.nextStep}
              </p>
            </section>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Bundled media</p>
              <h3 className="mt-1 text-lg font-bold">Audio and video assets</h3>
            </div>
            <StatusPill label={`${manifest.assets.length} assets`} tone="warning" />
          </div>
          <div className="mt-4 grid gap-3">
            {manifest.assets.map((asset) => (
              <section key={asset.assetId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{asset.kind} / rights: {asset.rightsStatus}</p>
                    <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{asset.label}</h4>
                  </div>
                  <StatusPill label={asset.checksumReady ? "Checksum ready" : "Checksum pending"} tone={asset.checksumReady ? "success" : "warning"} />
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-[var(--tenant-muted)]">{asset.localPath}</p>
              </section>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local QR fallback</p>
              <h3 className="mt-1 text-lg font-bold">Stable route targets</h3>
            </div>
            <StatusPill label={`${manifest.routes.length} routes`} tone="neutral" />
          </div>
          <div className="mt-4 grid gap-3">
            {manifest.routes.map((route) => (
              <section key={route.qrId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <p className="text-sm font-bold text-[var(--tenant-text)]">{route.qrId}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{route.targetType} / {route.targetId}</p>
                <p className="mt-2 break-all font-mono text-xs font-semibold text-[var(--tenant-text)]">{route.localFallbackPath}</p>
              </section>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local deployment preflight</p>
            <h3 className="mt-1 text-lg font-bold">{preflight.label}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preflight.recommendation}</p>
          </div>
          <StatusPill label={`${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "success"} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <BundleFact label="Warnings" value={String(warningCount)} />
          <BundleFact label="Blocked" value={String(blockedCount)} />
          <BundleFact label="AI Tutor" value={manifest.aiTutorEnabled ? "Enabled" : "Off"} />
        </dl>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {preflight.checks.map((check) => (
            <section key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.owner}</p>
                  <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{check.label}</h4>
                </div>
                <StatusPill label={check.status} tone={preflightTone[check.status]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.note}</p>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BundleFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function createLocalCompanionManifestSnapshot(
  manifest: LocalBundleManifestSummary,
  counts: { handoffBlockedCount: number; preflightBlockedCount: number; releaseBlockedCount: number },
) {
  return {
    bundle_id: manifest.bundleId,
    tenant_name: manifest.tenantName,
    version: manifest.version,
    readiness: manifest.readiness,
    offline_ready_allowed:
      manifest.offlineReady &&
      counts.handoffBlockedCount === 0 &&
      counts.preflightBlockedCount === 0 &&
      counts.releaseBlockedCount === 0,
    content_package_path: manifest.contentPackagePath,
    media_root: manifest.mediaRoot,
    requires_hosted_redirect: manifest.requiresHostedRedirect,
    ai_tutor_enabled: manifest.aiTutorEnabled,
    assets: manifest.assets.map((asset) => ({
      asset_id: asset.assetId,
      kind: asset.kind,
      local_path: asset.localPath,
      rights_status: asset.rightsStatus,
      checksum_ready: asset.checksumReady,
    })),
    routes: manifest.routes.map((route) => ({
      qr_id: route.qrId,
      target_type: route.targetType,
      target_id: route.targetId,
      local_fallback_path: route.localFallbackPath,
    })),
    games: manifest.games.map((game) => ({
      game_id: game.gameId,
      game_mode: game.gameMode,
      engine_id: game.engineId,
      local_path: game.localPath,
      status: game.status,
      audio_covered: game.audioCovered,
      reports_progress: game.reportsProgress,
    })),
    handoff: manifest.handoffItems.map((item) => ({
      item_id: item.itemId,
      owner: item.owner,
      artifact: item.artifact,
      status: item.status,
      next_step: item.nextStep,
    })),
  };
}
