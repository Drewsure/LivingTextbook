import { Card, StatusPill } from "@living-textbook/ui";
import type { GameProgressEvent } from "@living-textbook/content-model";
import { formatLabel, formatMode } from "@/lib/formatLabels";
import type { TrainingAcademyEventName } from "./trainingAcademyAdapter";

interface TrainingRecoveryReportSummaryProps {
  events: GameProgressEvent[];
  rewardName: string;
  title?: string;
}

export function TrainingRecoveryReportSummary({
  events,
  rewardName,
  title = "Recovery Report",
}: TrainingRecoveryReportSummaryProps) {
  const summary = summarizeTrainingRecoveryEvents(events);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher recovery summary</p>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            Recovery practice is reported through the same progress stream as games and media, with focused training details in metadata.
          </p>
        </div>
        <StatusPill label={`${summary.trainingEventCount} recovery events`} tone={summary.trainingEventCount > 1 ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="Recommended" value={String(summary.recommendedCount)} />
        <Metric label="Started" value={String(summary.startedCount)} />
        <Metric label="Items heard" value={String(summary.itemShownCount)} />
        <Metric label="Responses" value={String(summary.answerSubmittedCount)} />
        <Metric label="Results" value={String(summary.answerResultCount)} />
        <Metric label="Completed" value={String(summary.completedCount)} />
        <Metric label="Returned" value={String(summary.returnedCount)} />
        <Metric label={rewardName} value={String(summary.earnedRecoveryReward)} />
        <Metric label="Focus" value={summary.focusLabel} />
      </dl>

      <div className="mt-5 grid gap-3 text-sm text-[var(--tenant-muted)] sm:grid-cols-2">
        <ReportFact label="Recommended mode" value={summary.modeLabel} />
        <ReportFact label="Return path" value={summary.returnPathLabel} />
      </div>
    </Card>
  );
}

export interface TrainingRecoveryEventSummary {
  trainingEventCount: number;
  recommendedCount: number;
  startedCount: number;
  itemShownCount: number;
  answerSubmittedCount: number;
  answerResultCount: number;
  completedCount: number;
  returnedCount: number;
  earnedRecoveryReward: number;
  focusLabel: string;
  modeLabel: string;
  returnPathLabel: string;
}

export function summarizeTrainingRecoveryEvents(events: GameProgressEvent[]): TrainingRecoveryEventSummary {
  const trainingEvents = events.filter((event) => getTrainingEventType(event) !== undefined);

  return {
    trainingEventCount: trainingEvents.length,
    recommendedCount: countTrainingEvents(trainingEvents, "training_recommended"),
    startedCount: countTrainingEvents(trainingEvents, "training_started"),
    itemShownCount: countTrainingEvents(trainingEvents, "training_item_shown"),
    answerSubmittedCount: countTrainingEvents(trainingEvents, "training_answer_submitted"),
    answerResultCount: countTrainingEvents(trainingEvents, "training_answer_result"),
    completedCount: countTrainingEvents(trainingEvents, "training_completed"),
    returnedCount: countTrainingEvents(trainingEvents, "training_returned_to_unit"),
    earnedRecoveryReward: trainingEvents.reduce((total, event) => total + getNumberMetadata(event, "earnedStarDust"), 0),
    focusLabel: getLatestLabel(trainingEvents, "focusType"),
    modeLabel: getLatestModeLabel(trainingEvents),
    returnPathLabel: getLatestStringMetadata(trainingEvents, "returnPath") ?? "Not recorded yet",
  };
}

export function getTrainingEventType(event: GameProgressEvent): TrainingAcademyEventName | undefined {
  const value = event.metadata?.trainingEventType;

  if (typeof value !== "string") {
    return undefined;
  }

  if (
    value === "training_recommended" ||
    value === "training_started" ||
    value === "training_item_shown" ||
    value === "training_answer_submitted" ||
    value === "training_answer_result" ||
    value === "training_completed" ||
    value === "training_returned_to_unit"
  ) {
    return value;
  }

  return undefined;
}

function countTrainingEvents(events: GameProgressEvent[], type: TrainingAcademyEventName): number {
  return events.filter((event) => getTrainingEventType(event) === type).length;
}

function getNumberMetadata(event: GameProgressEvent, key: string): number {
  const value = event.metadata?.[key];

  if (typeof value === "number") {
    return value;
  }

  return 0;
}

function getLatestLabel(events: GameProgressEvent[], key: string): string {
  const value = getLatestStringMetadata(events, key);

  if (!value) {
    return "Not recorded yet";
  }

  return formatLabel(value);
}

function getLatestModeLabel(events: GameProgressEvent[]): string {
  const latestMode = getLatestStringMetadata(events, "recommendedGameMode");

  if (latestMode) {
    return formatMode(latestMode);
  }

  const latestEvent = [...events].reverse().find((event) => event.gameMode);

  if (!latestEvent) {
    return "Not recorded yet";
  }

  return formatMode(latestEvent.gameMode);
}

function getLatestStringMetadata(events: GameProgressEvent[], key: string): string | undefined {
  for (const event of [...events].reverse()) {
    const value = event.metadata?.[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function ReportFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}
