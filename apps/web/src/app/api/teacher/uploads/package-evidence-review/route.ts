import { NextResponse } from "next/server";
import {
  isUploadQuarantineSafeTenantId,
  UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES,
  type UploadQuarantinePackageEvidenceLane,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { readQuarantinePackageEvidenceReview, readQuarantineUploadRecords, writeQuarantinePackageEvidenceReview } from "@/server/uploads/quarantineUploadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PackageEvidenceReviewRequest = {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  reviewerId: string;
  reviewerNote: string;
  reviewedLanes: UploadQuarantinePackageEvidenceLane[];
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", record: null, errors: ["Package evidence review query exceeds bounded identifier limits."], privacy: privacyMessage() }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", record: null, errors: ["Package evidence review requires a safe tenantId and quarantineId."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for package evidence review reads."], privacy: privacyMessage() }, 401);
  const result = await readQuarantinePackageEvidenceReview(tenantId, quarantineId);
  return json({ status: result.record ? "available" : "not-recorded", tenantId, quarantineId, record: result.record, reviewedPackageEvidence: result.record?.status === "reviewed-package-evidence", packageAssemblyAllowed: false, promotionAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasUploadApiToken(request)) return json({ status: "forbidden", record: null, errors: origin.errors, privacy: privacyMessage() }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Quarantine package evidence review request");
  if (!bodyResult.ok) return json({ status: "rejected", record: null, errors: bodyResult.errors, privacy: privacyMessage() }, bodyResult.status);
  if (!isPackageEvidenceReviewRequest(bodyResult.value)) return json({ status: "rejected", record: null, errors: ["Package evidence review requires tenant, quarantine, reviewer, note, and reviewed lane fields."], privacy: privacyMessage() }, 400);
  if (!isUploadQuarantineSafeTenantId(bodyResult.value.tenantId)) return json({ status: "rejected", record: null, errors: ["Package evidence review tenant identity is unsafe."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, bodyResult.value.tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for package evidence review writes."], privacy: privacyMessage() }, 401);
  const intake = await readQuarantineUploadRecords(bodyResult.value.tenantId, bodyResult.value.quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== bodyResult.value.quarantineId) return json({ status: "not-found", record: null, errors: ["The requested quarantine record was not available for package evidence review."], privacy: privacyMessage() }, 404);
  const packageId = bodyResult.value.packageId || derivePackageId(bodyResult.value.tenantId, summary.record.unitKey);
  const result = await writeQuarantinePackageEvidenceReview({ ...bodyResult.value, packageId, reviewedAt: new Date().toISOString() });
  const status = result.status === "accepted" ? 200 : result.status === "conflict" ? 409 : 423;
  return json({ status: result.status === "accepted" ? "recorded-review-only" : result.status, record: result.record ?? null, idempotent: result.idempotent, reviewedPackageEvidence: result.record?.status === "reviewed-package-evidence", packageAssemblyAllowed: false, promotionAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() }, status);
}

function isPackageEvidenceReviewRequest(value: unknown): value is PackageEvidenceReviewRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string"
    && typeof candidate.quarantineId === "string"
    && (candidate.packageId === undefined || typeof candidate.packageId === "string")
    && typeof candidate.reviewerId === "string"
    && typeof candidate.reviewerNote === "string"
    && Array.isArray(candidate.reviewedLanes)
    && candidate.reviewedLanes.every((lane) => UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.includes(lane as UploadQuarantinePackageEvidenceLane));
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean { return hasUploadApiToken(request) || hasTeacherOperationsReadAuthorization(request, tenantId); }
function derivePackageId(tenantId: string, unitKey?: string): string {
  const identity = (unitKey || `${tenantId}:unassigned`).replace(/[^A-Za-z0-9._:-]+/g, "-").slice(0, 120);
  return `${identity}-package`;
}
function hasUploadApiToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}
function privacyMessage(): string { return "Package evidence review stores bounded lane and reviewer metadata only; it does not upload assets, assemble a package, print QR codes, activate persistence, or authorize students."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
