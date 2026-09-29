import { NextResponse } from "next/server";
import {
  createUploadQuarantinePackageHandoffPreview,
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
  const requestedPackageId = readBoundedQueryParam(url, "packageId");
  if (tenantId === undefined || quarantineId === undefined) {
    return json({ status: "rejected", handoff: null, errors: ["Package handoff query exceeds bounded identifier limits."] }, 400);
  }
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) {
    return json({ status: "rejected", handoff: null, errors: ["Package handoff requires tenantId and quarantineId."] }, 400);
  }
  if (!hasReviewAuthorization(request, tenantId)) {
    return json({
      status: "unauthorized",
      handoff: null,
      errors: ["Tenant-scoped teacher or service authorization is required for package handoff preview."],
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
      handoff: null,
      errors: ["The requested quarantine record was not available for package handoff preview."],
      privacy: privacyMessage(),
    }, 404);
  }

  const packageId = requestedPackageId || derivePackageId(tenantId, summary.record.unitKey);
  const evidencePacketId = `evidence-packet:${summary.quarantineId}`;
  const evidenceReview = await readQuarantineEvidenceReview(tenantId, quarantineId);
  const evidence = evidenceReview.record ?? {
    scanStatus: "pending" as const,
    rightsStatus: "unknown" as const,
    sourceReviewStatus: "unreviewed" as const,
    targetMappingReviewed: false,
    accessibilityReviewed: false,
    releaseApproved: false,
  };
  const admission = deriveUploadQuarantineAdmissionPreview(summary.record, {
    ...evidence,
    evidencePacketId,
  });
  const handoff = createUploadQuarantinePackageHandoffPreview({
    summary,
    admission,
    sourceId: `quarantine-record:${summary.quarantineId}`,
    packageId,
  });

  return json({
    status: "review-only",
    tenantId,
    quarantineId,
    handoff,
    payloadPresent: summary.payloadPresent,
    rawPayloadIncluded: false,
    filesystemPathIncluded: false,
    downloadUrlIncluded: false,
    evidenceWriteAllowed: false,
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    evidenceReview: evidenceReview.record,
    errors: [...result.errors, ...evidenceReview.errors],
    privacy: privacyMessage(),
  });
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
  return "Package handoff preview binds safe quarantine metadata to a candidate package only; it never returns raw payloads, filesystem paths, credentials, learner records, or download URLs.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
