import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId } from "@living-textbook/content-model";
import { formatMode } from "../studentLabels";

interface NextGameUnlockCardProps {
  nextMode?: GameModeId;
  unlocked: boolean;
}

export function NextGameUnlockCard({ nextMode, unlocked }: NextGameUnlockCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Next Game</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            {nextMode ? formatMode(nextMode) : "No next game assigned yet"}
          </p>
        </div>
        <StatusPill label={unlocked ? "Unlocked" : "Locked"} tone={unlocked ? "success" : "warning"} />
      </div>
      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-sm font-semibold">
          {unlocked ? "Ready for the next activity" : "Waiting for entry practice"}
        </p>
        <p className="mt-1 text-sm text-[var(--tenant-muted)]">
          {unlocked
            ? "The student can continue from flashcards into the next recommended game."
            : "The next game unlocks after flashcard practice is completed."}
        </p>
      </div>
    </Card>
  );
}
