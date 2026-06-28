import { Button, Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId } from "@living-textbook/content-model";
import { formatMode } from "../studentLabels";

interface NextGameUnlockCardProps {
  nextMode?: GameModeId;
  unlocked: boolean;
  started: boolean;
  onStart: () => void;
}

export function NextGameUnlockCard({ nextMode, unlocked, started, onStart }: NextGameUnlockCardProps) {
  const modeLabel = nextMode ? formatMode(nextMode) : "next game";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Next Game</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            {nextMode ? modeLabel : "No next game assigned yet"}
          </p>
        </div>
        <StatusPill label={started ? "Started" : unlocked ? "Unlocked" : "Locked"} tone={unlocked ? "success" : "warning"} />
      </div>
      <div className="mt-4 grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">
            {started ? `${modeLabel} shell started` : unlocked ? "Ready for the next activity" : "Waiting for entry practice"}
          </p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            {started
              ? "This records the standard game_started event. Full gameplay comes after the engine contract is stable."
              : unlocked
                ? "The student can continue from flashcards into the next recommended game."
                : "The next game unlocks after flashcard practice is completed."}
          </p>
        </div>
        <Button onClick={onStart} disabled={!unlocked || started || !nextMode} variant={unlocked ? "primary" : "secondary"}>
          {started ? "Game started" : `Start ${modeLabel}`}
        </Button>
      </div>
    </Card>
  );
}
