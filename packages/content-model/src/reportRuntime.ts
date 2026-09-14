import type {
  TeacherReportExportFormat,
  TeacherReportExportPlan,
  TeacherReportExportScope,
} from "./sessionSettings";
import type { GameModeId, GameProgressEvent } from "./index";
import { validateCanonicalGameReportEvidence } from "./canonicalGameReport";
import { getCanonicalUnitKeyTenant } from "./index";
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
  targetLanguage?: string;
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

export function validateTeacherReportCanonicalGameEvents(
  events: GameProgressEvent[],
  tenantId: string,
  launchCode: string,
  targetLanguage?: string,
): string[] {
  if (events.length > 0 && events.every((event) => event.type === "audio_requested")) return [];
  const evidence = validateCanonicalGameReportEvidence(events, tenantId, launchCode, targetLanguage);
  return evidence.errors.map((error) => `teacher report canonical game evidence: ${error}`);
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
  const booleanFields = [
    ["teacherRoleVerified", request.teacherRoleVerified],
    ["policyAccepted", request.policyAccepted],
    ["persistenceReady", request.persistenceReady],
    ["exportApproved", request.exportApproved],
    ["releaseApproved", request.releaseApproved],
    ["includesRawAudio", request.includesRawAudio],
    ["includesTranscripts", request.includesTranscripts],
  ] as const;
  for (const [label, value] of booleanFields) {
    if (typeof value !== "boolean") errors.push(`${label} must be a boolean`);
  }
  const teacherRoleVerified = request.teacherRoleVerified === true;
  const policyAccepted = request.policyAccepted === true;
  const persistenceReady = request.persistenceReady === true;
  const exportApproved = request.exportApproved === true;
  const releaseApproved = request.releaseApproved === true;
  const includesRawAudio = request.includesRawAudio === true;
  const includesTranscripts = request.includesTranscripts === true;

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.launchCode.trim()) errors.push("launchCode is required");
  if (!request.format.trim()) errors.push("report format is required");
  if (request.scopes.length === 0) errors.push("at least one report scope is required");
  if (!teacherRoleVerified) errors.push("teacher role verification is required");
  if (!policyAccepted) errors.push("accepted school or tenant policy is required");
  if (!persistenceReady) errors.push("report persistence readiness is required");
  if (!exportApproved) errors.push("explicit report export approval is required");
  if (!releaseApproved) errors.push("release approval is required before report export");
  if (request.learnerIdentityMode !== "pseudonymous-slots-only") {
    errors.push("core teacher reports must use pseudonymous learner slots only");
  }
  if (includesRawAudio) errors.push("raw learner audio is excluded from core teacher reports");
  if (includesTranscripts) errors.push("learner transcripts are excluded from core teacher reports");

  errors.push(...validateTeacherReportExportPlan(request.reportPlan));
  errors.push(...validateProgressEventEnvelopeStream(request.eventEnvelopes, request.taxonomy));

  const canonicalGameEvents = request.eventEnvelopes
    .filter(isCanonicalGameEnvelope)
    .map(toGameProgressEvent);
  if (canonicalGameEvents.some((event) => event.type !== "audio_requested")) {
    errors.push(...validateTeacherReportCanonicalGameEvents(
      canonicalGameEvents,
      request.tenantId,
      request.launchCode,
      request.targetLanguage,
    ));
  }

  const missingLaunchCode = request.eventEnvelopes.some((envelope) => isRecord(envelope) && !readString(envelope, "launch_code"));
  const mismatchedLaunchCodes = [...new Set(request.eventEnvelopes
    .filter(isRecord)
    .map((envelope) => readString(envelope, "launch_code"))
    .filter((launchCode) => launchCode && launchCode !== request.launchCode))];
  const mismatchedTenantIds = [...new Set(request.eventEnvelopes
    .filter(isRecord)
    .map((envelope) => getCanonicalUnitKeyTenant(readString(envelope, "unit_key")))
    .filter((tenantId): tenantId is string => Boolean(tenantId) && tenantId !== request.tenantId))];

  if (missingLaunchCode) {
    errors.push("teacher report event envelopes must include launch_code matching runtime launchCode");
  }

  if (mismatchedLaunchCodes.length > 0) {
    errors.push(`teacher report event envelopes must use runtime launchCode ${request.launchCode}; found: ${mismatchedLaunchCodes.join(", ")}.`);
  }

  if (mismatchedTenantIds.length > 0) {
    errors.push(`teacher report event envelopes must use runtime tenantId ${request.tenantId}; found: ${mismatchedTenantIds.join(", ")}.`);
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

function isCanonicalGameEnvelope(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  const eventType = readString(value, "event_type");
  return eventType === "audio_requested" || CANONICAL_GAME_EVENT_TYPES.has(eventType);
}

function toGameProgressEvent(envelope: Record<string, unknown>): GameProgressEvent {
  return {
    type: readString(envelope, "event_type") as GameProgressEvent["type"],
    unitKey: readString(envelope, "unit_key"),
    gameMode: readString(envelope, "game_mode") as GameModeId,
    occurredAt: readString(envelope, "occurred_at"),
    launchCode: readString(envelope, "launch_code"),
    studentSessionId: readString(envelope, "student_session_id"),
    metadata: isRecord(envelope.metadata) ? envelope.metadata as GameProgressEvent["metadata"] : {},
  };
}

const CANONICAL_GAME_EVENT_TYPES = new Set<string>([
  "game_started",
  "round_shown",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
]);

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
