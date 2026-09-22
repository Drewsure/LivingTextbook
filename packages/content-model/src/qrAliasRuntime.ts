export type QrAliasRuntimeStatus = "draft" | "active" | "legacy" | "blocked";
export type QrAliasApprovalState = "missing" | "review-only" | "approved";
export type QrAliasDeploymentTarget = "hosted-route" | "local-bundle" | "hybrid";

export interface QrAliasRollbackEvidence {
  rollbackId: string;
  tenantId: string;
  aliasId: string;
  currentReleaseId: string;
  previousReleaseId: string;
  fallbackTarget: string;
  reason: string;
  approvalState: QrAliasApprovalState;
  routeMutationAllowed: false;
  rollbackExecutionAllowed: false;
  learnerDataMutationAllowed: false;
}

export interface QrAliasRuntimeRequest {
  aliasId: string;
  printedQrId: string;
  tenantId: string;
  packageId: string;
  releaseId: string;
  currentVersion: string;
  status: QrAliasRuntimeStatus;
  deploymentTarget: QrAliasDeploymentTarget;
  targetPath: string;
  fallbackPath: string;
  releaseApproved: boolean;
  persistenceReady: boolean;
  localFallbackReady: boolean;
  qrMutationRequested: boolean;
  studentFacingActivationRequested: boolean;
  rollback: QrAliasRollbackEvidence;
}

export interface QrAliasRuntimeDecision {
  allowed: false;
  mode: "review-only";
  reasonCode: "invalid-qr-alias-runtime" | "review-only-qr-alias-runtime";
  reasons: string[];
}

export interface QrAliasRuntimeResult {
  request: QrAliasRuntimeRequest;
  decision: QrAliasRuntimeDecision;
  sideEffect: "none";
}

export interface QrAliasRuntimeAdapter {
  readonly mode: "review-only";
  evaluate(request: QrAliasRuntimeRequest): QrAliasRuntimeDecision;
  execute(request: QrAliasRuntimeRequest): QrAliasRuntimeResult;
}

export const reviewOnlyQrAliasBlockedActions = [
  "No production QR redirect mutation",
  "No route registry write",
  "No release-state mutation",
  "No package or media swap",
  "No local bundle activation",
  "No learner-data mutation",
  "No rollback execution",
] as const;

export function validateQrAliasRuntimeRequest(request: QrAliasRuntimeRequest): string[] {
  const errors: string[] = [];
  const requiredStrings: Array<keyof QrAliasRuntimeRequest> = [
    "aliasId",
    "printedQrId",
    "tenantId",
    "packageId",
    "releaseId",
    "currentVersion",
    "targetPath",
    "fallbackPath",
  ];

  for (const field of requiredStrings) {
    if (typeof request[field] !== "string" || !request[field].trim()) {
      errors.push(`${field} is required`);
    }
  }

  for (const field of [
    "releaseApproved",
    "persistenceReady",
    "localFallbackReady",
    "qrMutationRequested",
    "studentFacingActivationRequested",
  ] as const) {
    if (typeof request[field] !== "boolean") errors.push(`${field} must be a boolean`);
  }

  if (!isSafeInternalPath(request.targetPath)) errors.push("targetPath must be a safe internal route");
  if (!isSafeInternalPath(request.fallbackPath)) errors.push("fallbackPath must be a safe internal route");
  if (request.rollback.tenantId !== request.tenantId) errors.push("rollback evidence must remain tenant-scoped");
  if (request.rollback.aliasId !== request.aliasId) errors.push("rollback evidence must bind the alias");
  if (!request.rollback.currentReleaseId.trim()) errors.push("rollback evidence requires currentReleaseId");
  if (!request.rollback.previousReleaseId.trim()) errors.push("rollback evidence requires previousReleaseId");
  if (request.rollback.currentReleaseId === request.rollback.previousReleaseId) {
    errors.push("rollback evidence must name a different previous release");
  }
  if (!isSafeInternalPath(request.rollback.fallbackTarget)) {
    errors.push("rollback fallbackTarget must be a safe internal route");
  }
  if (request.rollback.routeMutationAllowed !== false) errors.push("rollback route mutation must remain blocked");
  if (request.rollback.rollbackExecutionAllowed !== false) errors.push("rollback execution must remain blocked");
  if (request.rollback.learnerDataMutationAllowed !== false) errors.push("rollback learner-data mutation must remain blocked");

  if (request.status === "active") {
    if (!request.releaseApproved) errors.push("active alias preview requires release approval evidence");
    if (!request.persistenceReady) errors.push("active alias preview requires persistence readiness");
    if (!request.localFallbackReady) errors.push("active alias preview requires local fallback readiness");
    if (request.rollback.approvalState !== "approved") errors.push("active alias preview requires rollback approval evidence");
  }
  if (request.qrMutationRequested) errors.push("production QR redirect mutation is blocked in the review-only adapter");
  if (request.studentFacingActivationRequested) errors.push("student-facing activation is blocked in the review-only adapter");

  return [...new Set(errors)];
}

export function createReviewOnlyQrAliasRuntimeAdapter(): QrAliasRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateQrAliasRuntimeRequest(request);
      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-qr-alias-runtime" : "review-only-qr-alias-runtime",
        reasons: [...new Set([...validationErrors, ...reviewOnlyQrAliasBlockedActions])],
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

function isSafeInternalPath(value: string): boolean {
  const path = value.trim();
  return path.startsWith("/")
    && !path.startsWith("//")
    && !path.includes("\\")
    && !path.includes("..")
    && !/^\/(?:\/|.*(?:localhost|127\.0\.0\.1))/i.test(path)
    && !/^file:/i.test(path);
}
