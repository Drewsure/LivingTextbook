import { Card, StatusPill } from "@living-textbook/ui";
import { validateUnitPayload } from "@living-textbook/content-model";
import type { UnitPayload } from "@living-textbook/content-model";
import { sampleLaunchSession } from "@/data/sampleLaunchSession";
import type { TenantConfig } from "@/features/tenant/types";
import { GameSequence } from "@/features/game-shell/GameSequence";
import { ProgressionSummary } from "@/features/progression/ProgressionSummary";
import { TeacherLaunchPanel } from "@/features/teacher/TeacherLaunchPanel";

interface DashboardOverviewProps {
  tenant: TenantConfig;
  unit: UnitPayload;
}

export function DashboardOverview({ tenant, unit }: DashboardOverviewProps) {
  const validationErrors = validateUnitPayload(unit);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
      <section className="space-y-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Foundation slice</p>
              <h2 className="mt-1 text-2xl font-bold">
                Level {unit.unitMeta.level}, Unit {unit.unitMeta.unit}: {unit.unitMeta.theme}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
                Clean white-label structure for teacher QR launch, student flashcard entry, game progression, and Star Dust tracking.
              </p>
            </div>
            <StatusPill label={validationErrors.length === 0 ? "Payload valid" : "Needs review"} tone={validationErrors.length === 0 ? "success" : "warning"} />
          </div>
        </Card>
        <TeacherLaunchPanel unit={unit} launchSession={sampleLaunchSession} />
        <GameSequence unit={unit} />
      </section>
      <aside className="space-y-5">
        <ProgressionSummary tenant={tenant} unit={unit} />
      </aside>
    </div>
  );
}
