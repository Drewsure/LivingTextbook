export type GameModeSettingsStorageStatus = "review-only" | "blocked";

export interface GameModeSettingsStorageRecord {
  recordId: string;
  recordType: string;
  label: string;
  status: GameModeSettingsStorageStatus;
  purpose: string;
  backendEntityId: string;
  durableRecordId: string;
  primaryKey: string;
  hostedWriteIntent: string;
  localWriteIntent: string;
  requiredFields: string[];
  sourceProfiles: string[];
  blockedWrites: string[];
  acceptanceRules: string[];
}

export interface GameModeSettingsStorageReadinessPlan {
  planId: string;
  label: string;
  summary: string;
  decisionRule: string;
  records: GameModeSettingsStorageRecord[];
  adapterRules: string[];
  globalBlockedActions: string[];
}

const storageBlocked = "Storage write blocked until school policy, persistence adapter, accessibility, and release-control gates pass.";
const targetOnly = "Stored settings cannot make support-language, media-only, timer-only, or hint-only activity a progress trigger.";
const audioPriority = "Learning audio priority preserved in storage before background music, media, sound effects, or celebrations.";
const scoringLocked = "No scoring profile override from timer, difficulty, motion, background media, or attempts settings.";

export const sampleGameModeSettingsStorageReadinessPlan: GameModeSettingsStorageReadinessPlan = {
  planId: "game-mode-settings-storage-readiness-v1",
  label: "Game mode settings storage readiness",
  summary:
    "Backend-neutral record plan for future teacher-controlled timer, difficulty, motion, attempts, background media, and audio-priority settings. It is a review packet only and does not save choices.",
  decisionRule:
    "Persist settings only as reviewed, tenant-scoped records bound to package release, launch session, assignment, scoring profile, audio policy, and release-control evidence.",
  records: [
    {
      recordId: "game-mode-settings-profile-record",
      recordType: "game_mode_settings_profile",
      label: "Reviewed game mode settings profile",
      status: "review-only",
      purpose: "Stores tenant/package-reviewed defaults for one game mode without changing live gameplay.",
      backendEntityId: "game_mode_settings_profile",
      durableRecordId: "game-mode-settings-profile",
      primaryKey: "tenant_id + package_id + profile_id + game_mode",
      hostedWriteIntent: "hosted-game-mode-settings-profile-write",
      localWriteIntent: "local-game-mode-settings-profile-write",
      requiredFields: [
        "tenant_id",
        "package_id",
        "profile_id",
        "game_mode",
        "engine_id",
        "timer_policy",
        "difficulty_policy",
        "motion_intensity",
        "attempts_policy",
        "background_media_policy",
        "learning_audio_priority",
        "target_language_progress_trigger",
        "assist_language_policy",
        "scoring_profile_id",
        "release_gate_ids",
      ],
      sourceProfiles: ["settings-flashcards", "settings-memory-match", "settings-balloon-pop", "settings-sentence-builder", "settings-speak-it"],
      blockedWrites: [
        storageBlocked,
        "No persisted timer choice from this profile.",
        "No persisted difficulty choice from this profile.",
        "No direct game skin write from this profile.",
        "No student-facing route mutation from this profile.",
        "No progress event mutation from this profile.",
      ],
      acceptanceRules: [targetOnly, audioPriority, scoringLocked],
    },
    {
      recordId: "teacher-game-mode-settings-snapshot-record",
      recordType: "teacher_game_mode_settings_snapshot",
      label: "Teacher launch-session settings snapshot",
      status: "blocked",
      purpose: "Future launch-session snapshot of teacher-approved mode settings after school policy and persistence are accepted.",
      backendEntityId: "teacher_game_mode_settings_snapshot",
      durableRecordId: "teacher-game-mode-settings-snapshot",
      primaryKey: "tenant_id + launch_code + assignment_id + settings_revision_id",
      hostedWriteIntent: "hosted-teacher-game-mode-settings-snapshot-write",
      localWriteIntent: "local-teacher-game-mode-settings-snapshot-write",
      requiredFields: [
        "tenant_id",
        "launch_code",
        "assignment_id",
        "teacher_id",
        "settings_revision_id",
        "active_profile_ids",
        "teacher_review_packet_id",
        "school_policy_acceptance_id",
        "accessibility_review_id",
        "release_control_binding_id",
        "learning_audio_priority_acknowledged",
        "support_language_progress_allowed",
        "settings_persisted",
      ],
      sourceProfiles: ["game-mode-settings-profile-record"],
      blockedWrites: [
        storageBlocked,
        "No live teacher save button.",
        "No launch-session settings persistence.",
        "No classroom launch based on this snapshot.",
        "No report export based on this snapshot.",
        "No support-language-only setting acceptance.",
      ],
      acceptanceRules: [targetOnly, audioPriority, scoringLocked],
    },
    {
      recordId: "game-mode-settings-change-request-record",
      recordType: "game_mode_settings_change_request",
      label: "Settings change request",
      status: "blocked",
      purpose: "Future review record for tenant or teacher requests to alter safe defaults before release.",
      backendEntityId: "game_mode_settings_change_request",
      durableRecordId: "game-mode-settings-change-request",
      primaryKey: "tenant_id + package_id + change_request_id",
      hostedWriteIntent: "hosted-game-mode-settings-change-request-write",
      localWriteIntent: "local-game-mode-settings-change-request-write",
      requiredFields: [
        "tenant_id",
        "package_id",
        "change_request_id",
        "requested_by",
        "requested_game_mode",
        "requested_setting_delta",
        "reason",
        "student_age_band",
        "accessibility_review_required",
        "audio_policy_review_required",
        "scoring_policy_review_required",
        "release_control_required",
        "approval_status",
      ],
      sourceProfiles: ["game-mode-settings-profile-record"],
      blockedWrites: [
        storageBlocked,
        "No direct safe-default mutation.",
        "No direct arcade speed increase.",
        "No direct motion-heavy setting.",
        "No direct background music promotion.",
        "No support-language progress exception.",
      ],
      acceptanceRules: [targetOnly, audioPriority, scoringLocked],
    },
  ],
  adapterRules: [
    "Hosted and local adapters must preserve the same record vocabulary.",
    "Settings storage must be tenant-scoped and package-release scoped.",
    "Settings snapshots must bind to launch session, assignment, teacher review packet, school policy, accessibility review, and release control.",
    "Stored settings must never contain raw learner audio, speech transcripts, real learner names, or unreviewed uploaded media.",
  ],
  globalBlockedActions: [
    storageBlocked,
    "No persisted timer choice.",
    "No persisted difficulty choice.",
    "No persisted motion-heavy skin.",
    "No background-media-only progress.",
    "No support-language-only progress.",
    "No scoring profile override.",
    "No student route mutation.",
  ],
};
