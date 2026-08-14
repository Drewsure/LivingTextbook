export type AiPrototypeCodexPatchApprovalDecisionStatus =
  | "blocked"
  | "review-only"
  | "ready-for-codex-approval-review";
export type AiPrototypeCodexPatchApprovalDecisionCheckStatus = "missing" | "blocked" | "pending-review" | "reviewed";

export interface AiPrototypeCodexPatchApprovalDecisionCheck {
  label: string;
  status: AiPrototypeCodexPatchApprovalDecisionCheckStatus;
  requiredRecord: string;
  evidenceNeeded: string;
}

export interface AiPrototypeCodexPatchApprovalDecision {
  decisionId: string;
  tenantId: string;
  requestId: string;
  proposalId: string;
  harnessPlanId: string;
  label: string;
  status: AiPrototypeCodexPatchApprovalDecisionStatus;
  selectedDecision: string;
  summary: string;
  sourceRecords: string[];
  checks: AiPrototypeCodexPatchApprovalDecisionCheck[];
  decisionOptions: string[];
  requiredBeforeDecision: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_SOURCE_RECORDS = [
  "ai_prototype_app_patch_proposal",
  "ai_prototype_patch_test_readiness_gate",
  "ai_prototype_patch_test_harness_plan",
  "ai_prototype_patch_harness_implementation_proposal",
  "route_safety_release_gate",
  "rollback_drill_record",
  "storage_contract_verification",
  "reviewer_identity_signature_gate",
  "codex_patch_approval_decision",
] as const;

export const AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_CHECK_LABELS = [
  "Patch file scope review",
  "Patch test readiness review",
  "Harness plan review",
  "Harness implementation proposal review",
  "Route safety release gate",
  "Rollback drill record",
  "Storage contract verification",
  "Reviewer identity signature gate",
] as const;

export const AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_OPTIONS = [
  "Keep patch blocked",
  "Approve patch planning only",
  "Return for evidence repair",
  "Reject patch scope",
] as const;

export const AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_REQUIRED_BEFORE_DECISION = [
  "Codex manual review completed",
  "Patch scope accepted",
  "Route safety gate accepted",
  "Rollback drill accepted",
  "Storage contract verified",
  "Reviewer identity signature gate accepted",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_BLOCKED_ACTIONS = [
  "No Codex patch approval",
  "No app file write",
  "No app patch generation",
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

export const AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_NEXT_RECORDS = [
  "Codex patch approval decision storage contract",
  "Reviewer identity signature gate",
  "Route safety release gate",
  "Rollback drill record",
  "Storage contract verification",
] as const;

export function validateAiPrototypeCodexPatchApprovalDecision(decision: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(decision)) {
    return ["AI prototype Codex patch approval decision must be a JSON object."];
  }

  const decisionId = readString(decision, "decisionId");
  const tenantId = readString(decision, "tenantId");
  const requestId = readString(decision, "requestId");
  const proposalId = readString(decision, "proposalId");
  const harnessPlanId = readString(decision, "harnessPlanId");
  const label = readString(decision, "label");
  const status = readString(decision, "status");
  const selectedDecision = readString(decision, "selectedDecision");
  const summary = readString(decision, "summary");
  const sourceRecords = readStringArray(decision, "sourceRecords");
  const checks = readCheckArray(decision, "checks");
  const decisionOptions = readStringArray(decision, "decisionOptions");
  const requiredBeforeDecision = readStringArray(decision, "requiredBeforeDecision");
  const blockedActions = readStringArray(decision, "blockedActions");
  const nextRequiredRecords = readStringArray(decision, "nextRequiredRecords");

  if (!decisionId || !tenantId || !requestId || !proposalId || !harnessPlanId) {
    errors.push(
      "AI prototype Codex patch approval decision must include decisionId, tenantId, requestId, proposalId, and harnessPlanId.",
    );
  }

  if (!label.toLowerCase().includes("patch approval decision")) {
    errors.push("AI prototype Codex patch approval decision label must name the patch approval decision.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-codex-approval-review") {
    errors.push("AI prototype Codex patch approval decision must use a supported review-only status.");
  }

  if (selectedDecision !== "No patch approval recorded") {
    errors.push("AI prototype Codex patch approval decision must keep selectedDecision as no approval recorded.");
  }

  if (!summary.toLowerCase().includes("blocked")) {
    errors.push("AI prototype Codex patch approval decision summary must keep approval blocked.");
  }

  for (const sourceRecord of AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype Codex patch approval decision must include source record: ${sourceRecord}.`);
    }
  }

  for (const checkLabel of AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_CHECK_LABELS) {
    if (!checks.some((check) => check.label === checkLabel)) {
      errors.push(`AI prototype Codex patch approval decision must include evidence check: ${checkLabel}.`);
    }
  }

  for (const check of checks) {
    if (
      check.status !== "missing" &&
      check.status !== "blocked" &&
      check.status !== "pending-review" &&
      check.status !== "reviewed"
    ) {
      errors.push(`AI prototype Codex patch approval decision has unsupported check status: ${check.label}.`);
    }

    if (!check.requiredRecord || !check.evidenceNeeded) {
      errors.push(`AI prototype Codex patch approval decision check must name evidence and record: ${check.label}.`);
    }
  }

  for (const option of AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_OPTIONS) {
    if (!decisionOptions.includes(option)) {
      errors.push(`AI prototype Codex patch approval decision must include decision option: ${option}.`);
    }
  }

  for (const requirement of AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_REQUIRED_BEFORE_DECISION) {
    if (!requiredBeforeDecision.includes(requirement)) {
      errors.push(`AI prototype Codex patch approval decision must require before decision: ${requirement}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype Codex patch approval decision must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_CODEX_PATCH_APPROVAL_DECISION_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype Codex patch approval decision must include next required record: ${nextRecord}.`);
    }
  }

  if (
    tenantId === "ministar" &&
    !checks.some(
      (check) =>
        check.label === "MiniStar hiragana support boundary" &&
        check.evidenceNeeded.includes("hiragana-only") &&
        check.evidenceNeeded.includes("support-only"),
    )
  ) {
    errors.push("MiniStar AI prototype Codex patch approval decision must include hiragana support-only evidence.");
  }

  return errors;
}

export function getAiPrototypeCodexPatchApprovalDecisionWarnings(decision: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(decision)) {
    return warnings;
  }

  const status = readString(decision, "status");
  const selectedDecision = readString(decision, "selectedDecision");
  const blockedActions = readStringArray(decision, "blockedActions");
  const decisionOptions = readStringArray(decision, "decisionOptions");

  if (status === "ready-for-codex-approval-review" && selectedDecision === "No patch approval recorded") {
    warnings.push("A ready-for-codex-approval-review decision still needs a future signed approval workflow.");
  }

  if (!decisionOptions.includes("Return for evidence repair")) {
    warnings.push("Codex patch approval decisions should let reviewers return evidence for repair.");
  }

  if (!textListIncludes(blockedActions, "No support-language progress trigger")) {
    warnings.push("Codex patch approval decisions should block support-language progress triggers.");
  }

  return warnings;
}

export function validateAiPrototypeCodexPatchApprovalDecisions(decisions: unknown[]): string[] {
  return decisions.flatMap((decision) => validateAiPrototypeCodexPatchApprovalDecision(decision));
}

export function getAiPrototypeCodexPatchApprovalDecisionCollectionWarnings(decisions: unknown[]): string[] {
  return decisions.flatMap((decision) => getAiPrototypeCodexPatchApprovalDecisionWarnings(decision));
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

function readCheckArray(
  source: Record<string, unknown>,
  key: string,
): Array<{ label: string; status: string; requiredRecord: string; evidenceNeeded: string }> {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    label: readString(item, "label"),
    status: readString(item, "status"),
    requiredRecord: readString(item, "requiredRecord"),
    evidenceNeeded: readString(item, "evidenceNeeded"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
