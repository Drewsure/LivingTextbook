import {
  createReviewOnlyPublisherPilotPackageReadinessBinding,
  validatePublisherPilotPackageReadinessBindingAgainstSources,
  type PublisherPilotPackageReadinessBinding,
} from "@living-textbook/content-model";
import { sampleHostedPersistenceOptInDecisionPacket } from "@/data/sampleHostedPersistenceOptInDecisionPacket";
import { samplePackageReadinessReconciliations } from "@/data/samplePackageReadinessReconciliation";
import { samplePilotDeliveryManifest } from "@/data/samplePilotDeliveryManifest";
import { samplePilotDeliveryReleaseReceipt } from "@/data/samplePilotDeliveryReleaseReceipt";
import { samplePublisherPilotPackagePreview } from "@/data/samplePublisherPilotPackagePreview";
import { createPilotDeliveryPackageIndex } from "@living-textbook/content-model";

const reconciliation = samplePackageReadinessReconciliations.find(
  (candidate) => candidate.packageId === samplePublisherPilotPackagePreview.packageId,
);

if (!reconciliation) throw new Error("Publisher package readiness binding requires a package reconciliation.");

const packageIndex = createPilotDeliveryPackageIndex({
  manifest: samplePilotDeliveryManifest,
  receipt: samplePilotDeliveryReleaseReceipt,
});

const reviewPacketId = sampleHostedPersistenceOptInDecisionPacket.reviewPacketId;

export const samplePublisherPilotPackageReadinessBinding: PublisherPilotPackageReadinessBinding = createReviewOnlyPublisherPilotPackageReadinessBinding({
  bindingId: "sample-publisher-l1-u1-routines-package:publisher-readiness-binding",
  tenantId: samplePublisherPilotPackagePreview.tenantId,
  packageId: samplePublisherPilotPackagePreview.packageId,
  quarantineId: sampleHostedPersistenceOptInDecisionPacket.quarantineId,
  reviewPacketId,
  handoffPreviewId: `${samplePublisherPilotPackagePreview.packageId}:${sampleHostedPersistenceOptInDecisionPacket.quarantineId}:handoff-preview`,
  assemblyPreflightId: `${reviewPacketId}:assembly-preflight`,
  packagePreviewId: samplePublisherPilotPackagePreview.previewId,
  readinessReconciliationId: reconciliation.reconciliationId,
  deliveryManifestId: samplePilotDeliveryManifest.manifestId,
  deliveryReleaseReceiptId: samplePilotDeliveryReleaseReceipt.receiptId,
  deliveryPackageIndexId: `${samplePilotDeliveryManifest.manifestId}:package-index`,
  hostedPersistenceDecisionPacketId: sampleHostedPersistenceOptInDecisionPacket.packetId,
  sourceChecksumSha256: reconciliation.sourceAssemblyChecksum.replace(/^sha256:/, ""),
  checks: [
    {
      checkId: "quarantine-review",
      label: "Quarantine source review",
      status: "open",
      evidence: "The publisher source remains in quarantine and the human review decision is not recorded.",
      nextAction: "Review the supplied textbook source and record the bounded package-review decision.",
    },
    {
      checkId: "review-packet",
      label: "Package review packet",
      status: "blocked",
      evidence: "The packet identity is reserved, but this sample has no accepted source-review decision.",
      nextAction: "Record the review packet through the explicitly gated teacher workflow.",
    },
    {
      checkId: "assembly-preflight",
      label: "Assembly preflight",
      status: "blocked",
      evidence: "Assembly preflight requires the review packet plus delivery, release, media, and policy evidence.",
      nextAction: "Resolve the package inputs before a writer can be considered.",
    },
    {
      checkId: "package-preview",
      label: "Content, game, and media preview",
      status: "blocked",
      evidence: "The preview identifies the package shape, but publisher files, media rights, checksums, and release evidence are missing.",
      nextAction: "Supply and review the textbook, audio, video, image, font, and game evidence.",
    },
    {
      checkId: "readiness-reconciliation",
      label: "Readiness reconciliation",
      status: "blocked",
      evidence: "Source, verifier, audio, media-rights, publish, and assignment lanes remain open.",
      nextAction: "Close each release-blocking readiness lane and reconcile the source checksum.",
    },
    {
      checkId: "delivery-manifest",
      label: "Delivery manifest",
      status: "blocked",
      evidence: "Hosted, local, and hybrid delivery are described, but no delivery gate is closed.",
      nextAction: "Select the pilot delivery shape and close its manifest gates.",
    },
    {
      checkId: "release-receipt",
      label: "Manual release receipt",
      status: "blocked",
      evidence: "Named release approval, QR print authorization, and rollback evidence are not recorded.",
      nextAction: "Complete human release review only after every package gate passes.",
    },
    {
      checkId: "package-index",
      label: "Metadata-only package index",
      status: "blocked",
      evidence: "The index preserves delivery identity, but it correctly remains review-only while its receipt is blocked.",
      nextAction: "Rebuild the index from the same approved manifest and release receipt after review.",
    },
    {
      checkId: "hosted-opt-in",
      label: "Hosted persistence opt-in",
      status: "blocked",
      evidence: "The package-scoped opt-in packet has no provider selection, policy acceptance, cost limit, or activation authority.",
      nextAction: "Keep closed-local fallback available and record a separate human hosted decision only if the publisher opts in.",
    },
  ],
  nextGates: [
    "Complete the publisher source and multimedia evidence review.",
    "Record the package review packet and rerun assembly preflight.",
    "Choose closed-local, hosted, or hybrid delivery with a named owner.",
    "Complete release, QR, policy, recovery, and classroom rehearsal gates.",
  ],
});

export const samplePublisherPilotPackageReadinessBindingErrors = validatePublisherPilotPackageReadinessBindingAgainstSources(
  samplePublisherPilotPackageReadinessBinding,
  {
    preview: samplePublisherPilotPackagePreview,
    reconciliation,
    manifest: samplePilotDeliveryManifest,
    receipt: samplePilotDeliveryReleaseReceipt,
    packageIndex,
    hostedPersistenceDecisionPacket: sampleHostedPersistenceOptInDecisionPacket,
  },
);
