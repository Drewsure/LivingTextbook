import {
  createPublisherPilotQrPreview,
  validatePublisherPilotQrPreview,
  type PublisherPilotIntakeQrPreview,
} from "@living-textbook/content-model";
import { samplePublisherPilotIntakeBrief } from "@/data/samplePublisherPilotIntakeBrief";

export const samplePublisherPilotQrPreview: PublisherPilotIntakeQrPreview = createPublisherPilotQrPreview(
  samplePublisherPilotIntakeBrief,
  "sample-publisher-l1-u1-routines-package",
);

export const samplePublisherPilotQrPreviewErrors = validatePublisherPilotQrPreview(samplePublisherPilotQrPreview);
