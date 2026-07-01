import type { TenantConfig, TenantMicrophonePracticeSettings } from "./types";

export const defaultMicrophonePracticeSettings: TenantMicrophonePracticeSettings = {
  localRecordReplayEnabled: false,
  teacherApprovalRequired: true,
  aiSpeechScoringEnabled: false,
  aiSpeechScoringPackageTier: "premium",
  privacyNotice: "Local record/replay stays in the browser tab and is not uploaded or stored by the core package.",
  costNotice: "Local record/replay has no API cost. AI transcription or pronunciation scoring is premium and may create API usage costs.",
};

export function getMicrophonePracticeSettings(tenant: TenantConfig): TenantMicrophonePracticeSettings {
  return tenant.microphonePractice ?? defaultMicrophonePracticeSettings;
}

export function getTeacherMicrophoneApprovalStorageKey(tenantId: string): string {
  return `living-textbook:${tenantId}:teacher-microphone-approval`;
}

export function parseStoredTeacherMicrophoneApproval(value: string | null): boolean | undefined {
  if (value === "approved") {
    return true;
  }

  if (value === "blocked") {
    return false;
  }

  return undefined;
}

export function serializeTeacherMicrophoneApproval(approved: boolean): string {
  return approved ? "approved" : "blocked";
}
