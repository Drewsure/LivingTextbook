import {
  createPilotDeliveryManifest,
  validatePilotDeliveryManifest,
  type PilotDeliveryManifest,
} from "@living-textbook/content-model";
import { samplePackageReadinessReconciliations } from "@/data/samplePackageReadinessReconciliation";
import { samplePublisherPilotPackagePreview } from "@/data/samplePublisherPilotPackagePreview";

const reconciliation = samplePackageReadinessReconciliations.find(
  (candidate) => candidate.packageId === samplePublisherPilotPackagePreview.packageId,
);

if (!reconciliation) throw new Error("Sample pilot delivery manifest requires package reconciliation.");

export const samplePilotDeliveryManifest: PilotDeliveryManifest = createPilotDeliveryManifest({
  preview: samplePublisherPilotPackagePreview,
  reconciliation,
  mode: "hosted-pwa",
  gates: {
    sourceReview: false,
    packageReadiness: false,
    multimediaRights: false,
    gameAudio: false,
    qrRegistry: false,
    qrPrintAuthorization: false,
    localBundle: false,
    hostedPersistence: false,
    teacherPolicy: false,
    releaseApproval: false,
  },
});

export const samplePilotDeliveryManifestErrors = validatePilotDeliveryManifest(samplePilotDeliveryManifest);
