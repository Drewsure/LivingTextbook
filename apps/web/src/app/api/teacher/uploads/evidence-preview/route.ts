import { NextResponse } from "next/server";
import {
  deriveUploadQuarantineAdmissionPreview,
  isUploadQuarantineSafeTenantId,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import { readQuarantineEvidenceReview, readQuarantineUploadRecords } from "@/server/uploads/quarantineUploadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) {
    return json({ status: "rejected", preview: null, errors: ["Evidence preview query exceeds bounded identifier limits."] }, 400);
  }
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) {
    return json({ status: "rejected", preview: null, errors: ["Evidence preview requires tenantId and quarantineId."] }, 400);
  }
  if (!hasReviewAuthorization(request, tenantId)) {
    return json({
      status: "unauthorized",
      preview: null,
      errors: ["Tenant-scoped teacher or service authorization is required for evidence preview."],
      privacy: privacyMessage(),
    }, 401);
  }

  const result = await readQuarantineUploadRecords(tenantId, quarantineId);
  const summary = result.records[0];
  if (!summary || summary.quarantineId !== quarantineId) {
    return json({
      status: "not-found",
      tenantId,
      quarantineId,
      preview: null,
      errors: ["The requested quarantine record was not available for evidence preview."],
      privacy: privacyMessage(),
    }, 404);
  }

  const evidenceReview = await readQuarantineEvidenceReview(tenantId, quarantineId);
  const preview = deriveUploadQuarantineAdmissionPreview(summary.record, {
    ...(evidenceReview.record ?? {
      scanStatus: "pending" as const,
      rightsStatus: "unknown" as const,
      sourceReviewStatus: "unreviewed" as const,
      targetMappingReviewed: false,
      accessibilityReviewed: false,
      releaseApproved: false,
    }),
    evidencePacketId: `evidence-packet:${summary.quarantineId}`,
  });

  return json({
    status: "review-only",
    tenantId,
    quarantineId,
    preview,
    payloadPresent: summary.payloadPresent,
    rawPayloadIncluded: false,
    filesystemPathIncluded: false,
    downloadUrlIncluded: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    evidenceReview: evidenceReview.record,
    errors: [...result.errors, ...evidenceReview.errors],
    privacy: privacyMessage(),
  });
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  if (configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`) return true;
  return hasTeacherOperationsReadAuthorization(request, tenantId);
}

function privacyMessage(): string {
  return "Evidence preview binds validated quarantine metadata to a review packet only; it never returns raw payloads, filesystem paths, credentials, learner records, or download URLs.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
