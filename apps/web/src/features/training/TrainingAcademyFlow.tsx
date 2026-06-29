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
  createTrainingAcademyRecommendation,
  createTrainingProgressEvent,
  type TrainingAcademyEventName,
  type TrainingAcademyRecommendation,
} from "./trainingAcademyAdapter";

interface TrainingAcademyFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function TrainingAcademyFlow({ tenant, unit, launchSession, progression }: TrainingAcademyFlowProps) {
  const recommendation = useMemo(
    () => createTrainingAcademyRecommendation({ unit, launchSession }),
    [unit, launchSession],
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
        targetTermCount: recommendation.targetTerms.length,
      },
    }),
  ]);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [returned, setReturned] = useState(false);
  const [practicedTerms, setPracticedTerms] = useState<string[]>([]);

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

  function handleStart() {
    if (started) {
      return;
    }

    setStarted(true);
    appendTrainingEvent("training_started", {
      reason: recommendation.reason,
      targetTermCount: recommendation.targetTerms.length,
    });
  }

  function handleTermPractice(term: string, index: number) {
    playAudioCueText({ text: term });
    setStarted(true);
    setPracticedTerms((currentTerms) => Array.from(new Set([...currentTerms, term])));
    appendTrainingEvent("training_item_shown", {
      targetTerm: term,
      targetTermIndex: index + 1,
    });
  }

  function handleComplete() {
    if (completed) {
      return;
    }

    const practicedTermCount = practicedTerms.length || recommendation.targetTerms.length;
    const occurredAt = new Date().toISOString();
    const result = completeTrainingReview({
      progression: currentProgression,
      launchSession,
      recommendation,
      occurredAt,
      practicedTermCount,
    });

    setEvents((currentEvents) => [
      ...currentEvents,
      createTrainingProgressEvent({
        trainingEventType: "training_answer_submitted",
        progression: currentProgression,
        launchSession,
        recommendation,
        occurredAt,
        metadata: { practicedTermCount },
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
          <StatusPill label={completed ? "Practice complete" : started ? "Practice active" : "Recovery lane"} tone={completed ? "success" : "neutral"} />
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <TrainingFact label="Focus" value={formatLabel(recommendation.focusType)} />
          <TrainingFact label="Practice mode" value={formatMode(recommendation.recommendedGameMode)} />
          <TrainingFact label="Return path" value={recommendation.returnPath} />
        </dl>
      </Card>

      <UnitSessionProgressSummary
        launchSession={launchSession}
        progression={currentProgression}
        events={events}
        rewardName={tenant.rewardName}
        title="Training Recovery"
      />

      <TrainingRecoveryReportSummary
        events={events}
        rewardName={tenant.rewardName}
        title="Teacher Recovery Summary"
      />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Vocabulary review</p>
            <h3 className="text-lg font-bold">Tap each word to hear it</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
              <AudioCueText text="Listen, say the word, then tap the next word." label="Hear the training instruction" className="text-sm" />
            </p>
          </div>
          <StatusPill label={`${practicedTerms.length}/${recommendation.targetTerms.length} practiced`} tone={practicedTerms.length > 0 ? "success" : "neutral"} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {recommendation.targetTerms.map((term, index) => (
            <button
              key={term}
              type="button"
              onClick={() => handleTermPractice(term, index)}
              className="min-h-16 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-4 py-3 text-left text-lg font-bold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              {term}
              <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
                {practicedTerms.includes(term) ? "Heard" : "Tap to hear"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Target sentences</p>
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

function TrainingFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function TrainingEventLog({
  events,
  recommendation,
}: {
  events: GameProgressEvent[];
  recommendation: TrainingAcademyRecommendation;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher-visible recovery events</p>
          <h3 className="text-lg font-bold">Training Event Log</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            Training details are carried in metadata until dedicated shared event types are promoted.
          </p>
        </div>
        <StatusPill label={`${events.length} events`} tone={events.length > 1 ? "success" : "neutral"} />
      </div>
      <div className="mt-4 grid gap-3">
        {events.map((event, index) => {
          const trainingEventType = String(event.metadata?.trainingEventType ?? event.type);

          return (
            <div key={`${trainingEventType}-${index}`} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <p className="text-sm font-semibold">{formatLabel(trainingEventType)}</p>
              <p className="mt-1 font-mono text-xs text-[var(--tenant-muted)]">shared type: {event.type}</p>
              <p className="mt-1 text-sm text-[var(--tenant-muted)]">
                {formatMode(event.gameMode)} | {formatLabel(recommendation.focusType)}
              </p>
              <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">
                {formatMetadata(event.metadata)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function formatMetadata(metadata?: GameProgressEvent["metadata"]): string {
  if (!metadata) {
    return "no metadata";
  }

  return Object.entries(metadata)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("; ");
}
