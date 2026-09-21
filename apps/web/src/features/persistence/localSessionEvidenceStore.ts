import type { GameProgressEvent, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";

export const LOCAL_SESSION_EVIDENCE_VERSION = 4;

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
  unitKey: string;
  studentSessionId: string;
}

export function getLocalSessionEvidenceStorageKey(lookup: LocalSessionEvidenceLookup): string {
  return [
    "living-textbook",
    "browser-rehearsal",
    lookup.tenantId,
    lookup.packageId,
    lookup.launchCode,
    lookup.unitKey,
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
  const identityErrors = getEvidenceIdentityErrors(args, args.events);
  if (identityErrors.length > 0) {
    return { errors: identityErrors };
  }

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
  const isValidShape = (
    record.version === LOCAL_SESSION_EVIDENCE_VERSION &&
    record.storageMode === "browser-rehearsal-only" &&
    isNonBlankString(record.packageId) &&
    isNonBlankString(record.launchCode) &&
    isNonBlankString(record.tenantId) &&
    isNonBlankString(record.unitKey) &&
    isNonBlankString(record.studentSessionId) &&
    isProgression(record.progression) &&
    Array.isArray(record.events) &&
    record.events.every(isGameProgressEvent) &&
    isNonBlankString(record.savedAt)
  );

  return isValidShape && hasBoundEvidenceContents(record as unknown as LocalSessionEvidence);
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
    unitKey: args.launchSession.unitKey,
    studentSessionId: args.progression.studentSessionId,
  };
}

function sameEvidenceLookup(evidence: LocalSessionEvidence, lookup: LocalSessionEvidenceLookup): boolean {
  return evidence.tenantId === lookup.tenantId
    && evidence.packageId === lookup.packageId
    && evidence.launchCode === lookup.launchCode
    && evidence.unitKey === lookup.unitKey
    && evidence.studentSessionId === lookup.studentSessionId;
}

function hasBoundEvidenceContents(evidence: LocalSessionEvidence): boolean {
  if (
    evidence.progression.studentSessionId !== evidence.studentSessionId
    || evidence.progression.launchCode !== evidence.launchCode
    || evidence.progression.unitKey !== evidence.unitKey
  ) {
    return false;
  }

  return evidence.events.every((event) => (
    event.unitKey === evidence.unitKey
    && event.launchCode === evidence.launchCode
    && event.studentSessionId === evidence.studentSessionId
    && event.metadata?.tenantId === evidence.tenantId
  ));
}

function getEvidenceIdentityErrors(
  args: AppendLocalSessionEvidenceArgs,
  events: GameProgressEvent[],
): string[] {
  const errors = new Set<string>();
  const expected = {
    tenantId: args.launchSession.tenantId,
    unitKey: args.launchSession.unitKey,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
  };

  if (args.progression.launchCode !== expected.launchCode) {
    errors.add("Progression launch identity does not match the browser rehearsal session.");
  }
  if (args.progression.unitKey !== expected.unitKey) {
    errors.add("Progression unit identity does not match the browser rehearsal session.");
  }

  for (const event of events) {
    if (event.unitKey !== expected.unitKey) {
      errors.add("A browser rehearsal event belongs to a different unit.");
    }
    if (event.launchCode !== expected.launchCode) {
      errors.add("A browser rehearsal event belongs to a different launch.");
    }
    if (event.studentSessionId !== expected.studentSessionId) {
      errors.add("A browser rehearsal event belongs to a different student session.");
    }
    if (event.metadata?.tenantId !== expected.tenantId) {
      errors.add("A browser rehearsal event does not preserve the expected tenant.");
    }
  }

  return [...errors];
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
  if (!isLocalSessionEvidence(evidence)) return ["Browser rehearsal evidence failed identity validation."];

  try {
    window.localStorage.setItem(
      getLocalSessionEvidenceStorageKey({
        tenantId: evidence.tenantId,
        packageId: evidence.packageId,
        launchCode: evidence.launchCode,
        unitKey: evidence.unitKey,
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
    isNonBlankString(record.studentSessionId) &&
    isNonBlankString(record.launchCode) &&
    isNonBlankString(record.unitKey) &&
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
    isNonBlankString(record.type) &&
    isNonBlankString(record.unitKey) &&
    isNonBlankString(record.gameMode) &&
    isNonBlankString(record.occurredAt) &&
    (record.launchCode === undefined || isNonBlankString(record.launchCode)) &&
    (record.studentSessionId === undefined || isNonBlankString(record.studentSessionId)) &&
    (record.metadata === undefined || isMetadata(record.metadata))
  );
}

function isMetadata(value: unknown): value is Record<string, string | number | boolean> {
  if (!value || typeof value !== "object") return false;
  return Object.values(value as Record<string, unknown>).every(
    (entry) => typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean",
  );
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
