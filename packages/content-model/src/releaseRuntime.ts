import type { ContentReviewStatus } from "./index";

export type ReleaseRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";
export type ReleaseRequestedState = "review" | "release-candidate" | "approved" | "active" | "rollback";
export type VerifierEvidenceStatus = "missing" | "unresolved" | "passed";

export interface ReleaseRuntimeRequest {
  tenantId: string;
  packageId: string;
  releaseId: string;
  requestedState: ReleaseRequestedState;
  currentState: ReleaseRequestedState;
  contentReviewStatus: ContentReviewStatus;
  verifierEvidenceStatus: VerifierEvidenceStatus;
  sourceExtractionAccepted: boolean;
  assetRightsAccepted: boolean;
  targetLanguageAudioReady: boolean;
  curatedPathwayReviewed: boolean;
  packageRuntimeApproved: boolean;
  teacherApprovalAccepted: boolean;
  schoolPolicyAccepted: boolean;
  persistenceReady: boolean;
  rollbackReady: boolean;
  qrMutationRequested: boolean;
  studentFacingActivationRequested: boolean;
}

export interface ReleaseRuntimeDecision {
  allowed: boolean;
  mode: ReleaseRuntimeMode;
  reasonCode: string;
  reasons: string[];
  requestedState: ReleaseRequestedState;
}

export interface ReleaseRuntimeResult {
  request: ReleaseRuntimeRequest;
  decision: ReleaseRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface ReleaseRuntimeAdapter {
  readonly mode: ReleaseRuntimeMode;
  evaluate(request: ReleaseRuntimeRequest): ReleaseRuntimeDecision;
  execute(request: ReleaseRuntimeRequest): ReleaseRuntimeResult;
}

export const reviewOnlyReleaseBlockedActions = [
  "No release-state mutation",
  "No production QR redirect mutation",
  "No student-ready or student-facing activation",
  "No assignment or classroom launch activation",
  "No release rollback execution",
] as const;

export function validateReleaseRuntimeRequest(request: ReleaseRuntimeRequest): string[] {
  const errors: string[] = [];

  for (const field of [
    "sourceExtractionAccepted",
    "assetRightsAccepted",
    "targetLanguageAudioReady",
    "curatedPathwayReviewed",
    "packageRuntimeApproved",
    "teacherApprovalAccepted",
    "schoolPolicyAccepted",
    "persistenceReady",
    "rollbackReady",
    "qrMutationRequested",
    "studentFacingActivationRequested",
  ] as const) {
    if (typeof request[field] !== "boolean") errors.push(`${field} must be a boolean`);
  }

  const sourceExtractionAccepted = request.sourceExtractionAccepted === true;
  const assetRightsAccepted = request.assetRightsAccepted === true;
  const targetLanguageAudioReady = request.targetLanguageAudioReady === true;
  const curatedPathwayReviewed = request.curatedPathwayReviewed === true;
  const packageRuntimeApproved = request.packageRuntimeApproved === true;
  const teacherApprovalAccepted = request.teacherApprovalAccepted === true;
  const schoolPolicyAccepted = request.schoolPolicyAccepted === true;
  const persistenceReady = request.persistenceReady === true;
  const rollbackReady = request.rollbackReady === true;
  const qrMutationRequested = request.qrMutationRequested === true;
  const studentFacingActivationRequested = request.studentFacingActivationRequested === true;

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (!request.releaseId.trim()) errors.push("releaseId is required");
  if (request.contentReviewStatus === "rejected") errors.push("rejected content cannot enter release control");
  if (!sourceExtractionAccepted) errors.push("accepted source extraction evidence is required");
  if (!assetRightsAccepted) errors.push("accepted asset rights evidence is required");
  if (!targetLanguageAudioReady) errors.push("target-language audio readiness is required");
  if (!curatedPathwayReviewed) errors.push("curated activity pathway review is required");
  if (!packageRuntimeApproved) errors.push("content package runtime approval is required");
  if (request.verifierEvidenceStatus !== "passed") errors.push("passed verifier evidence is required");

  if (["approved", "active"].includes(request.requestedState)) {
    if (request.contentReviewStatus !== "approved") errors.push("approved release state requires approved content review");
    if (!teacherApprovalAccepted) errors.push("approved release state requires teacher or tenant approval");
    if (!schoolPolicyAccepted) errors.push("approved release state requires accepted school or tenant policy");
    if (!persistenceReady) errors.push("approved release state requires persistence readiness");
    if (!rollbackReady) errors.push("approved release state requires rollback readiness");
  }

  if (request.requestedState === "active") {
    if (!studentFacingActivationRequested) errors.push("active release state requires explicit student-facing activation request");
    if (!qrMutationRequested) errors.push("active release state requires explicit QR activation request");
  }

  if (qrMutationRequested && request.requestedState !== "active") {
    errors.push("production QR mutation is only valid for an active release request");
  }

  if (studentFacingActivationRequested && !["approved", "active"].includes(request.requestedState)) {
    errors.push("student-facing activation requires an approved or active release request");
  }

  if (request.requestedState === "rollback" && !rollbackReady) {
    errors.push("rollback requests require rollback readiness evidence");
  }

  return [...new Set(errors)];
}

export function createReviewOnlyReleaseRuntimeAdapter(): ReleaseRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateReleaseRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyReleaseBlockedActions,
        "No release runtime adapter has been selected for live use",
      ];

      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-release-runtime-request" : "review-only-release-runtime",
        reasons: [...new Set(reasons)],
        requestedState: request.requestedState,
      };
    },
    execute(request) {
      return {
        request,
        decision: this.evaluate(request),
        sideEffect: "none",
      };
    },
  };
}
