import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";
import { ProgressFact } from "./ProgressFact";
import { formatLabel, formatMode } from "../studentLabels";
import type { TenantConfig } from "@/features/tenant/types";

interface StudentProgressHeaderProps {
  tenant: TenantConfig;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  entryComplete: boolean;
  nextMode?: GameModeId;
}

export function StudentProgressHeader({
  tenant,
  launchSession,
  progression,
  entryComplete,
  nextMode,
}: StudentProgressHeaderProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            Launch code {launchSession.launchCode}
          </p>
          <h2 className="mt-1 text-2xl font-bold">{tenant.displayName} practice entry</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            Start with {formatMode(launchSession.entryMode)}, then open {nextMode ? formatMode(nextMode) : "the next game"}.
          </p>
        </div>
        <StatusPill label={entryComplete ? "Practice complete" : "QR ready"} tone={entryComplete ? "success" : "neutral"} />
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <ProgressFact label="Current step" value={formatLabel(progression.currentStep)} />
        <ProgressFact label="Unlocked games" value={String(progression.unlockedGameModes.length)} />
        <ProgressFact label={tenant.rewardName} value={String(progression.earnedStarDust)} />
      </dl>
    </Card>
  );
}
