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

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (!request.releaseId.trim()) errors.push("releaseId is required");
  if (request.contentReviewStatus === "rejected") errors.push("rejected content cannot enter release control");
  if (!request.sourceExtractionAccepted) errors.push("accepted source extraction evidence is required");
  if (!request.assetRightsAccepted) errors.push("accepted asset rights evidence is required");
  if (!request.targetLanguageAudioReady) errors.push("target-language audio readiness is required");
  if (!request.curatedPathwayReviewed) errors.push("curated activity pathway review is required");
  if (!request.packageRuntimeApproved) errors.push("content package runtime approval is required");
  if (request.verifierEvidenceStatus !== "passed") errors.push("passed verifier evidence is required");

  if (["approved", "active"].includes(request.requestedState)) {
    if (request.contentReviewStatus !== "approved") errors.push("approved release state requires approved content review");
    if (!request.teacherApprovalAccepted) errors.push("approved release state requires teacher or tenant approval");
    if (!request.schoolPolicyAccepted) errors.push("approved release state requires accepted school or tenant policy");
    if (!request.persistenceReady) errors.push("approved release state requires persistence readiness");
    if (!request.rollbackReady) errors.push("approved release state requires rollback readiness");
  }

  if (request.requestedState === "active") {
    if (!request.studentFacingActivationRequested) errors.push("active release state requires explicit student-facing activation request");
    if (!request.qrMutationRequested) errors.push("active release state requires explicit QR activation request");
  }

  if (request.qrMutationRequested && request.requestedState !== "active") {
    errors.push("production QR mutation is only valid for an active release request");
  }

  if (request.studentFacingActivationRequested && !["approved", "active"].includes(request.requestedState)) {
    errors.push("student-facing activation requires an approved or active release request");
  }

  if (request.requestedState === "rollback" && !request.rollbackReady) {
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
