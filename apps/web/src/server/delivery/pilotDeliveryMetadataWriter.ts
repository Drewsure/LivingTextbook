import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
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
    await mkdir(directory, { recursive: true });
    const filesystemErrors = validateDurableBackupFilesystemPath(directory, root);
    if (filesystemErrors.length > 0) return blocked(filesystemErrors);

    const manifestPath = join(directory, "delivery-manifest.json");
    const receiptPath = join(directory, "release-receipt.json");
    const recordPath = join(directory, "handoff-record.json");
    const record = {
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

    const results = await Promise.all([
      writeImmutableJsonFile(manifestPath, input.manifest),
      writeImmutableJsonFile(receiptPath, input.receipt),
      writeImmutableJsonFile(recordPath, record),
    ]);
    const conflicts = results.filter((result) => result === "conflict");
    const relativeDirectory = relative(root, directory).replaceAll("\\", "/");
    if (conflicts.length > 0) return { status: "conflict", idempotent: false, relativeDirectory, files: record.files.slice(), errors: ["A different immutable delivery record already exists for this tenant, package, and version."] };
    return { status: "accepted", idempotent: results.every((result) => result === "existing"), relativeDirectory, files: record.files.slice(), errors: [] };
  } catch {
    return blocked(["Pilot delivery metadata could not be written inside the configured custody root."]);
  }
}

function validateWriteBinding(input: PilotDeliveryMetadataWriteInput): string[] {
  const errors: string[] = [];
  if (input.receipt.manifestId !== input.manifest.manifestId) errors.push("Pilot delivery writer receipt and manifest ids do not match.");
  if (input.receipt.tenantId !== input.manifest.tenantId || input.receipt.packageId !== input.manifest.packageId || input.receipt.version !== input.manifest.version) errors.push("Pilot delivery writer tenant, package, and version identities do not match.");
  if (input.receipt.sourceAssemblyChecksum !== input.manifest.sourceAssemblyChecksum) errors.push("Pilot delivery writer checksum does not match the approved manifest.");
  if (input.manifest.status !== "ready-for-manual-release" || !input.manifest.deliveryAllowed) errors.push("Pilot delivery writer requires a delivery manifest approved for manual release.");
  if (input.receipt.status !== "manual-release-approved" || !input.receipt.deliveryAllowed) errors.push("Pilot delivery writer requires an approved manual release receipt.");
  if (!isSafeSegment(input.operatorId)) errors.push("Pilot delivery writer requires a bounded operator identity.");
  if (!isIsoTimestamp(input.writtenAt)) errors.push("Pilot delivery writer requires a valid write timestamp.");
  return errors;
}

async function writeImmutableJsonFile(path: string, value: unknown): Promise<"created" | "existing" | "conflict"> {
  const source = `${JSON.stringify(value, null, 2)}\n`;
  try {
    const existing = await readFile(path, "utf8");
    return stableJson(JSON.parse(existing)) === stableJson(value) ? "existing" : "conflict";
  } catch {
    try {
      await writeFile(path, source, { encoding: "utf8", flag: "wx" });
      return "created";
    } catch {
      try {
        const existing = await readFile(path, "utf8");
        return stableJson(JSON.parse(existing)) === stableJson(value) ? "existing" : "conflict";
      } catch {
        return "conflict";
      }
    }
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

function isIsoTimestamp(value: string): boolean {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}
