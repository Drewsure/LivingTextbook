import { Button, Card, StatusPill } from "@living-textbook/ui";
import type { LaunchSession, StudentProgressionState, UnitPayload } from "@living-textbook/content-model";
import type { TenantConfig } from "@/features/tenant/types";

interface StudentLaunchFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function StudentLaunchFlow({ tenant, unit, launchSession, progression }: StudentLaunchFlowProps) {
  const nextModes = launchSession.recommendedNextModes.join(", ");

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">
              Launch code {launchSession.launchCode}
            </p>
            <h2 className="mt-1 text-2xl font-bold">{tenant.displayName} practice entry</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              Start with {launchSession.entryMode}, then unlock {nextModes || "the next recommended game"}.
            </p>
          </div>
          <StatusPill label="QR ready" tone="success" />
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <ProgressFact label="Current step" value={progression.currentStep} />
          <ProgressFact label="Unlocked modes" value={String(progression.unlockedGameModes.length)} />
          <ProgressFact label={tenant.rewardName} value={String(progression.earnedStarDust)} />
        </dl>
      </Card>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Flashcard Practice</h3>
            <p className="mt-1 text-sm text-[var(--tenant-muted)]">
              Entry practice must be completed before the next game unlocks.
            </p>
          </div>
          <StatusPill label={progression.masteryStatus} />
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
            <p className="text-sm font-semibold">Unlock rule</p>
            <p className="mt-1 text-sm text-[var(--tenant-muted)]">
              Completing flashcards emits `entry_practice_completed` and unlocks the recommended next mode.
            </p>
          </div>
          <Button>Mark practice complete</Button>
        </div>
      </Card>
    </div>
  );
}

function ProgressFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  );
}
