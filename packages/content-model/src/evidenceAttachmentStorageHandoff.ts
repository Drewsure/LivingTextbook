export type EvidenceAttachmentStorageHandoffStatus = "blocked-preview" | "selection-review-ready";

export interface EvidenceAttachmentStorageHandoffBinding {
  bindingId: string;
  packageId: string;
  tenantId: string;
  planId: string;
  selectionGateId: string;
  status: EvidenceAttachmentStorageHandoffStatus;
  candidateIds: string[];
  requiredMetadata: string[];
  policyGates: string[];
  blockedActions: string[];
  storageActivationAllowed: false;
  uploadAllowed: false;
  downloadAllowed: false;
  releaseMutationAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createEvidenceAttachmentStorageHandoffBinding(input: Omit<EvidenceAttachmentStorageHandoffBinding, "bindingId" | "mode" | "sideEffect" | "storageActivationAllowed" | "uploadAllowed" | "downloadAllowed" | "releaseMutationAllowed">): EvidenceAttachmentStorageHandoffBinding {
  const binding: EvidenceAttachmentStorageHandoffBinding = {
    ...input,
    bindingId: `${input.packageId}:${input.planId}:${input.selectionGateId}`,
    storageActivationAllowed: false,
    uploadAllowed: false,
    downloadAllowed: false,
    releaseMutationAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateEvidenceAttachmentStorageHandoffBinding(binding);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return binding;
}

export function validateEvidenceAttachmentStorageHandoffBinding(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Evidence attachment storage handoff binding must be an object."];
  for (const field of ["bindingId", "packageId", "tenantId", "planId", "selectionGateId"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Evidence attachment storage handoff ${field} must be non-empty.`);
  }
  if (!["blocked-preview", "selection-review-ready"].includes(String(value.status))) errors.push("Evidence attachment storage handoff status is unsupported.");
  for (const field of ["candidateIds", "requiredMetadata", "policyGates", "blockedActions"] as const) {
    if (!Array.isArray(value[field]) || value[field].length === 0 || value[field].some((item) => !isNonEmptyString(item))) {
      errors.push(`Evidence attachment storage handoff ${field} must contain non-empty strings.`);
    }
  }
  for (const field of ["storageActivationAllowed", "uploadAllowed", "downloadAllowed", "releaseMutationAllowed"] as const) {
    if (value[field] !== false) errors.push(`Evidence attachment storage handoff ${field} must remain false.`);
  }
  if (value.mode !== "review-only") errors.push("Evidence attachment storage handoff must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Evidence attachment storage handoff must remain side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
