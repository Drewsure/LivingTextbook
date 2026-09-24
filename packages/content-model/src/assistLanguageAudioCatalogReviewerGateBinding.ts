export type AssistLanguageAudioCatalogReviewerGateBindingStatus = "blocked-preview" | "reviewer-gate-review-ready";

export interface AssistLanguageAudioCatalogReviewerGateBinding {
  bindingId: string;
  reconciliationId: string;
  reviewerGateId: string;
  tenantId: string;
  packageId: string;
  unitKey: string;
  status: AssistLanguageAudioCatalogReviewerGateBindingStatus;
  gateIdentityStatus: string;
  gateSignatureStatus: string;
  gateApprovalCaptureStatus: string;
  requiredReviewerLanes: string[];
  unresolvedRequirements: string[];
  scopeDrift: string[];
  blockedActions: string[];
  bindingComplete: false;
  approvalCaptureAllowed: false;
  releaseMutationAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const requiredBlockedActions = [
  "No signed approval capture",
  "No approve button",
  "No release-state mutation",
  "No signature attachment upload",
  "No student assignment from approval",
  "No catalog admission from reviewer binding",
] as const;

export function createReviewOnlyAssistLanguageAudioCatalogReviewerGateBinding(
  input: Omit<
    AssistLanguageAudioCatalogReviewerGateBinding,
    "bindingId" | "bindingComplete" | "approvalCaptureAllowed" | "releaseMutationAllowed" | "mode" | "sideEffect"
  >,
): AssistLanguageAudioCatalogReviewerGateBinding {
  const binding: AssistLanguageAudioCatalogReviewerGateBinding = {
    ...input,
    bindingId: `${input.tenantId}:${input.packageId}:${input.unitKey}:${input.reconciliationId}:${input.reviewerGateId}`,
    bindingComplete: false,
    approvalCaptureAllowed: false,
    releaseMutationAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateAssistLanguageAudioCatalogReviewerGateBinding(binding);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return binding;
}

export function validateAssistLanguageAudioCatalogReviewerGateBinding(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["assist-language audio reviewer gate binding must be an object"];

  for (const field of ["bindingId", "reconciliationId", "reviewerGateId", "tenantId", "packageId", "unitKey", "gateIdentityStatus", "gateSignatureStatus", "gateApprovalCaptureStatus", "mode", "sideEffect"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`assist-language audio reviewer gate binding ${field} is required`);
  }
  if (value.status !== "blocked-preview" && value.status !== "reviewer-gate-review-ready") errors.push("assist-language audio reviewer gate binding status is unsupported");
  for (const field of ["requiredReviewerLanes", "unresolvedRequirements", "scopeDrift", "blockedActions"] as const) {
    const values = value[field];
    if (!Array.isArray(values) || values.some((item) => !isNonEmptyString(item)) || new Set(values).size !== values.length) {
      errors.push(`assist-language audio reviewer gate binding ${field} must be a unique string array`);
    }
  }
  if (!Array.isArray(value.requiredReviewerLanes) || value.requiredReviewerLanes.length === 0) errors.push("assist-language audio reviewer gate binding requires reviewer lanes");
  for (const action of requiredBlockedActions) {
    const actions = Array.isArray(value.blockedActions) ? value.blockedActions : [];
    if (!actions.includes(action)) errors.push(`assist-language audio reviewer gate binding must block ${action}`);
  }
  if (value.bindingComplete !== false || value.approvalCaptureAllowed !== false || value.releaseMutationAllowed !== false) {
    errors.push("assist-language audio reviewer gate binding must remain incomplete and approval-disabled");
  }
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("assist-language audio reviewer gate binding must remain review-only with no side effect");
  return [...new Set(errors)];
}

export const ASSIST_LANGUAGE_AUDIO_REVIEWER_GATE_BINDING_BLOCKED_ACTIONS = requiredBlockedActions;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
