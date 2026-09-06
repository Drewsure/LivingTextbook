import type { TeacherAssignmentPlan } from "./teacherAssignment";
import { validateTeacherAssignmentPlan } from "./teacherAssignment";

export type AssignmentRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";

export interface AssignmentRuntimeRequest {
  tenantId: string;
  assignmentPlan: TeacherAssignmentPlan;
  teacherRoleVerified: boolean;
  packageRuntimeApproved: boolean;
  launchRuntimeApproved: boolean;
  privateLinkPolicyAccepted: boolean;
  rosterPolicyAccepted: boolean;
  persistenceReady: boolean;
  reportingPolicyAccepted: boolean;
  targetLanguageAudioReady: boolean;
  supportLanguageProgressAllowed: boolean;
  mediaOnlyProgressAllowed: boolean;
  studentFacingUseRequested: boolean;
  privateLinkActivationRequested: boolean;
  assignmentWriteRequested: boolean;
}

export interface AssignmentRuntimeDecision {
  allowed: boolean;
  mode: AssignmentRuntimeMode;
  reasonCode: string;
  reasons: string[];
  assignmentReadiness: TeacherAssignmentPlan["readiness"];
}

export interface AssignmentRuntimeResult {
  request: AssignmentRuntimeRequest;
  decision: AssignmentRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface AssignmentRuntimeAdapter {
  readonly mode: AssignmentRuntimeMode;
  evaluate(request: AssignmentRuntimeRequest): AssignmentRuntimeDecision;
  execute(request: AssignmentRuntimeRequest): AssignmentRuntimeResult;
}

export const reviewOnlyAssignmentBlockedActions = [
  "No assignment write",
  "No private link activation",
  "No roster binding",
  "No progress event stream activation",
  "No teacher report export or classroom launch",
] as const;

export function validateAssignmentRuntimeRequest(request: AssignmentRuntimeRequest): string[] {
  const errors: string[] = [];
  const plan = request.assignmentPlan;

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (plan.tenantId !== request.tenantId) errors.push("assignment tenant must match runtime tenantId");
  if (!request.teacherRoleVerified) errors.push("teacher role verification is required");
  if (!request.packageRuntimeApproved) errors.push("content package runtime approval is required");
  if (!request.launchRuntimeApproved) errors.push("classroom launch runtime approval is required");
  if (!request.privateLinkPolicyAccepted) errors.push("accepted private assignment link policy is required");
  if (!request.rosterPolicyAccepted) errors.push("accepted roster and learner identity policy is required");
  if (!request.persistenceReady) errors.push("assignment and progress persistence readiness is required");
  if (!request.reportingPolicyAccepted) errors.push("accepted teacher reporting policy is required");
  if (!request.targetLanguageAudioReady) errors.push("target-language audio readiness is required");
  if (request.supportLanguageProgressAllowed) errors.push("support language progress must remain disabled");
  if (request.mediaOnlyProgressAllowed) errors.push("media-only progress must remain disabled");

  errors.push(...validateTeacherAssignmentPlan(plan));

  if (request.studentFacingUseRequested) {
    if (plan.readiness !== "ready-for-pilot") errors.push("student-facing assignment use requires ready-for-pilot assignment readiness");
    if (!plan.access.entryCodeRequired && plan.access.accessMode === "front-door-code") {
      errors.push("front-door assignments must require an entry code");
    }
    if (plan.access.userCodeRequired && !request.rosterPolicyAccepted) {
      errors.push("user-code assignment access requires accepted roster policy");
    }
  }

  if (request.privateLinkActivationRequested) {
    if (!plan.access.entryCodeRequired && !plan.access.stableQrReady) {
      errors.push("private assignment activation requires a reviewed entry code or stable QR path");
    }
    if (!request.studentFacingUseRequested) errors.push("private link activation requires student-facing assignment use");
  }

  if (request.assignmentWriteRequested) {
    if (!request.persistenceReady) errors.push("assignment writes require persistence readiness");
    if (!request.reportingPolicyAccepted) errors.push("assignment writes require reporting policy");
  }

  return [...new Set(errors)];
}

export function createReviewOnlyAssignmentRuntimeAdapter(): AssignmentRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateAssignmentRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyAssignmentBlockedActions,
        "No assignment runtime adapter has been selected for live use",
      ];

      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-assignment-runtime-request" : "review-only-assignment-runtime",
        reasons: [...new Set(reasons)],
        assignmentReadiness: request.assignmentPlan.readiness,
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
