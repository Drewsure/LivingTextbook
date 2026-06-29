import type { TenantFeatureEntitlements, TenantLanguageSettings } from "@living-textbook/content-model";

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

export interface TenantConfig {
  id: string;
  displayName: string;
  curriculumName: string;
  rewardName: string;
  avatarFamilies: string[];
  featureEntitlements?: TenantFeatureEntitlements;
  languageSettings?: TenantLanguageSettings;
  brand: TenantBrand;
}
