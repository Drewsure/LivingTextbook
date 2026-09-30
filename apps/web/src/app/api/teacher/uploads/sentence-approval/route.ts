import { NextResponse } from "next/server";
import { isUploadQuarantineSafeTenantId, type PublisherSentenceApprovalDecision, type PublisherSentenceApprovalRecord } from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { hasUploadQuarantineApiCredential, hasUploadQuarantineApiToken } from "@/server/uploads/uploadQuarantineAuthorization";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readBoundedQueryParam, readJsonRequestBody, validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { readQuarantineSentenceApproval, readQuarantineUploadRecords, writeQuarantineSentenceApproval } from "@/server/uploads/quarantineUploadStore";
import { deriveQuarantinePackageId } from "@/server/uploads/quarantinePackageIdentity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SentenceApprovalRequest = {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  proposalId?: string;
  targetSentences: [string, string];
  reviewerId: string;
  reviewerNote: string;
  decision: PublisherSentenceApprovalDecision;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const quarantineId = readBoundedQueryParam(url, "quarantineId");
  if (tenantId === undefined || quarantineId === undefined) return json({ status: "rejected", record: null, errors: ["Sentence approval query exceeds bounded identifier limits."], privacy: privacyMessage() }, 400);
  if (!tenantId || !quarantineId || !isUploadQuarantineSafeTenantId(tenantId)) return json({ status: "rejected", record: null, errors: ["Sentence approval requires a safe tenantId and quarantineId."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for sentence approval reads."], privacy: privacyMessage() }, 401);
  const result = await readQuarantineSentenceApproval(tenantId, quarantineId);
  return json({ status: result.record ? "available" : "not-recorded", tenantId, quarantineId, record: result.record, sentenceApprovalRecorded: result.record?.decision === "approved", packageAssemblyAllowed: false, promotionAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() });
}

export async function POST(request: Request) {
  const origin = validateSameOriginMutation(request);
  if (!origin.valid && !hasUploadQuarantineApiCredential(request)) return json({ status: "forbidden", record: null, errors: origin.errors, privacy: privacyMessage() }, origin.status);
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Publisher sentence approval request");
  if (!bodyResult.ok) return json({ status: "rejected", record: null, errors: bodyResult.errors, privacy: privacyMessage() }, bodyResult.status);
  if (!isSentenceApprovalRequest(bodyResult.value)) return json({ status: "rejected", record: null, errors: ["Sentence approval requires tenant, quarantine, reviewer, note, decision, and exactly two English target sentences."], privacy: privacyMessage() }, 400);
  if (!isUploadQuarantineSafeTenantId(bodyResult.value.tenantId)) return json({ status: "rejected", record: null, errors: ["Sentence approval tenant identity is unsafe."], privacy: privacyMessage() }, 400);
  if (!hasReviewAuthorization(request, bodyResult.value.tenantId)) return json({ status: "unauthorized", record: null, errors: ["Tenant-scoped teacher or service authorization is required for sentence approval writes."], privacy: privacyMessage() }, 401);
  const intake = await readQuarantineUploadRecords(bodyResult.value.tenantId, bodyResult.value.quarantineId);
  const summary = intake.records[0];
  if (!summary || summary.quarantineId !== bodyResult.value.quarantineId) return json({ status: "not-found", record: null, errors: ["The requested quarantine record was not available for sentence approval."], privacy: privacyMessage() }, 404);
  const packageId = bodyResult.value.packageId || deriveQuarantinePackageId(bodyResult.value.tenantId, summary.record.unitKey);
  const result = await writeQuarantineSentenceApproval({ ...bodyResult.value, packageId, proposalId: bodyResult.value.proposalId || `${packageId}:authoring-proposal:review-only`, capturedAt: new Date().toISOString() });
  const status = result.status === "accepted" ? 200 : result.status === "conflict" ? 409 : 423;
  return json({ status: result.status === "accepted" ? "recorded-review-only" : result.status, record: result.record ?? null, idempotent: result.idempotent, sentenceApprovalRecorded: result.record?.decision === "approved", packageAssemblyAllowed: false, promotionAllowed: false, qrPrintAllowed: false, studentFacingUseAllowed: false, errors: result.errors, privacy: privacyMessage() }, status);
}

function isSentenceApprovalRequest(value: unknown): value is SentenceApprovalRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tenantId === "string"
    && typeof candidate.quarantineId === "string"
    && (candidate.packageId === undefined || typeof candidate.packageId === "string")
    && (candidate.proposalId === undefined || typeof candidate.proposalId === "string")
    && Array.isArray(candidate.targetSentences)
    && candidate.targetSentences.length === 2
    && candidate.targetSentences.every((sentence) => typeof sentence === "string")
    && typeof candidate.reviewerId === "string"
    && typeof candidate.reviewerNote === "string"
    && (candidate.decision === "approved" || candidate.decision === "changes-required");
}

function hasReviewAuthorization(request: Request, tenantId: string): boolean { return hasUploadQuarantineApiToken(request, tenantId) || hasTeacherOperationsReadAuthorization(request, tenantId); }
function privacyMessage(): string { return "Sentence approval stores two bounded English target sentences and reviewer metadata only; it does not upload assets, assemble a package, print QR codes, activate persistence, or authorize students."; }
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
