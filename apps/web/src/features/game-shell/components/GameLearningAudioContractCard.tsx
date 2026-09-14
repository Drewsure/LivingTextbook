"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameAudioCoverage,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { getGameAudioCoverage, resolveTargetLanguage } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { formatLanguageName } from "@/features/language/languageLabels";
import { createAudioRequestedEvent } from "@/features/progression/localProgressionAdapter";
import type { TenantConfig } from "@/features/tenant/types";

interface GameLearningAudioContractCardProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  gameMode: GameModeId;
  audioCues: AudioCue[];
  replaySeed: string;
  onAudioRequested: (event: GameProgressEvent) => void;
  coverage?: GameAudioCoverage;
}

export function GameLearningAudioContractCard({
  tenant,
  unit,
  launchSession,
  progression,
  gameMode,
  audioCues,
  replaySeed,
  onAudioRequested,
  coverage,
}: GameLearningAudioContractCardProps) {
  const targetLanguage = resolveTargetLanguage({
    tenantTargetLanguage: tenant.languageSettings?.targetLanguage,
    unitLanguage: unit.unitMeta.textbookReference?.language,
  });
  const resolvedCoverage = coverage ?? getGameAudioCoverage({ unit, audioCues, gameMode, targetLanguage });
  const summaryText = `Listen first. Answer in ${formatLanguageName(targetLanguage)} to make progress.`;

  function handleRuleAudioRequested() {
    onAudioRequested(
      createAudioRequestedEvent({
        progression,
        launchSession,
        gameMode,
        occurredAt: new Date().toISOString(),
        replaySeed,
        cueKind: "instruction",
        cueText: summaryText,
        language: targetLanguage,
        source: "game-learning-audio-contract",
      }),
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Audio foundation</p>
          <h3 className="text-lg font-bold">Learning audio contract</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText
              text={summaryText}
              language={targetLanguage}
              label="Tap the game audio rule to hear it"
              className="text-sm"
              onPlay={handleRuleAudioRequested}
            />
          </p>
        </div>
        <StatusPill label={resolvedCoverage.ready ? "Audio ready" : "Audio review needed"} tone={resolvedCoverage.ready ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <AudioCoverageFact label="Terms" value={`${resolvedCoverage.coveredTermCount}/${resolvedCoverage.requiredTermCount}`} />
        <AudioCoverageFact label="Sentences" value={`${resolvedCoverage.coveredSentenceCount}/${resolvedCoverage.requiredSentenceCount}`} />
        <AudioCoverageFact label="Instructions" value={String(resolvedCoverage.instructionCueCount)} />
        <AudioCoverageFact label="Progress rule" value="Target language only" />
      </div>

      {!resolvedCoverage.ready ? (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
          <p className="font-semibold">This activity is paused until reviewed learning audio is ready.</p>
          {resolvedCoverage.missingTerms.length > 0 ? <p className="mt-1">Missing term audio: {resolvedCoverage.missingTerms.join(", ")}.</p> : null}
          {resolvedCoverage.missingSentences.length > 0 ? <p className="mt-1">Missing sentence audio: {resolvedCoverage.missingSentences.join(" / ")}.</p> : null}
          {!resolvedCoverage.instructionReady ? <p className="mt-1">Missing target-language instructions for this activity.</p> : null}
        </div>
      ) : null}

      <ul className="mt-4 grid gap-2 text-sm text-[var(--tenant-muted)]">
        <li>Tap-to-speak is support evidence, not score authority.</li>
        <li>Support language cannot unlock games, mastery, or rewards.</li>
        <li>Background media must pause or duck for learning audio.</li>
      </ul>
    </Card>
  );
}

function AudioCoverageFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}
