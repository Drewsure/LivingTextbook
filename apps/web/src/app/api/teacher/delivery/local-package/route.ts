import { NextResponse } from "next/server";
import { validateLocalBundleManifest, type LocalBundleManifest, type PilotDeliveryManifest, type PilotDeliveryPackageIndex, type PilotDeliveryReleaseReceipt } from "@living-textbook/content-model";
import { assembleLocalPilotPackage, type LocalPilotPackageAssemblyInput, type LocalPilotPackageReviewBinding } from "@/server/delivery/localPilotPackageAssembler";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { readQuarantinePackageReviewPacket } from "@/server/uploads/quarantineUploadStore";
import { readPilotDeliveryReleaseLineage } from "@/server/delivery/pilotDeliveryReleaseLineage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LocalPackageRequest = LocalPilotPackageAssemblyInput & {
  quarantineId: string;
  reviewPacketId: string;
};

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasDeliveryToken(request)) return json({ status: "forbidden", errors: origin.errors }, origin.status);
  if (!hasDeliveryToken(request)) return json({ status: "unauthorized", errors: ["A dedicated pilot delivery token is required."], privacy: privacyMessage() }, 401);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Local pilot package request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  if (!isLocalPackageRequest(bodyResult.value)) return json({ status: "rejected", errors: ["Local pilot package assembly requires manifest, approved QR registry record, receipt, package index, bundle manifest, operator, timestamp, quarantine, and review packet fields."], privacy: privacyMessage() }, 400);

  const lineageErrors = await readPilotDeliveryReleaseLineage(bodyResult.value.manifest, bodyResult.value.quarantineId);
  if (lineageErrors.length > 0) {
    return json({ status: "blocked", reviewPacketBound: false, reviewPacketId: bodyResult.value.reviewPacketId, quarantineId: bodyResult.value.quarantineId, errors: lineageErrors, packageAssemblyAllowed: false, qrPrintArtifactIncluded: false, studentFacingActivationAllowed: false, hostedPersistenceActivated: false, qrAliasesMutated: false, learnerRecordsIncluded: false, lineageBound: false, privacy: privacyMessage() }, 423);
  }

  const packetResult = await readQuarantinePackageReviewPacket(bodyResult.value.manifest.tenantId, bodyResult.value.quarantineId);
  const packet = packetResult.record;
  if (!packet) {
    return json({ status: "blocked", reviewPacketBound: false, reviewPacketId: bodyResult.value.reviewPacketId, quarantineId: bodyResult.value.quarantineId, errors: ["The durable review packet could not be read from the configured quarantine custody boundary."], packageAssemblyAllowed: false, qrPrintArtifactIncluded: false, studentFacingActivationAllowed: false, hostedPersistenceActivated: false, qrAliasesMutated: false, learnerRecordsIncluded: false, privacy: privacyMessage() }, 423);
  }
  const packetErrors = validateReviewPacketBinding(bodyResult.value, packet);
  if (packetErrors.length > 0) {
    return json({ status: "blocked", reviewPacketBound: false, reviewPacketId: bodyResult.value.reviewPacketId, quarantineId: bodyResult.value.quarantineId, errors: packetErrors, packageAssemblyAllowed: false, qrPrintArtifactIncluded: false, studentFacingActivationAllowed: false, hostedPersistenceActivated: false, qrAliasesMutated: false, learnerRecordsIncluded: false, privacy: privacyMessage() }, 423);
  }

  const { quarantineId: _quarantineId, reviewPacketId: _reviewPacketId, ...assemblyInput } = bodyResult.value;
  const reviewPacketBinding: LocalPilotPackageReviewBinding = {
    recordVersion: 1,
    tenantId: packet.tenantId,
    quarantineId: packet.quarantineId,
    packetId: packet.packetId,
    packageId: packet.packageId,
    sourceChecksumSha256: packet.checksumSha256,
    status: "ready-for-next-gate",
  };
  const result = await assembleLocalPilotPackage({ ...assemblyInput, reviewPacketBinding });
  return json({ ...result, reviewPacketBound: true, reviewPacketId: bodyResult.value.reviewPacketId, quarantineId: bodyResult.value.quarantineId, packageAssemblyAllowed: result.status === "accepted", qrPrintArtifactIncluded: result.status === "accepted", studentFacingActivationAllowed: false, hostedPersistenceActivated: false, qrAliasesMutated: false, learnerRecordsIncluded: false, privacy: privacyMessage() }, result.status === "conflict" ? 409 : result.status === "blocked" ? 423 : 200);
}

function isLocalPackageRequest(value: unknown): value is LocalPackageRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return Boolean(candidate.manifest && typeof candidate.manifest === "object" && candidate.receipt && typeof candidate.receipt === "object" && candidate.qrRegistryRecord && typeof candidate.qrRegistryRecord === "object" && candidate.packageIndex && typeof candidate.packageIndex === "object" && candidate.bundleManifest && typeof candidate.bundleManifest === "object")
    && typeof candidate.operatorId === "string" && typeof candidate.writtenAt === "string" && typeof candidate.quarantineId === "string" && typeof candidate.reviewPacketId === "string" && validateLocalBundleManifest(candidate.bundleManifest).errors.length === 0;
}

function validateReviewPacketBinding(input: LocalPackageRequest, packet: Awaited<ReturnType<typeof readQuarantinePackageReviewPacket>>["record"]): string[] {
  const errors = [...(packet ? [] : ["Local pilot package assembly requires a durable quarantine package review packet."])];
  if (!packet) return [...new Set([...errors, "The review packet could not be read from the configured quarantine custody boundary."] )];
  if (packet.packetId !== input.reviewPacketId) errors.push("The supplied review packet id does not match the durable quarantine review packet.");
  if (packet.tenantId !== input.manifest.tenantId || packet.packageId !== input.manifest.packageId) errors.push("The durable review packet tenant and package identities do not match the approved delivery manifest.");
  if (packet.status !== "ready-for-next-gate" || packet.reviewDecision !== "accepted-for-package-review") errors.push("The durable review packet is not accepted for package assembly.");
  if (packet.checksumSha256 !== input.manifest.sourceAssemblyChecksum.replace(/^sha256:/, "")) errors.push("The durable review packet checksum does not match the approved delivery manifest.");
  return [...new Set(errors)];
}

function hasDeliveryToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === "Bearer " + configuredToken);
}

function privacyMessage(): string { return "Local assembly copies only explicitly approved publisher files into an immutable local package; it never activates students, mutates QR aliases, enables hosted persistence, or stores learner records."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
