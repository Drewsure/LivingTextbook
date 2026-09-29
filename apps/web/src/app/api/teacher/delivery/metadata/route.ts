import { NextResponse } from "next/server";
import type { PilotDeliveryMetadataWriteInput } from "@/server/delivery/pilotDeliveryMetadataWriter";
import { readPilotDeliveryMetadata, writePilotDeliveryMetadata } from "@/server/delivery/pilotDeliveryMetadataWriter";
import { readPilotDeliveryReleaseLineage } from "@/server/delivery/pilotDeliveryReleaseLineage";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PilotDeliveryMetadataWriteRequest = PilotDeliveryMetadataWriteInput & { quarantineId: string };

export async function GET(request: Request) {
  if (!hasWriterToken(request)) return json({ status: "unauthorized", errors: ["A dedicated pilot delivery writer token is required."], privacy: privacyMessage() }, 401);
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const packageId = readBoundedQueryParam(url, "packageId");
  const version = readBoundedQueryParam(url, "version");
  if ([tenantId, packageId, version].some((value) => value === undefined || !value)) return json({ status: "rejected", errors: ["Pilot delivery metadata reads require bounded tenantId, packageId, and version identifiers."], privacy: privacyMessage() }, 400);
  const result = await readPilotDeliveryMetadata({ tenantId: tenantId as string, packageId: packageId as string, version: version as string });
  if (result.status === "not-found") return json({ ...result, privacy: privacyMessage() }, 404);
  if (result.status === "blocked") return json({ ...result, privacy: privacyMessage() }, 423);
  return json({ ...result, rawPayloadIncluded: false, learnerRecordsIncluded: false, privacy: privacyMessage() });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasWriterToken(request)) return json({ status: "forbidden", errors: origin.errors }, origin.status);
  if (!hasWriterToken(request)) return json({ status: "unauthorized", errors: ["A dedicated pilot delivery writer token is required."], privacy: privacyMessage() }, 401);

  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Pilot delivery metadata request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  if (!isWriterInput(bodyResult.value)) return json({ status: "rejected", errors: ["Pilot delivery metadata requires manifest, receipt, operatorId, and writtenAt."], privacy: privacyMessage() }, 400);
  if (process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_WRITES_ENABLED !== "true") return json({ status: "blocked", errors: ["Pilot delivery metadata writes are disabled. Enable the explicit local delivery-write gate before materializing a package handoff."], privacy: privacyMessage() }, 423);

  const lineageErrors = await readPilotDeliveryReleaseLineage(bodyResult.value.manifest, bodyResult.value.quarantineId);
  if (lineageErrors.length > 0) return json({ status: "blocked", errors: lineageErrors, deliveryMetadataWritten: false, lineageBound: false, privacy: privacyMessage() }, 423);

  const { quarantineId: _quarantineId, ...writeInput } = bodyResult.value;
  const result = await writePilotDeliveryMetadata(writeInput);
  if (result.status === "conflict") return json({ ...result, privacy: privacyMessage() }, 409);
  if (result.status === "blocked") return json({ ...result, privacy: privacyMessage() }, 423);
  return json({ ...result, deliveryMetadataWritten: true, packageAssemblyAllowed: false, rawPayloadIncluded: false, studentFacingActivationAllowed: false, privacy: privacyMessage() });
}

function isWriterInput(value: unknown): value is PilotDeliveryMetadataWriteRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return Boolean(candidate.manifest && typeof candidate.manifest === "object")
    && Boolean(candidate.receipt && typeof candidate.receipt === "object")
    && typeof candidate.operatorId === "string"
    && typeof candidate.quarantineId === "string"
    && typeof candidate.writtenAt === "string";
}

function hasWriterToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}

function privacyMessage(): string {
  return "The controlled writer stores only delivery metadata and review records inside the configured custody root; it never accepts raw publisher payload bytes or learner records.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
