import { NextResponse } from "next/server";
import { assembleLocalPilotPackage } from "@/server/delivery/localPilotPackageAssembler";
import { isLocalPackageRequest, readLocalPackageExecutionPreflight } from "@/server/delivery/localPackageExecutionPreflight";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { hasPilotDeliveryApiCredential, hasPilotDeliveryApiToken } from "@/server/delivery/pilotDeliveryAuthorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasPilotDeliveryApiCredential(request)) return json({ status: "forbidden", errors: origin.errors }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Local pilot package request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  if (!isLocalPackageRequest(bodyResult.value)) return json({ status: "rejected", errors: ["Local pilot package assembly requires manifest, approved QR registry record, receipt, package index, bundle manifest, operator, timestamp, quarantine, and review packet fields."], privacy: privacyMessage() }, 400);
  if (!hasPilotDeliveryApiToken(request, bodyResult.value.manifest.tenantId)) return json({ status: "unauthorized", errors: ["The pilot delivery credential is not authorized for this tenant."], privacy: privacyMessage() }, 401);

  const preflightResult = await readLocalPackageExecutionPreflight(bodyResult.value);
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
