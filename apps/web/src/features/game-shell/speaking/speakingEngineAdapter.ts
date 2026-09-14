import type { AudioCue, UnitPayload } from "@living-textbook/content-model";

export interface SpeakItPrompt {
  id: string;
  label: string;
  kind: "term" | "sentence";
  audioCue?: AudioCue;
}

export function buildSpeakItPrompts(unit: UnitPayload, audioCues: AudioCue[] = []): SpeakItPrompt[] {
  const termPrompts = unit.pedagogicalPayload.vocabularyTerms.map((term) => ({
    id: `speak-term:${term}`,
    label: term,
    kind: "term" as const,
    audioCue: findAudioCue(audioCues, "term", term),
  }));
  const sentencePrompts = unit.pedagogicalPayload.targetSentences.map((sentence, index) => ({
    id: `speak-sentence:${index}`,
    label: sentence,
    kind: "sentence" as const,
    audioCue: findAudioCue(audioCues, "sentence", sentence),
  }));

  return [...termPrompts, ...sentencePrompts];
}

function findAudioCue(audioCues: AudioCue[], kind: AudioCue["kind"], text: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.text.trim().toLowerCase() === text.trim().toLowerCase());
}
