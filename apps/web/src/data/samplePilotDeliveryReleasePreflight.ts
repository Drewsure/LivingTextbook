import {
  createPilotDeliveryReleasePreflight,
  validatePilotDeliveryReleasePreflight,
  type PilotDeliveryReleasePreflight,
} from "@living-textbook/content-model";
import { samplePilotDeliveryManifest } from "@/data/samplePilotDeliveryManifest";
import { samplePilotDeliveryReleaseReceipt } from "@/data/samplePilotDeliveryReleaseReceipt";
import { samplePilotQrAliasRegistry } from "@/data/samplePilotQrAliasRegistry";

export const samplePilotDeliveryReleasePreflight: PilotDeliveryReleasePreflight = createPilotDeliveryReleasePreflight({
  manifest: samplePilotDeliveryManifest,
  receipt: samplePilotDeliveryReleaseReceipt,
  qrRegistry: samplePilotQrAliasRegistry,
});

export const samplePilotDeliveryReleasePreflightErrors = validatePilotDeliveryReleasePreflight(samplePilotDeliveryReleasePreflight);
