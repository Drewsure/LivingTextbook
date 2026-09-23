import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";
import {
  createUploadQuarantineIntakeRecord,
  type UploadQuarantineChannel,
  type UploadQuarantineIntakeRecord,
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
