import {
  buildPackageReadinessPersistenceIntent,
  validatePackageReadinessPersistenceIntents,
  type PackageReadinessPersistenceIntent,
} from "@living-textbook/content-model";
import { samplePackageReadinessReconciliations } from "@/data/samplePackageReadinessReconciliation";

export const samplePackageReadinessPersistenceIntents: PackageReadinessPersistenceIntent[] = samplePackageReadinessReconciliations.flatMap(
  (reconciliation) => [
    buildPackageReadinessPersistenceIntent(reconciliation, "hosted-database"),
    buildPackageReadinessPersistenceIntent(reconciliation, "local-classroom-store"),
  ],
);

export const samplePackageReadinessPersistenceErrors = validatePackageReadinessPersistenceIntents(
  samplePackageReadinessPersistenceIntents,
);
