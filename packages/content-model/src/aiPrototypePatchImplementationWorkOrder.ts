export type AiPrototypePatchImplementationWorkOrderStatus =
  | "blocked"
  | "review-only"
  | "ready-for-work-order-review";

export interface AiPrototypePatchImplementationWorkOrder {
  workOrderId: string;
  tenantId: string;
  requestId: string;
  lockId: string;
  label: string;
  status: AiPrototypePatchImplementationWorkOrderStatus;
  summary: string;
  requiredBeforeWork: string[];
  allowedFutureFileGroups: string[];
  dryRunVerificationOrder: string[];
  rollbackPlan: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_REQUIRED_BEFORE_WORK = [
  "Signed approval acceptance record",
  "Patch authorization release lock accepted",
  "Release-control binding accepted",
  "Accepted patch test evidence packet",
  "Accepted route safety release gate",
  "Accepted rollback drill record",
  "Accepted storage contract verification",
  "Reviewer identity signature accepted",
] as const;

export const AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_ALLOWED_FILE_GROUPS = [
  "One removable wrapper adapter file",
  "One reviewed fixture mapping file",
  "One standard event replay test file",
  "One audio coverage assertion file",
  "One mobile accessibility smoke-check file",
  "One rollback map update",
] as const;

export const AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_DRY_RUN_ORDER = [
  "Confirm current branch and release-control state",
  "Confirm patch scope matches approval record",
  "Replay reviewed fixture input",
  "Replay standard progress events",
  "Verify target-language audio coverage",
  "Verify mobile layout and tap targets",
  "Verify deterministic scoring only",
  "Verify rollback map before any commit",
] as const;

export const AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_ROLLBACK_PLAN = [
  "Pre-write snapshot required",
  "Patch scope checksum required",
  "Route registry unchanged unless explicitly authorized",
  "Audio manifest unchanged unless explicitly authorized",
  "Rollback command rehearsal required",
  "Post-rollback route smoke required",
  "Decision register entry required",
] as const;

export const AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_BLOCKED_ACTIONS = [
  "No work order execution",
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

export const AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_NEXT_RECORDS = [
  "Patch implementation work order storage contract",
  "Patch change set preview",
  "Signed approval acceptance record",
  "Release-control binding acceptance",
  "Accepted patch test evidence packet",
  "Accepted route safety release gate",
  "Accepted rollback drill record",
] as const;

export function validateAiPrototypePatchImplementationWorkOrder(workOrder: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(workOrder)) {
    return ["AI prototype patch implementation work order must be a JSON object."];
  }

  const workOrderId = readString(workOrder, "workOrderId");
  const tenantId = readString(workOrder, "tenantId");
  const requestId = readString(workOrder, "requestId");
  const lockId = readString(workOrder, "lockId");
  const label = readString(workOrder, "label");
  const status = readString(workOrder, "status");
  const summary = readString(workOrder, "summary");
  const requiredBeforeWork = readStringArray(workOrder, "requiredBeforeWork");
  const allowedFutureFileGroups = readStringArray(workOrder, "allowedFutureFileGroups");
  const dryRunVerificationOrder = readStringArray(workOrder, "dryRunVerificationOrder");
  const rollbackPlan = readStringArray(workOrder, "rollbackPlan");
  const blockedActions = readStringArray(workOrder, "blockedActions");
  const nextRequiredRecords = readStringArray(workOrder, "nextRequiredRecords");

  if (!workOrderId || !tenantId || !requestId || !lockId) {
    errors.push("AI prototype patch implementation work order must include workOrderId, tenantId, requestId, and lockId.");
  }

  if (!label.toLowerCase().includes("patch implementation work order")) {
    errors.push("AI prototype patch implementation work order label must name the implementation work order.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-work-order-review") {
    errors.push("AI prototype patch implementation work order must use a supported review-only status.");
  }

  if (!summary.toLowerCase().includes("blocked")) {
    errors.push("AI prototype patch implementation work order summary must keep work blocked.");
  }

  for (const requirement of AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_REQUIRED_BEFORE_WORK) {
    if (!requiredBeforeWork.includes(requirement)) {
      errors.push(`AI prototype patch implementation work order must include required-before-work item: ${requirement}.`);
    }
  }

  for (const fileGroup of AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_ALLOWED_FILE_GROUPS) {
    if (!allowedFutureFileGroups.includes(fileGroup)) {
      errors.push(`AI prototype patch implementation work order must include allowed file group: ${fileGroup}.`);
    }
  }

  for (const dryRunStep of AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_DRY_RUN_ORDER) {
    if (!dryRunVerificationOrder.includes(dryRunStep)) {
      errors.push(`AI prototype patch implementation work order must include dry-run step: ${dryRunStep}.`);
    }
  }

  for (const rollbackStep of AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_ROLLBACK_PLAN) {
    if (!rollbackPlan.includes(rollbackStep)) {
      errors.push(`AI prototype patch implementation work order must include rollback step: ${rollbackStep}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype patch implementation work order must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_PATCH_IMPLEMENTATION_WORK_ORDER_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype patch implementation work order must include next required record: ${nextRecord}.`);
    }
  }

  if (
    tenantId === "ministar" &&
    (!requiredBeforeWork.includes("Foundation Japanese support boundary accepted") ||
      !dryRunVerificationOrder.includes("Verify English remains the only progress trigger") ||
      !textListIncludes([summary], "hiragana support-only"))
  ) {
    errors.push("MiniStar AI prototype patch implementation work order must preserve hiragana support-only evidence.");
  }

  return errors;
}

export function getAiPrototypePatchImplementationWorkOrderWarnings(workOrder: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(workOrder)) {
    return warnings;
  }

  const status = readString(workOrder, "status");
  const allowedFutureFileGroups = readStringArray(workOrder, "allowedFutureFileGroups");
  const blockedActions = readStringArray(workOrder, "blockedActions");

  if (status === "ready-for-work-order-review" && textListIncludes(blockedActions, "No work order execution")) {
    warnings.push("A ready-for-work-order-review record still cannot execute the work order.");
  }

  if (!textListIncludes(allowedFutureFileGroups, "One removable wrapper adapter file")) {
    warnings.push("Patch implementation work orders should keep wrapper adapter scope removable.");
  }

  if (!textListIncludes(blockedActions, "No support-language progress trigger")) {
    warnings.push("Patch implementation work orders should block support-language progress triggers.");
  }

  return warnings;
}

export function validateAiPrototypePatchImplementationWorkOrders(workOrders: unknown[]): string[] {
  return workOrders.flatMap((workOrder) => validateAiPrototypePatchImplementationWorkOrder(workOrder));
}

export function getAiPrototypePatchImplementationWorkOrderCollectionWarnings(workOrders: unknown[]): string[] {
  return workOrders.flatMap((workOrder) => getAiPrototypePatchImplementationWorkOrderWarnings(workOrder));
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
