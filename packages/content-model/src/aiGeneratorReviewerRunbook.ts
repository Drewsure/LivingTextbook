import type { AiGeneratorReviewSummarySectionId } from "./aiGeneratorReviewSummary";

export type AiGeneratorReviewerRunbookStatus = "review-only" | "blocked";

export interface AiGeneratorReviewerRunbookStep {
  stepId: string;
  order: number;
  label: string;
  sectionId: AiGeneratorReviewSummarySectionId;
  objective: string;
  evidenceToReview: string[];
  requiredRecord: string;
  blockedShortcuts: string[];
}

export interface AiGeneratorReviewerRunbook {
  runbookId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiGeneratorReviewerRunbookStatus;
  summary: string;
  standingRules: string[];
  steps: AiGeneratorReviewerRunbookStep[];
}

export const AI_GENERATOR_REVIEWER_RUNBOOK_REQUIRED_STEP_SECTIONS: AiGeneratorReviewSummarySectionId[] = [
  "generator-request",
  "prototype-review",
  "integration-gates",
  "package-review",
  "draft-repair",
];

export const AI_GENERATOR_REVIEWER_RUNBOOK_REQUIRED_STANDING_RULES = [
  "Reviewer runbook is guidance only",
  "Detailed source records remain authoritative",
  "No live model call",
  "No app patch generation",
  "No package assembly",
  "No route or playlist creation",
  "No student assignment",
] as const;

export function validateAiGeneratorReviewerRunbook(runbook: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(runbook)) {
    return ["AI generator reviewer runbook must be a JSON object."];
  }

  const runbookId = readString(runbook, "runbookId");
  const tenantId = readString(runbook, "tenantId");
  const requestId = readString(runbook, "requestId");
  const status = readString(runbook, "status");
  const standingRules = readStringArray(runbook, "standingRules");
  const steps = readRunbookSteps(runbook);
  const stepSections = steps.map((step) => step.sectionId);

  if (!runbookId || !tenantId || !requestId) {
    errors.push("AI generator reviewer runbook must include runbookId, tenantId, and requestId.");
  }

  if (status !== "review-only") {
    errors.push("AI generator reviewer runbook must stay review-only.");
  }

  for (const requiredRule of AI_GENERATOR_REVIEWER_RUNBOOK_REQUIRED_STANDING_RULES) {
    if (!standingRules.includes(requiredRule)) {
      errors.push(`AI generator reviewer runbook must include standing rule: ${requiredRule}.`);
    }
  }

  for (const requiredSection of AI_GENERATOR_REVIEWER_RUNBOOK_REQUIRED_STEP_SECTIONS) {
    if (!stepSections.includes(requiredSection)) {
      errors.push(`AI generator reviewer runbook must include review step for: ${requiredSection}.`);
    }
  }

  const sortedOrders = steps.map((step) => step.order).sort((first, second) => first - second);
  const expectedOrders = Array.from({ length: steps.length }, (_, index) => index + 1);

  if (sortedOrders.join(",") !== expectedOrders.join(",")) {
    errors.push("AI generator reviewer runbook steps must use a contiguous human review order.");
  }

  for (const step of steps) {
    if (!step.stepId || !step.label || !step.objective || !step.requiredRecord) {
      errors.push("AI generator reviewer runbook steps must include id, label, objective, and required record.");
    }

    if (!AI_GENERATOR_REVIEWER_RUNBOOK_REQUIRED_STEP_SECTIONS.includes(step.sectionId)) {
      errors.push(`AI generator reviewer runbook step uses an unknown review section: ${step.sectionId}.`);
    }

    if (step.evidenceToReview.length === 0 || step.blockedShortcuts.length === 0) {
      errors.push("AI generator reviewer runbook steps must include evidence to review and blocked shortcuts.");
    }
  }

  return errors;
}

export function getAiGeneratorReviewerRunbookWarnings(runbook: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(runbook)) {
    return warnings;
  }

  const summary = readString(runbook, "summary").toLowerCase();
  const standingRules = readStringArray(runbook, "standingRules").join(" ").toLowerCase();

  if (!summary.includes("human review order")) {
    warnings.push("AI generator reviewer runbook should state that it is a human review order.");
  }

  if (summary.includes("japanese") && !standingRules.includes("support-language trigger")) {
    warnings.push("MiniStar AI generator reviewer runbook should block Japanese support-language triggers.");
  }

  return warnings;
}

export function validateAiGeneratorReviewerRunbooks(runbooks: unknown[]): string[] {
  return runbooks.flatMap((runbook) => validateAiGeneratorReviewerRunbook(runbook));
}

export function getAiGeneratorReviewerRunbookCollectionWarnings(runbooks: unknown[]): string[] {
  return runbooks.flatMap((runbook) => getAiGeneratorReviewerRunbookWarnings(runbook));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function readRunbookSteps(source: Record<string, unknown>): AiGeneratorReviewerRunbookStep[] {
  const value = source.steps;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((step) => ({
    stepId: readString(step, "stepId"),
    order: readNumber(step, "order"),
    label: readString(step, "label"),
    sectionId: readSectionId(step),
    objective: readString(step, "objective"),
    evidenceToReview: readStringArray(step, "evidenceToReview"),
    requiredRecord: readString(step, "requiredRecord"),
    blockedShortcuts: readStringArray(step, "blockedShortcuts"),
  }));
}

function readSectionId(source: Record<string, unknown>): AiGeneratorReviewSummarySectionId {
  return readString(source, "sectionId") as AiGeneratorReviewSummarySectionId;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
