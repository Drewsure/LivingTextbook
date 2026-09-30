import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import {
  validatePilotQrAliasRegistryRecord,
  type PilotQrAliasRegistryRecord,
} from "@living-textbook/content-model";
import { validateDurableBackupFilesystemPath, validateDurableBackupPath } from "../persistence/backupPathPolicy";

export type PilotQrAliasRegistryWriteInput = { record: PilotQrAliasRegistryRecord };

export type PilotQrAliasRegistryWriteResult =
  | { status: "accepted"; idempotent: false; relativePath: string; errors: string[] }
  | { status: "accepted"; idempotent: true; relativePath: string; errors: string[] }
  | { status: "blocked"; idempotent: false; relativePath: null; errors: string[] }
  | { status: "conflict"; idempotent: false; relativePath: string; errors: string[] };

export type PilotQrAliasRegistryReadResult =
  | { status: "available"; relativePath: string; record: PilotQrAliasRegistryRecord; errors: string[] }
  | { status: "not-found" | "blocked"; relativePath: string | null; record: null; errors: string[] };

export async function writePilotQrAliasRegistry(input: PilotQrAliasRegistryWriteInput): Promise<PilotQrAliasRegistryWriteResult> {
  const validationErrors = validatePilotQrAliasRegistryRecord(input.record);
  if (validationErrors.length > 0) return blocked(validationErrors);
  if (process.env.LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_WRITES_ENABLED !== "true") {
    return blocked(["Pilot QR alias registry writes are disabled. Enable the explicit registry-write gate before persisting approved aliases."]);
  }

  const resolved = resolveRegistryPath(input.record);
  if (!resolved.ok) return blocked(resolved.errors);
  const { root, directory, path, relativePath } = resolved;
  try {
    await mkdir(root, { recursive: true });
    const rootErrors = validateDurableBackupFilesystemPath(join(root, "boundary-check"), root);
    if (rootErrors.length > 0) return blocked(rootErrors);
    await mkdir(directory, { recursive: true });
    const directoryErrors = validateDurableBackupFilesystemPath(directory, root);
    if (directoryErrors.length > 0) return blocked(directoryErrors);

    if (await pathExists(path)) {
      const existing = await readJson(path);
      const existingErrors = validatePilotQrAliasRegistryRecord(existing);
      if (existingErrors.length > 0) return conflict(relativePath, ["An existing QR alias registry record is invalid.", ...existingErrors]);
      if (stableJson(existing) === stableJson(input.record)) return { status: "accepted", idempotent: true, relativePath, errors: [] };
      return conflict(relativePath, ["A different immutable QR alias registry record already exists for this tenant, package, and version."]);
    }

    const staging = join(directory, `.qr-alias-registry.staging-${randomUUID()}`);
    const stagingErrors = [
      ...validateDurableBackupPath(staging, root),
      ...validateDurableBackupFilesystemPath(staging, root),
    ];
    if (stagingErrors.length > 0) return blocked(stagingErrors);
    try {
      await writeFile(staging, `${JSON.stringify(input.record, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
      await rename(staging, path);
      return { status: "accepted", idempotent: false, relativePath, errors: [] };
    } catch {
      await rm(staging, { force: true }).catch(() => undefined);
      if (await pathExists(path)) {
        const existing = await readJson(path);
        if (validatePilotQrAliasRegistryRecord(existing).length === 0 && stableJson(existing) === stableJson(input.record)) return { status: "accepted", idempotent: true, relativePath, errors: [] };
      }
      return blocked(["Pilot QR alias registry record could not be committed atomically inside the configured custody root."]);
    }
  } catch {
    return blocked(["Pilot QR alias registry record could not be written inside the configured custody root."]);
  }
}

export async function readPilotQrAliasRegistry(input: { tenantId: string; packageId: string; version: string }): Promise<PilotQrAliasRegistryReadResult> {
  const identityErrors = [input.tenantId, input.packageId, input.version].flatMap((value) => isSafeSegment(value) ? [] : ["Pilot QR alias registry reads require safe tenant, package, and version path segments."]);
  if (identityErrors.length > 0) return { status: "blocked", relativePath: null, record: null, errors: identityErrors };
  const configuredRoot = process.env.LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_ROOT?.trim();
  if (!configuredRoot) return { status: "blocked", relativePath: null, record: null, errors: ["Pilot QR alias registry reads require an explicit custody root."] };
  const root = resolve(configuredRoot);
  const path = resolve(root, input.tenantId, input.packageId, input.version, "qr-alias-registry.json");
  const pathErrors = validateDurableBackupPath(path, root);
  if (pathErrors.length > 0) return { status: "blocked", relativePath: null, record: null, errors: [...new Set(pathErrors)] };
  const relativePath = relative(root, path).replaceAll("\\", "/");
  try {
    const value = await readJson(path);
    const errors = validatePilotQrAliasRegistryRecord(value);
    if (errors.length > 0) return { status: "blocked", relativePath, record: null, errors };
    return { status: "available", relativePath, record: value as PilotQrAliasRegistryRecord, errors: [] };
  } catch {
    return { status: "not-found", relativePath, record: null, errors: ["Pilot QR alias registry record was not found in the configured custody root."] };
  }
}

function resolveRegistryPath(record: PilotQrAliasRegistryRecord): { ok: true; root: string; directory: string; path: string; relativePath: string } | { ok: false; errors: string[] } {
  const configuredRoot = process.env.LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_ROOT?.trim();
  if (!configuredRoot) return { ok: false, errors: ["Pilot QR alias registry writes require an explicit custody root."] };
  const segments = [record.tenantId, record.packageId, record.version];
  if (segments.some((value) => !isSafeSegment(value))) return { ok: false, errors: ["Pilot QR alias registry tenant, package, and version must be safe filesystem path segments."] };
  const root = resolve(configuredRoot);
  const directory = resolve(root, ...segments);
  const path = resolve(directory, "qr-alias-registry.json");
  const pathErrors = validateDurableBackupPath(path, root);
  if (pathErrors.length > 0) return { ok: false, errors: [...new Set(pathErrors)] };
  return { ok: true, root, directory, path, relativePath: relative(root, path).replaceAll("\\", "/") };
}

async function readJson(path: string): Promise<unknown> { return JSON.parse(await readFile(path, "utf8")) as unknown; }
async function pathExists(path: string): Promise<boolean> { try { await stat(path); return true; } catch { return false; } }
function blocked(errors: string[]): PilotQrAliasRegistryWriteResult { return { status: "blocked", idempotent: false, relativePath: null, errors: [...new Set(errors)] }; }
function conflict(relativePath: string, errors: string[]): PilotQrAliasRegistryWriteResult { return { status: "conflict", idempotent: false, relativePath, errors: [...new Set(errors)] }; }
function isSafeSegment(value: string): boolean { return value.length > 0 && value.length <= 160 && /^[A-Za-z0-9._-]+$/.test(value); }
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}
