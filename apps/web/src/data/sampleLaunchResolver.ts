import type {
  ContentPackage,
  LaunchSession,
  StudentProgressionState,
  UnitAssistLanguagePlan,
  UnitPayload,
} from "@living-textbook/content-model";
import { getSampleLaunchSession, getSampleStudentProgression } from "./sampleLaunchSession";
import {
  getSamplePartnerLaunchSession,
  getSamplePartnerStudentProgression,
  samplePartnerContentPackage,
  samplePartnerLaunchCode,
} from "./samplePartnerPackage";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
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
}

export function resolveSampleLaunchContext(code: string): SampleLaunchContext {
  if (code === samplePartnerLaunchCode || code.startsWith("partner-")) {
    const launchSession = getSamplePartnerLaunchSession(code);

    return withAssistLanguagePlan({
      tenant: samplePublisherTenant,
      contentPackage: samplePartnerContentPackage,
      unit: samplePartnerContentPackage.units[0],
      launchSession,
      progression: getSamplePartnerStudentProgression(code),
    });
  }

  const launchSession = getSampleLaunchSession(code);

  return withAssistLanguagePlan({
    tenant: ministarTenant,
    contentPackage: sampleMultimediaContentPackage,
    unit: sampleMultimediaContentPackage.units[0],
    launchSession,
    progression: getSampleStudentProgression(code),
  });
}

function withAssistLanguagePlan(context: Omit<SampleLaunchContext, "assistLanguagePlan">): SampleLaunchContext {
  const assistLanguagePlan = context.contentPackage.assistLanguagePlans?.find(
    (plan) => plan.unitKey === context.launchSession.unitKey && plan.studentVisibility !== "teacher-only",
  );

  return {
    ...context,
    assistLanguagePlan,
  };
}
