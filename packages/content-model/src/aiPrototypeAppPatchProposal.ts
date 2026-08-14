export type AiPrototypeAppPatchProposalStatus = "blocked" | "review-only" | "ready-for-planning";
export type AiPrototypePatchGateStatus = "missing" | "blocked" | "pending-review" | "reviewed";

export interface AiPrototypePatchFileScope {
  path: string;
  action: "wrapper-only" | "fixture-only" | "route-preview" | "test-only";
  note: string;
}

export interface AiPrototypePatchGate {
  label: string;
  status: AiPrototypePatchGateStatus;
  requiredRecord: string;
  note: string;
}

export interface AiPrototypeAppPatchProposal {
  proposalId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiPrototypeAppPatchProposalStatus;
  summary: string;
  sourceRecords: string[];
  proposedScope: AiPrototypePatchFileScope[];
  requiredBeforePatch: AiPrototypePatchGate[];
  requiredTestGates: AiPrototypePatchGate[];
  blockedActions: string[];
}

export const AI_PROTOTYPE_APP_PATCH_REQUIRED_SOURCE_RECORDS = [
  "ai_prototype_app_patch_proposal",
  "codex_integration_review_decision",
  "ai_prototype_integration_readiness_gate",
  "ai_prototype_integration_plan",
  "ai_prototype_wrapper_adapter_review",
  "ai_prototype_fixture_replay_report",
  "ai_prototype_event_replay_report",
  "ai_prototype_audio_coverage_report",
  "ai_prototype_mobile_accessibility_report",
  "ai_prototype_scoring_replay_report",
] as const;

export const AI_PROTOTYPE_APP_PATCH_REQUIRED_SCOPE = [
  {
    path: "apps/web/src/features/games/adapters/*",
    action: "wrapper-only",
  },
  {
    path: "apps/web/src/data/reviewed-fixtures/*",
    action: "fixture-only",
  },
  {
    path: "apps/web/src/app/*",
    action: "route-preview",
  },
  {
    path: "scripts/verify-*",
    action: "test-only",
  },
] as const;

export const AI_PROTOTYPE_APP_PATCH_REQUIRED_PRE_PATCH_RECORDS = [
  "codex_integration_review_decision",
  "ai_prototype_integration_readiness_gate",
  "reviewer_identity_signature_gate",
  "package_publish_gate",
] as const;

export const AI_PROTOTYPE_APP_PATCH_REQUIRED_TEST_RECORDS = [
  "ai_prototype_fixture_replay_report",
  "ai_prototype_event_replay_report",
  "ai_prototype_audio_coverage_report",
  "ai_prototype_mobile_accessibility_report",
  "ai_prototype_scoring_replay_report",
] as const;

export const AI_PROTOTYPE_APP_PATCH_BLOCKED_ACTIONS = [
  "No app file writes",
  "No generated route write",
  "No student-facing route",
  "No scoring or reward mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No assignment",
] as const;

export function validateAiPrototypeAppPatchProposal(proposal: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(proposal)) {
    return ["AI prototype app patch proposal must be a JSON object."];
  }

  const proposalId = readString(proposal, "proposalId");
  const tenantId = readString(proposal, "tenantId");
  const requestId = readString(proposal, "requestId");
  const label = readString(proposal, "label");
  const status = readString(proposal, "status");
  const summary = readString(proposal, "summary");
  const sourceRecords = readStringArray(proposal, "sourceRecords");
  const proposedScope = readPatchFileScopes(proposal);
  const requiredBeforePatch = readPatchGates(proposal, "requiredBeforePatch");
  const requiredTestGates = readPatchGates(proposal, "requiredTestGates");
  const blockedActions = readStringArray(proposal, "blockedActions");

  if (!proposalId || !tenantId || !requestId) {
    errors.push("AI prototype app patch proposal must include proposalId, tenantId, and requestId.");
  }

  if (!label.includes("app patch proposal preview")) {
    errors.push("AI prototype app patch proposal label must name the app patch proposal preview.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-planning") {
    errors.push("AI prototype app patch proposal must use a supported review-only status.");
  }

  if (!summary.includes("patch planning remains blocked") || !summary.includes("Codex records an accepted decision")) {
    errors.push("AI prototype app patch proposal summary must keep patch planning blocked until Codex accepts a decision.");
  }

  for (const sourceRecord of AI_PROTOTYPE_APP_PATCH_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype app patch proposal must include source record: ${sourceRecord}.`);
    }
  }

  for (const requiredScope of AI_PROTOTYPE_APP_PATCH_REQUIRED_SCOPE) {
    const matchingScope = proposedScope.find((scope) => scope.path === requiredScope.path);

    if (!matchingScope) {
      errors.push(`AI prototype app patch proposal must include scope path: ${requiredScope.path}.`);
      continue;
    }

    if (matchingScope.action !== requiredScope.action) {
      errors.push(`AI prototype app patch proposal scope ${requiredScope.path} must use action: ${requiredScope.action}.`);
    }

    if (!matchingScope.note) {
      errors.push(`AI prototype app patch proposal scope ${requiredScope.path} must include a note.`);
    }
  }

  for (const requiredRecord of AI_PROTOTYPE_APP_PATCH_REQUIRED_PRE_PATCH_RECORDS) {
    if (!requiredBeforePatch.some((gate) => gate.requiredRecord === requiredRecord)) {
      errors.push(`AI prototype app patch proposal must require before patch record: ${requiredRecord}.`);
    }
  }

  for (const requiredRecord of AI_PROTOTYPE_APP_PATCH_REQUIRED_TEST_RECORDS) {
    if (!requiredTestGates.some((gate) => gate.requiredRecord === requiredRecord)) {
      errors.push(`AI prototype app patch proposal must require test record: ${requiredRecord}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_APP_PATCH_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype app patch proposal must block action: ${blockedAction}.`);
    }
  }

  if (!requiredBeforePatch.some((gate) => gate.status === "blocked")) {
    errors.push("AI prototype app patch proposal must keep pre-patch gates blocked until approval exists.");
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language trigger")) {
    errors.push("MiniStar AI prototype app patch proposal must block Japanese support-language triggers.");
  }

  return errors;
}

export function getAiPrototypeAppPatchProposalWarnings(proposal: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(proposal)) {
    return warnings;
  }

  const status = readString(proposal, "status");
  const requiredBeforePatch = readPatchGates(proposal, "requiredBeforePatch");
  const requiredTestGates = readPatchGates(proposal, "requiredTestGates");

  if (status === "ready-for-planning" && !requiredBeforePatch.every((gate) => gate.status === "reviewed")) {
    warnings.push("A ready-for-planning app patch proposal should have every pre-patch gate reviewed.");
  }

  if (!requiredTestGates.every((gate) => gate.note.includes("Patch scope must"))) {
    warnings.push("Every required test gate should state what the future patch scope must prove.");
  }

  return warnings;
}

export function validateAiPrototypeAppPatchProposals(proposals: unknown[]): string[] {
  return proposals.flatMap((proposal) => validateAiPrototypeAppPatchProposal(proposal));
}

export function getAiPrototypeAppPatchProposalCollectionWarnings(proposals: unknown[]): string[] {
  return proposals.flatMap((proposal) => getAiPrototypeAppPatchProposalWarnings(proposal));
}

function readPatchFileScopes(source: Record<string, unknown>): AiPrototypePatchFileScope[] {
  const value = source.proposedScope;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((scope) => ({
    path: readString(scope, "path"),
    action: readString(scope, "action") as AiPrototypePatchFileScope["action"],
    note: readString(scope, "note"),
  }));
}

function readPatchGates(source: Record<string, unknown>, key: string): AiPrototypePatchGate[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((gate) => ({
    label: readString(gate, "label"),
    status: readString(gate, "status") as AiPrototypePatchGateStatus,
    requiredRecord: readString(gate, "requiredRecord"),
    note: readString(gate, "note"),
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
