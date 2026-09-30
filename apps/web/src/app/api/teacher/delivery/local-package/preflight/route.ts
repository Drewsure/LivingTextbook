import { NextResponse } from "next/server";
import { hydrateLocalPackageRequestDraft, isLocalPackageRequest, isLocalPackageRequestDraft, readLocalPackageExecutionPreflight } from "@/server/delivery/localPackageExecutionPreflight";
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
  if (!isLocalPackageRequest(bodyResult.value) && !isLocalPackageRequestDraft(bodyResult.value)) return json({ status: "rejected", errors: ["Local pilot package preflight requires either the full approved request or a durable-records draft with tenant, package, quarantine, review packet, bundle manifest, operator, and timestamp fields."], sideEffect: "none" }, 400);
  const tenantId = isLocalPackageRequest(bodyResult.value) ? bodyResult.value.manifest.tenantId : bodyResult.value.tenantId;
  if (!hasPilotDeliveryApiToken(request, tenantId)) return json({ status: "unauthorized", errors: ["The pilot delivery credential is not authorized for this tenant."], sideEffect: "none" }, 401);

  const hydrated = isLocalPackageRequest(bodyResult.value)
    ? { input: bodyResult.value, errors: [] as string[] }
    : await hydrateLocalPackageRequestDraft(bodyResult.value);
  if (!hydrated.input) return json({ status: "blocked", errors: hydrated.errors, sideEffect: "none" }, 423);
  const result = await readLocalPackageExecutionPreflight(hydrated.input);
  return json(result.preflight, result.preflight.executionReady ? 200 : 423);
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
