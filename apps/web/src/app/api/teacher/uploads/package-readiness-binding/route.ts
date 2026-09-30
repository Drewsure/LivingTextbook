import { NextResponse } from "next/server";
import {
  createReviewOnlyHostedPersistenceOptInDecisionPacket,
  createReviewOnlyPublisherPilotPackageReadinessBinding,
  createUploadQuarantinePackageAssemblyPreflight,
  createUploadQuarantinePackageHandoffPreview,
  deriveUploadQuarantineAdmissionPreview,
  createReviewOnlyUploadQuarantineDeliveryManifestPreview,
  isUploadQuarantineSafeTenantId,
  createReviewOnlyUploadQuarantineReleaseReceiptPreview,
  createReviewOnlyUploadQuarantinePackageIndexPreview,
  validatePublisherPilotPackageReadinessBindingRecord,
  validateUploadQuarantineDeliveryManifestPreview,
  validateUploadQuarantineReleaseReceiptPreview,
  validateUploadQuarantinePackageIndexPreview,
  createUploadQuarantineReleasePreflight,
  createPublisherDeliveryClosurePacket,
  validatePublisherDeliveryClosurePacket,
  validateUploadQuarantineReleasePreflight,
  type PublisherPilotPackageReadinessBinding,
  type PublisherPilotPackageReadinessCheck,
  type UploadQuarantinePackageAssemblyPreflight,
  type UploadQuarantinePackageHandoffPreview,
  type UploadQuarantinePackageReviewPacket,
  type UploadQuarantineDeliveryManifestPreview,
  type UploadQuarantinePackageEvidenceReview,
  type UploadQuarantineReleaseReceiptPreview,
  type UploadQuarantinePackageIndexPreview,
  type UploadQuarantineReviewDecisionRecord,
  type HostedPersistenceOptInDecisionPacket,
  type UploadQuarantinePromotionAdapterDecision,
  type UploadQuarantineReleasePreflight,
  type PublisherDeliveryClosurePacket,
  createPublisherDeliveryAssemblyRequestPreview,
  validatePublisherDeliveryAssemblyRequestPreview,
  type PublisherDeliveryAssemblyRequestPreview,
  createPublisherDeliveryHandoffRecord,
  validatePublisherDeliveryHandoffRecord,
  createPublisherSourceToPackageEvidenceBridge,
  validatePublisherSourceToPackageEvidenceBridge,
  type PublisherDeliveryHandoffRecord,
  type PublisherSourceToPackageEvidenceBridge,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { hasUploadQuarantineApiToken } from "@/server/uploads/uploadQuarantineAuthorization";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import {
  readQuarantinePackageReviewPacket,
  readQuarantineEvidenceReview,
  readQuarantineDeliveryModeDecision,
  readQuarantinePackageEvidenceReview,
  readQuarantinePromotionAdapterDecision,
  readQuarantineReviewDecision,
  readQuarantineSentenceApproval,
  readQuarantineUploadRecords,
} from "@/server/uploads/quarantineUploadStore";
import { deriveQuarantinePackageId } from "@/server/uploads/quarantinePackageIdentity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReadinessResponse = {
  status: "review-only" | "not-found" | "unauthorized" | "rejected";
  tenantId?: string;
  quarantineId?: string;
  handoff?: UploadQuarantinePackageHandoffPreview | null;
  packet?: UploadQuarantinePackageReviewPacket | null;
  preflight?: UploadQuarantinePackageAssemblyPreflight | null;
  binding?: PublisherPilotPackageReadinessBinding | null;
  deliveryManifestPreview?: UploadQuarantineDeliveryManifestPreview | null;
  deliveryModeDecision?: import("@living-textbook/content-model").UploadQuarantineDeliveryModeDecision | null;
  promotionAdapterDecision?: UploadQuarantinePromotionAdapterDecision | null;
  packageEvidenceReview?: UploadQuarantinePackageEvidenceReview | null;
  reviewDecision?: UploadQuarantineReviewDecisionRecord | null;
  releaseReceiptPreview?: UploadQuarantineReleaseReceiptPreview | null;
  packageIndexPreview?: UploadQuarantinePackageIndexPreview | null;
  hostedPersistenceOptInPacket?: HostedPersistenceOptInDecisionPacket | null;
  releasePreflight?: UploadQuarantineReleasePreflight | null;
  deliveryClosurePacket?: PublisherDeliveryClosurePacket | null;
  assemblyRequestPreview?: PublisherDeliveryAssemblyRequestPreview | null;
  deliveryHandoffRecord?: PublisherDeliveryHandoffRecord | null;
  sourcePackageEvidenceBinding?: PublisherSourceToPackageEvidenceBridge | null;
  sentenceApproval?: import("@living-textbook/content-model").PublisherSentenceApprovalRecord | null;
  errors?: string[];
  privacy: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  const requestedPackageId = readBoundedQueryParam(url, "packageId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", binding: null, errors: ["Package readiness binding query exceeds bounded identifier limits."], privacy: privacyMessage() }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", binding: null, errors: ["Package readiness binding requires a safe tenantId and quarantineId."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", binding: null, errors: ["Tenant-scoped teacher or service authorization is required for package readiness binding reads."], privacy: privacyMessage() }, 401);

  const intake = await readQuarantineUploadRecords(tenantId, quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== quarantineId) return json({ status: "not-found", tenantId, quarantineId, binding: null, errors: ["The requested quarantine record was not available for package readiness binding."], privacy: privacyMessage() }, 404);

  const packageId = requestedPackageId || deriveQuarantinePackageId(tenantId, summary.record.unitKey);
  const evidencePacketId = `evidence-packet:${summary.quarantineId}`;
  const evidenceReview = await readQuarantineEvidenceReview(tenantId, quarantineId);
  const promotionAdapterDecisionResult = await readQuarantinePromotionAdapterDecision(tenantId, quarantineId);
  const admission = deriveUploadQuarantineAdmissionPreview(summary.record, {
    ...(evidenceReview.record ?? {
      scanStatus: "pending" as const,
      rightsStatus: "unknown" as const,
      sourceReviewStatus: "unreviewed" as const,
      targetMappingReviewed: false,
      accessibilityReviewed: false,
      releaseApproved: false,
    }),
    evidencePacketId,
  }, promotionAdapterDecisionResult.record);
  const handoff = createUploadQuarantinePackageHandoffPreview({
    summary,
    admission,
    sourceId: `quarantine-record:${summary.quarantineId}`,
    packageId,
  });
  const packetResult = await readQuarantinePackageReviewPacket(tenantId, quarantineId);
  const packet = packetResult.record;
  const deliveryModeDecisionResult = await readQuarantineDeliveryModeDecision(tenantId, quarantineId);
  const deliveryModeDecision = deliveryModeDecisionResult.record;
  const packageEvidenceReviewResult = await readQuarantinePackageEvidenceReview(tenantId, quarantineId);
  const packageEvidenceReview = packageEvidenceReviewResult.record;
  const reviewDecisionResult = await readQuarantineReviewDecision(tenantId, quarantineId);
  const reviewDecision = reviewDecisionResult.record;
  const sentenceApprovalResult = await readQuarantineSentenceApproval(tenantId, quarantineId);
  const sentenceApproval = sentenceApprovalResult.record
    && sentenceApprovalResult.record.packageId === packageId
    && sentenceApprovalResult.record.sourceChecksumSha256 === summary.record.checksumSha256
    ? sentenceApprovalResult.record
    : null;
  const sourceChecksum = summary.record.checksumSha256.startsWith("sha256:")
    ? summary.record.checksumSha256
    : `sha256:${summary.record.checksumSha256}`;
  const sourcePackageEvidenceBinding = createPublisherSourceToPackageEvidenceBridge({
    tenantId,
    unitKey: summary.record.unitKey || `${tenantId}:unassigned`,
    sourceReviewId: reviewDecision?.decisionId ?? `source-review:${quarantineId}:pending`,
    extractionPreviewId: `source-extraction-preview:${quarantineId}:review-only`,
    extractionPacketId: `source-extraction-packet:${quarantineId}:review-only`,
    authoringProposalId: `${packageId}:authoring-proposal:review-only`,
    sourceChecksum,
    sourceTermsReviewed: reviewDecision?.decision === "accepted-for-package-review",
    sentenceApprovalRecorded: sentenceApproval?.decision === "approved",
    audioEvidenceReady: packageEvidenceReview?.reviewedLanes.includes("audio") ?? false,
    mediaRightsReady: packageEvidenceReview?.reviewedLanes.includes("rights") ?? false,
    gameVerificationReady: packageEvidenceReview?.reviewedLanes.includes("game") ?? false,
  });
  const sourcePackageEvidenceBindingErrors = validatePublisherSourceToPackageEvidenceBridge(sourcePackageEvidenceBinding);
  const hostedDeliveryMode = deliveryModeDecision?.selectedMode === "hosted-pwa"
    ? "hosted-managed"
    : deliveryModeDecision?.selectedMode === "hybrid"
      ? "hybrid-registry-local-media"
      : null;
  const hostedPersistenceOptInPacket = hostedDeliveryMode
    ? createReviewOnlyHostedPersistenceOptInDecisionPacket({
      tenantId,
      packageId,
      quarantineId,
      reviewPacketId: packet?.packetId ?? `${packageId}:${quarantineId}:package-review-packet`,
      sourceChecksumSha256: summary.record.checksumSha256,
      deliveryMode: hostedDeliveryMode,
      packageReviewLineageStatus: packet?.status === "ready-for-next-gate" && packageEvidenceReview?.status === "reviewed-package-evidence" ? "passed" : "blocked",
      packageReviewLineageEvidence: packet?.status === "ready-for-next-gate" && packageEvidenceReview?.status === "reviewed-package-evidence" ? "The live package review packet and complete package evidence are present for this checksum." : "The live package review packet or complete package evidence is not ready for hosted review.",
    })
    : null;
  const preflight = packet ? createUploadQuarantinePackageAssemblyPreflight({
    packet,
    additionalBlockers: [
      ...(packageEvidenceReview?.status === "reviewed-package-evidence" ? [] : ["A complete reviewed multimedia and game evidence sidecar is not linked to this quarantine review packet."]),
      ...(sentenceApproval?.decision === "approved" ? [] : ["Exactly two approved English target sentences are not bound to this package checksum."]),
      "An approved delivery manifest is not linked to this quarantine review packet.",
      "A manual release receipt and QR print authorization are not linked to this quarantine review packet.",
      "An approved local bundle or hosted deployment handoff is not linked to this quarantine review packet.",
    ],
  }) : null;
  const reviewPacketId = packet?.packetId ?? `${packageId}:${quarantineId}:package-review-packet`;
  const deliveryManifestPreview = createReviewOnlyUploadQuarantineDeliveryManifestPreview({
    tenantId,
    quarantineId,
    packageId,
    sourceChecksumSha256: summary.record.checksumSha256,
    selectedMode: deliveryModeDecision?.selectedMode ?? "unselected",
    evidenceReviewId: evidenceReview.record?.reviewId ?? null,
    packageReviewPacketId: packet?.packetId ?? null,
    checks: [
      check("source-evidence", "Source and evidence review", handoff.admissionDecision === "evidence-ready" ? "passed" : "blocked", handoff.admissionDecision === "evidence-ready" ? "The source evidence review is complete for this metadata handoff." : handoff.blockers.join(" ") || "Source evidence remains incomplete.", "Complete scan, rights, source, mapping, accessibility, and release evidence."),
      check("package-review", "Package review packet", packet?.status === "ready-for-next-gate" ? "passed" : packet ? "blocked" : "open", packet ? packet.blockers.join(" ") || "The immutable package review packet is ready for the next gate." : "No durable package review packet is linked.", "Record and reconcile the package review packet."),
      check("delivery-mode", "Delivery mode selection", deliveryModeDecision ? "passed" : "open", deliveryModeDecision ? `The publisher selected ${deliveryModeDecision.selectedMode} for review-only planning.` : "No local, hosted, or hybrid delivery mode has been selected for this submission.", deliveryModeDecision ? "Keep the selected mode aligned with the final release and policy packet." : "Choose closed-local, hosted PWA, or hybrid delivery."),
    check("promotion-adapter", "Promotion adapter selection", promotionAdapterDecisionResult.record ? "passed" : "open", promotionAdapterDecisionResult.record ? `The ${promotionAdapterDecisionResult.record.selectedAdapter} pathway is recorded for review-only planning.` : "No reviewed package adapter has been selected for this submission.", promotionAdapterDecisionResult.record ? "Keep the adapter aligned with the final manifest mode and package evidence." : "Select the closed-local, hosted PWA, or hybrid package adapter."),
      check("package-preview", "Reviewed package preview", packageEvidenceReview?.status === "reviewed-package-evidence" ? "passed" : "blocked", packageEvidenceReview?.status === "reviewed-package-evidence" ? "Reviewed content, game, multimedia, accessibility, and rights evidence is linked to this quarantine." : "A reviewed multimedia/game package is not linked to this live quarantine submission.", "Record complete content, game, audio, video, image, font, accessibility, and rights evidence."),
      check("release-receipt", "Manual release receipt", "blocked", "No approved delivery manifest or named release receipt is linked.", "Complete release, rollback, school-policy, and operator review."),
      check("qr-print", "QR print authorization", "blocked", "Production QR printing remains blocked for this live submission.", "Validate stable aliases, local fallback, release checksum, and print authorization."),
    ],
  });
  const deliveryManifestPreviewErrors = validateUploadQuarantineDeliveryManifestPreview(deliveryManifestPreview);
  const releaseReceiptPreview = createReviewOnlyUploadQuarantineReleaseReceiptPreview({
    deliveryManifestPreview,
    checks: [
      check("delivery-manifest", "Delivery manifest", deliveryManifestPreview.status === "blocked" ? "blocked" : "passed", deliveryManifestPreview.status === "blocked" ? "The live delivery manifest is still review-only and blocked." : "The delivery manifest preview is structurally complete.", "Close all delivery-manifest checks before release review."),
      check("release-approval", "Named release approval", "blocked", "No named reviewer has approved this live quarantine for release.", "Record a separate human release decision against the exact manifest checksum."),
      check("qr-print", "QR print authorization", "blocked", "Production QR printing remains blocked for this live quarantine.", "Authorize print only after stable alias, release, rollback, and local fallback checks pass."),
      check("rollback", "Rollback reference", "blocked", "No approved rollback reference is linked to this live quarantine.", "Record the recovery target and operator owner before release."),
      check("package-index", "Package index", "blocked", "The metadata-only package index has not been created from an approved manifest and receipt.", "Create the index only after the manifest and receipt are approved together."),
    ],
  });
  const releaseReceiptPreviewErrors = validateUploadQuarantineReleaseReceiptPreview(releaseReceiptPreview);
  const packageIndexPreview = createReviewOnlyUploadQuarantinePackageIndexPreview({ deliveryManifestPreview, packageEvidenceReview });
  const packageIndexPreviewErrors = validateUploadQuarantinePackageIndexPreview(packageIndexPreview);
  const releasePreflight = createUploadQuarantineReleasePreflight({ deliveryManifestPreview, releaseReceiptPreview, packageIndexPreview });
  const releasePreflightErrors = validateUploadQuarantineReleasePreflight(releasePreflight);
  const deliveryClosurePacket = createPublisherDeliveryClosurePacket({
    tenantId,
    quarantineId,
    packageId,
    sourceId: handoff.sourceId,
    sourceChecksumSha256: handoff.checksumSha256,
    selectedMode: deliveryManifestPreview.selectedMode,
    sourceReviewPassed: reviewDecision?.decision === "accepted-for-package-review",
    sentenceApprovalPassed: sentenceApproval?.decision === "approved",
    packageEvidencePassed: packageEvidenceReview?.status === "reviewed-package-evidence",
    reviewPacketPassed: packet?.status === "ready-for-next-gate",
    assemblyPreflightPassed: preflight?.status === "ready-for-manual-assembly",
    deliveryModePassed: Boolean(deliveryModeDecision && promotionAdapterDecisionResult.record),
    releaseReceiptPassed: false,
    qrAuthorizationPassed: false,
    packageIndexPassed: false,
    rollbackAndPolicyPassed: false,
  });
  const deliveryClosurePacketErrors = validatePublisherDeliveryClosurePacket(deliveryClosurePacket);
  const assemblyRequestPreview = createPublisherDeliveryAssemblyRequestPreview({
    tenantId,
    quarantineId,
    packageId,
    sourceChecksumSha256: handoff.checksumSha256,
    selectedMode: deliveryManifestPreview.selectedMode,
    deliveryManifestPresent: false,
    releaseReceiptPresent: false,
    qrRegistryPresent: false,
    packageIndexPresent: false,
    bundleManifestPresent: false,
    reviewPacketBound: packet?.status === "ready-for-next-gate",
    operatorAndWriteTimePresent: false,
  });
  const assemblyRequestPreviewErrors = validatePublisherDeliveryAssemblyRequestPreview(assemblyRequestPreview);
  const deliveryHandoffRecord = createPublisherDeliveryHandoffRecord({
    tenantId,
    quarantineId,
    packageId,
    sourceChecksumSha256: handoff.checksumSha256,
    selectedMode: deliveryManifestPreview.selectedMode,
    sourceReviewPassed: reviewDecision?.decision === "accepted-for-package-review",
    packageReviewPacketId: packet?.packetId ?? null,
    packageReviewPacketReady: packet?.status === "ready-for-next-gate",
    deliveryManifestPreviewId: deliveryManifestPreview.previewId,
    releaseReceiptPreviewId: releaseReceiptPreview.previewId,
    packageIndexPreviewId: packageIndexPreview.previewId,
    assemblyRequestPreviewId: assemblyRequestPreview.previewId,
    qrRegistryId: null,
  });
  const deliveryHandoffRecordErrors = validatePublisherDeliveryHandoffRecord(deliveryHandoffRecord);
  const checks: PublisherPilotPackageReadinessCheck[] = [
    check("quarantine-review", "Quarantine source review", handoff.blockers.length === 0 && handoff.admissionDecision === "evidence-ready" ? "passed" : "blocked", handoff.blockers.join(" ") || "The source handoff remains in review.", "Complete tenant, source, unit, rights, accessibility, and release review."),
    check("source-review-decision", "Source review decision", reviewDecision?.decision === "accepted-for-package-review" ? "passed" : reviewDecision ? "blocked" : "open", reviewDecision?.decision === "accepted-for-package-review" ? "An immutable source decision accepted this quarantine for package review." : reviewDecision?.decision === "changes-required" ? "The recorded source decision requires changes before package review can continue." : "No immutable source review decision is recorded for this quarantine.", "Record an accepted-for-package-review decision before downstream package evidence and packet gates."),
    check("review-packet", "Package review packet", packet?.status === "ready-for-next-gate" ? "passed" : packet ? "blocked" : "open", packet ? packet.blockers.join(" ") || "The package review packet is ready for the next gate." : "No durable package review packet has been recorded.", "Record and reconcile the immutable package review packet."),
    check("sentence-approval", "English sentence approval", sentenceApproval?.decision === "approved" ? "passed" : sentenceApproval ? "blocked" : "open", sentenceApproval?.decision === "approved" ? "Exactly two approved English target sentences are bound to this package checksum." : "The package has no checksum-bound approval for its two English target sentences.", "Approve exactly two distinct English target sentences before release review."),
    check("assembly-preflight", "Assembly preflight", preflight?.status === "ready-for-manual-assembly" ? "passed" : preflight ? "blocked" : "open", preflight ? preflight.blockers.join(" ") || "Assembly preflight is ready for manual review." : "Assembly preflight cannot run until a package review packet exists.", "Resolve preflight blockers before a package writer can be considered."),
    check("package-preview", "Content, game, and media preview", packageEvidenceReview?.status === "reviewed-package-evidence" ? "passed" : "blocked", packageEvidenceReview?.status === "reviewed-package-evidence" ? "Complete reviewed package evidence is attached to this live source; release remains separately blocked." : "No reviewed publisher package preview is attached to this live source yet.", "Record complete content, game, audio, video, image, font, accessibility, and rights evidence."),
    check("readiness-reconciliation", "Readiness reconciliation", "blocked", "No complete source, verifier, audio, media-rights, publish, and assignment reconciliation is attached to this live source.", "Reconcile every release-blocking readiness lane."),
    check("delivery-manifest", "Delivery manifest", "blocked", "No delivery manifest is linked to this live quarantine handoff.", "Choose closed-local, hosted, or hybrid delivery and close its gates."),
    check("release-receipt", "Manual release receipt", "blocked", "No named release approval, QR print authorization, or rollback receipt is linked.", "Complete human release review after package evidence passes."),
    check("package-index", "Metadata-only package index", "blocked", "No delivery package index is linked to this live source.", "Create the metadata-only index from one approved manifest and receipt."),
    check("hosted-opt-in", "Hosted persistence opt-in", hostedPersistenceOptInPacket ? "blocked" : "open", hostedPersistenceOptInPacket ? "A package-scoped hosted opt-in preview is present, but provider, policy, cost, release, rollback, and human opt-in decisions remain incomplete." : "Hosted persistence is not selected for this live source.", "Keep closed-local fallback available; record a separate opt-in only when the publisher chooses hosted reporting."),
  ];
  const binding = createReviewOnlyPublisherPilotPackageReadinessBinding({
    bindingId: `${packageId}:${quarantineId}:publisher-readiness-binding`,
    tenantId,
    packageId,
    quarantineId,
    reviewPacketId,
    handoffPreviewId: handoff.handoffId,
    assemblyPreflightId: preflight?.preflightId ?? `${reviewPacketId}:assembly-preflight`,
    packagePreviewId: `${packageId}:publisher-package-preview`,
    readinessReconciliationId: `${packageId}:readiness-reconciliation`,
    deliveryManifestId: `${packageId}:delivery-manifest`,
    deliveryReleaseReceiptId: `${packageId}:delivery-manifest:release-receipt`,
    deliveryPackageIndexId: `${packageId}:delivery-manifest:package-index`,
    hostedPersistenceDecisionPacketId: hostedPersistenceOptInPacket?.packetId ?? null,
    sourceChecksumSha256: handoff.checksumSha256,
    checks,
    nextGates: [
      "Complete and record source review before package evidence can advance.",
      "Attach reviewed multimedia, game, audio, font, policy, and rights evidence.",
      "Select a delivery shape and complete release, QR, classroom, and recovery rehearsal.",
    ],
  });
  const bindingErrors = validatePublisherPilotPackageReadinessBindingRecord(binding);
  return json({
    status: "review-only",
    tenantId,
    quarantineId,
    handoff,
    packet,
    preflight,
    binding: bindingErrors.length === 0 ? binding : null,
    deliveryManifestPreview: deliveryManifestPreviewErrors.length === 0 ? deliveryManifestPreview : null,
    deliveryModeDecision,
    promotionAdapterDecision: promotionAdapterDecisionResult.record,
    packageEvidenceReview,
    reviewDecision,
    sentenceApproval,
    releaseReceiptPreview: releaseReceiptPreviewErrors.length === 0 ? releaseReceiptPreview : null,
    packageIndexPreview: packageIndexPreviewErrors.length === 0 ? packageIndexPreview : null,
    releasePreflight: releasePreflightErrors.length === 0 ? releasePreflight : null,
    deliveryClosurePacket: deliveryClosurePacketErrors.length === 0 ? deliveryClosurePacket : null,
    assemblyRequestPreview: assemblyRequestPreviewErrors.length === 0 ? assemblyRequestPreview : null,
    deliveryHandoffRecord: deliveryHandoffRecordErrors.length === 0 ? deliveryHandoffRecord : null,
    sourcePackageEvidenceBinding: sourcePackageEvidenceBindingErrors.length === 0 ? sourcePackageEvidenceBinding : null,
    hostedPersistenceOptInPacket,
    errors: [...intake.errors, ...packetResult.errors, ...deliveryModeDecisionResult.errors, ...promotionAdapterDecisionResult.errors, ...reviewDecisionResult.errors, ...sentenceApprovalResult.errors, ...packageEvidenceReviewResult.errors, ...sourcePackageEvidenceBindingErrors, ...bindingErrors, ...deliveryManifestPreviewErrors, ...releaseReceiptPreviewErrors, ...packageIndexPreviewErrors, ...releasePreflightErrors, ...deliveryClosurePacketErrors, ...assemblyRequestPreviewErrors, ...deliveryHandoffRecordErrors],
    privacy: privacyMessage(),
  });
}

function check(
  checkId: string,
  label: string,
  status: PublisherPilotPackageReadinessCheck["status"],
  evidence: string,
  nextAction: string,
): PublisherPilotPackageReadinessCheck {
  return { checkId, label, status, evidence, nextAction };
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean { return hasUploadQuarantineApiToken(request, tenantId) || hasTeacherOperationsReadAuthorization(request, tenantId); }

function privacyMessage(): string {
  return "Package readiness binding returns bounded metadata only; it never returns raw payloads, filesystem paths, credentials, learner records, download URLs, package files, or activation capability.";
}

function json(body: ReadinessResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
