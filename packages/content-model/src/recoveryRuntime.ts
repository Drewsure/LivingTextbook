export type RecoveryRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";
export type RecoveryOperation = "backup" | "restore" | "export" | "rollback";
export type RecoveryRequestedState = "planned" | "verified" | "ready" | "executing" | "completed" | "blocked";

export interface RecoveryRuntimeRequest {
  tenantId: string;
  packageId: string;
  recoveryId: string;
  operation: RecoveryOperation;
  requestedState: RecoveryRequestedState;
  mode: RecoveryRuntimeMode;
  persistenceReady: boolean;
  backupManifestReady: boolean;
  checksumVerified: boolean;
  encryptionReady: boolean;
  accessControlReady: boolean;
  retentionPolicyAccepted: boolean;
  schoolPolicyAccepted: boolean;
  reportIntegrityReady: boolean;
  rollbackReady: boolean;
  releaseApprovalAccepted: boolean;
  rawLearnerAudioExcluded: boolean;
  rawLearnerTranscriptsExcluded: boolean;
  localFallbackReviewed: boolean;
}

export interface RecoveryRuntimeDecision {
  allowed: boolean;
  mode: RecoveryRuntimeMode;
  reasonCode: string;
  reasons: string[];
  operation: RecoveryOperation;
  requestedState: RecoveryRequestedState;
}

export interface RecoveryRuntimeResult {
  request: RecoveryRuntimeRequest;
  decision: RecoveryRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface RecoveryRuntimeAdapter {
  readonly mode: RecoveryRuntimeMode;
  evaluate(request: RecoveryRuntimeRequest): RecoveryRuntimeDecision;
  execute(request: RecoveryRuntimeRequest): RecoveryRuntimeResult;
}

export const reviewOnlyRecoveryBlockedActions = [
  "No backup creation",
  "No restore execution",
  "No export archive creation",
  "No package or media copy",
  "No learner-data recovery",
  "No QR or route mutation",
  "No release rollback execution",
] as const;

export function validateRecoveryRuntimeRequest(request: RecoveryRuntimeRequest): string[] {
  const errors: string[] = [];
  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (!request.recoveryId.trim()) errors.push("recoveryId is required");
  if (!request.persistenceReady) errors.push("persistence readiness is required");
  if (!request.backupManifestReady) errors.push("backup manifest readiness is required");
  if (!request.checksumVerified) errors.push("checksum verification is required");
  if (!request.encryptionReady) errors.push("encryption readiness is required");
  if (!request.accessControlReady) errors.push("access control readiness is required");
  if (!request.retentionPolicyAccepted) errors.push("retention policy acceptance is required");
  if (!request.schoolPolicyAccepted) errors.push("school or tenant policy acceptance is required");
  if (!request.reportIntegrityReady) errors.push("report integrity readiness is required");
  if (!request.rollbackReady) errors.push("rollback readiness is required");
  if (!request.releaseApprovalAccepted) errors.push("release approval is required");
  if (!request.rawLearnerAudioExcluded) errors.push("raw learner audio exclusion is required");
  if (!request.rawLearnerTranscriptsExcluded) errors.push("raw learner transcript exclusion is required");
  if (request.mode !== "hosted-managed" && !request.localFallbackReviewed) {
    errors.push("local fallback review is required for non-hosted recovery");
  }
  if (request.operation === "restore" && request.requestedState === "executing" && !request.rollbackReady) {
    errors.push("restore execution requires rollback readiness");
  }
  if (request.operation === "rollback" && request.requestedState !== "executing") {
    errors.push("rollback execution requires an executing recovery request");
  }
  return [...new Set(errors)];
}

export function createReviewOnlyRecoveryRuntimeAdapter(): RecoveryRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateRecoveryRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyRecoveryBlockedActions,
        "No recovery runtime adapter has been selected for live use",
      ];
      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-recovery-runtime-request" : "review-only-recovery-runtime",
        reasons: [...new Set(reasons)],
        operation: request.operation,
        requestedState: request.requestedState,
      };
    },
    execute(request) {
      return { request, decision: this.evaluate(request), sideEffect: "none" };
    },
  };
}
