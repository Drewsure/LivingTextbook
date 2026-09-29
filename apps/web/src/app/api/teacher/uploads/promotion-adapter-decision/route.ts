import { NextResponse } from "next/server";
import { isUploadQuarantineSafeTenantId, type UploadQuarantinePromotionAdapter } from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { readQuarantinePromotionAdapterDecision, readQuarantineUploadRecords, writeQuarantinePromotionAdapterDecision } from "@/server/uploads/quarantineUploadStore";
import { deriveQuarantinePackageId } from "@/server/uploads/quarantinePackageIdentity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PromotionAdapterDecisionRequest = {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  selectedAdapter: UploadQuarantinePromotionAdapter;
  reviewerId: string;
  reviewerNote: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", record: null, errors: ["Promotion adapter decision query exceeds bounded identifier limits."], privacy: privacyMessage() }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", record: null, errors: ["Promotion adapter decision requires a safe tenantId and quarantineId."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for promotion adapter decision reads."], privacy: privacyMessage() }, 401);
  const result = await readQuarantinePromotionAdapterDecision(tenantId, quarantineId);
  return json({ status: result.record ? "available" : "not-recorded", tenantId, quarantineId, record: result.record, selectionRecorded: Boolean(result.record), packageAssemblyAllowed: false, promotionAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, hostedPersistenceActivated: false, errors: result.errors, privacy: privacyMessage() });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasUploadApiToken(request)) return json({ status: "forbidden", record: null, errors: origin.errors, privacy: privacyMessage() }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Quarantine promotion adapter decision request");
  if (!bodyResult.ok) return json({ status: "rejected", record: null, errors: bodyResult.errors, privacy: privacyMessage() }, bodyResult.status);
  if (!isPromotionAdapterDecisionRequest(bodyResult.value)) return json({ status: "rejected", record: null, errors: ["Promotion adapter decision requires tenant, quarantine, adapter, reviewer, and note fields."], privacy: privacyMessage() }, 400);
  if (!isUploadQuarantineSafeTenantId(bodyResult.value.tenantId)) return json({ status: "rejected", record: null, errors: ["Promotion adapter decision tenant identity is unsafe."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, bodyResult.value.tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for promotion adapter decision writes."], privacy: privacyMessage() }, 401);
  const intake = await readQuarantineUploadRecords(bodyResult.value.tenantId, bodyResult.value.quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== bodyResult.value.quarantineId) return json({ status: "not-found", record: null, errors: ["The requested quarantine record was not available for promotion adapter decision."], privacy: privacyMessage() }, 404);
  const packageId = bodyResult.value.packageId || deriveQuarantinePackageId(bodyResult.value.tenantId, summary.record.unitKey);
  const result = await writeQuarantinePromotionAdapterDecision({ ...bodyResult.value, packageId });
  const status = result.status === "accepted" ? 200 : result.status === "conflict" ? 409 : 423;
  return json({ status: result.status === "accepted" ? "recorded-review-only" : result.status, record: result.record ?? null, idempotent: result.idempotent, selectionRecorded: result.status === "accepted", packageAssemblyAllowed: false, promotionAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, hostedPersistenceActivated: false, errors: result.errors, privacy: privacyMessage() }, status);
}

function isPromotionAdapterDecisionRequest(value: unknown): value is PromotionAdapterDecisionRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string"
    && typeof candidate.quarantineId === "string"
    && (candidate.packageId === undefined || typeof candidate.packageId === "string")
    && (candidate.selectedAdapter === "closed-local-package" || candidate.selectedAdapter === "hosted-pwa-package" || candidate.selectedAdapter === "hybrid-package")
    && typeof candidate.reviewerId === "string"
    && typeof candidate.reviewerNote === "string";
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean { return hasUploadApiToken(request) || hasTeacherOperationsReadAuthorization(request, tenantId); }
function hasUploadApiToken(request: Request): boolean { const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim(); return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`); }
function privacyMessage(): string { return "Promotion adapter selection stores bounded review metadata only; it does not authorize package assembly, select a provider, print QR codes, activate persistence, or enable student use."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
