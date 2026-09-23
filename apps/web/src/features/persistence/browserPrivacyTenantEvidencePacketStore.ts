import {
  validateBrowserPrivacyTenantEvidencePacket,
  type BrowserPrivacyTenantEvidencePacket,
} from "@living-textbook/content-model";

export interface BrowserPrivacyTenantEvidencePacketLookup {
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  observationId: string;
}

export function getBrowserPrivacyTenantEvidencePacketStorageKey(
  lookup: BrowserPrivacyTenantEvidencePacketLookup,
): string {
  return [
    "living-textbook",
    "browser-privacy-tenant-evidence-packet",
    lookup.tenantId,
    lookup.packageId,
    lookup.launchCode,
    lookup.unitKey,
    lookup.studentSessionId,
    lookup.observationId,
  ].map((part) => encodeURIComponent(part)).join(":");
}

export function saveBrowserPrivacyTenantEvidencePacket(
  packet: BrowserPrivacyTenantEvidencePacket,
): { packet?: BrowserPrivacyTenantEvidencePacket; errors: string[] } {
  if (typeof window === "undefined") return { errors: ["Evidence packets can only be saved in a browser session."] };
  const errors = validateBrowserPrivacyTenantEvidencePacket(packet);
  if (errors.length > 0) return { errors };
  try {
    window.localStorage.setItem(
      getBrowserPrivacyTenantEvidencePacketStorageKey(packet),
      JSON.stringify(packet),
    );
    return { packet, errors: [] };
  } catch {
    return { errors: ["The browser could not save the local composite evidence packet."] };
  }
}

export function readBrowserPrivacyTenantEvidencePacket(
  lookup: BrowserPrivacyTenantEvidencePacketLookup,
): BrowserPrivacyTenantEvidencePacket | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(getBrowserPrivacyTenantEvidencePacketStorageKey(lookup));
    if (!raw) return undefined;
    const value: unknown = JSON.parse(raw);
    return validateBrowserPrivacyTenantEvidencePacket(value).length === 0 && sameLookup(value, lookup)
      ? value as BrowserPrivacyTenantEvidencePacket
      : undefined;
  } catch {
    return undefined;
  }
}

export function subscribeToBrowserPrivacyTenantEvidencePacket(
  lookup: BrowserPrivacyTenantEvidencePacketLookup,
  onChange: (packet: BrowserPrivacyTenantEvidencePacket | undefined) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;
  const storageKey = getBrowserPrivacyTenantEvidencePacketStorageKey(lookup);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) onChange(readBrowserPrivacyTenantEvidencePacket(lookup));
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function sameLookup(value: unknown, lookup: BrowserPrivacyTenantEvidencePacketLookup): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return record.tenantId === lookup.tenantId
    && record.packageId === lookup.packageId
    && record.launchCode === lookup.launchCode
    && record.unitKey === lookup.unitKey
    && record.studentSessionId === lookup.studentSessionId
    && record.observationId === lookup.observationId;
}
