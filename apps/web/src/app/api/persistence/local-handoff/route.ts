import { NextResponse } from "next/server";
import {
  validateLocalBundleHandoffReviewRequest,
  type LocalBundleHandoffReviewRequest,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { getLocalBundleHandoffReviewProvider } from "@/server/persistence/localBundleHandoffReviewAdapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const requestShape: LocalBundleHandoffReviewRequest = {
    tenantId: url.searchParams.get("tenantId")?.trim() ?? "",
    bundleId: url.searchParams.get("bundleId")?.trim() ?? "",
    packetId: url.searchParams.get("packetId")?.trim() ?? "",
    accessMode: (url.searchParams.get("accessMode") ?? "") as LocalBundleHandoffReviewRequest["accessMode"],
    studentFacing: false,
  };
  const validationErrors = validateLocalBundleHandoffReviewRequest(requestShape);
  if (validationErrors.length > 0) {
    return json({ status: "rejected", records: [], errors: validationErrors }, 400);
  }
  if (!hasTeacherOperationsReadAuthorization(request, requestShape.tenantId)) {
    return json({
      status: "unauthorized",
      records: [],
      errors: ["Teacher-scoped authorization is required to review local handoff records."],
      privacy: privacyMessage(),
    }, 401);
  }

  const result = getLocalBundleHandoffReviewProvider().read(requestShape);
  return json({
    status: result.status,
    provider: result.provider,
    record: result.record,
    errors: result.errors,
    records: result.record ? [result.record] : [],
    privacy: privacyMessage(),
    request: {
      tenantId: requestShape.tenantId,
      bundleId: requestShape.bundleId,
      packetId: requestShape.packetId,
      accessMode: requestShape.accessMode,
    },
  }, result.status === "blocked" ? 423 : 200);
}

function privacyMessage(): string {
  return "Local handoff review exposes no learner records, raw media, database paths, credentials, audio, or transcripts, and is never student-facing.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
