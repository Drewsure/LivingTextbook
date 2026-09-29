import { NextResponse } from "next/server";
import {
  isUploadQuarantineSafeTenantId,
  type UploadQuarantineRightsStatus,
  type UploadQuarantineScanStatus,
  type UploadQuarantineSourceReviewStatus,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { readQuarantineEvidenceReview, readQuarantineUploadRecords, writeQuarantineEvidenceReview } from "@/server/uploads/quarantineUploadStore";
import { deriveQuarantinePackageId } from "@/server/uploads/quarantinePackageIdentity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EvidenceReviewRequest = {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  reviewerId: string;
  reviewerNote: string;
  reviewedFields: string[];
  scanStatus: UploadQuarantineScanStatus;
  rightsStatus: UploadQuarantineRightsStatus;
  sourceReviewStatus: UploadQuarantineSourceReviewStatus;
  targetMappingReviewed: boolean;
  accessibilityReviewed: boolean;
  releaseApproved: boolean;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", record: null, errors: ["Evidence review query exceeds bounded identifier limits."], privacy: privacyMessage() }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", record: null, errors: ["Evidence review requires a safe tenantId and quarantineId."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for evidence review reads."], privacy: privacyMessage() }, 401);
  const result = await readQuarantineEvidenceReview(tenantId, quarantineId);
  return json({ status: result.record ? "available" : "not-recorded", tenantId, quarantineId, record: result.record, evidenceReady: result.record?.status === "evidence-ready", packageAssemblyAllowed: false, promotionAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasUploadApiToken(request)) return json({ status: "forbidden", record: null, errors: origin.errors, privacy: privacyMessage() }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Quarantine evidence review request");
  if (!bodyResult.ok) return json({ status: "rejected", record: null, errors: bodyResult.errors, privacy: privacyMessage() }, bodyResult.status);
  if (!isEvidenceReviewRequest(bodyResult.value)) return json({ status: "rejected", record: null, errors: ["Evidence review requires tenant, quarantine, reviewer, note, reviewed fields, scan, rights, source, mapping, accessibility, and release evidence fields."], privacy: privacyMessage() }, 400);
  if (!isUploadQuarantineSafeTenantId(bodyResult.value.tenantId)) return json({ status: "rejected", record: null, errors: ["Evidence review tenant identity is unsafe."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, bodyResult.value.tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for evidence review writes."], privacy: privacyMessage() }, 401);
  const packageId = bodyResult.value.packageId || deriveQuarantinePackageId(bodyResult.value.tenantId, (await readQuarantineUploadRecords(bodyResult.value.tenantId, bodyResult.value.quarantineId)).records[0]?.record.unitKey);
  const result = await writeQuarantineEvidenceReview({ ...bodyResult.value, packageId, sourceId: `quarantine-record:${bodyResult.value.quarantineId}`, evidencePacketId: `evidence-packet:${bodyResult.value.quarantineId}`, capturedAt: new Date().toISOString() });
  const status = result.status === "accepted" ? 200 : result.status === "conflict" ? 409 : 423;
  return json({ status: result.status === "accepted" ? "recorded-review-only" : result.status, record: result.record ?? null, idempotent: result.idempotent, evidenceReady: result.record?.status === "evidence-ready", packageAssemblyAllowed: false, promotionAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() }, status);
}

function isEvidenceReviewRequest(value: unknown): value is EvidenceReviewRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string"
    && typeof candidate.quarantineId === "string"
    && (candidate.packageId === undefined || typeof candidate.packageId === "string")
    && typeof candidate.reviewerId === "string"
    && typeof candidate.reviewerNote === "string"
    && Array.isArray(candidate.reviewedFields)
    && candidate.reviewedFields.every((item) => typeof item === "string")
    && (candidate.scanStatus === "pending" || candidate.scanStatus === "passed" || candidate.scanStatus === "failed")
    && (candidate.rightsStatus === "owned" || candidate.rightsStatus === "licensed" || candidate.rightsStatus === "partner-provided" || candidate.rightsStatus === "unknown")
    && (candidate.sourceReviewStatus === "unreviewed" || candidate.sourceReviewStatus === "reviewed" || candidate.sourceReviewStatus === "approved" || candidate.sourceReviewStatus === "rejected")
    && typeof candidate.targetMappingReviewed === "boolean"
    && typeof candidate.accessibilityReviewed === "boolean"
    && typeof candidate.releaseApproved === "boolean";
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean { return hasUploadApiToken(request) || hasTeacherOperationsReadAuthorization(request, tenantId); }
function hasUploadApiToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}
function privacyMessage(): string { return "Evidence review stores bounded adjudication metadata only; it never mutates intake records, returns payload bytes, promotes files, activates students, or authorizes package assembly."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
