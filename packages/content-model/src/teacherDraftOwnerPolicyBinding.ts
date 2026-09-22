export type TeacherDraftOwnerPolicyBindingStatus = "blocked" | "ready-review";

export interface TeacherDraftOwnerPolicyBinding {
  bindingId: string;
  tenantId: string;
  draftId: string;
  sourcePackageId: string;
  draftPersistencePreflightId: string;
  policyAcceptancePreflightId: string;
  acceptanceRecordPreviewId: string;
  mode: "review-only";
  status: TeacherDraftOwnerPolicyBindingStatus;
  authorizationScope: "tenant-scoped-review-only";
  ownerIdentityRequired: true;
  ownerIdentityBound: false;
  policyAcceptanceStatus: "not-accepted";
  schoolPolicyAccepted: false;
  providerNeutral: true;
  persistenceActivationAllowed: false;
  assignmentAllowed: false;
  blockedActions: string[];
  requiredEvidence: string[];
  blockers: string[];
  nextSteps: string[];
}

const REQUIRED_BLOCKED_ACTIONS = [
  "No owner authorization inferred from policy evidence",
  "No policy acceptance inferred from teacher authorization",
  "No persistence activation",
  "No direct student assignment",
  "No acceptance or signature capture",
] as const;

export function validateTeacherDraftOwnerPolicyBinding(binding: TeacherDraftOwnerPolicyBinding): string[] {
  const errors: string[] = [];
  for (const [field, value] of [
    ["bindingId", binding.bindingId], ["tenantId", binding.tenantId], ["draftId", binding.draftId],
    ["sourcePackageId", binding.sourcePackageId], ["draftPersistencePreflightId", binding.draftPersistencePreflightId],
    ["policyAcceptancePreflightId", binding.policyAcceptancePreflightId], ["acceptanceRecordPreviewId", binding.acceptanceRecordPreviewId],
  ] as const) if (typeof value !== "string" || value.trim().length === 0) errors.push(`Teacher draft owner-policy binding ${field} is required.`);
  if (binding.mode !== "review-only") errors.push("Teacher draft owner-policy binding must remain review-only.");
  if (binding.status !== "blocked" && binding.status !== "ready-review") errors.push("Teacher draft owner-policy binding has an unsupported status.");
  if (binding.authorizationScope !== "tenant-scoped-review-only") errors.push("Teacher draft owner-policy binding must use tenant-scoped review-only authorization.");
  if (binding.ownerIdentityRequired !== true) errors.push("Teacher draft owner-policy binding must require owner identity.");
  if (binding.policyAcceptanceStatus !== "not-accepted") errors.push("Teacher draft owner-policy binding policy status must remain not-accepted.");
  if (binding.providerNeutral !== true) errors.push("Teacher draft owner-policy binding must remain provider-neutral.");
  for (const [field, value] of [["ownerIdentityBound", binding.ownerIdentityBound], ["schoolPolicyAccepted", binding.schoolPolicyAccepted], ["persistenceActivationAllowed", binding.persistenceActivationAllowed], ["assignmentAllowed", binding.assignmentAllowed]] as const) {
    if (value !== false) errors.push(`Teacher draft owner-policy binding ${field} must remain false.`);
  }
  for (const [field, values] of [["blockedActions", binding.blockedActions], ["requiredEvidence", binding.requiredEvidence], ["blockers", binding.blockers], ["nextSteps", binding.nextSteps]] as const) {
    if (!Array.isArray(values) || values.some((value) => typeof value !== "string" || !value.trim())) errors.push(`Teacher draft owner-policy binding ${field} must contain non-blank strings.`);
  }
  for (const action of REQUIRED_BLOCKED_ACTIONS) if (!binding.blockedActions.includes(action)) errors.push(`Teacher draft owner-policy binding must block: ${action}.`);
  if (binding.status === "blocked" && binding.blockers.length === 0) errors.push("Blocked teacher draft owner-policy binding must state at least one blocker.");
  return [...new Set(errors)];
}

export function validateTeacherDraftOwnerPolicyBindingSources(binding: unknown, draftPreflight: unknown, policyPreflight: unknown, acceptancePreview: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(binding)) return ["Teacher draft owner-policy source binding requires a binding."];
  if (!isRecord(draftPreflight)) return ["Teacher draft owner-policy source binding requires a draft persistence preflight."];
  if (!isRecord(policyPreflight)) return ["Teacher draft owner-policy source binding requires a school policy preflight."];
  if (!isRecord(acceptancePreview)) return ["Teacher draft owner-policy source binding requires an acceptance record preview."];
  for (const [left, right, message] of [
    [binding.tenantId, draftPreflight.tenantId, "Binding tenant must match draft persistence preflight."],
    [binding.draftId, draftPreflight.draftId, "Binding draft must match draft persistence preflight."],
    [binding.sourcePackageId, draftPreflight.sourcePackageId, "Binding package must match draft persistence preflight."],
    [binding.draftPersistencePreflightId, draftPreflight.preflightId, "Binding must match draft persistence preflight id."],
    [binding.policyAcceptancePreflightId, policyPreflight.preflightId, "Binding must match school policy preflight id."],
    [binding.acceptanceRecordPreviewId, acceptancePreview.previewId, "Binding must match acceptance record preview id."],
    [binding.tenantId, policyPreflight.tenantId, "Binding tenant must match school policy preflight."],
    [binding.sourcePackageId, policyPreflight.packageId, "Binding package must match school policy preflight."],
    [binding.tenantId, acceptancePreview.tenantId, "Binding tenant must match acceptance record preview."],
    [binding.sourcePackageId, acceptancePreview.packageId, "Binding package must match acceptance record preview."],
  ] as const) if (!isNonBlankString(left) || !isNonBlankString(right) || left !== right) errors.push(message);
  if (policyPreflight.acceptanceStatus !== "Acceptance blocked") errors.push("Binding requires school policy preflight acceptance to remain blocked.");
  if (acceptancePreview.statusLabel !== "Acceptance record blocked") errors.push("Binding requires acceptance record preview to remain blocked.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
function isNonBlankString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
