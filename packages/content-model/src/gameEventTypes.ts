export const GAME_EVENT_TYPES = [
  "teacher_launch_created",
  "launch_opened",
  "audio_requested",
  "microphone_practice",
  "game_started",
  "round_shown",
  "answer_submitted",
  "answer_result",
  "powerup_used",
  "entry_practice_completed",
  "game_unlocked",
  "training_recommended",
  "media_started",
  "media_playlist_opened",
  "media_paused",
  "media_completed",
  "background_media_enabled",
  "background_media_disabled",
  "route_guidance_listened",
  "game_completed",
  "mastery_updated",
] as const;

export type GameEventType = (typeof GAME_EVENT_TYPES)[number];

export function isGameEventType(value: unknown): value is GameEventType {
  return typeof value === "string" && (GAME_EVENT_TYPES as readonly string[]).includes(value);
}
