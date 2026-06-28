import { Button, Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId, LaunchSession, StudentProgressionState, UnitPayload } from "@living-textbook/content-model";
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
  onComplete,
}: FlashcardPracticeCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Flashcard Practice</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            Practice all {unit.pedagogicalPayload.vocabularyTerms.length} words to open the next game.
          </p>
        </div>
        <StatusPill label={formatLabel(progression.masteryStatus)} tone={entryComplete ? "success" : "neutral"} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {unit.pedagogicalPayload.vocabularyTerms.map((term) => (
          <div
            key={term}
            className="flex min-h-20 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-center text-lg font-bold"
          >
            {term}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 rounded-lg border border-[var(--tenant-border)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">Entry practice</p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            {entryComplete
              ? `${formatMode(launchSession.entryMode)} is complete. ${nextMode ? `${formatMode(nextMode)} is ready.` : "The next activity is ready."}`
              : "Finish this starter practice to open the next activity."}
          </p>
          {lastEarnedDust > 0 && (
            <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">
              +{lastEarnedDust} {tenant.rewardName}
            </p>
          )}
        </div>
        <Button onClick={onComplete} disabled={entryComplete}>
          {entryComplete ? "Practice complete" : "Mark practice complete"}
        </Button>
      </div>
    </Card>
  );
}
