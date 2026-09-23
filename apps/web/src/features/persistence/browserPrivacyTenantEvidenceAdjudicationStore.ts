import {
  validateBrowserPrivacyTenantEvidenceAdjudication,
  type BrowserPrivacyTenantEvidenceAdjudication,
  type BrowserPrivacyTenantEvidencePacket,
} from "@living-textbook/content-model";

export interface BrowserPrivacyTenantEvidenceAdjudicationLookup {
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  packetId: string;
  observationId: string;
}

export function getBrowserPrivacyTenantEvidenceAdjudicationStorageKey(lookup: BrowserPrivacyTenantEvidenceAdjudicationLookup): string {
  return ["living-textbook", "browser-privacy-tenant-evidence-adjudication", lookup.tenantId, lookup.packageId, lookup.launchCode, lookup.unitKey, lookup.studentSessionId, lookup.packetId, lookup.observationId].map((part) => encodeURIComponent(part)).join(":");
}

export interface SaveBrowserPrivacyTenantEvidenceAdjudicationResult { adjudication?: BrowserPrivacyTenantEvidenceAdjudication; errors: string[]; }

export function saveBrowserPrivacyTenantEvidenceAdjudication(adjudication: BrowserPrivacyTenantEvidenceAdjudication, packet: BrowserPrivacyTenantEvidencePacket): SaveBrowserPrivacyTenantEvidenceAdjudicationResult {
  if (typeof window === "undefined") return { errors: ["Evidence adjudications can only be saved in a browser session."] };
  const errors = validateBrowserPrivacyTenantEvidenceAdjudication(adjudication, packet);
  if (errors.length > 0) return { errors };
  try { window.localStorage.setItem(getBrowserPrivacyTenantEvidenceAdjudicationStorageKey(adjudication), JSON.stringify(adjudication)); return { adjudication, errors: [] }; }
  catch { return { errors: ["The browser could not save the local evidence adjudication."] }; }
}

export function readBrowserPrivacyTenantEvidenceAdjudication(lookup: BrowserPrivacyTenantEvidenceAdjudicationLookup, packet: BrowserPrivacyTenantEvidencePacket): BrowserPrivacyTenantEvidenceAdjudication | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(getBrowserPrivacyTenantEvidenceAdjudicationStorageKey(lookup));
    if (!raw) return undefined;
    const value: unknown = JSON.parse(raw);
    return validateBrowserPrivacyTenantEvidenceAdjudication(value, packet).length === 0 && sameLookup(value, lookup) ? value as BrowserPrivacyTenantEvidenceAdjudication : undefined;
  } catch { return undefined; }
}

export function subscribeToBrowserPrivacyTenantEvidenceAdjudication(lookup: BrowserPrivacyTenantEvidenceAdjudicationLookup, packet: BrowserPrivacyTenantEvidencePacket, onChange: (adjudication: BrowserPrivacyTenantEvidenceAdjudication | undefined) => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const storageKey = getBrowserPrivacyTenantEvidenceAdjudicationStorageKey(lookup);
  const handleStorage = (event: StorageEvent) => { if (event.key === storageKey) onChange(readBrowserPrivacyTenantEvidenceAdjudication(lookup, packet)); };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function sameLookup(value: unknown, lookup: BrowserPrivacyTenantEvidenceAdjudicationLookup): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return record.tenantId === lookup.tenantId && record.packageId === lookup.packageId && record.launchCode === lookup.launchCode && record.unitKey === lookup.unitKey && record.studentSessionId === lookup.studentSessionId && record.packetId === lookup.packetId && record.observationId === lookup.observationId;
}
