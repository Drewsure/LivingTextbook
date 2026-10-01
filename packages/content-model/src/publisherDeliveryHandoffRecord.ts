import type {
  UploadQuarantinePackageEvidenceLane,
  UploadQuarantinePackageEvidenceReferenceOrigin,
  UploadQuarantinePackageEvidenceReview,
} from "./uploadQuarantinePackageEvidenceReview";
import { hasCompleteCanonicalGameEvidenceRecordIds } from "./publisherSubmissionPackageEvidenceReconciliation";

export type PublisherDeliveryHandoffEvidenceStatus = "present" | "preview-only" | "missing" | "blocked";
export type PublisherDeliveryHandoffEvidenceOrigin = "publisher-asset" | "platform-derived" | "delivery-control";

export interface PublisherDeliveryHandoffEvidenceRef {
  evidenceId: string;
  label: string;
  status: PublisherDeliveryHandoffEvidenceStatus;
  origin: PublisherDeliveryHandoffEvidenceOrigin;
  identity: string;
  details: string;
  nextAction: string;
}

export interface PublisherDeliveryHandoffPackageEvidenceReference {
  lane: UploadQuarantinePackageEvidenceLane;
  referenceId: string;
  origin: UploadQuarantinePackageEvidenceReferenceOrigin;
  publisherEvidenceRequestIds: string[];
}

export interface PublisherDeliveryHandoffPackageEvidenceSummary {
  status: UploadQuarantinePackageEvidenceReview["status"] | "not-recorded";
  reviewId: string | null;
  references: PublisherDeliveryHandoffPackageEvidenceReference[];
  canonicalGameDerivedEvidenceRecordIds: string[];
  publisherAssetReferenceCount: number;
  platformDerivedReferenceCount: number;
}

export interface PublisherDeliveryHandoffRecord {
  recordVersion: 1;
  handoffId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedMode: "unselected" | "closed-local" | "hosted-pwa" | "hybrid";
  status: "blocked";
  reviewOnly: true;
  evidence: PublisherDeliveryHandoffEvidenceRef[];
  packageEvidence: PublisherDeliveryHandoffPackageEvidenceSummary;
  expectedMetadataFiles: string[];
  includedMetadataFiles: string[];
  fallbackRoute: {
    status: "planned";
    routePattern: string;
    identity: string;
  };
  rollback: {
    status: "missing";
    reference: null;
    nextAction: string;
  };
  rawPayloadIncluded: false;
  learnerRecordsIncluded: false;
  qrPrintArtifactCreated: false;
  packageAssemblyAllowed: false;
  releaseWriteAllowed: false;
  qrPrintAllowed: false;
  persistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const expectedEvidenceIds = [
  "source-review",
  "sentence-approval",
  "package-review-packet",
  "delivery-manifest",
  "release-receipt",
  "package-index",
  "assembly-request",
  "qr-registry",
  "fallback-route",
] as const;

const expectedMetadataFiles = [
  "delivery-package.json",
  "delivery-manifest.json",
  "release-receipt.json",
  "handoff-record.json",
] as const;

export function createPublisherDeliveryHandoffRecord(input: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedMode: PublisherDeliveryHandoffRecord["selectedMode"];
  sourceReviewPassed: boolean;
  sentenceApprovalPassed: boolean;
  packageReviewPacketId: string | null;
  packageReviewPacketReady: boolean;
  packageEvidenceReview: Pick<UploadQuarantinePackageEvidenceReview, "status" | "reviewId" | "evidenceReferences" | "canonicalGameDerivedEvidenceRecordIds"> | null;
  deliveryManifestPreviewId: string;
  releaseReceiptPreviewId: string;
  packageIndexPreviewId: string;
  assemblyRequestPreviewId: string;
  qrRegistryId: string | null;
}): PublisherDeliveryHandoffRecord {
  const packageEvidence = createPublisherDeliveryHandoffPackageEvidenceSummary(input.packageEvidenceReview);
  const evidence = (entry: Omit<PublisherDeliveryHandoffEvidenceRef, "status"> & { status: PublisherDeliveryHandoffEvidenceStatus }): PublisherDeliveryHandoffEvidenceRef => entry;
  const sourceReviewStatus: PublisherDeliveryHandoffEvidenceStatus = input.sourceReviewPassed ? "present" : "blocked";
  const packageReviewStatus: PublisherDeliveryHandoffEvidenceStatus = input.packageReviewPacketReady ? "present" : input.packageReviewPacketId ? "blocked" : "missing";
  return {
    recordVersion: 1,
    handoffId: `${input.packageId}:${input.quarantineId}:publisher-delivery-handoff`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    sourceChecksumSha256: input.sourceChecksumSha256,
    selectedMode: input.selectedMode,
    status: "blocked",
    reviewOnly: true,
    evidence: [
      evidence({ evidenceId: "source-review", label: "Source review decision", status: sourceReviewStatus, origin: "publisher-asset", identity: `${input.quarantineId}:review-decision`, details: sourceReviewStatus === "present" ? "The accepted source decision is bound to this quarantine checksum." : "An accepted source decision is not yet bound to this handoff.", nextAction: "Record and reconcile the human source review decision." }),
      evidence({ evidenceId: "sentence-approval", label: "English sentence approval", status: input.sentenceApprovalPassed ? "present" : "blocked", origin: "publisher-asset", identity: `${input.packageId}:sentence-approval`, details: input.sentenceApprovalPassed ? "Exactly two approved English target sentences are bound to this package checksum." : "The checksum-bound approval for the two English target sentences is missing or mismatched.", nextAction: "Approve exactly two distinct English target sentences before release review." }),
      evidence({ evidenceId: "package-review-packet", label: "Package review packet", status: packageReviewStatus, origin: "delivery-control", identity: input.packageReviewPacketId ?? `${input.packageId}:package-review-packet`, details: packageReviewStatus === "present" ? "The immutable package review packet is ready for downstream reconciliation." : "The package review packet is missing or still has blockers.", nextAction: "Complete the reviewed content, game, media, rights, and accessibility evidence packet." }),
      evidence({ evidenceId: "delivery-manifest", label: "Delivery manifest preview", status: "preview-only", origin: "delivery-control", identity: input.deliveryManifestPreviewId, details: "The manifest identity is previewed, not written or approved.", nextAction: "Obtain a human-approved delivery manifest before assembly." }),
      evidence({ evidenceId: "release-receipt", label: "Release receipt preview", status: "blocked", origin: "delivery-control", identity: input.releaseReceiptPreviewId, details: "The receipt identity is reserved for review; no release approval is recorded.", nextAction: "Record named reviewer, rollback reference, policy decision, and release time." }),
      evidence({ evidenceId: "package-index", label: "Delivery package index preview", status: "blocked", origin: "delivery-control", identity: input.packageIndexPreviewId, details: "The metadata-only index is not created until manifest and receipt approval align.", nextAction: "Create and read back the index only after release approval." }),
      evidence({ evidenceId: "assembly-request", label: "Assembly request preview", status: "preview-only", origin: "delivery-control", identity: input.assemblyRequestPreviewId, details: "Writer inputs are enumerated without invoking a writer or copying files.", nextAction: "Supply every approved writer input to the separately gated package assembler." }),
      evidence({ evidenceId: "qr-registry", label: "QR alias registry", status: input.qrRegistryId ? "blocked" : "missing", origin: "delivery-control", identity: input.qrRegistryId ?? `${input.packageId}:qr-registry`, details: input.qrRegistryId ? "A registry identity exists but print authorization is not recorded." : "No approved QR alias registry is bound to this handoff.", nextAction: "Reconcile stable aliases, fallback routes, checksums, and print authorization." }),
      evidence({ evidenceId: "fallback-route", label: "Closed-local fallback route", status: "preview-only", origin: "delivery-control", identity: `${input.packageId}:fallback-route`, details: "The route shape is reserved for a future local or hybrid package; it is not live student access.", nextAction: "Verify the assembled local bundle and rollback route before any classroom use." }),
    ],
    packageEvidence,
    expectedMetadataFiles: [...expectedMetadataFiles],
    includedMetadataFiles: [],
    fallbackRoute: { status: "planned", routePattern: `/q/tenant/${input.tenantId}/package/${input.packageId}/unit/{unit}/activity/{activity}`, identity: `${input.packageId}:fallback-route` },
    rollback: { status: "missing", reference: null, nextAction: "Record an approved rollback target and named owner before release." },
    rawPayloadIncluded: false,
    learnerRecordsIncluded: false,
    qrPrintArtifactCreated: false,
    packageAssemblyAllowed: false,
    releaseWriteAllowed: false,
    qrPrintAllowed: false,
    persistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function createPublisherDeliveryHandoffPackageEvidenceSummary(
  review: Pick<UploadQuarantinePackageEvidenceReview, "status" | "reviewId" | "evidenceReferences" | "canonicalGameDerivedEvidenceRecordIds"> | null,
): PublisherDeliveryHandoffPackageEvidenceSummary {
  const references = review?.evidenceReferences.map((reference) => ({ ...reference, publisherEvidenceRequestIds: [...reference.publisherEvidenceRequestIds] })) ?? [];
  return {
    status: review?.status ?? "not-recorded",
    reviewId: review?.reviewId ?? null,
    references,
    canonicalGameDerivedEvidenceRecordIds: review?.canonicalGameDerivedEvidenceRecordIds ?? [],
    publisherAssetReferenceCount: references.filter((reference) => reference.origin === "publisher-asset").length,
    platformDerivedReferenceCount: references.filter((reference) => reference.origin === "platform-derived").length,
  };
}

export function validatePublisherDeliveryHandoffRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher delivery handoff record must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher delivery handoff recordVersion must be 1.");
  for (const field of ["handoffId", "tenantId", "quarantineId", "packageId"] as const) if (!isNonEmptyString(value[field])) errors.push(`Publisher delivery handoff ${field} must be non-empty.`);
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Publisher delivery handoff checksum must be lowercase SHA-256.");
  if (!["unselected", "closed-local", "hosted-pwa", "hybrid"].includes(String(value.selectedMode))) errors.push("Publisher delivery handoff selectedMode is unsupported.");
  if (value.status !== "blocked" || value.reviewOnly !== true || value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Publisher delivery handoff must remain blocked, review-only, and side-effect-free.");
  if (!Array.isArray(value.evidence) || value.evidence.length !== expectedEvidenceIds.length) errors.push("Publisher delivery handoff must contain the nine required evidence references.");
  const seen = new Set<string>();
  for (const item of Array.isArray(value.evidence) ? value.evidence : []) {
    if (!isRecord(item)) { errors.push("Publisher delivery handoff evidence entries must be objects."); continue; }
    const evidenceId = String(item.evidenceId ?? "");
    if (!isNonEmptyString(item.evidenceId) || seen.has(evidenceId)) errors.push("Publisher delivery handoff evidence ids must be unique and non-empty.");
    seen.add(evidenceId);
    for (const field of ["label", "identity", "details", "nextAction"] as const) if (!isNonEmptyString(item[field])) errors.push(`Publisher delivery handoff evidence ${field} must be non-empty.`);
    if (!["present", "preview-only", "missing", "blocked"].includes(String(item.status))) errors.push("Publisher delivery handoff evidence status is unsupported.");
    if (!["publisher-asset", "platform-derived", "delivery-control"].includes(String(item.origin))) errors.push("Publisher delivery handoff evidence origin is unsupported.");
  }
  for (const id of expectedEvidenceIds) if (!seen.has(id)) errors.push(`Publisher delivery handoff is missing evidence ${id}.`);
  if (!sameStringArray(value.expectedMetadataFiles, expectedMetadataFiles)) errors.push("Publisher delivery handoff expected metadata file list is invalid.");
  if (!sameStringArray(value.includedMetadataFiles, [])) errors.push("Publisher delivery handoff must not claim metadata files were delivered before release.");
  validatePackageEvidenceSummary(value.packageEvidence, errors);
  if (!isRecord(value.fallbackRoute) || value.fallbackRoute.status !== "planned" || !isNonEmptyString(value.fallbackRoute.routePattern) || !isNonEmptyString(value.fallbackRoute.identity)) errors.push("Publisher delivery handoff fallback route must remain planned and identified.");
  if (!isRecord(value.rollback) || value.rollback.status !== "missing" || value.rollback.reference !== null || !isNonEmptyString(value.rollback.nextAction)) errors.push("Publisher delivery handoff rollback must remain missing until human approval.");
  for (const field of ["rawPayloadIncluded", "learnerRecordsIncluded", "qrPrintArtifactCreated", "packageAssemblyAllowed", "releaseWriteAllowed", "qrPrintAllowed", "persistenceActivationAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function validatePackageEvidenceSummary(value: unknown, errors: string[]) {
  if (!isRecord(value)) { errors.push("Publisher delivery handoff package evidence summary must be present."); return; }
  if (!["not-recorded", "incomplete", "reviewed-package-evidence"].includes(String(value.status))) errors.push("Publisher delivery handoff package evidence status is unsupported.");
  if (value.reviewId !== null && !isNonEmptyString(value.reviewId)) errors.push("Publisher delivery handoff package evidence reviewId must be null or non-empty.");
  const references = Array.isArray(value.references) ? value.references : [];
  if (!Array.isArray(value.references)) errors.push("Publisher delivery handoff package evidence references must be an array.");
  const lanes = new Set<string>();
  for (const reference of references) {
    if (!isRecord(reference) || !isNonEmptyString(reference.lane) || !isNonEmptyString(reference.referenceId) || !["publisher-asset", "platform-derived"].includes(String(reference.origin))) {
      errors.push("Publisher delivery handoff package evidence references must carry safe lane, identity, and origin.");
      continue;
    }
    const publisherEvidenceRequestIds = reference.publisherEvidenceRequestIds;
    if (!Array.isArray(publisherEvidenceRequestIds) || publisherEvidenceRequestIds.some((requestId) => !isNonEmptyString(requestId)) || new Set(publisherEvidenceRequestIds).size !== publisherEvidenceRequestIds.length) errors.push("Publisher delivery handoff package evidence publisher request IDs must be unique and non-empty.");
    if (reference.lane === "game" && Array.isArray(publisherEvidenceRequestIds) && publisherEvidenceRequestIds.length > 0) errors.push("Publisher delivery handoff game evidence must not carry publisher request IDs.");
    if (reference.lane !== "game" && Array.isArray(publisherEvidenceRequestIds) && publisherEvidenceRequestIds.length === 0) errors.push("Publisher delivery handoff publisher evidence must carry publisher request IDs.");
    if (lanes.has(String(reference.lane))) errors.push("Publisher delivery handoff package evidence references must contain unique lanes.");
    lanes.add(String(reference.lane));
  }
  const publisherCount = references.filter((reference) => isRecord(reference) && reference.origin === "publisher-asset").length;
  const derivedCount = references.filter((reference) => isRecord(reference) && reference.origin === "platform-derived").length;
  const canonicalGameIds = value.canonicalGameDerivedEvidenceRecordIds;
  if (!Array.isArray(canonicalGameIds) || canonicalGameIds.some((recordId) => !isNonEmptyString(recordId))) errors.push("Publisher delivery handoff canonical game evidence IDs must be an array of non-empty strings.");
  if (value.status === "reviewed-package-evidence" && !hasCompleteCanonicalGameEvidenceRecordIds(Array.isArray(canonicalGameIds) ? canonicalGameIds : [])) errors.push("Reviewed package evidence must carry the complete canonical game evidence set.");
  if (value.publisherAssetReferenceCount !== publisherCount || value.platformDerivedReferenceCount !== derivedCount) errors.push("Publisher delivery handoff package evidence origin counts must match references.");
  if (value.status === "not-recorded" && (references.length !== 0 || value.reviewId !== null)) errors.push("Unrecorded package evidence must not expose review references.");
}

function sameStringArray(value: unknown, expected: readonly string[]): boolean { return Array.isArray(value) && value.length === expected.length && value.every((item, index) => item === expected[index]); }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
