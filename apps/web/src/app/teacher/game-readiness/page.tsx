import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleActiveGameReplayChecklist } from "@/data/sampleActiveGameReplayChecklist";
import { samplePrototypeIntakeEvidencePacketFlow } from "@/data/sampleEvidencePacketFlows";
import { sampleGameModeSettingsBackendContractPlan } from "@/data/sampleGameModeSettingsBackendContract";
import { sampleGameModeSettingsProfilePlan } from "@/data/sampleGameModeSettingsProfiles";
import { sampleGameModeSettingsStorageReadinessPlan } from "@/data/sampleGameModeSettingsStorageReadiness";
import { sampleGamePrototypeAssignmentPlan } from "@/data/sampleGamePrototypeAssignmentPlan";
import { sampleParentEngineReadinessPlan } from "@/data/sampleParentEngineReadiness";
import { samplePrototypeIntakeAlert } from "@/data/samplePrototypeIntakeAlert";
import { samplePrototypeIntakeQueue } from "@/data/samplePrototypeIntakeQueue";
import { samplePrototypeIntakeReadinessSummary } from "@/data/samplePrototypeIntakeReadinessSummary";
import { samplePrototypeIntakeStorageGuards } from "@/data/samplePrototypeIntakeStorageGuard";
import { samplePrototypeReturnPackageChecklists } from "@/data/samplePrototypeReturnPackageChecklist";
import { sampleUnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import { ActiveGameReplayChecklistPanel } from "@/features/game-offers/ActiveGameReplayChecklistPanel";
import { GameModeSettingsBackendContractPanel } from "@/features/game-offers/GameModeSettingsBackendContractPanel";
import { GameModeSettingsProfilePanel } from "@/features/game-offers/GameModeSettingsProfilePanel";
import { GameModeSettingsStorageReadinessPanel } from "@/features/game-offers/GameModeSettingsStorageReadinessPanel";
import { GamePrototypeAssignmentPanel } from "@/features/game-offers/GamePrototypeAssignmentPanel";
import { ParentEngineReadinessPanel } from "@/features/game-offers/ParentEngineReadinessPanel";
import { PrototypeIntakeAlertPanel } from "@/features/game-offers/PrototypeIntakeAlertPanel";
import { PrototypeIntakeQueuePanel } from "@/features/game-offers/PrototypeIntakeQueuePanel";
import { PrototypeIntakeReadinessSummaryPanel } from "@/features/game-offers/PrototypeIntakeReadinessSummaryPanel";
import { PrototypeIntakeStorageGuardPanel } from "@/features/game-offers/PrototypeIntakeStorageGuardPanel";
import { PrototypeReturnPackageChecklistPanel } from "@/features/game-offers/PrototypeReturnPackageChecklistPanel";
import { UnitGameOfferMapPanel } from "@/features/game-offers/UnitGameOfferMapPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { EvidencePacketFlowPanel } from "@/features/evidence/EvidencePacketFlowPanel";

const sourceLinks = [
  { href: "/teacher/intake", label: "Foundation intake" },
  { href: "/activities/demo-unit-1", label: "Open MiniStar activity hub" },
  { href: "/activities/partner-demo-unit-1", label: "Open partner activity hub" },
  { href: "/teacher/prototypes/ministar", label: "Open MiniStar prototype review" },
  { href: "/teacher/prototypes/sample-publisher", label: "Open partner prototype review" },
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

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {sourceLinks.map((link) => (
              <ReadinessLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Codex keeps architecture, schema discipline, route replay, audio-first progression, and final integration review here.
              Z.ai prototype intake waits for the Codex integration gate and cannot promote legacy code into active app routes.
            </p>
          </section>
        </Card>

        <PrototypeIntakeAlertPanel alert={samplePrototypeIntakeAlert} />
        <PrototypeIntakeReadinessSummaryPanel summary={samplePrototypeIntakeReadinessSummary} />
        <PrototypeIntakeQueuePanel items={samplePrototypeIntakeQueue} />
        <PrototypeIntakeStorageGuardPanel guards={samplePrototypeIntakeStorageGuards} />
        <EvidencePacketFlowPanel flow={samplePrototypeIntakeEvidencePacketFlow} />
        <PrototypeReturnPackageChecklistPanel checklists={samplePrototypeReturnPackageChecklists} />

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
