export type AiGeneratedPackageWriterHarnessImplementationDecisionStatus =
  | "blocked"
  | "review-only"
  | "ready-for-codex-review";

export interface AiGeneratedPackageWriterHarnessDecisionOption {
  optionId: string;
  label: string;
  effect: string;
  requiredBeforeSelection: string[];
  blockedActions: string[];
}

export interface AiGeneratedPackageWriterHarnessImplementationDecision {
  decisionId: string;
  tenantId: string;
  requestId: string;
  proposalId: string;
  harnessPlanId: string;
  label: string;
  status: AiGeneratedPackageWriterHarnessImplementationDecisionStatus;
  summary: string;
  decisionState: string;
  requiredEvidence: string[];
  fileScopeRules: string[];
  decisionOptions: AiGeneratedPackageWriterHarnessDecisionOption[];
  blockedActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_EVIDENCE_KEYWORDS = [
  "implementation proposal",
  "route and playlist",
  "local companion",
  "assignment shell",
  "rollback guard",
  "backend storage",
] as const;

export const AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_FILE_SCOPE_KEYWORDS = [
  "dry-run harness files",
  "cannot approve package writer",
  "cannot approve package json",
  "cannot approve mutation browser",
  "cannot bypass release-control",
] as const;

export const AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_OPTION_LABELS = [
  "Return for more evidence",
  "Reject harness scope",
  "Approve dry-run harness scope only",
] as const;

export const AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_NEXT_RECORDS = [
  "Harness implementation decision storage contract",
  "Reviewer identity signature gate",
  "Route and playlist write guard review",
  "Local companion package guard review",
  "Assignment shell guard review",
  "Rollback guard review",
  "Signed approval preflight",
] as const;

export const AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_BLOCKED_ACTIONS = [
  "No harness implementation approval",
  "No package writer harness code",
  "No automated writer test execution",
  "No writer mutation browser run",
  "No evidence upload",
  "No signed approval capture",
  "No app file patch",
  "No generated package JSON write",
  "No route registry write",
  "No media playlist write",
  "No local bundle packaging",
  "No assignment activation",
  "No production QR redirect mutation",
  "No support-language-only implementation decision",
] as const;

export function validateAiGeneratedPackageWriterHarnessImplementationDecision(
  decision: unknown,
): string[] {
  const errors: string[] = [];

  if (!isRecord(decision)) {
    return ["AI generated package writer harness implementation decision must be a JSON object."];
  }

  const decisionId = readString(decision, "decisionId");
  const tenantId = readString(decision, "tenantId");
  const requestId = readString(decision, "requestId");
  const proposalId = readString(decision, "proposalId");
  const harnessPlanId = readString(decision, "harnessPlanId");
  const status = readString(decision, "status");
  const decisionState = readString(decision, "decisionState");
  const requiredEvidence = readStringArray(decision, "requiredEvidence");
  const fileScopeRules = readStringArray(decision, "fileScopeRules");
  const decisionOptions = readDecisionOptions(decision);
  const blockedActions = readStringArray(decision, "blockedActions");
  const nextRequiredRecords = readStringArray(decision, "nextRequiredRecords");
  const supportLanguageBoundary = readStringArray(decision, "supportLanguageBoundary");

  if (!decisionId || !tenantId || !requestId || !proposalId || !harnessPlanId) {
    errors.push(
      "AI generated package writer harness implementation decision must include decisionId, tenantId, requestId, proposalId, and harnessPlanId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer harness implementation decision status must stay blocked.");
  }

  if (decisionState !== "No decision recorded") {
    errors.push("AI generated package writer harness implementation decision must keep No decision recorded.");
  }

  const evidenceText = requiredEvidence.join(" ").toLowerCase();
  const scopeText = fileScopeRules.join(" ").toLowerCase();
  const optionLabels = decisionOptions.map((option) => option.label);

  for (const requiredEvidence of AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_EVIDENCE_KEYWORDS) {
    if (!evidenceText.includes(requiredEvidence)) {
      errors.push(
        `AI generated package writer harness implementation decision must require evidence: ${requiredEvidence}.`,
      );
    }
  }

  for (const requiredScope of AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_FILE_SCOPE_KEYWORDS) {
    if (!scopeText.includes(requiredScope)) {
      errors.push(`AI generated package writer harness implementation decision must preserve scope: ${requiredScope}.`);
    }
  }

  for (const requiredLabel of AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_OPTION_LABELS) {
    if (!optionLabels.includes(requiredLabel)) {
      errors.push(`AI generated package writer harness implementation decision must include option: ${requiredLabel}.`);
    }
  }

  for (const requiredRecord of AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(requiredRecord)) {
      errors.push(
        `AI generated package writer harness implementation decision must require next record: ${requiredRecord}.`,
      );
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_HARNESS_DECISION_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(requiredAction)) {
      errors.push(`AI generated package writer harness implementation decision must block: ${requiredAction}.`);
    }
  }

  for (const option of decisionOptions) {
    if (!option.optionId || !option.label || !option.effect) {
      errors.push("AI generated package writer harness implementation decision options must be named and explained.");
    }

    if (option.requiredBeforeSelection.length === 0 || option.blockedActions.length === 0) {
      errors.push(
        `AI generated package writer harness implementation decision option ${option.label} must keep requirements and blocked actions.`,
      );
    }
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer harness implementation decision must preserve a support-language boundary.");
  }

  return errors;
}

export function getAiGeneratedPackageWriterHarnessImplementationDecisionWarnings(
  decision: unknown,
): string[] {
  const warnings: string[] = [];

  if (!isRecord(decision)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(decision, "nextRequiredRecords");

  if (!nextRequiredRecords.includes("Reviewer identity signature gate")) {
    warnings.push(
      "AI generated package writer harness implementation decision should require Reviewer identity signature gate.",
    );
  }

  if (!nextRequiredRecords.includes("Signed approval preflight")) {
    warnings.push("AI generated package writer harness implementation decision should require Signed approval preflight.");
  }

  if (!readString(decision, "summary").toLowerCase().includes("no codex decision")) {
    warnings.push("AI generated package writer harness implementation decision should state that no Codex decision exists.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterHarnessImplementationDecisions(
  decisions: unknown[],
): string[] {
  return decisions.flatMap((decision) =>
    validateAiGeneratedPackageWriterHarnessImplementationDecision(decision),
  );
}

export function getAiGeneratedPackageWriterHarnessImplementationDecisionCollectionWarnings(
  decisions: unknown[],
): string[] {
  return decisions.flatMap((decision) =>
    getAiGeneratedPackageWriterHarnessImplementationDecisionWarnings(decision),
  );
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

function readDecisionOptions(source: Record<string, unknown>): AiGeneratedPackageWriterHarnessDecisionOption[] {
  const value = source.decisionOptions;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((option) => ({
    optionId: readString(option, "optionId"),
    label: readString(option, "label"),
    effect: readString(option, "effect"),
    requiredBeforeSelection: readStringArray(option, "requiredBeforeSelection"),
    blockedActions: readStringArray(option, "blockedActions"),
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
