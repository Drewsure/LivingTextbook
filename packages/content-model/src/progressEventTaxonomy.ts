import type { GameEventType, GameProgressEvent } from "./index";

export type ProgressEventEffect = "progress-affecting" | "report-only" | "support-only";

export const STANDARD_PROGRESS_EVENT_CONTRACT_ID = "standard-progress-event-envelope-v2026.08.foundation";

export interface ProgressEventTaxonomyItem {
  eventType: GameEventType;
  effect: ProgressEventEffect;
  teacherVisible: boolean;
  persistenceRequired: boolean;
  summary: string;
  notAllowed: string[];
}

export interface ProgressEventTaxonomyRegistry {
  taxonomyVersion: string;
  label: string;
  status: "active-scaffold" | "ready-for-policy-review";
  requiredEventFields: string[];
  storageRule: string;
  changeControl: string;
  events: ProgressEventTaxonomyItem[];
}

export interface ProgressEventEnvelope {
  event_id: string;
  event_type: GameEventType;
  event_effect: ProgressEventEffect;
  taxonomy_version: string;
  event_acceptance_gate_id: string;
  settings_context: ProgressEventSettingsContext;
  unit_key: string;
  game_mode: string;
  occurred_at: string;
  launch_code?: string;
  student_session_id?: string;
  metadata: Record<string, string | number | boolean>;
}

export interface ProgressEventSettingsContext {
  game_mode_settings_profile_id: string;
  teacher_game_mode_settings_snapshot_id: string;
  settings_contract_id: string;
  progress_trigger_policy: "target-language-only";
  support_language_progress_allowed: boolean;
  media_only_progress_allowed: boolean;
  scoring_profile_override_allowed: boolean;
}

export interface CreateProgressEventEnvelopeArgs {
  event: GameProgressEvent;
  registry: ProgressEventTaxonomyRegistry;
  eventId: string;
  eventAcceptanceGateId: string;
  settingsContext: ProgressEventSettingsContext;
}

export const PROGRESS_EVENT_REQUIRED_FIELDS = [
  "event_id",
  "event_type",
  "event_effect",
  "taxonomy_version",
  "event_acceptance_gate_id",
  "settings_context",
  "metadata",
  "occurred_at",
] as const;

export const PROGRESS_EVENT_ENVELOPE_REQUIRED_FIELDS = [...PROGRESS_EVENT_REQUIRED_FIELDS, "unit_key", "game_mode"] as const;

const allowedEffects = new Set<ProgressEventEffect>(["progress-affecting", "report-only", "support-only"]);
const supportOnlyEvents = new Set([
  "audio_requested",
  "route_guidance_listened",
  "background_media_enabled",
  "background_media_disabled",
]);
const reportOnlyEvents = new Set([
  "teacher_launch_created",
  "launch_opened",
  "game_started",
  "round_shown",
  "answer_submitted",
  "training_recommended",
  "media_started",
  "media_playlist_opened",
  "media_paused",
  "media_completed",
  "powerup_used",
]);
const progressAffectingEvents = new Set([
  "entry_practice_completed",
  "game_unlocked",
  "answer_result",
  "game_completed",
  "mastery_updated",
]);

export function validateProgressEventTaxonomyRegistry(registry: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(registry)) {
    return ["Progress event taxonomy registry must be a JSON object."];
  }

  const taxonomyVersion = readString(registry, "taxonomyVersion");
  const label = readString(registry, "label");
  const status = readString(registry, "status");
  const requiredEventFields = readStringArray(registry, "requiredEventFields");
  const storageRule = readString(registry, "storageRule");
  const changeControl = readString(registry, "changeControl");
  const events = readArray(registry, "events");

  if (!taxonomyVersion || !label) {
    errors.push("Progress event taxonomy registry must include taxonomyVersion and label.");
  }

  if (status !== "active-scaffold" && status !== "ready-for-policy-review") {
    errors.push("Progress event taxonomy registry status must stay active-scaffold or ready-for-policy-review.");
  }

  for (const field of PROGRESS_EVENT_REQUIRED_FIELDS) {
    if (!requiredEventFields.includes(field)) {
      errors.push(`Progress event taxonomy registry must include required event field: ${field}.`);
    }
  }

  if (!storageRule.includes("event_effect") || !storageRule.includes("event_acceptance_gate")) {
    errors.push("Progress event taxonomy storageRule must preserve event_effect and event_acceptance_gate references.");
  }

  if (!changeControl.includes("classified") || !changeControl.includes("pilot-ready")) {
    errors.push("Progress event taxonomy changeControl must require classification before pilot-ready status.");
  }

  if (events.length === 0) {
    errors.push("Progress event taxonomy registry must include events.");
  }

  const seenEvents = new Set<string>();

  for (const event of events) {
    if (!isRecord(event)) {
      errors.push("Progress event taxonomy entries must be objects.");
      continue;
    }

    const eventType = readString(event, "eventType");
    const effect = readString(event, "effect");
    const teacherVisible = readBoolean(event, "teacherVisible");
    const persistenceRequired = readBoolean(event, "persistenceRequired");
    const summary = readString(event, "summary");
    const notAllowed = readStringArray(event, "notAllowed");

    if (!eventType) {
      errors.push("Progress event taxonomy entries must include eventType.");
      continue;
    }

    if (seenEvents.has(eventType)) {
      errors.push(`Progress event taxonomy contains duplicate event: ${eventType}.`);
    }

    seenEvents.add(eventType);

    if (!effect || !allowedEffects.has(effect as ProgressEventEffect)) {
      errors.push(`Progress event taxonomy event ${eventType} must use a known event effect.`);
    }

    if (teacherVisible !== true) {
      errors.push(`Progress event taxonomy event ${eventType} must remain teacher-visible.`);
    }

    if (persistenceRequired !== true) {
      errors.push(`Progress event taxonomy event ${eventType} must require persistence before pilot use.`);
    }

    if (!summary) {
      errors.push(`Progress event taxonomy event ${eventType} must include a summary.`);
    }

    if (notAllowed.length === 0) {
      errors.push(`Progress event taxonomy event ${eventType} must include notAllowed boundaries.`);
    }

    if (supportOnlyEvents.has(eventType) && effect !== "support-only") {
      errors.push(`Progress event taxonomy event ${eventType} must remain support-only.`);
    }

    if (reportOnlyEvents.has(eventType) && effect !== "report-only") {
      errors.push(`Progress event taxonomy event ${eventType} must remain report-only.`);
    }

    if (progressAffectingEvents.has(eventType) && effect !== "progress-affecting") {
      errors.push(`Progress event taxonomy event ${eventType} must remain progress-affecting.`);
    }

    if (effect === "support-only" && !blocksProgressAndRewards(notAllowed)) {
      errors.push(
        `Progress event taxonomy support-only event ${eventType} must block progress, mastery, Star Dust, or scoring effects.`,
      );
    }
  }

  return errors;
}

export function getProgressEventTaxonomyRegistryWarnings(registry: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(registry)) {
    return warnings;
  }

  const events = readArray(registry, "events");

  if (events.length < 10) {
    warnings.push("Progress event taxonomy should cover launch, game, media, support, reward, and mastery events.");
  }

  if (!events.some((event) => isRecord(event) && readString(event, "eventType") === "media_playlist_opened")) {
    warnings.push("Progress event taxonomy should include media_playlist_opened as report-only.");
  }

  return warnings;
}

export function createProgressEventEnvelope(args: CreateProgressEventEnvelopeArgs): ProgressEventEnvelope {
  const taxonomyItem = args.registry.events.find((item) => item.eventType === args.event.type);

  return {
    event_id: args.eventId,
    event_type: args.event.type,
    event_effect: taxonomyItem?.effect ?? "report-only",
    taxonomy_version: args.registry.taxonomyVersion,
    event_acceptance_gate_id: args.eventAcceptanceGateId,
    settings_context: args.settingsContext,
    unit_key: args.event.unitKey,
    game_mode: args.event.gameMode,
    occurred_at: args.event.occurredAt,
    launch_code: args.event.launchCode,
    student_session_id: args.event.studentSessionId,
    metadata: args.event.metadata ?? {},
  };
}

export function validateProgressEventEnvelope(
  envelope: unknown,
  registry: ProgressEventTaxonomyRegistry,
): string[] {
  const errors: string[] = [];

  if (!isRecord(envelope)) {
    return ["Progress event envelope must be a JSON object."];
  }

  for (const field of PROGRESS_EVENT_ENVELOPE_REQUIRED_FIELDS) {
    if (!readString(envelope, field)) {
      errors.push(`Progress event envelope must include ${field}.`);
    }
  }

  const eventType = readString(envelope, "event_type");
  const eventEffect = readString(envelope, "event_effect");
  const taxonomyVersion = readString(envelope, "taxonomy_version");
  const occurredAt = readString(envelope, "occurred_at");
  const metadata = envelope.metadata;
  const settingsContext = envelope.settings_context;
  const taxonomyItem = registry.events.find((item) => item.eventType === eventType);

  if (!taxonomyItem) {
    errors.push(`Progress event envelope event_type ${eventType || "(missing)"} is not classified in the taxonomy.`);
  }

  if (taxonomyItem && taxonomyItem.effect !== eventEffect) {
    errors.push(`Progress event envelope ${eventType} must use taxonomy effect ${taxonomyItem.effect}.`);
  }

  if (taxonomyVersion !== registry.taxonomyVersion) {
    errors.push(`Progress event envelope ${eventType || "(missing)"} must use taxonomy_version ${registry.taxonomyVersion}.`);
  }

  if (occurredAt && Number.isNaN(Date.parse(occurredAt))) {
    errors.push(`Progress event envelope ${eventType || "(missing)"} must include an ISO occurred_at timestamp.`);
  }

  if (!isRecord(metadata)) {
    errors.push(`Progress event envelope ${eventType || "(missing)"} metadata must be an object.`);
  }

  if (!isRecord(settingsContext)) {
    errors.push(`Progress event envelope ${eventType || "(missing)"} settings_context must be an object.`);
  } else {
    const settingsProfileId = readString(settingsContext, "game_mode_settings_profile_id");
    const settingsSnapshotId = readString(settingsContext, "teacher_game_mode_settings_snapshot_id");
    const settingsContractId = readString(settingsContext, "settings_contract_id");
    const progressTriggerPolicy = readString(settingsContext, "progress_trigger_policy");

    if (!settingsProfileId || !settingsSnapshotId || !settingsContractId) {
      errors.push(
        `Progress event envelope ${eventType || "(missing)"} settings_context must include game_mode_settings_profile_id, teacher_game_mode_settings_snapshot_id, and settings_contract_id.`,
      );
    }

    if (progressTriggerPolicy !== "target-language-only") {
      errors.push(`Progress event envelope ${eventType || "(missing)"} settings_context must preserve target-language-only progress.`);
    }

    if (readBoolean(settingsContext, "support_language_progress_allowed") !== false) {
      errors.push(`Progress event envelope ${eventType || "(missing)"} settings_context must block support-language progress.`);
    }

    if (readBoolean(settingsContext, "media_only_progress_allowed") !== false) {
      errors.push(`Progress event envelope ${eventType || "(missing)"} settings_context must block media-only progress.`);
    }

    if (readBoolean(settingsContext, "scoring_profile_override_allowed") !== false) {
      errors.push(`Progress event envelope ${eventType || "(missing)"} settings_context must block scoring profile overrides.`);
    }
  }

  if (eventEffect === "support-only" && isRecord(metadata)) {
    if (readBoolean(metadata, "progressionUnlockAllowed") === true || readBoolean(metadata, "supportLanguageUnlockAllowed") === true) {
      errors.push(`Progress event envelope ${eventType} support-only metadata must not allow progress unlocks.`);
    }

    if (readBoolean(metadata, "masteryCreditAllowed") === true) {
      errors.push(`Progress event envelope ${eventType} support-only metadata must not allow mastery credit.`);
    }

    if (readNumber(metadata, "earnedStarDust") > 0 || readNumber(metadata, "starDustAwarded") > 0) {
      errors.push(`Progress event envelope ${eventType} support-only metadata must not award Star Dust.`);
    }
  }

  return errors;
}

export function validateProgressEventEnvelopeStream(
  envelopes: unknown[],
  registry: ProgressEventTaxonomyRegistry,
): string[] {
  const errors = envelopes.flatMap((envelope) => validateProgressEventEnvelope(envelope, registry));
  const eventIds = envelopes
    .filter(isRecord)
    .map((envelope) => readString(envelope, "event_id"))
    .filter(Boolean);
  const duplicateIds = eventIds.filter((eventId, index) => eventIds.indexOf(eventId) !== index);

  if (duplicateIds.length > 0) {
    errors.push(`Progress event envelope stream contains duplicate event_id value(s): ${[...new Set(duplicateIds)].join(", ")}.`);
  }

  return errors;
}

export function getProgressEventEnvelopeStreamWarnings(
  envelopes: unknown[],
  registry: ProgressEventTaxonomyRegistry,
): string[] {
  const warnings: string[] = [];
  const records = envelopes.filter(isRecord);
  const effects = records.map((envelope) => readString(envelope, "event_effect"));
  const eventTypes = records.map((envelope) => readString(envelope, "event_type"));

  if (records.length === 0) {
    warnings.push("Progress event envelope stream should include at least one event before report preview.");
  }

  if (!eventTypes.includes("launch_opened")) {
    warnings.push("Progress event envelope stream should include launch_opened for session context.");
  }

  if (!effects.includes("progress-affecting")) {
    warnings.push("Progress event envelope stream should include reviewed progress-affecting learning evidence.");
  }

  if (!effects.includes("support-only")) {
    warnings.push("Progress event envelope stream should include support-only signals when media, assist language, route guidance, or background media is present.");
  }

  if (!records.every((envelope) => isRecord(envelope.settings_context))) {
    warnings.push("Progress event envelope stream should preserve settings_context for report-only settings visibility.");
  }

  if (!effects.every((effect) => allowedEffects.has(effect as ProgressEventEffect))) {
    warnings.push("Progress event envelope stream contains an unrecognized event effect.");
  }

  if (registry.status !== "active-scaffold" && registry.status !== "ready-for-policy-review") {
    warnings.push("Progress event envelope stream is using a taxonomy registry with an unexpected status.");
  }

  return warnings;
}

function blocksProgressAndRewards(notAllowed: string[]): boolean {
  const joined = notAllowed.join(" ").toLowerCase();
  return joined.includes("progress") || joined.includes("mastery") || joined.includes("star dust") || joined.includes("scoring");
}

function readNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key];
  return typeof value === "number" ? value : 0;
}

function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  return Array.isArray(value) ? value : [];
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(source: Record<string, unknown>, key: string): boolean | undefined {
  const value = source[key];
  return typeof value === "boolean" ? value : undefined;
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
