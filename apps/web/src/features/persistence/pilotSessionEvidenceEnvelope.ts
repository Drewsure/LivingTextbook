import type { GameEventType, GameModeId, StudentProgressionState } from "@living-textbook/content-model";
import type { LocalSessionEvidence } from "./localSessionEvidenceStore";

export const PILOT_SESSION_EVIDENCE_ENVELOPE_VERSION = 1 as const;

const PILOT_GAME_MODES = ["flashcards", "memory-match", "sentence-builder"] as const satisfies readonly GameModeId[];

export type PilotSessionEvidenceStageStatus = "pending" | "observed" | "complete";

export interface PilotSessionEvidenceStage {
  stageId: "flashcards" | "memory-match" | "sentence-builder";
  routePath: string;
  gameMode: GameModeId;
  status: PilotSessionEvidenceStageStatus;
  eventCount: number;
  eventTypes: GameEventType[];
}

export interface PilotSessionEvidenceEnvelope {
  version: typeof PILOT_SESSION_EVIDENCE_ENVELOPE_VERSION;
  envelopeKind: "pilot-session-evidence";
  storageMode: "browser-rehearsal-only";
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  targetLanguage: string;
  workflow: ["front-door", "flashcards", "memory-match", "sentence-builder", "teacher-report"];
  stages: PilotSessionEvidenceStage[];
  eventCursor: number;
  eventCount: number;
  completedModes: GameModeId[];
  journeyStatus: "incomplete" | "complete";
  progression: StudentProgressionState;
  capturedAt: string;
  idempotencyKey: string;
  privacy: {
    rawLearnerAudioIncluded: false;
    learnerTranscriptIncluded: false;
    supportLanguageEvidenceIncluded: false;
    mediaOnlyEvidenceIncluded: false;
    durableWritePerformed: false;
    liveClassroomRecord: false;
  };
}

export function createPilotSessionEvidenceEnvelope({
  evidence,
  targetLanguage,
}: {
  evidence: LocalSessionEvidence;
  targetLanguage: string;
}): PilotSessionEvidenceEnvelope {
  const stages = PILOT_GAME_MODES.map((gameMode) => {
    const events = evidence.events.filter((event) => event.gameMode === gameMode);
    const eventTypes = [...new Set(events.map((event) => event.type))];
    const complete = evidence.progression.completedGameModes.includes(gameMode)
      || events.some((event) => event.type === "game_completed");
    return {
      stageId: gameMode,
      routePath: getCanonicalGameRoute(gameMode, evidence.launchCode),
      gameMode,
      status: complete ? "complete" : events.length > 0 ? "observed" : "pending",
      eventCount: events.length,
      eventTypes,
    } satisfies PilotSessionEvidenceStage;
  });

  const completedModes = evidence.progression.completedGameModes.filter((mode): mode is GameModeId =>
    PILOT_GAME_MODES.includes(mode as (typeof PILOT_GAME_MODES)[number]),
  );

  return {
    version: PILOT_SESSION_EVIDENCE_ENVELOPE_VERSION,
    envelopeKind: "pilot-session-evidence",
    storageMode: "browser-rehearsal-only",
    tenantId: evidence.tenantId,
    packageId: evidence.packageId,
    launchCode: evidence.launchCode,
    unitKey: evidence.unitKey,
    studentSessionId: evidence.studentSessionId,
    targetLanguage: targetLanguage.trim() || "en",
    workflow: ["front-door", "flashcards", "memory-match", "sentence-builder", "teacher-report"],
    stages,
    eventCursor: evidence.events.length,
    eventCount: evidence.events.length,
    completedModes,
    journeyStatus: stages.every((stage) => stage.status === "complete") ? "complete" : "incomplete",
    progression: { ...evidence.progression },
    capturedAt: evidence.savedAt,
    idempotencyKey: ["pilot-session-v1", evidence.tenantId, evidence.packageId, evidence.launchCode, evidence.studentSessionId].join(":"),
    privacy: {
      rawLearnerAudioIncluded: false,
      learnerTranscriptIncluded: false,
      supportLanguageEvidenceIncluded: false,
      mediaOnlyEvidenceIncluded: false,
      durableWritePerformed: false,
      liveClassroomRecord: false,
    },
  };
}

export function validatePilotSessionEvidenceEnvelope(value: unknown): string[] {
  const errors: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return ["Pilot session evidence envelope must be an object."];
  }

  const envelope = value as Partial<PilotSessionEvidenceEnvelope>;
  if (envelope.version !== PILOT_SESSION_EVIDENCE_ENVELOPE_VERSION) errors.push("Pilot session evidence envelope version is unsupported.");
  if (envelope.envelopeKind !== "pilot-session-evidence") errors.push("Pilot session evidence envelope kind is unsupported.");
  if (envelope.storageMode !== "browser-rehearsal-only") errors.push("Pilot session evidence envelope must remain browser-rehearsal-only.");

  for (const field of ["tenantId", "packageId", "launchCode", "unitKey", "studentSessionId", "targetLanguage", "capturedAt", "idempotencyKey"] as const) {
    if (typeof envelope[field] !== "string" || envelope[field].trim().length === 0) errors.push(`Pilot session evidence ${field} is required.`);
  }
  if (!isIsoTimestamp(envelope.capturedAt)) errors.push("Pilot session evidence capturedAt must be an ISO timestamp.");
  if (!Number.isSafeInteger(envelope.eventCursor) || Number(envelope.eventCursor) < 0) errors.push("Pilot session evidence eventCursor must be a non-negative integer.");
  if (!Number.isSafeInteger(envelope.eventCount) || Number(envelope.eventCount) < 0) errors.push("Pilot session evidence eventCount must be a non-negative integer.");
  if (!Array.isArray(envelope.workflow) || envelope.workflow.join("|") !== "front-door|flashcards|memory-match|sentence-builder|teacher-report") {
    errors.push("Pilot session evidence workflow must preserve the canonical ordered journey.");
  }
  if (!Array.isArray(envelope.stages) || envelope.stages.length !== PILOT_GAME_MODES.length) {
    errors.push("Pilot session evidence must include exactly the three canonical game stages.");
  } else {
    const stageIds = envelope.stages.map((stage) => stage?.stageId);
    if (new Set(stageIds).size !== stageIds.length || stageIds.some((stageId, index) => stageId !== PILOT_GAME_MODES[index])) {
      errors.push("Pilot session evidence stages must remain ordered and unique.");
    }
    for (const stage of envelope.stages) {
      if (!stage || typeof stage !== "object") {
        errors.push("Pilot session evidence contains an invalid stage.");
        continue;
      }
      if (typeof stage.routePath !== "string" || !stage.routePath.startsWith("/")) errors.push("Pilot session evidence stage route must be app-relative.");
      if (!Number.isSafeInteger(stage.eventCount) || stage.eventCount < 0) errors.push("Pilot session evidence stage eventCount must be non-negative.");
      if (!Array.isArray(stage.eventTypes)) errors.push("Pilot session evidence stage eventTypes must be an array.");
      if (!["pending", "observed", "complete"].includes(stage.status)) errors.push("Pilot session evidence stage status is unsupported.");
    }
  }

  if (!Array.isArray(envelope.completedModes) || envelope.completedModes.some((mode) => !PILOT_GAME_MODES.includes(mode as (typeof PILOT_GAME_MODES)[number]))) {
    errors.push("Pilot session evidence completedModes must use canonical game modes only.");
  }
  if (envelope.journeyStatus !== "incomplete" && envelope.journeyStatus !== "complete") errors.push("Pilot session evidence journeyStatus is unsupported.");
  const privacy = envelope.privacy;
  for (const field of ["rawLearnerAudioIncluded", "learnerTranscriptIncluded", "supportLanguageEvidenceIncluded", "mediaOnlyEvidenceIncluded", "durableWritePerformed", "liveClassroomRecord"] as const) {
    if (privacy?.[field] !== false) errors.push(`Pilot session evidence ${field} must remain false.`);
  }
  return [...new Set(errors)];
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.includes("T") && !Number.isNaN(Date.parse(value));
}

function getCanonicalGameRoute(gameMode: (typeof PILOT_GAME_MODES)[number], launchCode: string): string {
  const routeByMode: Record<(typeof PILOT_GAME_MODES)[number], string> = {
    flashcards: "flashcards",
    "memory-match": "memory",
    "sentence-builder": "sentence",
  };
  return `/${routeByMode[gameMode]}/${encodeURIComponent(launchCode)}`;
}
