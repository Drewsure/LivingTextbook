import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import {
  createLocalBundleManifestReviewRecord,
  validateLocalBundleManifest,
  validateLocalBundleManifestReviewRecord,
  type LocalBundleManifest,
  type LocalBundleManifestReviewRecord,
} from "@living-textbook/content-model";
import { readQuarantinePackageReviewPacket, readQuarantineSourcePreflightEvidence } from "../uploads/quarantineUploadStore";
import { validateDurableBackupFilesystemPath, validateDurableBackupPath } from "../persistence/backupPathPolicy";

export type LocalBundleManifestReviewWriteInput = {
  tenantId: string;
  packageId: string;
  quarantineId: string;
  reviewPacketId: string;
  manifest: LocalBundleManifest;
  reviewerId: string;
  reviewedAt: string;
};

export type LocalBundleManifestReviewWriteResult =
  | { status: "accepted"; idempotent: false; relativePath: string; record: LocalBundleManifestReviewRecord; errors: string[] }
  | { status: "accepted"; idempotent: true; relativePath: string; record: LocalBundleManifestReviewRecord; errors: string[] }
  | { status: "blocked"; idempotent: false; relativePath: null; record: null; errors: string[] }
  | { status: "conflict"; idempotent: false; relativePath: string; record: null; errors: string[] };

export type LocalBundleManifestReviewReadResult =
  | { status: "available"; relativePath: string; record: LocalBundleManifestReviewRecord; errors: string[] }
  | { status: "not-found" | "blocked"; relativePath: string | null; record: null; errors: string[] };

export async function writeLocalBundleManifestReview(input: LocalBundleManifestReviewWriteInput): Promise<LocalBundleManifestReviewWriteResult> {
  const validationErrors = [
    ...validateLocalBundleManifest(input.manifest).errors,
    ...validateInputIdentity(input),
  ];
  if (validationErrors.length > 0) return blocked(validationErrors);
  if (process.env.LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_WRITES_ENABLED !== "true") {
    return blocked(["Local bundle manifest review writes are disabled. Enable the explicit review gate only after human review has been captured."]);
  }

  const lineage = await readManifestReviewLineage(input);
  if (lineage.errors.length > 0 || !lineage.sourcePreflightEvidenceId) return blocked(lineage.errors);

  const manifestChecksumSha256 = `sha256:${createHash("sha256").update(stableJson(input.manifest), "utf8").digest("hex")}`;
  const record = createLocalBundleManifestReviewRecord({
    recordId: `${input.tenantId}:${input.packageId}:${input.manifest.version}:bundle-manifest-review`,
    tenantId: input.tenantId,
    packageId: input.packageId,
    version: input.manifest.version,
    quarantineId: input.quarantineId,
    reviewPacketId: input.reviewPacketId,
    sourcePreflightEvidenceId: lineage.sourcePreflightEvidenceId,
    manifestChecksumSha256,
    manifest: input.manifest,
    reviewerId: input.reviewerId,
    reviewedAt: input.reviewedAt,
  });
  const recordErrors = validateLocalBundleManifestReviewRecord(record);
  if (recordErrors.length > 0) return blocked(recordErrors);

  const resolved = resolveReviewPath(input.tenantId, input.packageId, input.manifest.version);
  if (!resolved.ok) return blocked(resolved.errors);
  const { root, directory, path, relativePath } = resolved;
  try {
    await mkdir(root, { recursive: true });
    const directoryErrors = [
      ...validateDurableBackupFilesystemPath(directory, root),
      ...validateDurableBackupFilesystemPath(joinBoundary(root), root),
    ];
    if (directoryErrors.length > 0) return blocked(directoryErrors);
    await mkdir(directory, { recursive: true });
    const createdDirectoryErrors = validateDurableBackupFilesystemPath(directory, root);
    if (createdDirectoryErrors.length > 0) return blocked(createdDirectoryErrors);
    if (await pathExists(path)) {
      const existing = await readJson(path);
      const existingErrors = validateLocalBundleManifestReviewRecord(existing);
      if (existingErrors.length > 0) return conflict(relativePath, ["An existing local bundle manifest review record is invalid.", ...existingErrors]);
      if (stableJson(existing) === stableJson(record)) return accepted(relativePath, existing as LocalBundleManifestReviewRecord, true);
      return conflict(relativePath, ["A different immutable local bundle manifest review record already exists for this tenant, package, and version."]);
    }
    const staging = resolve(directory, `.bundle-manifest-review.staging-${randomUUID()}.json`);
    const stagingErrors = [...validateDurableBackupPath(staging, root), ...validateDurableBackupFilesystemPath(staging, root)];
    if (stagingErrors.length > 0) return blocked(stagingErrors);
    try {
      await writeFile(staging, `${JSON.stringify(record, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
      try {
        await rename(staging, path);
      } catch {
        if (await pathExists(path)) {
          await rm(staging, { force: true }).catch(() => undefined);
          const existing = await readJson(path);
          if (stableJson(existing) === stableJson(record)) return accepted(relativePath, existing as LocalBundleManifestReviewRecord, true);
          return conflict(relativePath, ["A different immutable local bundle manifest review record won the concurrent write."]);
        }
        throw new Error("Local bundle manifest review staging file could not be committed.");
      }
      return accepted(relativePath, record, false);
    } catch {
      await rm(staging, { force: true }).catch(() => undefined);
      throw new Error("Local bundle manifest review record could not be committed atomically.");
    }
  } catch {
    return blocked(["Local bundle manifest review record could not be written inside the configured custody root."]);
  }
}

export async function readLocalBundleManifestReview(input: { tenantId: string; packageId: string; version: string }): Promise<LocalBundleManifestReviewReadResult> {
  const resolved = resolveReviewPath(input.tenantId, input.packageId, input.version);
  if (!resolved.ok) return { status: "blocked", relativePath: null, record: null, errors: resolved.errors };
  try {
    const value = await readJson(resolved.path);
    const errors = validateLocalBundleManifestReviewRecord(value);
    if (errors.length > 0) return { status: "blocked", relativePath: resolved.relativePath, record: null, errors };
    const record = value as LocalBundleManifestReviewRecord;
    const expectedChecksum = `sha256:${createHash("sha256").update(stableJson(record.manifest), "utf8").digest("hex")}`;
    if (record.manifestChecksumSha256 !== expectedChecksum) return { status: "blocked", relativePath: resolved.relativePath, record: null, errors: ["Local bundle manifest review record checksum does not match the canonical manifest."] };
    if (record.tenantId !== input.tenantId || record.packageId !== input.packageId || record.version !== input.version) return { status: "blocked", relativePath: resolved.relativePath, record: null, errors: ["Local bundle manifest review record identity does not match the exact requested custody path."] };
    return { status: "available", relativePath: resolved.relativePath, record, errors: [] };
  } catch {
    return { status: "not-found", relativePath: resolved.relativePath, record: null, errors: ["Local bundle manifest review record was not found in the configured custody root."] };
  }
}

async function readManifestReviewLineage(input: LocalBundleManifestReviewWriteInput): Promise<{ sourcePreflightEvidenceId: string | null; errors: string[] }> {
  const [packetResult, sourceResult] = await Promise.all([
    readQuarantinePackageReviewPacket(input.tenantId, input.quarantineId),
    readQuarantineSourcePreflightEvidence(input.tenantId, input.quarantineId),
  ]);
  const packet = packetResult.record;
  const source = sourceResult.record;
  const errors = [...packetResult.errors, ...sourceResult.errors];
  if (!packet) errors.push("A durable package review packet is required before a bundle manifest can be reviewed.");
  if (!source) errors.push("Durable publisher source preflight evidence is required before a bundle manifest can be reviewed.");
  if (packet && (packet.packetId !== input.reviewPacketId || packet.tenantId !== input.tenantId || packet.packageId !== input.packageId || packet.status !== "ready-for-next-gate" || packet.reviewDecision !== "accepted-for-package-review")) errors.push("The supplied package review packet does not match the exact bundle-manifest review identity or is not accepted for the next gate.");
  if (source && (source.tenantId !== input.tenantId || source.quarantineId !== input.quarantineId || source.packageId !== input.packageId || source.version !== input.manifest.version || source.status !== "attached")) errors.push("The durable source preflight evidence does not match the exact bundle-manifest review identity.");
  if (packet && source && packet.sourcePreflightEvidenceId !== source.evidenceId) errors.push("The package review packet and source preflight evidence identities do not match.");
  if (packet && source && packet.checksumSha256 !== source.sourceChecksumSha256.replace(/^sha256:/i, "").toLowerCase()) errors.push("The package review packet checksum does not match the durable source preflight evidence.");
  return { sourcePreflightEvidenceId: source?.evidenceId ?? null, errors: [...new Set(errors)] };
}

function validateInputIdentity(input: LocalBundleManifestReviewWriteInput): string[] {
  const errors: string[] = [];
  for (const [label, value] of [["tenant", input.tenantId], ["package", input.packageId], ["quarantine", input.quarantineId], ["review packet", input.reviewPacketId], ["reviewer", input.reviewerId]] as const) {
    if (!isSafeSegment(value)) errors.push(`Local bundle manifest review ${label} identity must be a safe non-empty path segment.`);
  }
  if (input.manifest.tenant_id !== input.tenantId) errors.push("Local bundle manifest review tenant does not match the manifest.");
  if (!isIsoTimestamp(input.reviewedAt)) errors.push("Local bundle manifest review requires a valid reviewedAt timestamp.");
  return errors;
}

function resolveReviewPath(tenantId: string, packageId: string, version: string): { ok: true; root: string; directory: string; path: string; relativePath: string } | { ok: false; errors: string[] } {
  const configuredRoot = process.env.LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_ROOT?.trim();
  if (!configuredRoot) return { ok: false, errors: ["Local bundle manifest review custody requires an explicit root."] };
  if ([tenantId, packageId, version].some((value) => !isSafeSegment(value))) return { ok: false, errors: ["Local bundle manifest review reads require safe tenant, package, and version path segments."] };
  const root = resolve(configuredRoot);
  const directory = resolve(root, tenantId, packageId, version);
  const path = resolve(directory, "bundle-manifest-review.json");
  const pathErrors = validateDurableBackupPath(path, root);
  if (pathErrors.length > 0) return { ok: false, errors: [...new Set(pathErrors)] };
  return { ok: true, root, directory, path, relativePath: relative(root, path).replaceAll("\\", "/") };
}

function accepted(relativePath: string, record: LocalBundleManifestReviewRecord, idempotent: boolean): LocalBundleManifestReviewWriteResult {
  return { status: "accepted", idempotent, relativePath, record, errors: [] };
}
function blocked(errors: string[]): LocalBundleManifestReviewWriteResult { return { status: "blocked", idempotent: false, relativePath: null, record: null, errors: [...new Set(errors)] }; }
function conflict(relativePath: string, errors: string[]): LocalBundleManifestReviewWriteResult { return { status: "conflict", idempotent: false, relativePath, record: null, errors: [...new Set(errors)] }; }
function joinBoundary(root: string): string { return resolve(root, "boundary-check"); }
async function readJson(path: string): Promise<unknown> { return JSON.parse(await readFile(path, "utf8")) as unknown; }
async function pathExists(path: string): Promise<boolean> { try { await stat(path); return true; } catch { return false; } }
function isSafeSegment(value: string): boolean { return value.length > 0 && value.length <= 160 && /^[A-Za-z0-9._-]+$/.test(value); }
function isIsoTimestamp(value: string): boolean { return value.length > 0 && !Number.isNaN(Date.parse(value)); }
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}
