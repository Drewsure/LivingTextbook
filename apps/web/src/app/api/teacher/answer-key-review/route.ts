import { NextResponse } from "next/server";
import {
  validateTeacherAnswerKeyReviewRequest,
  type TeacherAnswerKeyReviewRequest,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { getTeacherAnswerKeyReviewProvider } from "@/server/persistence/teacherAnswerKeyReviewAdapter";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const packageId = readBoundedQueryParam(url, "packageId");
  const version = readBoundedQueryParam(url, "version");
  const assetId = readBoundedQueryParam(url, "assetId");
  if ([tenantId, packageId, version, assetId].some((value) => value === undefined)) {
    return json({ status: "rejected", record: null, errors: ["Teacher answer-key review query exceeds the bounded query limits."] }, 400);
  }
  const requestShape: TeacherAnswerKeyReviewRequest = {
    tenantId: tenantId ?? "",
    packageId: packageId ?? "",
    version: version ?? "",
    assetId: assetId ?? "",
    accessMode: (url.searchParams.get("accessMode") ?? "") as TeacherAnswerKeyReviewRequest["accessMode"],
    studentFacing: false,
  };
  const validationErrors = validateTeacherAnswerKeyReviewRequest(requestShape);
  if (validationErrors.length > 0) return json({ status: "rejected", record: null, errors: validationErrors }, 400);
  if (!hasTeacherOperationsReadAuthorization(request, requestShape.tenantId)) {
    return json({
      status: "unauthorized",
      record: null,
      errors: ["Tenant-scoped teacher authorization is required to review answer-key metadata."],
      studentFacing: false,
      contentIncluded: false,
    }, 401);
  }

  const result = getTeacherAnswerKeyReviewProvider().read(requestShape);
  return json({
    status: result.status,
    provider: result.provider,
    record: result.record,
    errors: result.errors,
    studentFacing: false,
    contentIncluded: false,
    accessMode: "teacher-review",
  }, result.status === "blocked" ? 423 : result.status === "not-found" ? 404 : 200);
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
