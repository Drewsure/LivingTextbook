import { NextResponse } from "next/server";
import {
  createUploadQuarantinePackageAssemblyPreflight,
  isUploadQuarantineSafeTenantId,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import { readQuarantinePackageEvidenceReview, readQuarantinePackageReviewPacket } from "@/server/uploads/quarantineUploadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  const requestedPackageId = readBoundedQueryParam(url, "packageId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", preflight: null, errors: ["Package assembly preflight query exceeds bounded identifier limits."] }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", preflight: null, errors: ["Package assembly preflight requires tenantId and quarantineId."] }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", preflight: null, errors: ["Tenant-scoped teacher or service authorization is required for package assembly preflight reads."], privacy: privacyMessage() }, 401);

  const packetResult = await readQuarantinePackageReviewPacket(tenantId, quarantineId);
  const packet = packetResult.record;
  if (!packet) return json({ status: "not-recorded", tenantId, quarantineId, preflight: null, errors: ["A durable package review packet is required before assembly preflight can run.", ...packetResult.errors], privacy: privacyMessage() }, 404);
  if (requestedPackageId && requestedPackageId !== packet.packageId) return json({ status: "rejected", tenantId, quarantineId, preflight: null, errors: ["Requested package identity does not match the durable review packet."], privacy: privacyMessage() }, 409);

  const packageEvidenceReviewResult = await readQuarantinePackageEvidenceReview(tenantId, quarantineId);
  const packageEvidenceReview = packageEvidenceReviewResult.record;

  const preflight = createUploadQuarantinePackageAssemblyPreflight({
    packet,
    additionalBlockers: [
      ...(packageEvidenceReview?.status === "reviewed-package-evidence" ? [] : ["A complete reviewed multimedia and game evidence sidecar is not linked to this quarantine review packet."]),
      "An approved delivery manifest is not linked to this quarantine review packet.",
      "A manual release receipt and QR print authorization are not linked to this quarantine review packet.",
      "An approved local bundle or hosted deployment handoff is not linked to this quarantine review packet.",
    ],
  });
  return json({
    status: "review-only",
    tenantId,
    quarantineId,
    preflight,
    assemblyWriteAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    errors: [...packetResult.errors, ...packageEvidenceReviewResult.errors],
    privacy: privacyMessage(),
  });
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  if (configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`) return true;
  return hasTeacherOperationsReadAuthorization(request, tenantId);
}

function privacyMessage(): string {
  return "Package assembly preflight returns bounded readiness metadata only; it never assembles files, authorizes QR printing, activates persistence, exposes payloads, or enables student use.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
