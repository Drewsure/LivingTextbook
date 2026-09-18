import {
  reconcileLocalBundleMediaManifest,
  type LocalBundleMediaManifestReconciliation,
} from "@living-textbook/content-model";
import { sampleLocalBundleMediaEvidenceBinding } from "./sampleLocalBundleMediaEvidenceBinding";
import { sampleLocalBundlePackageManifestRollbackDryRun } from "./sampleLocalBundlePackageManifestRollbackDryRun";

export const sampleLocalBundleMediaManifestReconciliation: LocalBundleMediaManifestReconciliation =
  reconcileLocalBundleMediaManifest(
    sampleLocalBundlePackageManifestRollbackDryRun,
    sampleLocalBundleMediaEvidenceBinding,
  );
