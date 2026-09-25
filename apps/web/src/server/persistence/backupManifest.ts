export interface DurableProgressionBackupManifest {
  manifestVersion: 1;
  artifactKind: "sqlite-progression-backup";
  provider: "sqlite";
  schemaVersion: number;
  bytes: number;
  sha256: string;
  createdAt: string;
  retentionDays: number;
  rawLearnerAudioExcluded: true;
  learnerTranscriptsExcluded: true;
}

export interface DurableProgressionBackupManifestExpectations {
  bytes?: number;
  sha256?: string;
  schemaVersion?: number;
}

export interface DurableProgressionBackupArtifact {
  bytes: number;
  sha256: string;
  schemaVersion: number;
}

export function createDurableProgressionBackupManifest(
  artifact: DurableProgressionBackupArtifact,
  retentionDays: number,
  createdAt = new Date().toISOString(),
): DurableProgressionBackupManifest {
  const manifest: DurableProgressionBackupManifest = {
    manifestVersion: 1,
    artifactKind: "sqlite-progression-backup",
    provider: "sqlite",
    schemaVersion: artifact.schemaVersion as 1,
    bytes: artifact.bytes,
    sha256: artifact.sha256,
    createdAt,
    retentionDays,
    rawLearnerAudioExcluded: true,
    learnerTranscriptsExcluded: true,
  };
  const errors = validateDurableProgressionBackupManifest(manifest, {
    bytes: artifact.bytes,
    sha256: artifact.sha256,
    schemaVersion: artifact.schemaVersion,
  });
  if (errors.length > 0) throw new Error(errors.join(" "));
  return manifest;
}

export function validateDurableProgressionBackupManifest(
  value: unknown,
  expectations: DurableProgressionBackupManifestExpectations = {},
): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Backup manifest must be an object."];

  if (value.manifestVersion !== 1) errors.push("Backup manifest manifestVersion must be 1.");
  if (value.artifactKind !== "sqlite-progression-backup") errors.push("Backup manifest artifactKind must be sqlite-progression-backup.");
  if (value.provider !== "sqlite") errors.push("Backup manifest provider must be sqlite.");
  if (!Number.isInteger(value.schemaVersion) || value.schemaVersion !== 1) errors.push("Backup manifest schemaVersion must be the supported SQLite schema version 1.");
  if (typeof value.bytes !== "number" || !Number.isInteger(value.bytes) || value.bytes <= 0) errors.push("Backup manifest bytes must be a positive integer.");
  if (typeof value.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(value.sha256)) errors.push("Backup manifest sha256 must be a lowercase 64-character SHA-256 digest.");
  if (typeof value.createdAt !== "string" || value.createdAt.trim().length === 0 || Number.isNaN(Date.parse(value.createdAt))) errors.push("Backup manifest createdAt must be a valid timestamp.");
  if (typeof value.retentionDays !== "number" || !Number.isInteger(value.retentionDays) || value.retentionDays <= 0) errors.push("Backup manifest retentionDays must be a positive integer.");
  if (value.rawLearnerAudioExcluded !== true || value.learnerTranscriptsExcluded !== true) errors.push("Backup manifest must exclude raw learner audio and learner transcripts.");

  if (expectations.bytes !== undefined && value.bytes !== expectations.bytes) errors.push("Backup manifest bytes do not match the source artifact.");
  if (expectations.sha256 !== undefined && value.sha256 !== expectations.sha256) errors.push("Backup manifest sha256 does not match the source artifact.");
  if (expectations.schemaVersion !== undefined && value.schemaVersion !== expectations.schemaVersion) errors.push("Backup manifest schemaVersion does not match the source artifact.");

  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
