import type { ContentPackageId, GameModeId, LaunchAccessMode, LaunchCode, TenantId } from "./index";

export type TeacherAssignmentReadiness = "demo-ready" | "requires-persistence" | "requires-policy" | "ready-for-pilot";
export type TeacherAssignmentAudience = "whole-class" | "small-group" | "home-practice" | "teacher-preview";
export type TeacherAssignmentControlStatus = "enabled" | "disabled" | "teacher-optional" | "policy-blocked" | "premium-disabled";

export interface TeacherAssignmentControlPlan {
  controlId: string;
  label: string;
  status: TeacherAssignmentControlStatus;
  requiresTeacherApproval: boolean;
  requiresSchoolPolicy: boolean;
  costBearing: boolean;
  note: string;
}

export interface TeacherAssignmentAccessPlan {
  accessMode: LaunchAccessMode;
  routePath: string;
  entryCodeRequired: boolean;
  userCodeRequired: boolean;
  anonymousPracticeAllowed: boolean;
  stableQrReady: boolean;
  localFallbackReady: boolean;
}

export interface TeacherAssignmentPlan {
  assignmentId: string;
  tenantId: TenantId;
  packageId: ContentPackageId;
  launchCode: LaunchCode;
  label: string;
  audience: TeacherAssignmentAudience;
  readiness: TeacherAssignmentReadiness;
  targetGameModes: GameModeId[];
  access: TeacherAssignmentAccessPlan;
  controls: TeacherAssignmentControlPlan[];
  requiredBeforePilot: string[];
  note: string;
}

export function validateTeacherAssignmentPlan(plan: TeacherAssignmentPlan): string[] {
  const errors: string[] = [];

  if (plan.assignmentId.trim().length === 0) {
    errors.push("Teacher assignment must include an assignment id.");
  }

  if (plan.packageId.trim().length === 0 || plan.launchCode.trim().length === 0) {
    errors.push("Teacher assignment must include package and launch code references.");
  }

  if (plan.targetGameModes.length === 0) {
    errors.push("Teacher assignment must include at least one target game mode.");
  }

  if (plan.readiness === "ready-for-pilot" && plan.requiredBeforePilot.length > 0) {
    errors.push("Ready-for-pilot assignments cannot list required-before-pilot blockers.");
  }

  if (plan.access.routePath.includes("localhost") || plan.access.routePath.includes("127.0.0.1")) {
    errors.push("Teacher assignment routes must not use temporary local development URLs.");
  }

  for (const control of plan.controls) {
    if (control.status === "enabled" && control.requiresSchoolPolicy && plan.readiness !== "ready-for-pilot") {
      errors.push(`${control.label} cannot be enabled for pilot until policy readiness is accepted.`);
    }

    if (control.costBearing && control.status === "enabled") {
      errors.push(`${control.label} is cost-bearing and should not be enabled by default in core assignment plans.`);
    }
  }

  return errors;
}

export function getTeacherAssignmentWarnings(plan: TeacherAssignmentPlan): string[] {
  const warnings: string[] = [];

  if (!plan.access.stableQrReady) {
    warnings.push(`${plan.label}: stable QR registry is not ready.`);
  }

  if (!plan.access.localFallbackReady && plan.access.accessMode === "permanent-qr") {
    warnings.push(`${plan.label}: permanent QR path has no local fallback yet.`);
  }

  for (const blocker of plan.requiredBeforePilot) {
    warnings.push(`${plan.label}: ${blocker}`);
  }

  for (const control of plan.controls) {
    if (control.status === "policy-blocked") {
      warnings.push(`${plan.label}: ${control.label} is blocked by school or tenant policy.`);
    }

    if (control.status === "premium-disabled") {
      warnings.push(`${plan.label}: ${control.label} remains premium-disabled for the core plan.`);
    }
  }

  return warnings;
}
