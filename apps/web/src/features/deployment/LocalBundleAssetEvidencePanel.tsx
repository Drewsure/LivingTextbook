import { evaluateLocalBundleAssetEvidence, evaluateLocalBundleAssetEvidenceSet, type LocalBundleManifestAsset } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";
import type { LocalBundleAssetSummary, LocalBundleManifestSummary } from "@/data/sampleLocalBundlePlan";

interface LocalBundleAssetEvidencePanelProps {
  manifest: LocalBundleManifestSummary;
}

interface AssetEvidenceCheck {
  label: string;
  ready: boolean;
  value: string;
}

export function LocalBundleAssetEvidencePanel({ manifest }: LocalBundleAssetEvidencePanelProps) {
  const evidence = manifest.assets.map((asset) => ({
    asset,
    result: evaluateLocalBundleAssetEvidence(createRuntimeAsset(asset)),
  }));
  const evidenceSet = evaluateLocalBundleAssetEvidenceSet(manifest.assets.map(createRuntimeAsset));
  const handoffReadyCount = evidenceSet.assets.filter((item) => item.handoffReady).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Reviewed asset evidence handoff</p>
          <h3 className="mt-1 text-lg font-bold">Every asset must clear its own evidence lanes</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review surface makes the future package handoff explicit. It does not upload, scan, copy, publish, activate, or expose any asset to students.
          </p>
        </div>
        <StatusPill label={`${handoffReadyCount}/${evidence.length} handoff-ready`} tone={handoffReadyCount === evidence.length ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {evidence.map(({ asset, result }) => {
          const checks = createAssetEvidenceChecks(asset, result);
          const ready = result.handoffReady;
          return (
            <section key={asset.assetId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{asset.kind} / {asset.assetId}</p>
                  <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{asset.label}</h4>
                  <p className="mt-1 break-all font-mono text-xs text-[var(--tenant-muted)]">{asset.localPath}</p>
                </div>
                <StatusPill label={ready ? "Handoff-ready" : "Blocked"} tone={ready ? "success" : "warning"} />
              </div>
              <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                {checks.map((check) => (
                  <div key={check.label} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                    <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.label}</dt>
                    <dd className="mt-1 flex items-center justify-between gap-2 text-sm font-bold text-[var(--tenant-text)]">
                      <span>{check.value}</span>
                      <StatusPill label={check.ready ? "Ready" : "Needed"} tone={check.ready ? "success" : "warning"} />
                    </dd>
                  </div>
                ))}
              </dl>
              {result.blockers.length > 0 && (
                <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
                  <span className="font-semibold text-[var(--tenant-text)]">Blockers:</span> {result.blockers.join(" ")}
                </p>
              )}
            </section>
          );
        })}
      </div>

      <p className="text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Package evidence:</span>{" "}
        {evidenceSet.handoffReady ? "Every declared asset is handoff-ready." : `${evidenceSet.blockers.length} evidence blocker(s) remain across the declared assets.`}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <BoundaryFact label="No live upload" />
        <BoundaryFact label="No local asset write" />
        <BoundaryFact label="No student-facing promotion" />
        <BoundaryFact label="No offline package activation" />
      </div>
    </Card>
  );
}

function createAssetEvidenceChecks(asset: LocalBundleAssetSummary, evidence: ReturnType<typeof evaluateLocalBundleAssetEvidence>): AssetEvidenceCheck[] {
  return [
    { label: "Rights evidence", ready: evidence.rightsReady, value: evidence.rightsReady ? asset.rightsStatus : "Proof needed" },
    { label: "Checksum", ready: evidence.checksumReady, value: evidence.checksumReady ? "Final" : "Pending" },
    { label: "Scan", ready: evidence.scanReady, value: evidence.scanReady ? "Passed" : "Pending" },
    { label: "Target mapping", ready: evidence.targetMappingReady, value: evidence.targetMappingReady ? "Reviewed" : "Pending" },
    { label: "Accessibility evidence", ready: evidence.accessibilityReady, value: evidence.accessibilityReady ? "Present" : "Needed" },
  ];
}

function createRuntimeAsset(asset: LocalBundleAssetSummary): LocalBundleManifestAsset {
  return {
    asset_id: asset.assetId,
    kind: asset.kind,
    local_path: asset.localPath,
    checksum: asset.checksumReady ? `sha256-${"a".repeat(64)}` : "sha256-placeholder-not-ready",
    rights_status: asset.rightsStatus,
    poster_path: asset.posterPath,
    transcript_path: asset.transcriptPath,
    scan_status: asset.scanStatus,
    target_mapping_reviewed: asset.targetMappingReviewed,
    alt_text_ready: asset.altTextReady,
  };
}

function BoundaryFact({ label }: { label: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3 text-sm font-semibold text-[var(--tenant-text)]">{label}</div>;
}
