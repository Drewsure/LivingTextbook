"use client";

import { useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import {
  MicrophonePracticeControl,
  type MicrophonePracticeEvent,
} from "@/features/audio/MicrophonePracticeControl";
import {
  completeGameMode,
  createGameInteractionEvent,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { getGameModeCatalogItem } from "../gameModeCatalog";
import { getGameScoringProfileForMode } from "../scoringProfiles";

interface SpeakItPracticeGameProps {
  unit: UnitPayload;
  gameMode: GameModeId;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

interface SpeakItPrompt {
  id: string;
  label: string;
  kind: "term" | "sentence";
  audioCue?: AudioCue;
}

export function SpeakItPracticeGame({
  unit,
  gameMode,
  launchSession,
  progression,
  audioCues = [],
  onEvent,
  onComplete,
}: SpeakItPracticeGameProps) {
  const [spokenPromptIds, setSpokenPromptIds] = useState<string[]>([]);
  const [completionSent, setCompletionSent] = useState(false);
  const mode = getGameModeCatalogItem(gameMode);
  const scoringProfile = getGameScoringProfileForMode(gameMode);
  const prompts = createSpeakItPrompts(unit, audioCues);
  const completedAlready = progression.completedGameModes.includes(gameMode);
  const spokenCount = spokenPromptIds.length;
  const complete = spokenCount >= prompts.length || completedAlready;
  const instructionCue = findAudioCueForGame(audioCues, "instruction", gameMode);

  function emitInteractionEvent(
    type: "round_shown" | "answer_submitted" | "answer_result" | "mastery_updated",
    metadata: Record<string, string | number | boolean>,
  ) {
    onEvent?.(
      createGameInteractionEvent({
        type,
        progression,
        launchSession,
        gameMode,
        occurredAt: new Date().toISOString(),
        metadata,
      }),
    );
  }

  function handlePromptHeard(prompt: SpeakItPrompt) {
    emitInteractionEvent("round_shown", {
      promptId: prompt.id,
      promptKind: prompt.kind,
      promptText: prompt.label,
      speechMatchMode: "listen-repeat",
      microphoneRequired: false,
      aiTutorRequired: false,
    });
  }

  function handleRecordingEvent(
    prompt: SpeakItPrompt,
    microphoneEvent: MicrophonePracticeEvent,
    metadata: Record<string, string | number | boolean> = {},
  ) {
    emitInteractionEvent("round_shown", {
      promptId: prompt.id,
      promptKind: prompt.kind,
      promptText: prompt.label,
      interactionKind: "local-microphone-practice",
      microphoneEvent,
      speechMatchMode: "local-record-replay",
      microphoneRequired: false,
      aiTutorRequired: false,
      transcriptGenerated: false,
      audioPersisted: false,
      ...metadata,
    });
  }

  function handlePromptSpoken(prompt: SpeakItPrompt) {
    if (spokenPromptIds.includes(prompt.id) || complete) {
      return;
    }

    const nextSpokenPromptIds = [...spokenPromptIds, prompt.id];
    setSpokenPromptIds(nextSpokenPromptIds);

    emitInteractionEvent("answer_submitted", {
      promptId: prompt.id,
      promptKind: prompt.kind,
      promptText: prompt.label,
      responseType: "student-self-confirmed",
      speechMatchMode: "no-ai-core",
      microphoneRequired: false,
    });
    emitInteractionEvent("answer_result", {
      promptId: prompt.id,
      result: "spoken",
      correct: true,
      spokenPromptCount: nextSpokenPromptIds.length,
      totalPromptCount: prompts.length,
      teacherReviewRecommended: true,
    });

    if (nextSpokenPromptIds.length >= prompts.length && !completionSent) {
      const earnedStarDust = scoringProfile ? Math.min(200, scoringProfile.completionDustCap) : 150;
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        metadata: {
          spokenPromptCount: nextSpokenPromptIds.length,
          totalPromptCount: prompts.length,
          parentEngine: mode?.engineId ?? unit.unitMeta.engineId,
          scoringProfileId: scoringProfile?.id ?? "none",
          speechMatchMode: "no-ai-core",
          microphoneRequired: false,
          aiTutorRequired: false,
        },
      });

      emitInteractionEvent("mastery_updated", {
        completed: true,
        earnedStarDust,
        spokenPromptCount: nextSpokenPromptIds.length,
        totalPromptCount: prompts.length,
        scoringProfileId: scoringProfile?.id ?? "none",
      });
      setCompletionSent(true);
      onComplete(result);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{mode?.label ?? "Speak It"}</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText
              text={instructionCue?.text ?? "Listen, record or say it out loud, replay if needed, then tap I said it."}
              language={instructionCue?.language ?? "en"}
              label="Tap the Speak It instruction to hear it"
              className="text-sm"
            />
          </p>
        </div>
        <StatusPill label={complete ? "Complete" : "Mic optional"} tone={complete ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <SpeakItFact label="Spoken" value={`${spokenCount}/${prompts.length}`} />
        <SpeakItFact label="Mode" value="Core + mic" />
        <SpeakItFact label="Mic" value="Local replay" />
        <SpeakItFact label="AI Tutor" value="Off" />
        <SpeakItFact label="Engine" value={mode?.engineId ?? unit.unitMeta.engineId} />
      </dl>

      <div className="mt-5 grid gap-3">
        {prompts.map((prompt) => {
          const spoken = spokenPromptIds.includes(prompt.id);

          return (
            <article key={prompt.id} className="grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{prompt.kind}</p>
                <AudioCueText
                  text={prompt.audioCue?.text ?? prompt.label}
                  language={prompt.audioCue?.language ?? "en"}
                  label={`Tap to hear ${prompt.label}`}
                  className="mt-1 justify-start text-left text-base font-bold"
                  onPlay={() => handlePromptHeard(prompt)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <MicrophonePracticeControl
                  promptLabel={prompt.label}
                  disabled={spoken || complete}
                  onRecordingEvent={(microphoneEvent, metadata) =>
                    handleRecordingEvent(prompt, microphoneEvent, metadata)
                  }
                />
                <AudioSupportedAction
                  audioText={spoken ? "Spoken" : `I said ${prompt.label}`}
                  onClick={() => handlePromptSpoken(prompt)}
                  disabled={spoken || complete}
                  variant={spoken ? "secondary" : "primary"}
                >
                  {spoken ? "Spoken" : "I said it"}
                </AudioSupportedAction>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}

function createSpeakItPrompts(unit: UnitPayload, audioCues: AudioCue[]): SpeakItPrompt[] {
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

function findAudioCueForGame(audioCues: AudioCue[], kind: AudioCue["kind"], gameMode: GameModeId): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.gameMode === gameMode);
}

function SpeakItFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  );
}
