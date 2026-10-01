export interface PilotQrPrintArtifactEntry {
  printedQrId: string;
  aliasPath: string;
  fallbackPath: string;
  encodedUrl: string;
  svg: string;
  svgChecksum: string;
}

export interface PilotQrPrintProfile {
  pageSize: "A4";
  orientation: "portrait";
  cardsPerRow: 2;
  qrPixelWidth: 260;
  quietZoneModules: 2;
  colorMode: "monochrome";
}

export interface PilotQrPrintArtifact {
  artifactVersion: 1;
  artifactId: string;
  tenantId: string;
  packageId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  sourceAssemblyChecksum: string;
  baseUrl: string;
  htmlChecksum: string;
  printProfile: PilotQrPrintProfile;
  printAuthorized: true;
  entries: PilotQrPrintArtifactEntry[];
  sideEffect: "local-package-assembly";
}

export function createPilotQrPrintArtifactId(input: Pick<PilotQrPrintArtifact, "packageId" | "version" | "manifestId" | "receiptId">): string {
  return `${input.packageId}:${input.version}:qr-print-sheet:${input.manifestId}:${input.receiptId}`;
}

export function validatePilotQrPrintArtifact(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Pilot QR print artifact must be an object."];
  if (value.artifactVersion !== 1) errors.push("Pilot QR print artifact artifactVersion must be 1.");
  for (const field of ["artifactId", "tenantId", "packageId", "version", "manifestId", "receiptId", "sourceAssemblyChecksum", "baseUrl", "htmlChecksum"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Pilot QR print artifact ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot QR print artifact sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (!isSha256(value.htmlChecksum)) errors.push("Pilot QR print artifact htmlChecksum must be sha256:<64 hexadecimal characters>.");
  if (!isHttpUrl(value.baseUrl)) errors.push("Pilot QR print artifact baseUrl must be an absolute http or https URL without credentials, query, or fragment.");
  const printProfile = value.printProfile;
  if (!isRecord(printProfile)) {
    errors.push("Pilot QR print artifact printProfile must be present.");
  } else {
    if (printProfile.pageSize !== "A4") errors.push("Pilot QR print artifact printProfile pageSize must be A4.");
    if (printProfile.orientation !== "portrait") errors.push("Pilot QR print artifact printProfile orientation must be portrait.");
    if (printProfile.cardsPerRow !== 2) errors.push("Pilot QR print artifact printProfile cardsPerRow must be 2.");
    if (printProfile.qrPixelWidth !== 260) errors.push("Pilot QR print artifact printProfile qrPixelWidth must be 260.");
    if (printProfile.quietZoneModules !== 2) errors.push("Pilot QR print artifact printProfile quietZoneModules must be 2.");
    if (printProfile.colorMode !== "monochrome") errors.push("Pilot QR print artifact printProfile colorMode must be monochrome.");
  }
  if (value.printAuthorized !== true) errors.push("Pilot QR print artifact must preserve explicit print authorization.");
  if (value.sideEffect !== "local-package-assembly") errors.push("Pilot QR print artifact sideEffect must be local-package-assembly.");
  if (!Array.isArray(value.entries) || value.entries.length === 0) {
    errors.push("Pilot QR print artifact must contain at least one entry.");
  } else {
    const qrIds = new Set<string>();
    const aliases = new Set<string>();
    for (const entry of value.entries) {
      if (!isRecord(entry)) {
        errors.push("Pilot QR print artifact entries must be objects.");
        continue;
      }
      for (const field of ["printedQrId", "aliasPath", "fallbackPath", "encodedUrl", "svg", "svgChecksum"] as const) {
        if (!isNonEmptyString(entry[field])) errors.push(`Pilot QR print artifact entry ${field} must be non-empty.`);
      }
      if (isNonEmptyString(entry.printedQrId) && !qrIds.add(entry.printedQrId)) errors.push("Pilot QR print artifact printed QR ids must be unique.");
      if (isNonEmptyString(entry.aliasPath) && !aliases.add(entry.aliasPath)) errors.push("Pilot QR print artifact alias paths must be unique.");
      if (!isSafeInternalPath(entry.aliasPath)) errors.push("Pilot QR print artifact aliasPath must be a safe internal route.");
      if (!isSafeInternalPath(entry.fallbackPath)) errors.push("Pilot QR print artifact fallbackPath must be a safe internal route.");
      if (!isHttpUrl(entry.encodedUrl)) errors.push("Pilot QR print artifact encodedUrl must be an absolute http or https URL.");
      if (isNonEmptyString(entry.svg) && (!entry.svg.includes("<svg") || !entry.svg.includes("</svg>"))) errors.push("Pilot QR print artifact svg must contain a complete SVG element.");
      if (isHttpUrl(value.baseUrl) && isSafeInternalPath(entry.aliasPath) && isHttpUrl(entry.encodedUrl)) {
        const expectedUrl = new URL(entry.aliasPath, value.baseUrl).toString();
        if (entry.encodedUrl !== expectedUrl) errors.push("Pilot QR print artifact encodedUrl must match baseUrl plus aliasPath.");
      }
      if (!isSha256(entry.svgChecksum)) errors.push("Pilot QR print artifact svgChecksum must be sha256:<64 hexadecimal characters>.");
    }
  }
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSha256(value: unknown): boolean {
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value);
}

function isHttpUrl(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "http:" || parsed.protocol === "https:")
      && !parsed.username
      && !parsed.password
      && !parsed.search
      && !parsed.hash;
  } catch {
    return false;
  }
}

function isSafeInternalPath(value: unknown): boolean {
  return typeof value === "string"
    && value.startsWith("/")
    && !value.startsWith("//")
    && !value.includes("..")
    && !value.includes("\\")
    && !/^\/(?:\/|.*(?:localhost|127\.0\.0\.1))/i.test(value)
    && !/^file:/i.test(value);
}
