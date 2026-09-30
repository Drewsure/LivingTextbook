import { NextResponse } from "next/server";
import { createPilotQrAliasRegistryRecord, type PilotDeliveryManifest, type PilotDeliveryReleaseReceipt, type PilotQrAliasRegistryEntry } from "@living-textbook/content-model";
import { writePilotQrAliasRegistry } from "@/server/delivery/pilotQrAliasRegistryWriter";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QrRegistryRequest = {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  entries: PilotQrAliasRegistryEntry[];
  registeredBy: string;
  registeredAt: string;
};

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasWriterToken(request)) return json({ status: "forbidden", errors: origin.errors, privacy: privacyMessage() }, origin.status);
  if (!hasWriterToken(request)) return json({ status: "unauthorized", errors: ["A dedicated QR registry writer token is required."], privacy: privacyMessage() }, 401);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Pilot QR alias registry request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors, privacy: privacyMessage() }, bodyResult.status);
  if (!isRequest(bodyResult.value)) return json({ status: "rejected", errors: ["QR registry requires manifest, receipt, entries, registeredBy, and registeredAt."], privacy: privacyMessage() }, 400);

  let record;
  try {
    record = createPilotQrAliasRegistryRecord(bodyResult.value);
  } catch (error) {
    return json({ status: "blocked", errors: [error instanceof Error ? error.message : "QR registry record validation failed."], registryWritten: false, privacy: privacyMessage() }, 423);
  }
  const result = await writePilotQrAliasRegistry({ record });
  if (result.status === "conflict") return json({ ...result, registryWritten: false, routeMutationAllowed: false, studentFacingActivationAllowed: false, privacy: privacyMessage() }, 409);
  if (result.status === "blocked") return json({ ...result, registryWritten: false, routeMutationAllowed: false, studentFacingActivationAllowed: false, privacy: privacyMessage() }, 423);
  return json({ ...result, registryWritten: true, routeMutationAllowed: false, studentFacingActivationAllowed: false, privacy: privacyMessage() });
}

function isRequest(value: unknown): value is QrRegistryRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return Boolean(candidate.manifest && typeof candidate.manifest === "object" && !Array.isArray(candidate.manifest))
    && Boolean(candidate.receipt && typeof candidate.receipt === "object" && !Array.isArray(candidate.receipt))
    && Array.isArray(candidate.entries)
    && typeof candidate.registeredBy === "string"
    && typeof candidate.registeredAt === "string";
}

function hasWriterToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}

function privacyMessage(): string {
  return "The controlled QR registry stores only approved alias metadata inside the configured custody root; it never accepts publisher payload bytes or learner records, and it never mutates routes or activates students.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
