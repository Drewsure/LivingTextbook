import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import {
  validatePilotDeliveryManifest,
  validatePilotDeliveryReleaseReceipt,
  type PilotDeliveryManifest,
  type PilotDeliveryReleaseReceipt,
} from "@living-textbook/content-model";
import { validateDurableBackupFilesystemPath, validateDurableBackupPath } from "@/server/persistence/backupPathPolicy";

export type PilotDeliveryMetadataWriteInput = {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  operatorId: string;
  writtenAt: string;
};

export type PilotDeliveryMetadataWriteResult =
  | { status: "accepted"; idempotent: false; relativeDirectory: string; files: string[]; errors: string[] }
  | { status: "accepted"; idempotent: true; relativeDirectory: string; files: string[]; errors: string[] }
  | { status: "blocked"; idempotent: false; relativeDirectory: null; files: string[]; errors: string[] }
  | { status: "conflict"; idempotent: false; relativeDirectory: string; files: string[]; errors: string[] };

export type PilotDeliveryHandoffRecord = {
  recordVersion: 1;
  tenantId: string;
  packageId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  sourceAssemblyChecksum: string;
  operatorId: string;
  writtenAt: string;
  files: string[];
  payloadBytesIncluded: false;
  sideEffect: "metadata-only";
};

export type PilotDeliveryMetadataReadResult =
  | { status: "available"; relativeDirectory: string; manifest: PilotDeliveryManifest; receipt: PilotDeliveryReleaseReceipt; handoffRecord: PilotDeliveryHandoffRecord; errors: string[] }
  | { status: "not-found" | "blocked"; relativeDirectory: string | null; manifest: null; receipt: null; handoffRecord: null; errors: string[] };

export async function writePilotDeliveryMetadata(input: PilotDeliveryMetadataWriteInput): Promise<PilotDeliveryMetadataWriteResult> {
  const validationErrors = [
    ...validatePilotDeliveryManifest(input.manifest),
    ...validatePilotDeliveryReleaseReceipt(input.receipt),
    ...validateWriteBinding(input),
  ];
  if (validationErrors.length > 0) return blocked(validationErrors);
  if (process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_WRITES_ENABLED !== "true") {
    return blocked(["Pilot delivery metadata writes are disabled. Enable the explicit local delivery-write gate before materializing a package handoff."]);
  }

  const configuredRoot = process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_ROOT?.trim();
  if (!configuredRoot) return blocked(["Pilot delivery metadata writes require an explicit custody root."]);

  const root = resolve(configuredRoot);
  const directory = resolve(root, safeSegment(input.manifest.tenantId), safeSegment(input.manifest.packageId), safeSegment(input.manifest.version));
  const lexicalErrors = validateDurableBackupPath(directory, root);
  if (lexicalErrors.length > 0) return blocked(lexicalErrors);

  try {
    await mkdir(root, { recursive: true });
    const rootFilesystemErrors = validateDurableBackupFilesystemPath(join(root, "boundary-check"), root);
    if (rootFilesystemErrors.length > 0) return blocked(rootFilesystemErrors);
    const parent = dirname(directory);
    await mkdir(parent, { recursive: true });
    const filesystemErrors = validateDurableBackupFilesystemPath(parent, root);
    if (filesystemErrors.length > 0) return blocked(filesystemErrors);

    const record: PilotDeliveryHandoffRecord = {
      recordVersion: 1,
      tenantId: input.manifest.tenantId,
      packageId: input.manifest.packageId,
      version: input.manifest.version,
      manifestId: input.manifest.manifestId,
      receiptId: input.receipt.receiptId,
      sourceAssemblyChecksum: input.manifest.sourceAssemblyChecksum,
      operatorId: input.operatorId,
      writtenAt: input.writtenAt,
      files: ["delivery-manifest.json", "release-receipt.json", "handoff-record.json"],
      payloadBytesIncluded: false,
      sideEffect: "metadata-only",
    } as const;
    const relativeDirectory = relative(root, directory).replaceAll("\\", "/");
    if (await pathExists(directory)) return reconcileExistingDelivery(directory, relativeDirectory, input, record.files);

    const staging = join(parent, `.${safeSegment(input.manifest.version)}.staging-${randomUUID()}`);
    const stagingLexicalErrors = validateDurableBackupPath(staging, root);
    if (stagingLexicalErrors.length > 0) return blocked(stagingLexicalErrors);
    await mkdir(staging, { recursive: false });
    try {
      const stagingErrors = validateDurableBackupFilesystemPath(staging, root);
      if (stagingErrors.length > 0) {
        await rm(staging, { recursive: true, force: true }).catch(() => undefined);
        return blocked(stagingErrors);
      }
      await writeJsonFile(join(staging, "delivery-manifest.json"), input.manifest);
      await writeJsonFile(join(staging, "release-receipt.json"), input.receipt);
      await writeJsonFile(join(staging, "handoff-record.json"), record);
      try {
        await rename(staging, directory);
      } catch {
        if (await pathExists(directory)) {
          await rm(staging, { recursive: true, force: true }).catch(() => undefined);
          return reconcileExistingDelivery(directory, relativeDirectory, input, record.files);
        }
        throw new Error("Pilot delivery staging directory could not be committed.");
      }
      return { status: "accepted", idempotent: false, relativeDirectory, files: record.files.slice(), errors: [] };
    } catch {
      await rm(staging, { recursive: true, force: true }).catch(() => undefined);
      throw new Error("Pilot delivery metadata could not be committed atomically.");
    }
  } catch {
    return blocked(["Pilot delivery metadata could not be written inside the configured custody root."]);
  }
}

async function reconcileExistingDelivery(directory: string, relativeDirectory: string, input: PilotDeliveryMetadataWriteInput, files: string[]): Promise<PilotDeliveryMetadataWriteResult> {
  const existing = await readPilotDeliveryMetadata({ tenantId: input.manifest.tenantId, packageId: input.manifest.packageId, version: input.manifest.version });
  if (existing.status === "available" && stableJson(existing.manifest) === stableJson(input.manifest) && stableJson(existing.receipt) === stableJson(input.receipt)) {
    return { status: "accepted", idempotent: true, relativeDirectory, files: files.slice(), errors: [] };
  }
  return { status: "conflict", idempotent: false, relativeDirectory, files: files.slice(), errors: ["A different or incomplete immutable delivery record already exists for this tenant, package, and version."] };
}

export async function readPilotDeliveryMetadata(input: { tenantId: string; packageId: string; version: string }): Promise<PilotDeliveryMetadataReadResult> {
  const identityErrors = [input.tenantId, input.packageId, input.version].flatMap((value) => isSafeSegment(value) ? [] : ["Pilot delivery metadata read requires safe tenant, package, and version path segments."]);
  if (identityErrors.length > 0) return { status: "blocked", relativeDirectory: null, manifest: null, receipt: null, handoffRecord: null, errors: identityErrors };
  const configuredRoot = process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_ROOT?.trim();
  if (!configuredRoot) return { status: "blocked", relativeDirectory: null, manifest: null, receipt: null, handoffRecord: null, errors: ["Pilot delivery metadata reads require an explicit custody root."] };
  const root = resolve(configuredRoot);
  const directory = resolve(root, input.tenantId, input.packageId, input.version);
  const pathErrors = [
    ...validateDurableBackupPath(directory, root),
    ...validateDurableBackupFilesystemPath(directory, root),
  ];
  if (pathErrors.length > 0) return { status: "blocked", relativeDirectory: null, manifest: null, receipt: null, handoffRecord: null, errors: [...new Set(pathErrors)] };
  try {
    const [manifestValue, receiptValue, recordValue] = await Promise.all([
      readJson(join(directory, "delivery-manifest.json")),
      readJson(join(directory, "release-receipt.json")),
      readJson(join(directory, "handoff-record.json")),
    ]);
    const manifestErrors = validatePilotDeliveryManifest(manifestValue);
    const receiptErrors = validatePilotDeliveryReleaseReceipt(receiptValue);
    const recordErrors = validateHandoffRecord(recordValue);
    const bindingErrors = validateStoredBinding(manifestValue, receiptValue, recordValue);
    const errors = [...manifestErrors, ...receiptErrors, ...recordErrors, ...bindingErrors];
    if (errors.length > 0) return { status: "blocked", relativeDirectory: relative(root, directory).replaceAll("\\", "/"), manifest: null, receipt: null, handoffRecord: null, errors: [...new Set(errors)] };
    return {
      status: "available",
      relativeDirectory: relative(root, directory).replaceAll("\\", "/"),
      manifest: manifestValue as PilotDeliveryManifest,
      receipt: receiptValue as PilotDeliveryReleaseReceipt,
      handoffRecord: recordValue as PilotDeliveryHandoffRecord,
      errors: [],
    };
  } catch {
    return { status: "not-found", relativeDirectory: relative(root, directory).replaceAll("\\", "/"), manifest: null, receipt: null, handoffRecord: null, errors: ["Pilot delivery metadata was not found in the configured custody root."] };
  }
}

function validateWriteBinding(input: PilotDeliveryMetadataWriteInput): string[] {
  const errors: string[] = [];
  if (input.receipt.manifestId !== input.manifest.manifestId) errors.push("Pilot delivery writer receipt and manifest ids do not match.");
  if (input.receipt.tenantId !== input.manifest.tenantId || input.receipt.packageId !== input.manifest.packageId || input.receipt.version !== input.manifest.version) errors.push("Pilot delivery writer tenant, package, and version identities do not match.");
  if (input.receipt.sourceAssemblyChecksum !== input.manifest.sourceAssemblyChecksum) errors.push("Pilot delivery writer checksum does not match the approved manifest.");
  if (input.manifest.status !== "ready-for-manual-release" || !input.manifest.deliveryAllowed) errors.push("Pilot delivery writer requires a delivery manifest approved for manual release.");
  if (input.receipt.status !== "manual-release-approved" || !input.receipt.deliveryAllowed) errors.push("Pilot delivery writer requires an approved manual release receipt.");
  for (const [label, value] of [["tenant", input.manifest.tenantId], ["package", input.manifest.packageId], ["version", input.manifest.version]] as const) {
    if (!isSafeSegment(value)) errors.push(`Pilot delivery writer ${label} identity must be a safe filesystem path segment.`);
  }
  if (!isSafeSegment(input.operatorId)) errors.push("Pilot delivery writer requires a bounded operator identity.");
  if (!isIsoTimestamp(input.writtenAt)) errors.push("Pilot delivery writer requires a valid write timestamp.");
  return errors;
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8")) as unknown;
}

function validateHandoffRecord(value: unknown): string[] {
  if (!isRecord(value)) return ["Pilot delivery handoff record must be an object."];
  const errors: string[] = [];
  if (value.recordVersion !== 1 || value.payloadBytesIncluded !== false || value.sideEffect !== "metadata-only") errors.push("Pilot delivery handoff record has an unsafe version or side-effect marker.");
  for (const field of ["tenantId", "packageId", "version", "manifestId", "receiptId", "sourceAssemblyChecksum", "operatorId", "writtenAt"] as const) if (!isNonEmptyString(value[field])) errors.push(`Pilot delivery handoff record ${field} must be non-empty.`);
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot delivery handoff record checksum is invalid.");
  if (!isIsoTimestamp(String(value.writtenAt ?? ""))) errors.push("Pilot delivery handoff record writtenAt must be a valid ISO timestamp.");
  if (!Array.isArray(value.files) || value.files.join(",") !== "delivery-manifest.json,release-receipt.json,handoff-record.json") errors.push("Pilot delivery handoff record file list is invalid.");
  return errors;
}

function validateStoredBinding(manifest: unknown, receipt: unknown, record: unknown): string[] {
  if (!isRecord(manifest) || !isRecord(receipt) || !isRecord(record)) return ["Pilot delivery stored metadata must contain manifest, receipt, and handoff records."];
  const errors: string[] = [];
  for (const field of ["tenantId", "packageId", "version"] as const) if (manifest[field] !== receipt[field] || manifest[field] !== record[field]) errors.push(`Pilot delivery stored ${field} identity does not match across records.`);
  if (manifest.manifestId !== receipt.manifestId || manifest.manifestId !== record.manifestId) errors.push("Pilot delivery stored manifest identity does not match across records.");
  if (manifest.sourceAssemblyChecksum !== receipt.sourceAssemblyChecksum || manifest.sourceAssemblyChecksum !== record.sourceAssemblyChecksum) errors.push("Pilot delivery stored checksum does not match across records.");
  if (receipt.receiptId !== record.receiptId) errors.push("Pilot delivery stored receipt identity does not match across records.");
  if (manifest.status !== "ready-for-manual-release" || receipt.status !== "manual-release-approved") errors.push("Pilot delivery stored records are not approved for handoff.");
  return errors;
}

async function writeJsonFile(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function blocked(errors: string[]): PilotDeliveryMetadataWriteResult {
  return { status: "blocked", idempotent: false, relativeDirectory: null, files: [], errors: [...new Set(errors)] };
}

function safeSegment(value: string): string {
  return value.replaceAll(/[^A-Za-z0-9._-]+/g, "-").slice(0, 160) || "unknown";
}

function isSafeSegment(value: string): boolean {
  return typeof value === "string" && value.length > 0 && value.length <= 160 && /^[A-Za-z0-9._-]+$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSha256(value: unknown): boolean {
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value);
}

function isIsoTimestamp(value: string): boolean {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}
