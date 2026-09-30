import { NextResponse } from "next/server";
import { isUploadQuarantineSafeTenantId, type UploadQuarantineDeliveryMode } from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { hasUploadQuarantineApiCredential, hasUploadQuarantineApiToken } from "@/server/uploads/uploadQuarantineAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { readQuarantineDeliveryModeDecision, readQuarantineUploadRecords, writeQuarantineDeliveryModeDecision } from "@/server/uploads/quarantineUploadStore";
import { deriveQuarantinePackageId } from "@/server/uploads/quarantinePackageIdentity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DeliveryModeDecisionRequest = {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  selectedMode: UploadQuarantineDeliveryMode;
  reviewerId: string;
  reviewerNote: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", record: null, errors: ["Delivery mode decision query exceeds bounded identifier limits."], privacy: privacyMessage() }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", record: null, errors: ["Delivery mode decision requires a safe tenantId and quarantineId."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for delivery mode decision reads."], privacy: privacyMessage() }, 401);
  const result = await readQuarantineDeliveryModeDecision(tenantId, quarantineId);
  return json({ status: result.record ? "available" : "not-recorded", tenantId, quarantineId, record: result.record, selectionRecorded: Boolean(result.record), persistenceActivationAllowed: false, packageAssemblyAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasUploadQuarantineApiCredential(request)) return json({ status: "forbidden", record: null, errors: origin.errors, privacy: privacyMessage() }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Quarantine delivery mode decision request");
  if (!bodyResult.ok) return json({ status: "rejected", record: null, errors: bodyResult.errors, privacy: privacyMessage() }, bodyResult.status);
  if (!isDeliveryModeDecisionRequest(bodyResult.value)) return json({ status: "rejected", record: null, errors: ["Delivery mode decision requires tenant, quarantine, mode, reviewer, and note fields."], privacy: privacyMessage() }, 400);
  if (!isUploadQuarantineSafeTenantId(bodyResult.value.tenantId)) return json({ status: "rejected", record: null, errors: ["Delivery mode decision tenant identity is unsafe."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, bodyResult.value.tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for delivery mode decision writes."], privacy: privacyMessage() }, 401);
  const intake = await readQuarantineUploadRecords(bodyResult.value.tenantId, bodyResult.value.quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== bodyResult.value.quarantineId) return json({ status: "not-found", record: null, errors: ["The requested quarantine record was not available for delivery mode decision."], privacy: privacyMessage() }, 404);
  const packageId = bodyResult.value.packageId || deriveQuarantinePackageId(bodyResult.value.tenantId, summary.record.unitKey);
  const result = await writeQuarantineDeliveryModeDecision({ ...bodyResult.value, packageId, reviewedAt: new Date().toISOString() });
  const status = result.status === "accepted" ? 200 : result.status === "conflict" ? 409 : 423;
  return json({ status: result.status === "accepted" ? "recorded-review-only" : result.status, record: result.record ?? null, idempotent: result.idempotent, selectionRecorded: result.status === "accepted", persistenceActivationAllowed: false, packageAssemblyAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() }, status);
}

function isDeliveryModeDecisionRequest(value: unknown): value is DeliveryModeDecisionRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string"
    && typeof candidate.quarantineId === "string"
    && (candidate.packageId === undefined || typeof candidate.packageId === "string")
    && (candidate.selectedMode === "closed-local" || candidate.selectedMode === "hosted-pwa" || candidate.selectedMode === "hybrid")
    && typeof candidate.reviewerId === "string"
    && typeof candidate.reviewerNote === "string";
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean { return hasUploadQuarantineApiToken(request, tenantId) || hasTeacherOperationsReadAuthorization(request, tenantId); }

function privacyMessage(): string { return "Delivery mode selection stores bounded review metadata only; it does not select a provider, enable writes, assemble a package, authorize QR printing, or activate students."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
