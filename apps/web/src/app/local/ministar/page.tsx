import { AppShell } from "@/components/layout/AppShell";
import { sampleLocalBundleManifests } from "@/data/sampleLocalBundlePlan";
import { sampleLocalCompanionReleaseGate, sampleLocalDeploymentPreflightPlan } from "@/data/sampleLocalDeploymentPreflight";
import { sampleMediaBundleIntegrityPlan } from "@/data/sampleMediaBundleIntegrity";
import { samplePwaOfflineReadinessGate } from "@/data/samplePwaOfflineReadiness";
import { samplePersistenceHandoffPacket } from "@/data/samplePersistenceHandoffPacket";
import { LocalCompanionPackagePreviewPanel } from "@/features/deployment/LocalCompanionPackagePreviewPanel";
import { MediaBundleIntegrityPanel } from "@/features/deployment/MediaBundleIntegrityPanel";
import { PwaOfflineReadinessPanel } from "@/features/deployment/PwaOfflineReadinessPanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { resolveSampleTeacherSessionMonitorContext } from "@/data/sampleTeacherSessionMonitor";
import { resolveSampleTeacherReportSnapshotRecoveryRehearsal } from "@/data/sampleTeacherReportSnapshotRecoveryRehearsal";

export default function MinistarLocalCompanionPage() {
  const manifest = sampleLocalBundleManifests.find((item) => item.bundleId === "ministar-level-1-unit-1-demo") ?? sampleLocalBundleManifests[0];

  if (!manifest) {
    throw new Error("MiniStar local companion preview requires at least one sample local bundle manifest.");
  }

  return (
    <AppShell tenant={ministarTenant}>
      <div className="grid gap-5">
        <PwaOfflineReadinessPanel gate={samplePwaOfflineReadinessGate} />
        <MediaBundleIntegrityPanel plan={sampleMediaBundleIntegrityPlan} />
        <LocalCompanionPackagePreviewPanel
          manifest={manifest}
          tenantId={ministarTenant.id}
          preflight={sampleLocalDeploymentPreflightPlan}
          releaseGate={sampleLocalCompanionReleaseGate}
          persistencePacket={samplePersistenceHandoffPacket}
          reportSnapshotRecovery={resolveSampleTeacherReportSnapshotRecoveryRehearsal(
            resolveSampleTeacherSessionMonitorContext("demo-unit-1"),
          )}
        />
      </div>
    </AppShell>
  );
}
