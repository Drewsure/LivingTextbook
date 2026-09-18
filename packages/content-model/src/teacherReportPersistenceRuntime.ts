import type { PersistenceWriteIntent } from "./persistenceAdapter";
import {
  validateDurableRecordContracts,
  type DurableRecordContract,
} from "./persistenceRecords";
import {
  validatePersistenceRuntimeRequest,
  type PersistenceRuntimeRequest,
} from "./persistenceRuntime";
import {
  validateTeacherReportRuntimeRequest,
  type TeacherReportRuntimeRequest,
} from "./reportRuntime";

export type TeacherReportPersistenceOperation = "write" | "export";

export interface TeacherReportPersistenceRuntimeRequest {
  operation: TeacherReportPersistenceOperation;
  reportRequest: TeacherReportRuntimeRequest;
  persistenceIntent: PersistenceWriteIntent;
  durableRecord: DurableRecordContract;
}

export interface TeacherReportPersistenceRuntimeDecision {
  allowed: boolean;
  mode: "review-only";
  reasonCode: string;
  reasons: string[];
  reportReadiness: TeacherReportRuntimeRequest["reportPlan"]["readiness"];
  persistenceReadiness: PersistenceWriteIntent["readiness"];
  durableRecordReadiness: DurableRecordContract["readiness"];
}

export interface TeacherReportPersistenceRuntimeResult {
  request: TeacherReportPersistenceRuntimeRequest;
  decision: TeacherReportPersistenceRuntimeDecision;
  sideEffect: "none";
}

export interface TeacherReportPersistenceRuntimeAdapter {
  readonly mode: "review-only";
  evaluate(request: TeacherReportPersistenceRuntimeRequest): TeacherReportPersistenceRuntimeDecision;
  execute(request: TeacherReportPersistenceRuntimeRequest): TeacherReportPersistenceRuntimeResult;
}

export const reviewOnlyTeacherReportPersistenceBlockedActions = [
  "No teacher report package write",
  "No teacher report export",
  "No learner identity promotion",
  "No raw learner audio or transcript storage",
  "No report-driven progression or reward mutation",
] as const;

function createPersistenceRuntimeRequest(
  request: TeacherReportPersistenceRuntimeRequest,
): PersistenceRuntimeRequest {
  return {
    operation: request.operation,
    tenantId: request.reportRequest.tenantId,
    recordId: request.durableRecord.recordId,
    category: "teacher-report-package",
    containsStudentData: request.persistenceIntent.containsStudentData,
    containsRawAudio: request.reportRequest.includesRawAudio,
    containsTranscript: request.reportRequest.includesTranscripts,
    requiresSchoolPolicy: request.persistenceIntent.requiresSchoolPolicy,
    schoolPolicyAccepted: request.reportRequest.policyAccepted,
    releaseApproved: request.reportRequest.releaseApproved,
  };
}

function validateReportPersistenceAlignment(request: TeacherReportPersistenceRuntimeRequest): string[] {
  const errors: string[] = [];
  const { persistenceIntent, durableRecord, reportRequest } = request;

  if (persistenceIntent.category !== "teacher-report-package") {
    errors.push("Teacher report persistence intent must use the teacher-report-package category.");
  }

  if (durableRecord.category !== "teacher-report-package") {
    errors.push("Teacher report persistence durable record must use the teacher-report-package category.");
  }

  if (!persistenceIntent.containsStudentData) {
    errors.push("Teacher report persistence intent must declare student data so policy gates cannot be bypassed.");
  }

  if (!persistenceIntent.requiresSchoolPolicy) {
    errors.push("Teacher report persistence intent must require school or tenant policy.");
  }

  if (!persistenceIntent.rejectsRawAudio) {
    errors.push("Teacher report persistence intent must reject raw learner audio.");
  }

  if (!persistenceIntent.rejectsTranscripts) {
    errors.push("Teacher report persistence intent must reject learner transcripts.");
  }

  if (!persistenceIntent.preservesReportEventAcceptanceSummary) {
    errors.push("Teacher report persistence intent must preserve event acceptance summaries.");
  }

  if (!persistenceIntent.preservesSettingsContext) {
    errors.push("Teacher report persistence intent must preserve settings context summaries.");
  }

  if (!persistenceIntent.preservesTenantBoundary || !persistenceIntent.tenantBoundaryKey?.trim()) {
    errors.push("Teacher report persistence intent must preserve a named tenant boundary.");
  }

  if (!durableRecord.containsStudentData) {
    errors.push("Teacher report persistence durable record must declare student data.");
  }

  if (durableRecord.storesRawAudio) {
    errors.push("Teacher report persistence durable record must not store raw learner audio.");
  }

  if (durableRecord.storesTranscript) {
    errors.push("Teacher report persistence durable record must not store learner transcripts.");
  }

  if (!durableRecord.preservesReportEventAcceptanceSummary) {
    errors.push("Teacher report persistence durable record must preserve event acceptance summaries.");
  }

  if (!durableRecord.preservesSettingsContext) {
    errors.push("Teacher report persistence durable record must preserve settings context summaries.");
  }

  if (!durableRecord.preservesTenantBoundary || !durableRecord.tenantBoundaryKey?.trim()) {
    errors.push("Teacher report persistence durable record must preserve a named tenant boundary.");
  }

  if (
    persistenceIntent.tenantBoundaryKey?.trim() &&
    durableRecord.tenantBoundaryKey?.trim() &&
    persistenceIntent.tenantBoundaryKey.trim() !== durableRecord.tenantBoundaryKey.trim()
  ) {
    errors.push("Teacher report persistence intent and durable record must use the same tenant boundary key.");
  }

  if (request.operation === "export" && !persistenceIntent.allowsExport) {
    errors.push("Teacher report persistence intent must allow export for an export operation.");
  }

  if (reportRequest.includesRawAudio && persistenceIntent.rejectsRawAudio) {
    errors.push("Teacher report persistence request cannot include raw audio when the intent rejects it.");
  }

  if (reportRequest.includesTranscripts && persistenceIntent.rejectsTranscripts) {
    errors.push("Teacher report persistence request cannot include transcripts when the intent rejects them.");
  }

  return errors;
}

export function validateTeacherReportPersistenceRuntimeRequest(
  request: TeacherReportPersistenceRuntimeRequest,
): string[] {
  return [
    ...validateTeacherReportRuntimeRequest(request.reportRequest),
    ...validatePersistenceRuntimeRequest(createPersistenceRuntimeRequest(request)),
    ...validateDurableRecordContracts([request.durableRecord]),
    ...validateReportPersistenceAlignment(request),
  ].filter((error, index, errors) => errors.indexOf(error) === index);
}

export function createReviewOnlyTeacherReportPersistenceAdapter(): TeacherReportPersistenceRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateTeacherReportPersistenceRuntimeRequest(request);
      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0
          ? "invalid-teacher-report-persistence-request"
          : "review-only-teacher-report-persistence",
        reasons: [
          ...validationErrors,
          ...reviewOnlyTeacherReportPersistenceBlockedActions,
          "No teacher report persistence adapter has been selected for live use",
        ].filter((reason, index, reasons) => reasons.indexOf(reason) === index),
        reportReadiness: request.reportRequest.reportPlan.readiness,
        persistenceReadiness: request.persistenceIntent.readiness,
        durableRecordReadiness: request.durableRecord.readiness,
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
