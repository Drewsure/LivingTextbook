import {
  deriveLocalBundleMediaReleaseControlBinding,
  validateLocalBundleMediaReleaseControlBinding,
  type LocalBundleMediaReleaseControlBinding,
} from "@living-textbook/content-model";
import { sampleLocalBundleMediaManifestReconciliation } from "./sampleLocalBundleMediaManifestReconciliation";
import { samplePackagePublishGate } from "./samplePackagePublishGate";

export const sampleLocalBundleMediaReleaseControlBinding: LocalBundleMediaReleaseControlBinding =
  deriveLocalBundleMediaReleaseControlBinding(sampleLocalBundleMediaManifestReconciliation, {
    releaseGateId: samplePackagePublishGate.gateId,
    releaseGateTenantId: samplePackagePublishGate.tenantId,
    releaseGatePackageId: samplePackagePublishGate.packageId,
    releaseGateMediaStatus: samplePackagePublishGate.items.find((item) => item.gateId === "audio-video-rights")?.status ?? "missing",
    requiredApprovals: ["Media rights approval", "Package release gate", "School or publisher release acceptance"],
  });

export const sampleLocalBundleMediaReleaseControlBindingErrors = validateLocalBundleMediaReleaseControlBinding(
  sampleLocalBundleMediaReleaseControlBinding,
);
