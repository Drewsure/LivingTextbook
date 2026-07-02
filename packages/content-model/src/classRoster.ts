import type { ContentPackageId, LaunchCode, TenantId } from "./index";

export type LearnerIdentityMode = "anonymous-practice" | "teacher-issued-code" | "school-roster-id" | "family-managed";
export type RosterReadiness = "demo-only" | "requires-policy" | "requires-persistence" | "pilot-ready";
export type LearnerDataField =
  | "display-name"
  | "teacher-issued-code"
  | "school-roster-id"
  | "family-contact"
  | "progress-summary"
  | "raw-audio"
  | "transcript";

export interface LearnerRosterSlot {
  slotId: string;
  label: string;
  userCode: string;
  identityMode: LearnerIdentityMode;
  storesRealName: boolean;
  storesFamilyContact: boolean;
  storesRawAudio: boolean;
  storesTranscript: boolean;
  canExportProgress: boolean;
  note: string;
}

export interface RosterDataBoundary {
  field: LearnerDataField;
  allowedInCoreDemo: boolean;
  requiresSchoolPolicy: boolean;
  requiresPersistence: boolean;
  note: string;
}

export interface ClassRosterPlan {
  rosterId: string;
  tenantId: TenantId;
  packageId: ContentPackageId;
  launchCode: LaunchCode;
  label: string;
  readiness: RosterReadiness;
  identityMode: LearnerIdentityMode;
  slots: LearnerRosterSlot[];
  dataBoundaries: RosterDataBoundary[];
  requiredBeforePilot: string[];
  note: string;
}

export function validateClassRosterPlan(plan: ClassRosterPlan): string[] {
  const errors: string[] = [];

  if (plan.rosterId.trim().length === 0) {
    errors.push("Class roster must include a roster id.");
  }

  if (plan.packageId.trim().length === 0 || plan.launchCode.trim().length === 0) {
    errors.push("Class roster must include package and launch code references.");
  }

  if (plan.slots.length === 0) {
    errors.push(`${plan.label}: at least one learner slot is required for roster reporting.`);
  }

  if (plan.readiness === "pilot-ready" && plan.requiredBeforePilot.length > 0) {
    errors.push(`${plan.label}: pilot-ready rosters cannot list required-before-pilot blockers.`);
  }

  if (plan.readiness === "demo-only" && (plan.identityMode === "school-roster-id" || plan.identityMode === "family-managed")) {
    errors.push(`${plan.label}: demo-only rosters cannot depend on school roster ids or family-managed accounts.`);
  }

  for (const slot of plan.slots) {
    if (slot.userCode.trim().length === 0) {
      errors.push(`${plan.label}: every learner slot must have a non-empty user code.`);
    }

    if (slot.storesRawAudio) {
      errors.push(`${plan.label}: raw microphone audio must not be stored on learner roster slots.`);
    }

    if (slot.storesTranscript) {
      errors.push(`${plan.label}: speech transcripts must not be stored on learner roster slots.`);
    }

    if (slot.storesRealName && plan.readiness !== "pilot-ready") {
      errors.push(`${plan.label}: real learner names require pilot-ready policy and persistence review.`);
    }

    if (slot.storesFamilyContact) {
      errors.push(`${plan.label}: family contact data is outside the core roster contract.`);
    }
  }

  for (const boundary of plan.dataBoundaries) {
    if (boundary.field === "raw-audio" && boundary.allowedInCoreDemo) {
      errors.push(`${plan.label}: raw audio cannot be allowed in the core demo roster boundary.`);
    }

    if (boundary.field === "transcript" && boundary.allowedInCoreDemo) {
      errors.push(`${plan.label}: transcripts cannot be allowed in the core demo roster boundary.`);
    }
  }

  return errors;
}

export function getClassRosterWarnings(plan: ClassRosterPlan): string[] {
  const warnings: string[] = [];

  if (plan.readiness !== "pilot-ready") {
    warnings.push(`${plan.label}: roster is not production-ready until policy, persistence, and reporting export rules are accepted.`);
  }

  if (plan.identityMode === "anonymous-practice") {
    warnings.push(`${plan.label}: anonymous practice supports demos but cannot produce durable learner history.`);
  }

  if (plan.identityMode === "teacher-issued-code" && !plan.dataBoundaries.some((boundary) => boundary.field === "teacher-issued-code")) {
    warnings.push(`${plan.label}: teacher-issued code mode should declare a teacher-issued-code data boundary.`);
  }

  if (!plan.dataBoundaries.some((boundary) => boundary.field === "progress-summary")) {
    warnings.push(`${plan.label}: teacher reports require a progress-summary data boundary.`);
  }

  for (const requirement of plan.requiredBeforePilot) {
    warnings.push(`${plan.label}: ${requirement}`);
  }

  return warnings;
}
