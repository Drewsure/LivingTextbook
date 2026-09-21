import type { GameProgressEvent, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";

export const LOCAL_SESSION_EVIDENCE_VERSION = 3;

export interface LocalSessionEvidence {
  version: typeof LOCAL_SESSION_EVIDENCE_VERSION;
  storageMode: "browser-rehearsal-only";
  packageId: string;
  launchCode: string;
  tenantId: string;
  unitKey: string;
  studentSessionId: string;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  savedAt: string;
}

export interface LocalSessionEvidenceLookup {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
}

export function getLocalSessionEvidenceStorageKey(lookup: LocalSessionEvidenceLookup): string {
  return [
    "living-textbook",
    "browser-rehearsal",
    lookup.tenantId,
    lookup.packageId,
    lookup.launchCode,
    lookup.studentSessionId,
  ].map((part) => encodeURIComponent(part)).join(":");
}

export function createLocalSessionEvidence(args: {
  packageId: string;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  savedAt: string;
}): LocalSessionEvidence {
  return {
    version: LOCAL_SESSION_EVIDENCE_VERSION,
    storageMode: "browser-rehearsal-only",
    packageId: args.packageId,
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

  writeLocalSessionEvidence(evidence);
}

export interface AppendLocalSessionEvidenceArgs {
  packageId: string;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  savedAt: string;
}

export interface AppendLocalSessionEvidenceResult {
  evidence?: LocalSessionEvidence;
  errors: string[];
}

/**
 * Merge route-local events into the one browser rehearsal record for a launch.
 * This is deliberately not a hosted write and rejects cross-package/session mixing.
 */
export function appendLocalSessionEvidence(
  args: AppendLocalSessionEvidenceArgs,
): AppendLocalSessionEvidenceResult {
  if (typeof window === "undefined") {
    return { errors: ["Local session evidence can only be saved in a browser session."] };
  }

  const lookup = createEvidenceLookup(args);
  const existing = readLocalSessionEvidence(lookup);
  if (existing && !sameEvidenceSession(existing, args)) {
    return { errors: ["Existing browser rehearsal evidence belongs to a different package or student session."] };
  }

  const incoming = createLocalSessionEvidence(args);
  const evidence: LocalSessionEvidence = {
    ...incoming,
    events: mergeEventHistory(existing?.events ?? [], incoming.events),
  };
  const errors = writeLocalSessionEvidence(evidence);
  return errors.length > 0 ? { errors } : { evidence, errors: [] };
}

export function readLocalSessionEvidence(lookup: LocalSessionEvidenceLookup): LocalSessionEvidence | undefined {
  if (typeof window === "undefined") return undefined;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(getLocalSessionEvidenceStorageKey(lookup));
  } catch {
    return undefined;
  }
  if (!raw) return undefined;

  try {
    const value: unknown = JSON.parse(raw);
    return isLocalSessionEvidence(value) && sameEvidenceLookup(value, lookup) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function subscribeToLocalSessionEvidence(
  lookup: LocalSessionEvidenceLookup,
  onChange: (evidence: LocalSessionEvidence | undefined) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const storageKey = getLocalSessionEvidenceStorageKey(lookup);
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    onChange(readLocalSessionEvidence(lookup));
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
    typeof record.packageId === "string" &&
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

function sameEvidenceSession(
  existing: LocalSessionEvidence,
  args: AppendLocalSessionEvidenceArgs,
): boolean {
  return (
    existing.packageId === args.packageId &&
    existing.tenantId === args.launchSession.tenantId &&
    existing.launchCode === args.launchSession.launchCode &&
    existing.unitKey === args.launchSession.unitKey &&
    existing.studentSessionId === args.progression.studentSessionId
  );
}

function createEvidenceLookup(args: AppendLocalSessionEvidenceArgs): LocalSessionEvidenceLookup {
  return {
    tenantId: args.launchSession.tenantId,
    packageId: args.packageId,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
  };
}

function sameEvidenceLookup(evidence: LocalSessionEvidence, lookup: LocalSessionEvidenceLookup): boolean {
  return evidence.tenantId === lookup.tenantId
    && evidence.packageId === lookup.packageId
    && evidence.launchCode === lookup.launchCode
    && evidence.studentSessionId === lookup.studentSessionId;
}

function mergeEventHistory(
  existing: GameProgressEvent[],
  incoming: GameProgressEvent[],
): GameProgressEvent[] {
  const merged: GameProgressEvent[] = [];
  const seen = new Set<string>();

  for (const event of [...existing, ...incoming]) {
    const fingerprint = getEventFingerprint(event);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    merged.push(event);
  }

  return merged;
}

function getEventFingerprint(event: GameProgressEvent): string {
  const metadata = Object.entries(event.metadata ?? {}).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
  return JSON.stringify([
    event.type,
    event.unitKey,
    event.gameMode,
    event.occurredAt,
    event.launchCode ?? "",
    event.studentSessionId ?? "",
    metadata,
  ]);
}

function writeLocalSessionEvidence(evidence: LocalSessionEvidence): string[] {
  if (typeof window === "undefined") return ["Local session evidence can only be saved in a browser session."];

  try {
    window.localStorage.setItem(
      getLocalSessionEvidenceStorageKey({
        tenantId: evidence.tenantId,
        packageId: evidence.packageId,
        launchCode: evidence.launchCode,
        studentSessionId: evidence.studentSessionId,
      }),
      JSON.stringify(evidence),
    );
    return [];
  } catch {
    return ["The browser could not save local session evidence."];
  }
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
