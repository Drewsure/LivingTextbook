import type {
  ContentPackage,
  LaunchSession,
  StudentProgressionState,
  TeacherSessionSettings,
  UnitAssistLanguagePlan,
  UnitAudioSupportPlan,
  UnitPayload,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan, ClassRosterPlan } from "@living-textbook/content-model";
import { notFound } from "next/navigation";
import { getSampleLaunchSession, getSampleStudentProgression } from "./sampleLaunchSession";
import {
  getSamplePartnerLaunchSession,
  getSamplePartnerStudentProgression,
  samplePartnerContentPackage,
  samplePartnerLaunchCode,
} from "./samplePartnerPackage";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
import { createSampleTeacherSessionSettings } from "./sampleTeacherSessionSettings";
import { findSampleTeacherAssignmentPlan } from "./sampleTeacherAssignmentPlans";
import { findSampleClassRosterPlan } from "./sampleClassRosterPlans";
import { findSampleUnitGameOfferMap } from "./sampleUnitGameOfferMap";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import type { TenantConfig } from "@living-textbook/content-model";
import type { UnitGameOfferMap } from "@living-textbook/content-model";

const reviewedLaunchCodes = new Set([samplePartnerLaunchCode, "demo-unit-1"]);

export interface SampleLaunchContext {
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  unit?: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  sessionSettings: TeacherSessionSettings;
  assistLanguagePlan?: UnitAssistLanguagePlan;
  audioSupportPlan?: UnitAudioSupportPlan;
  assignmentPlan?: TeacherAssignmentPlan;
  offerMap?: UnitGameOfferMap;
  classRosterPlan?: ClassRosterPlan;
}

export function resolveSampleLaunchContext(code: string): SampleLaunchContext {
  if (!reviewedLaunchCodes.has(code)) {
    notFound();
  }

  if (code === samplePartnerLaunchCode) {
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

function withPackagePlans(context: Omit<SampleLaunchContext, "assistLanguagePlan" | "audioSupportPlan" | "assignmentPlan" | "sessionSettings">): SampleLaunchContext {
  const assistLanguagePlan = context.contentPackage.assistLanguagePlans?.find(
    (plan) => plan.unitKey === context.launchSession.unitKey && plan.studentVisibility !== "teacher-only",
  );
  const assignmentPlan = findSampleTeacherAssignmentPlan(context.launchSession.launchCode);
  const audioSupportPlan = context.contentPackage.audioSupportPlans?.find((plan) => plan.unitKey === context.launchSession.unitKey);
  const classRosterPlan = findSampleClassRosterPlan(context.launchSession.launchCode);
  const sessionSettings = createSampleTeacherSessionSettings({
    launchSession: context.launchSession,
    assistLanguageEnabled: Boolean(context.tenant.languageSettings?.studentAssistEnabledByDefault && assistLanguagePlan),
    assistLanguageVisibility: "student-toggle",
  });

  return {
    ...context,
    sessionSettings,
    assistLanguagePlan,
    audioSupportPlan,
    assignmentPlan,
    offerMap: findSampleUnitGameOfferMap(context.contentPackage.meta.packageId),
    classRosterPlan,
  };
}
