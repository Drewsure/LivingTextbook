import type { GameEventType } from "@living-textbook/content-model";

export type ProgressEventEffect = "progress-affecting" | "report-only" | "support-only";

export interface ProgressEventTaxonomyItem {
  eventType: GameEventType;
  effect: ProgressEventEffect;
  teacherVisible: boolean;
  persistenceRequired: boolean;
  summary: string;
  notAllowed: string[];
}

export const sampleProgressEventTaxonomy: ProgressEventTaxonomyItem[] = [
  {
    eventType: "launch_opened",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records that a coded learner opened a reviewed launch session or front door.",
    notAllowed: ["Do not treat as practice completion.", "Do not award mastery."],
  },
  {
    eventType: "entry_practice_completed",
    effect: "progress-affecting",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Completes the flashcard entry gate after required target-language listening has been satisfied.",
    notAllowed: ["Do not allow support-language-only completion.", "Do not skip target-language item engagement."],
  },
  {
    eventType: "game_unlocked",
    effect: "progress-affecting",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Unlocks reviewed next activities after the entry gate is complete.",
    notAllowed: ["Do not unlock from route guidance, support language, or media playback alone."],
  },
  {
    eventType: "route_guidance_listened",
    effect: "support-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Shows that a student listened to the next-activity route guidance.",
    notAllowed: ["Do not unlock progress.", "Do not award Star Dust.", "Do not count as mastery."],
  },
  {
    eventType: "game_started",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records that a reviewed game mode began.",
    notAllowed: ["Do not count as completion.", "Do not award mastery without result events."],
  },
  {
    eventType: "round_shown",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records that a prompt, card, or round became visible.",
    notAllowed: ["Do not score by visibility alone."],
  },
  {
    eventType: "answer_submitted",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records an attempt before correctness is evaluated.",
    notAllowed: ["Do not award correctness until an answer result exists."],
  },
  {
    eventType: "answer_result",
    effect: "progress-affecting",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records correctness and item-level performance for mastery calculations.",
    notAllowed: ["Do not hide repeated misses from recovery triggers."],
  },
  {
    eventType: "mastery_updated",
    effect: "progress-affecting",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records deterministic mastery movement after reviewed game evidence.",
    notAllowed: ["Do not update mastery from support-only events."],
  },
  {
    eventType: "training_recommended",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records that the Training Academy recovery lane was recommended.",
    notAllowed: ["Do not shame the learner.", "Do not block normal teacher review."],
  },
  {
    eventType: "game_completed",
    effect: "progress-affecting",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Completes a reviewed game mode and applies deterministic Star Dust.",
    notAllowed: ["Do not award random rewards.", "Do not complete unassigned one-off games."],
  },
  {
    eventType: "media_started",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records audio or video playback engagement.",
    notAllowed: ["Do not use media playback alone as game mastery."],
  },
  {
    eventType: "media_paused",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records an interrupted media session.",
    notAllowed: ["Do not penalize students for pauses."],
  },
  {
    eventType: "media_completed",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records completed media playback.",
    notAllowed: ["Do not replace required language practice."],
  },
  {
    eventType: "background_media_enabled",
    effect: "support-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records optional teacher-controlled game background media.",
    notAllowed: ["Do not autoplay as the only instruction.", "Do not count as mastery."],
  },
  {
    eventType: "background_media_disabled",
    effect: "support-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Records that optional background media was switched off.",
    notAllowed: ["Do not affect scoring."],
  },
  {
    eventType: "powerup_used",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Reserved for earned power-up usage after reward systems are persisted.",
    notAllowed: ["Do not create purchase pressure.", "Do not bypass mastery gates."],
  },
  {
    eventType: "teacher_launch_created",
    effect: "report-only",
    teacherVisible: true,
    persistenceRequired: true,
    summary: "Reserved for persisted teacher-created launches.",
    notAllowed: ["Do not imply production persistence in the current scaffold."],
  },
];

