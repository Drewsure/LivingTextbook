export type EntitlementRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";
export type EntitlementFeature =
  | "ai-tutor"
  | "microphone-practice"
  | "assist-language"
  | "background-media"
  | "local-companion"
  | "teacher-reports"
  | "student-assignments";
export type EntitlementRequestedState = "disabled" | "preview" | "enabled";

export interface EntitlementRuntimeRequest {
  tenantId: string;
  packageId: string;
  entitlementId: string;
  feature: EntitlementFeature;
  requestedState: EntitlementRequestedState;
  mode: EntitlementRuntimeMode;
  packageTier: "core" | "premium" | "enterprise";
  teacherApprovalAccepted: boolean;
  schoolPolicyAccepted: boolean;
  privacyPolicyAccepted: boolean;
  costPolicyAccepted: boolean;
  persistenceReady: boolean;
  releaseApprovalAccepted: boolean;
  allowedLevelsDeclared: boolean;
  usageLimitDeclared: boolean;
  targetLanguageAudioReady: boolean;
}

export interface EntitlementRuntimeDecision {
  allowed: boolean;
  mode: EntitlementRuntimeMode;
  reasonCode: string;
  reasons: string[];
  feature: EntitlementFeature;
  requestedState: EntitlementRequestedState;
}

export interface EntitlementRuntimeResult {
  request: EntitlementRuntimeRequest;
  decision: EntitlementRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface EntitlementRuntimeAdapter {
  readonly mode: EntitlementRuntimeMode;
  evaluate(request: EntitlementRuntimeRequest): EntitlementRuntimeDecision;
  execute(request: EntitlementRuntimeRequest): EntitlementRuntimeResult;
}

export const reviewOnlyEntitlementBlockedActions = [
  "No entitlement activation",
  "No premium provider billing",
  "No microphone recording activation",
  "No AI Tutor dispatch",
  "No student-facing feature unlock",
  "No persistence or release mutation",
] as const;

export function validateEntitlementRuntimeRequest(request: EntitlementRuntimeRequest): string[] {
  const errors: string[] = [];

  for (const field of [
    "teacherApprovalAccepted",
    "schoolPolicyAccepted",
    "privacyPolicyAccepted",
    "costPolicyAccepted",
    "persistenceReady",
    "releaseApprovalAccepted",
    "allowedLevelsDeclared",
    "usageLimitDeclared",
    "targetLanguageAudioReady",
  ] as const) {
    if (typeof request[field] !== "boolean") errors.push(`${field} must be a boolean`);
  }

  const teacherApprovalAccepted = request.teacherApprovalAccepted === true;
  const schoolPolicyAccepted = request.schoolPolicyAccepted === true;
  const privacyPolicyAccepted = request.privacyPolicyAccepted === true;
  const costPolicyAccepted = request.costPolicyAccepted === true;
  const persistenceReady = request.persistenceReady === true;
  const releaseApprovalAccepted = request.releaseApprovalAccepted === true;
  const allowedLevelsDeclared = request.allowedLevelsDeclared === true;
  const usageLimitDeclared = request.usageLimitDeclared === true;
  const targetLanguageAudioReady = request.targetLanguageAudioReady === true;

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (!request.entitlementId.trim()) errors.push("entitlementId is required");
  if (!teacherApprovalAccepted) errors.push("teacher approval is required");
  if (!schoolPolicyAccepted) errors.push("school policy acceptance is required");
  if (!privacyPolicyAccepted) errors.push("privacy policy acceptance is required");
  if (!costPolicyAccepted) errors.push("cost policy acceptance is required");
  if (!persistenceReady) errors.push("entitlement persistence readiness is required");
  if (!releaseApprovalAccepted) errors.push("entitlement release approval is required");
  if (!allowedLevelsDeclared) errors.push("allowed levels must be declared");
  if (!usageLimitDeclared) errors.push("usage limits must be declared");
  if (!targetLanguageAudioReady) errors.push("target-language audio readiness is required");
  if (request.requestedState === "enabled" && request.packageTier === "core" && request.feature === "ai-tutor") {
    errors.push("AI Tutor requires premium or enterprise entitlement");
  }
  if (request.feature === "ai-tutor" && request.mode === "review-only") errors.push("AI Tutor remains disabled in review-only mode");
  if (request.feature === "microphone-practice" && request.mode === "review-only") {
    errors.push("microphone practice remains disabled in review-only mode");
  }
  return [...new Set(errors)];
}

export function createReviewOnlyEntitlementRuntimeAdapter(): EntitlementRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateEntitlementRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyEntitlementBlockedActions,
        "No entitlement runtime adapter has been selected for live use",
      ];
      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-entitlement-runtime-request" : "review-only-entitlement-runtime",
        reasons: [...new Set(reasons)],
        feature: request.feature,
        requestedState: request.requestedState,
      };
    },
    execute(request) {
      return { request, decision: this.evaluate(request), sideEffect: "none" };
    },
  };
}
