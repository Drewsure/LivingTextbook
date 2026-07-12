import type {
  AssistLanguageVisibility,
  LaunchSession,
  TeacherSessionSettings,
} from "@living-textbook/content-model";

export function createSampleTeacherSessionSettings(args: {
  launchSession: LaunchSession;
  assistLanguageEnabled?: boolean;
  assistLanguageVisibility?: AssistLanguageVisibility;
  teacherEnablementPersisted?: boolean;
  updatedAt?: string;
}): TeacherSessionSettings {
  const assistLanguageEnabled = args.assistLanguageEnabled ?? false;

  return {
    launchCode: args.launchSession.launchCode,
    tenantId: args.launchSession.tenantId,
    audioRequired: true,
    assistLanguage: {
      enabled: assistLanguageEnabled,
      requiresTeacherEnablement: true,
      teacherEnablementPersisted: args.teacherEnablementPersisted ?? false,
      unlockAllowed: false,
      masteryCreditAllowed: false,
      visibility: assistLanguageEnabled ? args.assistLanguageVisibility ?? "student-toggle" : "teacher-only",
    },
    microphonePractice: {
      enabled: true,
      requiresTeacherApproval: true,
      approvalPersisted: false,
      storesRawAudio: false,
    },
    backgroundMedia: {
      allowed: true,
      defaultEnabled: false,
      requiresTeacherEnablement: true,
      pausesForLearningAudio: true,
      unlockAllowed: false,
      masteryCreditAllowed: false,
    },
    trainingRecovery: {
      enabled: true,
      repeatedMissThreshold: 2,
      lowCompletionRewardThreshold: 120,
      highAttemptRatioThreshold: 2.25,
      teacherCanAdjust: true,
      settingsPersisted: false,
      rewardsAreDeterministic: true,
    },
    aiTutor: {
      enabled: false,
      packageTier: "premium",
      speechScoringEnabled: false,
      storesTranscript: false,
    },
    reporting: {
      reportProgressToTeacher: true,
      retentionPolicy: "demo-only",
      exportAllowed: false,
      storesRawAudio: false,
      storesTranscript: false,
    },
    updatedAt: args.updatedAt ?? "2026-07-01T00:00:00.000Z",
  };
}
