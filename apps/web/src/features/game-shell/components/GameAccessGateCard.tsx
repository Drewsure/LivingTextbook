import { Card, StatusPill } from "@living-textbook/ui";
import type { LaunchSession } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { getFlashcardsPath, getStudentActivityHubPath } from "@/features/routes/routeContracts";
import { formatMode } from "@/lib/formatLabels";

interface GameAccessGateCardProps {
  gameMode: string;
  launchSession: LaunchSession;
  level: number;
  reason: "entry-practice" | "unsupported-level" | "audio-required";
  targetLanguage: string;
}

export function GameAccessGateCard({ gameMode, launchSession, level, reason, targetLanguage }: GameAccessGateCardProps) {
  const entryPath = getFlashcardsPath(launchSession.launchCode);
  const unsupportedLevel = reason === "unsupported-level";
  const audioRequired = reason === "audio-required";
  const destinationPath = unsupportedLevel || audioRequired ? getStudentActivityHubPath(launchSession.launchCode) : entryPath;
  const summary = unsupportedLevel
    ? `${formatMode(gameMode)} is not offered at curriculum level ${level}. Choose a reviewed activity for this level.`
    : audioRequired
      ? `${formatMode(gameMode)} is waiting for reviewed ${targetLanguage} learning audio. Choose another reviewed activity while the package is completed.`
    : `Complete ${formatMode(launchSession.entryMode)} before opening ${formatMode(gameMode)}.`;

  return (
    <Card data-game-access-gate={reason}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Curated learning path</p>
          <h3 className="mt-1 text-lg font-bold">
            {unsupportedLevel ? "This activity is not offered yet" : audioRequired ? "Audio review is required" : "This activity is locked"}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText text={summary} language={targetLanguage} label="Tap the access rule to hear it" className="text-sm" />
          </p>
        </div>
        <StatusPill
          label={unsupportedLevel ? `Level ${level} pathway` : audioRequired ? "Audio coverage needed" : "Complete entry practice first"}
          tone="warning"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={destinationPath}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-center text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          {unsupportedLevel || audioRequired ? "Return to activity hub" : `Open ${formatMode(launchSession.entryMode)}`}
        </a>
        <p className="text-sm text-[var(--tenant-muted)]">
          {unsupportedLevel
            ? "This route stays available for a later reviewed curriculum package."
            : audioRequired
              ? "Gameplay and scoring remain paused until the audio evidence is complete."
              : "Target-language practice unlocks the next activity."}
        </p>
      </div>
    </Card>
  );
}
