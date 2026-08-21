import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleBackendDecisionMatrix } from "@/data/sampleBackendDecisionMatrix";
import { sampleBackendMigrationPlan } from "@/data/sampleBackendMigrationCandidates";
import { sampleBackendMigrationSpecPlan } from "@/data/sampleBackendMigrationSpecs";
import { sampleBackendSchemaDraft } from "@/data/sampleBackendSchemaDraft";
import {
  samplePersistenceAdapterErrors,
  samplePersistenceAdapterPlans,
  samplePersistenceAdapterWarnings,
} from "@/data/samplePersistenceAdapterPlan";
import {
  sampleDurableRecordContracts,
  sampleDurableRecordErrors,
  sampleDurableRecordWarnings,
  samplePersistenceBoundaries,
  samplePersistenceStrategyOptions,
} from "@/data/samplePersistencePlan";
import { samplePilotBackendSelectionGate } from "@/data/samplePilotBackendSelectionGate";
import { BackendDecisionMatrixPanel } from "@/features/persistence/BackendDecisionMatrixPanel";
import { BackendMigrationPlanPanel } from "@/features/persistence/BackendMigrationPlanPanel";
import { BackendMigrationSpecPanel } from "@/features/persistence/BackendMigrationSpecPanel";
import { BackendSchemaDraftPanel } from "@/features/persistence/BackendSchemaDraftPanel";
import { PersistenceAdapterReadinessPanel } from "@/features/persistence/PersistenceAdapterReadinessPanel";
import { PersistenceBoundaryPanel } from "@/features/persistence/PersistenceBoundaryPanel";
import { PilotBackendSelectionGatePanel } from "@/features/persistence/PilotBackendSelectionGatePanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

const persistenceLinks = [
  { href: "/teacher/intake", label: "Foundation intake" },
  { href: "/teacher/game-readiness", label: "Game readiness" },
  { href: "/teacher/release-control/sample-publisher", label: "Release control" },
  { href: "/local/sample-publisher", label: "Local companion preview" },
];

export default function TeacherPersistencePage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Persistence readiness workbench</p>
              <h2 className="mt-1 text-2xl font-bold">Backend and local storage without vendor lock-in</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This focused workbench gathers the storage decision, schema, migration, boundary, and adapter-readiness
                materials from teacher intake. It exists to keep hosted, hybrid, and closed-local white-label deployments
                practical before any real uploads, reports, classroom launch, or prototype integration writes are enabled.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="Review-only" tone="warning" />
              <StatusPill label="No backend vendor selection" tone="warning" />
              <StatusPill label="No live storage writes" tone="warning" />
              <StatusPill label="Cost control" tone="success" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {persistenceLinks.map((link) => (
              <PersistenceLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Persistence must preserve hosted/local parity, target-language-only progress, no raw microphone audio,
              no transcript storage in the core tier, export/retention policy, release-control rollback, and school
              approval before student data, report export, upload storage, or package writer work becomes live.
            </p>
          </section>
        </Card>

        <BackendDecisionMatrixPanel matrix={sampleBackendDecisionMatrix} />
        <PilotBackendSelectionGatePanel gate={samplePilotBackendSelectionGate} />
        <BackendSchemaDraftPanel draft={sampleBackendSchemaDraft} />
        <BackendMigrationPlanPanel plan={sampleBackendMigrationPlan} />
        <BackendMigrationSpecPanel plan={sampleBackendMigrationSpecPlan} />
        <PersistenceBoundaryPanel
          boundaries={samplePersistenceBoundaries}
          strategyOptions={samplePersistenceStrategyOptions}
          durableRecords={sampleDurableRecordContracts}
          durableRecordErrors={sampleDurableRecordErrors}
          durableRecordWarnings={sampleDurableRecordWarnings}
        />
        <PersistenceAdapterReadinessPanel
          plans={samplePersistenceAdapterPlans}
          errors={samplePersistenceAdapterErrors}
          warnings={samplePersistenceAdapterWarnings}
        />
      </div>
    </AppShell>
  );
}

function PersistenceLink({ href, label }: { href: string; label: string }) {
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
