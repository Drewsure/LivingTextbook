import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleBackendDecisionMatrix } from "@/data/sampleBackendDecisionMatrix";
import { sampleBackendMigrationPlan } from "@/data/sampleBackendMigrationCandidates";
import { sampleBackendMigrationSpecPlan } from "@/data/sampleBackendMigrationSpecs";
import { sampleBackendSchemaDraft } from "@/data/sampleBackendSchemaDraft";
import { sampleEvidenceStorageAdapterSelectionGate } from "@/data/sampleEvidenceStorageAdapterSelectionGate";
import {
  samplePersistenceAdapterErrors,
  samplePersistenceAdapterPlans,
  samplePersistenceAdapterWarnings,
} from "@/data/samplePersistenceAdapterPlan";
import { samplePersistenceContractAlignmentErrors } from "@/data/samplePersistenceContractAlignment";
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
import { BackendContractAlignmentPanel } from "@/features/persistence/BackendContractAlignmentPanel";
import { sampleBackendContractAlignmentErrors } from "@/data/sampleBackendContractAlignment";
import { BackendSchemaDraftPanel } from "@/features/persistence/BackendSchemaDraftPanel";
import { EvidenceStorageAdapterSelectionGatePanel } from "@/features/evidence/EvidenceStorageAdapterSelectionGatePanel";
import { PersistenceAdapterReadinessPanel } from "@/features/persistence/PersistenceAdapterReadinessPanel";
import { PersistenceBoundaryPanel } from "@/features/persistence/PersistenceBoundaryPanel";
import { HostedProgressionAdapterPanel } from "@/features/persistence/HostedProgressionAdapterPanel";
import { PersistenceOperationsStatusPanel } from "@/features/persistence/PersistenceOperationsStatusPanel";
import { PersistenceOperationsEvidencePanel } from "@/features/persistence/PersistenceOperationsEvidencePanel";
import { TeacherOperationsAccessPanel } from "@/features/persistence/TeacherOperationsAccessPanel";
import { PilotBackendSelectionGatePanel } from "@/features/persistence/PilotBackendSelectionGatePanel";
import { PersistenceHandoffPacketPanel } from "@/features/persistence/PersistenceHandoffPacketPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { samplePersistenceHandoffPacket, samplePersistenceHandoffPacketErrors } from "@/data/samplePersistenceHandoffPacket";
import {
  samplePackageReadinessPersistenceErrors,
  samplePackageReadinessPersistenceIntents,
} from "@/data/samplePackageReadinessPersistence";
import { PackageReadinessPersistencePanel } from "@/features/persistence/PackageReadinessPersistencePanel";
import { sampleLocalBundleProviderApproval, sampleLocalBundleProviderApprovalErrors } from "@/data/sampleLocalBundleProviderApproval";
import { LocalBundleProviderApprovalPanel } from "@/features/persistence/LocalBundleProviderApprovalPanel";
import { sampleLocalBundleRecoveryPacket, sampleLocalBundleRecoveryPacketErrors } from "@/data/sampleLocalBundleRecoveryPacket";
import { LocalBundleRecoveryPacketPanel } from "@/features/persistence/LocalBundleRecoveryPacketPanel";
import { sampleLocalBundleRecoveryReconciliation } from "@/data/sampleLocalBundleRecoveryReconciliation";
import { LocalBundleRecoveryReconciliationPanel } from "@/features/persistence/LocalBundleRecoveryReconciliationPanel";
import { sampleLocalBundleExportRetentionDryRun, sampleLocalBundleExportRetentionDryRunErrors } from "@/data/sampleLocalBundleExportRetentionDryRun";
import { LocalBundleExportRetentionDryRunPanel } from "@/features/persistence/LocalBundleExportRetentionDryRunPanel";
import { sampleLocalBundlePackageManifestRollbackDryRun, sampleLocalBundlePackageManifestRollbackDryRunErrors } from "@/data/sampleLocalBundlePackageManifestRollbackDryRun";
import { LocalBundlePackageManifestRollbackDryRunPanel } from "@/features/persistence/LocalBundlePackageManifestRollbackDryRunPanel";
import { sampleLocalBundleMediaEvidenceBinding, sampleLocalBundleMediaEvidenceBindingErrors } from "@/data/sampleLocalBundleMediaEvidenceBinding";
import { LocalBundleMediaEvidenceBindingPanel } from "@/features/persistence/LocalBundleMediaEvidenceBindingPanel";
import { sampleLocalBundleMediaManifestReconciliation } from "@/data/sampleLocalBundleMediaManifestReconciliation";
import { LocalBundleMediaManifestReconciliationPanel } from "@/features/persistence/LocalBundleMediaManifestReconciliationPanel";
import { resolveSampleTeacherSessionMonitorContext } from "@/data/sampleTeacherSessionMonitor";
import { resolveSampleTeacherReportSnapshotRecoveryRehearsal } from "@/data/sampleTeacherReportSnapshotRecoveryRehearsal";
import { TeacherReportSnapshotRecoveryRehearsalPanel } from "@/features/persistence/TeacherReportSnapshotRecoveryRehearsalPanel";
import { PersistenceActivationPreflightPanel } from "@/features/persistence/PersistenceActivationPreflightPanel";
import { samplePersistenceActivationPreflight } from "@/data/samplePersistenceActivationPreflight";
import { samplePilotReviewDecisionPersistenceErrors } from "@/data/samplePilotReviewDecisionPersistence";
import { samplePilotReviewDecisionSnapshots, samplePilotReviewDecisionSnapshotAdapterResults, samplePilotReviewDecisionSnapshotErrors } from "@/data/samplePilotReviewDecisionSnapshots";
import { PilotReviewDecisionPersistenceSnapshotPanel } from "@/features/persistence/PilotReviewDecisionPersistenceSnapshotPanel";
import { samplePilotReviewDecisionRetentionPolicy, samplePilotReviewDecisionRetentionPolicyErrors, samplePilotReviewDecisionRetentionPolicyWarnings } from "@/data/samplePilotReviewDecisionRetentionPolicy";
import { PilotReviewDecisionRetentionPolicyPanel } from "@/features/persistence/PilotReviewDecisionRetentionPolicyPanel";
import { samplePilotReviewDecisionImplementationReadiness, samplePilotReviewDecisionImplementationReadinessErrors } from "@/data/samplePilotReviewDecisionImplementationReadiness";
import { PilotReviewDecisionImplementationReadinessPanel } from "@/features/persistence/PilotReviewDecisionImplementationReadinessPanel";

const persistenceLinks = [
  { href: "/teacher/intake", label: "Foundation intake" },
  { href: "/teacher/game-readiness", label: "Game readiness" },
  { href: "/teacher/release-control/sample-publisher", label: "Release control" },
  { href: "/local/sample-publisher", label: "Local companion preview" },
];

export default function TeacherPersistencePage() {
  const reportSnapshotRecovery = resolveSampleTeacherReportSnapshotRecoveryRehearsal(
    resolveSampleTeacherSessionMonitorContext("partner-demo-unit-1"),
  );

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
        <PersistenceActivationPreflightPanel preflight={samplePersistenceActivationPreflight} />
        <PilotReviewDecisionPersistenceSnapshotPanel
          snapshots={samplePilotReviewDecisionSnapshots}
          adapterResults={samplePilotReviewDecisionSnapshotAdapterResults}
          errors={samplePilotReviewDecisionSnapshotErrors}
        />
        <PilotReviewDecisionRetentionPolicyPanel
          policy={samplePilotReviewDecisionRetentionPolicy}
          errors={samplePilotReviewDecisionRetentionPolicyErrors}
          warnings={samplePilotReviewDecisionRetentionPolicyWarnings}
        />
        <PilotReviewDecisionImplementationReadinessPanel
          readiness={samplePilotReviewDecisionImplementationReadiness}
          errors={samplePilotReviewDecisionImplementationReadinessErrors}
        />
        <PersistenceHandoffPacketPanel packet={samplePersistenceHandoffPacket} errors={samplePersistenceHandoffPacketErrors} />
        <TeacherReportSnapshotRecoveryRehearsalPanel rehearsal={reportSnapshotRecovery} />
        <LocalBundleProviderApprovalPanel
          packet={sampleLocalBundleProviderApproval}
          errors={sampleLocalBundleProviderApprovalErrors}
        />
        <LocalBundleRecoveryPacketPanel
          packet={sampleLocalBundleRecoveryPacket}
          errors={sampleLocalBundleRecoveryPacketErrors}
        />
        <LocalBundleRecoveryReconciliationPanel reconciliation={sampleLocalBundleRecoveryReconciliation} />
        <LocalBundleExportRetentionDryRunPanel
          dryRun={sampleLocalBundleExportRetentionDryRun}
          errors={sampleLocalBundleExportRetentionDryRunErrors}
        />
        <LocalBundlePackageManifestRollbackDryRunPanel
          dryRun={sampleLocalBundlePackageManifestRollbackDryRun}
          errors={sampleLocalBundlePackageManifestRollbackDryRunErrors}
        />
        <LocalBundleMediaEvidenceBindingPanel
          binding={sampleLocalBundleMediaEvidenceBinding}
          errors={sampleLocalBundleMediaEvidenceBindingErrors}
        />
        <LocalBundleMediaManifestReconciliationPanel
          reconciliation={sampleLocalBundleMediaManifestReconciliation}
        />
        <PackageReadinessPersistencePanel
          intents={samplePackageReadinessPersistenceIntents}
          errors={samplePackageReadinessPersistenceErrors}
        />
        <EvidenceStorageAdapterSelectionGatePanel gate={sampleEvidenceStorageAdapterSelectionGate} />
        <BackendSchemaDraftPanel draft={sampleBackendSchemaDraft} />
        <BackendMigrationPlanPanel plan={sampleBackendMigrationPlan} />
        <BackendMigrationSpecPanel plan={sampleBackendMigrationSpecPlan} />
        <BackendContractAlignmentPanel
          schema={sampleBackendSchemaDraft}
          migrationPlan={sampleBackendMigrationPlan}
          migrationSpecPlan={sampleBackendMigrationSpecPlan}
          errors={sampleBackendContractAlignmentErrors}
        />
        <HostedProgressionAdapterPanel
          request={{
            tenantId: samplePublisherTenant.id,
            packageId: "sample-publisher-l1-u1-routines-package",
            launchCode: "partner-demo-unit-1",
            studentSessionId: "partner-demo-unit-1:sample-student",
            accessMode: "teacher-review-probe",
          }}
        />
        <PersistenceOperationsStatusPanel tenantId={samplePublisherTenant.id} />
        <TeacherOperationsAccessPanel tenantId={samplePublisherTenant.id} />
        <PersistenceOperationsEvidencePanel tenantId={samplePublisherTenant.id} />
        <PersistenceBoundaryPanel
          boundaries={samplePersistenceBoundaries}
          strategyOptions={samplePersistenceStrategyOptions}
          durableRecords={sampleDurableRecordContracts}
          durableRecordErrors={sampleDurableRecordErrors}
          durableRecordWarnings={sampleDurableRecordWarnings}
        />
        <PersistenceAdapterReadinessPanel
          plans={samplePersistenceAdapterPlans}
          errors={[...samplePersistenceAdapterErrors, ...samplePersistenceContractAlignmentErrors, ...samplePilotReviewDecisionPersistenceErrors]}
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
