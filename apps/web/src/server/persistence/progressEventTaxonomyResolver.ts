import type { ProgressEventTaxonomyRegistry } from "@living-textbook/content-model";
import { sampleProgressEventTaxonomyRegistry } from "@/data/sampleProgressEventTaxonomy";

interface TaxonomyBinding {
  tenantId: string;
  packageId: string;
  registry: ProgressEventTaxonomyRegistry;
}

const sampleBindings: TaxonomyBinding[] = [
  {
    tenantId: "ministar",
    packageId: "ministar-l1-u1-greetings-package",
    registry: sampleProgressEventTaxonomyRegistry,
  },
  {
    tenantId: "sample-publisher",
    packageId: "sample-publisher-l1-u1-routines-package",
    registry: sampleProgressEventTaxonomyRegistry,
  },
];

/**
 * Resolves taxonomy from the reviewed package identity. There is deliberately
 * no global fallback: an unknown tenant/package must remain blocked until its
 * package supplies an approved taxonomy binding.
 */
export function resolveProgressEventTaxonomy(
  tenantId: string,
  packageId: string,
): ProgressEventTaxonomyRegistry | undefined {
  return sampleBindings.find((binding) => binding.tenantId === tenantId && binding.packageId === packageId)?.registry;
}
