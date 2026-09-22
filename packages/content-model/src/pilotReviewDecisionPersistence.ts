import type { PilotReviewDecision } from "./pilotReviewDecision";
import { validatePilotReviewDecision } from "./pilotReviewDecision";

export type PilotReviewDecisionPersistenceMode = "hosted-managed" | "local-classroom";
export type PilotReviewDecisionPersistenceOperation = "validate" | "write" | "restore" | "export";

export interface PilotReviewDecisionPersistenceSnapshot {
  recordVersion: 1;
  category: "pilot-review-decision-snapshot";
  snapshotId: string;
  storageMode: "provider-neutral";
  persistenceMode: PilotReviewDecisionPersistenceMode;
  decisionId: string;
  tenantId: string;
  packageId: string;
  decisionFingerprint: string;
  capturedAt: string;
  decision: PilotReviewDecision;
  restoreAllowed: false;
  exportAllowed: false;
  writesAllowed: false;
  activationAllowed: false;
  rawLearnerAudioIncluded: false;
  learnerTranscriptIncluded: false;
  realLearnerIdentifiersIncluded: false;
}

export interface PilotReviewDecisionPersistenceAdapterRequest {
  snapshot: unknown;
  operation: PilotReviewDecisionPersistenceOperation;
  expectedTenantId?: string;
  expectedPackageId?: string;
  expectedPersistenceMode?: PilotReviewDecisionPersistenceMode;
}

export interface PilotReviewDecisionPersistenceAdapterDecision {
  allowed: false;
  reasonCode: string;
  reasons: string[];
  operation: PilotReviewDecisionPersistenceOperation;
}

export interface PilotReviewDecisionPersistenceAdapterResult {
  request: PilotReviewDecisionPersistenceAdapterRequest;
  decision: PilotReviewDecisionPersistenceAdapterDecision;
  sideEffect: "none";
  snapshotValid: boolean;
}

export interface PilotReviewDecisionPersistenceAdapter {
  readonly mode: "review-only";
  evaluate(request: PilotReviewDecisionPersistenceAdapterRequest): PilotReviewDecisionPersistenceAdapterDecision;
  execute(request: PilotReviewDecisionPersistenceAdapterRequest): PilotReviewDecisionPersistenceAdapterResult;
}

const REVIEW_ONLY_BLOCKED_ACTIONS = [
  "No hosted database write",
  "No local classroom write",
  "No snapshot restore",
  "No snapshot export",
  "No review decision activation",
] as const;

export function createPilotReviewDecisionPersistenceSnapshot(
  decision: PilotReviewDecision,
  persistenceMode: PilotReviewDecisionPersistenceMode,
  capturedAt: string,
): PilotReviewDecisionPersistenceSnapshot {
  const decisionErrors = validatePilotReviewDecision(decision);
  if (decisionErrors.length > 0) throw new Error(decisionErrors.join(" "));
  if (Number.isNaN(Date.parse(capturedAt))) throw new Error("Pilot review decision snapshot capturedAt must be a valid timestamp.");

  const snapshot: PilotReviewDecisionPersistenceSnapshot = {
    recordVersion: 1,
    category: "pilot-review-decision-snapshot",
    snapshotId: `pilot-review-decision-snapshot-v1:${decision.decisionId}:${persistenceMode}`,
    storageMode: "provider-neutral",
    persistenceMode,
    decisionId: decision.decisionId,
    tenantId: decision.tenantId,
    packageId: decision.packageId,
    decisionFingerprint: fingerprintPilotReviewDecision(decision),
    capturedAt,
    decision,
    restoreAllowed: false,
    exportAllowed: false,
    writesAllowed: false,
    activationAllowed: false,
    rawLearnerAudioIncluded: false,
    learnerTranscriptIncluded: false,
    realLearnerIdentifiersIncluded: false,
  };

  const errors = validatePilotReviewDecisionPersistenceSnapshot(snapshot);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return snapshot;
}

export function validatePilotReviewDecisionPersistenceSnapshot(unknownSnapshot: unknown): string[] {
  const errors: string[] = [];
  if (!unknownSnapshot || typeof unknownSnapshot !== "object" || Array.isArray(unknownSnapshot)) {
    return ["Pilot review decision persistence snapshot must be an object."];
  }

  const snapshot = unknownSnapshot as Partial<PilotReviewDecisionPersistenceSnapshot> & Record<string, unknown>;
  if (snapshot.recordVersion !== 1) errors.push("Pilot review decision persistence snapshot recordVersion must be 1.");
  if (snapshot.category !== "pilot-review-decision-snapshot") errors.push("Pilot review decision persistence snapshot category is invalid.");
  if (snapshot.storageMode !== "provider-neutral") errors.push("Pilot review decision persistence snapshot storageMode must be provider-neutral.");
  if (!isPersistenceMode(snapshot.persistenceMode)) errors.push("Pilot review decision persistence snapshot persistenceMode is invalid.");

  for (const field of ["snapshotId", "decisionId", "tenantId", "packageId", "decisionFingerprint", "capturedAt"] as const) {
    if (typeof snapshot[field] !== "string" || snapshot[field].trim().length === 0) {
      errors.push(`Pilot review decision persistence snapshot ${field} is required.`);
    }
  }

  if (typeof snapshot.capturedAt === "string" && Number.isNaN(Date.parse(snapshot.capturedAt))) {
    errors.push("Pilot review decision persistence snapshot capturedAt must be a valid timestamp.");
  }

  for (const field of [
    "restoreAllowed",
    "exportAllowed",
    "writesAllowed",
    "activationAllowed",
    "rawLearnerAudioIncluded",
    "learnerTranscriptIncluded",
    "realLearnerIdentifiersIncluded",
  ] as const) {
    if (snapshot[field] !== false) errors.push(`Pilot review decision persistence snapshot ${field} must remain false.`);
  }

  const decisionErrors = snapshot.decision === undefined
    ? ["Pilot review decision persistence snapshot must include a decision."]
    : validatePilotReviewDecision(snapshot.decision);
  errors.push(...decisionErrors.map((error) => `Snapshot decision: ${error}`));
  if (isPilotReviewDecision(snapshot.decision)) {
    if (snapshot.decisionId !== snapshot.decision.decisionId) errors.push("Pilot review decision snapshot decisionId must match the decision.");
    if (snapshot.tenantId !== snapshot.decision.tenantId) errors.push("Pilot review decision snapshot tenantId must match the decision.");
    if (snapshot.packageId !== snapshot.decision.packageId) errors.push("Pilot review decision snapshot packageId must match the decision.");
    if (snapshot.decisionFingerprint !== fingerprintPilotReviewDecision(snapshot.decision)) {
      errors.push("Pilot review decision persistence snapshot fingerprint does not match the decision.");
    }
  }

  return [...new Set(errors)];
}

export function fingerprintPilotReviewDecision(decision: PilotReviewDecision): string {
  return `pilot-review-decision-fnv1a-v1:${fnv1a(canonicalize(decision))}`;
}

export function createReviewOnlyPilotReviewDecisionPersistenceAdapter(): PilotReviewDecisionPersistenceAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const snapshotErrors = validatePilotReviewDecisionPersistenceSnapshot(request.snapshot);
      const snapshot = isPilotReviewDecisionPersistenceSnapshot(request.snapshot) ? request.snapshot : undefined;
      const reasons = [...snapshotErrors];
      if (request.expectedTenantId && snapshot?.tenantId !== request.expectedTenantId) reasons.push("Snapshot tenant does not match the expected tenant.");
      if (request.expectedPackageId && snapshot?.packageId !== request.expectedPackageId) reasons.push("Snapshot package does not match the expected package.");
      if (request.expectedPersistenceMode && snapshot?.persistenceMode !== request.expectedPersistenceMode) reasons.push("Snapshot persistence mode does not match the expected mode.");
      reasons.push(...REVIEW_ONLY_BLOCKED_ACTIONS);
      return {
        allowed: false,
        reasonCode: snapshotErrors.length > 0 ? "invalid-pilot-review-decision-snapshot" : "review-only-pilot-review-decision-adapter",
        reasons: [...new Set(reasons)],
        operation: request.operation,
      };
    },
    execute(request) {
      const decision = this.evaluate(request);
      return {
        request,
        decision,
        sideEffect: "none",
        snapshotValid: validatePilotReviewDecisionPersistenceSnapshot(request.snapshot).length === 0,
      };
    },
  };
}

function isPilotReviewDecision(value: unknown): value is PilotReviewDecision {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return validatePilotReviewDecision(value as PilotReviewDecision).length === 0;
}

function isPilotReviewDecisionPersistenceSnapshot(value: unknown): value is PilotReviewDecisionPersistenceSnapshot {
  return validatePilotReviewDecisionPersistenceSnapshot(value).length === 0;
}

function isPersistenceMode(value: unknown): value is PilotReviewDecisionPersistenceMode {
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
