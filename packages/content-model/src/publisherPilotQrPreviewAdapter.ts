import {
  validatePublisherPilotQrPreview,
  type PublisherPilotIntakeQrPreview,
} from "./publisherPilotQrPreview";
import type { PublisherPilotQrPreview } from "./publisherPilotPackagePreview";

/**
 * Rebinds the upload-side QR preview to the package-preview contract.
 *
 * This is deliberately an adapter, not a registry writer. It preserves the
 * reviewed alias identities while keeping package preview and production QR
 * authorization as separate gates.
 */
export function createPublisherPilotPackageQrPreviewsFromIntakePreview(
  preview: PublisherPilotIntakeQrPreview,
  packageIdentity: { tenantId: string; packageId: string; version: string },
): PublisherPilotQrPreview[] {
  const errors = validatePublisherPilotQrPreview(preview);
  if (errors.length > 0) throw new Error(`Publisher QR preview cannot enter package review: ${errors.join(" ")}`);
  if (preview.tenantId !== packageIdentity.tenantId) throw new Error("Publisher QR preview tenant does not match the package preview.");
  if (preview.packageId !== packageIdentity.packageId) throw new Error("Publisher QR preview package does not match the package preview.");
  if (preview.version !== packageIdentity.version) throw new Error("Publisher QR preview version does not match the package preview.");

  return preview.entries.map((entry) => ({
    printedQrId: entry.printedQrId,
    aliasPath: entry.aliasPath,
    fallbackPath: entry.fallbackPath,
    targetLabel: `${entry.targetType}: ${entry.activitySlug}`,
    deploymentTargets: deploymentTargetsFor(entry.targetType),
    status: "draft-only" as const,
    printAllowed: false as const,
  }));
}

function deploymentTargetsFor(targetType: PublisherPilotIntakeQrPreview["entries"][number]["targetType"]): PublisherPilotQrPreview["deploymentTargets"] {
  if (targetType === "front-door") return ["hosted-route", "local-bundle", "hybrid"];
  if (targetType === "media-playlist") return ["hosted-route", "hybrid"];
  return ["hosted-route", "local-bundle", "hybrid"];
}
