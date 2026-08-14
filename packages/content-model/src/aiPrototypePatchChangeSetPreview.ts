export type AiPrototypePatchChangeSetPreviewStatus =
  | "blocked"
  | "review-only"
  | "ready-for-change-set-review";

export interface AiPrototypePatchFileChangePreview {
  filePath: string;
  action: string;
  fileGroup: string;
  purpose: string;
  guardrail: string;
}

export interface AiPrototypePatchChangeSetPreview {
  changeSetId: string;
  tenantId: string;
  requestId: string;
  workOrderId: string;
  label: string;
  status: AiPrototypePatchChangeSetPreviewStatus;
  summary: string;
  plannedFileChanges: AiPrototypePatchFileChangePreview[];
  invariantChecks: string[];
  reviewBlockers: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_PATCH_CHANGE_SET_REQUIRED_FILE_GROUPS = [
  "Removable wrapper adapter",
  "Reviewed fixture mapping",
  "Standard event replay test",
  "Audio coverage assertion file",
  "Rollback and decision notes",
] as const;

export const AI_PROTOTYPE_PATCH_CHANGE_SET_INVARIANTS = [
  "Wrapper-first integration only",
  "Target-language progress only",
  "Parent engine owns scoring",
  "No route registry mutation",
  "No reward inventory write",
  "No audio manifest mutation",
  "No student-facing route",
] as const;

export const AI_PROTOTYPE_PATCH_CHANGE_SET_REVIEW_BLOCKERS = [
  "Patch change set storage contract missing",
  "Accepted work order execution record missing",
  "Patch fixture archive missing",
  "Rollback snapshot missing",
  "Human reviewer sign-off missing",
] as const;

export const AI_PROTOTYPE_PATCH_CHANGE_SET_BLOCKED_ACTIONS = [
  "No apply patch",
  "No app patch write",
  "No generated file write",
  "No test execution",
  "No Playwright run",
  "No route creation",
  "No scoring or reward mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No assignment",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_PATCH_CHANGE_SET_NEXT_RECORDS = [
  "Patch change set storage contract",
  "Work order execution authorization",
  "Patch fixture archive",
  "Rollback snapshot record",
  "Human reviewer sign-off record",
] as const;

export function validateAiPrototypePatchChangeSetPreview(preview: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(preview)) {
    return ["AI prototype patch change set preview must be a JSON object."];
  }

  const changeSetId = readString(preview, "changeSetId");
  const tenantId = readString(preview, "tenantId");
  const requestId = readString(preview, "requestId");
  const workOrderId = readString(preview, "workOrderId");
  const label = readString(preview, "label");
  const status = readString(preview, "status");
  const summary = readString(preview, "summary");
  const plannedFileChanges = readFileChanges(preview, "plannedFileChanges");
  const invariantChecks = readStringArray(preview, "invariantChecks");
  const reviewBlockers = readStringArray(preview, "reviewBlockers");
  const blockedActions = readStringArray(preview, "blockedActions");
  const nextRequiredRecords = readStringArray(preview, "nextRequiredRecords");

  if (!changeSetId || !tenantId || !requestId || !workOrderId) {
    errors.push(
      "AI prototype patch change set preview must include changeSetId, tenantId, requestId, and workOrderId.",
    );
  }

  if (!label.toLowerCase().includes("patch change set preview")) {
    errors.push("AI prototype patch change set preview label must name the change set preview.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-change-set-review") {
    errors.push("AI prototype patch change set preview must use a supported review-only status.");
  }

  if (!summary.toLowerCase().includes("blocked")) {
    errors.push("AI prototype patch change set preview summary must keep patch changes blocked.");
  }

  for (const fileGroup of AI_PROTOTYPE_PATCH_CHANGE_SET_REQUIRED_FILE_GROUPS) {
    if (!plannedFileChanges.some((change) => change.fileGroup === fileGroup)) {
      errors.push(`AI prototype patch change set preview must include file group: ${fileGroup}.`);
    }
  }

  for (const change of plannedFileChanges) {
    if (!change.filePath || !change.action || !change.purpose || !change.guardrail) {
      errors.push(`AI prototype patch change set preview file change must include full evidence: ${change.fileGroup}.`);
    }

    if (!change.action.includes("future")) {
      errors.push(`AI prototype patch change set preview file action must remain future-only: ${change.filePath}.`);
    }
  }

  for (const invariant of AI_PROTOTYPE_PATCH_CHANGE_SET_INVARIANTS) {
    if (!invariantChecks.includes(invariant)) {
      errors.push(`AI prototype patch change set preview must include invariant: ${invariant}.`);
    }
  }

  for (const blocker of AI_PROTOTYPE_PATCH_CHANGE_SET_REVIEW_BLOCKERS) {
    if (!reviewBlockers.includes(blocker)) {
      errors.push(`AI prototype patch change set preview must include review blocker: ${blocker}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_PATCH_CHANGE_SET_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype patch change set preview must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_PATCH_CHANGE_SET_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype patch change set preview must include next required record: ${nextRecord}.`);
    }
  }

  if (
    tenantId === "ministar" &&
    (!invariantChecks.includes("No Japanese support-language progress trigger") ||
      !invariantChecks.includes("Foundation Japanese remains hiragana-only"))
  ) {
    errors.push("MiniStar AI prototype patch change set preview must preserve hiragana support-only evidence.");
  }

  return errors;
}

export function getAiPrototypePatchChangeSetPreviewWarnings(preview: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(preview)) {
    return warnings;
  }

  const status = readString(preview, "status");
  const plannedFileChanges = readFileChanges(preview, "plannedFileChanges");
  const blockedActions = readStringArray(preview, "blockedActions");

  if (status === "ready-for-change-set-review" && textListIncludes(blockedActions, "No apply patch")) {
    warnings.push("A ready-for-change-set-review preview still cannot apply a patch.");
  }

  if (!plannedFileChanges.some((change) => change.guardrail.includes("Parent engine"))) {
    warnings.push("Patch change set previews should preserve parent-engine authority in at least one guardrail.");
  }

  if (!textListIncludes(blockedActions, "No support-language progress trigger")) {
    warnings.push("Patch change set previews should block support-language progress triggers.");
  }

  return warnings;
}

export function validateAiPrototypePatchChangeSetPreviews(previews: unknown[]): string[] {
  return previews.flatMap((preview) => validateAiPrototypePatchChangeSetPreview(preview));
}

export function getAiPrototypePatchChangeSetPreviewCollectionWarnings(previews: unknown[]): string[] {
  return previews.flatMap((preview) => getAiPrototypePatchChangeSetPreviewWarnings(preview));
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

function readFileChanges(source: Record<string, unknown>, key: string): AiPrototypePatchFileChangePreview[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    filePath: readString(item, "filePath"),
    action: readString(item, "action"),
    fileGroup: readString(item, "fileGroup"),
    purpose: readString(item, "purpose"),
    guardrail: readString(item, "guardrail"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
