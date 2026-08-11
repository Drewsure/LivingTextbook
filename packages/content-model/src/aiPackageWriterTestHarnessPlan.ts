export type AiGeneratedPackageWriterTestHarnessPlanStatus = "blocked" | "review-only";

export interface AiGeneratedPackageWriterTestHarnessPhase {
  phaseId: string;
  label: string;
  purpose: string;
  requiredInputs: string[];
  plannedChecks: string[];
  blockedExecution: string[];
}

export interface AiGeneratedPackageWriterTestHarnessAdapter {
  adapterId: string;
  label: string;
  target: string;
  commandScope: string[];
  blockedAdapters: string[];
}

export interface AiGeneratedPackageWriterTestHarnessPlan {
  harnessPlanId: string;
  tenantId: string;
  requestId: string;
  evidencePacketId: string;
  moduleTestPlanId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterTestHarnessPlanStatus;
  harnessState: string;
  packageIdPreview: string;
  harnessPhases: AiGeneratedPackageWriterTestHarnessPhase[];
  environmentAdapters: AiGeneratedPackageWriterTestHarnessAdapter[];
  requiredBeforeHarness: string[];
  blockedHarnessActions: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_TEST_HARNESS_REQUIRED_PHASE_LABELS = [
  "Fixture replay phase",
  "Route smoke phase",
  "Media policy phase",
  "Local and assignment phase",
  "Rollback guard phase",
] as const;

export const AI_PACKAGE_WRITER_TEST_HARNESS_REQUIRED_ADAPTER_LABELS = [
  "Static fixture adapter",
  "Browser smoke adapter",
  "Local dry-run adapter",
] as const;

export const AI_PACKAGE_WRITER_TEST_HARNESS_REQUIRED_BLOCKED_ACTIONS = [
  "No test harness implementation",
  "No automated writer test execution",
  "No writer mutation browser run",
  "No evidence upload or signed approval capture",
  "No app file patch",
  "No generated package JSON write",
  "No route registry write",
  "No media playlist write",
  "No local bundle packaging",
  "No assignment activation",
  "No production QR redirect mutation",
  "No support-language-only harness pass",
] as const;

export function validateAiGeneratedPackageWriterTestHarnessPlan(plan: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(plan)) {
    return ["AI generated package writer test harness plan must be a JSON object."];
  }

  const harnessPlanId = readString(plan, "harnessPlanId");
  const tenantId = readString(plan, "tenantId");
  const requestId = readString(plan, "requestId");
  const evidencePacketId = readString(plan, "evidencePacketId");
  const moduleTestPlanId = readString(plan, "moduleTestPlanId");
  const status = readString(plan, "status");
  const harnessState = readString(plan, "harnessState");
  const packageIdPreview = readString(plan, "packageIdPreview");
  const harnessPhases = readArray(plan, "harnessPhases");
  const environmentAdapters = readArray(plan, "environmentAdapters");
  const requiredBeforeHarness = readStringArray(plan, "requiredBeforeHarness");
  const blockedHarnessActions = readStringArray(plan, "blockedHarnessActions");
  const supportLanguageBoundary = readStringArray(plan, "supportLanguageBoundary");

  if (
    !harnessPlanId ||
    !tenantId ||
    !requestId ||
    !evidencePacketId ||
    !moduleTestPlanId
  ) {
    errors.push(
      "AI generated package writer test harness plan must include harnessPlanId, tenantId, requestId, evidencePacketId, and moduleTestPlanId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer test harness plan status must stay blocked in the foundation.");
  }

  if (!harnessState.toLowerCase().includes("blocked")) {
    errors.push("AI generated package writer test harness plan must state that harness work is blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer test harness plan must include packageIdPreview.");
  }

  const phaseLabels = harnessPhases.flatMap((phase) => (isRecord(phase) ? [readString(phase, "label")] : []));

  for (const requiredPhase of AI_PACKAGE_WRITER_TEST_HARNESS_REQUIRED_PHASE_LABELS) {
    if (!phaseLabels.includes(requiredPhase)) {
      errors.push(`AI generated package writer test harness plan must include phase: ${requiredPhase}.`);
    }
  }

  const adapterLabels = environmentAdapters.flatMap((adapter) =>
    isRecord(adapter) ? [readString(adapter, "label")] : [],
  );

  for (const requiredAdapter of AI_PACKAGE_WRITER_TEST_HARNESS_REQUIRED_ADAPTER_LABELS) {
    if (!adapterLabels.includes(requiredAdapter)) {
      errors.push(`AI generated package writer test harness plan must include adapter: ${requiredAdapter}.`);
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_TEST_HARNESS_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedHarnessActions.includes(requiredAction)) {
      errors.push(`AI generated package writer test harness plan must block: ${requiredAction}.`);
    }
  }

  if (!requiredBeforeHarness.includes("package_writer_test_evidence_packet storage contract")) {
    errors.push(
      "AI generated package writer test harness plan must require package_writer_test_evidence_packet storage contract.",
    );
  }

  if (!requiredBeforeHarness.includes("Codex test harness implementation decision")) {
    errors.push(
      "AI generated package writer test harness plan must require a Codex test harness implementation decision.",
    );
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer test harness plan must preserve a support-language boundary.");
  }

  for (const phase of harnessPhases) {
    if (!isRecord(phase)) {
      errors.push("AI generated package writer test harness phases must be objects.");
      continue;
    }

    const phaseId = readString(phase, "phaseId");
    const requiredInputs = readStringArray(phase, "requiredInputs");
    const plannedChecks = readStringArray(phase, "plannedChecks");
    const blockedExecution = readStringArray(phase, "blockedExecution");

    if (!phaseId) {
      errors.push("AI generated package writer test harness phases must include phaseId.");
    }

    if (requiredInputs.length === 0 || plannedChecks.length === 0 || blockedExecution.length === 0) {
      errors.push(
        `AI generated package writer test harness phase ${phaseId || "(missing)"} must include requiredInputs, plannedChecks, and blockedExecution.`,
      );
    }

    if (!blockedExecution.every((blockedAction) => blockedAction.startsWith("No "))) {
      errors.push(
        `AI generated package writer test harness phase ${phaseId || "(missing)"} blockedExecution must be explicit No rules.`,
      );
    }
  }

  for (const adapter of environmentAdapters) {
    if (!isRecord(adapter)) {
      errors.push("AI generated package writer test harness adapters must be objects.");
      continue;
    }

    const adapterId = readString(adapter, "adapterId");
    const commandScope = readStringArray(adapter, "commandScope");
    const blockedAdapters = readStringArray(adapter, "blockedAdapters");

    if (!adapterId) {
      errors.push("AI generated package writer test harness adapters must include adapterId.");
    }

    if (commandScope.length === 0 || blockedAdapters.length === 0) {
      errors.push(
        `AI generated package writer test harness adapter ${adapterId || "(missing)"} must include commandScope and blockedAdapters.`,
      );
    }

    if (!blockedAdapters.every((blockedAction) => blockedAction.startsWith("No "))) {
      errors.push(
        `AI generated package writer test harness adapter ${adapterId || "(missing)"} blockedAdapters must be explicit No rules.`,
      );
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterTestHarnessPlanWarnings(plan: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(plan)) {
    return warnings;
  }

  const requiredBeforeHarness = readStringArray(plan, "requiredBeforeHarness");

  if (!requiredBeforeHarness.includes("Release rollback guard review")) {
    warnings.push("AI generated package writer test harness plan should require Release rollback guard review.");
  }

  if (!requiredBeforeHarness.includes("School policy acceptance preflight")) {
    warnings.push("AI generated package writer test harness plan should require School policy acceptance preflight.");
  }

  if (!requiredBeforeHarness.includes("Teacher approval evidence")) {
    warnings.push("AI generated package writer test harness plan should require Teacher approval evidence.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterTestHarnessPlans(plans: unknown[]): string[] {
  return plans.flatMap((plan) => validateAiGeneratedPackageWriterTestHarnessPlan(plan));
}

export function getAiGeneratedPackageWriterTestHarnessPlanCollectionWarnings(plans: unknown[]): string[] {
  return plans.flatMap((plan) => getAiGeneratedPackageWriterTestHarnessPlanWarnings(plan));
}

function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  return Array.isArray(value) ? value : [];
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
