"use client";

import { useState } from "react";
import type {
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { completeFlashcardEntryPractice } from "@/features/progression/localProgressionAdapter";
import { FlashcardPracticeCard } from "./components/FlashcardPracticeCard";
import { NextGameUnlockCard } from "./components/NextGameUnlockCard";
import { SessionEventLog } from "./components/SessionEventLog";
import { StudentProgressHeader } from "./components/StudentProgressHeader";
import type { TenantConfig } from "@/features/tenant/types";

interface StudentLaunchFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function StudentLaunchFlow({ tenant, unit, launchSession, progression }: StudentLaunchFlowProps) {
  const [currentProgression, setCurrentProgression] = useState(progression);
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);

  const entryComplete = currentProgression.completedGameModes.includes(launchSession.entryMode);
  const nextMode = launchSession.recommendedNextModes[0];
  const nextModeUnlocked = launchSession.recommendedNextModes.some((mode) =>
    currentProgression.unlockedGameModes.includes(mode),
  );

  function handleCompleteEntryPractice() {
    const result = completeFlashcardEntryPractice({
      progression: currentProgression,
      launchSession,
      unit,
      occurredAt: new Date().toISOString(),
    });

    setCurrentProgression(result.progression);
    setSessionEvents((events) => [...events, ...result.events]);
    setLastEarnedDust(result.dust.total);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <StudentProgressHeader
        tenant={tenant}
        launchSession={launchSession}
        progression={currentProgression}
        entryComplete={entryComplete}
        nextMode={nextMode}
      />
      <FlashcardPracticeCard
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={currentProgression}
        entryComplete={entryComplete}
        lastEarnedDust={lastEarnedDust}
        nextMode={nextMode}
        onComplete={handleCompleteEntryPractice}
      />
      <NextGameUnlockCard nextMode={nextMode} unlocked={nextModeUnlocked} />
      <SessionEventLog events={sessionEvents} />
    </div>
  );
}
