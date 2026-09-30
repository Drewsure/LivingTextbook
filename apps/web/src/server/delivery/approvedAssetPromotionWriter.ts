import { createHash, randomUUID } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import {
  createApprovedAssetPromotionRecord,
  validateApprovedAssetPromotionRecord,
  validateApprovedAssetPromotionRequest,
  validatePilotDeliveryManifest,
  validatePilotDeliveryReleaseReceipt,
  validateUploadQuarantineIntakeRecord,
  type ApprovedAssetPromotionRecord,
  type ApprovedAssetPromotionRequest,
  type PilotDeliveryManifest,
  type PilotDeliveryReleaseReceipt,
  type UploadQuarantinePackageEvidenceReview,
  type UploadQuarantineIntakeRecord,
} from "@living-textbook/content-model";
import { validateDurableBackupFilesystemPath, validateDurableBackupPath } from "../persistence/backupPathPolicy";
import { validateQuarantineFilesystemPath } from "../uploads/quarantinePathPolicy";

export type ApprovedAssetPromotionWriteInput = {
  request: ApprovedAssetPromotionRequest;
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  packageEvidenceReview: UploadQuarantinePackageEvidenceReview;
};

export type ApprovedAssetPromotionWriteResult =
  | { status: "accepted"; idempotent: false; relativeDirectory: string; files: string[]; errors: string[] }
  | { status: "accepted"; idempotent: true; relativeDirectory: string; files: string[]; errors: string[] }
  | { status: "blocked"; idempotent: false; relativeDirectory: null; files: string[]; errors: string[] }
  | { status: "conflict"; idempotent: false; relativeDirectory: string; files: string[]; errors: string[] };

export async function writeApprovedAssetPromotion(input: ApprovedAssetPromotionWriteInput): Promise<ApprovedAssetPromotionWriteResult> {
  const validationErrors = validateInputBinding(input);
  if (validationErrors.length > 0) return blocked(validationErrors);
  if (process.env.LIVING_TEXTBOOOK_APPROVED_ASSET_PROMOTION_WRITES_ENABLED !== "true") {
    return blocked(["Approved asset promotion writes are disabled. Enable the explicit promotion-write gate only after release evidence is accepted."]);
  }

  const configuredRoot = process.env.LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT?.trim();
  if (!configuredRoot) return blocked(["Approved asset promotion writes require an explicit approved asset root."]);
  const root = resolve(configuredRoot);
  const directory = resolve(root, input.request.tenantId, input.request.packageId, input.request.version);
  const recordPath = join(directory, "promotion-record.json");
  const pathErrors = [...validateDurableBackupPath(directory, root), ...validateDurableBackupPath(recordPath, root)];
  if (pathErrors.length > 0) return blocked(pathErrors);
  const relativeDirectory = relative(root, directory).replaceAll("\\", "/");
  const files: string[] = [];
  const createdFiles: string[] = [];
  try {
    await mkdir(root, { recursive: true });
    const rootErrors = validateDurableBackupFilesystemPath(join(root, "boundary-check"), root);
    if (rootErrors.length > 0) return blocked(rootErrors);
    await mkdir(directory, { recursive: true });
    const directoryErrors = validateDurableBackupFilesystemPath(directory, root);
    if (directoryErrors.length > 0) return blocked(directoryErrors);

    const record = createApprovedAssetPromotionRecord(input.request);
    if (await pathExists(recordPath)) {
      const existing = await readJson(recordPath);
      const existingErrors = validateApprovedAssetPromotionRecord(existing);
      if (existingErrors.length > 0) return conflict(relativeDirectory, ["An existing approved asset promotion record is invalid.", ...existingErrors]);
      if (stableJson(existing) === stableJson(record)) return { status: "accepted", idempotent: true, relativeDirectory, files: record.entries.map((entry) => relative(directory, resolve(directory, entry.destinationPath)).replaceAll("\\", "/")), errors: [] };
      return conflict(relativeDirectory, ["A different immutable approved asset promotion already exists for this tenant, package, and version."]);
    }

    for (const entry of record.entries) {
      const source = await readQuarantinedPayload(record.tenantId, entry.sourceQuarantineId, entry, input.request.quarantineId);
      if (!source.ok) return blocked(source.errors);
      const destination = resolve(directory, entry.destinationPath);
      const destinationErrors = [...validateDurableBackupPath(destination, root), ...validateDurableBackupFilesystemPath(destination, root)];
      if (destinationErrors.length > 0) return blocked(destinationErrors);
      await mkdir(resolve(destination, ".."), { recursive: true });
      const existing = await readExistingChecksum(destination);
      if (existing && existing !== entry.checksumSha256) return conflict(relativeDirectory, [`Destination ${entry.destinationPath} already contains different bytes.`]);
      if (!existing) {
        const staging = `${destination}.staging-${randomUUID()}`;
        await copyFile(source.path, staging);
        await rename(staging, destination);
        createdFiles.push(destination);
      }
      files.push(relative(directory, destination).replaceAll("\\", "/"));
    }

    const stagingRecord = join(directory, `.promotion-record.staging-${randomUUID()}`);
    await writeFile(stagingRecord, `${JSON.stringify(record, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    try {
      await rename(stagingRecord, recordPath);
    } catch {
      await rm(stagingRecord, { force: true }).catch(() => undefined);
      if (await pathExists(recordPath)) {
        const existing = await readJson(recordPath);
        if (validateApprovedAssetPromotionRecord(existing).length === 0 && stableJson(existing) === stableJson(record)) return { status: "accepted", idempotent: true, relativeDirectory, files, errors: [] };
        return conflict(relativeDirectory, ["A different immutable approved asset promotion already exists for this tenant, package, and version."]);
      }
      throw new Error("Approved asset promotion record could not be committed.");
    }
    return { status: "accepted", idempotent: false, relativeDirectory, files, errors: [] };
  } catch {
    for (const path of createdFiles) await rm(path, { force: true }).catch(() => undefined);
    return blocked(["Approved asset promotion could not be committed inside the configured custody root."]);
  }
}

function validateInputBinding(input: ApprovedAssetPromotionWriteInput): string[] {
  const errors = [
    ...validateApprovedAssetPromotionRequest(input.request),
    ...validatePilotDeliveryManifest(input.manifest),
    ...validatePilotDeliveryReleaseReceipt(input.receipt),
  ];
  const request = input.request;
  const manifest = input.manifest;
  const receipt = input.receipt;
  const evidence = input.packageEvidenceReview;
  if (request.tenantId !== manifest.tenantId || request.packageId !== manifest.packageId || request.version !== manifest.version || request.manifestId !== manifest.manifestId) errors.push("Approved asset promotion request must match the delivery manifest identity.");
  if (request.receiptId !== receipt.receiptId || receipt.manifestId !== manifest.manifestId || receipt.tenantId !== manifest.tenantId || receipt.packageId !== manifest.packageId || receipt.version !== manifest.version) errors.push("Approved asset promotion request must match the release receipt identity.");
  if (receipt.releaseApproval !== "approved" || receipt.qrPrintAuthorization !== "approved" || manifest.deliveryAllowed !== true) errors.push("Approved asset promotion requires approved release, QR, and delivery gates.");
  if (evidence.status !== "reviewed-package-evidence" || evidence.tenantId !== request.tenantId || evidence.quarantineId !== request.quarantineId || evidence.packageId !== request.packageId) errors.push("Approved asset promotion requires matching reviewed package evidence.");
  if (manifest.sourceAssemblyChecksum.replace(/^sha256:/, "") !== evidence.sourceChecksumSha256) errors.push("Approved asset promotion evidence checksum must match the delivery manifest source checksum.");
  const evidenceIds = new Set(evidence.evidenceReferences.map((reference) => reference.referenceId));
  for (const entry of request.entries) if (!evidenceIds.has(entry.evidenceReferenceId)) errors.push(`Approved asset promotion evidence reference ${entry.evidenceReferenceId} is not present in the reviewed package evidence.`);
  return [...new Set(errors)];
}

async function readQuarantinedPayload(tenantId: string, quarantineId: string, entry: ApprovedAssetPromotionRecord["entries"][number], packageQuarantineId: string): Promise<{ ok: true; path: string } | { ok: false; errors: string[] }> {
  if (quarantineId !== packageQuarantineId) return { ok: false, errors: [`Asset ${entry.assetId} is not bound to the package quarantine record.`] };
  const root = resolve(process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT?.trim() || join(process.cwd(), "data", "quarantine", "uploads"));
  const directory = resolve(root, tenantId, quarantineId);
  let record: UploadQuarantineIntakeRecord;
  try { record = JSON.parse(await readFile(join(directory, "intake.json"), "utf8")) as UploadQuarantineIntakeRecord; }
  catch { return { ok: false, errors: ["The approved asset source quarantine record is unavailable."] }; }
  const recordErrors = validateUploadQuarantineIntakeRecord(record);
  if (recordErrors.length > 0 || record.tenantId !== tenantId || record.intakeId !== quarantineId) return { ok: false, errors: ["The approved asset source quarantine record failed identity or validation checks.", ...recordErrors] };
  if (record.mimeType !== entry.mimeType || record.checksumSha256 !== entry.checksumSha256 || record.channelId !== entry.channelId || record.unitKey !== entry.unitKey) return { ok: false, errors: [`Asset ${entry.assetId} does not match its quarantined source metadata.`] };
  const files = await readdir(directory, { withFileTypes: true });
  for (const candidate of files) {
    if (!candidate.isFile() || !candidate.name.startsWith("payload.")) continue;
    const path = resolve(directory, candidate.name);
    if (validateQuarantineFilesystemPath(path, root).length > 0) continue;
    const bytes = await readFile(path);
    const checksum = createHash("sha256").update(bytes).digest("hex");
    if (checksum === entry.checksumSha256) return { ok: true, path };
  }
  return { ok: false, errors: [`Asset ${entry.assetId} checksum does not match the quarantined payload.`] };
}

async function readExistingChecksum(path: string): Promise<string | null> {
  try { return createHash("sha256").update(await readFile(path)).digest("hex"); } catch { return null; }
}
async function readJson(path: string): Promise<unknown> { return JSON.parse(await readFile(path, "utf8")) as unknown; }
async function pathExists(path: string): Promise<boolean> { try { await stat(path); return true; } catch { return false; } }
function blocked(errors: string[]): ApprovedAssetPromotionWriteResult { return { status: "blocked", idempotent: false, relativeDirectory: null, files: [], errors: [...new Set(errors)] }; }
function conflict(relativeDirectory: string, errors: string[]): ApprovedAssetPromotionWriteResult { return { status: "conflict", idempotent: false, relativeDirectory, files: [], errors: [...new Set(errors)] }; }
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}
