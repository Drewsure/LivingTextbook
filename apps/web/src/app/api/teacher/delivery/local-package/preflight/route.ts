import { NextResponse } from "next/server";
import { isLocalPackageRequest, readLocalPackageExecutionPreflight } from "@/server/delivery/localPackageExecutionPreflight";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { hasPilotDeliveryApiCredential, hasPilotDeliveryApiToken } from "@/server/delivery/pilotDeliveryAuthorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Read-only operator preflight for the closed-local package writer. This route
 * deliberately never calls the assembler and never changes custody metadata.
 */
export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasPilotDeliveryApiCredential(request)) return json({ status: "forbidden", errors: origin.errors }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Local pilot package preflight request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  if (!isLocalPackageRequest(bodyResult.value)) return json({ status: "rejected", errors: ["Local pilot package preflight requires the same bounded manifest, QR registry, receipt, package index, bundle manifest, operator, timestamp, quarantine, and review packet fields as the package writer."], sideEffect: "none" }, 400);
  if (!hasPilotDeliveryApiToken(request, bodyResult.value.manifest.tenantId)) return json({ status: "unauthorized", errors: ["The pilot delivery credential is not authorized for this tenant."], sideEffect: "none" }, 401);

  const result = await readLocalPackageExecutionPreflight(bodyResult.value);
  return json(result.preflight, result.preflight.executionReady ? 200 : 423);
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
