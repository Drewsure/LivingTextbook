import { NextResponse } from "next/server";
import {
  createUploadQuarantinePackageHandoffPreview,
  createUploadQuarantinePackageReviewPacket,
  deriveUploadQuarantineAdmissionPreview,
  isUploadQuarantineSafeTenantId,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import {
  readQuarantinePackageReviewPacket,
  readQuarantineReviewDecision,
  readQuarantineUploadRecords,
  writeQuarantinePackageReviewPacket,
} from "@/server/uploads/quarantineUploadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PacketRequest = {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", packet: null, errors: ["Package review packet query exceeds bounded identifier limits."] }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", packet: null, errors: ["Package review packet requires tenantId and quarantineId."] }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", packet: null, errors: ["Tenant-scoped teacher or service authorization is required for package review packet reads."], privacy: privacyMessage() }, 401);
  const result = await readQuarantinePackageReviewPacket(tenantId, quarantineId);
  return json({
    status: result.record ? "available" : "not-recorded",
    tenantId,
    quarantineId,
    packet: result.record,
    packetPresent: Boolean(result.record),
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    errors: result.errors,
    privacy: privacyMessage(),
  });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasUploadApiToken(request)) return json({ status: "forbidden", packet: null, errors: origin.errors }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Package review packet request");
  if (!bodyResult.ok) return json({ status: "rejected", packet: null, errors: bodyResult.errors }, bodyResult.status);
  const body = bodyResult.value;
  if (!isPacketRequest(body)) return json({ status: "rejected", packet: null, errors: ["Package review packet requires tenantId and quarantineId, with an optional packageId."] }, 400);
  if (!isUploadQuarantineSafeTenantId(body.tenantId)) return json({ status: "rejected", packet: null, errors: ["Package review packet tenant identity is unsafe."] }, 400);
  if (!hasReviewAuthorization(request, body.tenantId)) return json({ status: "unauthorized", packet: null, errors: ["Tenant-scoped teacher or service authorization is required for package review packet writes."], privacy: privacyMessage() }, 401);
  if (process.env.LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED !== "true") return json({ status: "blocked", packet: null, errors: ["Package review packet writes are disabled. Enable the explicit local packet gate before recording a review packet."], privacy: privacyMessage() }, 423);

  const existing = await readQuarantinePackageReviewPacket(body.tenantId, body.quarantineId);
  if (existing.record) return json({ status: "recorded-review-only", packet: existing.record, idempotent: true, errors: existing.errors, privacy: privacyMessage() });

  const intake = await readQuarantineUploadRecords(body.tenantId, body.quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== body.quarantineId) return json({ status: "not-found", packet: null, errors: ["The quarantine record was not available for package review packet capture."], privacy: privacyMessage() }, 404);
  const packageId = body.packageId || derivePackageId(body.tenantId, summary.record.unitKey);
  const evidencePacketId = `evidence-packet:${summary.quarantineId}`;
  const admission = deriveUploadQuarantineAdmissionPreview(summary.record, {
    scanStatus: "pending",
    rightsStatus: "unknown",
    sourceReviewStatus: "unreviewed",
    targetMappingReviewed: false,
    accessibilityReviewed: false,
    releaseApproved: false,
    evidencePacketId,
  });
  const handoff = createUploadQuarantinePackageHandoffPreview({
    summary,
    admission,
    sourceId: `quarantine-record:${summary.quarantineId}`,
    packageId,
  });
  const reviewDecision = (await readQuarantineReviewDecision(body.tenantId, body.quarantineId)).record ?? undefined;
  const packet = createUploadQuarantinePackageReviewPacket({ handoff, reviewDecision, capturedAt: new Date().toISOString() });
  const result = await writeQuarantinePackageReviewPacket(packet);
  if (result.status === "conflict") return json({ status: result.status, packet: null, idempotent: false, errors: result.errors, privacy: privacyMessage() }, 409);
  if (result.status === "blocked") return json({ status: result.status, packet: null, idempotent: false, errors: result.errors, privacy: privacyMessage() }, 423);
  return json({
    status: "recorded-review-only",
    packet: result.record,
    idempotent: result.idempotent,
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    errors: result.errors,
    privacy: privacyMessage(),
  });
}

function isPacketRequest(value: unknown): value is PacketRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string"
    && typeof candidate.quarantineId === "string"
    && (candidate.packageId === undefined || (typeof candidate.packageId === "string" && /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,199}$/.test(candidate.packageId)));
}

function derivePackageId(tenantId: string, unitKey?: string): string {
  const identity = (unitKey || `${tenantId}:unassigned`).replace(/[^A-Za-z0-9._:-]+/g, "-").slice(0, 120);
  return `${identity}-package`;
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean {
  return hasUploadApiToken(request) || hasTeacherOperationsReadAuthorization(request, tenantId);
}

function hasUploadApiToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}

function privacyMessage(): string {
  return "Package review packets contain bounded metadata only; they never include raw payloads, filesystem paths, credentials, learner records, or download URLs.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
