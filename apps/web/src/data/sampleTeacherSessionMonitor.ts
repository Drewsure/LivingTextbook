import type {
  ContentPackage,
  GameProgressEvent,
  GameModeId,
  LaunchSession,
  StudentProgressionState,
  TeacherReportExportPlan,
  TeacherSessionControlAction,
  TeacherSessionSetting,
  TeacherSessionSettings,
  UnitPayload,
} from "@living-textbook/content-model";
import {
  createTeacherReportExportPlan,
  getTeacherReportExportWarnings,
  getTeacherSessionControlWarnings,
  getTeacherSessionPersistenceWarnings,
  validateTeacherReportExportPlan,
  validateTeacherSessionControlActions,
  validateTeacherSessionSettings,
} from "@living-textbook/content-model";
import { resolveSampleLaunchContext } from "./sampleLaunchResolver";
import type { TenantConfig } from "@/features/tenant/types";

type ProgressGameMode = StudentProgressionState["unlockedGameModes"][number];

export interface TeacherSessionMonitorMetric {
  label: string;
  value: string;
  note: string;
}

export type TeacherSessionPreflightStatus = "pass" | "warning" | "blocked";

export interface TeacherSessionPreflightCheck {
  checkId: string;
  label: string;
  status: TeacherSessionPreflightStatus;
  owner: "teacher" | "platform" | "policy" | "persistence";
  note: string;
}

export type TeacherSessionEventAcceptanceStatus = "demo-only" | "blocked" | "ready";
export type TeacherSessionEventAcceptanceItemStatus = "pass" | "warning" | "blocked";

export interface TeacherSessionEventAcceptanceItem {
  itemId: string;
  label: string;
  status: TeacherSessionEventAcceptanceItemStatus;
  owner: "teacher" | "platform" | "policy" | "persistence";
  evidence: string;
  nextStep: string;
}

export interface TeacherSessionEventAcceptanceGate {
  gateId: string;
  label: string;
  status: TeacherSessionEventAcceptanceStatus;
  decision: string;
  summary: string;
  items: TeacherSessionEventAcceptanceItem[];
}

export type TeacherSessionPilotReadinessStatus = "demo-safe" | "pilot-blocked" | "pilot-ready";

export interface TeacherSessionPilotReadinessSnapshot {
  snapshotId: string;
  label: string;
  status: TeacherSessionPilotReadinessStatus;
  decision: string;
  summary: string;
  demoSafeSignals: string[];
  pilotBlockers: string[];
  requiredBeforeLiveUse: string[];
}

export type TeacherReportPackageBoundaryStatus = "demo-preview" | "export-blocked" | "export-ready";

export interface TeacherReportPackageBoundaryMetric {
  label: string;
  value: string;
  note: string;
}

export interface TeacherReportPackageBoundary {
  boundaryId: string;
  label: string;
  status: TeacherReportPackageBoundaryStatus;
  decision: string;
  summary: string;
  metrics: TeacherReportPackageBoundaryMetric[];
  includedEvidence: string[];
  supportOnlySignals: string[];
  excludedSensitiveFields: string[];
  requiredBeforeExport: string[];
}

export interface TeacherSessionMonitorContext {
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  unit?: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  metrics: TeacherSessionMonitorMetric[];
  assignedGameModes: GameModeId[];
  audioCoveredGameModes: GameModeId[];
  assignedGameAudioGaps: GameModeId[];
  sessionSettings: TeacherSessionSettings;
  settings: TeacherSessionSetting[];
  sessionSettingErrors: string[];
  sessionSettingWarnings: string[];
  sessionControlActions: TeacherSessionControlAction[];
  sessionControlErrors: string[];
  sessionControlWarnings: string[];
  reportExportPlan: TeacherReportExportPlan;
  reportExportErrors: string[];
  reportExportWarnings: string[];
  reportPackageBoundary: TeacherReportPackageBoundary;
  preflightChecks: TeacherSessionPreflightCheck[];
  eventAcceptanceGate: TeacherSessionEventAcceptanceGate;
  pilotReadinessSnapshot: TeacherSessionPilotReadinessSnapshot;
  readinessNotes: string[];
}

export function resolveSampleTeacherSessionMonitorContext(launchCode: string): TeacherSessionMonitorContext {
  const launchContext = resolveSampleLaunchContext(launchCode);
  const isPartner = launchContext.tenant.id === "sample-publisher";
  const events = createSampleMonitorEvents(launchContext.launchSession, isPartner);
  const latestEvent = events[events.length - 1];
  const progression = createMonitorProgression(launchContext.progression, launchContext.launchSession, latestEvent);
  const sessionSettings = createMonitorSessionSettings(launchContext.launchSession, isPartner);
  const sessionSettingErrors = validateTeacherSessionSettings(sessionSettings);
  const sessionSettingWarnings = getTeacherSessionPersistenceWarnings(sessionSettings);
  const sessionControlActions = createTeacherSessionControlActions();
  const sessionControlErrors = validateTeacherSessionControlActions(sessionControlActions);
  const sessionControlWarnings = getTeacherSessionControlWarnings(sessionControlActions);
  const reportExportPlan = createMonitorReportExportPlan(sessionSettings);
  const reportExportErrors = validateTeacherReportExportPlan(reportExportPlan);
  const reportExportWarnings = getTeacherReportExportWarnings(reportExportPlan);
  const reportPackageBoundary = createTeacherReportPackageBoundary({
    events,
    reportExportErrors,
    reportExportPlan,
    reportExportWarnings,
  });
  const assignedGameModes = uniqueModes([launchContext.launchSession.entryMode, ...launchContext.launchSession.recommendedNextModes]);
  const audioCoveredGameModes = getAudioCoveredGameModes(launchContext.contentPackage);
  const assignedGameAudioGaps = assignedGameModes.filter((mode) => !audioCoveredGameModes.includes(mode));
  const preflightChecks = createTeacherSessionPreflightChecks({
    sessionSettingErrors,
    sessionSettingWarnings,
    sessionControlErrors,
    sessionControlWarnings,
    reportExportErrors,
    reportExportWarnings,
    assignedGameModes,
    audioCoveredGameModes,
  });
  const pilotReadinessSnapshot = createPilotReadinessSnapshot({
    launchCode: launchContext.launchSession.launchCode,
    assignedGameAudioGaps,
    sessionSettingErrors,
    sessionSettingWarnings,
    sessionControlErrors,
    sessionControlWarnings,
    reportExportErrors,
    reportExportWarnings,
  });
  const eventAcceptanceGate = createTeacherSessionEventAcceptanceGate({
    launchCode: launchContext.launchSession.launchCode,
    assignedGameAudioGaps,
    sessionSettingErrors,
    sessionSettingWarnings,
    reportExportErrors,
    reportExportWarnings,
  });

  return {
    tenant: launchContext.tenant,
    contentPackage: launchContext.contentPackage,
    unit: launchContext.unit,
    launchSession: launchContext.launchSession,
    progression,
    events,
    metrics: createMonitorMetrics({
      isPartner,
      launchSession: launchContext.launchSession,
      eventCount: events.length,
      rewardName: launchContext.tenant.rewardName,
    }),
    assignedGameModes,
    audioCoveredGameModes,
    assignedGameAudioGaps,
    sessionSettings,
    settings: createMonitorSettings(sessionSettings),
    sessionSettingErrors,
    sessionSettingWarnings,
    sessionControlActions,
    sessionControlErrors,
    sessionControlWarnings,
    reportExportPlan,
    reportExportErrors,
    reportExportWarnings,
    reportPackageBoundary,
    preflightChecks,
    eventAcceptanceGate,
    pilotReadinessSnapshot,
    readinessNotes: [
      "This route uses reviewed sample data and local event examples only.",
      "A real classroom monitor needs persisted launch sessions, event storage, student/session policy, and export controls.",
      "Support-language taps may appear in reports, but only target-language engagement can unlock progression.",
      "Premium AI Tutor, speech scoring, transcript storage, and cloud audio upload remain optional tenant add-ons.",
    ],
  };
}

function createTeacherSessionEventAcceptanceGate(args: {
  launchCode: string;
  assignedGameAudioGaps: GameModeId[];
  sessionSettingErrors: string[];
  sessionSettingWarnings: string[];
  reportExportErrors: string[];
  reportExportWarnings: string[];
}): TeacherSessionEventAcceptanceGate {
  const items: TeacherSessionEventAcceptanceItem[] = [
    {
      itemId: "reviewed-package-audio",
      label: "Reviewed package and game audio",
      status: args.assignedGameAudioGaps.length === 0 ? "pass" : "blocked",
      owner: "platform",
      evidence:
        args.assignedGameAudioGaps.length === 0
          ? "Every assigned game mode has reviewed learner-audio coverage."
          : `Missing audio coverage for: ${args.assignedGameAudioGaps.join(", ")}.`,
      nextStep: "Keep assigned game modes tied to reviewed audio coverage before accepting live events.",
    },
    {
      itemId: "settings-persistence",
      label: "Launch-session settings persistence",
      status: args.sessionSettingErrors.length === 0 && args.sessionSettingWarnings.length === 0 ? "pass" : "blocked",
      owner: "persistence",
      evidence:
        args.sessionSettingWarnings.length > 0 || args.sessionSettingErrors.length > 0
          ? "Settings are visible as a snapshot, but persistence warnings remain."
          : "Settings snapshot is valid and has no open persistence warning.",
      nextStep: "Persist settings snapshot, validation state, and settings revision before live event writes.",
    },
    {
      itemId: "event-taxonomy",
      label: "Event effect taxonomy",
      status: "pass",
      owner: "platform",
      evidence: "Events distinguish progress-affecting, report-only, and support-only signals.",
      nextStep: "Preserve event_effect in every hosted and local event write.",
    },
    {
      itemId: "report-policy",
      label: "Reporting and retention policy",
      status: args.reportExportErrors.length === 0 && args.reportExportWarnings.length === 0 ? "pass" : "blocked",
      owner: "policy",
      evidence:
        args.reportExportErrors.length > 0 || args.reportExportWarnings.length > 0
          ? "Report export is blocked by policy or persistence warnings."
          : "Report export plan has no open blocker.",
      nextStep: "Accept school or tenant reporting, retention, access, and export policy before live student storage.",
    },
    {
      itemId: "student-identity",
      label: "Coded student identity",
      status: "warning",
      owner: "policy",
      evidence: "Demo routes use coded learners, not real roster identities.",
      nextStep: "Choose roster identity, retention, parent/school visibility, and deletion rules before pilot.",
    },
    {
      itemId: "sensitive-data-exclusion",
      label: "Sensitive data exclusion",
      status: "pass",
      owner: "platform",
      evidence: "Core reports and settings reject raw learner audio, transcripts, and ungated AI Tutor state.",
      nextStep: "Keep premium speech or AI Tutor data outside the core event stream unless a paid policy accepts it.",
    },
  ];
  const blockedCount = items.filter((item) => item.status === "blocked").length;
  const warningCount = items.filter((item) => item.status === "warning").length;
  const status: TeacherSessionEventAcceptanceStatus = blockedCount > 0 ? "blocked" : warningCount > 0 ? "demo-only" : "ready";

  return {
    gateId: `event-acceptance:${args.launchCode}`,
    label: "Event acceptance gate",
    status,
    decision:
      status === "ready"
        ? "This session can accept live student events under the accepted policy."
        : "This session can display demo events, but live student event storage remains blocked.",
    summary:
      "Live event storage requires reviewed game/audio coverage, persisted session settings, event taxonomy preservation, reporting policy, coded student identity rules, and sensitive-data exclusions.",
    items,
  };
}

function createTeacherReportPackageBoundary(args: {
  events: GameProgressEvent[];
  reportExportErrors: string[];
  reportExportPlan: TeacherReportExportPlan;
  reportExportWarnings: string[];
}): TeacherReportPackageBoundary {
  const learningEvidenceEventTypes: GameProgressEvent["type"][] = [
    "entry_practice_completed",
    "game_started",
    "answer_result",
    "game_completed",
    "mastery_updated",
    "training_recommended",
  ];
  const mediaEventTypes: GameProgressEvent["type"][] = [
    "media_playlist_opened",
    "media_started",
    "media_paused",
    "media_completed",
    "background_media_enabled",
    "background_media_disabled",
  ];
  const supportOnlyEvents = args.events.filter((event) =>
    mediaEventTypes.includes(event.type) ||
    event.type === "route_guidance_listened" ||
    event.metadata?.supportLanguageUnlockAllowed === false ||
    event.metadata?.progressionUnlockAllowed === false ||
    event.metadata?.masteryCreditAllowed === false,
  );
  const learningEvidenceEvents = args.events.filter((event) => learningEvidenceEventTypes.includes(event.type));
  const status: TeacherReportPackageBoundaryStatus =
    args.reportExportPlan.readiness === "ready"
      ? "export-ready"
      : args.reportExportErrors.length > 0 || args.reportExportWarnings.length > 0
        ? "export-blocked"
        : "demo-preview";

  return {
    boundaryId: `teacher-report-package:${args.reportExportPlan.launchCode}`,
    label: "Report package boundary",
    status,
    decision:
      status === "export-ready"
        ? "This teacher report package can be exported under the accepted tenant policy."
        : "This teacher report package can be previewed, but live export stays blocked until policy, persistence, retention, and access rules are accepted.",
    summary:
      "Teacher reports are policy-bound packages. They include learning evidence and support-only summaries, while keeping sensitive audio, transcripts, and premium tutor data out of the core report.",
    metrics: [
      {
        label: "Learning evidence events",
        value: String(learningEvidenceEvents.length),
        note: "Target-language attempts, completions, mastery, and Training Academy recovery signals.",
      },
      {
        label: "Support-only events",
        value: String(supportOnlyEvents.length),
        note: "Media, background audio, support-language, and guidance signals that do not unlock progress.",
      },
      {
        label: "Allowed formats",
        value: String(args.reportExportPlan.allowedFormats.length),
        note: args.reportExportPlan.allowedFormats.join(", "),
      },
      {
        label: "Export blockers",
        value: String(args.reportExportWarnings.length + args.reportExportErrors.length),
        note: "Policy and persistence gates must close before live export.",
      },
    ],
    includedEvidence: [
      "Coded student/session identity, launch code, unit, tenant, and timestamp.",
      "Target-language entry practice completion and target-language listening counts.",
      "Game starts, answer results, game completion, deterministic score, and mastery updates.",
      "Training Academy recovery recommendations and completion summaries.",
      "Media engagement summaries marked support-only.",
      "Speech practice availability and completion summary without raw audio or transcripts.",
    ],
    supportOnlySignals: [
      "Support-language taps may be reported for teacher awareness, but cannot unlock games.",
      "Playlist opens, media playback, and background media may be reported, but cannot award mastery.",
      "Route guidance listen taps may help explain student navigation, but cannot award Star Dust.",
      "Background media must pause, duck, or mute when learning audio plays.",
    ],
    excludedSensitiveFields: [
      args.reportExportPlan.excludesRawAudio ? "Raw learner audio is excluded from core reports." : "Raw learner audio exclusion is missing.",
      args.reportExportPlan.excludesTranscripts ? "Learner transcripts are excluded from core reports." : "Learner transcript exclusion is missing.",
      "Open-ended AI Tutor chat remains outside core reports unless a premium policy is accepted.",
      "Unreviewed teacher notes, free-text student entries, and private identifiers are outside this scaffold.",
    ],
    requiredBeforeExport: [
      "Accepted school or tenant reporting policy.",
      "Persisted launch session and progress-event records with event-effect taxonomy intact.",
      "Teacher role, access control, retention, and export audit rules.",
      "Tenant-specific report format approval for CSV, JSON, or family PDF summaries.",
    ],
  };
}

function createPilotReadinessSnapshot(args: {
  launchCode: string;
  assignedGameAudioGaps: GameModeId[];
  sessionSettingErrors: string[];
  sessionSettingWarnings: string[];
  sessionControlErrors: string[];
  sessionControlWarnings: string[];
  reportExportErrors: string[];
  reportExportWarnings: string[];
}): TeacherSessionPilotReadinessSnapshot {
  const hasHardBlockers =
    args.sessionSettingErrors.length > 0 ||
    args.sessionControlErrors.length > 0 ||
    args.reportExportErrors.length > 0 ||
    args.assignedGameAudioGaps.length > 0;
  const hasOpenPilotWork =
    hasHardBlockers ||
    args.sessionSettingWarnings.length > 0 ||
    args.sessionControlWarnings.length > 0 ||
    args.reportExportWarnings.length > 0;
  const status: TeacherSessionPilotReadinessStatus = hasHardBlockers
    ? "pilot-blocked"
    : hasOpenPilotWork
      ? "demo-safe"
      : "pilot-ready";

  return {
    snapshotId: `session-pilot-readiness:${args.launchCode}`,
    label: "Session pilot readiness",
    status,
    decision:
      status === "pilot-ready"
        ? "This launch session is ready for pilot use under the accepted policy."
        : "This launch session is safe as a demo monitor, but it is not ready for live classroom reporting until persistence and policy gates close.",
    summary:
      "The session uses reviewed sample package data and standard event shapes. Live use still needs durable launch-session settings, accepted reporting policy, and persisted event storage.",
    demoSafeSignals: [
      "Reviewed sample package data is used for this route.",
      "Assigned games report standard progress events.",
      "Assigned games have reviewed learner-audio coverage.",
      "Media events are support-only and cannot unlock progress or mastery.",
      "Core report scaffolds exclude raw learner audio and transcripts.",
    ],
    pilotBlockers: [
      ...args.sessionSettingErrors,
      ...args.sessionControlErrors,
      ...args.reportExportErrors,
      ...args.assignedGameAudioGaps.map((mode) => `Assigned game mode ${mode} still needs learner-audio coverage.`),
      ...args.sessionSettingWarnings,
      ...args.sessionControlWarnings,
      ...args.reportExportWarnings,
    ],
    requiredBeforeLiveUse: [
      "Persist teacher launch-session settings across student devices.",
      "Choose the first backend only after privacy, reporting, deployment, and cost gates are accepted.",
      "Accept retention, access, export, and school/tenant reporting policy.",
      "Persist event storage with event-effect taxonomy intact.",
      "Verify teacher and student routes on classroom mobile devices.",
    ],
  };
}

function createTeacherSessionPreflightChecks(args: {
  sessionSettingErrors: string[];
  sessionSettingWarnings: string[];
  sessionControlErrors: string[];
  sessionControlWarnings: string[];
  reportExportErrors: string[];
  reportExportWarnings: string[];
  assignedGameModes: GameModeId[];
  audioCoveredGameModes: GameModeId[];
}): TeacherSessionPreflightCheck[] {
  const missingAudioModes = args.assignedGameModes.filter((mode) => !args.audioCoveredGameModes.includes(mode));

  return [
    {
      checkId: "settings-safety",
      label: "Settings safety",
      status: args.sessionSettingErrors.length === 0 ? "pass" : "blocked",
      owner: "platform",
      note:
        args.sessionSettingErrors.length === 0
          ? "Session settings pass the shared safety rules: audio remains required, support language cannot unlock progress, and raw audio/transcripts are excluded."
          : args.sessionSettingErrors.join(" "),
    },
    {
      checkId: "settings-persistence",
      label: "Settings persistence",
      status: args.sessionSettingWarnings.length === 0 ? "pass" : "warning",
      owner: "persistence",
      note:
        args.sessionSettingWarnings.length === 0
          ? "Teacher settings are ready to persist."
          : "Teacher choices still need durable launch-session storage before classroom pilot use.",
    },
    {
      checkId: "session-controls",
      label: "Lifecycle controls",
      status: args.sessionControlErrors.length > 0 ? "blocked" : args.sessionControlWarnings.length > 0 ? "warning" : "pass",
      owner: "teacher",
      note:
        args.sessionControlErrors.length > 0
          ? args.sessionControlErrors.join(" ")
          : args.sessionControlWarnings.length > 0
            ? "Open, lock, resume, end, and export commands are mapped but still need persistence or policy gates."
            : "Lifecycle controls are pilot-ready.",
    },
    {
      checkId: "assigned-game-audio",
      label: "Assigned game audio",
      status: missingAudioModes.length === 0 ? "pass" : "warning",
      owner: "platform",
      note:
        missingAudioModes.length === 0
          ? `Assigned game modes are audio-covered: ${args.assignedGameModes.join(", ")}.`
          : `Audio coverage needs review before pilot use for: ${missingAudioModes.join(", ")}.`,
    },
    {
      checkId: "report-export",
      label: "Report export",
      status: args.reportExportErrors.length > 0 ? "blocked" : args.reportExportWarnings.length > 0 ? "warning" : "pass",
      owner: "policy",
      note:
        args.reportExportErrors.length > 0
          ? args.reportExportErrors.join(" ")
          : args.reportExportWarnings.length > 0
            ? "Report export remains blocked until policy, persistence, access, and retention rules are accepted."
            : "Report export is ready under accepted policy.",
    },
  ];
}

function createMonitorProgression(
  progression: StudentProgressionState,
  launchSession: LaunchSession,
  latestEvent?: GameProgressEvent,
): StudentProgressionState {
  return {
    ...progression,
    currentStep: "completion-review",
    unlockedGameModes: uniqueModes([...progression.unlockedGameModes, ...launchSession.recommendedNextModes, "quiz", "sentence-builder", "speak-it"]),
    completedGameModes: uniqueModes([...progression.completedGameModes, launchSession.entryMode, "memory-match", "quiz", "sentence-builder"]),
    earnedStarDust: 1000,
    masteryStatus: "in-progress",
    lastEventAt: latestEvent?.occurredAt,
  };
}

function uniqueModes(modes: ProgressGameMode[]): ProgressGameMode[] {
  return Array.from(new Set(modes));
}

function getAudioCoveredGameModes(contentPackage: ContentPackage): GameModeId[] {
  return Array.from(
    new Set(
      (contentPackage.audioSupportPlans ?? []).flatMap((plan) =>
        Object.keys(plan.gameModeAudioCueIds ?? {}) as GameModeId[],
      ),
    ),
  );
}

function createMonitorMetrics(args: {
  isPartner: boolean;
  launchSession: LaunchSession;
  eventCount: number;
  rewardName: string;
}): TeacherSessionMonitorMetric[] {
  return [
    {
      label: "Launch code",
      value: args.launchSession.launchCode,
      note: "Stable classroom session identifier for the demo route.",
    },
    {
      label: "Students visible",
      value: args.isPartner ? "8" : "12",
      note: "Sample count only; production needs persisted class/session records.",
    },
    {
      label: "Report events",
      value: String(args.eventCount),
      note: "Game, media, recovery, and speech-practice records share one stream.",
    },
    {
      label: args.rewardName,
      value: "1000",
      note: "Sample earned reward total, not a stored production grade.",
    },
  ];
}

function createMonitorSessionSettings(launchSession: LaunchSession, isPartner: boolean): TeacherSessionSettings {
  return {
    launchCode: launchSession.launchCode,
    tenantId: launchSession.tenantId,
    audioRequired: true,
    assistLanguage: {
      enabled: !isPartner,
      requiresTeacherEnablement: true,
      teacherEnablementPersisted: false,
      unlockAllowed: false,
      masteryCreditAllowed: false,
      visibility: isPartner ? "teacher-only" : "student-toggle",
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
    updatedAt: "2026-07-01T00:00:00.000Z",
  };
}

function createMonitorSettings(sessionSettings: TeacherSessionSettings): TeacherSessionSetting[] {
  return [
    {
      settingId: "audio-required",
      label: "Learner text audio",
      status: sessionSettings.audioRequired ? "enabled" : "disabled",
      note: "Vocabulary, target sentences, instructions, and key controls require audio support before student assignment.",
    },
    {
      settingId: "assist-language",
      label: "Assist language",
      status:
        sessionSettings.assistLanguage.requiresTeacherEnablement && !sessionSettings.assistLanguage.teacherEnablementPersisted
          ? "requires-persistence"
          : sessionSettings.assistLanguage.enabled
            ? "enabled"
            : "disabled",
      note: "Assist text can support comprehension, but the teacher's on/off choice must persist with the launch session. It cannot unlock games, award mastery, or replace target-language engagement.",
    },
    {
      settingId: "microphone-practice",
      label: "Microphone practice",
      status: sessionSettings.microphonePractice.approvalPersisted ? "enabled" : "requires-persistence",
      note: "Teacher approval must become a persisted session setting before student devices can rely on it across a classroom.",
    },
    {
      settingId: "background-media",
      label: "Game background media",
      status: sessionSettings.backgroundMedia.requiresTeacherEnablement ? "requires-persistence" : "enabled",
      note: sessionSettings.backgroundMedia.pausesForLearningAudio
        ? "Background audio or video is optional and teacher-controlled. It must pause, duck, or mute for tap-to-speak learning audio and cannot unlock progress or mastery."
        : "Background audio priority needs review before this session can be student-ready.",
    },
    {
      settingId: "training-recovery",
      label: "Training Academy triggers",
      status: sessionSettings.trainingRecovery.settingsPersisted ? "enabled" : "requires-persistence",
      note: `Recovery is deterministic: recommend after ${sessionSettings.trainingRecovery.repeatedMissThreshold} missed checks, low completion at ${sessionSettings.trainingRecovery.lowCompletionRewardThreshold} reward or below, or attempt ratio ${sessionSettings.trainingRecovery.highAttemptRatioThreshold}x or higher.`,
    },
    {
      settingId: "ai-tutor",
      label: "AI Tutor package",
      status: sessionSettings.aiTutor.enabled ? "enabled" : "premium-disabled",
      note: "AI Tutor, speech scoring, transcripts, and model calls remain optional paid features, not core session requirements.",
    },
    {
      settingId: "data-retention",
      label: "Progress retention",
      status: sessionSettings.reporting.retentionPolicy === "demo-only" ? "requires-persistence" : "enabled",
      note: "Real reports need privacy, retention, export, and school access rules before event storage is enabled.",
    },
  ];
}

function createTeacherSessionControlActions(): TeacherSessionControlAction[] {
  return [
    {
      actionId: "open-session",
      label: "Open session",
      status: "requires-persistence",
      requiresTeacherRole: true,
      requiresPolicy: false,
      note: "Opening a real class should create or update a durable launch session before students scan the QR code.",
    },
    {
      actionId: "lock-session",
      label: "Lock new entries",
      status: "requires-persistence",
      requiresTeacherRole: true,
      requiresPolicy: false,
      note: "Teachers need a way to stop late or accidental joins while preserving students already inside the session.",
    },
    {
      actionId: "resume-session",
      label: "Resume entries",
      status: "requires-persistence",
      requiresTeacherRole: true,
      requiresPolicy: false,
      note: "A locked session should be reopenable by the teacher without issuing a new printed or projected code.",
    },
    {
      actionId: "end-session",
      label: "End session",
      status: "requires-persistence",
      requiresTeacherRole: true,
      requiresPolicy: false,
      note: "Ending a session should freeze the teacher report and prevent further student event writes for that launch code.",
    },
    {
      actionId: "export-report",
      label: "Export report",
      status: "requires-policy",
      requiresTeacherRole: true,
      requiresPolicy: true,
      note: "Report export must wait for school policy, student-data retention, and access-control decisions.",
    },
  ];
}

function createMonitorReportExportPlan(sessionSettings: TeacherSessionSettings): TeacherReportExportPlan {
  return createTeacherReportExportPlan({
    settings: sessionSettings,
    allowedFormats: ["csv-summary", "json-event-stream"],
    includedScopes: [
      "teacher-summary",
      "student-progress",
      "event-stream",
      "media-engagement",
      "training-recovery",
      "speech-practice-summary",
    ],
    policyAccepted: false,
    persistenceReady: false,
    note: "Export is intentionally blocked in the scaffold until school policy, access control, retention, and event persistence are accepted.",
  });
}

function createSampleMonitorEvents(launchSession: LaunchSession, isPartner: boolean): GameProgressEvent[] {
  const unitKey = launchSession.unitKey;
  const launchCode = launchSession.launchCode;
  const studentSessionId = `${launchCode}:${isPartner ? "partner-student-02" : "student-04"}`;
  const mediaAssetId = isPartner
    ? "media-sample-publisher-l1-u1-routine-chant"
    : "media-ministar-l1-u1-greetings-chant";

  return [
    {
      type: "launch_opened",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:01:00.000Z",
      metadata: {
        reportable: true,
        supportLanguageUnlockAllowed: false,
      },
    },
    {
      type: "entry_practice_completed",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:05:00.000Z",
      metadata: {
        targetLanguageItemsHeard: 8,
        supportLanguageTaps: isPartner ? 0 : 5,
        supportLanguageUnlockAllowed: false,
      },
    },
    {
      type: "game_unlocked",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:05:20.000Z",
      metadata: {
        unlockedBy: "target-language-entry-practice",
      },
    },
    {
      type: "media_playlist_opened",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:05:50.000Z",
      metadata: {
        playlistId: isPartner ? "playlist-sample-publisher-l1-u1-routines" : "playlist-ministar-l1-u1-greetings",
        routeHref: isPartner
          ? "/media/playlist-sample-publisher-l1-u1-routines"
          : "/media/playlist-ministar-l1-u1-greetings",
        progressionUnlockAllowed: false,
        masteryCreditAllowed: false,
        starDustAwarded: 0,
      },
    },
    {
      type: "media_started",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:06:00.000Z",
      metadata: {
        mediaAssetId,
        playbackContext: "unit-home",
        progressionUnlockAllowed: false,
        masteryCreditAllowed: false,
        starDustAwarded: 0,
      },
    },
    {
      type: "media_paused",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:06:25.000Z",
      metadata: {
        mediaAssetId,
        playbackContext: "unit-home",
        progressSeconds: 24,
        progressionUnlockAllowed: false,
        masteryCreditAllowed: false,
        starDustAwarded: 0,
      },
    },
    {
      type: "media_completed",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:06:55.000Z",
      metadata: {
        mediaAssetId,
        playbackContext: "unit-home",
        progressionUnlockAllowed: false,
        masteryCreditAllowed: false,
        starDustAwarded: 0,
      },
    },
    {
      type: "background_media_enabled",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:06:58.000Z",
      metadata: {
        mediaAssetId,
        playbackContext: "game-background",
        teacherEnabled: true,
        volumePercent: isPartner ? 30 : 35,
        progressionUnlockAllowed: false,
        masteryCreditAllowed: false,
        starDustAwarded: 0,
        pausesForLearningAudio: true,
      },
    },
    {
      type: "game_started",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:07:00.000Z",
      metadata: {
        parentEngine: "pairing",
      },
    },
    {
      type: "answer_result",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:08:00.000Z",
      metadata: {
        correct: true,
        term: isPartner ? "wake up" : "hello",
        targetLanguageAttempt: true,
      },
    },
    {
      type: "training_recommended",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:09:00.000Z",
      metadata: {
        trainingEventType: "training_recommended",
        focusType: "vocabulary-review",
        sourceGameMode: "memory-match",
        recommendedGameMode: "flashcards",
        returnPath: `/launch/${launchCode}`,
        teacherAssigned: false,
        targetTermCount: 4,
      },
    },
    {
      type: "training_recommended",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:10:00.000Z",
      metadata: {
        trainingEventType: "training_completed",
        focusType: "vocabulary-review",
        sourceGameMode: "memory-match",
        returnPath: `/launch/${launchCode}`,
        earnedStarDust: 100,
      },
    },
    {
      type: "game_completed",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:12:00.000Z",
      metadata: {
        earnedStarDust: 325,
        accuracyPercent: 88,
      },
    },
    {
      type: "game_started",
      unitKey,
      gameMode: "sentence-builder",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:12:30.000Z",
      metadata: {
        parentEngine: "text-spelling",
        scoringProfileId: "syntax-construction-v1",
      },
    },
    {
      type: "answer_result",
      unitKey,
      gameMode: "sentence-builder",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:12:50.000Z",
      metadata: {
        correct: true,
        roundId: "sentence-builder-1",
        targetLanguageAttempt: true,
      },
    },
    {
      type: "mastery_updated",
      unitKey,
      gameMode: "sentence-builder",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:13:20.000Z",
      metadata: {
        completed: true,
        earnedStarDust: 300,
        completedRounds: 2,
        parentEngine: "text-spelling",
      },
    },
    {
      type: "game_started",
      unitKey,
      gameMode: "quiz",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:13:30.000Z",
      metadata: {
        parentEngine: "selection",
        scoringProfileId: "selection-assessment-v1",
      },
    },
    {
      type: "answer_result",
      unitKey,
      gameMode: "quiz",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:13:50.000Z",
      metadata: {
        correct: true,
        roundId: "selection-vocabulary-1",
        targetLanguageAttempt: true,
      },
    },
    {
      type: "mastery_updated",
      unitKey,
      gameMode: "quiz",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:14:30.000Z",
      metadata: {
        completed: true,
        earnedStarDust: 275,
        completedRounds: 4,
        correctRounds: 3,
        parentEngine: "selection",
      },
    },
    {
      type: "game_started",
      unitKey,
      gameMode: "speak-it",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:15:00.000Z",
      metadata: {
        microphoneAllowedByTeacher: false,
        recordReplayOnly: true,
        premiumSpeechScoringEnabled: false,
      },
    },
  ];
}
