import {
  createPilotQrPrintAuthorizationPreflight,
  validatePilotQrPrintAuthorizationPreflight,
  type PilotQrPrintAuthorizationPreflight,
} from "@living-textbook/content-model";
import { samplePilotDeliveryManifest } from "@/data/samplePilotDeliveryManifest";
import { samplePilotDeliveryReleaseReceipt } from "@/data/samplePilotDeliveryReleaseReceipt";
import { samplePilotQrAliasRegistry } from "@/data/samplePilotQrAliasRegistry";

export const samplePilotQrPrintAuthorizationPreflight: PilotQrPrintAuthorizationPreflight = createPilotQrPrintAuthorizationPreflight({
  manifest: samplePilotDeliveryManifest,
  receipt: samplePilotDeliveryReleaseReceipt,
  registry: samplePilotQrAliasRegistry,
});

export const samplePilotQrPrintAuthorizationPreflightErrors = validatePilotQrPrintAuthorizationPreflight(samplePilotQrPrintAuthorizationPreflight);
