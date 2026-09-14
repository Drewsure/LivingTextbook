"use client";

import { useEffect, useRef, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { resolveTargetLanguage } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import {
  MicrophonePracticeControl,
  type MicrophonePracticeEvent,
} from "@/features/audio/MicrophonePracticeControl";
import {
  completeGameMode,
  createAudioRequestedEvent,
  createMicrophonePracticeEvent,
  createGameInteractionEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import type { TenantMicrophonePracticeSettings } from "@/features/tenant/types";
import { getGameModeCatalogItem } from "../gameModeCatalog";
import { getRequiredGameScoringProfileForMode } from "../scoringProfiles";
import { buildSpeakItPrompts, type SpeakItPrompt } from "./speakingEngineAdapter";

interface SpeakItPracticeGameProps {
  unit: UnitPayload;
  gameMode: GameModeId;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  replaySeed: string;
  audioCues?: AudioCue[];
  targetLanguage: string;
  microphonePractice: TenantMicrophonePracticeSettings;
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

export function SpeakItPracticeGame({
  unit,
  gameMode,
  launchSession,
  progression,
  replaySeed,
  audioCues = [],
  targetLanguage: configuredTargetLanguage,
  microphonePractice,
  onEvent,
  onComplete,
}: SpeakItPracticeGameProps) {
  const [spokenPromptIds, setSpokenPromptIds] = useState<string[]>([]);
  const [completionSent, setCompletionSent] = useState(false);
  const mode = getGameModeCatalogItem(gameMode);
  const scoringProfile = getRequiredGameScoringProfileForMode(gameMode);
  const prompts = buildSpeakItPrompts(unit, audioCues);
  const targetLanguage = resolveTargetLanguage({
    tenantTargetLanguage: configuredTargetLanguage,
    unitLanguage: unit.unitMeta.textbookReference?.language,
  });
  const startSentRef = useRef(false);
  const shownPromptIdsRef = useRef(new Set<string>());
  const completedAlready = progression.completedGameModes.includes(gameMode);
  const spokenCount = spokenPromptIds.length;
  const complete = spokenCount >= prompts.length || completedAlready;
  const instructionCue = findAudioCueForGame(audioCues, "instruction", gameMode);
  const localMicEnabled = microphonePractice.localRecordReplayEnabled;

  useEffect(() => {
    if (startSentRef.current) {
      return;
    }

    const event = startUnlockedGameMode({
      progression,
      launchSession,
      gameMode,
      occurredAt: new Date().toISOString(),
      replaySeed,
    });

    if (event) {
      startSentRef.current = true;
      onEvent?.(event);
    }
  }, [launchSession, onEvent, progression, replaySeed]);

  useEffect(() => {
    for (const prompt of prompts) {
      if (shownPromptIdsRef.current.has(prompt.id)) {
        continue;
      }

      shownPromptIdsRef.current.add(prompt.id);
      emitInteractionEvent("round_shown", {
        promptId: prompt.id,
        promptKind: prompt.kind,
        promptText: prompt.label,
        speechMatchMode: "listen-repeat",
        microphoneRequired: false,
        microphoneTeacherApproved: localMicEnabled,
        aiTutorRequired: false,
        replaySeed,
      });
    }
  }, [localMicEnabled, prompts, replaySeed]);

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
        replaySeed,
        metadata,
      }),
    );
  }

  function emitAudioRequested(
    cueKind: "term" | "sentence" | "instruction" | "feedback",
    cueText: string,
    language: string,
    source: string,
  ) {
    onEvent?.(
      createAudioRequestedEvent({
        progression,
        launchSession,
        gameMode,
        occurredAt: new Date().toISOString(),
        replaySeed,
        cueKind,
        cueText,
        language,
        source,
      }),
    );
  }

  function handlePromptHeard(prompt: SpeakItPrompt) {
    emitAudioRequested(prompt.kind, prompt.audioCue?.text ?? prompt.label, prompt.audioCue?.language ?? targetLanguage, "speak-it-prompt");
  }

  function handleRecordingEvent(
    prompt: SpeakItPrompt,
    microphoneEvent: MicrophonePracticeEvent,
    metadata: Record<string, string | number | boolean> = {},
  ) {
    onEvent?.(
      createMicrophonePracticeEvent({
        progression,
        launchSession,
        gameMode,
        occurredAt: new Date().toISOString(),
        microphoneEvent,
        promptText: prompt.label,
        metadata: {
          speechMatchMode: "local-record-replay",
          microphoneRequired: false,
          microphoneTeacherApproved: localMicEnabled,
          aiTutorRequired: false,
          replaySeed,
          ...metadata,
        },
      }),
    );
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
      microphoneTeacherApproved: localMicEnabled,
      replaySeed,
    });
    emitInteractionEvent("answer_result", {
      promptId: prompt.id,
      result: "spoken",
      correct: true,
      spokenPromptCount: nextSpokenPromptIds.length,
      totalPromptCount: prompts.length,
      teacherReviewRecommended: true,
      replaySeed,
    });

    if (nextSpokenPromptIds.length >= prompts.length && !completionSent) {
      const earnedStarDust = scoringProfile.completionDustCap;
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        replaySeed,
        metadata: {
          spokenPromptCount: nextSpokenPromptIds.length,
          totalPromptCount: prompts.length,
          parentEngine: mode?.engineId ?? unit.unitMeta.engineId,
          scoringProfileId: scoringProfile.id,
          speechMatchMode: "no-ai-core",
          microphoneRequired: false,
          microphoneTeacherApproved: localMicEnabled,
          aiTutorRequired: false,
          replaySeed,
        },
      });

      emitInteractionEvent("mastery_updated", {
        completed: true,
        parentEngine: mode?.engineId ?? unit.unitMeta.engineId,
        earnedStarDust: result.earnedStarDust,
        spokenPromptCount: nextSpokenPromptIds.length,
        totalPromptCount: prompts.length,
        scoringProfileId: scoringProfile.id,
        replaySeed,
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
              text={instructionCue?.text ?? (localMicEnabled ? "Listen, record or say it out loud, replay if needed, then tap I said it." : "Listen, say it out loud, then tap I said it.")}
              language={instructionCue?.language ?? targetLanguage}
              label="Tap the Speak It instruction to hear it"
              className="text-sm"
              onPlay={() =>
                emitAudioRequested(
                  "instruction",
                  instructionCue?.text ?? (localMicEnabled ? "Listen, record or say it out loud, replay if needed, then tap I said it." : "Listen, say it out loud, then tap I said it."),
                  instructionCue?.language ?? targetLanguage,
                  "speak-it-instruction",
                )
              }
            />
          </p>
        </div>
        <StatusPill label={complete ? "Complete" : localMicEnabled ? "Mic approved" : "Mic off"} tone={complete || localMicEnabled ? "success" : "warning"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-5">
        <SpeakItFact label="Spoken" value={`${spokenCount}/${prompts.length}`} />
        <SpeakItFact label="Mode" value={localMicEnabled ? "Core + mic" : "Core"} />
        <SpeakItFact label="Mic" value={localMicEnabled ? "Local replay" : "Teacher off"} />
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
                  language={prompt.audioCue?.language ?? targetLanguage}
                  label={`Tap to hear ${prompt.label}`}
                  className="mt-1 justify-start text-left text-base font-bold"
                  onPlay={() => handlePromptHeard(prompt)}
                />
              </div>
              <div className={localMicEnabled ? "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" : "flex flex-wrap justify-end gap-3"}>
                {localMicEnabled && (
                  <MicrophonePracticeControl
                    promptLabel={prompt.label}
                    disabled={spoken || complete}
                    onRecordingEvent={(microphoneEvent, metadata) =>
                      handleRecordingEvent(prompt, microphoneEvent, metadata)
                    }
                  />
                )}
                <AudioSupportedAction
                  audioText={spoken ? "Spoken" : `I said ${prompt.label}`}
                  audioLanguage={targetLanguage}
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
