import {
  createPilotQrAliasRegistryPreview,
  validatePilotQrAliasRegistryPreview,
  type PilotQrAliasRegistryEntry,
  type PilotQrAliasRegistryPreview,
} from "@living-textbook/content-model";
import { samplePilotDeliveryManifest } from "@/data/samplePilotDeliveryManifest";
import { samplePilotDeliveryReleaseReceipt } from "@/data/samplePilotDeliveryReleaseReceipt";
import { samplePublisherPilotPackagePreview } from "@/data/samplePublisherPilotPackagePreview";

const entries: PilotQrAliasRegistryEntry[] = samplePublisherPilotPackagePreview.qrPreviews.map((qr) => ({
  aliasId: `qr-alias:${qr.printedQrId}`,
  printedQrId: qr.printedQrId,
  tenantId: samplePilotDeliveryManifest.tenantId,
  packageId: samplePilotDeliveryManifest.packageId,
  version: samplePilotDeliveryManifest.version,
  aliasPath: qr.aliasPath,
  fallbackPath: qr.fallbackPath,
  targetLabel: qr.targetLabel,
  deploymentTargets: [...qr.deploymentTargets],
  status: qr.status === "draft-only" ? "draft-only" : "blocked",
  rollbackEvidenceId: null,
}));

export const samplePilotQrAliasRegistry: PilotQrAliasRegistryPreview = createPilotQrAliasRegistryPreview({
  manifest: samplePilotDeliveryManifest,
  receipt: samplePilotDeliveryReleaseReceipt,
  entries,
});

export const samplePilotQrAliasRegistryErrors = validatePilotQrAliasRegistryPreview(samplePilotQrAliasRegistry);
