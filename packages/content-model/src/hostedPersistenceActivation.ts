export type HostedPersistenceActivationDeliveryMode = "hosted-managed" | "hybrid";

export interface HostedPersistenceActivationRecord {
  recordVersion: 1;
  activationId: string;
  tenantId: string;
  packageId: string;
  deliveryVersion: string;
  releaseReceiptId: string;
  hostedPersistenceDecisionPacketId: string;
  provider: "sqlite";
  deliveryMode: HostedPersistenceActivationDeliveryMode;
  status: "approved";
  optInRecorded: true;
  schoolPolicyAccepted: true;
  retentionPolicyAccepted: true;
  releaseApprovalAccepted: true;
  writesAllowed: true;
  studentContinuityAllowed: true;
  teacherReviewAllowed: true;
  routeMutationAllowed: false;
  studentFacingActivationAllowed: false;
  operatorId: string;
  activatedAt: string;
  sideEffect: "metadata-only";
}

export function validateHostedPersistenceActivationRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Hosted persistence activation record must be an object."];
  if (value.recordVersion !== 1) errors.push("Hosted persistence activation record recordVersion must be 1.");
  for (const field of [
    "activationId",
    "tenantId",
    "packageId",
    "deliveryVersion",
    "releaseReceiptId",
    "hostedPersistenceDecisionPacketId",
    "operatorId",
    "activatedAt",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Hosted persistence activation record ${field} must be non-empty.`);
  }
  if (value.provider !== "sqlite") errors.push("Hosted persistence activation record provider must be sqlite.");
  if (value.deliveryMode !== "hosted-managed" && value.deliveryMode !== "hybrid") errors.push("Hosted persistence activation record deliveryMode is unsupported.");
  if (value.status !== "approved") errors.push("Hosted persistence activation record status must be approved.");
  for (const field of [
    "optInRecorded",
    "schoolPolicyAccepted",
    "retentionPolicyAccepted",
    "releaseApprovalAccepted",
    "writesAllowed",
    "studentContinuityAllowed",
    "teacherReviewAllowed",
  ] as const) {
    if (value[field] !== true) errors.push(`Hosted persistence activation record ${field} must be true.`);
  }
  for (const field of ["routeMutationAllowed", "studentFacingActivationAllowed"] as const) {
    if (value[field] !== false) errors.push(`Hosted persistence activation record ${field} must remain false.`);
  }
  if (typeof value.activatedAt !== "string" || Number.isNaN(Date.parse(value.activatedAt))) errors.push("Hosted persistence activation record activatedAt must be a valid timestamp.");
  if (value.sideEffect !== "metadata-only") errors.push("Hosted persistence activation record sideEffect must be metadata-only.");
  return [...new Set(errors)];
}

export function validateHostedPersistenceActivationBinding(
  record: HostedPersistenceActivationRecord,
  identity: { tenantId: string; packageId: string },
): string[] {
  const errors = validateHostedPersistenceActivationRecord(record);
  if (record.tenantId !== identity.tenantId) errors.push("Hosted persistence activation tenant does not match the requested identity.");
  if (record.packageId !== identity.packageId) errors.push("Hosted persistence activation package does not match the requested identity.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
