export interface LocalPilotPackageIntegrityFile {
  path: string;
  checksum: string;
  bytes: number;
}

export interface LocalPilotPackageIntegrity {
  integrityVersion: 1;
  integrityManifestId: string;
  tenantId: string;
  packageId: string;
  version: string;
  bundleId: string;
  sourceAssemblyChecksum: string;
  files: LocalPilotPackageIntegrityFile[];
  fileCount: number;
  learnerRecordsIncluded: false;
  sideEffect: "local-package-assembly";
}

export function createLocalPilotPackageIntegrityManifestId(input: Pick<LocalPilotPackageIntegrity, "packageId" | "version" | "sourceAssemblyChecksum">): string {
  return `${input.packageId}:${input.version}:package-integrity:${input.sourceAssemblyChecksum}`;
}

export function validateLocalPilotPackageIntegrity(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local pilot package integrity manifest must be an object."];
  if (value.integrityVersion !== 1) errors.push("Local pilot package integrity integrityVersion must be 1.");
  for (const field of ["integrityManifestId", "tenantId", "packageId", "version", "bundleId", "sourceAssemblyChecksum"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Local pilot package integrity ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Local pilot package integrity sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (!Array.isArray(value.files) || value.files.length === 0) {
    errors.push("Local pilot package integrity must contain at least one file.");
  } else {
    const paths = new Set<string>();
    for (const file of value.files) {
      if (!isRecord(file)) {
        errors.push("Local pilot package integrity files must be objects.");
        continue;
      }
      if (!isSafeRelativePath(file.path)) errors.push("Local pilot package integrity file paths must be safe relative paths.");
      if (!isSha256(file.checksum)) errors.push("Local pilot package integrity file checksums must be sha256:<64 hexadecimal characters>.");
      if (!Number.isInteger(file.bytes) || Number(file.bytes) < 0) errors.push("Local pilot package integrity file bytes must be a non-negative integer.");
      if (isNonEmptyString(file.path) && !paths.add(file.path)) errors.push("Local pilot package integrity file paths must be unique.");
    }
    if (value.fileCount !== value.files.length) errors.push("Local pilot package integrity fileCount must match files length.");
  }
  if (value.learnerRecordsIncluded !== false) errors.push("Local pilot package integrity must exclude learner records.");
  if (value.sideEffect !== "local-package-assembly") errors.push("Local pilot package integrity sideEffect must be local-package-assembly.");
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

function isSafeRelativePath(value: unknown): value is string {
  return typeof value === "string"
    && value.length > 0
    && value.length <= 2048
    && !value.startsWith("/")
    && !value.startsWith("\\")
    && !value.includes("\\")
    && !value.split("/").some((segment) => segment === "" || segment === "." || segment === "..");
}
