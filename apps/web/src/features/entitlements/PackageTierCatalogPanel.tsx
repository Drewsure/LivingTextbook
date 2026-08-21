import { Card, StatusPill } from "@living-textbook/ui";
import type {
  WhiteLabelPackageCatalogItem,
  WhiteLabelPackageStatus,
  WhiteLabelPackageTier,
} from "@/data/sampleWhiteLabelPackageCatalog";

interface PackageTierCatalogPanelProps {
  packages: WhiteLabelPackageCatalogItem[];
}

const tierLabels: Record<WhiteLabelPackageTier, string> = {
  core: "Core",
  premium: "Premium",
  enterprise: "Enterprise",
};

const statusLabels: Record<WhiteLabelPackageStatus, string> = {
  included: "Included",
  "optional-add-on": "Optional add-on",
  "policy-blocked": "Policy blocked",
};

const statusTone: Record<WhiteLabelPackageStatus, "success" | "warning"> = {
  included: "success",
  "optional-add-on": "warning",
  "policy-blocked": "warning",
};

export function PackageTierCatalogPanel({ packages }: PackageTierCatalogPanelProps) {
  const premiumCount = packages.filter((item) => item.tier !== "core").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">White-label package catalog</p>
          <h2 className="mt-1 text-lg font-bold">Base platform first, optional packages second</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This catalog keeps the saleable package structure explicit: the core classroom PWA stays useful without
            premium services, while AI authoring, Voice Tutor, speech scoring, hosted storage, report export, and local
            companion delivery remain adult-approved add-ons.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={`${packages.length} package option(s)`} tone="success" />
          <StatusPill label={`${premiumCount} optional package(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {packages.map((packageItem) => (
          <article key={packageItem.packageId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{tierLabels[packageItem.tier]}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packageItem.label}</h3>
              </div>
              <StatusPill label={statusLabels[packageItem.status]} tone={statusTone[packageItem.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{packageItem.summary}</p>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <CatalogList title="Included capabilities" items={packageItem.includedCapabilities} packageId={packageItem.packageId} />
              <CatalogList title="Adoption requirements" items={packageItem.adoptionRequirements} packageId={packageItem.packageId} />
              <CatalogList title="Cost controls" items={packageItem.costControls} packageId={packageItem.packageId} />
              <CatalogList title="Child safety rules" items={packageItem.childSafetyRules} packageId={packageItem.packageId} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function CatalogList({ title, items, packageId }: { title: string; items: string[]; packageId: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone="neutral" />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${packageId}-${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
