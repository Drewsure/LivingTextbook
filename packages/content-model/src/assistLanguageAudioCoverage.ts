import type { AudioCue, UnitAssistLanguagePlan, UnitPayload } from "./index";

export interface AssistLanguageAudioCoverage {
  unitKey: string;
  assistLanguage: string;
  requiredTermCount: number;
  coveredTermCount: number;
  requiredSentenceCount: number;
  coveredSentenceCount: number;
  requiredInstructionCount: number;
  coveredInstructionCount: number;
  missingTerms: string[];
  missingSentences: string[];
  missingInstructions: string[];
  audioCueCount: number;
  ready: boolean;
}

export interface AssistLanguageAudioCoverageQuery {
  unit: UnitPayload;
  plan: UnitAssistLanguagePlan;
  audioCues?: readonly AudioCue[];
}

export function getAssistLanguageAudioCoverage({
  unit,
  plan,
  audioCues = [],
}: AssistLanguageAudioCoverageQuery): AssistLanguageAudioCoverage {
  const scopedCues = audioCues.filter(
    (cue) => cue.tenantId === unit.unitMeta.tenantId
      && cue.unitKey === plan.unitKey
      && languageMatches(cue.language, plan.assistLanguage),
  );
  const requiredTerms = unit.pedagogicalPayload.vocabularyTerms
    .map((term) => ({ source: term, gloss: plan.vocabularyGlosses[term]?.trim() ?? "" }))
    .filter((entry) => entry.gloss.length > 0);
  const requiredSentences = plan.sentenceGlosses
    .map((gloss, index) => ({ source: unit.pedagogicalPayload.targetSentences[index] ?? `sentence-${index + 1}`, gloss: gloss.trim() }))
    .filter((entry) => entry.gloss.length > 0);
  const requiredInstructions = Object.entries(plan.instructionGlosses ?? {})
    .map(([source, gloss]) => ({ source, gloss: gloss.trim() }))
    .filter((entry) => entry.gloss.length > 0);
  const hasCue = (kind: AudioCue["kind"], gloss: string) =>
    scopedCues.some((cue) => cue.kind === kind && normalizeAudioText(cue.text) === normalizeAudioText(gloss));
  const missingTerms = requiredTerms.filter((entry) => !hasCue("term", entry.gloss)).map((entry) => entry.source);
  const missingSentences = requiredSentences.filter((entry) => !hasCue("sentence", entry.gloss)).map((entry) => entry.source);
  const missingInstructions = requiredInstructions.filter((entry) => !hasCue("instruction", entry.gloss)).map((entry) => entry.source);

  return {
    unitKey: plan.unitKey,
    assistLanguage: plan.assistLanguage,
    requiredTermCount: requiredTerms.length,
    coveredTermCount: requiredTerms.length - missingTerms.length,
    requiredSentenceCount: requiredSentences.length,
    coveredSentenceCount: requiredSentences.length - missingSentences.length,
    requiredInstructionCount: requiredInstructions.length,
    coveredInstructionCount: requiredInstructions.length - missingInstructions.length,
    missingTerms,
    missingSentences,
    missingInstructions,
    audioCueCount: scopedCues.length,
    ready: missingTerms.length === 0 && missingSentences.length === 0 && missingInstructions.length === 0,
  };
}

function languageMatches(value: string, expected: string): boolean {
  const actual = value.trim().toLowerCase();
  const target = expected.trim().toLowerCase();
  return actual === target || actual.startsWith(`${target}-`) || target.startsWith(`${actual}-`);
}

function normalizeAudioText(value: string): string {
  return value.trim().replace(/\s+/gu, " ").toLocaleLowerCase();
}
