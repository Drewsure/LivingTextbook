import type { TenantConfig } from "@living-textbook/content-model";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

const knownTenants: Record<string, TenantConfig> = {
  ministar: ministarTenant,
  "sample-publisher": samplePublisherTenant,
};

/** Prefer package-owned branding, while preserving the demo tenant registry. */
export function resolveLocalPilotPackageTenant(tenantId: string, embeddedTenant?: TenantConfig): TenantConfig | null {
  if (!isSafeTenantId(tenantId)) return null;
  if (embeddedTenant?.id === tenantId) return embeddedTenant;
  if (knownTenants[tenantId]) return knownTenants[tenantId];
  return createGenericWhiteLabelTenant(tenantId);
}

function createGenericWhiteLabelTenant(tenantId: string): TenantConfig {
  return {
    id: tenantId,
    displayName: tenantId,
    curriculumName: "Living Textbook",
    rewardName: "Learning Sparks",
    avatarFamilies: ["tenant-default"],
    languageSettings: {
      targetLanguage: "en",
      defaultUiLanguage: "en",
      assistLanguages: [],
      studentAssistEnabledByDefault: false,
      liveAiAssistAllowed: false,
    },
    microphonePractice: {
      localRecordReplayEnabled: false,
      teacherApprovalRequired: true,
      aiSpeechScoringEnabled: false,
      aiSpeechScoringPackageTier: "premium",
      privacyNotice: "Local microphone practice is not enabled for this package configuration.",
      costNotice: "AI speech services remain disabled until the tenant opts in and accepts the cost and privacy policy.",
    },
    brand: {
      primary: "#1f4d3a",
      primaryText: "#ffffff",
      primarySoft: "#e7f4ed",
      accent: "#176b87",
      accentText: "#ffffff",
      accentSoft: "#e4f4f8",
      background: "#f5faf7",
      surface: "#ffffff",
      text: "#15251d",
      muted: "#5f7168",
      border: "#d6e4dc",
    },
  };
}

function isSafeTenantId(value: string): boolean {
  return value.length > 0 && value.length <= 160 && /^[A-Za-z0-9._-]+$/.test(value);
}
