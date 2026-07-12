import type { TenantConfig } from "./types";

export function getTeacherAssistLanguageApprovalStorageKey(tenantId: string): string {
  return `living-textbook:${tenantId}:teacher-assist-language-enabled`;
}

export function parseStoredTeacherAssistLanguageApproval(value: string | null): boolean | undefined {
  if (value === "enabled") {
    return true;
  }

  if (value === "disabled") {
    return false;
  }

  return undefined;
}

export function serializeTeacherAssistLanguageApproval(enabled: boolean): string {
  return enabled ? "enabled" : "disabled";
}

export function getDefaultAssistLanguageEnabled(tenant: TenantConfig): boolean {
  return Boolean(tenant.languageSettings?.studentAssistEnabledByDefault);
}
