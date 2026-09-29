import { NextResponse } from "next/server";
import { validateLocalBundleManifest, type LocalBundleManifest, type PilotDeliveryManifest, type PilotDeliveryPackageIndex, type PilotDeliveryReleaseReceipt } from "@living-textbook/content-model";
import { assembleLocalPilotPackage, type LocalPilotPackageAssemblyInput } from "@/server/delivery/localPilotPackageAssembler";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LocalPackageRequest = LocalPilotPackageAssemblyInput;

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasDeliveryToken(request)) return json({ status: "forbidden", errors: origin.errors }, origin.status);
  if (!hasDeliveryToken(request)) return json({ status: "unauthorized", errors: ["A dedicated pilot delivery token is required."], privacy: privacyMessage() }, 401);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Local pilot package request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  if (!isLocalPackageRequest(bodyResult.value)) return json({ status: "rejected", errors: ["Local pilot package assembly requires manifest, receipt, package index, bundle manifest, operator, and timestamp fields."], privacy: privacyMessage() }, 400);
  const result = await assembleLocalPilotPackage(bodyResult.value);
  return json({ ...result, packageAssemblyAllowed: result.status === "accepted", studentFacingActivationAllowed: false, hostedPersistenceActivated: false, qrAliasesMutated: false, learnerRecordsIncluded: false, privacy: privacyMessage() }, result.status === "conflict" ? 409 : result.status === "blocked" ? 423 : 200);
}

function isLocalPackageRequest(value: unknown): value is LocalPackageRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return Boolean(candidate.manifest && typeof candidate.manifest === "object" && candidate.receipt && typeof candidate.receipt === "object" && candidate.packageIndex && typeof candidate.packageIndex === "object" && candidate.bundleManifest && typeof candidate.bundleManifest === "object")
    && typeof candidate.operatorId === "string" && typeof candidate.writtenAt === "string" && validateLocalBundleManifest(candidate.bundleManifest).errors.length === 0;
}

function hasDeliveryToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === "Bearer " + configuredToken);
}

function privacyMessage(): string { return "Local assembly copies only explicitly approved publisher files into an immutable local package; it never activates students, mutates QR aliases, enables hosted persistence, or stores learner records."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
