import { createHash, randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";
import {
  createUploadQuarantineIntakeRecord,
  type UploadQuarantineChannel,
  type UploadQuarantineIntakeRecord,
  createUploadQuarantineReviewSummary,
  type UploadQuarantineReviewSummary,
  isUploadQuarantineSafeTenantId,
  validateUploadQuarantineIntakeRecord,
  createUploadQuarantineReviewDecisionRecord,
  validateUploadQuarantineReviewDecisionRecord,
  type UploadQuarantineReviewDecisionRecord,
} from "@living-textbook/content-model";
import { validateQuarantineFilesystemPath } from "./quarantinePathPolicy";

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

export type QuarantineReviewDecisionWrite = Omit<UploadQuarantineReviewDecisionRecord, "recordVersion" | "storageMode" | "approvalCaptured" | "evidenceAttachmentWriteAllowed" | "packageAssemblyAllowed" | "promotionAllowed" | "studentFacingUseAllowed" | "mode" | "sideEffect">;

export type QuarantineReviewDecisionWriteResult = {
  status: "accepted" | "conflict" | "blocked";
  idempotent: boolean;
  record?: UploadQuarantineReviewDecisionRecord;
  errors: string[];
};

export type QuarantineReviewDecisionReadResult = {
  record: UploadQuarantineReviewDecisionRecord | null;
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
    fileName: basename(input.fileName.replaceAll("\\", "/")).slice(0, 240),
    mimeType: input.mimeType,
    sizeBytes: input.bytes.byteLength,
    checksumSha256,
  });

  const root = getQuarantineRoot();
  const tenantDirectory = resolve(root, input.tenantId);
  const recordDirectory = resolve(tenantDirectory, quarantineId);
  assertInside(root, tenantDirectory);
  assertInside(root, recordDirectory);
  await mkdir(root, { recursive: true });
  assertQuarantineFilesystemPath(tenantDirectory, root);
  await mkdir(recordDirectory, { recursive: true });
  assertQuarantineFilesystemPath(recordDirectory, root);

  const filePath = resolve(recordDirectory, `payload${extensionForMimeType(input.mimeType)}`);
  const metadataPath = resolve(recordDirectory, "intake.json");
  assertInside(recordDirectory, filePath);
  assertInside(recordDirectory, metadataPath);
  assertQuarantineFilesystemPath(filePath, root);
  assertQuarantineFilesystemPath(metadataPath, root);
  await writeFile(filePath, input.bytes, { flag: "wx" });
  await writeFile(metadataPath, `${JSON.stringify({ ...record, quarantineId }, null, 2)}\n`, { encoding: "utf8", flag: "wx" });

  return { quarantineId, record };
}

export function getQuarantineRoot(): string {
  const configured = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT?.trim();
  return resolve(configured || DEFAULT_QUARANTINE_ROOT);
}

export async function readQuarantineUploadRecords(tenantId: string, quarantineId?: string): Promise<QuarantineUploadReadResult> {
  if (!isUploadQuarantineSafeTenantId(tenantId)) {
    return { records: [], errors: ["The tenant identity is not a safe quarantine boundary and was withheld."] };
  }
  if (quarantineId && !safeRecordDirectory(quarantineId)) {
    return { records: [], errors: ["The quarantine identity is not a safe record identifier and was withheld."] };
  }
  const quarantineRoot = getQuarantineRoot();
  const tenantDirectory = resolve(quarantineRoot, tenantId);
  try {
    assertQuarantineFilesystemPath(tenantDirectory, quarantineRoot);
  } catch {
    return { records: [], errors: ["The upload quarantine filesystem boundary could not be verified and was withheld."] };
  }
  const candidateDirectories = quarantineId
    ? [resolve(tenantDirectory, quarantineId)]
    : await readChildDirectories(tenantDirectory);
  const records: UploadQuarantineReviewSummary[] = [];
  const errors: string[] = [];

  for (const recordDirectory of candidateDirectories) {
    try {
      assertInside(tenantDirectory, recordDirectory);
      assertQuarantineFilesystemPath(recordDirectory, quarantineRoot);
      const metadataPath = resolve(recordDirectory, "intake.json");
      assertInside(recordDirectory, metadataPath);
      assertQuarantineFilesystemPath(metadataPath, quarantineRoot);
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
      const payloadPresent = await hasPayloadFile(recordDirectory, quarantineRoot);
      records.push(createUploadQuarantineReviewSummary(record, payloadPresent));
    } catch {
      errors.push("A quarantine intake record could not be read and was withheld.");
    }
  }

  return { records, errors };
}

export async function readQuarantineReviewDecision(tenantId: string, quarantineId: string): Promise<QuarantineReviewDecisionReadResult> {
  if (!isUploadQuarantineSafeTenantId(tenantId) || !safeRecordDirectory(quarantineId)) {
    return { record: null, errors: ["The review decision identity did not pass tenant and quarantine boundary checks."] };
  }
  const root = getQuarantineRoot();
  const tenantDirectory = resolve(root, tenantId);
  const recordDirectory = resolve(tenantDirectory, quarantineId);
  const decisionPath = resolve(recordDirectory, "review-decision.json");
  try {
    assertQuarantineFilesystemPath(recordDirectory, root);
    assertInside(recordDirectory, decisionPath);
    assertQuarantineFilesystemPath(decisionPath, root);
    const value = JSON.parse(await readFile(decisionPath, "utf8")) as unknown;
    const errors = validateUploadQuarantineReviewDecisionRecord(value);
    if (errors.length > 0) return { record: null, errors: ["A stored review decision failed validation and was withheld."] };
    const record = value as UploadQuarantineReviewDecisionRecord;
    if (record.tenantId !== tenantId || record.quarantineId !== quarantineId) return { record: null, errors: ["A stored review decision failed tenant or identity binding and was withheld."] };
    return { record, errors: [] };
  } catch {
    return { record: null, errors: [] };
  }
}

export async function writeQuarantineReviewDecision(input: QuarantineReviewDecisionWrite): Promise<QuarantineReviewDecisionWriteResult> {
  if (process.env.LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED !== "true") {
    return { status: "blocked", idempotent: false, errors: ["Review decision writes are disabled. Enable the explicit local review-decision gate before recording a teacher decision."] };
  }
  const summaries = await readQuarantineUploadRecords(input.tenantId, input.quarantineId);
  const summary = summaries.records[0];
  if (!summary || summary.quarantineId !== input.quarantineId) return { status: "blocked", idempotent: false, errors: ["The quarantine record was not available for review decision capture."] };
  const record = createUploadQuarantineReviewDecisionRecord({
    ...input,
    unitKey: summary.record.unitKey,
  });
  const root = getQuarantineRoot();
  const tenantDirectory = resolve(root, input.tenantId);
  const recordDirectory = resolve(tenantDirectory, input.quarantineId);
  const decisionPath = resolve(recordDirectory, "review-decision.json");
  assertQuarantineFilesystemPath(recordDirectory, root);
  assertInside(recordDirectory, decisionPath);
  assertQuarantineFilesystemPath(decisionPath, root);
  try {
    await writeFile(decisionPath, `${JSON.stringify(record, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    return { status: "accepted", idempotent: false, record, errors: [] };
  } catch {
    const existing = await readQuarantineReviewDecision(input.tenantId, input.quarantineId);
    if (existing.record && stableJson(existing.record) === stableJson(record)) return { status: "accepted", idempotent: true, record: existing.record, errors: [] };
    return { status: "conflict", idempotent: false, errors: ["A different immutable review decision is already bound to this quarantine record."] };
  }
}

async function readChildDirectories(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory() && safeRecordDirectory(entry.name)).map((entry) => resolve(directory, entry.name));
  } catch {
    return [];
  }
}

async function hasPayloadFile(recordDirectory: string, quarantineRoot: string): Promise<boolean> {
  try {
    const entries = await readdir(recordDirectory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || entry.name === "intake.json" || !entry.name.startsWith("payload.")) continue;
      const file = resolve(recordDirectory, entry.name);
      if (validateQuarantineFilesystemPath(file, quarantineRoot).length > 0) continue;
      const fileStat = await stat(file);
      return fileStat.isFile() && fileStat.size > 0;
    }
  } catch {
    return false;
  }
  return false;
}

function assertQuarantineFilesystemPath(candidatePath: string, quarantineRoot: string): void {
  const errors = validateQuarantineFilesystemPath(candidatePath, quarantineRoot);
  if (errors.length > 0) throw new Error(errors.join(" "));
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

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}
