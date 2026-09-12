import type { LaunchAccessMode, LaunchSession, LaunchSessionStatus } from "./index";

export type LaunchRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";

export interface LaunchRuntimeRequest {
  tenantId: string;
  packageId: string;
  launchSession: LaunchSession;
  accessMode: LaunchAccessMode;
  teacherRoleVerified: boolean;
  packageRuntimeApproved: boolean;
  assignmentRuntimeApproved: boolean;
  teacherQrOrFrontDoorReviewed: boolean;
  stableQrReady: boolean;
  localFallbackReady: boolean;
  schoolPolicyAccepted: boolean;
  rosterPolicyAccepted: boolean;
  persistenceReady: boolean;
  reportingPolicyAccepted: boolean;
  targetLanguageAudioReady: boolean;
  supportLanguageProgressAllowed: boolean;
  mediaOnlyProgressAllowed: boolean;
  realLearnerDataRequested: boolean;
  studentLaunchRequested: boolean;
}

export interface LaunchRuntimeDecision {
  allowed: boolean;
  mode: LaunchRuntimeMode;
  reasonCode: string;
  reasons: string[];
  sessionStatus: LaunchSessionStatus;
}

export interface LaunchRuntimeResult {
  request: LaunchRuntimeRequest;
  decision: LaunchRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface LaunchRuntimeAdapter {
  readonly mode: LaunchRuntimeMode;
  evaluate(request: LaunchRuntimeRequest): LaunchRuntimeDecision;
  execute(request: LaunchRuntimeRequest): LaunchRuntimeResult;
}

export const reviewOnlyLaunchBlockedActions = [
  "No classroom session activation",
  "No student data collection",
  "No QR redirect mutation",
  "No roster binding or report stream activation",
  "No progression or reward mutation",
] as const;

export function validateLaunchRuntimeRequest(request: LaunchRuntimeRequest): string[] {
  const errors: string[] = [];
  const session = request.launchSession;
  const booleanFields = [
    ["teacherRoleVerified", request.teacherRoleVerified],
    ["packageRuntimeApproved", request.packageRuntimeApproved],
    ["assignmentRuntimeApproved", request.assignmentRuntimeApproved],
    ["teacherQrOrFrontDoorReviewed", request.teacherQrOrFrontDoorReviewed],
    ["stableQrReady", request.stableQrReady],
    ["localFallbackReady", request.localFallbackReady],
    ["schoolPolicyAccepted", request.schoolPolicyAccepted],
    ["rosterPolicyAccepted", request.rosterPolicyAccepted],
    ["persistenceReady", request.persistenceReady],
    ["reportingPolicyAccepted", request.reportingPolicyAccepted],
    ["targetLanguageAudioReady", request.targetLanguageAudioReady],
    ["supportLanguageProgressAllowed", request.supportLanguageProgressAllowed],
    ["mediaOnlyProgressAllowed", request.mediaOnlyProgressAllowed],
    ["realLearnerDataRequested", request.realLearnerDataRequested],
    ["studentLaunchRequested", request.studentLaunchRequested],
  ] as const;
  for (const [label, value] of booleanFields) {
    if (typeof value !== "boolean") errors.push(`${label} must be a boolean`);
  }
  const teacherRoleVerified = request.teacherRoleVerified === true;
  const packageRuntimeApproved = request.packageRuntimeApproved === true;
  const assignmentRuntimeApproved = request.assignmentRuntimeApproved === true;
  const teacherQrOrFrontDoorReviewed = request.teacherQrOrFrontDoorReviewed === true;
  const stableQrReady = request.stableQrReady === true;
  const localFallbackReady = request.localFallbackReady === true;
  const schoolPolicyAccepted = request.schoolPolicyAccepted === true;
  const rosterPolicyAccepted = request.rosterPolicyAccepted === true;
  const persistenceReady = request.persistenceReady === true;
  const reportingPolicyAccepted = request.reportingPolicyAccepted === true;
  const targetLanguageAudioReady = request.targetLanguageAudioReady === true;
  const supportLanguageProgressAllowed = request.supportLanguageProgressAllowed === true;
  const mediaOnlyProgressAllowed = request.mediaOnlyProgressAllowed === true;
  const realLearnerDataRequested = request.realLearnerDataRequested === true;
  const studentLaunchRequested = request.studentLaunchRequested === true;

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (session.tenantId !== request.tenantId) errors.push("launch session tenant must match runtime tenantId");
  if (!teacherRoleVerified) errors.push("teacher role verification is required");
  if (!packageRuntimeApproved) errors.push("content package runtime approval is required");
  if (!assignmentRuntimeApproved) errors.push("teacher assignment runtime approval is required");
  if (!teacherQrOrFrontDoorReviewed) errors.push("teacher QR or front-door review is required");
  if (!schoolPolicyAccepted) errors.push("accepted school or tenant launch policy is required");
  if (!rosterPolicyAccepted) errors.push("accepted roster and learner identity policy is required");
  if (!persistenceReady) errors.push("launch and progress persistence readiness is required");
  if (!reportingPolicyAccepted) errors.push("accepted teacher reporting policy is required");
  if (!targetLanguageAudioReady) errors.push("target-language audio readiness is required");
  if (supportLanguageProgressAllowed) errors.push("support language progress must remain disabled");
  if (mediaOnlyProgressAllowed) errors.push("media-only progress must remain disabled");

  if (studentLaunchRequested) {
    if (session.status !== "open") errors.push(`student launch requires an open session, not ${session.status}`);
    if (session.accessMode !== request.accessMode) errors.push("launch access mode must match the reviewed session access mode");
    if (realLearnerDataRequested && (!persistenceReady || !rosterPolicyAccepted)) {
      errors.push("real learner data requires persistence and roster policy readiness");
    }
  }

  if (request.accessMode === "teacher-qr" && !stableQrReady) {
    errors.push("teacher QR launch requires stable QR readiness");
  }

  if (request.accessMode === "permanent-qr" && (!stableQrReady || !localFallbackReady)) {
    errors.push("permanent QR launch requires stable QR and local fallback readiness");
  }

  if (request.accessMode === "front-door-code" && !teacherQrOrFrontDoorReviewed) {
    errors.push("front-door launch requires reviewed entry and user-code policy");
  }

  return [...new Set(errors)];
}

export function createReviewOnlyLaunchRuntimeAdapter(): LaunchRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateLaunchRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyLaunchBlockedActions,
        "No launch runtime adapter has been selected for live use",
      ];

      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-launch-runtime-request" : "review-only-launch-runtime",
        reasons: [...new Set(reasons)],
        sessionStatus: request.launchSession.status,
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
