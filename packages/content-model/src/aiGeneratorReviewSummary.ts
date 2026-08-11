export type AiGeneratorReviewSummaryStatus = "review-only" | "blocked" | "missing";

export type AiGeneratorReviewSummarySectionId =
  | "generator-request"
  | "prototype-review"
  | "integration-gates"
  | "package-review"
  | "draft-repair";

export interface AiGeneratorReviewSummarySection {
  sectionId: AiGeneratorReviewSummarySectionId;
  label: string;
  status: AiGeneratorReviewSummaryStatus;
  summary: string;
  primaryBlocker: string;
  nextRequiredRecord: string;
  blockedActions: string[];
  sourceRecords: string[];
}

export interface AiGeneratorReviewSummary {
  summaryId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiGeneratorReviewSummaryStatus;
  currentBoundary: string;
  sections: AiGeneratorReviewSummarySection[];
}

export const AI_GENERATOR_REVIEW_SUMMARY_REQUIRED_SECTION_IDS: AiGeneratorReviewSummarySectionId[] = [
  "generator-request",
  "prototype-review",
  "integration-gates",
  "package-review",
  "draft-repair",
];

export const AI_GENERATOR_REVIEW_SUMMARY_REQUIRED_BLOCKED_KEYWORDS = [
  "live model",
  "app file",
  "package assembly",
  "route",
  "student assignment",
  "harness implementation",
  "auto-fix",
  "regenerate live ai",
] as const;

export function validateAiGeneratorReviewSummary(summary: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(summary)) {
    return ["AI generator review summary must be a JSON object."];
  }

  const summaryId = readString(summary, "summaryId");
  const tenantId = readString(summary, "tenantId");
  const requestId = readString(summary, "requestId");
  const status = readString(summary, "status");
  const currentBoundary = readString(summary, "currentBoundary");
  const sections = readSummarySections(summary);
  const sectionIds = sections.map((section) => section.sectionId);

  if (!summaryId || !tenantId || !requestId) {
    errors.push("AI generator review summary must include summaryId, tenantId, and requestId.");
  }

  if (!["review-only", "blocked", "missing"].includes(status)) {
    errors.push("AI generator review summary status must be review-only, blocked, or missing.");
  }

  if (sections.some((section) => section.status === "blocked") && status !== "blocked") {
    errors.push("AI generator review summary must stay blocked while any section is blocked.");
  }

  if (!currentBoundary.toLowerCase().includes("review-only")) {
    errors.push("AI generator review summary must state the current review-only boundary.");
  }

  for (const requiredSectionId of AI_GENERATOR_REVIEW_SUMMARY_REQUIRED_SECTION_IDS) {
    if (!sectionIds.includes(requiredSectionId)) {
      errors.push(`AI generator review summary must include section: ${requiredSectionId}.`);
    }
  }

  const blockedText = sections.flatMap((section) => section.blockedActions).join(" ").toLowerCase();

  for (const requiredKeyword of AI_GENERATOR_REVIEW_SUMMARY_REQUIRED_BLOCKED_KEYWORDS) {
    if (!blockedText.includes(requiredKeyword)) {
      errors.push(`AI generator review summary must keep blocked action coverage for: ${requiredKeyword}.`);
    }
  }

  for (const section of sections) {
    if (!section.label || !section.summary || !section.primaryBlocker || !section.nextRequiredRecord) {
      errors.push("AI generator review summary sections must include label, summary, primary blocker, and next record.");
    }

    if (section.blockedActions.length === 0 || section.sourceRecords.length === 0) {
      errors.push("AI generator review summary sections must include blocked actions and source records.");
    }
  }

  return errors;
}

export function getAiGeneratorReviewSummaryWarnings(summary: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(summary)) {
    return warnings;
  }

  const currentBoundary = readString(summary, "currentBoundary").toLowerCase();
  const sections = readSummarySections(summary);
  const sourceText = sections.flatMap((section) => section.sourceRecords).join(" ").toLowerCase();

  if (!sourceText.includes("ai_generated_package_writer_harness_implementation_decision")) {
    warnings.push("AI generator review summary should include package writer harness implementation decision source records.");
  }

  if (currentBoundary.includes("japanese") && !currentBoundary.includes("support-only")) {
    warnings.push("MiniStar AI generator review summary should keep Japanese support support-only.");
  }

  return warnings;
}

export function validateAiGeneratorReviewSummaries(summaries: unknown[]): string[] {
  return summaries.flatMap((summary) => validateAiGeneratorReviewSummary(summary));
}

export function getAiGeneratorReviewSummaryCollectionWarnings(summaries: unknown[]): string[] {
  return summaries.flatMap((summary) => getAiGeneratorReviewSummaryWarnings(summary));
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

function readSummarySections(source: Record<string, unknown>): AiGeneratorReviewSummarySection[] {
  const value = source.sections;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((section) => ({
    sectionId: readSectionId(section),
    label: readString(section, "label"),
    status: readSummaryStatus(section),
    summary: readString(section, "summary"),
    primaryBlocker: readString(section, "primaryBlocker"),
    nextRequiredRecord: readString(section, "nextRequiredRecord"),
    blockedActions: readStringArray(section, "blockedActions"),
    sourceRecords: readStringArray(section, "sourceRecords"),
  }));
}

function readSummaryStatus(source: Record<string, unknown>): AiGeneratorReviewSummaryStatus {
  const status = readString(source, "status");
  return status === "review-only" || status === "missing" ? status : "blocked";
}

function readSectionId(source: Record<string, unknown>): AiGeneratorReviewSummarySectionId {
  const sectionId = readString(source, "sectionId");
  return AI_GENERATOR_REVIEW_SUMMARY_REQUIRED_SECTION_IDS.includes(sectionId as AiGeneratorReviewSummarySectionId)
    ? (sectionId as AiGeneratorReviewSummarySectionId)
    : "draft-repair";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
