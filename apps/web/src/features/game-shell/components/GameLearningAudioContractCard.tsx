"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
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
  onAudioRequested: (event: GameProgressEvent) => void;
}

export function GameLearningAudioContractCard({
  tenant,
  unit,
  launchSession,
  progression,
  gameMode,
  audioCues,
  onAudioRequested,
}: GameLearningAudioContractCardProps) {
  const targetLanguage = unit.unitMeta.textbookReference?.language ?? tenant.languageSettings?.targetLanguage ?? "en";
  const targetLanguageCues = audioCues.filter((cue) => cue.language === targetLanguage);
  const termCueCount = targetLanguageCues.filter((cue) => cue.kind === "term").length;
  const sentenceCueCount = targetLanguageCues.filter((cue) => cue.kind === "sentence").length;
  const instructionCueCount = targetLanguageCues.filter((cue) => cue.kind === "instruction").length;
  const requiredTermCount = unit.pedagogicalPayload.vocabularyTerms.length;
  const requiredSentenceCount = unit.pedagogicalPayload.targetSentences.length;
  const summaryText = `Listen first. Answer in ${formatLanguageName(targetLanguage)} to make progress.`;

  function handleRuleAudioRequested() {
    onAudioRequested(
      createAudioRequestedEvent({
        progression,
        launchSession,
        gameMode,
        occurredAt: new Date().toISOString(),
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
        <StatusPill label="Audio required" tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <AudioCoverageFact label="Terms" value={`${termCueCount}/${requiredTermCount}`} />
        <AudioCoverageFact label="Sentences" value={`${sentenceCueCount}/${requiredSentenceCount}`} />
        <AudioCoverageFact label="Instructions" value={String(instructionCueCount)} />
        <AudioCoverageFact label="Progress rule" value="Target language only" />
      </div>

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
