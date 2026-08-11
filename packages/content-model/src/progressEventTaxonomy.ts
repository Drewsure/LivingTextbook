import type { GameEventType } from "./index";

export type ProgressEventEffect = "progress-affecting" | "report-only" | "support-only";

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

export const PROGRESS_EVENT_REQUIRED_FIELDS = [
  "event_id",
  "event_type",
  "event_effect",
  "taxonomy_version",
  "event_acceptance_gate_id",
  "metadata",
  "occurred_at",
] as const;

const allowedEffects = new Set<ProgressEventEffect>(["progress-affecting", "report-only", "support-only"]);
const supportOnlyEvents = new Set(["route_guidance_listened", "background_media_enabled", "background_media_disabled"]);
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

function blocksProgressAndRewards(notAllowed: string[]): boolean {
  const joined = notAllowed.join(" ").toLowerCase();
  return joined.includes("progress") || joined.includes("mastery") || joined.includes("star dust") || joined.includes("scoring");
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
