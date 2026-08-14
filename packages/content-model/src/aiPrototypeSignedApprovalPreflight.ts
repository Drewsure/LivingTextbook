export type AiPrototypeSignedApprovalPreflightStatus =
  | "blocked"
  | "review-only"
  | "ready-for-signature-policy-review";

export interface AiPrototypeSignedApprovalPreflight {
  preflightId: string;
  tenantId: string;
  requestId: string;
  decisionId: string;
  label: string;
  status: AiPrototypeSignedApprovalPreflightStatus;
  summary: string;
  requiredIdentityLanes: string[];
  scopeLocks: string[];
  approvalRecordDraftFields: string[];
  evidenceChecklist: string[];
  cannotApproveWhile: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_IDENTITY_LANES = [
  "Authenticated reviewer identity",
  "Tenant role binding",
  "Codex reviewer acknowledgement",
  "School or publisher approval policy",
  "Timestamped approval intent",
] as const;

export const AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_SCOPE_LOCKS = [
  "Patch scope must match Codex decision",
  "Route scope must match route safety release gate",
  "Rollback scope must match rollback drill record",
  "Storage scope must match hosted/local storage contract",
  "Student-facing route scope remains blocked",
  "Support-language evidence is support-only",
] as const;

export const AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_DRAFT_FIELDS = [
  "signed_approval_preflight_id",
  "tenant_id",
  "request_id",
  "codex_patch_approval_decision_id",
  "reviewer_identity_id",
  "reviewer_role",
  "approval_scope",
  "approval_intent_text",
  "evidence_packet_ids",
  "route_safety_release_gate_id",
  "rollback_drill_record_id",
  "storage_contract_verification_id",
  "support_language_progress_allowed",
  "student_facing_route_allowed",
  "timestamp",
] as const;

export const AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_EVIDENCE_CHECKLIST = [
  "Approval cannot bypass evidence",
  "Patch file scope reviewed",
  "Patch test readiness reviewed",
  "Harness plan and implementation proposal reviewed",
  "Route safety gate reviewed",
  "Rollback drill reviewed",
  "Storage contract verified",
  "Reviewer identity signature gate reviewed",
] as const;

export const AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_CANNOT_APPROVE_WHILE = [
  "Codex patch approval is unrecorded",
  "Reviewer identity is missing",
  "Signed approval policy is missing",
  "Route safety release gate is blocked",
  "Rollback drill record is blocked",
  "Storage contract verification is blocked",
  "Evidence attachments are unavailable",
  "Support-language progress trigger is possible",
] as const;

export const AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_BLOCKED_ACTIONS = [
  "No signed approval capture",
  "No approve button",
  "No app patch generation",
  "No app file write",
  "No test execution",
  "No Playwright run",
  "No route mutation",
  "No student-facing route",
  "No scoring or reward mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No assignment",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_NEXT_RECORDS = [
  "Signed approval preflight storage contract",
  "Reviewer identity signature gate",
  "Evidence attachment storage",
  "Route safety release gate",
  "Rollback drill record",
  "Storage contract verification",
] as const;

export function validateAiPrototypeSignedApprovalPreflight(preflight: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(preflight)) {
    return ["AI prototype signed approval preflight must be a JSON object."];
  }

  const preflightId = readString(preflight, "preflightId");
  const tenantId = readString(preflight, "tenantId");
  const requestId = readString(preflight, "requestId");
  const decisionId = readString(preflight, "decisionId");
  const label = readString(preflight, "label");
  const status = readString(preflight, "status");
  const summary = readString(preflight, "summary");
  const requiredIdentityLanes = readStringArray(preflight, "requiredIdentityLanes");
  const scopeLocks = readStringArray(preflight, "scopeLocks");
  const approvalRecordDraftFields = readStringArray(preflight, "approvalRecordDraftFields");
  const evidenceChecklist = readStringArray(preflight, "evidenceChecklist");
  const cannotApproveWhile = readStringArray(preflight, "cannotApproveWhile");
  const blockedActions = readStringArray(preflight, "blockedActions");
  const nextRequiredRecords = readStringArray(preflight, "nextRequiredRecords");

  if (!preflightId || !tenantId || !requestId || !decisionId) {
    errors.push(
      "AI prototype signed approval preflight must include preflightId, tenantId, requestId, and decisionId.",
    );
  }

  if (!label.toLowerCase().includes("signed approval preflight")) {
    errors.push("AI prototype signed approval preflight label must name the signed approval preflight.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-signature-policy-review") {
    errors.push("AI prototype signed approval preflight must use a supported review-only status.");
  }

  if (!summary.toLowerCase().includes("blocked")) {
    errors.push("AI prototype signed approval preflight summary must keep signed approval blocked.");
  }

  for (const lane of AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_IDENTITY_LANES) {
    if (!requiredIdentityLanes.includes(lane)) {
      errors.push(`AI prototype signed approval preflight must include identity lane: ${lane}.`);
    }
  }

  for (const scopeLock of AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_SCOPE_LOCKS) {
    if (!scopeLocks.includes(scopeLock)) {
      errors.push(`AI prototype signed approval preflight must include scope lock: ${scopeLock}.`);
    }
  }

  for (const draftField of AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_DRAFT_FIELDS) {
    if (!approvalRecordDraftFields.includes(draftField)) {
      errors.push(`AI prototype signed approval preflight must include draft field: ${draftField}.`);
    }
  }

  for (const evidenceItem of AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_EVIDENCE_CHECKLIST) {
    if (!evidenceChecklist.includes(evidenceItem)) {
      errors.push(`AI prototype signed approval preflight must include evidence item: ${evidenceItem}.`);
    }
  }

  for (const blocker of AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_CANNOT_APPROVE_WHILE) {
    if (!cannotApproveWhile.includes(blocker)) {
      errors.push(`AI prototype signed approval preflight must include cannot-approve blocker: ${blocker}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype signed approval preflight must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_SIGNED_APPROVAL_PREFLIGHT_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype signed approval preflight must include next required record: ${nextRecord}.`);
    }
  }

  if (tenantId === "ministar") {
    const ministarEvidence = [...scopeLocks, ...evidenceChecklist, summary];

    if (!textListIncludes(ministarEvidence, "hiragana-only") || !textListIncludes(ministarEvidence, "support-only")) {
      errors.push("MiniStar AI prototype signed approval preflight must include hiragana support-only evidence.");
    }
  }

  return errors;
}

export function getAiPrototypeSignedApprovalPreflightWarnings(preflight: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(preflight)) {
    return warnings;
  }

  const status = readString(preflight, "status");
  const approvalRecordDraftFields = readStringArray(preflight, "approvalRecordDraftFields");
  const blockedActions = readStringArray(preflight, "blockedActions");

  if (status === "ready-for-signature-policy-review" && textListIncludes(blockedActions, "No signed approval capture")) {
    warnings.push("A ready-for-signature-policy-review preflight still cannot capture signed approval.");
  }

  if (!approvalRecordDraftFields.includes("support_language_progress_allowed")) {
    warnings.push("Signed approval preflights should explicitly record support-language progress allowance.");
  }

  if (!textListIncludes(blockedActions, "No support-language progress trigger")) {
    warnings.push("Signed approval preflights should block support-language progress triggers.");
  }

  return warnings;
}

export function validateAiPrototypeSignedApprovalPreflights(preflights: unknown[]): string[] {
  return preflights.flatMap((preflight) => validateAiPrototypeSignedApprovalPreflight(preflight));
}

export function getAiPrototypeSignedApprovalPreflightCollectionWarnings(preflights: unknown[]): string[] {
  return preflights.flatMap((preflight) => getAiPrototypeSignedApprovalPreflightWarnings(preflight));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
