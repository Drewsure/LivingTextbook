import { validatePilotSessionEvidenceEnvelope, type PilotSessionEvidenceEnvelope } from "./pilotSessionEvidenceEnvelope";

export type PilotSessionPreflightStatus = "ready-for-review" | "incomplete" | "invalid";
export type PilotSessionPreflightCheckStatus = "pass" | "open" | "blocked";

export interface PilotSessionPreflightCheck {
  checkId: "identity" | "workflow" | "target-language" | "privacy" | "persistence" | "launch-boundary";
  label: string;
  status: PilotSessionPreflightCheckStatus;
  detail: string;
}

export interface PilotSessionPreflightResult {
  status: PilotSessionPreflightStatus;
  checks: PilotSessionPreflightCheck[];
  validationErrors: string[];
  launchAllowed: false;
  durableWriteAllowed: false;
  summary: string;
}

export interface PilotSessionPersistenceReadiness {
  status: "healthy" | "blocked" | "rehearsal" | "unauthorized" | "error";
  tenantId?: string;
  checkedAt?: string;
  durability?: "non-durable-rehearsal" | "durable-managed";
  healthy?: boolean;
  errors: string[];
}

export function evaluatePilotSessionPreflight(
  envelope: PilotSessionEvidenceEnvelope,
  persistenceReadiness?: PilotSessionPersistenceReadiness,
): PilotSessionPreflightResult {
  const validationErrors = validatePilotSessionEvidenceEnvelope(envelope);
  const identityReady = [
    envelope.tenantId,
    envelope.packageId,
    envelope.launchCode,
    envelope.unitKey,
    envelope.studentSessionId,
  ].every((value) => value.trim().length > 0);
  const completeStages = envelope.stages.filter((stage) => stage.status === "complete").length;
  const workflowComplete = envelope.journeyStatus === "complete" && completeStages === envelope.stages.length;
  const targetLanguageReady = envelope.targetLanguage.trim().length > 0;
  const privacyReady = Object.values(envelope.privacy).every((value) => value === false);
  const persistenceTenantReady = persistenceReadiness?.tenantId === envelope.tenantId;
  const persistenceTimestampReady = typeof persistenceReadiness?.checkedAt === "string"
    && persistenceReadiness.checkedAt.includes("T")
    && !Number.isNaN(Date.parse(persistenceReadiness.checkedAt));
  const persistenceReady = persistenceReadiness?.status === "healthy"
    && persistenceReadiness.healthy === true
    && persistenceReadiness.durability === "durable-managed"
    && persistenceTenantReady
    && persistenceTimestampReady;

  const checks: PilotSessionPreflightCheck[] = [
    {
      checkId: "identity",
      label: "Tenant and session identity",
      status: identityReady ? "pass" : "blocked",
      detail: identityReady ? "All tenant, package, launch, unit, and student-session fields are present." : "A required identity field is missing.",
    },
    {
      checkId: "workflow",
      label: "Canonical workflow",
      status: workflowComplete ? "pass" : "open",
      detail: workflowComplete ? "Flashcards, Memory Match, and Sentence Builder are complete in order." : `${completeStages} of ${envelope.stages.length} canonical game stages are complete.`,
    },
    {
      checkId: "target-language",
      label: "Target-language evidence",
      status: targetLanguageReady ? "pass" : "blocked",
      detail: targetLanguageReady ? `The envelope records ${envelope.targetLanguage} as the target language.` : "Target language is missing.",
    },
    {
      checkId: "privacy",
      label: "Privacy exclusions",
      status: privacyReady ? "pass" : "blocked",
      detail: privacyReady ? "Raw audio, transcripts, support-language progress, durable writes, and live status are excluded." : "A prohibited evidence flag is enabled.",
    },
    {
      checkId: "persistence",
      label: "Persistence readiness",
      status: persistenceReadiness === undefined ? "open" : persistenceReady ? "pass" : "blocked",
      detail: persistenceReadiness === undefined
        ? "The provider status has not been checked; teacher review authorization is required before pilot readiness can be assessed."
        : persistenceReady
          ? "The authoritative persistence status endpoint reports a healthy tenant-scoped boundary."
          : `Persistence is not pilot-ready (${persistenceReadiness.status}). ${!persistenceTenantReady ? "Tenant binding is missing or mismatched. " : ""}${!persistenceTimestampReady ? "The status timestamp is missing or invalid. " : ""}${persistenceReadiness.errors[0] ?? "Resolve the durable persistence gate before pilot review."}`,
    },
    {
      checkId: "launch-boundary",
      label: "Launch boundary",
      status: "blocked",
      detail: "Preflight can prepare review evidence but cannot authorize a classroom launch or durable write.",
    },
  ];

  const status: PilotSessionPreflightStatus = validationErrors.length > 0
    ? "invalid"
    : workflowComplete && identityReady && targetLanguageReady && privacyReady && persistenceReady
      ? "ready-for-review"
      : "incomplete";

  return {
    status,
    checks,
    validationErrors,
    launchAllowed: false,
    durableWriteAllowed: false,
    summary: status === "ready-for-review"
      ? "The controlled rehearsal is complete and ready for human review; this does not authorize a classroom launch."
      : status === "invalid"
        ? "The evidence envelope is invalid and cannot be used for pilot review."
        : "The controlled rehearsal is still incomplete and cannot be presented as pilot-ready.",
  };
}
