import { NextResponse } from "next/server";
import { isUploadQuarantineSafeTenantId } from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import { readQuarantineUploadRecords } from "@/server/uploads/quarantineUploadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) {
    return json({ status: "rejected", records: [], errors: ["Quarantine review query exceeds bounded identifier limits."] }, 400);
  }
  if (!tenantId || !isUploadQuarantineSafeTenantId(tenantId)) {
    return json({ status: "rejected", records: [], errors: ["Tenant-scoped quarantine review requires tenantId."] }, 400);
  }
  if (!hasReviewAuthorization(request, tenantId)) {
    return json({
      status: "unauthorized",
      records: [],
      errors: ["Tenant-scoped teacher or service authorization is required for quarantine review."],
      privacy: privacyMessage(),
    }, 401);
  }

  const result = await readQuarantineUploadRecords(tenantId, quarantineId || undefined);
  return json({
    status: result.errors.length > 0 ? "partial-review" : result.records.length > 0 ? "review-ready" : "empty-review",
    tenantId,
    records: result.records,
    errors: result.errors,
    rawPayloadsIncluded: false,
    downloadUrlsIncluded: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    privacy: privacyMessage(),
  });
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  if (configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`) return true;
  return hasTeacherOperationsReadAuthorization(request, tenantId);
}

function privacyMessage(): string {
  return "Quarantine review returns validated metadata and gate state only; it never returns raw payloads, filesystem paths, credentials, learner records, or download URLs.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
