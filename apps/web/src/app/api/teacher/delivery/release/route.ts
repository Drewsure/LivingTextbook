import { NextResponse } from "next/server";
import {
  createPilotDeliveryReleaseReceipt,
  validatePilotDeliveryManifest,
  validatePilotDeliveryReleaseReceipt,
  type PilotDeliveryManifest,
  type PilotDeliveryReviewerRole,
} from "@living-textbook/content-model";
import { writePilotDeliveryMetadata, type PilotDeliveryMetadataWriteInput } from "@/server/delivery/pilotDeliveryMetadataWriter";
import { readPilotDeliveryReleaseLineage } from "@/server/delivery/pilotDeliveryReleaseLineage";
import { hasPilotDeliveryApiCredential, hasPilotDeliveryApiToken } from "@/server/delivery/pilotDeliveryAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PilotDeliveryReleaseRequest = {
  manifest: PilotDeliveryManifest;
  quarantineId: string;
  reviewerId: string;
  reviewerRole: PilotDeliveryReviewerRole;
  reviewedAt: string;
  rollbackReference: string;
  operatorId: string;
  writtenAt: string;
};

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasPilotDeliveryApiCredential(request)) return json({ status: "forbidden", errors: origin.errors }, origin.status);
  if (process.env.LIVING_TEXTBOOOK_PILOT_RELEASE_RECEIPT_WRITES_ENABLED !== "true") {
    return json({ status: "blocked", errors: ["Pilot delivery release receipt writes are disabled. Enable the explicit release gate before capturing a manual release."], privacy: privacyMessage() }, 423);
  }

  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Pilot delivery release request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  if (!isReleaseRequest(bodyResult.value)) {
    return json({ status: "rejected", errors: ["Pilot delivery release requires manifest, reviewer, rollback, operator, and timestamp fields."], privacy: privacyMessage() }, 400);
  }
  if (!hasPilotDeliveryApiToken(request, bodyResult.value.manifest.tenantId)) return json({ status: "unauthorized", errors: ["The pilot delivery credential is not authorized for this tenant."], privacy: privacyMessage() }, 401);

  const manifestErrors = validatePilotDeliveryManifest(bodyResult.value.manifest);
  if (manifestErrors.length > 0) return json({ status: "blocked", errors: manifestErrors, privacy: privacyMessage() }, 423);
  const lineageErrors = await readPilotDeliveryReleaseLineage(bodyResult.value.manifest, bodyResult.value.quarantineId);
  if (lineageErrors.length > 0) return json({ status: "blocked", errors: lineageErrors, releaseReceiptWritten: false, lineageBound: false, privacy: privacyMessage() }, 423);

  const receipt = createPilotDeliveryReleaseReceipt({
    manifest: bodyResult.value.manifest,
    reviewerId: bodyResult.value.reviewerId,
    reviewerRole: bodyResult.value.reviewerRole,
    reviewedAt: bodyResult.value.reviewedAt,
    releaseApproval: "approved",
    qrPrintAuthorization: "approved",
    rollbackReference: bodyResult.value.rollbackReference,
  });
  const receiptErrors = validatePilotDeliveryReleaseReceipt(receipt);
  if (receiptErrors.length > 0) return json({ status: "blocked", receipt, errors: receiptErrors, privacy: privacyMessage() }, 423);
  if (receipt.status !== "manual-release-approved") {
    return json({ status: "blocked", receipt, errors: receipt.unresolvedRequirements, privacy: privacyMessage() }, 423);
  }

  const writeInput: PilotDeliveryMetadataWriteInput = {
    manifest: bodyResult.value.manifest,
    receipt,
    operatorId: bodyResult.value.operatorId,
    writtenAt: bodyResult.value.writtenAt,
  };
  const result = await writePilotDeliveryMetadata(writeInput);
  if (result.status === "conflict") return json({ ...result, receipt, releaseReceiptWritten: false, privacy: privacyMessage() }, 409);
  if (result.status === "blocked") return json({ ...result, receipt, releaseReceiptWritten: false, privacy: privacyMessage() }, 423);
  return json({
    ...result,
    receipt,
    releaseReceiptWritten: true,
    deliveryMetadataWritten: true,
    packageAssemblyAllowed: false,
    qrPrintAllowed: receipt.qrPrintAllowed,
    studentFacingActivationAllowed: false,
    rawPayloadIncluded: false,
    learnerRecordsIncluded: false,
    privacy: privacyMessage(),
  });
}

function isReleaseRequest(value: unknown): value is PilotDeliveryReleaseRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  const manifest = candidate.manifest;
  return Boolean(manifest && typeof manifest === "object" && !Array.isArray(manifest))
    && typeof candidate.reviewerId === "string"
    && typeof candidate.quarantineId === "string"
    && typeof candidate.reviewerRole === "string"
    && typeof candidate.reviewedAt === "string"
    && typeof candidate.rollbackReference === "string"
    && typeof candidate.operatorId === "string"
    && typeof candidate.writtenAt === "string";
}

function privacyMessage(): string {
  return "Release capture stores only an approved receipt and delivery metadata; it never accepts raw publisher payload bytes or learner records and does not activate students.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
