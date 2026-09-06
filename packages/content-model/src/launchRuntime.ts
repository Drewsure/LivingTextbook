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

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (session.tenantId !== request.tenantId) errors.push("launch session tenant must match runtime tenantId");
  if (!request.teacherRoleVerified) errors.push("teacher role verification is required");
  if (!request.packageRuntimeApproved) errors.push("content package runtime approval is required");
  if (!request.assignmentRuntimeApproved) errors.push("teacher assignment runtime approval is required");
  if (!request.teacherQrOrFrontDoorReviewed) errors.push("teacher QR or front-door review is required");
  if (!request.schoolPolicyAccepted) errors.push("accepted school or tenant launch policy is required");
  if (!request.rosterPolicyAccepted) errors.push("accepted roster and learner identity policy is required");
  if (!request.persistenceReady) errors.push("launch and progress persistence readiness is required");
  if (!request.reportingPolicyAccepted) errors.push("accepted teacher reporting policy is required");
  if (!request.targetLanguageAudioReady) errors.push("target-language audio readiness is required");
  if (request.supportLanguageProgressAllowed) errors.push("support language progress must remain disabled");
  if (request.mediaOnlyProgressAllowed) errors.push("media-only progress must remain disabled");

  if (request.studentLaunchRequested) {
    if (session.status !== "open") errors.push(`student launch requires an open session, not ${session.status}`);
    if (session.accessMode !== request.accessMode) errors.push("launch access mode must match the reviewed session access mode");
    if (request.realLearnerDataRequested && (!request.persistenceReady || !request.rosterPolicyAccepted)) {
      errors.push("real learner data requires persistence and roster policy readiness");
    }
  }

  if (request.accessMode === "teacher-qr" && !request.stableQrReady) {
    errors.push("teacher QR launch requires stable QR readiness");
  }

  if (request.accessMode === "permanent-qr" && (!request.stableQrReady || !request.localFallbackReady)) {
    errors.push("permanent QR launch requires stable QR and local fallback readiness");
  }

  if (request.accessMode === "front-door-code" && !request.teacherQrOrFrontDoorReviewed) {
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
