import { NextResponse } from "next/server";
import { isUploadQuarantineSafeTenantId } from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import {
  readQuarantineReviewDecision,
  readQuarantineUploadRecords,
  writeQuarantineReviewDecision,
} from "@/server/uploads/quarantineUploadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReviewDecisionRequest = {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  reviewerId: string;
  decision: "accepted-for-package-review" | "changes-required";
  reviewerNote: string;
  reviewedFields: string[];
  unresolvedBlockers: string[];
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", decision: null, errors: ["Review decision query exceeds bounded identifier limits."] }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", decision: null, errors: ["Review decision requires tenantId and quarantineId."] }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", decision: null, errors: ["Tenant-scoped teacher or service authorization is required for review decision reads."], privacy: privacyMessage() }, 401);

  const result = await readQuarantineReviewDecision(tenantId, quarantineId);
  return json({
    status: result.record ? "available" : "not-recorded",
    tenantId,
    quarantineId,
    decision: result.record,
    decisionPresent: Boolean(result.record),
    errors: result.errors,
    rawPayloadIncluded: false,
    evidenceAttachmentWriteAllowed: false,
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    privacy: privacyMessage(),
  });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasUploadApiToken(request)) return json({ status: "forbidden", errors: origin.errors }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Quarantine review decision request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  const body = bodyResult.value;
  if (!isReviewDecisionRequest(body)) return json({ status: "rejected", errors: ["Review decision requires tenantId, quarantineId, packageId, reviewerId, decision, reviewerNote, reviewedFields, and unresolvedBlockers."] }, 400);
  if (!isUploadQuarantineSafeTenantId(body.tenantId)) return json({ status: "rejected", errors: ["Review decision tenant identity is unsafe."] }, 400);
  if (!hasReviewAuthorization(request, body.tenantId)) return json({ status: "unauthorized", errors: ["Tenant-scoped teacher or service authorization is required for review decision writes."], privacy: privacyMessage() }, 401);
  if (process.env.LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED !== "true") return json({ status: "blocked", errors: ["Review decision writes are disabled. Enable the explicit local review-decision gate before recording a teacher decision."], privacy: privacyMessage() }, 423);

  const intake = await readQuarantineUploadRecords(body.tenantId, body.quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== body.quarantineId) return json({ status: "not-found", errors: ["The quarantine record was not available for review decision capture."], privacy: privacyMessage() }, 404);

  const result = await writeQuarantineReviewDecision({
    decisionId: `review-decision:${body.quarantineId}`,
    tenantId: body.tenantId,
    quarantineId: body.quarantineId,
    sourceId: `quarantine-record:${body.quarantineId}`,
    packageId: body.packageId,
    unitKey: summary.record.unitKey,
    evidencePacketId: `evidence-packet:${body.quarantineId}`,
    reviewerId: body.reviewerId,
    decision: body.decision,
    reviewerNote: body.reviewerNote,
    reviewedFields: body.reviewedFields,
    unresolvedBlockers: body.unresolvedBlockers,
    capturedAt: new Date().toISOString(),
  });
  if (result.status === "conflict") return json({ status: result.status, decision: null, idempotent: false, errors: result.errors, privacy: privacyMessage() }, 409);
  if (result.status === "blocked") return json({ status: result.status, decision: null, idempotent: false, errors: result.errors, privacy: privacyMessage() }, 423);
  return json({
    status: "recorded-review-only",
    decision: result.record,
    idempotent: result.idempotent,
    approvalCaptured: false,
    evidenceAttachmentWriteAllowed: false,
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    errors: result.errors,
    privacy: privacyMessage(),
  });
}

function isReviewDecisionRequest(value: unknown): value is ReviewDecisionRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string"
    && typeof candidate.quarantineId === "string"
    && typeof candidate.packageId === "string"
    && typeof candidate.reviewerId === "string"
    && (candidate.decision === "accepted-for-package-review" || candidate.decision === "changes-required")
    && typeof candidate.reviewerNote === "string"
    && Array.isArray(candidate.reviewedFields)
    && candidate.reviewedFields.every((item) => typeof item === "string")
    && Array.isArray(candidate.unresolvedBlockers)
    && candidate.unresolvedBlockers.every((item) => typeof item === "string");
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean {
  return hasUploadApiToken(request) || hasTeacherOperationsReadAuthorization(request, tenantId);
}

function hasUploadApiToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}

function privacyMessage(): string {
  return "Review decision records contain bounded teacher review metadata only; they never include raw payloads, filesystem paths, credentials, learner records, or download URLs.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
