import { createHash, randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";
import {
  createUploadQuarantineIntakeRecord,
  type UploadQuarantineChannel,
  type UploadQuarantineIntakeRecord,
  createUploadQuarantineReviewSummary,
  type UploadQuarantineReviewSummary,
  validateUploadQuarantineIntakeRecord,
} from "@living-textbook/content-model";

const DEFAULT_QUARANTINE_ROOT = join(process.cwd(), "data", "quarantine", "uploads");

export type QuarantineUploadWrite = {
  tenantId: string;
  channelId: UploadQuarantineChannel;
  unitKey?: string;
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
};

export type QuarantineUploadWriteResult = {
  quarantineId: string;
  record: UploadQuarantineIntakeRecord;
};

export type QuarantineUploadReadResult = {
  records: UploadQuarantineReviewSummary[];
  errors: string[];
};

export async function writeQuarantineUpload(input: QuarantineUploadWrite): Promise<QuarantineUploadWriteResult> {
  const quarantineId = `q-${randomUUID()}`;
  const checksumSha256 = createHash("sha256").update(input.bytes).digest("hex");
  const record = createUploadQuarantineIntakeRecord({
    intakeId: quarantineId,
    tenantId: input.tenantId,
    channelId: input.channelId,
    unitKey: input.unitKey,
    fileName: basename(input.fileName).slice(0, 240),
    mimeType: input.mimeType,
    sizeBytes: input.bytes.byteLength,
    checksumSha256,
  });

  const root = getQuarantineRoot();
  const tenantDirectory = resolve(root, input.tenantId);
  const recordDirectory = resolve(tenantDirectory, quarantineId);
  assertInside(root, tenantDirectory);
  assertInside(root, recordDirectory);
  await mkdir(recordDirectory, { recursive: true });

  const filePath = resolve(recordDirectory, `payload${extensionForMimeType(input.mimeType)}`);
  const metadataPath = resolve(recordDirectory, "intake.json");
  assertInside(recordDirectory, filePath);
  assertInside(recordDirectory, metadataPath);
  await writeFile(filePath, input.bytes, { flag: "wx" });
  await writeFile(metadataPath, `${JSON.stringify({ ...record, quarantineId }, null, 2)}\n`, { encoding: "utf8", flag: "wx" });

  return { quarantineId, record };
}

export function getQuarantineRoot(): string {
  const configured = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT?.trim();
  return resolve(configured || DEFAULT_QUARANTINE_ROOT);
}

export async function readQuarantineUploadRecords(tenantId: string, quarantineId?: string): Promise<QuarantineUploadReadResult> {
  if (quarantineId && !safeRecordDirectory(quarantineId)) {
    return { records: [], errors: ["The quarantine identity is not a safe record identifier and was withheld."] };
  }
  const tenantDirectory = resolve(getQuarantineRoot(), tenantId);
  const candidateDirectories = quarantineId
    ? [resolve(tenantDirectory, quarantineId)]
    : await readChildDirectories(tenantDirectory);
  const records: UploadQuarantineReviewSummary[] = [];
  const errors: string[] = [];

  for (const recordDirectory of candidateDirectories) {
    try {
      assertInside(tenantDirectory, recordDirectory);
      const metadataPath = resolve(recordDirectory, "intake.json");
      assertInside(recordDirectory, metadataPath);
      const metadata = JSON.parse(await readFile(metadataPath, "utf8")) as unknown;
      const validationErrors = validateUploadQuarantineIntakeRecord(metadata);
      if (validationErrors.length > 0) {
        errors.push("A quarantine intake record failed validation and was withheld.");
        continue;
      }
      const record = metadata as UploadQuarantineIntakeRecord;
      if (record.tenantId !== tenantId || (quarantineId && record.intakeId !== quarantineId)) {
        errors.push("A quarantine intake record failed tenant or identity binding and was withheld.");
        continue;
      }
      const payloadPresent = await hasPayloadFile(recordDirectory);
      records.push(createUploadQuarantineReviewSummary(record, payloadPresent));
    } catch {
      errors.push("A quarantine intake record could not be read and was withheld.");
    }
  }

  return { records, errors };
}

async function readChildDirectories(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory() && safeRecordDirectory(entry.name)).map((entry) => resolve(directory, entry.name));
  } catch {
    return [];
  }
}

async function hasPayloadFile(recordDirectory: string): Promise<boolean> {
  try {
    const entries = await readdir(recordDirectory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || entry.name === "intake.json" || !entry.name.startsWith("payload.")) continue;
      const file = resolve(recordDirectory, entry.name);
      const fileStat = await stat(file);
      return fileStat.isFile() && fileStat.size > 0;
    }
  } catch {
    return false;
  }
  return false;
}

function safeRecordDirectory(value: string): boolean {
  return /^q-[0-9a-f-]{36}$/.test(value);
}

function extensionForMimeType(mimeType: string): string {
  const extensionByMimeType: Record<string, string> = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "text/plain": ".txt",
    "text/markdown": ".md",
    "text/csv": ".csv",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/mp4": ".m4a",
    "audio/ogg": ".ogg",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
  };
  return extensionByMimeType[mimeType] ?? ".bin";
}

function assertInside(parent: string, child: string): void {
  const relativePath = relative(resolve(parent), resolve(child));
  if (relativePath.startsWith("..") || relativePath.includes(".." + "/") || relativePath.includes(".." + "\\") || resolve(parent) === resolve(child)) {
    throw new Error("Quarantine path escaped its configured boundary.");
  }
}
