import { NextResponse } from "next/server";
import type { ApprovedAssetPromotionRequest, PilotDeliveryManifest, PilotDeliveryReleaseReceipt } from "@living-textbook/content-model";
import { readQuarantinePackageEvidenceReview } from "@/server/uploads/quarantineUploadStore";
import { readPilotDeliveryMetadata } from "@/server/delivery/pilotDeliveryMetadataWriter";
import { readPilotDeliveryReleaseLineage } from "@/server/delivery/pilotDeliveryReleaseLineage";
import { writeApprovedAssetPromotion } from "@/server/delivery/approvedAssetPromotionWriter";
import { hasPilotDeliveryApiCredential, hasPilotDeliveryApiToken } from "@/server/delivery/pilotDeliveryAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PromoteAssetsRequest = {
  request: ApprovedAssetPromotionRequest;
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
};

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasPilotDeliveryApiCredential(request)) return json({ status: "forbidden", errors: origin.errors, privacy: privacyMessage() }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Approved asset promotion request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors, privacy: privacyMessage() }, bodyResult.status);
  if (!isRequest(bodyResult.value)) return json({ status: "rejected", errors: ["Approved asset promotion requires request, manifest, and receipt objects."], privacy: privacyMessage() }, 400);
  if (!hasPilotDeliveryApiToken(request, bodyResult.value.manifest.tenantId)) return json({ status: "unauthorized", errors: ["The pilot delivery credential is not authorized for this tenant."], privacy: privacyMessage() }, 401);

  const { request: promotionRequest, manifest, receipt } = bodyResult.value;
  if (promotionRequest.tenantId !== manifest.tenantId || promotionRequest.packageId !== manifest.packageId || promotionRequest.quarantineId === "") return blocked(["Promotion request identity does not match the delivery manifest."], false);
  const lineageErrors = await readPilotDeliveryReleaseLineage(manifest, promotionRequest.quarantineId);
  if (lineageErrors.length > 0) return blocked(lineageErrors, false);
  const evidenceResult = await readQuarantinePackageEvidenceReview(manifest.tenantId, promotionRequest.quarantineId);
  const evidence = evidenceResult.record;
  if (!evidence || evidence.status !== "reviewed-package-evidence") return blocked(["Reviewed package evidence must be readable from quarantine custody before asset promotion.", ...evidenceResult.errors], false);
  const storedDelivery = await readPilotDeliveryMetadata({ tenantId: manifest.tenantId, packageId: manifest.packageId, version: manifest.version });
  if (storedDelivery.status !== "available") return blocked(["Approved delivery metadata must already exist in custody before asset promotion.", ...storedDelivery.errors], false);
  if (!sameJson(storedDelivery.manifest, manifest) || !sameJson(storedDelivery.receipt, receipt)) return blocked(["The supplied manifest and release receipt do not match stored delivery custody."], false);

  const result = await writeApprovedAssetPromotion({ request: promotionRequest, manifest, receipt, packageEvidenceReview: evidence });
  if (result.status === "conflict") return json({ ...result, promotionWritten: false, studentFacingActivationAllowed: false, learnerRecordsIncluded: false, privacy: privacyMessage() }, 409);
  if (result.status === "blocked") return json({ ...result, promotionWritten: false, studentFacingActivationAllowed: false, learnerRecordsIncluded: false, privacy: privacyMessage() }, 423);
  return json({ ...result, promotionWritten: true, studentFacingActivationAllowed: false, learnerRecordsIncluded: false, privacy: privacyMessage() });
}

function isRequest(value: unknown): value is PromoteAssetsRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return Boolean(candidate.request && typeof candidate.request === "object" && !Array.isArray(candidate.request))
    && Boolean(candidate.manifest && typeof candidate.manifest === "object" && !Array.isArray(candidate.manifest))
    && Boolean(candidate.receipt && typeof candidate.receipt === "object" && !Array.isArray(candidate.receipt));
}

function blocked(errors: string[], lineageBound: boolean) {
  return json({ status: "blocked", errors: [...new Set(errors)], promotionWritten: false, lineageBound, studentFacingActivationAllowed: false, learnerRecordsIncluded: false, privacy: privacyMessage() }, 423);
}
function privacyMessage(): string { return "Approved asset promotion copies only checksum-verified publisher bytes after release lineage and custody checks; it never creates learner records, activates student routes, mutates QR aliases, or enables hosted persistence."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
function sameJson(left: unknown, right: unknown): boolean { return stableJson(left) === stableJson(right); }
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}
