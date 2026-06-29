import type { AiTutorModeId } from "@living-textbook/content-model";
import type { TenantConfig } from "./types";

export type AiTutorAvailability = {
  available: boolean;
  reason: string;
};

export function getAiTutorEntitlement(tenant: TenantConfig) {
  return tenant.featureEntitlements?.aiTutor;
}

export function getAiTutorAvailability(args: {
  tenant: TenantConfig;
  level?: number;
  mode?: AiTutorModeId;
}): AiTutorAvailability {
  const entitlement = getAiTutorEntitlement(args.tenant);

  if (!entitlement) {
    return {
      available: false,
      reason: "AI Tutor package is not configured for this tenant.",
    };
  }

  if (!entitlement.enabled) {
    return {
      available: false,
      reason: "AI Tutor is an optional premium package and is currently disabled.",
    };
  }

  if (entitlement.schoolEnabled === false) {
    return {
      available: false,
      reason: "AI Tutor is disabled by the school package settings.",
    };
  }

  if (entitlement.teacherEnabled === false) {
    return {
      available: false,
      reason: "AI Tutor is disabled for teacher launch.",
    };
  }

  if (args.level !== undefined && !entitlement.allowedLevels.includes(args.level)) {
    return {
      available: false,
      reason: "AI Tutor is not enabled for this level.",
    };
  }

  if (args.mode && !entitlement.allowedModes.includes(args.mode)) {
    return {
      available: false,
      reason: "AI Tutor is not enabled for this mode.",
    };
  }

  return {
    available: true,
    reason: "AI Tutor is enabled for this tenant package, level, and mode.",
  };
}

export function isAiTutorAvailable(args: {
  tenant: TenantConfig;
  level?: number;
  mode?: AiTutorModeId;
}): boolean {
  return getAiTutorAvailability(args).available;
}
