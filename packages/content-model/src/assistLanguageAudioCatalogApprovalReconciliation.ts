export type AssistLanguageAudioCatalogApprovalReconciliationStatus = "blocked-preview" | "reconciliation-review-ready";

export interface AssistLanguageAudioCatalogApprovalReconciliation {
  reconciliationId: string;
  approvalPacketId: string;
  tenantId: string;
  packageId: string;
  unitKey: string;
  catalogRecordIds: string[];
  evidenceRecordIds: string[];
  linkedStorageRecords: string[];
  identityChecks: string[];
  identityDrift: string[];
  unresolvedEvidence: string[];
  blockedActions: string[];
  status: AssistLanguageAudioCatalogApprovalReconciliationStatus;
  approvalDecision: "not-recorded";
  reconciliationComplete: false;
  approvalCaptureAllowed: false;
  catalogAdmissionAllowed: false;
  promotionAllowed: false;
  studentFacingAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const requiredIdentityChecks = [
  "Approval packet tenant matches every catalog record",
  "Approval packet package matches every catalog record",
  "Approval packet unit matches every catalog record",
  "Catalog record identities are unique and complete",
] as const;

const requiredLinkedStorageRecords = [
  "assist_language_audio_catalog_admission",
  "teacher_approval_ledger",
  "media_rights_evidence_attachment",
  "local_or_hosted_delivery_binding",
] as const;

const requiredBlockedActions = [
  "No approval capture",
  "No catalog admission",
  "No hosted media promotion",
  "No local bundle activation",
  "No student-facing assist audio",
  "No speech API billing",
] as const;

export function createReviewOnlyAssistLanguageAudioCatalogApprovalReconciliation(
  input: Omit<
    AssistLanguageAudioCatalogApprovalReconciliation,
    "reconciliationId" | "reconciliationComplete" | "approvalCaptureAllowed" | "catalogAdmissionAllowed" | "promotionAllowed" | "studentFacingAllowed" | "mode" | "sideEffect"
  >,
): AssistLanguageAudioCatalogApprovalReconciliation {
  const reconciliation: AssistLanguageAudioCatalogApprovalReconciliation = {
    ...input,
    reconciliationId: `${input.approvalPacketId}:${input.packageId}:${input.unitKey}`,
    reconciliationComplete: false,
    approvalCaptureAllowed: false,
    catalogAdmissionAllowed: false,
    promotionAllowed: false,
    studentFacingAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateAssistLanguageAudioCatalogApprovalReconciliation(reconciliation);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return reconciliation;
}

export function validateAssistLanguageAudioCatalogApprovalReconciliation(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["assist-language audio catalog approval reconciliation must be an object"];

  for (const field of ["reconciliationId", "approvalPacketId", "tenantId", "packageId", "unitKey", "approvalDecision", "mode", "sideEffect"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`assist-language audio catalog approval reconciliation ${field} is required`);
  }
  if (value.approvalDecision !== "not-recorded") errors.push("assist-language audio catalog approval reconciliation decision must remain not-recorded");
  if (value.status !== "blocked-preview" && value.status !== "reconciliation-review-ready") errors.push("assist-language audio catalog approval reconciliation status is unsupported");
  for (const field of ["catalogRecordIds", "evidenceRecordIds", "linkedStorageRecords", "identityChecks", "unresolvedEvidence", "blockedActions"] as const) {
    const values = value[field];
    if (!Array.isArray(values) || values.length === 0 || values.some((item) => !isNonEmptyString(item))) {
      errors.push(`assist-language audio catalog approval reconciliation ${field} must contain non-empty strings`);
    } else if (new Set(values).size !== values.length) {
      errors.push(`assist-language audio catalog approval reconciliation ${field} must not contain duplicates`);
    }
  }
  const identityDrift = value.identityDrift;
  if (!Array.isArray(identityDrift) || identityDrift.some((item) => !isNonEmptyString(item)) || new Set(identityDrift).size !== identityDrift.length) {
    errors.push("assist-language audio catalog approval reconciliation identityDrift must be a unique string array");
  }
  const identityChecks = Array.isArray(value.identityChecks) ? value.identityChecks : [];
  for (const check of requiredIdentityChecks) if (!identityChecks.includes(check)) errors.push(`assist-language audio catalog approval reconciliation must include ${check}`);
  const linkedStorageRecords = Array.isArray(value.linkedStorageRecords) ? value.linkedStorageRecords : [];
  for (const record of requiredLinkedStorageRecords) if (!linkedStorageRecords.includes(record)) errors.push(`assist-language audio catalog approval reconciliation must link ${record}`);
  const blockedActions = Array.isArray(value.blockedActions) ? value.blockedActions : [];
  for (const action of requiredBlockedActions) if (!blockedActions.includes(action)) errors.push(`assist-language audio catalog approval reconciliation must block ${action}`);
  for (const field of ["reconciliationComplete", "approvalCaptureAllowed", "catalogAdmissionAllowed", "promotionAllowed", "studentFacingAllowed"] as const) {
    if (value[field] !== false) errors.push(`assist-language audio catalog approval reconciliation ${field} must remain false`);
  }
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("assist-language audio catalog approval reconciliation must remain review-only with no side effect");
  return [...new Set(errors)];
}

export const ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_REQUIRED_RECORDS = requiredLinkedStorageRecords;
export const ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_IDENTITY_CHECKS = requiredIdentityChecks;
export const ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_BLOCKED_ACTIONS = requiredBlockedActions;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
