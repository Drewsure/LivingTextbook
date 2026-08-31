import { AppShell } from "@/components/layout/AppShell";
import { sampleLocalBundleManifests } from "@/data/sampleLocalBundlePlan";
import { sampleLocalCompanionReleaseGate, sampleLocalDeploymentPreflightPlan } from "@/data/sampleLocalDeploymentPreflight";
import { LocalCompanionPackagePreviewPanel } from "@/features/deployment/LocalCompanionPackagePreviewPanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default function MinistarLocalCompanionPage() {
  const manifest = sampleLocalBundleManifests.find((item) => item.bundleId === "ministar-level-1-unit-1-demo") ?? sampleLocalBundleManifests[0];

  if (!manifest) {
    throw new Error("MiniStar local companion preview requires at least one sample local bundle manifest.");
  }

  return (
    <AppShell tenant={ministarTenant}>
      <LocalCompanionPackagePreviewPanel
        manifest={manifest}
        preflight={sampleLocalDeploymentPreflightPlan}
        releaseGate={sampleLocalCompanionReleaseGate}
      />
    </AppShell>
  );
}
