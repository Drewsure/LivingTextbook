export type AssistLanguageAudioCatalogReleaseReviewBindingStatus = "blocked-preview" | "review-ready-after-evidence";

export interface AssistLanguageAudioCatalogReleaseReviewBinding {
  bindingId: string;
  reconciliationId: string;
  reviewerGateBindingId: string;
  releaseReadinessId: string;
  releaseControlGateId: string;
  approvalLedgerId: string;
  humanReviewPacketId: string;
  tenantId: string;
  packageId: string;
  unitKey: string;
  releaseControlStatus: "blocked" | "review-only" | "pilot-ready";
  humanReviewStatus: "blocked" | "awaiting-human-review";
  status: AssistLanguageAudioCatalogReleaseReviewBindingStatus;
  linkedRecords: string[];
  scopeDrift: string[];
  blockingReasons: string[];
  nextGate: string[];
  approvalCaptureAllowed: false;
  productionApprovalAllowed: false;
  packagePromotionAllowed: false;
  studentProductionLaunchAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const requiredLinkedRecords = [
  "assist_language_audio_catalog_approval_reconciliation",
  "assist_language_audio_reviewer_gate_binding",
  "white_label_release_readiness",
  "package_publish_gate",
  "package_approval_ledger",
  "controlled_pilot_human_review_packet",
] as const;

const requiredBlockedActions = [
  "No approval capture",
  "No production approval",
  "No package promotion",
  "No student production launch",
  "No catalog admission",
  "No student-facing assist audio",
] as const;

export function createReviewOnlyAssistLanguageAudioCatalogReleaseReviewBinding(
  input: Omit<
    AssistLanguageAudioCatalogReleaseReviewBinding,
    "bindingId" | "approvalCaptureAllowed" | "productionApprovalAllowed" | "packagePromotionAllowed" | "studentProductionLaunchAllowed" | "mode" | "sideEffect"
  >,
): AssistLanguageAudioCatalogReleaseReviewBinding {
  const binding: AssistLanguageAudioCatalogReleaseReviewBinding = {
    ...input,
    bindingId: `${input.tenantId}:${input.packageId}:${input.unitKey}:${input.reconciliationId}:${input.humanReviewPacketId}`,
    approvalCaptureAllowed: false,
    productionApprovalAllowed: false,
    packagePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateAssistLanguageAudioCatalogReleaseReviewBinding(binding);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return binding;
}

export function validateAssistLanguageAudioCatalogReleaseReviewBinding(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["assist-language audio release review binding must be an object"];

  for (const field of ["bindingId", "reconciliationId", "reviewerGateBindingId", "releaseReadinessId", "releaseControlGateId", "approvalLedgerId", "humanReviewPacketId", "tenantId", "packageId", "unitKey", "mode", "sideEffect"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`assist-language audio release review binding ${field} is required`);
  }
  if (value.releaseControlStatus !== "blocked" && value.releaseControlStatus !== "review-only" && value.releaseControlStatus !== "pilot-ready") errors.push("assist-language audio release review binding release control status is unsupported");
  if (value.humanReviewStatus !== "blocked" && value.humanReviewStatus !== "awaiting-human-review") errors.push("assist-language audio release review binding human review status is unsupported");
  if (value.status !== "blocked-preview" && value.status !== "review-ready-after-evidence") errors.push("assist-language audio release review binding status is unsupported");
  for (const field of ["linkedRecords", "scopeDrift", "blockingReasons", "nextGate"] as const) {
    const values = value[field];
    if (!Array.isArray(values) || values.some((item) => !isNonEmptyString(item)) || new Set(values).size !== values.length) {
      errors.push(`assist-language audio release review binding ${field} must be a unique string array`);
    }
  }
  const linkedRecords = Array.isArray(value.linkedRecords) ? value.linkedRecords : [];
  for (const record of requiredLinkedRecords) if (!linkedRecords.includes(record)) errors.push(`assist-language audio release review binding must link ${record}`);
  const blockedActions = [
    "No approval capture",
    "No production approval",
    "No package promotion",
    "No student production launch",
    "No catalog admission",
    "No student-facing assist audio",
  ];
  for (const action of blockedActions) if (!linkedRecords.includes(action) && !String(value.blockingReasons ?? []).includes(action)) {
    errors.push(`assist-language audio release review binding must preserve ${action}`);
  }
  for (const field of ["approvalCaptureAllowed", "productionApprovalAllowed", "packagePromotionAllowed", "studentProductionLaunchAllowed"] as const) {
    if (value[field] !== false) errors.push(`assist-language audio release review binding ${field} must remain false`);
  }
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("assist-language audio release review binding must remain review-only with no side effect");
  return [...new Set(errors)];
}

export const ASSIST_LANGUAGE_AUDIO_RELEASE_REVIEW_REQUIRED_RECORDS = requiredLinkedRecords;
export const ASSIST_LANGUAGE_AUDIO_RELEASE_REVIEW_BLOCKED_ACTIONS = requiredBlockedActions;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
