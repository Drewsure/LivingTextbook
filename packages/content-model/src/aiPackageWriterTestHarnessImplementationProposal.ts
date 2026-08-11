export type AiGeneratedPackageWriterTestHarnessImplementationProposalStatus =
  | "blocked"
  | "review-only"
  | "ready-for-implementation-review";

export interface AiGeneratedPackageWriterTestHarnessImplementationProposal {
  proposalId: string;
  tenantId: string;
  requestId: string;
  harnessPlanId: string;
  evidencePacketId: string;
  label: string;
  status: AiGeneratedPackageWriterTestHarnessImplementationProposalStatus;
  summary: string;
  proposedModuleScope: string[];
  implementationBoundaries: string[];
  requiredReviewGates: string[];
  dryRunOnlyChecks: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_HARNESS_IMPLEMENTATION_REQUIRED_SCOPE_KEYWORDS = [
  "fixture replay",
  "route smoke",
  "media policy",
  "local companion",
  "assignment shell",
  "rollback guard",
  "support-language boundary",
  "evidence report",
] as const;

export const AI_PACKAGE_WRITER_HARNESS_IMPLEMENTATION_REQUIRED_REVIEW_GATES = [
  "Codex test harness implementation decision",
  "Package writer test harness plan storage contract accepted",
  "Release rollback guard review accepted",
  "Route registry write guard accepted",
  "Media playlist write guard accepted",
  "Teacher assignment rollout gate accepted",
  "School policy acceptance preflight accepted",
] as const;

export const AI_PACKAGE_WRITER_HARNESS_IMPLEMENTATION_REQUIRED_BLOCKED_ACTIONS = [
  "No harness implementation from this proposal",
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
  "No support-language-only harness pass",
] as const;

export function validateAiGeneratedPackageWriterTestHarnessImplementationProposal(
  proposal: unknown,
): string[] {
  const errors: string[] = [];

  if (!isRecord(proposal)) {
    return ["AI generated package writer test harness implementation proposal must be a JSON object."];
  }

  const proposalId = readString(proposal, "proposalId");
  const tenantId = readString(proposal, "tenantId");
  const requestId = readString(proposal, "requestId");
  const harnessPlanId = readString(proposal, "harnessPlanId");
  const evidencePacketId = readString(proposal, "evidencePacketId");
  const status = readString(proposal, "status");
  const proposedModuleScope = readStringArray(proposal, "proposedModuleScope");
  const implementationBoundaries = readStringArray(proposal, "implementationBoundaries");
  const requiredReviewGates = readStringArray(proposal, "requiredReviewGates");
  const dryRunOnlyChecks = readStringArray(proposal, "dryRunOnlyChecks");
  const blockedActions = readStringArray(proposal, "blockedActions");
  const supportLanguageBoundary = readStringArray(proposal, "supportLanguageBoundary");

  if (!proposalId || !tenantId || !requestId || !harnessPlanId || !evidencePacketId) {
    errors.push(
      "AI generated package writer test harness implementation proposal must include proposalId, tenantId, requestId, harnessPlanId, and evidencePacketId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer test harness implementation proposal status must stay blocked in the foundation.");
  }

  const scopeText = proposedModuleScope.join(" ").toLowerCase();

  for (const requiredScope of AI_PACKAGE_WRITER_HARNESS_IMPLEMENTATION_REQUIRED_SCOPE_KEYWORDS) {
    if (!scopeText.includes(requiredScope)) {
      errors.push(`AI generated package writer test harness implementation proposal must include scope: ${requiredScope}.`);
    }
  }

  for (const requiredGate of AI_PACKAGE_WRITER_HARNESS_IMPLEMENTATION_REQUIRED_REVIEW_GATES) {
    if (!requiredReviewGates.includes(requiredGate)) {
      errors.push(`AI generated package writer test harness implementation proposal must require gate: ${requiredGate}.`);
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_HARNESS_IMPLEMENTATION_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(requiredAction)) {
      errors.push(`AI generated package writer test harness implementation proposal must block: ${requiredAction}.`);
    }
  }

  if (implementationBoundaries.length === 0 || !implementationBoundaries.join(" ").includes("No ")) {
    errors.push("AI generated package writer test harness implementation proposal must preserve No implementation boundaries.");
  }

  if (dryRunOnlyChecks.length === 0) {
    errors.push("AI generated package writer test harness implementation proposal must include dryRunOnlyChecks.");
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer test harness implementation proposal must preserve a support-language boundary.");
  }

  return errors;
}

export function getAiGeneratedPackageWriterTestHarnessImplementationProposalWarnings(
  proposal: unknown,
): string[] {
  const warnings: string[] = [];

  if (!isRecord(proposal)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(proposal, "nextRequiredRecords");

  if (!nextRequiredRecords.includes("Codex test harness implementation decision")) {
    warnings.push("AI generated package writer test harness implementation proposal should require Codex test harness implementation decision.");
  }

  if (!nextRequiredRecords.includes("Harness implementation file-scope review")) {
    warnings.push("AI generated package writer test harness implementation proposal should require Harness implementation file-scope review.");
  }

  if (!nextRequiredRecords.includes("School policy acceptance preflight")) {
    warnings.push("AI generated package writer test harness implementation proposal should require School policy acceptance preflight.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterTestHarnessImplementationProposals(
  proposals: unknown[],
): string[] {
  return proposals.flatMap((proposal) =>
    validateAiGeneratedPackageWriterTestHarnessImplementationProposal(proposal),
  );
}

export function getAiGeneratedPackageWriterTestHarnessImplementationProposalCollectionWarnings(
  proposals: unknown[],
): string[] {
  return proposals.flatMap((proposal) =>
    getAiGeneratedPackageWriterTestHarnessImplementationProposalWarnings(proposal),
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
