export type AiPrototypePatchHarnessImplementationProposalStatus =
  | "blocked"
  | "review-only"
  | "ready-for-implementation-review";

export interface AiPrototypePatchHarnessImplementationProposal {
  proposalId: string;
  tenantId: string;
  requestId: string;
  harnessPlanId: string;
  label: string;
  status: AiPrototypePatchHarnessImplementationProposalStatus;
  summary: string;
  proposedFileScope: string[];
  implementationBoundaries: string[];
  requiredReviewGates: string[];
  dryRunOnlyChecks: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_FILE_SCOPE = [
  "Future harness manifest adapter only",
  "Future fixture replay assertion map only",
  "Future standard event assertion map only",
  "Future audio cue coverage assertion map only",
  "Future mobile viewport checklist only",
  "Future deterministic scoring replay checklist only",
  "Future route safety smoke checklist only",
  "Future storage adapter checklist only",
  "Future rollback dry-run checklist only",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_BOUNDARIES = [
  "No app route implementation is proposed here.",
  "No student-facing UI implementation is proposed here.",
  "No runtime test runner is proposed here.",
  "No Playwright invocation is proposed here.",
  "No fixture, score, reward, audio, route, package, or assignment writes are proposed here.",
  "Support-language checks remain support-only and cannot unlock target-language progress.",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_REVIEW_GATES = [
  "Codex patch approval decision",
  "Patch test harness plan accepted",
  "Route safety release gate accepted",
  "Rollback drill record accepted",
  "Storage contract verification accepted",
  "Reviewer identity signature gate accepted",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_DRY_RUN_CHECKS = [
  "Fixture replay assertion names",
  "Standard event assertion names",
  "Audio cue coverage assertion names",
  "Mobile viewport checklist names",
  "Deterministic scoring replay assertion names",
  "Route safety smoke assertion names",
  "Storage adapter checklist names",
  "Rollback dry-run checklist names",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_BLOCKED_ACTIONS = [
  "No harness implementation from this proposal",
  "No test execution",
  "No Playwright run",
  "No app file write",
  "No app patch generation",
  "No route mutation",
  "No student-facing route",
  "No scoring or reward mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No assignment",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_NEXT_RECORDS = [
  "Codex patch approval decision",
  "Harness implementation file-scope review",
  "Route safety release gate",
  "Rollback drill record",
  "Storage contract verification",
] as const;

export function validateAiPrototypePatchHarnessImplementationProposal(proposal: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(proposal)) {
    return ["AI prototype patch harness implementation proposal must be a JSON object."];
  }

  const proposalId = readString(proposal, "proposalId");
  const tenantId = readString(proposal, "tenantId");
  const requestId = readString(proposal, "requestId");
  const harnessPlanId = readString(proposal, "harnessPlanId");
  const label = readString(proposal, "label");
  const status = readString(proposal, "status");
  const summary = readString(proposal, "summary");
  const proposedFileScope = readStringArray(proposal, "proposedFileScope");
  const implementationBoundaries = readStringArray(proposal, "implementationBoundaries");
  const requiredReviewGates = readStringArray(proposal, "requiredReviewGates");
  const dryRunOnlyChecks = readStringArray(proposal, "dryRunOnlyChecks");
  const blockedActions = readStringArray(proposal, "blockedActions");
  const nextRequiredRecords = readStringArray(proposal, "nextRequiredRecords");

  if (!proposalId || !tenantId || !requestId || !harnessPlanId) {
    errors.push(
      "AI prototype patch harness implementation proposal must include proposalId, tenantId, requestId, and harnessPlanId.",
    );
  }

  if (!label.includes("patch harness implementation proposal")) {
    errors.push("AI prototype patch harness implementation proposal label must name the implementation proposal.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-implementation-review") {
    errors.push("AI prototype patch harness implementation proposal must use a supported review-only status.");
  }

  if (!summary.includes("Harness implementation remains blocked") && !summary.includes("harness implementation remains blocked")) {
    errors.push("AI prototype patch harness implementation proposal summary must keep implementation blocked.");
  }

  for (const scope of AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_FILE_SCOPE) {
    if (!proposedFileScope.includes(scope)) {
      errors.push(`AI prototype patch harness implementation proposal must include file scope: ${scope}.`);
    }
  }

  for (const boundary of AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_BOUNDARIES) {
    if (!implementationBoundaries.includes(boundary)) {
      errors.push(`AI prototype patch harness implementation proposal must include boundary: ${boundary}.`);
    }
  }

  for (const gate of AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_REVIEW_GATES) {
    if (!requiredReviewGates.includes(gate)) {
      errors.push(`AI prototype patch harness implementation proposal must require review gate: ${gate}.`);
    }
  }

  for (const check of AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_DRY_RUN_CHECKS) {
    if (!dryRunOnlyChecks.includes(check)) {
      errors.push(`AI prototype patch harness implementation proposal must include dry-run-only check: ${check}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype patch harness implementation proposal must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_PATCH_HARNESS_IMPLEMENTATION_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype patch harness implementation proposal must include next required record: ${nextRecord}.`);
    }
  }

  if (tenantId === "ministar" && !dryRunOnlyChecks.includes("Hiragana support-language assertion names")) {
    errors.push("MiniStar AI prototype patch harness implementation proposal must include hiragana support assertions.");
  }

  return errors;
}

export function getAiPrototypePatchHarnessImplementationProposalWarnings(proposal: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(proposal)) {
    return warnings;
  }

  const status = readString(proposal, "status");
  const blockedActions = readStringArray(proposal, "blockedActions");

  if (status === "ready-for-implementation-review" && textListIncludes(blockedActions, "No harness implementation")) {
    warnings.push("A ready-for-implementation-review proposal should move implementation blockers to review gates.");
  }

  if (!textListIncludes(blockedActions, "No support-language progress trigger")) {
    warnings.push("Harness implementation proposals should block support-language progress triggers.");
  }

  return warnings;
}

export function validateAiPrototypePatchHarnessImplementationProposals(proposals: unknown[]): string[] {
  return proposals.flatMap((proposal) => validateAiPrototypePatchHarnessImplementationProposal(proposal));
}

export function getAiPrototypePatchHarnessImplementationProposalCollectionWarnings(proposals: unknown[]): string[] {
  return proposals.flatMap((proposal) => getAiPrototypePatchHarnessImplementationProposalWarnings(proposal));
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
