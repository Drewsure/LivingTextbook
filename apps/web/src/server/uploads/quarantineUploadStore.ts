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
  createUploadQuarantineEvidenceReviewRecord,
  validateUploadQuarantineEvidenceReviewRecord,
  type UploadQuarantineEvidenceReviewRecord,
  createUploadQuarantineDeliveryModeDecision,
  validateUploadQuarantineDeliveryModeDecision,
  type UploadQuarantineDeliveryMode,
  type UploadQuarantineDeliveryModeDecision,
  type UploadQuarantinePackageReviewPacket,
  validateUploadQuarantinePackageReviewPacket,
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

export type QuarantineEvidenceReviewWrite = Omit<UploadQuarantineEvidenceReviewRecord, "recordVersion" | "reviewId" | "tenantId" | "quarantineId" | "storageMode" | "packageAssemblyAllowed" | "promotionAllowed" | "studentFacingUseAllowed" | "mode" | "sideEffect" | "status" | "unresolvedBlockers"> & {
  tenantId: string;
  quarantineId: string;
  sourceId: string;
  packageId: string;
};

export type QuarantineEvidenceReviewWriteResult = {
  status: "accepted" | "conflict" | "blocked";
  idempotent: boolean;
  record?: UploadQuarantineEvidenceReviewRecord;
  errors: string[];
};

export type QuarantineEvidenceReviewReadResult = {
  record: UploadQuarantineEvidenceReviewRecord | null;
  errors: string[];
};

export type QuarantineDeliveryModeDecisionWrite = Omit<UploadQuarantineDeliveryModeDecision, "recordVersion" | "decisionId" | "tenantId" | "quarantineId" | "sourceChecksumSha256" | "hostedPersistenceDecisionPacketId" | "policyAccepted" | "providerSelected" | "persistenceActivationAllowed" | "packageAssemblyAllowed" | "qrPrintAllowed" | "studentFacingUseAllowed" | "status" | "blockers" | "nextSteps" | "mode" | "sideEffect"> & {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  selectedMode: UploadQuarantineDeliveryMode;
};

export type QuarantineDeliveryModeDecisionWriteResult = {
  status: "accepted" | "conflict" | "blocked";
  idempotent: boolean;
  record?: UploadQuarantineDeliveryModeDecision;
  errors: string[];
};

export type QuarantineDeliveryModeDecisionReadResult = {
  record: UploadQuarantineDeliveryModeDecision | null;
  errors: string[];
};

export type QuarantinePackageReviewPacketWrite = UploadQuarantinePackageReviewPacket;

export type QuarantinePackageReviewPacketWriteResult = {
  status: "accepted" | "conflict" | "blocked";
  idempotent: boolean;
  record?: UploadQuarantinePackageReviewPacket;
  errors: string[];
};

export type QuarantinePackageReviewPacketReadResult = {
  record: UploadQuarantinePackageReviewPacket | null;
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

export async function readQuarantineEvidenceReview(tenantId: string, quarantineId: string): Promise<QuarantineEvidenceReviewReadResult> {
  if (!isUploadQuarantineSafeTenantId(tenantId) || !safeRecordDirectory(quarantineId)) {
    return { record: null, errors: ["The evidence review identity did not pass tenant and quarantine boundary checks."] };
  }
  const root = getQuarantineRoot();
  const recordDirectory = resolve(root, tenantId, quarantineId);
  const evidencePath = resolve(recordDirectory, "evidence-review.json");
  try {
    assertQuarantineFilesystemPath(recordDirectory, root);
    assertInside(recordDirectory, evidencePath);
    assertQuarantineFilesystemPath(evidencePath, root);
    const value = JSON.parse(await readFile(evidencePath, "utf8")) as unknown;
    const errors = validateUploadQuarantineEvidenceReviewRecord(value);
    if (errors.length > 0) return { record: null, errors: ["A stored evidence review failed validation and was withheld."] };
    const record = value as UploadQuarantineEvidenceReviewRecord;
    if (record.tenantId !== tenantId || record.quarantineId !== quarantineId) return { record: null, errors: ["A stored evidence review failed tenant or identity binding and was withheld."] };
    return { record, errors: [] };
  } catch {
    return { record: null, errors: [] };
  }
}

export async function readQuarantineDeliveryModeDecision(tenantId: string, quarantineId: string): Promise<QuarantineDeliveryModeDecisionReadResult> {
  if (!isUploadQuarantineSafeTenantId(tenantId) || !safeRecordDirectory(quarantineId)) return { record: null, errors: ["The delivery mode decision identity did not pass tenant and quarantine boundary checks."] };
  const root = getQuarantineRoot();
  const recordDirectory = resolve(root, tenantId, quarantineId);
  const decisionPath = resolve(recordDirectory, "delivery-mode-decision.json");
  try {
    assertQuarantineFilesystemPath(recordDirectory, root);
    assertInside(recordDirectory, decisionPath);
    assertQuarantineFilesystemPath(decisionPath, root);
    const value = JSON.parse(await readFile(decisionPath, "utf8")) as unknown;
    const errors = validateUploadQuarantineDeliveryModeDecision(value);
    if (errors.length > 0) return { record: null, errors: ["A stored delivery mode decision failed validation and was withheld."] };
    const record = value as UploadQuarantineDeliveryModeDecision;
    if (record.tenantId !== tenantId || record.quarantineId !== quarantineId) return { record: null, errors: ["A stored delivery mode decision failed tenant or identity binding and was withheld."] };
    return { record, errors: [] };
  } catch {
    return { record: null, errors: [] };
  }
}

export async function writeQuarantineDeliveryModeDecision(input: QuarantineDeliveryModeDecisionWrite): Promise<QuarantineDeliveryModeDecisionWriteResult> {
  if (process.env.LIVING_TEXTBOOOK_DELIVERY_MODE_DECISIONS_ENABLED !== "true") return { status: "blocked", idempotent: false, errors: ["Delivery mode decision writes are disabled. Enable the explicit local delivery-mode decision gate before recording a review-only selection."] };
  const summaries = await readQuarantineUploadRecords(input.tenantId, input.quarantineId);
  const summary = summaries.records[0];
  if (!summary || summary.quarantineId !== input.quarantineId) return { status: "blocked", idempotent: false, errors: ["The quarantine record was not available for delivery mode decision capture."] };
  const record = createUploadQuarantineDeliveryModeDecision({ ...input, sourceChecksumSha256: summary.record.checksumSha256 });
  const root = getQuarantineRoot();
  const recordDirectory = resolve(root, input.tenantId, input.quarantineId);
  const decisionPath = resolve(recordDirectory, "delivery-mode-decision.json");
  try {
    assertQuarantineFilesystemPath(recordDirectory, root);
    assertInside(recordDirectory, decisionPath);
    assertQuarantineFilesystemPath(decisionPath, root);
    const existing = await readQuarantineDeliveryModeDecision(input.tenantId, input.quarantineId);
    if (existing.record) return stableJson(existing.record) === stableJson(record) ? { status: "accepted", idempotent: true, record: existing.record, errors: existing.errors } : { status: "conflict", idempotent: false, errors: ["A different delivery mode decision already exists for this quarantine record."] };
    await writeFile(decisionPath, `${JSON.stringify(record, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    return { status: "accepted", idempotent: false, record, errors: [] };
  } catch {
    return { status: "blocked", idempotent: false, errors: ["Delivery mode decision metadata could not be written inside the quarantine custody boundary."] };
  }
}

export async function writeQuarantineEvidenceReview(input: QuarantineEvidenceReviewWrite): Promise<QuarantineEvidenceReviewWriteResult> {
  if (process.env.LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED !== "true") return { status: "blocked", idempotent: false, errors: ["Evidence review writes are disabled. Enable the explicit local evidence-review gate before recording adjudication metadata."] };
  const summaries = await readQuarantineUploadRecords(input.tenantId, input.quarantineId);
  const summary = summaries.records[0];
  if (!summary || summary.quarantineId !== input.quarantineId) return { status: "blocked", idempotent: false, errors: ["The quarantine record was not available for evidence review capture."] };
  const record = createUploadQuarantineEvidenceReviewRecord({ intake: summary.record, ...input });
  const root = getQuarantineRoot();
  const recordDirectory = resolve(root, input.tenantId, input.quarantineId);
  const evidencePath = resolve(recordDirectory, "evidence-review.json");
  try {
    assertQuarantineFilesystemPath(recordDirectory, root);
    assertInside(recordDirectory, evidencePath);
    assertQuarantineFilesystemPath(evidencePath, root);
    const existing = await readQuarantineEvidenceReview(input.tenantId, input.quarantineId);
    if (existing.record) return stableJson(existing.record) === stableJson(record) ? { status: "accepted", idempotent: true, record: existing.record, errors: existing.errors } : { status: "conflict", idempotent: false, errors: ["A different evidence review already exists for this quarantine record."] };
    await writeFile(evidencePath, `${JSON.stringify(record, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    return { status: "accepted", idempotent: false, record, errors: [] };
  } catch {
    return { status: "blocked", idempotent: false, errors: ["Evidence review metadata could not be written inside the quarantine custody boundary."] };
  }
}

export async function readQuarantinePackageReviewPacket(tenantId: string, quarantineId: string): Promise<QuarantinePackageReviewPacketReadResult> {
  if (!isUploadQuarantineSafeTenantId(tenantId) || !safeRecordDirectory(quarantineId)) {
    return { record: null, errors: ["The package review packet identity did not pass tenant and quarantine boundary checks."] };
  }
  const root = getQuarantineRoot();
  const tenantDirectory = resolve(root, tenantId);
  const recordDirectory = resolve(tenantDirectory, quarantineId);
  const packetPath = resolve(recordDirectory, "package-review-packet.json");
  try {
    assertQuarantineFilesystemPath(recordDirectory, root);
    assertInside(recordDirectory, packetPath);
    assertQuarantineFilesystemPath(packetPath, root);
    const value = JSON.parse(await readFile(packetPath, "utf8")) as unknown;
    const errors = validateUploadQuarantinePackageReviewPacket(value);
    if (errors.length > 0) return { record: null, errors: ["A stored package review packet failed validation and was withheld."] };
    const record = value as UploadQuarantinePackageReviewPacket;
    if (record.tenantId !== tenantId || record.quarantineId !== quarantineId) return { record: null, errors: ["A stored package review packet failed tenant or identity binding and was withheld."] };
    return { record, errors: [] };
  } catch {
    return { record: null, errors: [] };
  }
}

export async function writeQuarantinePackageReviewPacket(input: QuarantinePackageReviewPacketWrite): Promise<QuarantinePackageReviewPacketWriteResult> {
  if (process.env.LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED !== "true") {
    return { status: "blocked", idempotent: false, errors: ["Package review packet writes are disabled. Enable the explicit local packet gate before recording a review packet."] };
  }
  const summaries = await readQuarantineUploadRecords(input.tenantId, input.quarantineId);
  const summary = summaries.records[0];
  if (!summary || summary.quarantineId !== input.quarantineId) return { status: "blocked", idempotent: false, errors: ["The quarantine record was not available for package review packet capture."] };
  if (summary.record.checksumSha256 !== input.checksumSha256) return { status: "blocked", idempotent: false, errors: ["The package review packet checksum does not match the quarantined intake record."] };
  const validationErrors = validateUploadQuarantinePackageReviewPacket(input);
  if (validationErrors.length > 0) return { status: "blocked", idempotent: false, errors: validationErrors };
  const root = getQuarantineRoot();
  const tenantDirectory = resolve(root, input.tenantId);
  const recordDirectory = resolve(tenantDirectory, input.quarantineId);
  const packetPath = resolve(recordDirectory, "package-review-packet.json");
  assertQuarantineFilesystemPath(recordDirectory, root);
  assertInside(recordDirectory, packetPath);
  assertQuarantineFilesystemPath(packetPath, root);
  try {
    await writeFile(packetPath, `${JSON.stringify(input, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    return { status: "accepted", idempotent: false, record: input, errors: [] };
  } catch {
    const existing = await readQuarantinePackageReviewPacket(input.tenantId, input.quarantineId);
    if (existing.record && stableJson(existing.record) === stableJson(input)) return { status: "accepted", idempotent: true, record: existing.record, errors: [] };
    return { status: "conflict", idempotent: false, errors: ["A different immutable package review packet is already bound to this quarantine record."] };
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
