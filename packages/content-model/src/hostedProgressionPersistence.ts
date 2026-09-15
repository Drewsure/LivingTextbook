import type { ProgressionContinuityEnvelope, ProgressionContinuitySnapshot } from "./progressionRuntime";
import { validateProgressionContinuityRuntimeRequest } from "./progressionRuntime";

export type HostedProgressionPersistenceDurability = "non-durable-rehearsal";

export interface HostedProgressionPersistenceRecord {
  recordVersion: 1;
  category: "progression-continuity";
  adapterMode: "hosted-managed";
  durability: HostedProgressionPersistenceDurability;
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
  continuity: ProgressionContinuityEnvelope;
  progression: ProgressionContinuitySnapshot;
  writtenAt: string;
  idempotencyKey: string;
}

export interface HostedProgressionPersistenceWriteRequest {
  expectedTenantId: string;
  expectedPackageId: string;
  expectedLaunchCode: string;
  expectedStudentSessionId: string;
  envelope: unknown;
  policy: {
    mode: "rehearsal-only";
    allowNonDurableWrite: boolean;
    schoolPolicyAccepted: boolean;
  };
}

export interface HostedProgressionPersistenceReadRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
}

export interface HostedProgressionPersistenceValidation {
  valid: boolean;
  errors: string[];
}

export function validateHostedProgressionPersistenceWrite(
  request: HostedProgressionPersistenceWriteRequest,
): HostedProgressionPersistenceValidation {
  const errors = validateProgressionContinuityRuntimeRequest({
    expectedTenantId: request.expectedTenantId,
    expectedPackageId: request.expectedPackageId,
    expectedLaunchCode: request.expectedLaunchCode,
    expectedStudentSessionId: request.expectedStudentSessionId,
    envelope: request.envelope,
  });

  if (!request.policy || request.policy.mode !== "rehearsal-only") {
    errors.push("Hosted progression writes require rehearsal-only policy mode.");
  }
  if (request.policy?.allowNonDurableWrite !== true) {
    errors.push("Hosted progression writes require explicit non-durable rehearsal approval.");
  }
  if (request.policy?.schoolPolicyAccepted !== true) {
    errors.push("Hosted progression writes require school policy acceptance.");
  }

  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

export function createHostedProgressionPersistenceRecord(args: {
  request: HostedProgressionPersistenceWriteRequest;
  writtenAt: string;
}): HostedProgressionPersistenceRecord {
  const validation = validateHostedProgressionPersistenceWrite(args.request);
  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const continuity = args.request.envelope as ProgressionContinuityEnvelope;
  return {
    recordVersion: 1,
    category: "progression-continuity",
    adapterMode: "hosted-managed",
    durability: "non-durable-rehearsal",
    tenantId: continuity.tenantId,
    packageId: continuity.packageId,
    launchCode: continuity.launchCode,
    studentSessionId: continuity.studentSessionId,
    continuity,
    progression: continuity.snapshot,
    writtenAt: args.writtenAt,
    idempotencyKey: continuity.continuityId,
  };
}

export function validateHostedProgressionPersistenceRead(
  request: HostedProgressionPersistenceReadRequest,
  record: HostedProgressionPersistenceRecord | undefined,
): HostedProgressionPersistenceValidation {
  const errors: string[] = [];
  for (const [name, value] of Object.entries(request)) {
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`${name} is required.`);
  }
  if (!record) errors.push("No hosted progression rehearsal record was found.");
  if (record) {
    if (record.tenantId !== request.tenantId) errors.push("Hosted progression record tenant does not match.");
    if (record.packageId !== request.packageId) errors.push("Hosted progression record package does not match.");
    if (record.launchCode !== request.launchCode) errors.push("Hosted progression record launch does not match.");
    if (record.studentSessionId !== request.studentSessionId) errors.push("Hosted progression record student session does not match.");
    errors.push(...validateProgressionContinuityRuntimeRequest({
      expectedTenantId: request.tenantId,
      expectedPackageId: request.packageId,
      expectedLaunchCode: request.launchCode,
      expectedStudentSessionId: request.studentSessionId,
      envelope: record.continuity,
    }));
  }
  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}
