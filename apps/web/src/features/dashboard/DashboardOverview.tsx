import { Card, StatusPill } from "@living-textbook/ui";
import { validateUnitPayload } from "@living-textbook/content-model";
import type { UnitPayload } from "@living-textbook/content-model";
import {
  sampleFrontDoorPath,
  sampleMultimediaContentPackage,
  samplePackageValidationErrors,
  samplePermanentQrPath,
  sampleTeacherProgressSummaryConcept,
} from "@/data/sampleMultimediaPackage";
import { sampleLaunchSession } from "@/data/sampleLaunchSession";
import type { TenantConfig } from "@/features/tenant/types";
import { GameSequence } from "@/features/game-shell/GameSequence";
import { MultimediaPackagePanel } from "@/features/multimedia/MultimediaPackagePanel";
import { ProgressionSummary } from "@/features/progression/ProgressionSummary";
import { TeacherLaunchPanel } from "@/features/teacher/TeacherLaunchPanel";
import { TeacherProgressSummaryConcept } from "@/features/teacher/TeacherProgressSummaryConcept";
import { getAiTutorAvailability } from "@/features/tenant/tenantEntitlements";

interface DashboardOverviewProps {
  tenant: TenantConfig;
  unit: UnitPayload;
}

export function DashboardOverview({ tenant, unit }: DashboardOverviewProps) {
  const validationErrors = validateUnitPayload(unit);
  const aiTutorAvailability = getAiTutorAvailability({ tenant, level: unit.unitMeta.level, mode: "fix-my-sentence" });

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
                Clean white-label structure for teacher QR launch, student flashcard entry, game progression, multimedia packaging, and Star Dust tracking.
              </p>
            </div>
            <StatusPill label={validationErrors.length === 0 ? "Payload valid" : "Needs review"} tone={validationErrors.length === 0 ? "success" : "warning"} />
          </div>
        </Card>
        <TeacherLaunchPanel unit={unit} launchSession={sampleLaunchSession} />
        <MultimediaPackagePanel
          contentPackage={sampleMultimediaContentPackage}
          permanentQrPath={samplePermanentQrPath}
          frontDoorPath={sampleFrontDoorPath}
          validationErrors={samplePackageValidationErrors}
        />
        <GameSequence unit={unit} />
      </section>
      <aside className="space-y-5">
        <ProgressionSummary tenant={tenant} unit={unit} />
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package entitlement</p>
              <h2 className="mt-1 text-lg font-bold">AI Tutor</h2>
            </div>
            <StatusPill label={aiTutorAvailability.available ? "Premium on" : "Premium off"} tone={aiTutorAvailability.available ? "success" : "warning"} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{aiTutorAvailability.reason}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
            QR launch, audio flashcards, games, multimedia, rewards, and teacher reporting remain part of the core package.
          </p>
        </Card>
        <TeacherProgressSummaryConcept summary={sampleTeacherProgressSummaryConcept} />
      </aside>
    </div>
  );
}
