export type PublisherSourcePackagePreflightStatus = "verified" | "missing" | "unsupported" | "invalid" | "unlisted";

export type PublisherSourcePackagePreflightAssetKind =
  | "textbook-source"
  | "teacher-answer-key"
  | "image"
  | "audio"
  | "video"
  | "transcript"
  | "font"
  | "background-media";

export interface PublisherSourcePackageManifestEntry {
  assetId: string;
  kind: PublisherSourcePackagePreflightAssetKind;
  relativePath: string;
  unitKey: string;
  acceptedTypes: string[];
  required: boolean;
  teacherOnly?: boolean;
}

export interface PublisherSourcePackageManifest {
  recordVersion: 1;
  manifestId: string;
  tenantId: string;
  packageId: string;
  version: string;
  entries: PublisherSourcePackageManifestEntry[];
  reviewOnly: true;
  quarantineWriteAllowed: false;
  packageAssemblyAllowed: false;
  studentFacingUseAllowed: false;
}

export interface PublisherSourcePackageObservedFile {
  assetId?: string;
  relativePath: string;
  exists: boolean;
  sizeBytes?: number;
  checksumSha256?: string;
  detectedType?: string;
}

export interface PublisherSourcePackagePreflightFile {
  assetId: string;
  kind: PublisherSourcePackagePreflightAssetKind | "unlisted";
  relativePath: string;
  unitKey: string;
  required: boolean;
  status: PublisherSourcePackagePreflightStatus;
  sizeBytes: number | null;
  checksumSha256: string | null;
  detectedType: string | null;
  details: string;
}

export interface PublisherSourcePackagePreflightReport {
  recordVersion: 1;
  reportId: string;
  manifestId: string;
  manifestChecksumSha256: string;
  inventoryChecksumSha256: string;
  tenantId: string;
  packageId: string;
  version: string;
  status: "blocked";
  inventoryStatus: "complete" | "incomplete";
  files: PublisherSourcePackagePreflightFile[];
  counts: {
    declared: number;
    verified: number;
    missing: number;
    unsupported: number;
    invalid: number;
    unlisted: number;
  };
  blockers: string[];
  warnings: string[];
  nextActions: string[];
  reviewOnly: true;
  quarantineWriteAllowed: false;
  packageAssemblyAllowed: false;
  packagePromotionAllowed: false;
  qrPrintAllowed: false;
  hostedPersistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createPublisherSourcePackagePreflightReport(input: {
  manifest: PublisherSourcePackageManifest;
  observedFiles: PublisherSourcePackageObservedFile[];
  manifestChecksumSha256: string;
  inventoryChecksumSha256: string;
}): PublisherSourcePackagePreflightReport {
  const manifestErrors = validatePublisherSourcePackageManifest(input.manifest);
  const entries = Array.isArray(input.manifest.entries) ? input.manifest.entries.filter((entry) => isRecord(entry)) as PublisherSourcePackageManifestEntry[] : [];
  const observedByAssetId = new Map(input.observedFiles.filter((file) => file.assetId).map((file) => [file.assetId as string, file]));
  const declaredPaths = new Set(entries.map((entry) => entry.relativePath));
  const files: PublisherSourcePackagePreflightFile[] = entries.map((entry) => {
    const observed = observedByAssetId.get(entry.assetId) ?? input.observedFiles.find((file) => file.relativePath === entry.relativePath);
    if (!observed || !observed.exists) {
      return { assetId: entry.assetId, kind: entry.kind, relativePath: entry.relativePath, unitKey: entry.unitKey, required: entry.required, status: "missing", sizeBytes: null, checksumSha256: null, detectedType: null, details: entry.required ? "Required publisher asset was not found in the source directory." : "Optional publisher asset was not found; review whether the unit needs it." };
    }
    const safePath = isSafeRelativePath(observed.relativePath) && observed.relativePath === entry.relativePath;
    const supportedType = typeof observed.detectedType === "string" && entry.acceptedTypes.includes(observed.detectedType);
    const validSize = Number.isSafeInteger(observed.sizeBytes) && (observed.sizeBytes as number) > 0 && (observed.sizeBytes as number) <= 256 * 1024 * 1024;
    const validChecksum = typeof observed.checksumSha256 === "string" && /^sha256:[0-9a-f]{64}$/i.test(observed.checksumSha256);
    if (!safePath || !validSize || !validChecksum) return { assetId: entry.assetId, kind: entry.kind, relativePath: observed.relativePath, unitKey: entry.unitKey, required: entry.required, status: "invalid", sizeBytes: validSize ? observed.sizeBytes as number : null, checksumSha256: validChecksum ? observed.checksumSha256 as string : null, detectedType: observed.detectedType ?? null, details: "The file path, size, or checksum did not pass the bounded preflight contract." };
    if (!supportedType) return { assetId: entry.assetId, kind: entry.kind, relativePath: observed.relativePath, unitKey: entry.unitKey, required: entry.required, status: "unsupported", sizeBytes: observed.sizeBytes as number, checksumSha256: observed.checksumSha256 as string, detectedType: observed.detectedType ?? null, details: "The detected file type is not allowed by the declared publisher asset lane." };
    return { assetId: entry.assetId, kind: entry.kind, relativePath: observed.relativePath, unitKey: entry.unitKey, required: entry.required, status: "verified", sizeBytes: observed.sizeBytes as number, checksumSha256: observed.checksumSha256 as string, detectedType: observed.detectedType as string, details: "The declared publisher asset was found, typed, sized, and checksumed for review." };
  });
  for (const observed of input.observedFiles) {
    if (!declaredPaths.has(observed.relativePath)) files.push({ assetId: observed.assetId ?? `unlisted:${observed.relativePath}`, kind: "unlisted", relativePath: observed.relativePath, unitKey: "unmapped", required: false, status: "unlisted", sizeBytes: observed.sizeBytes ?? null, checksumSha256: observed.checksumSha256 ?? null, detectedType: observed.detectedType ?? null, details: "A source-directory file was not declared in the publisher manifest and is withheld from package review." });
  }
  const counts = {
    declared: entries.length,
    verified: files.filter((file) => file.status === "verified").length,
    missing: files.filter((file) => file.status === "missing").length,
    unsupported: files.filter((file) => file.status === "unsupported").length,
    invalid: files.filter((file) => file.status === "invalid").length,
    unlisted: files.filter((file) => file.status === "unlisted").length,
  };
  const blockers = [...manifestErrors];
  const warnings = [];
  const requiredMissing = files.filter((file) => file.status === "missing" && file.required).length;
  const optionalMissing = files.filter((file) => file.status === "missing" && !file.required).length;
  if (requiredMissing > 0) blockers.push(`${requiredMissing} required publisher asset(s) are missing.`);
  if (optionalMissing > 0) warnings.push(`${optionalMissing} optional publisher asset(s) are not present.`);
  if (counts.unsupported > 0) blockers.push(`${counts.unsupported} publisher asset(s) use unsupported types.`);
  if (counts.invalid > 0) blockers.push(`${counts.invalid} publisher asset(s) failed path, size, or checksum validation.`);
  if (counts.unlisted > 0) blockers.push(`${counts.unlisted} source-directory file(s) are unlisted in the publisher manifest.`);
  return {
    recordVersion: 1,
    reportId: `${input.manifest.tenantId}:${input.manifest.packageId}:${input.manifest.version}:source-preflight`,
    manifestId: input.manifest.manifestId,
    manifestChecksumSha256: input.manifestChecksumSha256,
    inventoryChecksumSha256: input.inventoryChecksumSha256,
    tenantId: input.manifest.tenantId,
    packageId: input.manifest.packageId,
    version: input.manifest.version,
    status: "blocked",
    inventoryStatus: blockers.length === 0 ? "complete" : "incomplete",
    files,
    counts,
    blockers,
    warnings,
    nextActions: blockers.length === 0
      ? ["Attach the preflight report to source review evidence.", "Complete rights, accessibility, game, audio, release, and teacher rehearsal review."]
      : ["Correct the publisher source folder or manifest, then rerun the preflight.", "Do not upload, promote, assemble, print QR codes, activate hosted persistence, or start learners from this report."],
    reviewOnly: true,
    quarantineWriteAllowed: false,
    packageAssemblyAllowed: false,
    packagePromotionAllowed: false,
    qrPrintAllowed: false,
    hostedPersistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validatePublisherSourcePackageManifest(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher source package manifest must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher source package manifest recordVersion must be 1.");
  for (const field of ["manifestId", "tenantId", "packageId", "version"] as const) if (!isNonEmptyString(value[field])) errors.push(`Publisher source package manifest ${field} must be non-empty.`);
  if (value.reviewOnly !== true || value.quarantineWriteAllowed !== false || value.packageAssemblyAllowed !== false || value.studentFacingUseAllowed !== false) errors.push("Publisher source package manifest must remain review-only and protected-action blocked.");
  if (!Array.isArray(value.entries) || value.entries.length === 0) errors.push("Publisher source package manifest must declare at least one asset entry.");
  const seen = new Set<string>();
  for (const entry of Array.isArray(value.entries) ? value.entries : []) {
    if (!isRecord(entry)) { errors.push("Publisher source package manifest entries must be objects."); continue; }
    const assetId = String(entry.assetId ?? "");
    if (!isNonEmptyString(entry.assetId) || seen.has(assetId)) errors.push("Publisher source package manifest asset ids must be unique and non-empty.");
    seen.add(assetId);
    if (!isNonEmptyString(entry.kind) || !["textbook-source", "teacher-answer-key", "image", "audio", "video", "transcript", "font", "background-media"].includes(String(entry.kind))) errors.push(`Publisher source package entry ${assetId} has an unsupported kind.`);
    if (entry.kind === "teacher-answer-key" && entry.teacherOnly !== true) errors.push(`Publisher source package entry ${assetId} must be teacher-only.`);
    if (entry.kind !== "teacher-answer-key" && entry.teacherOnly === true) errors.push(`Only teacher-answer-key entries may be teacher-only (${assetId}).`);
    if (!isNonEmptyString(entry.relativePath) || !isSafeRelativePath(String(entry.relativePath))) errors.push(`Publisher source package entry ${assetId} has an unsafe relative path.`);
    if (!isNonEmptyString(entry.unitKey)) errors.push(`Publisher source package entry ${assetId} needs a unitKey.`);
    if (!Array.isArray(entry.acceptedTypes) || entry.acceptedTypes.length === 0 || entry.acceptedTypes.some((type) => !isNonEmptyString(type))) errors.push(`Publisher source package entry ${assetId} needs accepted types.`);
    if (typeof entry.required !== "boolean") errors.push(`Publisher source package entry ${assetId} needs a required flag.`);
  }
  return [...new Set(errors)];
}

export function validatePublisherSourcePackagePreflightReport(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher source package preflight report must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher source package preflight report recordVersion must be 1.");
  for (const field of ["reportId", "manifestId", "tenantId", "packageId", "version"] as const) if (!isNonEmptyString(value[field])) errors.push(`Publisher source package preflight report ${field} must be non-empty.`);
  for (const field of ["manifestChecksumSha256", "inventoryChecksumSha256"] as const) if (!/^sha256:[0-9a-f]{64}$/i.test(String(value[field] ?? ""))) errors.push(`Publisher source package preflight report ${field} must use sha256:<64 hexadecimal characters>.`);
  if (value.status !== "blocked" || value.mode !== "review-only" || value.sideEffect !== "none" || value.reviewOnly !== true) errors.push("Publisher source package preflight report must remain blocked, review-only, and side-effect-free.");
  if (!Array.isArray(value.files)) errors.push("Publisher source package preflight report files must be an array.");
  for (const field of ["quarantineWriteAllowed", "packageAssemblyAllowed", "packagePromotionAllowed", "qrPrintAllowed", "hostedPersistenceActivationAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function isSafeRelativePath(value: string): boolean {
  return value.length > 0 && !value.startsWith("/") && !value.startsWith("\\") && !value.includes("\\") && !value.split("/").includes("..") && !value.split("/").includes("");
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
