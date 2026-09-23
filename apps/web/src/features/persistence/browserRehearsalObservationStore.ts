import {
  validateBrowserRehearsalObservation,
  type BrowserRehearsalObservation,
} from "@living-textbook/content-model";

export interface BrowserRehearsalObservationLookup {
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
}

export interface CreateBrowserRehearsalObservationArgs extends BrowserRehearsalObservationLookup {
  routePaths: string[];
  checkIds: string[];
  observationId?: string;
  reviewerRef?: string;
  observedAt?: string;
}

export interface SaveBrowserRehearsalObservationResult {
  observation?: BrowserRehearsalObservation;
  errors: string[];
}

export function getBrowserRehearsalObservationStorageKey(lookup: BrowserRehearsalObservationLookup): string {
  return [
    "living-textbook",
    "browser-rehearsal-observation",
    lookup.tenantId,
    lookup.packageId,
    lookup.launchCode,
    lookup.unitKey,
    lookup.studentSessionId,
  ].map((part) => encodeURIComponent(part)).join(":");
}

export function createHumanObservedBrowserRehearsalObservation(
  args: CreateBrowserRehearsalObservationArgs,
): BrowserRehearsalObservation {
  return {
    version: 1,
    observationId: args.observationId?.trim() || `human-observation-${Date.now()}`,
    tenantId: args.tenantId,
    packageId: args.packageId,
    launchCode: args.launchCode,
    unitKey: args.unitKey,
    studentSessionId: args.studentSessionId,
    mode: "human-observed",
    reviewerRole: "teacher",
    reviewerRef: args.reviewerRef?.trim() || `teacher-session:${args.launchCode}`,
    observedAt: args.observedAt ?? new Date().toISOString(),
    routePaths: [...new Set(args.routePaths.map((path) => path.trim()).filter(Boolean))],
    checkIds: [...new Set(args.checkIds.map((checkId) => checkId.trim()).filter(Boolean))],
    status: "review-only",
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
  };
}

export function saveBrowserRehearsalObservation(
  observation: BrowserRehearsalObservation,
): SaveBrowserRehearsalObservationResult {
  if (typeof window === "undefined") {
    return { errors: ["Browser rehearsal observations can only be saved in a browser session."] };
  }

  const errors = validateBrowserRehearsalObservation(observation);
  if (errors.length > 0) return { errors };

  try {
    window.localStorage.setItem(
      getBrowserRehearsalObservationStorageKey(observation),
      JSON.stringify(observation),
    );
    return { observation, errors: [] };
  } catch {
    return { errors: ["The browser could not save the local observation receipt."] };
  }
}

export function readBrowserRehearsalObservation(
  lookup: BrowserRehearsalObservationLookup,
): BrowserRehearsalObservation | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.localStorage.getItem(getBrowserRehearsalObservationStorageKey(lookup));
    if (!raw) return undefined;
    const value: unknown = JSON.parse(raw);
    return validateBrowserRehearsalObservation(value).length === 0 && sameLookup(value, lookup)
      ? value as BrowserRehearsalObservation
      : undefined;
  } catch {
    return undefined;
  }
}

export function subscribeToBrowserRehearsalObservation(
  lookup: BrowserRehearsalObservationLookup,
  onChange: (observation: BrowserRehearsalObservation | undefined) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const storageKey = getBrowserRehearsalObservationStorageKey(lookup);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) onChange(readBrowserRehearsalObservation(lookup));
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function sameLookup(value: unknown, lookup: BrowserRehearsalObservationLookup): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return record.tenantId === lookup.tenantId
    && record.packageId === lookup.packageId
    && record.launchCode === lookup.launchCode
    && record.unitKey === lookup.unitKey
    && record.studentSessionId === lookup.studentSessionId;
}
