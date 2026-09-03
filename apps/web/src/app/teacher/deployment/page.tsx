import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleDeploymentDecisionGuide } from "@/data/sampleDeploymentDecisionGuide";
import { sampleDeploymentProfiles } from "@/data/sampleDeploymentProfiles";
import { sampleLocalBundleManifests } from "@/data/sampleLocalBundlePlan";
import { sampleLocalDeploymentPreflightPlan } from "@/data/sampleLocalDeploymentPreflight";
import { sampleMediaBundleIntegrityPlan } from "@/data/sampleMediaBundleIntegrity";
import { samplePwaOfflineReadinessGate } from "@/data/samplePwaOfflineReadiness";
import { sampleWhiteLabelPackageCatalog } from "@/data/sampleWhiteLabelPackageCatalog";
import { DeploymentDecisionGuidePanel } from "@/features/deployment/DeploymentDecisionGuidePanel";
import { DeploymentProfilePanel } from "@/features/deployment/DeploymentProfilePanel";
import { LocalBundleManifestPanel } from "@/features/deployment/LocalBundleManifestPanel";
import { LocalDeploymentPreflightPanel } from "@/features/deployment/LocalDeploymentPreflightPanel";
import { MediaBundleIntegrityPanel } from "@/features/deployment/MediaBundleIntegrityPanel";
import { PwaOfflineReadinessPanel } from "@/features/deployment/PwaOfflineReadinessPanel";
import { PackageTierCatalogPanel } from "@/features/entitlements/PackageTierCatalogPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

const deploymentLinks = [
  { href: "/teacher/intake", label: "Foundation control room" },
  { href: "/teacher/persistence", label: "Persistence readiness" },
  { href: "/teacher/entitlements", label: "Package entitlements" },
  { href: "/local/sample-publisher", label: "Partner local preview" },
  { href: "/local/ministar", label: "MiniStar local preview" },
];

export default function TeacherDeploymentPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Deployment decision workbench</p>
              <h2 className="mt-1 text-2xl font-bold">Hosted PWA, local classroom server, and packaged companion decisions</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This focused workbench gathers the saleable deployment choices for a white-label Living Textbook package.
                Hosted PWA is the practical first pilot path; local classroom server and closed packaged companion remain
                visible as future paid options until storage, media, QR, report, school policy, and rollback evidence passes.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <StatusPill label="Review-only" tone="warning" />
              <StatusPill label="No offline-ready claim" tone="warning" />
              <StatusPill label="No local package activation" tone="warning" />
              <StatusPill label="Cost controlled" tone="success" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {deploymentLinks.map((link) => (
              <DeploymentLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing deployment gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Deployment choices cannot bypass target-language progress, learning audio priority, private assignment
              rules, school policy, media rights, checksum manifests, backend selection, report/export policy, release
              control, or tenant package entitlements. The page is a decision workbench, not a publishing or installer tool.
            </p>
          </section>
        </Card>

        <DeploymentDecisionGuidePanel guide={sampleDeploymentDecisionGuide} />
        <DeploymentProfilePanel profiles={sampleDeploymentProfiles} />
        <PwaOfflineReadinessPanel gate={samplePwaOfflineReadinessGate} />
        <MediaBundleIntegrityPanel plan={sampleMediaBundleIntegrityPlan} />
        <LocalDeploymentPreflightPanel plan={sampleLocalDeploymentPreflightPlan} />
        <LocalBundleManifestPanel manifests={sampleLocalBundleManifests} />
        <PackageTierCatalogPanel packages={sampleWhiteLabelPackageCatalog} />
      </div>
    </AppShell>
  );
}

function DeploymentLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
      href={href}
    >
      {label}
      <span className="mt-1 block break-words text-xs font-semibold text-[var(--tenant-muted)]">{href}</span>
    </a>
  );
}
