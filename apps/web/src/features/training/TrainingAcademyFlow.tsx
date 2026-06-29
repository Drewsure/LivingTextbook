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
  const focusOptions = useMemo(() => createTrainingAcademyFocusConfigs({ unit, launchSession }), [unit, launchSession]);
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
      metadata: { reason: recommendation.reason, targetItemCount: recommendation.targetItems.length },
    }),
  ]);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [returned, setReturned] = useState(false);
  const [practicedItems, setPracticedItems] = useState<string[]>([]);

  function appendTrainingEvent(trainingEventType: TrainingAcademyEventName, metadata?: Record<string, string | number | boolean>) {
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
        metadata: { correct: true, earnedStarDust: result.earnedStarDust },
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
          <StatusPill label={completed ? "Practice complete" : started ? "Practice active" : "Recovery lane"} tone={completed ? "success" : "neutral"} />
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <TrainingFact label="Focus" value={recommendation.label} />
          <TrainingFact label="Practice mode" value={formatMode(recommendation.recommendedGameMode)} />
          <TrainingFact label="Return path" value={recommendation.returnPath} />
        </dl>
      </Card>

      <TrainingFocusSelector options={focusOptions} selectedFocusType={selectedFocusType} onSelect={handleFocusSelect} />

      <UnitSessionProgressSummary
        launchSession={launchSession}
        progression={currentProgression}
        events={events}
        rewardName={tenant.rewardName}
        title="Training Recovery"
      />

      <TrainingRecoveryReportSummary events={events} rewardName={tenant.rewardName} title="Teacher Recovery Summary" />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">{recommendation.label} support</p>
            <h3 className="text-lg font-bold">{recommendation.practiceTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
              <AudioCueText text={recommendation.studentInstruction} label="Hear the training instruction" className="text-sm" />
            </p>
          </div>
          <StatusPill label={`${practicedItems.length}/${recommendation.targetItems.length} practiced`} tone={practicedItems.length > 0 ? "success" : "neutral"} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {recommendation.targetItems.map((item, index) => (
            <button
              key={`${item}-${index}`}
              type="button"
              onClick={() => handleItemPractice(item, index)}
              className="min-h-16 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-4 py-3 text-left text-lg font-bold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              {item}
              <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
                {practicedItems.includes(item) ? "Heard" : "Tap to hear"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Sentence patterns</p>
          <div className="mt-2 grid gap-2 text-sm leading-6">
            {recommendation.targetSentences.map((sentence) => (
              <AudioCueText key={sentence} text={sentence} label={`Hear sentence: ${sentence}`} className="justify-start text-left text-sm" />
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <AudioSupportedAction audioText="Start training review" onClick={handleStart} disabled={started}>
            Start Review
          </AudioSupportedAction>
          <AudioSupportedAction audioText="Mark training complete" onClick={handleComplete} disabled={completed} variant="secondary">
            Mark Complete
          </AudioSupportedAction>
          <Button type="button" variant="quiet" onClick={handleReturnReady} disabled={!completed || returned}>
            Record Return
          </Button>
          <a
            href={recommendation.returnPath}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:bg-[var(--tenant-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
          >
            Back To Unit
          </a>
        </div>
      </Card>

      <TrainingEventLog events={events} recommendation={recommendation} />
    </div>
  );
}

function TrainingFocusSelector({
  options,
  selectedFocusType,
  onSelect,
}: {
  options: TrainingAcademyFocusConfig[];
  selectedFocusType: TrainingFocusType;
  onSelect: (focusType: TrainingFocusType) => void;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Recovery focus</p>
          <h3 className="text-lg font-bold">Choose a support lane</h3>
        </div>
        <StatusPill label={formatLabel(selectedFocusType)} tone="neutral" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = option.focusType === selectedFocusType;

          return (
            <button
              key={option.focusType}
              type="button"
              onClick={() => onSelect(option.focusType)}
              className={`rounded-lg border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
                selected
                  ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary-soft)] text-[var(--tenant-text)]"
                  : "border-[var(--tenant-border)] bg-[var(--tenant-surface)] text-[var(--tenant-text)] hover:bg-[var(--tenant-primary-soft)]"
              }`}
            >
              <span className="block text-sm font-bold">{option.label}</span>
              <span className="mt-1 block text-sm text-[var(--tenant-muted)]">{option.description}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function TrainingFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function TrainingEventLog({ events, recommendation }: { events: GameProgressEvent[]; recommendation: TrainingAcademyRecommendation }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher-visible recovery events</p>
          <h3 className="text-lg font-bold">Training Event Log</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">Training details are carried in metadata until dedicated shared event types are promoted.</p>
        </div>
        <StatusPill label={`${events.length} events`} tone={events.length > 1 ? "success" : "neutral"} />
      </div>
      <div className="mt-4 grid gap-3">
        {events.map((event, index) => {
          const trainingEventType = String(event.metadata?.trainingEventType ?? event.type);
          const eventFocusType = String(event.metadata?.focusType ?? recommendation.focusType);

          return (
            <div key={`${trainingEventType}-${index}`} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <p className="text-sm font-semibold">{formatLabel(trainingEventType)}</p>
              <p className="mt-1 font-mono text-xs text-[var(--tenant-muted)]">shared type: {event.type}</p>
              <p className="mt-1 text-sm text-[var(--tenant-muted)]">{formatMode(event.gameMode)} | {formatLabel(eventFocusType)}</p>
              <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{formatMetadata(event.metadata)}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function getTargetItemKind(item: string, recommendation: TrainingAcademyRecommendation): string {
  return recommendation.targetSentences.includes(item) ? "sentence" : "term";
}

function formatMetadata(metadata?: GameProgressEvent["metadata"]): string {
  if (!metadata) {
    return "no metadata";
  }

  return Object.entries(metadata)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("; ");
}
