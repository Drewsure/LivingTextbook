import type { AssistLanguageVisibility, FeaturePackageTier, LaunchCode, TenantId } from "./index";

export type SessionSettingReadiness = "enabled" | "disabled" | "requires-persistence" | "premium-disabled";
export type SessionDataRetentionPolicy = "demo-only" | "session-only" | "school-policy" | "tenant-policy";
export type TeacherSessionControlReadiness = "ready" | "requires-persistence" | "requires-policy" | "disabled";
export type TeacherSessionControlActionId = "open-session" | "lock-session" | "resume-session" | "end-session" | "export-report";
export type TeacherReportExportReadiness = "ready" | "demo-preview" | "blocked-persistence" | "blocked-policy";
export type TeacherReportExportFormat = "csv-summary" | "json-event-stream" | "pdf-family-summary";
export type TeacherReportExportScope =
  | "teacher-summary"
  | "student-progress"
  | "event-stream"
  | "media-engagement"
  | "training-recovery"
  | "speech-practice-summary";

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

export interface TeacherReportExportPlan {
  launchCode: LaunchCode;
  tenantId: TenantId;
  readiness: TeacherReportExportReadiness;
  allowedFormats: TeacherReportExportFormat[];
  includedScopes: TeacherReportExportScope[];
  requiresTeacherRole: boolean;
  requiresAcceptedPolicy: boolean;
  policyAccepted: boolean;
  persistenceReady: boolean;
  retentionPolicy: SessionDataRetentionPolicy;
  excludesRawAudio: boolean;
  excludesTranscripts: boolean;
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
    pausesForLearningAudio: boolean;
    unlockAllowed: boolean;
    masteryCreditAllowed: boolean;
  };
  trainingRecovery: {
    enabled: boolean;
    repeatedMissThreshold: number;
    lowCompletionRewardThreshold: number;
    highAttemptRatioThreshold: number;
    teacherCanAdjust: boolean;
    settingsPersisted: boolean;
    rewardsAreDeterministic: boolean;
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

  if (settings.backgroundMedia.allowed && !settings.backgroundMedia.pausesForLearningAudio) {
    errors.push("Background media must pause, duck, or mute when learner-facing audio plays.");
  }

  if (settings.backgroundMedia.unlockAllowed) {
    errors.push("Background media cannot unlock games or progression.");
  }

  if (settings.backgroundMedia.masteryCreditAllowed) {
    errors.push("Background media cannot award mastery credit.");
  }

  if (settings.trainingRecovery.enabled && settings.trainingRecovery.repeatedMissThreshold < 1) {
    errors.push("Training Academy repeated-miss threshold must be at least 1.");
  }

  if (settings.trainingRecovery.enabled && settings.trainingRecovery.lowCompletionRewardThreshold < 0) {
    errors.push("Training Academy low-completion reward threshold cannot be negative.");
  }

  if (settings.trainingRecovery.enabled && settings.trainingRecovery.highAttemptRatioThreshold < 1) {
    errors.push("Training Academy high-attempt ratio threshold must be at least 1.");
  }

  if (settings.trainingRecovery.enabled && !settings.trainingRecovery.rewardsAreDeterministic) {
    errors.push("Training Academy recovery rewards must remain deterministic.");
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

  if (settings.backgroundMedia.allowed && settings.backgroundMedia.pausesForLearningAudio) {
    warnings.push("Background media audio-priority behavior must be implemented consistently in every enabled game mode.");
  }

  if (settings.trainingRecovery.enabled && settings.trainingRecovery.teacherCanAdjust && !settings.trainingRecovery.settingsPersisted) {
    warnings.push("Training Academy trigger thresholds are demo-local and must become persisted launch-session settings before teacher adjustment.");
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

export function createTeacherReportExportPlan(args: {
  settings: TeacherSessionSettings;
  allowedFormats: TeacherReportExportFormat[];
  includedScopes: TeacherReportExportScope[];
  policyAccepted?: boolean;
  persistenceReady?: boolean;
  note: string;
}): TeacherReportExportPlan {
  const policyAccepted = args.policyAccepted ?? false;
  const persistenceReady = args.persistenceReady ?? args.settings.reporting.retentionPolicy !== "demo-only";

  let readiness: TeacherReportExportReadiness = "ready";

  if (!args.settings.reporting.exportAllowed || !policyAccepted) {
    readiness = "blocked-policy";
  } else if (!persistenceReady) {
    readiness = "blocked-persistence";
  } else if (args.settings.reporting.retentionPolicy === "demo-only") {
    readiness = "demo-preview";
  }

  return {
    launchCode: args.settings.launchCode,
    tenantId: args.settings.tenantId,
    readiness,
    allowedFormats: args.allowedFormats,
    includedScopes: args.includedScopes,
    requiresTeacherRole: true,
    requiresAcceptedPolicy: true,
    policyAccepted,
    persistenceReady,
    retentionPolicy: args.settings.reporting.retentionPolicy,
    excludesRawAudio: !args.settings.reporting.storesRawAudio,
    excludesTranscripts: !args.settings.reporting.storesTranscript,
    note: args.note,
  };
}

export function validateTeacherReportExportPlan(plan: TeacherReportExportPlan): string[] {
  const errors: string[] = [];

  if (plan.launchCode.trim().length === 0) {
    errors.push("Teacher report export plan requires a launch code.");
  }

  if (plan.tenantId.trim().length === 0) {
    errors.push("Teacher report export plan requires a tenant id.");
  }

  if (plan.allowedFormats.length === 0) {
    errors.push("Teacher report export plan must list at least one allowed format.");
  }

  if (plan.includedScopes.length === 0) {
    errors.push("Teacher report export plan must list at least one report scope.");
  }

  if (!plan.requiresTeacherRole) {
    errors.push("Teacher report export must require a teacher role.");
  }

  if (!plan.requiresAcceptedPolicy) {
    errors.push("Teacher report export must require accepted school or tenant policy.");
  }

  if (!plan.excludesRawAudio) {
    errors.push("Core teacher report export must exclude raw learner audio.");
  }

  if (!plan.excludesTranscripts) {
    errors.push("Core teacher report export must exclude learner transcripts unless a premium transcript policy is accepted.");
  }

  if (plan.readiness === "ready" && (!plan.policyAccepted || !plan.persistenceReady)) {
    errors.push("Teacher report export cannot be ready without accepted policy and persistence.");
  }

  return errors;
}

export function getTeacherReportExportWarnings(plan: TeacherReportExportPlan): string[] {
  const warnings: string[] = [];

  if (!plan.policyAccepted) {
    warnings.push("Report export is blocked until school or tenant policy is accepted.");
  }

  if (!plan.persistenceReady) {
    warnings.push("Report export is blocked until launch sessions and progress events are persisted.");
  }

  if (plan.retentionPolicy === "demo-only") {
    warnings.push("Demo-only retention is not sufficient for real teacher report export.");
  }

  if (plan.readiness !== "ready") {
    warnings.push(`Report export readiness is ${plan.readiness}.`);
  }

  return warnings;
}
