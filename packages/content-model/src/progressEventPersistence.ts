import {
  createCanonicalCompletionIdempotencyKey,
  type CanonicalCompletionIdempotencyKeyInput,
} from "./canonicalGameReplay";
import {
  validateProgressEventEnvelopeStream,
  type ProgressEventEnvelope,
  type ProgressEventTaxonomyRegistry,
} from "./progressEventTaxonomy";
import type { GameModeId } from "./index";

export type ProgressEventPersistenceDurability = "non-durable-rehearsal" | "durable-managed";
export type ProgressEventPersistencePolicyMode = "rehearsal-only" | "durable-managed";

export interface ProgressEventStreamPersistenceRecord {
  recordVersion: 1;
  category: "progress-event-stream";
  adapterMode: "hosted-managed";
  durability: ProgressEventPersistenceDurability;
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
  unitKey: string;
  gameMode: GameModeId;
  taxonomyVersion: string;
  eventAcceptanceGateId: string;
  events: ProgressEventEnvelope[];
  writtenAt: string;
  idempotencyKey: string;
  rawLearnerAudioIncluded: false;
  learnerTranscriptIncluded: false;
}

export interface ProgressEventStreamPersistenceClientWriteRequest {
  expectedTenantId: string;
  expectedPackageId: string;
  expectedLaunchCode: string;
  expectedStudentSessionId: string;
  events: unknown;
  requestedMode: ProgressEventPersistencePolicyMode;
}

export interface ProgressEventStreamPersistenceWriteRequest extends ProgressEventStreamPersistenceClientWriteRequest {
  policy: {
    mode: ProgressEventPersistencePolicyMode;
    allowNonDurableWrite?: boolean;
    allowDurableWrite?: boolean;
    schoolPolicyAccepted: boolean;
    retentionPolicyAccepted?: boolean;
    releaseApprovalAccepted?: boolean;
  };
  registry: ProgressEventTaxonomyRegistry;
}

export interface ProgressEventStreamPersistenceReadRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
}

export interface ProgressEventStreamPersistenceValidation {
  valid: boolean;
  errors: string[];
}

export function validateProgressEventStreamPersistenceClientWrite(
  request: unknown,
  registry: ProgressEventTaxonomyRegistry,
): ProgressEventStreamPersistenceValidation & { request?: ProgressEventStreamPersistenceClientWriteRequest } {
  if (!request || typeof request !== "object" || Array.isArray(request)) {
    return { valid: false, errors: ["Progress event stream client request must be an object."] };
  }

  const candidate = request as Partial<ProgressEventStreamPersistenceClientWriteRequest> & { policy?: unknown; registry?: unknown };
  const errors: string[] = [];
  for (const [name, value] of Object.entries({
    expectedTenantId: candidate.expectedTenantId,
    expectedPackageId: candidate.expectedPackageId,
    expectedLaunchCode: candidate.expectedLaunchCode,
    expectedStudentSessionId: candidate.expectedStudentSessionId,
  })) {
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`${name} is required.`);
  }
  if (candidate.requestedMode !== "rehearsal-only" && candidate.requestedMode !== "durable-managed") {
    errors.push("Progress event stream client request requires a valid requested mode.");
  }
  if ("policy" in candidate || "registry" in candidate) {
    errors.push("Progress event stream policy and taxonomy are server-owned and cannot be supplied by the browser.");
  }
  errors.push(...validatePersistedEventStreamIdentity({
    expectedLaunchCode: typeof candidate.expectedLaunchCode === "string" ? candidate.expectedLaunchCode : "",
    expectedStudentSessionId: typeof candidate.expectedStudentSessionId === "string" ? candidate.expectedStudentSessionId : "",
    events: candidate.events,
    registry,
  }));

  const parsedRequest = candidate.requestedMode !== "rehearsal-only" && candidate.requestedMode !== "durable-managed"
    ? undefined
    : {
        expectedTenantId: typeof candidate.expectedTenantId === "string" ? candidate.expectedTenantId : "",
        expectedPackageId: typeof candidate.expectedPackageId === "string" ? candidate.expectedPackageId : "",
        expectedLaunchCode: typeof candidate.expectedLaunchCode === "string" ? candidate.expectedLaunchCode : "",
        expectedStudentSessionId: typeof candidate.expectedStudentSessionId === "string" ? candidate.expectedStudentSessionId : "",
        events: candidate.events,
        requestedMode: candidate.requestedMode as ProgressEventPersistencePolicyMode,
      };
  return { valid: errors.length === 0, errors: [...new Set(errors)], request: parsedRequest };
}

export function createServerOwnedProgressEventStreamWriteRequest(
  request: ProgressEventStreamPersistenceClientWriteRequest,
  registry: ProgressEventTaxonomyRegistry,
  policy: ProgressEventStreamPersistenceWriteRequest["policy"],
): ProgressEventStreamPersistenceWriteRequest {
  if (request.requestedMode !== policy.mode) {
    throw new Error("Server-owned progress event policy mode must match the requested mode.");
  }
  return { ...request, registry, policy };
}

export function validateProgressEventStreamPersistenceWrite(
  request: ProgressEventStreamPersistenceWriteRequest,
): ProgressEventStreamPersistenceValidation {
  const errors = validatePersistedEventStreamIdentity({
    expectedLaunchCode: request.expectedLaunchCode,
    expectedStudentSessionId: request.expectedStudentSessionId,
    events: request.events,
    registry: request.registry,
  });
  if (!request.policy || (request.policy.mode !== "rehearsal-only" && request.policy.mode !== "durable-managed")) {
    errors.push("Progress event stream writes require rehearsal-only or durable-managed policy mode.");
  }
  if (request.policy?.schoolPolicyAccepted !== true) errors.push("Progress event stream writes require school policy acceptance.");
  if (request.policy?.mode === "rehearsal-only" && request.policy.allowNonDurableWrite !== true) {
    errors.push("Progress event stream rehearsal writes require explicit non-durable approval.");
  }
  if (request.policy?.mode === "durable-managed" && request.policy.allowDurableWrite !== true) {
    errors.push("Progress event stream durable writes require explicit durable-storage approval.");
  }
  if (request.policy?.mode === "durable-managed" && request.policy.retentionPolicyAccepted !== true) {
    errors.push("Progress event stream durable writes require retention-policy acceptance.");
  }
  if (request.policy?.mode === "durable-managed" && request.policy.releaseApprovalAccepted !== true) {
    errors.push("Progress event stream durable writes require release approval.");
  }
  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

export function createProgressEventStreamPersistenceRecord(args: {
  request: ProgressEventStreamPersistenceWriteRequest;
  writtenAt: string;
}): ProgressEventStreamPersistenceRecord {
  const validation = validateProgressEventStreamPersistenceWrite(args.request);
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  const events = args.request.events as ProgressEventEnvelope[];
  const first = events[0];
  const identity: CanonicalCompletionIdempotencyKeyInput = {
    tenantId: args.request.expectedTenantId,
    unitKey: first.unit_key,
    launchCode: args.request.expectedLaunchCode,
    studentSessionId: args.request.expectedStudentSessionId,
    gameMode: first.game_mode,
  };
  return {
    recordVersion: 1,
    category: "progress-event-stream",
    adapterMode: "hosted-managed",
    durability: args.request.policy.mode === "durable-managed" ? "durable-managed" : "non-durable-rehearsal",
    tenantId: args.request.expectedTenantId,
    packageId: args.request.expectedPackageId,
    launchCode: args.request.expectedLaunchCode,
    studentSessionId: args.request.expectedStudentSessionId,
    unitKey: first.unit_key,
    gameMode: first.game_mode,
    taxonomyVersion: first.taxonomy_version,
    eventAcceptanceGateId: first.event_acceptance_gate_id,
    events,
    writtenAt: args.writtenAt,
    idempotencyKey: createCanonicalCompletionIdempotencyKey(identity),
    rawLearnerAudioIncluded: false,
    learnerTranscriptIncluded: false,
  };
}

export function validateProgressEventStreamPersistenceRead(
  request: ProgressEventStreamPersistenceReadRequest,
  record: ProgressEventStreamPersistenceRecord | undefined,
  registry: ProgressEventTaxonomyRegistry,
): ProgressEventStreamPersistenceValidation {
  const errors: string[] = [];
  for (const [name, value] of Object.entries(request)) {
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`${name} is required.`);
  }
  if (!record) errors.push("No persisted progress event stream was found.");
  if (record) {
    if (record.tenantId !== request.tenantId) errors.push("Progress event stream tenant does not match.");
    if (record.packageId !== request.packageId) errors.push("Progress event stream package does not match.");
    if (record.launchCode !== request.launchCode) errors.push("Progress event stream launch does not match.");
    if (record.studentSessionId !== request.studentSessionId) errors.push("Progress event stream student session does not match.");
    errors.push(...validatePersistedEventStreamIdentity({
      expectedLaunchCode: request.launchCode,
      expectedStudentSessionId: request.studentSessionId,
      events: record.events,
      registry,
    }));
  }
  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

function validatePersistedEventStreamIdentity(args: {
  expectedLaunchCode: string;
  expectedStudentSessionId: string;
  events: unknown;
  registry: ProgressEventTaxonomyRegistry;
}): string[] {
  const errors = validateProgressEventEnvelopeStream(args.events, args.registry);
  if (!Array.isArray(args.events)) return [...new Set(errors)];
  const records = args.events.filter((event): event is ProgressEventEnvelope => Boolean(event && typeof event === "object"));
  if (records.length === 0) errors.push("Persisted progress event stream must contain events.");
  if (!records.some((event) => event.event_type === "game_started")) errors.push("Persisted progress event stream must include game_started.");
  if (!records.some((event) => event.event_type === "game_completed")) errors.push("Persisted progress event stream must include game_completed.");
  for (const event of records) {
    if (event.launch_code !== args.expectedLaunchCode) errors.push(`Progress event ${event.event_id || "(missing)"} launch_code must match the expected launch.`);
    if (event.student_session_id !== args.expectedStudentSessionId) errors.push(`Progress event ${event.event_id || "(missing)"} student_session_id must match the expected session.`);
  }
  return [...new Set(errors)];
}
