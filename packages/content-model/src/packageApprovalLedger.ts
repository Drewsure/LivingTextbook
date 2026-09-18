export type PackageApprovalStatus = "signed" | "needs-signoff" | "blocked";
export type PackageApprovalRole =
  | "content"
  | "media"
  | "games"
  | "qr"
  | "policy"
  | "deployment"
  | "platform";

export interface PackageApprovalSignoff {
  signoffId: string;
  label: string;
  role: PackageApprovalRole;
  status: PackageApprovalStatus;
  owner: string;
  requiredBeforePilot: boolean;
  evidence: string;
  nextStep: string;
  cannotApproveWhile: string[];
}

export interface PackageApprovalLedger {
  ledgerId: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  label: string;
  summary: string;
  approvalRule: string;
  mode: "review-only";
  state: "evidence-only";
  approvalCaptureAllowed: false;
  packagePromotionAllowed: false;
  signoffs: PackageApprovalSignoff[];
  auditRules: string[];
}

const REQUIRED_ROLES: PackageApprovalRole[] = [
  "content",
  "media",
  "games",
  "qr",
  "policy",
  "deployment",
  "platform",
];

const VALID_STATUSES: PackageApprovalStatus[] = ["signed", "needs-signoff", "blocked"];

export function validatePackageApprovalLedger(ledger: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(ledger)) {
    return ["Package approval ledger must be a JSON object."];
  }

  for (const field of ["ledgerId", "tenantId", "packageId", "releaseCandidate", "label", "summary", "approvalRule"] as const) {
    if (!isNonEmptyString(ledger[field])) errors.push(`Package approval ledger ${field} is required.`);
  }

  if (ledger.mode !== "review-only") errors.push("Package approval ledger must remain review-only.");
  if (ledger.state !== "evidence-only") errors.push("Package approval ledger state must remain evidence-only.");
  if (ledger.approvalCaptureAllowed !== false) errors.push("Package approval capture must remain blocked in the foundation.");
  if (ledger.packagePromotionAllowed !== false) errors.push("Package promotion must remain blocked by the approval ledger.");

  if (!Array.isArray(ledger.signoffs) || ledger.signoffs.length === 0) {
    errors.push("Package approval ledger must include sign-offs.");
  }

  const signoffs = Array.isArray(ledger.signoffs) ? ledger.signoffs.filter(isRecord) : [];
  const roles = signoffs.map((signoff) => signoff.role).filter((role): role is PackageApprovalRole => isPackageApprovalRole(role));

  for (const role of REQUIRED_ROLES) {
    if (!roles.includes(role)) errors.push(`Package approval ledger is missing required role: ${role}.`);
  }

  if (new Set(roles).size !== roles.length) errors.push("Package approval ledger roles must be unique.");

  for (const signoff of signoffs) {
    for (const field of ["signoffId", "label", "owner", "evidence", "nextStep"] as const) {
      if (!isNonEmptyString(signoff[field])) errors.push(`Package approval sign-off ${String(signoff.signoffId ?? "unknown")} requires ${field}.`);
    }

    if (!isPackageApprovalRole(signoff.role)) {
      errors.push(`Package approval sign-off ${String(signoff.signoffId ?? "unknown")} has an unsupported role.`);
    }

    if (!VALID_STATUSES.includes(signoff.status as PackageApprovalStatus)) {
      errors.push(`Package approval sign-off ${String(signoff.signoffId ?? "unknown")} has an unsupported status.`);
    }

    if (typeof signoff.requiredBeforePilot !== "boolean") {
      errors.push(`Package approval sign-off ${String(signoff.signoffId ?? "unknown")} requiredBeforePilot must be a boolean.`);
    }

    if (!Array.isArray(signoff.cannotApproveWhile) || signoff.cannotApproveWhile.length === 0) {
      errors.push(`Package approval sign-off ${String(signoff.signoffId ?? "unknown")} must state its blocking conditions.`);
    }
  }

  if (!Array.isArray(ledger.auditRules) || ledger.auditRules.length === 0) {
    errors.push("Package approval ledger must include audit rules.");
  }

  return [...new Set(errors)];
}

function isPackageApprovalRole(value: unknown): value is PackageApprovalRole {
  return REQUIRED_ROLES.includes(value as PackageApprovalRole);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
