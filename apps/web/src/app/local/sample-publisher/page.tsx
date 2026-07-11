import { AppShell } from "@/components/layout/AppShell";
import { sampleLocalBundleManifests } from "@/data/sampleLocalBundlePlan";
import { sampleLocalCompanionReleaseGate, sampleLocalDeploymentPreflightPlan } from "@/data/sampleLocalDeploymentPreflight";
import { LocalCompanionPackagePreviewPanel } from "@/features/deployment/LocalCompanionPackagePreviewPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default function SamplePublisherLocalCompanionPage() {
  const manifest = sampleLocalBundleManifests.find((item) => item.bundleId === "sample-publisher-unit-1-planning") ?? sampleLocalBundleManifests[0];

  if (!manifest) {
    throw new Error("Local companion preview requires at least one sample local bundle manifest.");
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <LocalCompanionPackagePreviewPanel
        manifest={manifest}
        preflight={sampleLocalDeploymentPreflightPlan}
        releaseGate={sampleLocalCompanionReleaseGate}
      />
    </AppShell>
  );
}
