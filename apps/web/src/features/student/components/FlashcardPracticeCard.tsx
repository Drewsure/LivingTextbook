"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameModeId,
  LaunchSession,
  StudentProgressionState,
  UnitAssistLanguagePlan,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import { formatLanguageName } from "@/features/language/languageLabels";
import { formatLabel, formatMode } from "../studentLabels";
import type { TenantConfig } from "@/features/tenant/types";

interface FlashcardPracticeCardProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  entryComplete: boolean;
  lastEarnedDust: number;
  nextMode?: GameModeId;
  audioCues?: AudioCue[];
  assistLanguagePlan?: UnitAssistLanguagePlan;
  targetPracticeEngagedCount: number;
  targetPracticeRequiredCount: number;
  targetPracticeReady: boolean;
  onTargetPracticeEngaged: (itemId: string) => void;
  onComplete: () => void;
}

export function FlashcardPracticeCard({
  tenant,
  unit,
  launchSession,
  progression,
  entryComplete,
  lastEarnedDust,
  nextMode,
  audioCues = [],
  assistLanguagePlan,
  targetPracticeEngagedCount,
  targetPracticeRequiredCount,
  targetPracticeReady,
  onTargetPracticeEngaged,
  onComplete,
}: FlashcardPracticeCardProps) {
  const instructionCue = findAudioCueForGame(audioCues, "instruction", launchSession.entryMode);
  const feedbackCue = findAudioCueForGame(audioCues, "feedback", launchSession.entryMode);
  const remainingTargetItems = Math.max(targetPracticeRequiredCount - targetPracticeEngagedCount, 0);
  const entryMessage = entryComplete
    ? feedbackCue?.text ?? `${formatMode(launchSession.entryMode)} is complete. ${nextMode ? `${formatMode(nextMode)} is ready.` : "The next activity is ready."}`
    : instructionCue?.text ?? "Tap each English word and sentence to hear it. Then repeat.";
  const actionText = entryComplete ? "Practice complete" : targetPracticeReady ? "Mark practice complete" : "Listen to English first";
  const gateMessage = entryComplete
    ? "English practice is complete."
    : targetPracticeReady
      ? "English listening is complete. Mark practice complete to unlock the next game."
      : `${remainingTargetItems} more English item${remainingTargetItems === 1 ? "" : "s"} must be heard before completion. Japanese assist does not unlock the next game.`;
  const assistInstruction = assistLanguagePlan?.instructionGlosses?.[entryMessage];

  function handleComplete() {
    if (!targetPracticeReady || entryComplete) {
      return;
    }

    onComplete();
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Flashcard Practice</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText
              text={instructionCue?.text ?? `Practice all ${unit.pedagogicalPayload.vocabularyTerms.length} words to open the next game.`}
              language={instructionCue?.language ?? "en"}
              label="Tap the flashcard instruction to hear it"
              className="text-sm"
            />
          </p>
          {assistLanguagePlan && (
            <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">
              Assist: {formatLanguageName(assistLanguagePlan.assistLanguage)} / {assistLanguagePlan.reviewStatus}
            </p>
          )}
        </div>
        <StatusPill label={formatLabel(progression.masteryStatus)} tone={entryComplete ? "success" : "neutral"} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {unit.pedagogicalPayload.vocabularyTerms.map((term) => {
          const audioCue = findAudioCue(audioCues, "term", term);
          const assistGloss = assistLanguagePlan?.vocabularyGlosses[term];

          return (
            <div
              key={term}
              className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-center"
            >
              <AudioCueText
                text={audioCue?.text ?? term}
                language={audioCue?.language ?? "en"}
                label={`Tap ${term} to hear it`}
                className="text-lg font-bold"
                onPlay={() => onTargetPracticeEngaged(getVocabularyPracticeItemId(term))}
              />
              {assistLanguagePlan && assistGloss && (
                <AudioCueText
                  text={assistGloss}
                  language={assistLanguagePlan.assistLanguage}
                  label={`Tap the ${formatLanguageName(assistLanguagePlan.assistLanguage)} assist for ${term}`}
                  className="mt-2 text-sm font-semibold text-[var(--tenant-muted)]"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-sm font-semibold">Target sentences</p>
        <div className="mt-3 grid gap-3">
          {unit.pedagogicalPayload.targetSentences.map((sentence, index) => {
            const audioCue = findAudioCue(audioCues, "sentence", sentence);
            const assistSentence = assistLanguagePlan?.sentenceGlosses[index];

            return (
              <div key={sentence} className="rounded-lg bg-[var(--tenant-primary-soft)] p-3">
                <AudioCueText
                  text={audioCue?.text ?? sentence}
                  language={audioCue?.language ?? "en"}
                  label={`Tap the sentence to hear ${sentence}`}
                  className="text-sm font-semibold"
                  onPlay={() => onTargetPracticeEngaged(getSentencePracticeItemId(index))}
                />
                {assistLanguagePlan && assistSentence && (
                  <div className="mt-2">
                    <AudioCueText
                      text={assistSentence}
                      language={assistLanguagePlan.assistLanguage}
                      label={`Tap the ${formatLanguageName(assistLanguagePlan.assistLanguage)} sentence assist`}
                      className="text-sm font-semibold text-[var(--tenant-muted)]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 grid gap-3 rounded-lg border border-[var(--tenant-border)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">Entry practice</p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText
              text={entryMessage}
              language={(entryComplete ? feedbackCue?.language : instructionCue?.language) ?? "en"}
              label="Tap the entry practice message to hear it"
              className="text-sm"
            />
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">
            English listened: {targetPracticeEngagedCount}/{targetPracticeRequiredCount}
          </p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText
              text={gateMessage}
              language="en"
              label="Tap the entry practice gate message to hear it"
              className="text-sm"
            />
          </p>
          {assistLanguagePlan && assistInstruction && (
            <p className="mt-1 text-sm text-[var(--tenant-muted)]">
              <AudioCueText
                text={assistInstruction}
                language={assistLanguagePlan.assistLanguage}
                label="Tap the assist-language entry practice message to hear it"
                className="text-sm"
              />
            </p>
          )}
          {lastEarnedDust > 0 && (
            <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">
              +{lastEarnedDust} {tenant.rewardName}
            </p>
          )}
        </div>
        <AudioSupportedAction audioText={targetPracticeReady ? actionText : gateMessage} onClick={handleComplete} disabled={entryComplete || !targetPracticeReady}>
          {actionText}
        </AudioSupportedAction>
      </div>
    </Card>
  );
}

function getVocabularyPracticeItemId(term: string): string {
  return `target-term:${term.trim().toLowerCase()}`;
}

function getSentencePracticeItemId(index: number): string {
  return `target-sentence:${index}`;
}

function findAudioCue(audioCues: AudioCue[], kind: AudioCue["kind"], text: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.text.trim().toLowerCase() === text.trim().toLowerCase());
}

function findAudioCueForGame(audioCues: AudioCue[], kind: AudioCue["kind"], gameMode: GameModeId): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.gameMode === gameMode);
}
