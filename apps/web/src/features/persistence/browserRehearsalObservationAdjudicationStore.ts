import {
  validateBrowserRehearsalObservationAdjudication,
  type BrowserRehearsalObservationAdjudication,
  type BrowserRehearsalObservationHandoff,
  createBrowserRehearsalObservationAdjudication,
} from "@living-textbook/content-model";

export interface BrowserRehearsalObservationAdjudicationLookup {
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  handoffId: string;
}

export interface SaveBrowserRehearsalObservationAdjudicationResult {
  adjudication?: BrowserRehearsalObservationAdjudication;
  errors: string[];
}

export function getBrowserRehearsalObservationAdjudicationStorageKey(
  lookup: BrowserRehearsalObservationAdjudicationLookup,
): string {
  return [
    "living-textbook",
    "browser-rehearsal-observation-adjudication",
    lookup.tenantId,
    lookup.packageId,
    lookup.launchCode,
    lookup.unitKey,
    lookup.studentSessionId,
    lookup.handoffId,
  ].map((part) => encodeURIComponent(part)).join(":");
}

export function saveBrowserRehearsalObservationAdjudication(
  adjudication: BrowserRehearsalObservationAdjudication,
  handoff: BrowserRehearsalObservationHandoff,
): SaveBrowserRehearsalObservationAdjudicationResult {
  if (typeof window === "undefined") return { errors: ["Browser adjudications can only be saved in a browser session."] };
  const errors = validateBrowserRehearsalObservationAdjudication(adjudication, handoff);
  if (errors.length > 0) return { errors };

  try {
    window.localStorage.setItem(getBrowserRehearsalObservationAdjudicationStorageKey(adjudication), JSON.stringify(adjudication));
    return { adjudication, errors: [] };
  } catch {
    return { errors: ["The browser could not save the local observation adjudication."] };
  }
}

export function createAndSaveBrowserRehearsalObservationAdjudication(
  handoff: BrowserRehearsalObservationHandoff,
  args: Parameters<typeof createBrowserRehearsalObservationAdjudication>[1],
): SaveBrowserRehearsalObservationAdjudicationResult {
  return saveBrowserRehearsalObservationAdjudication(createBrowserRehearsalObservationAdjudication(handoff, args), handoff);
}

export function readBrowserRehearsalObservationAdjudication(
  lookup: BrowserRehearsalObservationAdjudicationLookup,
  handoff: BrowserRehearsalObservationHandoff,
): BrowserRehearsalObservationAdjudication | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(getBrowserRehearsalObservationAdjudicationStorageKey(lookup));
    if (!raw) return undefined;
    const value: unknown = JSON.parse(raw);
    return validateBrowserRehearsalObservationAdjudication(value, handoff).length === 0 && sameLookup(value, lookup)
      ? value as BrowserRehearsalObservationAdjudication
      : undefined;
  } catch {
    return undefined;
  }
}

export function subscribeToBrowserRehearsalObservationAdjudication(
  lookup: BrowserRehearsalObservationAdjudicationLookup,
  handoff: BrowserRehearsalObservationHandoff,
  onChange: (adjudication: BrowserRehearsalObservationAdjudication | undefined) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;
  const storageKey = getBrowserRehearsalObservationAdjudicationStorageKey(lookup);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) onChange(readBrowserRehearsalObservationAdjudication(lookup, handoff));
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function sameLookup(value: unknown, lookup: BrowserRehearsalObservationAdjudicationLookup): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return record.tenantId === lookup.tenantId
    && record.packageId === lookup.packageId
    && record.launchCode === lookup.launchCode
    && record.unitKey === lookup.unitKey
    && record.studentSessionId === lookup.studentSessionId
    && record.handoffId === lookup.handoffId;
}
