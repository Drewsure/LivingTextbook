import type { AudioCue, GameModeId, UnitPayload } from "@living-textbook/content-model";

export interface SpeakItPrompt {
  id: string;
  label: string;
  kind: "term" | "sentence";
  audioCue?: AudioCue;
}

export function buildSpeakItPrompts(
  unit: UnitPayload,
  audioCues: AudioCue[] = [],
  gameMode: GameModeId = "speak-it",
): SpeakItPrompt[] {
  const termPrompts = unit.pedagogicalPayload.vocabularyTerms.map((term, termIndex) => ({
    id: `speak-term:${termIndex + 1}`,
    label: term,
    kind: "term" as const,
    audioCue: findAudioCue(audioCues, "term", term, gameMode),
  }));
  const sentencePrompts = unit.pedagogicalPayload.targetSentences.map((sentence, index) => ({
    id: `speak-sentence:${index + 1}`,
    label: sentence,
    kind: "sentence" as const,
    audioCue: findAudioCue(audioCues, "sentence", sentence, gameMode),
  }));

  return [...termPrompts, ...sentencePrompts];
}

function findAudioCue(
  audioCues: AudioCue[],
  kind: AudioCue["kind"],
  text: string,
  gameMode: GameModeId,
): AudioCue | undefined {
  const matchingCues = audioCues.filter(
    (cue) => cue.kind === kind && cue.text.trim().toLowerCase() === text.trim().toLowerCase(),
  );

  return matchingCues.find((cue) => cue.gameMode === gameMode) ?? matchingCues.find((cue) => !cue.gameMode);
}
