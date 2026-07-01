import type {
  ContentPackage,
  FrontDoorAccessPolicy,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import {
  getSampleFrontDoorLaunchSession,
  getSampleFrontDoorStudentProgression,
} from "./sampleLaunchSession";
import {
  getSamplePartnerFrontDoorLaunchSession,
  getSamplePartnerFrontDoorStudentProgression,
  samplePartnerContentPackage,
  samplePartnerFrontDoorAccessPolicy,
  samplePartnerFrontDoorEntryCode,
  samplePartnerFrontDoorUserCode,
} from "./samplePartnerPackage";
import {
  sampleFrontDoorAccessPolicy,
  sampleFrontDoorEntryCode,
  sampleFrontDoorUserCode,
  sampleMultimediaContentPackage,
} from "./sampleMultimediaPackage";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import type { TenantConfig } from "@/features/tenant/types";

export interface SampleFrontDoorContext {
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  unit?: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  accessPolicy: FrontDoorAccessPolicy;
  expectedEntryCode: string;
  expectedUserCode: string;
}

export function resolveSampleFrontDoorContext(tenantId: string): SampleFrontDoorContext | undefined {
  if (tenantId === samplePublisherTenant.id) {
    const launchSession = getSamplePartnerFrontDoorLaunchSession();

    return {
      tenant: samplePublisherTenant,
      contentPackage: samplePartnerContentPackage,
      unit: samplePartnerContentPackage.units[0],
      launchSession,
      progression: getSamplePartnerFrontDoorStudentProgression(
        launchSession.launchCode,
        samplePartnerFrontDoorUserCode.toLowerCase(),
      ),
      accessPolicy: samplePartnerFrontDoorAccessPolicy,
      expectedEntryCode: samplePartnerFrontDoorEntryCode,
      expectedUserCode: samplePartnerFrontDoorUserCode,
    };
  }

  if (tenantId === ministarTenant.id) {
    const launchSession = getSampleFrontDoorLaunchSession();

    return {
      tenant: ministarTenant,
      contentPackage: sampleMultimediaContentPackage,
      unit: sampleMultimediaContentPackage.units[0],
      launchSession,
      progression: getSampleFrontDoorStudentProgression(
        launchSession.launchCode,
        sampleFrontDoorUserCode.toLowerCase(),
      ),
      accessPolicy: sampleFrontDoorAccessPolicy,
      expectedEntryCode: sampleFrontDoorEntryCode,
      expectedUserCode: sampleFrontDoorUserCode,
    };
  }

  return undefined;
}
