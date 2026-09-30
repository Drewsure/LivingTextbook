import { NextResponse } from "next/server";
import { assembleLocalPilotPackage } from "@/server/delivery/localPilotPackageAssembler";
import { hydrateLocalPackageRequestDraft, isLocalPackageRequest, isLocalPackageRequestDraft, readLocalPackageExecutionPreflight } from "@/server/delivery/localPackageExecutionPreflight";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { hasPilotDeliveryApiCredential, hasPilotDeliveryApiToken } from "@/server/delivery/pilotDeliveryAuthorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasPilotDeliveryApiCredential(request)) return json({ status: "forbidden", errors: origin.errors }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Local pilot package request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  if (!isLocalPackageRequest(bodyResult.value) && !isLocalPackageRequestDraft(bodyResult.value)) return json({ status: "rejected", errors: ["Local pilot package assembly requires either the full approved request or a durable-records draft with tenant, package, quarantine, review packet, bundle manifest, operator, and timestamp fields."], privacy: privacyMessage() }, 400);
  const tenantId = isLocalPackageRequest(bodyResult.value) ? bodyResult.value.manifest.tenantId : bodyResult.value.tenantId;
  if (!hasPilotDeliveryApiToken(request, tenantId)) return json({ status: "unauthorized", errors: ["The pilot delivery credential is not authorized for this tenant."], privacy: privacyMessage() }, 401);
  const hydrated = isLocalPackageRequest(bodyResult.value)
    ? { input: bodyResult.value, errors: [] as string[] }
    : await hydrateLocalPackageRequestDraft(bodyResult.value);
  if (!hydrated.input) return json({ status: "blocked", errors: hydrated.errors, privacy: privacyMessage() }, 423);

  const preflightResult = await readLocalPackageExecutionPreflight(hydrated.input);
  if (!preflightResult.assemblyInput) return json(preflightResult.preflight, 423);

  const result = await assembleLocalPilotPackage(preflightResult.assemblyInput);
  return json({
    ...preflightResult.preflight,
    ...result,
    status: result.status,
    executionReady: result.status === "accepted" || result.idempotent,
    packageAssemblyAllowed: result.status === "accepted" || result.idempotent,
    performedWrite: result.status === "accepted" && !result.idempotent,
    relativeDirectory: result.relativeDirectory ?? preflightResult.preflight.assembly?.relativeDirectory ?? null,
    errors: result.errors,
  }, result.status === "conflict" ? 409 : result.status === "blocked" ? 423 : 200);
}

function privacyMessage(): string {
  return "Local assembly copies only explicitly approved publisher files into an immutable local package; it never activates students, mutates QR aliases, enables hosted persistence, or stores learner records.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
