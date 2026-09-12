import { Card, StatusPill } from "@living-textbook/ui";
import type { LaunchSession } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { getFlashcardsPath } from "@/features/routes/routeContracts";
import { formatMode } from "@/lib/formatLabels";

interface GameAccessGateCardProps {
  gameMode: string;
  launchSession: LaunchSession;
}

export function GameAccessGateCard({ gameMode, launchSession }: GameAccessGateCardProps) {
  const entryPath = getFlashcardsPath(launchSession.launchCode);
  const summary = `Complete ${formatMode(launchSession.entryMode)} before opening ${formatMode(gameMode)}.`;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Curated learning path</p>
          <h3 className="mt-1 text-lg font-bold">This activity is locked</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText text={summary} label="Tap the access rule to hear it" className="text-sm" />
          </p>
        </div>
        <StatusPill label="Complete entry practice first" tone="warning" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={entryPath}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-center text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open {formatMode(launchSession.entryMode)}
        </a>
        <p className="text-sm text-[var(--tenant-muted)]">Target-language practice unlocks the next activity.</p>
      </div>
    </Card>
  );
}
