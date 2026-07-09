import type { UnitPayload } from "@living-textbook/content-model";

export interface TextSpellingTile {
  tileId: string;
  label: string;
  audioText: string;
  expectedOrder: number;
}

export interface TextSpellingRound {
  roundId: string;
  modeId: "sentence-builder";
  promptText: string;
  promptAudioText: string;
  targetSentence: string;
  tiles: TextSpellingTile[];
  expectedAnswer: string[];
  expectedEvents: string[];
}

export interface TextSpellingEnginePreviewModel {
  engineId: "text-spelling";
  label: string;
  audioRequired: true;
  rounds: TextSpellingRound[];
  standardEvents: string[];
  scoringProfileId: "syntax-construction-v1";
  notes: string[];
}

export function buildSentenceBuilderPreview(unit: UnitPayload): TextSpellingEnginePreviewModel {
  const rounds = unit.pedagogicalPayload.targetSentences.slice(0, 2).map((sentence, sentenceIndex) => {
    const words = splitSentenceIntoTiles(sentence);

    return {
      roundId: `sentence-builder-${sentenceIndex + 1}`,
      modeId: "sentence-builder" as const,
      promptText: "Build the sentence.",
      promptAudioText: sentence,
      targetSentence: sentence,
      tiles: words.map((word, wordIndex) => ({
        tileId: `sentence-${sentenceIndex + 1}-tile-${wordIndex + 1}-${slug(word)}`,
        label: word,
        audioText: word,
        expectedOrder: wordIndex + 1,
      })),
      expectedAnswer: words,
      expectedEvents: ["round_shown", "answer_submitted", "answer_result"],
    };
  });

  return {
    engineId: "text-spelling",
    label: "Sentence Builder Preview",
    audioRequired: true,
    rounds,
    standardEvents: ["game_started", "round_shown", "answer_submitted", "answer_result", "mastery_updated", "game_completed"],
    scoringProfileId: "syntax-construction-v1",
    notes: [
      "Sentence Builder consumes the two reviewed target sentence structures; it does not generate new grammar inside the game.",
      "Every instruction, full sentence, and word tile carries audio text for tap-to-speak behavior.",
      "The same parent engine can later support ordering, anagram, fill-in, spelling, and typing modes through mode configs.",
      "A Phaser or premium animated skin can wrap this logic later, but the text order, audio, events, and scoring contract stay outside the skin.",
    ],
  };
}

function splitSentenceIntoTiles(sentence: string): string[] {
  return sentence
    .replace(/[.!?]+$/g, "")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "tile";
}
