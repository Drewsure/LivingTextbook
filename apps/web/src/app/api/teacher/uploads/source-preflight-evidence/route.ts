import { NextResponse } from "next/server";
import {
  isUploadQuarantineSafeTenantId,
  validatePublisherSourcePackagePreflightReport,
  type PublisherSourcePackagePreflightReport,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { hasUploadQuarantineApiCredential, hasUploadQuarantineApiToken } from "@/server/uploads/uploadQuarantineAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import {
  readQuarantineSourcePreflightEvidence,
  readQuarantineUploadRecords,
  writeQuarantineSourcePreflightEvidence,
} from "@/server/uploads/quarantineUploadStore";
import { deriveQuarantinePackageId } from "@/server/uploads/quarantinePackageIdentity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SourcePreflightEvidenceRequest = {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  report: PublisherSourcePackagePreflightReport;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", record: null, errors: ["Source preflight evidence query exceeds bounded identifier limits."], privacy: privacyMessage() }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", record: null, errors: ["Source preflight evidence requires a safe tenantId and quarantineId."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for source preflight evidence reads."], privacy: privacyMessage() }, 401);
  const result = await readQuarantineSourcePreflightEvidence(tenantId, quarantineId);
  return json({ status: result.record ? "review-only" : "not-recorded", tenantId, quarantineId, record: result.record, packageAssemblyAllowed: false, packagePromotionAllowed: false, qrPrintAllowed: false, hostedPersistenceActivationAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasUploadQuarantineApiCredential(request)) return json({ status: "forbidden", record: null, errors: origin.errors, privacy: privacyMessage() }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Publisher source preflight evidence request");
  if (!bodyResult.ok) return json({ status: "rejected", record: null, errors: bodyResult.errors, privacy: privacyMessage() }, bodyResult.status);
  if (!isSourcePreflightEvidenceRequest(bodyResult.value)) return json({ status: "rejected", record: null, errors: ["Source preflight evidence requires tenantId, quarantineId, and a complete preflight report."], privacy: privacyMessage() }, 400);
  const input = bodyResult.value;
  if (!isUploadQuarantineSafeTenantId(input.tenantId)) return json({ status: "rejected", record: null, errors: ["Source preflight evidence tenant identity is unsafe."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, input.tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for source preflight evidence writes."], privacy: privacyMessage() }, 401);
  const reportErrors = validatePublisherSourcePackagePreflightReport(input.report);
  if (reportErrors.length > 0) return json({ status: "rejected", record: null, errors: reportErrors, privacy: privacyMessage() }, 400);
  if (input.report.status !== "blocked" || input.report.inventoryStatus !== "complete") return json({ status: "rejected", record: null, errors: ["Only a blocked report with a complete inventory can be attached as review evidence."], privacy: privacyMessage() }, 400);
  if (input.report.tenantId !== input.tenantId) return json({ status: "rejected", record: null, errors: ["The preflight report tenant does not match the evidence request."], privacy: privacyMessage() }, 400);
  const intake = await readQuarantineUploadRecords(input.tenantId, input.quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== input.quarantineId) return json({ status: "not-found", record: null, errors: ["The requested quarantine record was not available for source preflight evidence capture."], privacy: privacyMessage() }, 404);
  const packageId = input.packageId || deriveQuarantinePackageId(input.tenantId, summary.record.unitKey);
  if (input.report.packageId !== packageId) return json({ status: "rejected", record: null, errors: ["The preflight report package does not match the quarantine package identity."], privacy: privacyMessage() }, 400);
  const source = input.report.files.find((file) => file.kind === "textbook-source" && file.status === "verified" && file.unitKey === summary.record.unitKey && file.checksumSha256);
  if (!source || normalizeChecksum(source.checksumSha256) !== normalizeChecksum(summary.record.checksumSha256)) return json({ status: "rejected", record: null, errors: ["A verified textbook-source file with the quarantined intake checksum was not found in the preflight report."], privacy: privacyMessage() }, 400);
  const result = await writeQuarantineSourcePreflightEvidence({
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId,
    reportId: input.report.reportId,
    manifestId: input.report.manifestId,
    version: input.report.version,
    sourceAssetId: source.assetId,
    sourceRelativePath: source.relativePath,
    sourceUnitKey: source.unitKey,
    sourceChecksumSha256: normalizeChecksum(source.checksumSha256),
    manifestChecksumSha256: input.report.manifestChecksumSha256,
    inventoryChecksumSha256: input.report.inventoryChecksumSha256,
    declaredAssetCount: input.report.counts.declared,
    verifiedAssetCount: input.report.counts.verified,
    capturedAt: new Date().toISOString(),
  });
  const status = result.status === "accepted" ? 200 : result.status === "conflict" ? 409 : 423;
  return json({ status: result.status === "accepted" ? "recorded-review-only" : result.status, record: result.record ?? null, idempotent: result.idempotent, packageAssemblyAllowed: false, packagePromotionAllowed: false, qrPrintAllowed: false, hostedPersistenceActivationAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() }, status);
}

function isSourcePreflightEvidenceRequest(value: unknown): value is SourcePreflightEvidenceRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string" && typeof candidate.quarantineId === "string" && (candidate.packageId === undefined || typeof candidate.packageId === "string") && typeof candidate.report === "object" && candidate.report !== null && !Array.isArray(candidate.report);
}

function normalizeChecksum(value: string | null | undefined): string { return `sha256:${String(value ?? "").replace(/^sha256:/i, "").toLowerCase()}`; }
function hasReviewAuthorization(request: Request, tenantId: string): boolean { return hasUploadQuarantineApiToken(request, tenantId) || hasTeacherOperationsReadAuthorization(request, tenantId); }
function privacyMessage(): string { return "Source preflight evidence returns bounded review metadata only; it never returns raw payloads, filesystem paths, credentials, download URLs, package files, QR authorization, persistence activation, or student access."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
