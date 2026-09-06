import type { PersistenceRecordCategory } from "./persistenceRecords";

export type PersistenceOperation = "read" | "write" | "delete" | "export";
export type PersistenceRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";

export interface PersistenceRuntimeRequest {
  operation: PersistenceOperation;
  tenantId: string;
  recordId: string;
  category: PersistenceRecordCategory;
  containsStudentData: boolean;
  containsRawAudio: boolean;
  containsTranscript: boolean;
  requiresSchoolPolicy: boolean;
  schoolPolicyAccepted: boolean;
  releaseApproved: boolean;
  payloadHash?: string;
}

export interface PersistenceRuntimeDecision {
  allowed: boolean;
  mode: PersistenceRuntimeMode;
  reasonCode: string;
  reasons: string[];
}

export interface PersistenceRuntimeResult {
  request: PersistenceRuntimeRequest;
  decision: PersistenceRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface PersistenceRuntimeAdapter {
  readonly mode: PersistenceRuntimeMode;
  evaluate(request: PersistenceRuntimeRequest): PersistenceRuntimeDecision;
  execute(request: PersistenceRuntimeRequest): PersistenceRuntimeResult;
}

export const reviewOnlyPersistenceBlockedActions = [
  "No hosted database write",
  "No local classroom write",
  "No hybrid sync write",
  "No learner-data export",
  "No raw audio or transcript storage",
  "No release-state mutation",
] as const;

export function validatePersistenceRuntimeRequest(request: PersistenceRuntimeRequest): string[] {
  const errors: string[] = [];

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.recordId.trim()) errors.push("recordId is required");
  if (!request.category.trim()) errors.push("category is required");
  if (request.containsStudentData && !request.requiresSchoolPolicy) {
    errors.push("student-data records require school or tenant policy");
  }
  if (request.requiresSchoolPolicy && !request.schoolPolicyAccepted) {
    errors.push("school or tenant policy acceptance is required");
  }
  if (request.containsRawAudio) errors.push("raw learner audio is not a core persistence field");
  if (request.containsTranscript) errors.push("learner transcripts are not a core persistence field");
  if (["write", "delete", "export"].includes(request.operation) && !request.releaseApproved) {
    errors.push("release approval is required before mutation or export");
  }

  return errors;
}

export function createReviewOnlyPersistenceAdapter(): PersistenceRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validatePersistenceRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyPersistenceBlockedActions,
        "No persistence adapter has been selected for live use",
      ];

      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "request-invalid" : "review-only-block",
        reasons,
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
