export type AiPrototypeReturnedPackageStatus = "not-returned" | "review-only" | "blocked";

export type AiPrototypeReturnedArtifactKind =
  | "source-archive"
  | "fixture"
  | "readme"
  | "event-replay"
  | "audio-coverage"
  | "scoring-replay"
  | "mobile-evidence"
  | "wrapper-notes";

export type AiPrototypeReturnedArtifactStatus = "missing" | "present" | "reviewed";

export interface AiPrototypeReturnedArtifact {
  artifactId: string;
  kind: AiPrototypeReturnedArtifactKind;
  relativePath: string;
  checksum: string;
  status: AiPrototypeReturnedArtifactStatus;
}

export interface AiPrototypeReturnedPackageManifest {
  manifestId: string;
  tenantId: string;
  requestId: string;
  queueItemId: string;
  status: AiPrototypeReturnedPackageStatus;
  sourceRepository: string;
  sourceSnapshotId: string;
  prototypeFolder: string;
  targetMode: string;
  parentEngine: string;
  artifacts: AiPrototypeReturnedArtifact[];
  blockedActions: string[];
}

export const AI_PROTOTYPE_RETURNED_PACKAGE_REPOSITORY = "Drewsure/ministar-lab";

export const AI_PROTOTYPE_RETURNED_REQUIRED_ARTIFACT_KINDS = [
  "source-archive",
  "fixture",
  "readme",
  "event-replay",
  "audio-coverage",
  "scoring-replay",
  "mobile-evidence",
  "wrapper-notes",
] as const satisfies readonly AiPrototypeReturnedArtifactKind[];

export const AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS = [
  "No archive import",
  "No direct file copy into apps/web",
  "No direct file copy into apps/ai-service",
  "No active route replacement",
  "No scoring mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No student assignment",
] as const;

export function validateAiPrototypeReturnedPackageManifest(manifest: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(manifest)) {
    return ["AI prototype returned package manifest must be a JSON object."];
  }

  const manifestId = readString(manifest, "manifestId");
  const tenantId = readString(manifest, "tenantId");
  const requestId = readString(manifest, "requestId");
  const queueItemId = readString(manifest, "queueItemId");
  const status = readString(manifest, "status");
  const sourceRepository = readString(manifest, "sourceRepository");
  const sourceSnapshotId = readString(manifest, "sourceSnapshotId");
  const prototypeFolder = readString(manifest, "prototypeFolder");
  const artifacts = readArtifacts(manifest);
  const blockedActions = readStringArray(manifest, "blockedActions");

  if (!manifestId || !tenantId || !requestId || !queueItemId) {
    errors.push("AI prototype returned package manifest must include manifestId, tenantId, requestId, and queueItemId.");
  }
  if (!["not-returned", "review-only", "blocked"].includes(status)) {
    errors.push("AI prototype returned package manifest must use a supported review-only status.");
  }
  if (sourceRepository !== AI_PROTOTYPE_RETURNED_PACKAGE_REPOSITORY) {
    errors.push(
      "AI prototype returned package manifest must use approved repository " +
        AI_PROTOTYPE_RETURNED_PACKAGE_REPOSITORY +
        ".",
    );
  }
  if (sourceRepository.includes("apps/web") || sourceRepository.includes("apps/ai-service")) {
    errors.push("AI prototype returned package manifest cannot identify an app repository as its source.");
  }
  if (status !== "not-returned" && (!sourceSnapshotId || !prototypeFolder)) {
    errors.push("Returned prototype packages must include an exact source snapshot and prototype folder.");
  }
  if (sourceSnapshotId.includes("latest") || sourceSnapshotId.includes("main")) {
    errors.push("Returned prototype package sourceSnapshotId must be immutable and cannot use latest or main.");
  }
  if (prototypeFolder.startsWith("/") || prototypeFolder.includes("..") || prototypeFolder.includes("\\")) {
    errors.push("Returned prototype package prototypeFolder must be a repository-relative safe path.");
  }

  const seenArtifactIds = new Set<string>();
  const seenKinds = new Set<string>();
  for (const artifact of artifacts) {
    if (seenArtifactIds.has(artifact.artifactId)) {
      errors.push("Returned prototype package must not repeat artifact " + artifact.artifactId + ".");
    }
    seenArtifactIds.add(artifact.artifactId);
    if (seenKinds.has(artifact.kind)) {
      errors.push("Returned prototype package must not repeat artifact kind " + artifact.kind + ".");
    }
    seenKinds.add(artifact.kind);
    if (!artifact.relativePath || artifact.relativePath.startsWith("/") || artifact.relativePath.includes("..")) {
      errors.push("Returned prototype artifact " + artifact.artifactId + " must use a safe relative path.");
    }
    if (artifact.relativePath.includes("apps/web") || artifact.relativePath.includes("apps/ai-service")) {
      errors.push("Returned prototype artifact " + artifact.artifactId + " cannot point into an app directory.");
    }
    if (artifact.status !== "missing" && !artifact.checksum) {
      errors.push("Returned prototype artifact " + artifact.artifactId + " must include a checksum before review.");
    }
  }

  if (status !== "not-returned") {
    for (const kind of AI_PROTOTYPE_RETURNED_REQUIRED_ARTIFACT_KINDS) {
      const artifact = artifacts.find((candidate) => candidate.kind === kind);
      if (!artifact || artifact.status === "missing") {
        errors.push("Returned prototype package must include reviewed evidence for " + kind + ".");
      }
    }
  }

  for (const action of AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) {
      errors.push("Returned prototype package must preserve blocked action: " + action + ".");
    }
  }

  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string): string {
  return typeof record[key] === "string" ? record[key].trim() : "";
}

function readStringArray(record: Record<string, unknown>, key: string): string[] {
  return Array.isArray(record[key]) ? record[key].filter((value): value is string => typeof value === "string") : [];
}

function readArtifacts(record: Record<string, unknown>): AiPrototypeReturnedArtifact[] {
  if (!Array.isArray(record.artifacts)) {
    return [];
  }

  return record.artifacts.flatMap((value) => {
    if (!isRecord(value)) {
      return [];
    }
    const kind = readString(value, "kind");
    if (!AI_PROTOTYPE_RETURNED_REQUIRED_ARTIFACT_KINDS.includes(kind as AiPrototypeReturnedArtifactKind)) {
      return [];
    }
    return [
      {
        artifactId: readString(value, "artifactId"),
        kind: kind as AiPrototypeReturnedArtifactKind,
        relativePath: readString(value, "relativePath"),
        checksum: readString(value, "checksum"),
        status: readString(value, "status") as AiPrototypeReturnedArtifactStatus,
      },
    ];
  });
}
