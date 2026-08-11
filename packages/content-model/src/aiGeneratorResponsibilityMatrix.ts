export type AiGeneratorResponsibilityRoleId =
  | "teacher-school"
  | "codex-architecture"
  | "external-ai-builder"
  | "verifier-layer"
  | "platform-admin";

export interface AiGeneratorResponsibilityRole {
  roleId: AiGeneratorResponsibilityRoleId;
  label: string;
  owner: string;
  summary: string;
  owns: string[];
  mustProvide: string[];
  handoffRecords: string[];
  cannotDo: string[];
  nextGate: string;
}

export interface AiGeneratorResponsibilityMatrix {
  matrixId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: "review-only";
  summary: string;
  standingRules: string[];
  roles: AiGeneratorResponsibilityRole[];
}

export const AI_GENERATOR_RESPONSIBILITY_REQUIRED_ROLE_IDS: AiGeneratorResponsibilityRoleId[] = [
  "teacher-school",
  "codex-architecture",
  "external-ai-builder",
  "verifier-layer",
  "platform-admin",
];

export const AI_GENERATOR_RESPONSIBILITY_REQUIRED_STANDING_RULES = [
  "Responsibility matrix is review-only",
  "Detailed source records remain authoritative",
  "External AI builders stay isolated",
  "Codex owns architecture and final integration",
  "Teacher approval remains required",
] as const;

export const AI_GENERATOR_RESPONSIBILITY_REQUIRED_EXTERNAL_BUILDER_BLOCKS = [
  "No app file writes",
  "No route creation",
  "No scoring authority",
  "No reward inventory writes",
  "No student assignment",
] as const;

export function validateAiGeneratorResponsibilityMatrix(matrix: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(matrix)) {
    return ["AI generator responsibility matrix must be a JSON object."];
  }

  const matrixId = readString(matrix, "matrixId");
  const tenantId = readString(matrix, "tenantId");
  const requestId = readString(matrix, "requestId");
  const status = readString(matrix, "status");
  const standingRules = readStringArray(matrix, "standingRules");
  const roles = readResponsibilityRoles(matrix);
  const roleIds = roles.map((role) => role.roleId);

  if (!matrixId || !tenantId || !requestId) {
    errors.push("AI generator responsibility matrix must include matrixId, tenantId, and requestId.");
  }

  if (status !== "review-only") {
    errors.push("AI generator responsibility matrix must stay review-only.");
  }

  for (const requiredRule of AI_GENERATOR_RESPONSIBILITY_REQUIRED_STANDING_RULES) {
    if (!standingRules.includes(requiredRule)) {
      errors.push(`AI generator responsibility matrix must include standing rule: ${requiredRule}.`);
    }
  }

  for (const requiredRole of AI_GENERATOR_RESPONSIBILITY_REQUIRED_ROLE_IDS) {
    if (!roleIds.includes(requiredRole)) {
      errors.push(`AI generator responsibility matrix must include role: ${requiredRole}.`);
    }
  }

  for (const role of roles) {
    if (!AI_GENERATOR_RESPONSIBILITY_REQUIRED_ROLE_IDS.includes(role.roleId)) {
      errors.push(`AI generator responsibility matrix role uses an unknown role id: ${role.roleId}.`);
    }

    if (!role.label || !role.owner || !role.summary || !role.nextGate) {
      errors.push("AI generator responsibility roles must include label, owner, summary, and next gate.");
    }

    if (
      role.owns.length === 0 ||
      role.mustProvide.length === 0 ||
      role.handoffRecords.length === 0 ||
      role.cannotDo.length === 0
    ) {
      errors.push("AI generator responsibility roles must include owned work, required evidence, handoff records, and cannot-do rules.");
    }
  }

  const codexRole = roles.find((role) => role.roleId === "codex-architecture");
  if (!textListIncludes(codexRole?.owns, "Codex owns architecture and integration")) {
    errors.push("AI generator responsibility matrix must keep Codex as architecture and integration owner.");
  }

  const externalRole = roles.find((role) => role.roleId === "external-ai-builder");
  for (const requiredBlock of AI_GENERATOR_RESPONSIBILITY_REQUIRED_EXTERNAL_BUILDER_BLOCKS) {
    if (!textListIncludes(externalRole?.cannotDo, requiredBlock)) {
      errors.push(`External AI builder role must block: ${requiredBlock}.`);
    }
  }

  const verifierRole = roles.find((role) => role.roleId === "verifier-layer");
  if (!textListIncludes(verifierRole?.cannotDo, "Support language cannot unlock progress")) {
    errors.push("Verifier role must block support-language progress.");
  }

  const platformRole = roles.find((role) => role.roleId === "platform-admin");
  if (!textListIncludes(platformRole?.cannotDo, "No API cost without tenant approval")) {
    errors.push("Platform admin role must block API cost without tenant approval.");
  }

  if (!textListIncludes(platformRole?.cannotDo, "No premium upsell shown to children")) {
    errors.push("Platform admin role must block child-facing premium upsell.");
  }

  return errors;
}

export function getAiGeneratorResponsibilityMatrixWarnings(matrix: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(matrix)) {
    return warnings;
  }

  const summary = readString(matrix, "summary").toLowerCase();
  const standingRules = readStringArray(matrix, "standingRules").join(" ").toLowerCase();

  if (!summary.includes("handoff")) {
    warnings.push("AI generator responsibility matrix should describe generator handoff ownership.");
  }

  if (summary.includes("japanese") && !standingRules.includes("japanese support cannot unlock progress")) {
    warnings.push("MiniStar AI generator responsibility matrix should block Japanese support-language progress.");
  }

  if (summary.includes("japanese") && !standingRules.includes("hiragana-only")) {
    warnings.push("MiniStar AI generator responsibility matrix should preserve early hiragana-only support.");
  }

  return warnings;
}

export function validateAiGeneratorResponsibilityMatrices(matrices: unknown[]): string[] {
  return matrices.flatMap((matrix) => validateAiGeneratorResponsibilityMatrix(matrix));
}

export function getAiGeneratorResponsibilityMatrixCollectionWarnings(matrices: unknown[]): string[] {
  return matrices.flatMap((matrix) => getAiGeneratorResponsibilityMatrixWarnings(matrix));
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

function readResponsibilityRoles(source: Record<string, unknown>): AiGeneratorResponsibilityRole[] {
  const value = source.roles;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((role) => ({
    roleId: readString(role, "roleId") as AiGeneratorResponsibilityRoleId,
    label: readString(role, "label"),
    owner: readString(role, "owner"),
    summary: readString(role, "summary"),
    owns: readStringArray(role, "owns"),
    mustProvide: readStringArray(role, "mustProvide"),
    handoffRecords: readStringArray(role, "handoffRecords"),
    cannotDo: readStringArray(role, "cannotDo"),
    nextGate: readString(role, "nextGate"),
  }));
}

function textListIncludes(items: string[] | undefined, expected: string): boolean {
  return items?.some((item) => item.includes(expected)) ?? false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
