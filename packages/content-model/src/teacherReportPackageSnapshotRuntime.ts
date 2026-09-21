import {
  type TeacherReportPackageSnapshot,
  type TeacherReportPackageSnapshotDeployment,
  validateTeacherReportPackageSnapshot,
} from "./teacherReportPackageSnapshot";

export type TeacherReportPackageSnapshotOperation = "validate" | "backup" | "restore";

export interface TeacherReportPackageSnapshotRecoveryPacket {
  recordVersion: 1;
  category: "teacher-report-package-snapshot-recovery-packet";
  packetId: string;
  storageMode: "provider-neutral";
  sourceSnapshotId: string;
  sourceDeploymentMode: TeacherReportPackageSnapshotDeployment;
  targetDeploymentMode: TeacherReportPackageSnapshotDeployment;
  snapshotFingerprint: string;
  snapshot: TeacherReportPackageSnapshot;
  createdAt: string;
  restoreAllowed: false;
  exportAllowed: false;
  writesAllowed: false;
  rawLearnerAudioIncluded: false;
  learnerTranscriptIncluded: false;
  realLearnerIdentifiersIncluded: false;
}

export interface TeacherReportPackageSnapshotAdapterRequest {
  snapshot: unknown;
  operation: TeacherReportPackageSnapshotOperation;
  expectedDeploymentMode?: TeacherReportPackageSnapshotDeployment;
  targetDeploymentMode?: TeacherReportPackageSnapshotDeployment;
  recoveryPacket?: unknown;
}

export interface TeacherReportPackageSnapshotAdapterDecision {
  allowed: false;
  reasonCode: string;
  reasons: string[];
  operation: TeacherReportPackageSnapshotOperation;
  sourceDeploymentMode: TeacherReportPackageSnapshotDeployment | "unknown";
  targetDeploymentMode: TeacherReportPackageSnapshotDeployment | "unknown";
}

export interface TeacherReportPackageSnapshotAdapterResult {
  request: TeacherReportPackageSnapshotAdapterRequest;
  decision: TeacherReportPackageSnapshotAdapterDecision;
  sideEffect: "none";
  snapshotValid: boolean;
  recoveryPacketValid: boolean;
}

export interface TeacherReportPackageSnapshotAdapter {
  readonly mode: "review-only";
  evaluate(request: TeacherReportPackageSnapshotAdapterRequest): TeacherReportPackageSnapshotAdapterDecision;
  execute(request: TeacherReportPackageSnapshotAdapterRequest): TeacherReportPackageSnapshotAdapterResult;
}

const REVIEW_ONLY_BLOCKED_ACTIONS = [
  "No snapshot provider activation",
  "No hosted database write",
  "No local classroom write",
  "No backup creation",
  "No restore execution",
  "No export archive creation",
] as const;

export function createTeacherReportPackageSnapshotRecoveryPacket(
  snapshot: TeacherReportPackageSnapshot,
  targetDeploymentMode: TeacherReportPackageSnapshotDeployment,
  createdAt: string,
): TeacherReportPackageSnapshotRecoveryPacket {
  const snapshotErrors = validateTeacherReportPackageSnapshot(snapshot);
  if (snapshotErrors.length > 0) throw new Error(snapshotErrors.join(" "));
  if (!isDeploymentMode(targetDeploymentMode)) throw new Error("Teacher report snapshot recovery target deployment mode is invalid.");
  if (Number.isNaN(Date.parse(createdAt))) throw new Error("Teacher report snapshot recovery createdAt must be a valid timestamp.");

  const packet: TeacherReportPackageSnapshotRecoveryPacket = {
    recordVersion: 1,
    category: "teacher-report-package-snapshot-recovery-packet",
    packetId: `teacher-report-package-snapshot-recovery-v1:${snapshot.snapshotId}:${targetDeploymentMode}`,
    storageMode: "provider-neutral",
    sourceSnapshotId: snapshot.snapshotId,
    sourceDeploymentMode: snapshot.deploymentMode,
    targetDeploymentMode,
    snapshotFingerprint: fingerprintTeacherReportPackageSnapshot(snapshot),
    snapshot,
    createdAt,
    restoreAllowed: false,
    exportAllowed: false,
    writesAllowed: false,
    rawLearnerAudioIncluded: false,
    learnerTranscriptIncluded: false,
    realLearnerIdentifiersIncluded: false,
  };
  const errors = validateTeacherReportPackageSnapshotRecoveryPacket(packet);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return packet;
}

export function validateTeacherReportPackageSnapshotRecoveryPacket(packet: unknown): string[] {
  const errors: string[] = [];
  if (!packet || typeof packet !== "object" || Array.isArray(packet)) return ["Teacher report snapshot recovery packet must be an object."];
  const candidate = packet as Partial<TeacherReportPackageSnapshotRecoveryPacket> & Record<string, unknown>;
  if (candidate.recordVersion !== 1) errors.push("Teacher report snapshot recovery packet recordVersion must be 1.");
  if (candidate.category !== "teacher-report-package-snapshot-recovery-packet") errors.push("Teacher report snapshot recovery packet category is invalid.");
  if (candidate.storageMode !== "provider-neutral") errors.push("Teacher report snapshot recovery packet storageMode must be provider-neutral.");
  if (!isDeploymentMode(candidate.sourceDeploymentMode)) errors.push("Teacher report snapshot recovery source deployment mode is invalid.");
  if (!isDeploymentMode(candidate.targetDeploymentMode)) errors.push("Teacher report snapshot recovery target deployment mode is invalid.");
  if (candidate.restoreAllowed !== false) errors.push("Teacher report snapshot recovery restoreAllowed must remain false.");
  if (candidate.exportAllowed !== false) errors.push("Teacher report snapshot recovery exportAllowed must remain false.");
  if (candidate.writesAllowed !== false) errors.push("Teacher report snapshot recovery writesAllowed must remain false.");
  if (candidate.rawLearnerAudioIncluded !== false) errors.push("Teacher report snapshot recovery must exclude raw learner audio.");
  if (candidate.learnerTranscriptIncluded !== false) errors.push("Teacher report snapshot recovery must exclude learner transcripts.");
  if (candidate.realLearnerIdentifiersIncluded !== false) errors.push("Teacher report snapshot recovery must exclude real learner identifiers.");
  for (const field of ["packetId", "sourceSnapshotId", "snapshotFingerprint", "createdAt"] as const) {
    if (typeof candidate[field] !== "string" || candidate[field].trim().length === 0) errors.push(`Teacher report snapshot recovery ${field} is required.`);
  }
  if (typeof candidate.createdAt === "string" && Number.isNaN(Date.parse(candidate.createdAt))) errors.push("Teacher report snapshot recovery createdAt must be a valid timestamp.");

  const snapshotErrors = validateTeacherReportPackageSnapshot(candidate.snapshot);
  errors.push(...snapshotErrors.map((error) => `Recovery packet snapshot: ${error}`));
  if (candidate.snapshot && typeof candidate.snapshot === "object" && !Array.isArray(candidate.snapshot)) {
    const snapshot = candidate.snapshot as TeacherReportPackageSnapshot;
    if (candidate.sourceSnapshotId !== snapshot.snapshotId) errors.push("Teacher report snapshot recovery sourceSnapshotId must match the snapshot.");
    if (candidate.sourceDeploymentMode !== snapshot.deploymentMode) errors.push("Teacher report snapshot recovery source deployment mode must match the snapshot.");
    if (typeof candidate.snapshotFingerprint === "string" && candidate.snapshotFingerprint !== fingerprintTeacherReportPackageSnapshot(snapshot)) {
      errors.push("Teacher report snapshot recovery fingerprint does not match the snapshot.");
    }
  }
  if ("records" in candidate || "events" in candidate || "eventEnvelopes" in candidate) errors.push("Teacher report snapshot recovery packet must not embed raw event records.");
  return [...new Set(errors)];
}

export function fingerprintTeacherReportPackageSnapshot(snapshot: TeacherReportPackageSnapshot): string {
  return `teacher-report-package-snapshot-fnv1a-v1:${fnv1a(canonicalize(snapshot))}`;
}

export function createReviewOnlyTeacherReportPackageSnapshotAdapter(): TeacherReportPackageSnapshotAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const snapshotErrors = validateTeacherReportPackageSnapshot(request.snapshot);
      const snapshot = isSnapshot(request.snapshot) ? request.snapshot : undefined;
      const sourceDeploymentMode = snapshot?.deploymentMode ?? "unknown";
      const targetDeploymentMode = request.targetDeploymentMode ?? sourceDeploymentMode;
      const reasons = [...snapshotErrors];
      if (request.expectedDeploymentMode && sourceDeploymentMode !== request.expectedDeploymentMode) reasons.push("Snapshot deployment mode does not match the expected deployment mode.");
      if (!isDeploymentMode(targetDeploymentMode)) reasons.push("Snapshot target deployment mode is invalid.");
      let recoveryPacketValid = true;
      if (request.operation !== "validate") {
        recoveryPacketValid = validateTeacherReportPackageSnapshotRecoveryPacket(request.recoveryPacket).length === 0;
        if (!recoveryPacketValid) reasons.push("Backup and restore rehearsal requires a valid recovery packet.");
      }
      reasons.push(...REVIEW_ONLY_BLOCKED_ACTIONS);
      return {
        allowed: false,
        reasonCode: snapshotErrors.length > 0 ? "invalid-teacher-report-snapshot" : "review-only-teacher-report-snapshot-adapter",
        reasons: [...new Set(reasons)],
        operation: request.operation,
        sourceDeploymentMode,
        targetDeploymentMode: isDeploymentMode(targetDeploymentMode) ? targetDeploymentMode : "unknown",
      };
    },
    execute(request) {
      const decision = this.evaluate(request);
      return {
        request,
        decision,
        sideEffect: "none",
        snapshotValid: validateTeacherReportPackageSnapshot(request.snapshot).length === 0,
        recoveryPacketValid: request.operation === "validate" || validateTeacherReportPackageSnapshotRecoveryPacket(request.recoveryPacket).length === 0,
      };
    },
  };
}

function isSnapshot(value: unknown): value is TeacherReportPackageSnapshot {
  return validateTeacherReportPackageSnapshot(value).length === 0;
}

function isDeploymentMode(value: unknown): value is TeacherReportPackageSnapshotDeployment {
  return value === "hosted-managed" || value === "local-classroom";
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${JSON.stringify(key)}:${canonicalize((value as Record<string, unknown>)[key])}`).join(",")}}`;
}

function fnv1a(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
