import {
  createPublisherSubmissionReviewHandoff,
  validatePublisherSubmissionReviewHandoff,
  type PublisherSubmissionManifest,
  type PublisherSubmissionReviewHandoff,
} from "@living-textbook/content-model";

export function createPublisherSubmissionReviewHandoffPreview(
  manifest: PublisherSubmissionManifest,
  tenantId: string,
): PublisherSubmissionReviewHandoff {
  return createPublisherSubmissionReviewHandoff(manifest, {
    sourceManifestRoute: `/teacher/uploads/${tenantId}`,
    evidenceIndexRoute: `/teacher/evidence/${tenantId}`,
    evidenceHandoffRoute: `/teacher/evidence/${tenantId}/handoff`,
  });
}

export function validatePublisherSubmissionReviewHandoffPreview(
  handoff: PublisherSubmissionReviewHandoff,
  manifest: PublisherSubmissionManifest,
): string[] {
  return validatePublisherSubmissionReviewHandoff(handoff, manifest);
}
