import { NextResponse } from "next/server";
import {
  clearTeacherSessionCookie,
  createTeacherSessionCookieValue,
  getTeacherSessionExpiry,
  isTeacherReviewCodeValid,
  isTeacherSessionConfigured,
  isTeacherTenantAllowed,
  readTeacherSessionClaims,
  setTeacherSessionCookie,
  TEACHER_PERSISTENCE_READ_SCOPE,
  TEACHER_SESSION_VERSION,
} from "@/server/persistence/teacherSessionCookie";
import { readJsonRequestBody, SESSION_JSON_BODY_LIMIT_BYTES, validateSameOriginMutation } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TeacherSessionRequest {
  tenantId?: unknown;
  reviewCode?: unknown;
}

export async function POST(request: Request) {
  const originValidation = validateSameOriginMutation(request);
  if (!originValidation.valid) return json({ status: "forbidden", errors: originValidation.errors }, originValidation.status);
  const bodyResult = await readJsonRequestBody<TeacherSessionRequest>(request, SESSION_JSON_BODY_LIMIT_BYTES, "Teacher review session request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  const body = bodyResult.value;

  const tenantId = typeof body.tenantId === "string" ? body.tenantId.trim() : "";
  const reviewCode = typeof body.reviewCode === "string" ? body.reviewCode : "";
  if (!tenantId || !reviewCode || tenantId.length > 160 || reviewCode.length > 512) {
    return json({ status: "rejected", errors: ["Teacher review session requires a valid tenant and review code."] }, 400);
  }
  if (!isTeacherSessionConfigured()) {
    return json({ status: "blocked", errors: ["Teacher review sessions are not configured for this deployment."] }, 423);
  }
  if (!isTeacherTenantAllowed(tenantId) || !isTeacherReviewCodeValid(reviewCode)) {
    return json({ status: "unauthorized", errors: ["The teacher review session could not be authenticated."] }, 401);
  }

  const issuedAt = new Date().toISOString();
  const expiresAt = getTeacherSessionExpiry(Date.parse(issuedAt));
  const value = createTeacherSessionCookieValue({
    version: TEACHER_SESSION_VERSION,
    tenantId,
    role: "teacher",
    scope: TEACHER_PERSISTENCE_READ_SCOPE,
    issuedAt,
    expiresAt,
  });
  if (!value) return json({ status: "blocked", errors: ["Teacher review session signing is not configured."] }, 423);

  const response = json({ status: "authenticated", tenantId, expiresAt });
  setTeacherSessionCookie(response, value, expiresAt);
  return response;
}

export function GET(request: Request) {
  const claims = readTeacherSessionClaims(request);
  if (!claims || !isTeacherTenantAllowed(claims.tenantId)) return json({ status: "unauthorized", errors: ["No active teacher review session was found."] }, 401);
  return json({ status: "authenticated", tenantId: claims.tenantId, expiresAt: claims.expiresAt });
}

export function DELETE() {
  const response = json({ status: "signed-out" });
  clearTeacherSessionCookie(response);
  return response;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
