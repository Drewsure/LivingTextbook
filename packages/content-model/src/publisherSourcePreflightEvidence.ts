export interface PublisherSourcePreflightEvidenceRecord {
  recordVersion: 1;
  evidenceId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  reportId: string;
  manifestId: string;
  version: string;
  sourceAssetId: string;
  sourceRelativePath: string;
  sourceUnitKey: string;
  sourceChecksumSha256: string;
  manifestChecksumSha256: string;
  inventoryChecksumSha256: string;
  declaredAssetCount: number;
  verifiedAssetCount: number;
  capturedAt: string;
  status: "attached";
  storageMode: "quarantine-metadata-only";
  reviewOnly: true;
  packageAssemblyAllowed: false;
  packagePromotionAllowed: false;
  qrPrintAllowed: false;
  hostedPersistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createPublisherSourcePreflightEvidenceRecord(input: Omit<PublisherSourcePreflightEvidenceRecord, "recordVersion" | "evidenceId" | "status" | "storageMode" | "reviewOnly" | "packageAssemblyAllowed" | "packagePromotionAllowed" | "qrPrintAllowed" | "hostedPersistenceActivationAllowed" | "studentFacingUseAllowed" | "mode" | "sideEffect">): PublisherSourcePreflightEvidenceRecord {
  return {
    recordVersion: 1,
    evidenceId: `${input.quarantineId}:source-preflight:${input.reportId}`,
    ...input,
    status: "attached",
    storageMode: "quarantine-metadata-only",
    reviewOnly: true,
    packageAssemblyAllowed: false,
    packagePromotionAllowed: false,
    qrPrintAllowed: false,
    hostedPersistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validatePublisherSourcePreflightEvidenceRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher source preflight evidence record must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher source preflight evidence record recordVersion must be 1.");
  for (const field of ["evidenceId", "tenantId", "quarantineId", "packageId", "reportId", "manifestId", "version", "sourceAssetId", "sourceRelativePath", "sourceUnitKey", "capturedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Publisher source preflight evidence record ${field} must be non-empty.`);
  }
  for (const field of ["sourceChecksumSha256", "manifestChecksumSha256", "inventoryChecksumSha256"] as const) {
    if (!/^sha256:[0-9a-f]{64}$/i.test(String(value[field] ?? ""))) errors.push(`Publisher source preflight evidence record ${field} must use sha256:<64 hexadecimal characters>.`);
  }
  if (!isSafeRelativePath(String(value.sourceRelativePath ?? ""))) errors.push("Publisher source preflight evidence record sourceRelativePath must be a safe relative path.");
  for (const field of ["declaredAssetCount", "verifiedAssetCount"] as const) if (!Number.isSafeInteger(value[field]) || Number(value[field]) < 1) errors.push(`Publisher source preflight evidence record ${field} must be a positive integer.`);
  if (Number.isSafeInteger(value.declaredAssetCount) && Number.isSafeInteger(value.verifiedAssetCount) && Number(value.verifiedAssetCount) > Number(value.declaredAssetCount)) errors.push("Publisher source preflight evidence record verifiedAssetCount cannot exceed declaredAssetCount.");
  if (value.status !== "attached" || value.storageMode !== "quarantine-metadata-only" || value.reviewOnly !== true || value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Publisher source preflight evidence record must remain attached, metadata-only, review-only, and side-effect-free.");
  for (const field of ["packageAssemblyAllowed", "packagePromotionAllowed", "qrPrintAllowed", "hostedPersistenceActivationAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeRelativePath(value: string): boolean { return value.length > 0 && !value.startsWith("/") && !value.startsWith("\\") && !value.includes("\\") && !value.split("/").includes("..") && !value.split("/").includes(""); }
