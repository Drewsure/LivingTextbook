import type { GameProgressEvent, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";

export const LOCAL_SESSION_EVIDENCE_VERSION = 1;

export interface LocalSessionEvidence {
  version: typeof LOCAL_SESSION_EVIDENCE_VERSION;
  storageMode: "browser-rehearsal-only";
  launchCode: string;
  tenantId: string;
  unitKey: string;
  studentSessionId: string;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  savedAt: string;
}

export function getLocalSessionEvidenceStorageKey(launchCode: string): string {
  return `living-textbook:browser-rehearsal:${launchCode}`;
}

export function createLocalSessionEvidence(args: {
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  savedAt: string;
}): LocalSessionEvidence {
  return {
    version: LOCAL_SESSION_EVIDENCE_VERSION,
    storageMode: "browser-rehearsal-only",
    launchCode: args.launchSession.launchCode,
    tenantId: args.launchSession.tenantId,
    unitKey: args.launchSession.unitKey,
    studentSessionId: args.progression.studentSessionId,
    progression: args.progression,
    events: args.events,
    savedAt: args.savedAt,
  };
}

export function saveLocalSessionEvidence(evidence: LocalSessionEvidence): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    getLocalSessionEvidenceStorageKey(evidence.launchCode),
    JSON.stringify(evidence),
  );
}

export function readLocalSessionEvidence(launchCode: string): LocalSessionEvidence | undefined {
  if (typeof window === "undefined") return undefined;

  const raw = window.localStorage.getItem(getLocalSessionEvidenceStorageKey(launchCode));
  if (!raw) return undefined;

  try {
    const value: unknown = JSON.parse(raw);
    return isLocalSessionEvidence(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function subscribeToLocalSessionEvidence(
  launchCode: string,
  onChange: (evidence: LocalSessionEvidence | undefined) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const storageKey = getLocalSessionEvidenceStorageKey(launchCode);
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    onChange(readLocalSessionEvidence(launchCode));
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function isLocalSessionEvidence(value: unknown): value is LocalSessionEvidence {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return (
    record.version === LOCAL_SESSION_EVIDENCE_VERSION &&
    record.storageMode === "browser-rehearsal-only" &&
    typeof record.launchCode === "string" &&
    typeof record.tenantId === "string" &&
    typeof record.unitKey === "string" &&
    typeof record.studentSessionId === "string" &&
    isProgression(record.progression) &&
    Array.isArray(record.events) &&
    record.events.every(isGameProgressEvent) &&
    typeof record.savedAt === "string"
  );
}

function isProgression(value: unknown): value is StudentProgressionState {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return (
    typeof record.studentSessionId === "string" &&
    typeof record.launchCode === "string" &&
    typeof record.unitKey === "string" &&
    typeof record.currentStep === "string" &&
    Array.isArray(record.unlockedGameModes) &&
    Array.isArray(record.completedGameModes) &&
    typeof record.earnedStarDust === "number" &&
    typeof record.masteryStatus === "string"
  );
}

function isGameProgressEvent(value: unknown): value is GameProgressEvent {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return (
    typeof record.type === "string" &&
    typeof record.unitKey === "string" &&
    typeof record.gameMode === "string" &&
    typeof record.occurredAt === "string" &&
    (record.launchCode === undefined || typeof record.launchCode === "string") &&
    (record.studentSessionId === undefined || typeof record.studentSessionId === "string") &&
    (record.metadata === undefined || isMetadata(record.metadata))
  );
}

function isMetadata(value: unknown): value is Record<string, string | number | boolean> {
  if (!value || typeof value !== "object") return false;
  return Object.values(value as Record<string, unknown>).every(
    (entry) => typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean",
  );
}
