import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleActiveGameReplayChecklist } from "@/data/sampleActiveGameReplayChecklist";
import { sampleGameModeSettingsBackendContractPlan } from "@/data/sampleGameModeSettingsBackendContract";
import { sampleGameModeSettingsProfilePlan } from "@/data/sampleGameModeSettingsProfiles";
import { sampleGameModeSettingsStorageReadinessPlan } from "@/data/sampleGameModeSettingsStorageReadiness";
import { sampleGamePrototypeAssignmentPlan } from "@/data/sampleGamePrototypeAssignmentPlan";
import { sampleParentEngineReadinessPlan } from "@/data/sampleParentEngineReadiness";
import { sampleUnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import { ActiveGameReplayChecklistPanel } from "@/features/game-offers/ActiveGameReplayChecklistPanel";
import { GameModeSettingsBackendContractPanel } from "@/features/game-offers/GameModeSettingsBackendContractPanel";
import { GameModeSettingsProfilePanel } from "@/features/game-offers/GameModeSettingsProfilePanel";
import { GameModeSettingsStorageReadinessPanel } from "@/features/game-offers/GameModeSettingsStorageReadinessPanel";
import { GamePrototypeAssignmentPanel } from "@/features/game-offers/GamePrototypeAssignmentPanel";
import { ParentEngineReadinessPanel } from "@/features/game-offers/ParentEngineReadinessPanel";
import { UnitGameOfferMapPanel } from "@/features/game-offers/UnitGameOfferMapPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

const sourceLinks = [
  { href: "/teacher/intake", label: "Return to foundation intake" },
  { href: "/activities/demo-unit-1", label: "Open MiniStar activity hub" },
  { href: "/activities/partner-demo-unit-1", label: "Open partner activity hub" },
];

export default function TeacherGameReadinessPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher game readiness workbench</p>
              <h2 className="mt-1 text-2xl font-bold">Game architecture, replay evidence, and outside prototype gates</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This focused workbench gathers the game-only foundation checks from teacher intake. It does not launch students,
                import outside prototypes, save settings, enable Phaser wrappers, approve Z.ai work, or publish any game.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="Review-only" tone="warning" />
              <StatusPill label="No live handoff" tone="neutral" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ReadinessLink href="/teacher/intake" label="Foundation intake" />
            <ReadinessLink href="/activities/demo-unit-1" label="MiniStar activity hub" />
            <ReadinessLink href="/activities/partner-demo-unit-1" label="Partner activity hub" />
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Codex keeps architecture, schema discipline, route replay, audio-first progression, and final integration review here.
              Z.ai prototype intake waits for the Codex integration gate and cannot promote legacy code into active app routes.
            </p>
          </section>
        </Card>

        <ParentEngineReadinessPanel plan={sampleParentEngineReadinessPlan} />
        <ActiveGameReplayChecklistPanel checklist={sampleActiveGameReplayChecklist} />
        <UnitGameOfferMapPanel map={sampleUnitGameOfferMap} />
        <GameModeSettingsProfilePanel plan={sampleGameModeSettingsProfilePlan} />
        <GameModeSettingsStorageReadinessPanel plan={sampleGameModeSettingsStorageReadinessPlan} />
        <GameModeSettingsBackendContractPanel plan={sampleGameModeSettingsBackendContractPlan} />
        <GamePrototypeAssignmentPanel plan={sampleGamePrototypeAssignmentPlan} />
      </div>
    </AppShell>
  );
}

function ReadinessLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
      href={href}
    >
      {label}
      <span className="mt-1 block break-words text-xs font-semibold text-[var(--tenant-muted)]">{href}</span>
    </a>
  );
}
