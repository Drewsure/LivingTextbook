import type { FeaturePackageTier, TenantFeatureEntitlements, TenantLanguageSettings } from "./index";

export interface TenantBrand {
  primary: string;
  primaryText: string;
  primarySoft: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
}

export interface TenantMicrophonePracticeSettings {
  localRecordReplayEnabled: boolean;
  teacherApprovalRequired: boolean;
  aiSpeechScoringEnabled: boolean;
  aiSpeechScoringPackageTier?: FeaturePackageTier;
  privacyNotice: string;
  costNotice: string;
}

export interface TenantConfig {
  id: string;
  displayName: string;
  curriculumName: string;
  rewardName: string;
  avatarFamilies: string[];
  featureEntitlements?: TenantFeatureEntitlements;
  languageSettings?: TenantLanguageSettings;
  microphonePractice?: TenantMicrophonePracticeSettings;
  brand: TenantBrand;
}

const safeTenantIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const safeTenantColorPattern = /^#[0-9a-fA-F]{6}$/;

/** Validate tenant branding embedded in an approved local bundle. */
export function validateTenantConfig(value: unknown, expectedTenantId?: string): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Tenant configuration must be an object."];

  for (const field of ["id", "displayName", "curriculumName", "rewardName"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Tenant configuration ${field} must be non-empty.`);
  }
  const id = readString(value.id);
  if (id && !safeTenantIdentifierPattern.test(id)) errors.push("Tenant configuration id contains unsafe identifier characters.");
  if (expectedTenantId && id !== expectedTenantId) errors.push("Tenant configuration id must match the local bundle tenant id.");

  const avatarFamilies = value.avatarFamilies;
  if (!Array.isArray(avatarFamilies) || avatarFamilies.length === 0 || avatarFamilies.some((family) => !isNonEmptyString(family))) {
    errors.push("Tenant configuration avatarFamilies must contain at least one non-empty family.");
  }

  const brand = value.brand;
  if (!isRecord(brand)) {
    errors.push("Tenant configuration brand must be an object.");
  } else {
    for (const field of ["primary", "primaryText", "primarySoft", "accent", "accentText", "accentSoft", "background", "surface", "text", "muted", "border"] as const) {
      if (!safeTenantColorPattern.test(readString(brand[field]))) errors.push(`Tenant configuration brand ${field} must be a six-digit hex color.`);
    }
  }

  const languageSettings = value.languageSettings;
  if (languageSettings !== undefined) {
    if (!isRecord(languageSettings)) {
      errors.push("Tenant configuration languageSettings must be an object.");
    } else {
      if (!isNonEmptyString(languageSettings.targetLanguage)) errors.push("Tenant configuration targetLanguage must be non-empty.");
      if (!isNonEmptyString(languageSettings.defaultUiLanguage)) errors.push("Tenant configuration defaultUiLanguage must be non-empty.");
      if (languageSettings.assistLanguages !== undefined && (!Array.isArray(languageSettings.assistLanguages) || languageSettings.assistLanguages.some((language) => !isNonEmptyString(language)))) {
        errors.push("Tenant configuration assistLanguages must contain only non-empty language codes.");
      }
    }
  }

  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
