import { NextResponse } from "next/server";
import {
  createPublisherSourceToPackageEvidenceBridge,
  isUploadQuarantineSafeTenantId,
  validatePublisherSourceToPackageEvidenceBridge,
  type PublisherSourceToPackageEvidenceBridge,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { hasUploadQuarantineApiToken } from "@/server/uploads/uploadQuarantineAuthorization";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import { readQuarantinePackageEvidenceReview, readQuarantineReviewDecision, readQuarantineSentenceApproval, readQuarantineSourcePreflightEvidence, readQuarantineUploadRecords } from "@/server/uploads/quarantineUploadStore";
import { deriveQuarantinePackageId } from "@/server/uploads/quarantinePackageIdentity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BindingResponse = {
  status: "review-only" | "not-found" | "unauthorized" | "rejected";
  tenantId?: string;
  quarantineId?: string;
  packageId?: string;
  bridge?: PublisherSourceToPackageEvidenceBridge | null;
  errors?: string[];
  privacy: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  const requestedPackageId = readBoundedQueryParam(url, "packageId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", bridge: null, errors: ["Source-package evidence binding query exceeds bounded identifier limits."], privacy: privacyMessage() }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", bridge: null, errors: ["Source-package evidence binding requires a safe tenantId and quarantineId."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", bridge: null, errors: ["Tenant-scoped teacher or service authorization is required for source-package evidence binding reads."], privacy: privacyMessage() }, 401);

  const intake = await readQuarantineUploadRecords(tenantId, quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== quarantineId) return json({ status: "not-found", tenantId, quarantineId, bridge: null, errors: ["The requested quarantine record was not available for source-package evidence binding."], privacy: privacyMessage() }, 404);

  const packageId = requestedPackageId || deriveQuarantinePackageId(tenantId, summary.record.unitKey);
  const reviewDecision = (await readQuarantineReviewDecision(tenantId, quarantineId)).record;
  const packageEvidenceReview = (await readQuarantinePackageEvidenceReview(tenantId, quarantineId)).record;
  const sentenceApprovalRecord = (await readQuarantineSentenceApproval(tenantId, quarantineId)).record;
  const sourcePreflightEvidenceResult = await readQuarantineSourcePreflightEvidence(tenantId, quarantineId);
  const sourcePreflightEvidence = sourcePreflightEvidenceResult.record;
  const sentenceApproval = sentenceApprovalRecord
    && sentenceApprovalRecord.packageId === packageId
    && sentenceApprovalRecord.sourceChecksumSha256 === summary.record.checksumSha256
    ? sentenceApprovalRecord
    : null;
  const reviewedLanes = packageEvidenceReview?.reviewedLanes ?? [];
  const sourceChecksum = summary.record.checksumSha256.startsWith("sha256:")
    ? summary.record.checksumSha256
    : `sha256:${summary.record.checksumSha256}`;
  const bridge = createPublisherSourceToPackageEvidenceBridge({
    tenantId,
    unitKey: summary.record.unitKey || `${tenantId}:unassigned`,
    sourceReviewId: reviewDecision?.decisionId ?? `source-review:${quarantineId}:pending`,
    extractionPreviewId: `source-extraction-preview:${quarantineId}:review-only`,
    extractionPacketId: `source-extraction-packet:${quarantineId}:review-only`,
    authoringProposalId: `${packageId}:authoring-proposal:review-only`,
    sourceChecksum,
    sourceTermsReviewed: reviewDecision?.decision === "accepted-for-package-review",
    sentenceApprovalRecorded: sentenceApproval?.decision === "approved",
    audioEvidenceReady: reviewedLanes.includes("audio"),
    mediaRightsReady: reviewedLanes.includes("rights"),
    gameVerificationReady: reviewedLanes.includes("game"),
    preflightReference: sourcePreflightEvidence ? {
      reportId: sourcePreflightEvidence.reportId,
      manifestId: sourcePreflightEvidence.manifestId,
      manifestChecksumSha256: sourcePreflightEvidence.manifestChecksumSha256,
      inventoryChecksumSha256: sourcePreflightEvidence.inventoryChecksumSha256,
    } : null,
  });
  const errors = [...intake.errors, ...sourcePreflightEvidenceResult.errors, ...validatePublisherSourceToPackageEvidenceBridge(bridge)];
  return json({ status: "review-only", tenantId, quarantineId, packageId, bridge: errors.length === 0 ? bridge : null, errors, privacy: privacyMessage() });
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean {
  return hasUploadQuarantineApiToken(request, tenantId) || hasTeacherOperationsReadAuthorization(request, tenantId);
}

function privacyMessage(): string {
  return "Source-package evidence binding returns bounded review metadata only; it never returns raw payloads, filesystem paths, credentials, learner records, download URLs, or activation capability.";
}

function json(body: BindingResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
