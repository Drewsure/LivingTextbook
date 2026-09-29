import {
  createPilotDeliveryReleaseReceipt,
  validatePilotDeliveryReleaseReceipt,
  type PilotDeliveryReleaseReceipt,
} from "@living-textbook/content-model";
import { samplePilotDeliveryManifest } from "@/data/samplePilotDeliveryManifest";

export const samplePilotDeliveryReleaseReceipt: PilotDeliveryReleaseReceipt = createPilotDeliveryReleaseReceipt({
  manifest: samplePilotDeliveryManifest,
});

export const samplePilotDeliveryReleaseReceiptErrors = validatePilotDeliveryReleaseReceipt(samplePilotDeliveryReleaseReceipt);
