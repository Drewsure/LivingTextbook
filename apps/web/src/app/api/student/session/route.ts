import { NextResponse } from "next/server";
import { resolveSampleFrontDoorContext } from "@/data/sampleFrontDoorResolver";
import {
  clearStudentSessionCookie,
  createStudentSessionCookieValue,
  getStudentSessionExpiry,
  readStudentSessionClaims,
  setStudentSessionCookie,
  type StudentSessionClaims,
} from "@/server/persistence/studentSessionCookie";
import { getPersistenceDeploymentGateSnapshot } from "@/server/persistence/persistenceDeploymentGate";
import { readJsonRequestBody, SESSION_JSON_BODY_LIMIT_BYTES, validateSameOriginMutation } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface StudentSessionStartRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
  entryCode: string;
  userCode: string;
}

export async function POST(request: Request) {
  const originValidation = validateSameOriginMutation(request);
  if (!originValidation.valid) return json({ status: "forbidden", errors: originValidation.errors }, originValidation.status);
  const bodyResult = await readJsonRequestBody<StudentSessionStartRequest>(request, SESSION_JSON_BODY_LIMIT_BYTES, "Student session request");
  if (!bodyResult.ok) return json({ status: "invalid", errors: bodyResult.errors }, bodyResult.status);
  const body = bodyResult.value;

  const fieldLimits: Record<keyof StudentSessionStartRequest, number> = {
    tenantId: 160,
    packageId: 160,
    launchCode: 160,
    entryCode: 512,
    userCode: 160,
  };
  const missing = Object.keys(fieldLimits)
    .filter((field) => typeof body?.[field as keyof StudentSessionStartRequest] !== "string" || !body[field as keyof StudentSessionStartRequest].trim());
  if (missing.length > 0) return json({ status: "invalid", errors: [`Student session fields are required: ${missing.join(", ")}.`] }, 400);
  const oversized = Object.entries(fieldLimits)
    .filter(([field, limit]) => body[field as keyof StudentSessionStartRequest].length > limit)
    .map(([field]) => field);
  if (oversized.length > 0) return json({ status: "invalid", errors: [`Student session fields exceed their limits: ${oversized.join(", ")}.`] }, 400);

  const deployment = getPersistenceDeploymentGateSnapshot();
  if (deployment.gate.status === "rehearsal") {
    return json({ status: "rehearsal-only", provider: deployment.provider, durability: deployment.gate.mode, errors: deployment.gate.blockedReasons });
  }
  if (!deployment.gate.ready) {
    return json({ status: "blocked", provider: deployment.provider, durability: deployment.gate.mode, errors: deployment.gate.blockedReasons }, 423);
  }

  const context = resolveSampleFrontDoorContext(body.tenantId);
  if (!context || context.contentPackage.meta.packageId !== body.packageId || context.launchSession.launchCode !== body.launchCode) {
    return json({ status: "unauthorized", errors: ["The coded student launch is not valid for this tenant package."] }, 401);
  }

  const acceptedUserCodes = new Set([context.expectedUserCode, ...context.allowedUserCodes].map((code) => code.trim().toUpperCase()));
  if (context.accessPolicy.entryCodeRequired && body.entryCode.trim().toUpperCase() !== context.expectedEntryCode.toUpperCase()) {
    return json({ status: "unauthorized", errors: ["The entry code is not valid for this launch."] }, 401);
  }
  if (context.accessPolicy.userCodeRequired && !acceptedUserCodes.has(body.userCode.trim().toUpperCase())) {
    return json({ status: "unauthorized", errors: ["The user code is not valid for this launch."] }, 401);
  }

  const expiresAt = getStudentSessionExpiry();
  const claims: StudentSessionClaims = {
    version: 1,
    tenantId: body.tenantId,
    packageId: body.packageId,
    launchCode: body.launchCode,
    studentSessionId: `${body.launchCode}:${body.userCode.trim().toLowerCase()}`,
    issuedAt: new Date().toISOString(),
    expiresAt,
  };
  const cookieValue = createStudentSessionCookieValue(claims);
  if (!cookieValue) return json({ status: "unavailable", errors: ["Durable student sessions require a server-only session secret."] }, 503);

  const response = json({
    status: "authenticated",
    provider: "sqlite",
    durability: "durable-managed",
    identity: {
      tenantId: claims.tenantId,
      packageId: claims.packageId,
      launchCode: claims.launchCode,
      studentSessionId: claims.studentSessionId,
    },
    expiresAt,
  });
  setStudentSessionCookie(response, cookieValue, expiresAt);
  return response;
}

export function GET(request: Request) {
  const claims = readStudentSessionClaims(request);
  if (!claims) return json({ status: "anonymous", errors: ["No valid student session is active."] }, 401);
  const deployment = getPersistenceDeploymentGateSnapshot();
  return json({
    status: "authenticated",
    provider: deployment.provider,
    durability: deployment.gate.mode,
    identity: {
      tenantId: claims.tenantId,
      packageId: claims.packageId,
      launchCode: claims.launchCode,
      studentSessionId: claims.studentSessionId,
    },
    expiresAt: claims.expiresAt,
  });
}

export function DELETE() {
  const response = json({ status: "signed-out" });
  clearStudentSessionCookie(response);
  return response;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
