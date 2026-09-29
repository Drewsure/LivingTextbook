import { NextResponse } from "next/server";
import {
  createReviewOnlyPublisherPilotPackageReadinessBinding,
  createUploadQuarantinePackageAssemblyPreflight,
  createUploadQuarantinePackageHandoffPreview,
  deriveUploadQuarantineAdmissionPreview,
  createReviewOnlyUploadQuarantineDeliveryManifestPreview,
  isUploadQuarantineSafeTenantId,
  validatePublisherPilotPackageReadinessBindingRecord,
  validateUploadQuarantineDeliveryManifestPreview,
  type PublisherPilotPackageReadinessBinding,
  type PublisherPilotPackageReadinessCheck,
  type UploadQuarantinePackageAssemblyPreflight,
  type UploadQuarantinePackageHandoffPreview,
  type UploadQuarantinePackageReviewPacket,
  type UploadQuarantineDeliveryManifestPreview,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import {
  readQuarantinePackageReviewPacket,
  readQuarantineEvidenceReview,
  readQuarantineDeliveryModeDecision,
  readQuarantineUploadRecords,
} from "@/server/uploads/quarantineUploadStore";

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

  const packageId = requestedPackageId || derivePackageId(tenantId, summary.record.unitKey);
  const evidencePacketId = `evidence-packet:${summary.quarantineId}`;
  const evidenceReview = await readQuarantineEvidenceReview(tenantId, quarantineId);
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
  });
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
  const preflight = packet ? createUploadQuarantinePackageAssemblyPreflight({
    packet,
    additionalBlockers: [
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
      check("package-preview", "Reviewed package preview", "blocked", "A reviewed multimedia/game package is not linked to this live quarantine submission.", "Attach reviewed content, games, audio, video, image, font, and rights evidence."),
      check("release-receipt", "Manual release receipt", "blocked", "No approved delivery manifest or named release receipt is linked.", "Complete release, rollback, school-policy, and operator review."),
      check("qr-print", "QR print authorization", "blocked", "Production QR printing remains blocked for this live submission.", "Validate stable aliases, local fallback, release checksum, and print authorization."),
    ],
  });
  const deliveryManifestPreviewErrors = validateUploadQuarantineDeliveryManifestPreview(deliveryManifestPreview);
  const checks: PublisherPilotPackageReadinessCheck[] = [
    check("quarantine-review", "Quarantine source review", handoff.blockers.length === 0 && handoff.admissionDecision === "evidence-ready" ? "passed" : "blocked", handoff.blockers.join(" ") || "The source handoff remains in review.", "Complete tenant, source, unit, rights, accessibility, and release review."),
    check("review-packet", "Package review packet", packet?.status === "ready-for-next-gate" ? "passed" : packet ? "blocked" : "open", packet ? packet.blockers.join(" ") || "The package review packet is ready for the next gate." : "No durable package review packet has been recorded.", "Record and reconcile the immutable package review packet."),
    check("assembly-preflight", "Assembly preflight", preflight?.status === "ready-for-manual-assembly" ? "passed" : preflight ? "blocked" : "open", preflight ? preflight.blockers.join(" ") || "Assembly preflight is ready for manual review." : "Assembly preflight cannot run until a package review packet exists.", "Resolve preflight blockers before a package writer can be considered."),
    check("package-preview", "Content, game, and media preview", "blocked", "No reviewed publisher package preview is attached to this live source yet.", "Attach the reviewed content, game, audio, video, image, and font evidence."),
    check("readiness-reconciliation", "Readiness reconciliation", "blocked", "No complete source, verifier, audio, media-rights, publish, and assignment reconciliation is attached to this live source.", "Reconcile every release-blocking readiness lane."),
    check("delivery-manifest", "Delivery manifest", "blocked", "No delivery manifest is linked to this live quarantine handoff.", "Choose closed-local, hosted, or hybrid delivery and close its gates."),
    check("release-receipt", "Manual release receipt", "blocked", "No named release approval, QR print authorization, or rollback receipt is linked.", "Complete human release review after package evidence passes."),
    check("package-index", "Metadata-only package index", "blocked", "No delivery package index is linked to this live source.", "Create the metadata-only index from one approved manifest and receipt."),
    check("hosted-opt-in", "Hosted persistence opt-in", "blocked", "Hosted persistence is not selected or approved for this live source.", "Keep closed-local fallback available; record a separate opt-in only when the publisher chooses hosted reporting."),
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
    errors: [...intake.errors, ...packetResult.errors, ...deliveryModeDecisionResult.errors, ...bindingErrors, ...deliveryManifestPreviewErrors],
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

function derivePackageId(tenantId: string, unitKey?: string): string {
  const identity = (unitKey || `${tenantId}:unassigned`).replace(/[^A-Za-z0-9._:-]+/g, "-").slice(0, 120);
  return `${identity}-package`;
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  if (configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`) return true;
  return hasTeacherOperationsReadAuthorization(request, tenantId);
}

function privacyMessage(): string {
  return "Package readiness binding returns bounded metadata only; it never returns raw payloads, filesystem paths, credentials, learner records, download URLs, package files, or activation capability.";
}

function json(body: ReadinessResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
