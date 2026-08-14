export type AiPrototypePatchTestHarnessPlanStatus = "blocked" | "review-only" | "ready-for-harness-design";
export type AiPrototypePatchHarnessSectionStatus = "blocked" | "needs-record" | "planned";

export interface AiPrototypePatchHarnessSection {
  sectionId: string;
  label: string;
  status: AiPrototypePatchHarnessSectionStatus;
  requiredInput: string;
  plannedChecks: string[];
  blockedActions: string[];
}

export interface AiPrototypePatchTestHarnessPlan {
  planId: string;
  tenantId: string;
  requestId: string;
  readinessGateId: string;
  label: string;
  status: AiPrototypePatchTestHarnessPlanStatus;
  summary: string;
  runtimePolicy: string[];
  requiredInputs: string[];
  harnessSections: AiPrototypePatchHarnessSection[];
  nonExecutionOutputs: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_PATCH_HARNESS_REQUIRED_INPUTS = [
  "ai_prototype_patch_test_readiness_gate",
  "ai_prototype_app_patch_proposal",
  "reviewed_unit_json_fixture",
  "standard_event_contract",
  "audio_cue_manifest",
  "game_scoring_profile_snapshot",
  "route_safety_release_gate",
  "rollback_drill_record",
  "storage_contract_verification",
  "codex_patch_approval_decision",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_REQUIRED_SECTION_IDS = [
  "fixture-replay-harness",
  "standard-event-harness",
  "audio-coverage-harness",
  "mobile-accessibility-harness",
  "deterministic-scoring-harness",
  "route-safety-harness",
  "storage-contract-harness",
  "rollback-dry-run-harness",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_NON_EXECUTION_OUTPUTS = [
  "Fixture test manifest",
  "Event assertion map",
  "Audio cue coverage checklist",
  "Mobile viewport checklist",
  "Scoring replay checklist",
  "Route safety smoke checklist",
  "Storage adapter checklist",
  "Rollback dry-run checklist",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_BLOCKED_ACTIONS = [
  "No test execution from this plan",
  "No Playwright run from this plan",
  "No app file write",
  "No app patch generation",
  "No route mutation",
  "No scoring or reward mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No assignment",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_NEXT_RECORDS = [
  "Patch harness implementation proposal",
  "Route safety release gate",
  "Rollback drill record",
  "Storage contract verification",
  "Codex patch approval decision",
] as const;

export function validateAiPrototypePatchTestHarnessPlan(plan: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(plan)) {
    return ["AI prototype patch test harness plan must be a JSON object."];
  }

  const planId = readString(plan, "planId");
  const tenantId = readString(plan, "tenantId");
  const requestId = readString(plan, "requestId");
  const readinessGateId = readString(plan, "readinessGateId");
  const label = readString(plan, "label");
  const status = readString(plan, "status");
  const summary = readString(plan, "summary");
  const runtimePolicy = readStringArray(plan, "runtimePolicy");
  const requiredInputs = readStringArray(plan, "requiredInputs");
  const harnessSections = readHarnessSections(plan);
  const nonExecutionOutputs = readStringArray(plan, "nonExecutionOutputs");
  const blockedActions = readStringArray(plan, "blockedActions");
  const nextRequiredRecords = readStringArray(plan, "nextRequiredRecords");

  if (!planId || !tenantId || !requestId || !readinessGateId) {
    errors.push("AI prototype patch test harness plan must include planId, tenantId, requestId, and readinessGateId.");
  }

  if (!label.includes("patch test harness plan")) {
    errors.push("AI prototype patch test harness plan label must name the patch test harness plan.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-harness-design") {
    errors.push("AI prototype patch test harness plan must use a supported review-only status.");
  }

  if (!summary.includes("patch harness design remains blocked") && !summary.includes("Patch harness design remains blocked")) {
    errors.push("AI prototype patch test harness plan summary must keep harness design blocked.");
  }

  if (!runtimePolicy.some((policy) => policy.includes("no runnable harness"))) {
    errors.push("AI prototype patch test harness plan must declare that no runnable harness is exposed.");
  }

  if (!runtimePolicy.some((policy) => policy.includes("Target-language events remain the only progress candidates"))) {
    errors.push("AI prototype patch test harness plan must preserve target-language progress policy.");
  }

  for (const requiredInput of AI_PROTOTYPE_PATCH_HARNESS_REQUIRED_INPUTS) {
    if (!requiredInputs.includes(requiredInput)) {
      errors.push(`AI prototype patch test harness plan must include required input: ${requiredInput}.`);
    }
  }

  for (const sectionId of AI_PROTOTYPE_PATCH_HARNESS_REQUIRED_SECTION_IDS) {
    const matchingSection = harnessSections.find((section) => section.sectionId === sectionId);

    if (!matchingSection) {
      errors.push(`AI prototype patch test harness plan must include harness section: ${sectionId}.`);
      continue;
    }

    if (!matchingSection.requiredInput) {
      errors.push(`AI prototype patch test harness section ${sectionId} must include a required input.`);
    }

    if (matchingSection.plannedChecks.length === 0) {
      errors.push(`AI prototype patch test harness section ${sectionId} must include planned checks.`);
    }

    if (matchingSection.blockedActions.length === 0) {
      errors.push(`AI prototype patch test harness section ${sectionId} must include blocked actions.`);
    }
  }

  for (const output of AI_PROTOTYPE_PATCH_HARNESS_NON_EXECUTION_OUTPUTS) {
    if (!nonExecutionOutputs.includes(output)) {
      errors.push(`AI prototype patch test harness plan must include non-execution output: ${output}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_PATCH_HARNESS_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype patch test harness plan must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_PATCH_HARNESS_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype patch test harness plan must include next required record: ${nextRecord}.`);
    }
  }

  if (tenantId === "ministar") {
    const hiraganaSection = harnessSections.find((section) => section.sectionId === "hiragana-support-harness");

    if (!hiraganaSection) {
      errors.push("MiniStar AI prototype patch test harness plan must include a hiragana support-language harness.");
    } else if (!textListIncludes(hiraganaSection.plannedChecks, "hiragana-only") || !textListIncludes(hiraganaSection.blockedActions, "No support-language progress trigger")) {
      errors.push("MiniStar AI prototype patch test harness plan must keep Japanese support hiragana-only and support-only.");
    }
  }

  return errors;
}

export function getAiPrototypePatchTestHarnessPlanWarnings(plan: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(plan)) {
    return warnings;
  }

  const status = readString(plan, "status");
  const harnessSections = readHarnessSections(plan);

  if (status === "ready-for-harness-design" && harnessSections.some((section) => section.status !== "planned")) {
    warnings.push("A ready-for-harness-design plan should have every harness section planned.");
  }

  if (!harnessSections.every((section) => section.blockedActions.some((action) => action.startsWith("No ")))) {
    warnings.push("Every harness section should block at least one action explicitly.");
  }

  return warnings;
}

export function validateAiPrototypePatchTestHarnessPlans(plans: unknown[]): string[] {
  return plans.flatMap((plan) => validateAiPrototypePatchTestHarnessPlan(plan));
}

export function getAiPrototypePatchTestHarnessPlanCollectionWarnings(plans: unknown[]): string[] {
  return plans.flatMap((plan) => getAiPrototypePatchTestHarnessPlanWarnings(plan));
}

function readHarnessSections(source: Record<string, unknown>): AiPrototypePatchHarnessSection[] {
  const value = source.harnessSections;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((section) => ({
    sectionId: readString(section, "sectionId"),
    label: readString(section, "label"),
    status: readString(section, "status") as AiPrototypePatchHarnessSectionStatus,
    requiredInput: readString(section, "requiredInput"),
    plannedChecks: readStringArray(section, "plannedChecks"),
    blockedActions: readStringArray(section, "blockedActions"),
  }));
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
