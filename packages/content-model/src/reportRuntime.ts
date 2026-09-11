import type {
  TeacherReportExportFormat,
  TeacherReportExportPlan,
  TeacherReportExportScope,
} from "./sessionSettings";
import {
  validateTeacherReportExportPlan,
  type TeacherReportExportReadiness,
} from "./sessionSettings";
import {
  validateProgressEventEnvelopeStream,
  type ProgressEventTaxonomyRegistry,
} from "./progressEventTaxonomy";

export type ReportRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";
export type ReportLearnerIdentityMode = "pseudonymous-slots-only" | "real-identifiers" | "mixed-identifiers";

export interface TeacherReportRuntimeRequest {
  tenantId: string;
  launchCode: string;
  format: TeacherReportExportFormat;
  scopes: TeacherReportExportScope[];
  reportPlan: TeacherReportExportPlan;
  taxonomy: ProgressEventTaxonomyRegistry;
  eventEnvelopes: unknown[];
  learnerIdentityMode: ReportLearnerIdentityMode;
  teacherRoleVerified: boolean;
  policyAccepted: boolean;
  persistenceReady: boolean;
  exportApproved: boolean;
  releaseApproved: boolean;
  includesRawAudio: boolean;
  includesTranscripts: boolean;
}

export interface TeacherReportRuntimeDecision {
  allowed: boolean;
  mode: ReportRuntimeMode;
  reasonCode: string;
  reasons: string[];
  reportReadiness: TeacherReportExportReadiness;
}

export interface TeacherReportRuntimeResult {
  request: TeacherReportRuntimeRequest;
  decision: TeacherReportRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface TeacherReportRuntimeAdapter {
  readonly mode: ReportRuntimeMode;
  evaluate(request: TeacherReportRuntimeRequest): TeacherReportRuntimeDecision;
  execute(request: TeacherReportRuntimeRequest): TeacherReportRuntimeResult;
}

export const reviewOnlyReportBlockedActions = [
  "No teacher report export",
  "No learner identity promotion",
  "No raw learner audio or transcript export",
  "No hosted, local, or hybrid report write",
  "No report-driven progression or reward mutation",
] as const;

export function validateTeacherReportRuntimeRequest(request: TeacherReportRuntimeRequest): string[] {
  const errors: string[] = [];

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.launchCode.trim()) errors.push("launchCode is required");
  if (!request.format.trim()) errors.push("report format is required");
  if (request.scopes.length === 0) errors.push("at least one report scope is required");
  if (!request.teacherRoleVerified) errors.push("teacher role verification is required");
  if (!request.policyAccepted) errors.push("accepted school or tenant policy is required");
  if (!request.persistenceReady) errors.push("report persistence readiness is required");
  if (!request.exportApproved) errors.push("explicit report export approval is required");
  if (!request.releaseApproved) errors.push("release approval is required before report export");
  if (request.learnerIdentityMode !== "pseudonymous-slots-only") {
    errors.push("core teacher reports must use pseudonymous learner slots only");
  }
  if (request.includesRawAudio) errors.push("raw learner audio is excluded from core teacher reports");
  if (request.includesTranscripts) errors.push("learner transcripts are excluded from core teacher reports");

  errors.push(...validateTeacherReportExportPlan(request.reportPlan));
  errors.push(...validateProgressEventEnvelopeStream(request.eventEnvelopes, request.taxonomy));

  const missingLaunchCode = request.eventEnvelopes.some((envelope) => isRecord(envelope) && !readString(envelope, "launch_code"));
  const mismatchedLaunchCodes = [...new Set(request.eventEnvelopes
    .filter(isRecord)
    .map((envelope) => readString(envelope, "launch_code"))
    .filter((launchCode) => launchCode && launchCode !== request.launchCode))];

  if (missingLaunchCode) {
    errors.push("teacher report event envelopes must include launch_code matching runtime launchCode");
  }

  if (mismatchedLaunchCodes.length > 0) {
    errors.push(`teacher report event envelopes must use runtime launchCode ${request.launchCode}; found: ${mismatchedLaunchCodes.join(", ")}.`);
  }

  if (request.reportPlan.tenantId !== request.tenantId) {
    errors.push("report plan tenantId must match runtime tenantId");
  }

  if (request.reportPlan.launchCode !== request.launchCode) {
    errors.push("report plan launchCode must match runtime launchCode");
  }

  if (!request.reportPlan.allowedFormats.includes(request.format)) {
    errors.push(`report format ${request.format} is not allowed by the report plan`);
  }

  for (const scope of request.scopes) {
    if (!request.reportPlan.includedScopes.includes(scope)) {
      errors.push(`report scope ${scope} is not included by the report plan`);
    }
  }

  return [...new Set(errors)];
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createReviewOnlyTeacherReportRuntimeAdapter(): TeacherReportRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateTeacherReportRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyReportBlockedActions,
        "No report runtime adapter has been selected for live use",
      ];

      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-report-runtime-request" : "review-only-report-runtime",
        reasons: [...new Set(reasons)],
        reportReadiness: request.reportPlan.readiness,
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
