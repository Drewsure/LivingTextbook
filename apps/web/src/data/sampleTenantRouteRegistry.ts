import type {
  ContentPackage,
  FrontDoorAccessPolicy,
  LaunchSession,
  StudentProgressionState,
  TeacherSessionSettings,
  UnitPayload,
} from "@living-textbook/content-model";
import type { ClassRosterPlan } from "@living-textbook/content-model/src/classRoster";
import {
  getSampleFrontDoorLaunchSession,
  getSampleFrontDoorStudentProgression,
} from "./sampleLaunchSession";
import { findSampleClassRosterPlan } from "./sampleClassRosterPlans";
import {
  getSamplePartnerFrontDoorLaunchSession,
  getSamplePartnerFrontDoorStudentProgression,
  samplePartnerContentPackage,
  samplePartnerFrontDoorAccessPolicy,
  samplePartnerFrontDoorEntryCode,
  samplePartnerFrontDoorUserCode,
  samplePartnerPermanentQrPath,
} from "./samplePartnerPackage";
import {
  sampleFrontDoorAccessPolicy,
  sampleFrontDoorEntryCode,
  sampleFrontDoorUserCode,
  sampleMultimediaContentPackage,
  samplePermanentQrPath,
} from "./sampleMultimediaPackage";
import { createSampleTeacherSessionSettings } from "./sampleTeacherSessionSettings";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import type { TenantConfig } from "@/features/tenant/types";

export type SampleRouteRegistryStatus = "active-demo" | "draft" | "retired";

export interface SampleFrontDoorRouteRegistryEntry {
  routeId: string;
  path: string;
  status: SampleRouteRegistryStatus;
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  accessPolicy: FrontDoorAccessPolicy;
  expectedEntryCode: string;
  expectedUserCode: string;
  permanentQrPath: string;
  createLaunchSession: () => LaunchSession;
  createProgression: (launchCode: string, userCode: string) => StudentProgressionState;
}

export interface SampleFrontDoorContext {
  route: SampleFrontDoorRouteRegistryEntry;
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  unit?: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  sessionSettings: TeacherSessionSettings;
  accessPolicy: FrontDoorAccessPolicy;
  expectedEntryCode: string;
  expectedUserCode: string;
  allowedUserCodes: string[];
  classRosterPlan?: ClassRosterPlan;
}

export const sampleFrontDoorRouteRegistry: SampleFrontDoorRouteRegistryEntry[] = [
  {
    routeId: "front-door-ministar-l1-u1",
    path: "/enter/ministar",
    status: "active-demo",
    tenant: ministarTenant,
    contentPackage: sampleMultimediaContentPackage,
    accessPolicy: sampleFrontDoorAccessPolicy,
    expectedEntryCode: sampleFrontDoorEntryCode,
    expectedUserCode: sampleFrontDoorUserCode,
    permanentQrPath: samplePermanentQrPath,
    createLaunchSession: getSampleFrontDoorLaunchSession,
    createProgression: getSampleFrontDoorStudentProgression,
  },
  {
    routeId: "front-door-sample-publisher-l1-u1",
    path: "/enter/sample-publisher",
    status: "active-demo",
    tenant: samplePublisherTenant,
    contentPackage: samplePartnerContentPackage,
    accessPolicy: samplePartnerFrontDoorAccessPolicy,
    expectedEntryCode: samplePartnerFrontDoorEntryCode,
    expectedUserCode: samplePartnerFrontDoorUserCode,
    permanentQrPath: samplePartnerPermanentQrPath,
    createLaunchSession: getSamplePartnerFrontDoorLaunchSession,
    createProgression: getSamplePartnerFrontDoorStudentProgression,
  },
];

export function getSampleFrontDoorRouteByTenantId(
  tenantId: string,
): SampleFrontDoorRouteRegistryEntry | undefined {
  return sampleFrontDoorRouteRegistry.find((route) => route.tenant.id === tenantId && route.status === "active-demo");
}

export function createSampleFrontDoorContext(
  route: SampleFrontDoorRouteRegistryEntry,
): SampleFrontDoorContext {
  const launchSession = route.createLaunchSession();
  const classRosterPlan = findSampleClassRosterPlan(launchSession.launchCode);
  const allowedUserCodes = Array.from(
    new Set([route.expectedUserCode, ...(classRosterPlan?.slots.map((slot) => slot.userCode) ?? [])]),
  );
  const progression = route.createProgression(launchSession.launchCode, route.expectedUserCode.toLowerCase());
  const assistLanguagePlan = route.contentPackage.assistLanguagePlans?.find(
    (plan) => plan.unitKey === launchSession.unitKey && plan.studentVisibility !== "teacher-only",
  );
  const sessionSettings = createSampleTeacherSessionSettings({
    launchSession,
    assistLanguageEnabled: Boolean(route.tenant.languageSettings?.studentAssistEnabledByDefault && assistLanguagePlan),
    assistLanguageVisibility: "student-toggle",
  });

  return {
    route,
    tenant: route.tenant,
    contentPackage: route.contentPackage,
    unit: route.contentPackage.units[0],
    launchSession,
    progression,
    sessionSettings,
    accessPolicy: route.accessPolicy,
    expectedEntryCode: route.expectedEntryCode,
    expectedUserCode: route.expectedUserCode,
    allowedUserCodes,
    classRosterPlan,
  };
}
