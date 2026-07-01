import type { UnitPayload } from "@living-textbook/content-model";

export type SelectionSkillFocus = "vocabulary" | "syntax";

export interface SelectionEngineOption {
  optionId: string;
  label: string;
  audioText: string;
  isCorrect: boolean;
}

export interface SelectionEngineRound {
  roundId: string;
  skillFocus: SelectionSkillFocus;
  promptText: string;
  promptAudioText: string;
  correctOptionId: string;
  options: SelectionEngineOption[];
  expectedEvents: string[];
}

export interface SelectionEnginePreviewModel {
  engineId: "selection";
  label: string;
  audioRequired: true;
  rounds: SelectionEngineRound[];
  standardEvents: string[];
  notes: string[];
}

export function buildSelectionEnginePreview(unit: UnitPayload): SelectionEnginePreviewModel {
  const vocabularyRounds = unit.pedagogicalPayload.vocabularyTerms.slice(0, 3).map((term, index, terms) => {
    const roundTerms = getDeterministicOptions(unit.pedagogicalPayload.vocabularyTerms, index);
    const correctOptionId = `vocab-${index}-${slug(term)}`;

    return {
      roundId: `selection-vocabulary-${index + 1}`,
      skillFocus: "vocabulary" as const,
      promptText: `Choose: ${term}`,
      promptAudioText: term,
      correctOptionId,
      options: roundTerms.map((optionTerm) => ({
        optionId: optionTerm === term ? correctOptionId : `vocab-${index}-${slug(optionTerm)}`,
        label: optionTerm,
        audioText: optionTerm,
        isCorrect: optionTerm === term,
      })),
      expectedEvents: ["round_shown", "answer_submitted", "answer_result"],
    };
  });

  const syntaxRound = {
    roundId: "selection-syntax-1",
    skillFocus: "syntax" as const,
    promptText: "Choose the matching sentence.",
    promptAudioText: unit.pedagogicalPayload.targetSentences[0],
    correctOptionId: "syntax-target-1",
    options: unit.pedagogicalPayload.targetSentences.map((sentence, index) => ({
      optionId: `syntax-target-${index + 1}`,
      label: sentence,
      audioText: sentence,
      isCorrect: index === 0,
    })),
    expectedEvents: ["round_shown", "answer_submitted", "answer_result", "mastery_updated"],
  };

  return {
    engineId: "selection",
    label: "Selection Engine Preview",
    audioRequired: true,
    rounds: [...vocabularyRounds, syntaxRound],
    standardEvents: ["game_started", "round_shown", "answer_submitted", "answer_result", "mastery_updated", "game_completed"],
    notes: [
      "Selection rounds are deterministic and data-driven; no random answer order is required for the scaffold.",
      "Every prompt and option carries audio text so young learners can hear before choosing.",
      "The same parent engine can later skin Quiz, Balloon Pop, Whack-a-Mole, Airplane, and other selection modes.",
    ],
  };
}

function getDeterministicOptions(terms: string[], correctIndex: number): string[] {
  const correct = terms[correctIndex];
  const optionIndexes = [correctIndex, (correctIndex + 1) % terms.length, (correctIndex + 2) % terms.length];

  return Array.from(new Set(optionIndexes.map((index) => terms[index] ?? correct))).slice(0, 3);
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "option";
}
