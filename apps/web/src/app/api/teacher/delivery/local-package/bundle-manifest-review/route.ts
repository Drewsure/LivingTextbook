import { NextResponse } from "next/server";
import { validateLocalBundleManifest } from "@living-textbook/content-model";
import { readLocalBundleManifestReview, writeLocalBundleManifestReview, type LocalBundleManifestReviewWriteInput } from "@/server/delivery/localBundleManifestReviewWriter";
import { hasPilotDeliveryApiCredential, hasPilotDeliveryApiToken } from "@/server/delivery/pilotDeliveryAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasPilotDeliveryApiCredential(request)) return json({ status: "forbidden", errors: origin.errors, sideEffect: "none" }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Local bundle manifest review request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors, sideEffect: "none" }, bodyResult.status);
  if (!isWriteInput(bodyResult.value)) return json({ status: "rejected", errors: ["Bundle manifest review requires tenant, package, quarantine, review packet, manifest, reviewer, and reviewedAt fields."], sideEffect: "none" }, 400);
  if (!hasPilotDeliveryApiToken(request, bodyResult.value.tenantId)) return json({ status: "unauthorized", errors: ["The pilot delivery credential is not authorized for this tenant."], sideEffect: "none" }, 401);
  const result = await writeLocalBundleManifestReview(bodyResult.value);
  return json({ status: result.status, idempotent: result.idempotent, relativePath: result.relativePath, record: result.record, errors: result.errors, packageAssemblyAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, sideEffect: "none" }, result.status === "conflict" ? 409 : result.status === "blocked" ? 423 : 200);
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const tenantId = query.get("tenantId")?.trim() ?? "";
  const packageId = query.get("packageId")?.trim() ?? "";
  const version = query.get("version")?.trim() ?? "";
  if (!tenantId || !packageId || !version) return json({ status: "rejected", errors: ["Bundle manifest review reads require tenantId, packageId, and version."], sideEffect: "none" }, 400);
  if (!hasPilotDeliveryApiToken(request, tenantId)) return json({ status: "unauthorized", errors: ["The pilot delivery credential is not authorized for this tenant."], sideEffect: "none" }, 401);
  const result = await readLocalBundleManifestReview({ tenantId, packageId, version });
  return json({ ...result, packageAssemblyAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, sideEffect: "none" }, result.status === "blocked" ? 423 : 200);
}

function isWriteInput(value: unknown): value is LocalBundleManifestReviewWriteInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string" && typeof candidate.packageId === "string" && typeof candidate.quarantineId === "string" && typeof candidate.reviewPacketId === "string" && typeof candidate.reviewerId === "string" && typeof candidate.reviewedAt === "string" && Boolean(candidate.manifest && typeof candidate.manifest === "object") && validateLocalBundleManifest(candidate.manifest).errors.length === 0;
}

function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
