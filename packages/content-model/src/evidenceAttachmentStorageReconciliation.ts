export type EvidenceAttachmentStorageReconciliationStatus = "blocked-preview" | "reconciliation-review-ready";

export interface EvidenceAttachmentStorageReconciliation {
  reconciliationId: string;
  tenantId: string;
  packageId: string;
  storageBindingId: string;
  assetPacketIds: string[];
  attachmentIds: string[];
  candidateIds: string[];
  unresolvedGates: string[];
  blockedActions: string[];
  status: EvidenceAttachmentStorageReconciliationStatus;
  storageSelectionAllowed: false;
  uploadAllowed: false;
  downloadAllowed: false;
  promotionAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const statuses = new Set<EvidenceAttachmentStorageReconciliationStatus>([
  "blocked-preview",
  "reconciliation-review-ready",
]);

export function createEvidenceAttachmentStorageReconciliation(
  input: Omit<
    EvidenceAttachmentStorageReconciliation,
    "reconciliationId" | "storageSelectionAllowed" | "uploadAllowed" | "downloadAllowed" | "promotionAllowed" | "mode" | "sideEffect"
  >,
): EvidenceAttachmentStorageReconciliation {
  const reconciliation: EvidenceAttachmentStorageReconciliation = {
    ...input,
    reconciliationId: `${input.packageId}:${input.storageBindingId}`,
    storageSelectionAllowed: false,
    uploadAllowed: false,
    downloadAllowed: false,
    promotionAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateEvidenceAttachmentStorageReconciliation(reconciliation);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return reconciliation;
}

export function validateEvidenceAttachmentStorageReconciliation(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Evidence attachment storage reconciliation must be an object."];
  for (const field of ["reconciliationId", "tenantId", "packageId", "storageBindingId"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Evidence attachment storage reconciliation ${field} must be non-empty.`);
  }
  if (!statuses.has(String(value.status) as EvidenceAttachmentStorageReconciliationStatus)) {
    errors.push("Evidence attachment storage reconciliation status is unsupported.");
  }
  for (const field of ["assetPacketIds", "attachmentIds", "candidateIds", "unresolvedGates", "blockedActions"] as const) {
    const values = value[field];
    if (!Array.isArray(values) || values.length === 0 || values.some((item) => !isNonEmptyString(item))) {
      errors.push(`Evidence attachment storage reconciliation ${field} must contain non-empty strings.`);
    } else if (new Set(values).size !== values.length) {
      errors.push(`Evidence attachment storage reconciliation ${field} must not contain duplicates.`);
    }
  }
  for (const field of ["storageSelectionAllowed", "uploadAllowed", "downloadAllowed", "promotionAllowed"] as const) {
    if (value[field] !== false) errors.push(`Evidence attachment storage reconciliation ${field} must remain false.`);
  }
  if (value.mode !== "review-only") errors.push("Evidence attachment storage reconciliation must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Evidence attachment storage reconciliation must remain side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
