"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioCueButton, AudioCueText, playAudioCueText } from "@/features/audio/AudioCueButton";
import {
  completeGameMode,
  createGameInteractionEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { calculateAccuracyBonusDust, getGameScoringProfileForMode } from "../scoringProfiles";

interface LabelItPracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

interface LabelItAnchor {
  anchorId: string;
  targetText: string;
  xPercent: number;
  yPercent: number;
}

const gameMode = "label-it" as const;
const scoringProfileId = "pairing-reinforcement-v1";
const instructionText = "Tap a label. Then tap the matching picture point.";

export function LabelItPracticeGame({
  unit,
  launchSession,
  progression,
  audioCues = [],
  onEvent,
  onComplete,
}: LabelItPracticeGameProps) {
  const anchors = useMemo(() => buildLabelAnchors(unit), [unit]);
  const scoringProfile = getGameScoringProfileForMode(gameMode);
  const startEventSent = useRef(false);
  const roundShownSent = useRef(false);
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>();
  const [completedAnchorIds, setCompletedAnchorIds] = useState<string[]>([]);
  const [correctAnchorIds, setCorrectAnchorIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Listen to a label. Place it on the picture.");
  const [completionSent, setCompletionSent] = useState(false);
  const completed = anchors.length > 0 && completedAnchorIds.length === anchors.length;

  useEffect(() => {
    if (startEventSent.current) {
      return;
    }

    startEventSent.current = true;
    const event = startUnlockedGameMode({
      progression,
      launchSession,
      gameMode,
      occurredAt: new Date().toISOString(),
    });

    if (event) {
      onEvent?.(event);
    }
  }, [launchSession, onEvent, progression]);

  useEffect(() => {
    if (roundShownSent.current || anchors.length === 0) {
      return;
    }

    roundShownSent.current = true;
    emitInteractionEvent("round_shown", {
      anchorCount: anchors.length,
      labelCount: anchors.length,
      reviewedAssetOnly: true,
      studentFacingUploadAllowed: false,
      pairingSkin: gameMode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchors.length]);

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

  function handleLabelSelect(label: string) {
    const cue = findTermAudioCue(audioCues, label);
    playAudioCueText({ text: cue?.text ?? label, language: cue?.language ?? "en" });
    setSelectedLabel(label);
    setFeedback(`Selected ${label}. Tap the matching picture point.`);
  }

  function handleAnchorSelect(anchor: LabelItAnchor) {
    if (completed || completedAnchorIds.includes(anchor.anchorId)) {
      return;
    }

    if (!selectedLabel) {
      setFeedback("Choose a label first.");
      playAudioCueText({ text: "Choose a label first.", language: "en" });
      return;
    }

    const correct = normalizeLabel(selectedLabel) === normalizeLabel(anchor.targetText);
    const nextAttempts = attempts + 1;

    setAttempts(nextAttempts);
    emitInteractionEvent("answer_submitted", {
      anchorId: anchor.anchorId,
      selectedLabel,
      expectedLabel: anchor.targetText,
      attempts: nextAttempts,
      targetLanguageAttempt: true,
      supportLanguageUnlockAllowed: false,
      uploadedImageProgressAllowed: false,
    });
    emitInteractionEvent("answer_result", {
      anchorId: anchor.anchorId,
      selectedLabel,
      correct,
      completedAnchors: completedAnchorIds.length,
      pairingSkin: gameMode,
    });

    if (!correct) {
      setFeedback("Try again. Listen to the label and find the matching point.");
      playAudioCueText({ text: "Try again. Listen to the label and find the matching point.", language: "en" });
      return;
    }

    const nextCompletedAnchorIds = Array.from(new Set([...completedAnchorIds, anchor.anchorId]));
    const nextCorrectAnchorIds = Array.from(new Set([...correctAnchorIds, anchor.anchorId]));

    setCompletedAnchorIds(nextCompletedAnchorIds);
    setCorrectAnchorIds(nextCorrectAnchorIds);
    setSelectedLabel(undefined);
    setFeedback("Correct label. Choose another one.");
    playAudioCueText({ text: "Correct label. Choose another one.", language: "en" });

    if (nextCompletedAnchorIds.length === anchors.length && !completionSent) {
      const earnedStarDust = calculateLabelItDust({
        attempts: nextAttempts,
        correctAnchors: nextCorrectAnchorIds.length,
        totalAnchors: anchors.length,
      });
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        metadata: {
          parentEngine: "pairing",
          scoringProfileId,
          completedAnchors: nextCompletedAnchorIds.length,
          correctAnchors: nextCorrectAnchorIds.length,
          attempts: nextAttempts,
          reviewedAssetOnly: true,
        },
      });

      setFeedback(`Label It complete. You placed ${nextCorrectAnchorIds.length} labels.`);
      emitInteractionEvent("mastery_updated", {
        completed: true,
        earnedStarDust,
        completedAnchors: nextCompletedAnchorIds.length,
        correctAnchors: nextCorrectAnchorIds.length,
        scoringProfileId,
        supportLanguageUnlockAllowed: false,
        uploadedImageProgressAllowed: false,
      });
      setCompletionSent(true);
      onComplete(result);
    }
  }

  function calculateLabelItDust(args: { attempts: number; correctAnchors: number; totalAnchors: number }): number {
    if (!scoringProfile || args.correctAnchors === 0) {
      return 0;
    }

    const accuracyDust = calculateAccuracyBonusDust({
      attempts: args.attempts,
      targetAttempts: args.totalAnchors,
      profile: scoringProfile,
      minimumDust: 80,
    });
    const correctnessRatio = args.correctAnchors / Math.max(args.totalAnchors, 1);

    return Math.min(scoringProfile.completionDustCap, Math.round(accuracyDust * correctnessRatio));
  }

  if (anchors.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-bold">Label It</h3>
        <p className="mt-2 text-sm text-[var(--tenant-muted)]">No reviewed label anchors are available for this unit.</p>
      </Card>
    );
  }

  const instructionCue = findAudioCueForGame(audioCues, "instruction");
  const activeLabels = anchors.filter((anchor) => !completedAnchorIds.includes(anchor.anchorId));

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Label It</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text={instructionCue?.text ?? instructionText}
              language={instructionCue?.language ?? "en"}
              label="Tap the Label It instruction to hear it"
              className="text-sm"
            />
          </p>
        </div>
        <StatusPill label={completed ? "Complete" : `${completedAnchorIds.length}/${anchors.length} placed`} tone={completed ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <LabelItFact label="Engine" value="pairing" />
        <LabelItFact label="Asset" value="reviewed only" />
        <LabelItFact label="Correct" value={`${correctAnchorIds.length}/${anchors.length}`} />
        <LabelItFact label="Attempts" value={String(attempts)} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Reviewed image placeholder</p>
            <p className="mt-1 text-sm font-semibold text-[var(--tenant-text)]">
              No live upload is used here. Future uploaded images must pass rights, safety, alt text, label-anchor, and audio gates first.
            </p>
          </div>
          <StatusPill label="No live upload" tone="warning" />
        </div>

        <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg border border-[var(--tenant-border)] bg-white">
          <div className="absolute inset-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-sky-100" />
            <div className="rounded-lg bg-emerald-100" />
            <div className="rounded-lg bg-amber-100" />
            <div className="rounded-lg bg-rose-100" />
          </div>
          {anchors.map((anchor, index) => {
            const matched = completedAnchorIds.includes(anchor.anchorId);

            return (
              <button
                key={anchor.anchorId}
                type="button"
                onClick={() => handleAnchorSelect(anchor)}
                disabled={matched || completed}
                className={`absolute min-h-12 min-w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-xs font-bold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
                  matched
                    ? "border-emerald-400 bg-emerald-100 text-emerald-950"
                    : "border-[var(--tenant-primary)] bg-[var(--tenant-surface)] text-[var(--tenant-text)] hover:brightness-95"
                }`}
                style={{ left: `${anchor.xPercent}%`, top: `${anchor.yPercent}%` }}
                aria-label={matched ? `${anchor.targetText} placed` : `Picture point ${index + 1}. Tap after selecting a label.`}
              >
                {matched ? anchor.targetText : index + 1}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-[var(--tenant-text)]">Label bank</p>
          <StatusPill label={selectedLabel ? `Selected ${selectedLabel}` : "Choose one"} tone={selectedLabel ? "success" : "neutral"} />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {activeLabels.map((anchor) => (
            <button
              key={anchor.anchorId}
              type="button"
              onClick={() => handleLabelSelect(anchor.targetText)}
              className={`min-h-12 rounded-lg border px-3 py-2 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
                selectedLabel === anchor.targetText
                  ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary-soft)] text-[var(--tenant-text)]"
                  : "border-[var(--tenant-border)] bg-white text-[var(--tenant-text)] hover:brightness-95"
              }`}
            >
              <AudioCueText
                text={findAudioText(audioCues, anchor.targetText)}
                language="en"
                label={`Tap ${anchor.targetText} to hear it`}
                className="text-sm font-bold"
              />
            </button>
          ))}
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          <AudioCueText text={feedback} language="en" label="Tap the Label It feedback to hear it" className="text-sm font-semibold" />
        </p>
        <AudioCueButton text={feedback} language="en" label="Replay Label It feedback" />
      </div>
    </Card>
  );
}

function buildLabelAnchors(unit: UnitPayload): LabelItAnchor[] {
  const positions = [
    { xPercent: 24, yPercent: 30 },
    { xPercent: 72, yPercent: 30 },
    { xPercent: 28, yPercent: 72 },
    { xPercent: 72, yPercent: 70 },
  ];

  return unit.pedagogicalPayload.vocabularyTerms.slice(0, 4).map((term, index) => ({
    anchorId: `label-it-${index + 1}`,
    targetText: term,
    ...positions[index],
  }));
}

function LabelItFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findAudioCueForGame(audioCues: AudioCue[], kind: AudioCue["kind"]): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.gameMode === gameMode);
}

function findTermAudioCue(audioCues: AudioCue[], text: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === "term" && cue.text.trim().toLowerCase() === text.trim().toLowerCase());
}

function findAudioText(audioCues: AudioCue[], label: string): string {
  return findTermAudioCue(audioCues, label)?.text ?? label;
}
