import type { PilotDeliveryManifest, PilotDeliveryMode } from "./pilotDeliveryManifest";

export type PilotDeliveryReleaseReceiptStatus = "blocked" | "manual-release-approved";
export type PilotDeliveryApprovalState = "pending" | "approved";
export type PilotDeliveryReviewerRole = "publisher-owner" | "school-admin" | "platform-admin";

export interface PilotDeliveryReleaseReceipt {
  receiptId: string;
  manifestId: string;
  tenantId: string;
  packageId: string;
  version: string;
  mode: PilotDeliveryMode;
  sourceAssemblyChecksum: string;
  status: PilotDeliveryReleaseReceiptStatus;
  reviewerId: string | null;
  reviewerRole: PilotDeliveryReviewerRole | null;
  reviewedAt: string | null;
  releaseApproval: PilotDeliveryApprovalState;
  qrPrintAuthorization: PilotDeliveryApprovalState;
  rollbackReference: string | null;
  unresolvedRequirements: string[];
  handoffInstructions: string[];
  blockedActions: string[];
  deliveryAllowed: boolean;
  qrPrintAllowed: boolean;
  studentFacingActivationAllowed: boolean;
  sideEffect: "none";
}

const blockedActions = [
  "No package writer execution from a receipt alone",
  "No QR alias mutation or production print authorization from a blocked receipt",
  "No student-facing activation without an approved release receipt",
  "No hosted persistence activation without separate opt-in provider approval",
  "No receipt may expose publisher payload bytes or learner records",
] as const;

export function createPilotDeliveryReleaseReceipt(input: {
  manifest: PilotDeliveryManifest;
  reviewerId?: string | null;
  reviewerRole?: PilotDeliveryReviewerRole | null;
  reviewedAt?: string | null;
  releaseApproval?: PilotDeliveryApprovalState;
  qrPrintAuthorization?: PilotDeliveryApprovalState;
  rollbackReference?: string | null;
}): PilotDeliveryReleaseReceipt {
  const releaseApproval = input.releaseApproval ?? "pending";
  const qrPrintAuthorization = input.qrPrintAuthorization ?? "pending";
  const reviewerId = input.reviewerId ?? null;
  const reviewerRole = input.reviewerRole ?? null;
  const reviewedAt = input.reviewedAt ?? null;
  const rollbackReference = input.rollbackReference ?? null;
  const unresolvedRequirements = [
    ...(input.manifest.status === "blocked" ? ["Pilot delivery manifest remains blocked."] : []),
    ...(releaseApproval !== "approved" ? ["Named release approval is not recorded."] : []),
    ...(qrPrintAuthorization !== "approved" ? ["QR print authorization is not recorded."] : []),
    ...(!reviewerId ? ["A human reviewer identity is required."] : []),
    ...(!reviewerRole ? ["A human reviewer role is required."] : []),
    ...(!reviewedAt ? ["A review timestamp is required."] : []),
    ...(!rollbackReference ? ["A rollback reference is required before handoff."] : []),
  ];
  const approved = unresolvedRequirements.length === 0 && input.manifest.deliveryAllowed;

  return {
    receiptId: `${input.manifest.manifestId}:release-receipt`,
    manifestId: input.manifest.manifestId,
    tenantId: input.manifest.tenantId,
    packageId: input.manifest.packageId,
    version: input.manifest.version,
    mode: input.manifest.mode,
    sourceAssemblyChecksum: input.manifest.sourceAssemblyChecksum,
    status: approved ? "manual-release-approved" : "blocked",
    reviewerId,
    reviewerRole,
    reviewedAt,
    releaseApproval,
    qrPrintAuthorization,
    rollbackReference,
    unresolvedRequirements: [...new Set(unresolvedRequirements)],
    handoffInstructions: [
      "A platform operator must compare this receipt with the exact manifest checksum before any manual handoff.",
      "Keep local bundle and hosted persistence decisions separate when issuing the publisher package.",
      "Print only the stable QR alias paths listed by the approved manifest, never raw asset paths.",
    ],
    blockedActions: [...blockedActions],
    deliveryAllowed: approved,
    qrPrintAllowed: approved && qrPrintAuthorization === "approved" && input.manifest.qrPrintAllowed,
    studentFacingActivationAllowed: approved && input.manifest.studentFacingActivationAllowed,
    sideEffect: "none",
  };
}

export function validatePilotDeliveryReleaseReceipt(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Pilot delivery release receipt must be an object."];
  for (const field of ["receiptId", "manifestId", "tenantId", "packageId", "version", "sourceAssemblyChecksum"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Pilot delivery release receipt ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot delivery release receipt sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (!["hosted-pwa", "closed-local", "hybrid"].includes(String(value.mode))) errors.push("Pilot delivery release receipt mode is unsupported.");
  if (!["blocked", "manual-release-approved"].includes(String(value.status))) errors.push("Pilot delivery release receipt status is unsupported.");
  if (!["pending", "approved"].includes(String(value.releaseApproval))) errors.push("Pilot delivery release receipt releaseApproval is unsupported.");
  if (!["pending", "approved"].includes(String(value.qrPrintAuthorization))) errors.push("Pilot delivery release receipt qrPrintAuthorization is unsupported.");
  if (value.reviewerId !== null && !isNonEmptyString(value.reviewerId)) errors.push("Pilot delivery release receipt reviewerId must be null or non-empty.");
  if (value.reviewerRole !== null && !["publisher-owner", "school-admin", "platform-admin"].includes(String(value.reviewerRole))) errors.push("Pilot delivery release receipt reviewerRole is unsupported.");
  if (value.reviewedAt !== null && !isIsoTimestamp(value.reviewedAt)) errors.push("Pilot delivery release receipt reviewedAt must be null or a valid ISO timestamp.");
  if (value.rollbackReference !== null && !isNonEmptyString(value.rollbackReference)) errors.push("Pilot delivery release receipt rollbackReference must be null or non-empty.");
  for (const field of ["unresolvedRequirements", "handoffInstructions", "blockedActions"] as const) {
    if (!Array.isArray(value[field]) || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Pilot delivery release receipt ${field} must contain non-empty strings.`);
  }
  if (value.sideEffect !== "none") errors.push("Pilot delivery release receipt must be side-effect-free.");
  const approved = value.status === "manual-release-approved";
  if (value.deliveryAllowed !== approved) errors.push("Pilot delivery release receipt deliveryAllowed must match status.");
  if (!approved && (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.length === 0)) errors.push("Blocked pilot delivery release receipt must list unresolved requirements.");
  if (!approved && (value.qrPrintAllowed !== false || value.studentFacingActivationAllowed !== false)) errors.push("Blocked pilot delivery release receipt must block QR printing and student activation.");
  if (approved) {
    if (value.releaseApproval !== "approved" || value.qrPrintAuthorization !== "approved") errors.push("Approved pilot delivery release receipt must include release and QR approval.");
    if (!isNonEmptyString(value.reviewerId) || !isNonEmptyString(value.reviewerRole) || !isIsoTimestamp(value.reviewedAt) || !isNonEmptyString(value.rollbackReference)) errors.push("Approved pilot delivery release receipt must include reviewer, timestamp, and rollback evidence.");
    if (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.length > 0) errors.push("Approved pilot delivery release receipt cannot list unresolved requirements.");
  }
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isSha256(value: unknown): boolean {
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value);
}
