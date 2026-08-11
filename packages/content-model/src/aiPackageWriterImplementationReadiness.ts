export type AiGeneratedPackageWriterImplementationReadinessStatus = "blocked" | "review-only";
export type AiGeneratedPackageWriterModuleStatus = "blocked" | "needs-design";

export interface AiGeneratedPackageWriterModule {
  moduleId: string;
  label: string;
  status: AiGeneratedPackageWriterModuleStatus;
  implementationBoundary: string;
  requiredInputs: string[];
  blockedActions: string[];
}

export interface AiGeneratedPackageWriterImplementationReadiness {
  readinessId: string;
  tenantId: string;
  requestId: string;
  rollbackDrillId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterImplementationReadinessStatus;
  readinessState: string;
  packageIdPreview: string;
  modulePlan: AiGeneratedPackageWriterModule[];
  requiredTestGates: string[];
  releaseControls: string[];
  blockedImplementationActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_IMPLEMENTATION_REQUIRED_MODULE_LABELS = [
  "Content package writer module",
  "Route registry writer module",
  "Media playlist writer module",
  "Local companion writer module",
  "Assignment shell writer module",
  "Release rollback guard module",
] as const;

export const AI_PACKAGE_WRITER_IMPLEMENTATION_REQUIRED_BLOCKED_ACTIONS = [
  "No package writer implementation",
  "No package writer execution",
  "No generated app file write",
  "No route registry mutation",
  "No media playlist creation",
  "No local bundle packaging",
  "No assignment activation",
  "No rollback execution",
  "No production QR redirect mutation",
  "No support-language-only implementation evidence",
] as const;

export const AI_PACKAGE_WRITER_IMPLEMENTATION_REQUIRED_TEST_GATES = [
  "Storage contract verification",
  "Rollback drill replay",
  "Support-language boundary test",
] as const;

export function validateAiGeneratedPackageWriterImplementationReadiness(readiness: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(readiness)) {
    return ["AI generated package writer implementation readiness must be a JSON object."];
  }

  const readinessId = readString(readiness, "readinessId");
  const tenantId = readString(readiness, "tenantId");
  const requestId = readString(readiness, "requestId");
  const rollbackDrillId = readString(readiness, "rollbackDrillId");
  const status = readString(readiness, "status");
  const readinessState = readString(readiness, "readinessState");
  const packageIdPreview = readString(readiness, "packageIdPreview");
  const modulePlan = readArray(readiness, "modulePlan");
  const requiredTestGates = readStringArray(readiness, "requiredTestGates");
  const releaseControls = readStringArray(readiness, "releaseControls");
  const blockedImplementationActions = readStringArray(readiness, "blockedImplementationActions");
  const supportLanguageBoundary = readStringArray(readiness, "supportLanguageBoundary");

  if (!readinessId || !tenantId || !requestId || !rollbackDrillId) {
    errors.push(
      "AI generated package writer implementation readiness must include readinessId, tenantId, requestId, and rollbackDrillId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer implementation readiness status must stay blocked in the foundation.");
  }

  if (!readinessState.toLowerCase().includes("blocked")) {
    errors.push("AI generated package writer implementation readiness must state that implementation is blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer implementation readiness must include packageIdPreview.");
  }

  const moduleLabels = modulePlan.flatMap((module) => (isRecord(module) ? [readString(module, "label")] : []));

  for (const requiredLabel of AI_PACKAGE_WRITER_IMPLEMENTATION_REQUIRED_MODULE_LABELS) {
    if (!moduleLabels.includes(requiredLabel)) {
      errors.push(`AI generated package writer implementation readiness must include module: ${requiredLabel}.`);
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_IMPLEMENTATION_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedImplementationActions.includes(requiredAction)) {
      errors.push(`AI generated package writer implementation readiness must block: ${requiredAction}.`);
    }
  }

  for (const requiredGate of AI_PACKAGE_WRITER_IMPLEMENTATION_REQUIRED_TEST_GATES) {
    if (!requiredTestGates.includes(requiredGate)) {
      errors.push(`AI generated package writer implementation readiness must require test gate: ${requiredGate}.`);
    }
  }

  if (releaseControls.length === 0) {
    errors.push("AI generated package writer implementation readiness must include releaseControls.");
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer implementation readiness must preserve a support-language boundary.");
  }

  for (const module of modulePlan) {
    if (!isRecord(module)) {
      errors.push("AI generated package writer module plans must be objects.");
      continue;
    }

    const moduleId = readString(module, "moduleId");
    const moduleStatus = readString(module, "status");
    const implementationBoundary = readString(module, "implementationBoundary");
    const requiredInputs = readStringArray(module, "requiredInputs");
    const blockedActions = readStringArray(module, "blockedActions");

    if (!moduleId) {
      errors.push("AI generated package writer module plans must include moduleId.");
    }

    if (moduleStatus !== "blocked") {
      errors.push(`AI generated package writer module ${moduleId || "(missing)"} must stay blocked.`);
    }

    if (!implementationBoundary || requiredInputs.length === 0 || blockedActions.length === 0) {
      errors.push(
        `AI generated package writer module ${moduleId || "(missing)"} must include implementationBoundary, requiredInputs, and blockedActions.`,
      );
    }

    if (!blockedActions.every((blockedAction) => blockedAction.startsWith("No "))) {
      errors.push(
        `AI generated package writer module ${moduleId || "(missing)"} blockedActions must be explicit No rules.`,
      );
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterImplementationReadinessWarnings(readiness: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(readiness)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(readiness, "nextRequiredRecords");
  const releaseControls = readStringArray(readiness, "releaseControls");

  if (!nextRequiredRecords.includes("codex_package_writer_implementation_decision")) {
    warnings.push("AI generated package writer implementation readiness should require codex_package_writer_implementation_decision.");
  }

  if (!nextRequiredRecords.includes("package_writer_module_test_plan")) {
    warnings.push("AI generated package writer implementation readiness should require package_writer_module_test_plan.");
  }

  if (!releaseControls.some((control) => control.toLowerCase().includes("feature flag"))) {
    warnings.push("AI generated package writer implementation readiness should keep the future writer behind a feature flag.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterImplementationReadinessCollection(readiness: unknown[]): string[] {
  return readiness.flatMap((item) => validateAiGeneratedPackageWriterImplementationReadiness(item));
}

export function getAiGeneratedPackageWriterImplementationReadinessCollectionWarnings(
  readiness: unknown[],
): string[] {
  return readiness.flatMap((item) => getAiGeneratedPackageWriterImplementationReadinessWarnings(item));
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
