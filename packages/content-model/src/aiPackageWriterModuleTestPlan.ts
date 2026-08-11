export type AiGeneratedPackageWriterModuleTestPlanStatus = "blocked" | "review-only";

export interface AiGeneratedPackageWriterModuleTestSuite {
  suiteId: string;
  moduleId: string;
  label: string;
  requiredFixtures: string[];
  requiredAssertions: string[];
  blockedExecution: string[];
}

export interface AiGeneratedPackageWriterModuleTestPlan {
  testPlanId: string;
  tenantId: string;
  requestId: string;
  implementationReadinessId: string;
  rollbackDrillId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterModuleTestPlanStatus;
  testPlanState: string;
  packageIdPreview: string;
  moduleTestSuites: AiGeneratedPackageWriterModuleTestSuite[];
  requiredEvidence: string[];
  blockedTestActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_MODULE_TEST_REQUIRED_SUITE_LABELS = [
  "Content package writer module tests",
  "Route registry writer module tests",
  "Media playlist writer module tests",
  "Local companion writer module tests",
  "Assignment shell writer module tests",
  "Release rollback guard module tests",
] as const;

export const AI_PACKAGE_WRITER_MODULE_TEST_REQUIRED_EVIDENCE = [
  "Reviewed JSON fixture replay",
  "Tap-to-speak audio coverage report",
  "Rollback drill replay result",
  "Support-language boundary proof",
] as const;

export const AI_PACKAGE_WRITER_MODULE_TEST_REQUIRED_BLOCKED_ACTIONS = [
  "No automated writer test execution",
  "No Playwright writer mutation run",
  "No app file patch",
  "No generated package JSON write",
  "No route registry write",
  "No media playlist write",
  "No local bundle packaging",
  "No assignment activation",
  "No production QR redirect mutation",
  "No support-language-only test pass",
] as const;

export function validateAiGeneratedPackageWriterModuleTestPlan(plan: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(plan)) {
    return ["AI generated package writer module test plan must be a JSON object."];
  }

  const testPlanId = readString(plan, "testPlanId");
  const tenantId = readString(plan, "tenantId");
  const requestId = readString(plan, "requestId");
  const implementationReadinessId = readString(plan, "implementationReadinessId");
  const rollbackDrillId = readString(plan, "rollbackDrillId");
  const status = readString(plan, "status");
  const testPlanState = readString(plan, "testPlanState");
  const packageIdPreview = readString(plan, "packageIdPreview");
  const moduleTestSuites = readArray(plan, "moduleTestSuites");
  const requiredEvidence = readStringArray(plan, "requiredEvidence");
  const blockedTestActions = readStringArray(plan, "blockedTestActions");
  const supportLanguageBoundary = readStringArray(plan, "supportLanguageBoundary");

  if (!testPlanId || !tenantId || !requestId || !implementationReadinessId || !rollbackDrillId) {
    errors.push(
      "AI generated package writer module test plan must include testPlanId, tenantId, requestId, implementationReadinessId, and rollbackDrillId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer module test plan status must stay blocked in the foundation.");
  }

  if (!testPlanState.toLowerCase().includes("blocked")) {
    errors.push("AI generated package writer module test plan must state that execution is blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer module test plan must include packageIdPreview.");
  }

  const suiteLabels = moduleTestSuites.flatMap((suite) => (isRecord(suite) ? [readString(suite, "label")] : []));

  for (const requiredSuite of AI_PACKAGE_WRITER_MODULE_TEST_REQUIRED_SUITE_LABELS) {
    if (!suiteLabels.includes(requiredSuite)) {
      errors.push(`AI generated package writer module test plan must include suite: ${requiredSuite}.`);
    }
  }

  for (const requiredEvidenceItem of AI_PACKAGE_WRITER_MODULE_TEST_REQUIRED_EVIDENCE) {
    if (!requiredEvidence.includes(requiredEvidenceItem)) {
      errors.push(`AI generated package writer module test plan must require evidence: ${requiredEvidenceItem}.`);
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_MODULE_TEST_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedTestActions.includes(requiredAction)) {
      errors.push(`AI generated package writer module test plan must block: ${requiredAction}.`);
    }
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer module test plan must preserve a support-language boundary.");
  }

  for (const suite of moduleTestSuites) {
    if (!isRecord(suite)) {
      errors.push("AI generated package writer module test suites must be objects.");
      continue;
    }

    const suiteId = readString(suite, "suiteId");
    const moduleId = readString(suite, "moduleId");
    const requiredFixtures = readStringArray(suite, "requiredFixtures");
    const requiredAssertions = readStringArray(suite, "requiredAssertions");
    const blockedExecution = readStringArray(suite, "blockedExecution");

    if (!suiteId || !moduleId) {
      errors.push("AI generated package writer module test suites must include suiteId and moduleId.");
    }

    if (requiredFixtures.length === 0 || requiredAssertions.length === 0 || blockedExecution.length === 0) {
      errors.push(
        `AI generated package writer module test suite ${suiteId || "(missing)"} must include requiredFixtures, requiredAssertions, and blockedExecution.`,
      );
    }

    if (!blockedExecution.every((blockedAction) => blockedAction.startsWith("No "))) {
      errors.push(
        `AI generated package writer module test suite ${suiteId || "(missing)"} blockedExecution must be explicit No rules.`,
      );
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterModuleTestPlanWarnings(plan: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(plan)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(plan, "nextRequiredRecords");

  if (!nextRequiredRecords.includes("codex_package_writer_implementation_decision")) {
    warnings.push("AI generated package writer module test plan should require codex_package_writer_implementation_decision.");
  }

  if (!nextRequiredRecords.includes("release_rollback_map")) {
    warnings.push("AI generated package writer module test plan should require release_rollback_map.");
  }

  if (!nextRequiredRecords.includes("package_writer_module_test_plan storage contract")) {
    warnings.push("AI generated package writer module test plan should require package_writer_module_test_plan storage contract.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterModuleTestPlans(plans: unknown[]): string[] {
  return plans.flatMap((plan) => validateAiGeneratedPackageWriterModuleTestPlan(plan));
}

export function getAiGeneratedPackageWriterModuleTestPlanCollectionWarnings(plans: unknown[]): string[] {
  return plans.flatMap((plan) => getAiGeneratedPackageWriterModuleTestPlanWarnings(plan));
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
