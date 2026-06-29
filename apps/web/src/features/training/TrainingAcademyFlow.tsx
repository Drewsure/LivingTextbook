"use client";

import { useMemo, useState } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";
import type { GameProgressEvent, LaunchSession, StudentProgressionState, UnitPayload } from "@living-textbook/content-model";
import { AudioCueText, playAudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import type { TenantConfig } from "@/features/tenant/types";
import { formatLabel, formatMode } from "@/lib/formatLabels";
import { TrainingRecoveryReportSummary } from "./TrainingRecoveryReportSummary";
import {
  completeTrainingReview,
  createTrainingAcademyFocusConfigs,
  createTrainingAcademyRecommendation,
  createTrainingProgressEvent,
  type TrainingAcademyEventName,
  type TrainingAcademyFocusConfig,
  type TrainingAcademyRecommendation,
  type TrainingFocusType,
} from "./trainingAcademyAdapter";

interface TrainingAcademyFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function TrainingAcademyFlow({ tenant, unit, launchSession, progression }: TrainingAcademyFlowProps) {
  const focusOptions = useMemo(
    () => createTrainingAcademyFocusConfigs({ unit, launchSession }),
    [unit, launchSession],
  );
  const [selectedFocusType, setSelectedFocusType] = useState<TrainingFocusType>("vocabulary-review");
  const recommendation = useMemo(
    () => createTrainingAcademyRecommendation({ unit, launchSession, focusType: selectedFocusType }),
    [unit, launchSession, selectedFocusType],
  );
  const [currentProgression, setCurrentProgression] = useState<StudentProgressionState>(progression);
  const [events, setEvents] = useState<GameProgressEvent[]>(() => [
    createTrainingProgressEvent({
      trainingEventType: "training_recommended",
      progression,
      launchSession,
      recommendation,
      occurredAt: new Date().toISOString(),
      metadata: {
        reason: recommendation.reason,
        targetItemCount: recommendation.targetItems.length,
      },
    }),
  ]);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [returned, setReturned] = useState(false);
  const [practicedItems, setPracticedItems] = useState<string[]>([]);

  function appendTrainingEvent(
    trainingEventType: TrainingAcademyEventName,
    metadata?: Record<string, string | number | boolean>,
  ) {
    setEvents((currentEvents) => [
      ...currentEvents,
      createTrainingProgressEvent({
        trainingEventType,
        progression: currentProgression,
        launchSession,
        recommendation,
        occurredAt: new Date().toISOString(),
        metadata,
      }),
    ]);
  }

  function handleFocusSelect(focusType: TrainingFocusType) {
    if (focusType === selectedFocusType) {
      return;
    }

    const nextRecommendation = createTrainingAcademyRecommendation({ unit, launchSession, focusType });
    setSelectedFocusType(focusType);
    setStarted(false);
    setCompleted(false);
    setReturned(false);
    setPracticedItems([]);
    setEvents((currentEvents) => [
      ...currentEvents,
      createTrainingProgressEvent({
        trainingEventType: "training_focus_selected",
        progression: currentProgression,
        launchSession,
        recommendation: nextRecommendation,
        occurredAt: new Date().toISOString(),
        metadata: {
          previousFocusType: selectedFocusType,
          selectedFocusType: focusType,
          reason: nextRecommendation.reason,
          targetItemCount: nextRecommendation.targetItems.length,
        },
      }),
    ]);
  }

  function handleStart() {
    if (started) {
      return;
    }

    setStarted(true);
    appendTrainingEvent("training_started", {
      reason: recommendation.reason,
      targetItemCount: recommendation.targetItems.length,
    });
  }

  function handleItemPractice(item: string, index: number) {
    playAudioCueText({ text: item });
    setStarted(true);
    setPracticedItems((currentItems) => Array.from(new Set([...currentItems, item])));
    appendTrainingEvent("training_item_shown", {
      targetItem: item,
      targetItemIndex: index + 1,
      targetItemKind: getTargetItemKind(item, recommendation),
    });
  }

  function handleComplete() {
    if (completed) {
      return;
    }

    const practicedItemCount = practicedItems.length || recommendation.targetItems.length;
    const occurredAt = new Date().toISOString();
    const result = completeTrainingReview({
      progression: currentProgression,
      launchSession,
      recommendation,
      occurredAt,
      practicedItemCount,
    });

    setEvents((currentEvents) => [
      ...currentEvents,
      createTrainingProgressEvent({
        trainingEventType: "training_answer_submitted",
        progression: currentProgression,
        launchSession,
        recommendation,
        occurredAt,
        metadata: { practicedItemCount },
      }),
      createTrainingProgressEvent({
        trainingEventType: "training_answer_result",
        progression: result.progression,
        launchSession,
        recommendation,
        occurredAt,
        metadata: {
          correct: true,
          earnedStarDust: result.earnedStarDust,
        },
      }),
      result.event,
    ]);
    setCurrentProgression(result.progression);
    setCompleted(true);
  }

  function handleReturnReady() {
    if (returned) {
      return;
    }

    setReturned(true);
    appendTrainingEvent("training_returned_to_unit", {
      returnPath: recommendation.returnPath,
      completed,
    });
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Training Academy</p>
            <h2 className="mt-1 text-2xl font-bold">Recovery practice for {unit.unitMeta.theme}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
              <AudioCueText text={recommendation.reason} label="Hear why this practice is recommended" className="text-sm" />
            </p>
          </div>
          <StatusPill label={completed ? "Practice complete" : started ? "Practice active" : "Recovery lane"} tone={completed ? "success" : "neutral