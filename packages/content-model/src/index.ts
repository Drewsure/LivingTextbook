export type TenantId = string;
export type CurriculumId = string;

export type GameFamily =
  | "core-quiz"
  | "vocabulary-matching"
  | "memory-sorting"
  | "spelling-typing"
  | "syntax-construction"
  | "word-puzzles"
  | "arcade-action"
  | "speaking-listening";

export type ParentEngine = "pairing" | "selection" | "text-spelling" | "narrative";

export type GameModeId =
  | "flashcards"
  | "memory-match"
  | "balloon-pop"
  | "speak-it"
  | "quiz"
  | "sentence-builder";

export interface UnitMeta {
  tenantId: TenantId;
  curriculumId: CurriculumId;
  level: number;
  module: number;
  unit: number;
  theme: string;
  gameMode: GameModeId;
  gameFamily: GameFamily;
  engineId: ParentEngine;
}

export interface PedagogicalPayload {
  vocabularyTerms: string[];
  targetSentences: [string, string];
}

export interface TeacherLaunchProtocol {
  hook: string;
  activity: string;
  review: string;
}

export interface VisualRules {
  avatarFamily: string;
  characterFocus: string;
  blacklistCheck: {
    passed: boolean;
    notes: string;
  };
}

export interface UnitPayload {
  unitMeta: UnitMeta;
  pedagogicalPayload: PedagogicalPayload;
  visualRules: VisualRules;
  teacherLaunchProtocol: TeacherLaunchProtocol;
}

export type GameEventType =
  | "game_started"
  | "round_shown"
  | "answer_submitted"
  | "answer_result"
  | "powerup_used"
  | "game_completed"
  | "mastery_updated";

export interface GameProgressEvent {
  type: GameEventType;
  unitKey: string;
  gameMode: GameModeId;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface StarDustBreakdown {
  vocabulary: number;
  syntax: number;
  bonus: number;
  total: number;
}

export function getUnitKey(meta: Pick<UnitMeta, "tenantId" | "curriculumId" | "level" | "unit">): string {
  return `${meta.tenantId}:${meta.curriculumId}:L${meta.level}:U${meta.unit}`;
}

export function validateUnitPayload(payload: UnitPayload): string[] {
  const errors: string[] = [];
  const termCount = payload.pedagogicalPayload.vocabularyTerms.length;

  if (termCount < 8 || termCount > 12) {
    errors.push("Vocabulary term count must be between 8 and 12.");
  }

  if (payload.pedagogicalPayload.targetSentences.length !== 2) {
    errors.push("Exactly 2 target sentence structures are required.");
  }

  if (!payload.visualRules.blacklistCheck.passed) {
    errors.push("Visual blacklist check must pass before student assignment.");
  }

  return errors;
}

export function calculateStarDust(args: {
  masteredTerms: number;
  totalTerms: number;
  masteredSyntaxChecks: number;
  totalSyntaxChecks: number;
  bonusRatio: number;
}): StarDustBreakdown {
  const safeTermTotal = Math.max(args.totalTerms, 1);
  const safeSyntaxTotal = Math.max(args.totalSyntaxChecks, 1);
  const vocabulary = Math.round((Math.min(args.masteredTerms, safeTermTotal) / safeTermTotal) * 300);
  const syntax = Math.round((Math.min(args.masteredSyntaxChecks, safeSyntaxTotal) / safeSyntaxTotal) * 300);
  const bonus = Math.round(Math.max(0, Math.min(args.bonusRatio, 1)) * 400);

  return {
    vocabulary,
    syntax,
    bonus,
    total: vocabulary + syntax + bonus,
  };
}
