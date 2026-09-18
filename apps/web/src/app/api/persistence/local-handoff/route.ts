import { NextResponse } from "next/server";
import { validateLocalBundleHandoffReviewRequest } from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const requestShape = {
    tenantId: url.searchParams.get("tenantId")?.trim() ?? "",
    bundleId: url.searchParams.get("bundleId")?.trim() ?? "",
    packetId: url.searchParams.get("packetId")?.trim() ?? "",
    accessMode: url.searchParams.get("accessMode") ?? "",
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

  return json({
    status: "blocked",
    provider: null,
    records: [],
    errors: ["Local handoff review storage is not configured; no package record is synthesized by this read-only route."],
    privacy: privacyMessage(),
    request: {
      tenantId: requestShape.tenantId,
      bundleId: requestShape.bundleId,
      packetId: requestShape.packetId,
      accessMode: requestShape.accessMode,
    },
  }, 423);
}

function privacyMessage(): string {
  return "Local handoff review exposes no learner records, raw media, database paths, credentials, audio, or transcripts, and is never student-facing.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
