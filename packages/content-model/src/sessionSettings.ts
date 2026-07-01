import type { AssistLanguageVisibility, FeaturePackageTier, LaunchCode, TenantId } from "./index";

export type SessionSettingReadiness = "enabled" | "disabled" | "requires-persistence" | "premium-disabled";
export type SessionDataRetentionPolicy = "demo-only" | "session-only" | "school-policy" | "tenant-policy";
export type TeacherSessionControlReadiness = "ready" | "requires-persistence" | "requires-policy" | "disabled";
export type TeacherSessionControlActionId = "open-session" | "lock-session" | "resume-session" | "end-session" | "export-report";

export interface TeacherSessionSetting {
  settingId: string;
  label: string;
  status: SessionSettingReadiness;
  note: string;
}

export interface TeacherSessionControlAction {
  actionId: TeacherSessionControlActionId;
  label: string;
  status: TeacherSessionControlReadiness;
  requiresTeacherRole: boolean;
  requiresPolicy: boolean;
  note: string;
}

export interface TeacherSessionSettings {
  launchCode: LaunchCode;
  tenantId: TenantId;
  audioRequired: boolean;
  assistLanguage: {
    enabled: boolean;
    unlockAllowed: boolean;
    masteryCreditAllowed: boolean;
    visibility: AssistLanguageVisibility;
  };
  microphonePractice: {
    enabled: boolean;
    requiresTeacherApproval: boolean;
    approvalPersisted: boolean;
    storesRawAudio: boolean;
  };
  backgroundMedia: {
    allowed: boolean;
    defaultEnabled: boolean;
    requiresTeacherEnablement: boolean;
  };
  aiTutor: {
    enabled: boolean;
    packageTier: FeaturePackageTier;
    speechScoringEnabled: boolean;
    storesTranscript: boolean;
  };
  reporting: {
    reportProgressToTeacher: boolean;
    retentionPolicy: SessionDataRetentionPolicy;
    exportAllowed: boolean;
    storesRawAudio: boolean;
    storesTranscript: boolean;
  };
  updatedAt: string;
}

export function validateTeacherSessionSettings(settings: TeacherSessionSettings): string[] {
  const errors: string[] = [];

  if (settings.launchCode.trim().length === 0) {
    errors.push("Teacher session settings require a launch code.");
  }

  if (settings.tenantId.trim().length === 0) {
    errors.push("Teacher session settings require a tenant id.");
  }

  if (!settings.audioRequired) {
    errors.push("Learner-facing audio must remain required for student-ready sessions.");
  }

  if (settings.assistLanguage.unlockAllowed) {
    errors.push("Assist-language activity cannot unlock games.");
  }

  if (settings.assistLanguage.masteryCreditAllowed) {
    errors.push("Assist-language activity cannot award mastery credit.");
  }

  if (settings.microphonePractice.storesRawAudio && settings.reporting.retentionPolicy === "demo-only") {
    errors.push("Demo-only sessions must not store raw audio.");
  }

  if (settings.aiTutor.enabled && settings.aiTutor.packageTier !== "premium" && settings.aiTutor.packageTier !== "enterprise") {
    errors.push("Enabled AI Tutor session settings must require premium or enterprise entitlement.");
  }

  if (!settings.aiTutor.enabled && settings.aiTutor.speechScoringEnabled) {
    errors.push("Speech scoring cannot be enabled when AI Tutor is disabled.");
  }

  if (settings.reporting.storesTranscript && settings.reporting.retentionPolicy === "demo-only") {
    errors.push("Demo-only sessions must not store transcripts.");
  }

  if (settings.reporting.storesRawAudio && settings.reporting.retentionPolicy === "demo-only") {
    errors.push("Demo-only sessions must not store raw audio.");
  }

  return errors;
}

export function getTeacherSessionPersistenceWarnings(settings: TeacherSessionSettings): string[] {
  const warnings: string[] = [];

  if (settings.microphonePractice.enabled && settings.microphonePractice.requiresTeacherApproval && !settings.microphonePractice.approvalPersisted) {
    warnings.push("Teacher microphone approval is still demo-local and must become a persisted launch-session setting.");
  }

  if (settings.backgroundMedia.allowed && settings.backgroundMedia.requiresTeacherEnablement) {
    warnings.push("Background media requires persisted teacher enablement before student devices can rely on it.");
  }

  if (settings.reporting.reportProgressToTeacher && settings.reporting.retentionPolicy === "demo-only") {
    warnings.push("Teacher reporting is demo-only until privacy, retention, access, and export rules are accepted.");
  }

  if (!settings.reporting.exportAllowed) {
    warnings.push("Teacher report export is not enabled for this scaffold.");
  }

  return warnings;
}

export function validateTeacherSessionControlActions(actions: TeacherSessionControlAction[]): string[] {
  const errors: string[] = [];
  const ids = new Set<TeacherSessionControlActionId>();

  for (const action of actions) {
    if (ids.has(action.actionId)) {
      errors.push(`Duplicate teacher session control action: ${action.actionId}.`);
    }

    ids.add(action.actionId);

    if (action.label.trim().length === 0) {
      errors.push(`Teacher session control ${action.actionId} must include a label.`);
    }

    if (action.note.trim().length === 0) {
      errors.push(`Teacher session control ${action.actionId} must include a note.`);
    }

    if (!action.requiresTeacherRole) {
      errors.push(`Teacher session control ${action.actionId} must require a teacher role before classroom use.`);
    }

    if (action.actionId === "export-report" && !action.requiresPolicy) {
      errors.push("Report export must require accepted school or tenant policy.");
    }
  }

  return errors;
}

export function getTeacherSessionControlWarnings(actions: TeacherSessionControlAction[]): string[] {
  return actions
    .filter((action) => action.status === "requires-persistence" || action.status === "requires-policy")
    .map((action) => `${action.label} is not pilot-ready. Current readiness: ${action.status}.`);
}
