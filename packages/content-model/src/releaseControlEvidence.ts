import type { LocalBundleMediaReleaseControlBinding } from "./localBundleMediaReleaseControlBinding";

export type ReleaseControlEvidenceDecision = LocalBundleMediaReleaseControlBinding["decision"];

export interface ReleaseControlEvidence {
  bindingId: string;
  releaseGateId: string;
  tenantId: string;
  packageId: string;
  packageVersion: string;
  decision: ReleaseControlEvidenceDecision;
  releaseBlockingReasons: string[];
  requiredApprovals: string[];
  blockedActions: string[];
  promotionAllowed: false;
  studentFacingAllowed: false;
  localActivationAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function toReleaseControlEvidence(binding: LocalBundleMediaReleaseControlBinding): ReleaseControlEvidence {
  return {
    bindingId: binding.bindingId,
    releaseGateId: binding.releaseGateId,
    tenantId: binding.tenantId,
    packageId: binding.packageId,
    packageVersion: binding.packageVersion,
    decision: binding.decision,
    releaseBlockingReasons: [...binding.releaseBlockingReasons],
    requiredApprovals: [...binding.requiredApprovals],
    blockedActions: [...binding.blockedActions],
    promotionAllowed: false,
    studentFacingAllowed: false,
    localActivationAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateReleaseControlEvidence(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Release-control evidence must be a JSON object."];
  for (const field of ["bindingId", "releaseGateId", "tenantId", "packageId", "packageVersion"] as const) {
    if (!readString(value, field)) errors.push(`Release-control evidence requires ${field}.`);
  }
  if (!(Array.from(["blocked", "needs-review", "evidence-ready"]) as string[]).includes(readString(value, "decision"))) {
    errors.push("Release-control evidence requires a supported decision.");
  }
  if (value.promotionAllowed !== false || value.studentFacingAllowed !== false || value.localActivationAllowed !== false) {
    errors.push("Release-control evidence must keep promotion, student-facing use, and local activation false.");
  }
  if (readString(value, "mode") !== "review-only" || readString(value, "sideEffect") !== "none") {
    errors.push("Release-control evidence must remain review-only with no side effect.");
  }
  if (readStringArray(value, "releaseBlockingReasons").length === 0) {
    errors.push("Release-control evidence must expose release-blocking reasons.");
  }
  if (readStringArray(value, "requiredApprovals").length === 0) {
    errors.push("Release-control evidence must list required approvals.");
  }
  if (readStringArray(value, "blockedActions").length === 0) {
    errors.push("Release-control evidence must list blocked actions.");
  }
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(source: Record<string, unknown>, key: string): string {
  return typeof source[key] === "string" ? source[key].trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  return Array.isArray(source[key])
    ? source[key].filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean)
    : [];
}
