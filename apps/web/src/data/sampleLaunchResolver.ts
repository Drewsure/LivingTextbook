import type {
  ContentPackage,
  LaunchSession,
  StudentProgressionState,
  UnitAssistLanguagePlan,
  UnitPayload,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import { getSampleLaunchSession, getSampleStudentProgression } from "./sampleLaunchSession";
import {
  getSamplePartnerLaunchSession,
  getSamplePartnerStudentProgression,
  samplePartnerContentPackage,
  samplePartnerLaunchCode,
} from "./samplePartnerPackage";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
import { findSampleTeacherAssignmentPlan } from "./sampleTeacherAssignmentPlans";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import type { TenantConfig } from "@/features/tenant/types";

export interface SampleLaunchContext {
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  unit?: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  assistLanguagePlan?: UnitAssistLanguagePlan;
  assignmentPlan?: TeacherAssignmentPlan;
}

export function resolveSampleLaunchContext(code: string): SampleLaunchContext {
  if (code === samplePartnerLaunchCode || code.startsWith("partner-")) {
    const launchSession = getSamplePartnerLaunchSession(code);

    return withPackagePlans({
      tenant: samplePublisherTenant,
      contentPackage: samplePartnerContentPackage,
      unit: samplePartnerContentPackage.units[0],
      launchSession,
      progression: getSamplePartnerStudentProgression(code),
    });
  }

  const launchSession = getSampleLaunchSession(code);

  return withPackagePlans({
    tenant: ministarTenant,
    contentPackage: sampleMultimediaContentPackage,
    unit: sampleMultimediaContentPackage.units[0],
    launchSession,
    progression: getSampleStudentProgression(code),
  });
}

function withPackagePlans(context: Omit<SampleLaunchContext, "assistLanguagePlan" | "assignmentPlan">): SampleLaunchContext {
  const assistLanguagePlan = context.contentPackage.assistLanguagePlans?.find(
    (plan) => plan.unitKey === context.launchSession.unitKey && plan.studentVisibility !== "teacher-only",
  );
  const assignmentPlan = findSampleTeacherAssignmentPlan(context.launchSession.launchCode);

  return {
    ...context,
    assistLanguagePlan,
    assignmentPlan,
  };
}
