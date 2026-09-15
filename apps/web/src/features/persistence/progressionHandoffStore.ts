import type { ProgressionContinuityEnvelope, StudentProgressionState } from "@living-textbook/content-model";
import { validateProgressionContinuityRuntimeRequest } from "@living-textbook/content-model";

export const PROGRESSION_HANDOFF_VERSION = 1 as const;

export interface ProgressionHandoffRecord {
  version: typeof PROGRESSION_HANDOFF_VERSION;
  storageMode: "session-route-handoff";
  continuity: ProgressionContinuityEnvelope;
  progression: StudentProgressionState;
  savedAt: string;
}

export interface ProgressionHandoffLookup {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
  destinationRoute: string;
}

export interface ProgressionHandoffReadResult {
  record?: ProgressionHandoffRecord;
  errors: string[];
}

function getStorageKey(lookup: ProgressionHandoffLookup): string {
  return [
    "living-textbook",
    "progression-handoff",
    lookup.tenantId,
    lookup.packageId,
    lookup.launchCode,
    lookup.studentSessionId,
    encodeURIComponent(lookup.destinationRoute),
  ].join(":");
}

export function createProgressionHandoffRecord(args: {
  continuity: ProgressionContinuityEnvelope;
  progression: StudentProgressionState;
  savedAt: string;
}): ProgressionHandoffRecord {
  return {
    version: PROGRESSION_HANDOFF_VERSION,
    storageMode: "session-route-handoff",
    continuity: args.continuity,
    progression: { ...args.progression },
    savedAt: args.savedAt,
  };
}

export function saveProgressionHandoffRecord(record: ProgressionHandoffRecord): string[] {
  if (typeof window === "undefined") return ["Progression handoff can only be saved in a browser session."];

  const lookup = {
    tenantId: record.continuity.tenantId,
    packageId: record.continuity.packageId,
    launchCode: record.continuity.launchCode,
    studentSessionId: record.continuity.studentSessionId,
    destinationRoute: record.continuity.destinationRoute,
  } satisfies ProgressionHandoffLookup;
  const errors = validateProgressionHandoffRecord(record, lookup);
  if (errors.length > 0) return errors;

  try {
    window.sessionStorage.setItem(getStorageKey(lookup), JSON.stringify(record));
    return [];
  } catch {
    return ["The browser session could not store the progression handoff."];
  }
}

export function readProgressionHandoffRecord(lookup: ProgressionHandoffLookup): ProgressionHandoffReadResult {
  if (typeof window === "undefined") return { errors: ["Progression handoff can only be read in a browser session."] };

  let raw: string | null;
  try {
    raw = window.sessionStorage.getItem(getStorageKey(lookup));
  } catch {
    return { errors: ["The browser session could not read the progression handoff."] };
  }
  if (!raw) return { errors: ["No route handoff was found for this student session."] };

  try {
    const record = JSON.parse(raw) as ProgressionHandoffRecord;
    const errors = validateProgressionHandoffRecord(record, lookup);
    return errors.length > 0 ? { errors } : { record, errors: [] };
  } catch {
    return { errors: ["The stored progression handoff is not valid JSON."] };
  }
}

export function clearProgressionHandoffRecord(lookup: ProgressionHandoffLookup): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(getStorageKey(lookup));
  } catch {
    // Clearing is best effort; the next route still validates before accepting data.
  }
}

function validateProgressionHandoffRecord(record: unknown, lookup: ProgressionHandoffLookup): string[] {
  const errors: string[] = [];
  if (!record || typeof record !== "object") return ["Progression handoff record must be an object."];
  const value = record as Partial<ProgressionHandoffRecord>;
  if (value.version !== PROGRESSION_HANDOFF_VERSION) errors.push("Progression handoff version is unsupported.");
  if (value.storageMode !== "session-route-handoff") errors.push("Progression handoff storage mode is unsupported.");
  if (!value.continuity || !value.progression || typeof value.savedAt !== "string") errors.push("Progression handoff record is incomplete.");
  if (!value.continuity) return errors;

  errors.push(...validateProgressionContinuityRuntimeRequest({
    expectedTenantId: lookup.tenantId,
    expectedPackageId: lookup.packageId,
    expectedLaunchCode: lookup.launchCode,
    expectedStudentSessionId: lookup.studentSessionId,
    envelope: value.continuity,
  }));
  if (value.continuity.destinationRoute !== lookup.destinationRoute) errors.push("Progression handoff destination route does not match.");
  if (value.progression) errors.push(...validateProgressionSnapshot(value.progression, lookup));
  return [...new Set(errors)];
}

function validateProgressionSnapshot(value: StudentProgressionState, lookup: ProgressionHandoffLookup): string[] {
  const errors: string[] = [];
  if (value.studentSessionId !== lookup.studentSessionId) errors.push("Progression handoff snapshot student session does not match.");
  if (value.launchCode !== lookup.launchCode) errors.push("Progression handoff snapshot launch code does not match.");
  if (!Array.isArray(value.unlockedGameModes) || !Array.isArray(value.completedGameModes)) errors.push("Progression handoff snapshot mode lists are invalid.");
  if (!Number.isSafeInteger(value.earnedStarDust) || value.earnedStarDust < 0) errors.push("Progression handoff snapshot reward total is invalid.");
  return errors;
}
