export interface GameModeSettingsBackendContractRecord {
  recordId: string;
  label: string;
  schemaEntity: string;
  migrationCandidate: string;
  migrationSpec: string;
  persistenceCategory: string;
  hostedWriteIntent: string;
  localWriteIntent: string;
  purpose: string;
  requiredGuarantees: string[];
  blockedMutations: string[];
}

export interface GameModeSettingsBackendContractPlan {
  planId: string;
  label: string;
  summary: string;
  status: "review-only";
  decisionRule: string;
  records: GameModeSettingsBackendContractRecord[];
  implementationGates: string[];
  blockedActions: string[];
}

const sharedGuarantees = [
  "Learning audio priority preserved",
  "Target-language-only progress preserved",
  "Support-language remains support-only",
  "No scoring profile override",
];

export const sampleGameModeSettingsBackendContractPlan: GameModeSettingsBackendContractPlan = {
  planId: "game-mode-settings-backend-contract-map-v1",
  label: "Game settings backend map",
  summary:
    "Backend contract map for the backend-neutral records needed before timer, difficulty, motion, attempts, background media, skin, or arcade-speed settings can persist.",
  status: "review-only",
  decisionRule:
    "Teacher settings can move from review profile to stored snapshot only when schema, migration, adapter, school policy, accessibility review, release control, and scoring ownership gates all agree.",
  records: [
    {
      recordId: "game-mode-settings-profile-backend-contract",
      label: "Reviewed settings profile",
      schemaEntity: "game_mode_settings_profile",
      migrationCandidate: "m096-game-mode-settings-storage-records",
      migrationSpec: "spec-game-mode-settings-storage",
      persistenceCategory: "game-mode-settings-profile",
      hostedWriteIntent: "hosted-game-mode-settings-profile-write",
      localWriteIntent: "local-game-mode-settings-profile-write",
      purpose: "Stores reviewed tenant/package defaults for one game mode without changing live gameplay.",
      requiredGuarantees: [
        ...sharedGuarantees,
        "Timer, difficulty, motion, attempts, and background media remain reviewed defaults only",
      ],
      blockedMutations: [
        "No live settings persistence",
        "No direct timer write",
        "No direct difficulty write",
        "No student route mutation",
      ],
    },
    {
      recordId: "teacher-game-mode-settings-snapshot-backend-contract",
      label: "Teacher launch snapshot",
      schemaEntity: "teacher_game_mode_settings_snapshot",
      migrationCandidate: "m096-game-mode-settings-storage-records",
      migrationSpec: "spec-game-mode-settings-storage",
      persistenceCategory: "teacher-game-mode-settings-snapshot",
      hostedWriteIntent: "hosted-teacher-game-mode-settings-snapshot-write",
      localWriteIntent: "local-teacher-game-mode-settings-snapshot-write",
      purpose: "Future policy-bound launch-session snapshot of teacher choices, blocked until classroom launch gates pass.",
      requiredGuarantees: [
        ...sharedGuarantees,
        "School policy acceptance required",
        "Accessibility review required",
        "Release-control binding required",
      ],
      blockedMutations: [
        "No live classroom launch",
        "No report export",
        "No raw microphone audio",
        "No support-language-only setting acceptance",
      ],
    },
    {
      recordId: "game-mode-settings-change-request-backend-contract",
      label: "Settings change request",
      schemaEntity: "game_mode_settings_change_request",
      migrationCandidate: "m096-game-mode-settings-storage-records",
      migrationSpec: "spec-game-mode-settings-storage",
      persistenceCategory: "game-mode-settings-change-request",
      hostedWriteIntent: "hosted-game-mode-settings-change-request-write",
      localWriteIntent: "local-game-mode-settings-change-request-write",
      purpose: "Preserves a review trail for requested setting changes without mutating active routes, skins, speeds, scoring, or media behavior.",
      requiredGuarantees: [
        ...sharedGuarantees,
        "Safe defaults cannot mutate",
        "Requested changes stay review-only until accepted",
      ],
      blockedMutations: [
        "No direct safe-default mutation",
        "No arcade speed mutation",
        "No game skin mutation",
        "No background music promotion",
      ],
    },
  ],
  implementationGates: [
    "Backend schema entity exists",
    "Migration candidate exists",
    "Migration spec exists",
    "Hosted write intent exists",
    "Local write intent exists",
    "Shared persistence category exists",
    "verify:backend-storage passes",
  ],
  blockedActions: [
    "No live settings persistence",
    "No save settings button",
    "No timer/difficulty persistence",
    "No arcade speed mutation",
    "No game skin mutation",
    "No background music promotion",
    "No support-language-only progress",
    "No media-only progress",
  ],
};
