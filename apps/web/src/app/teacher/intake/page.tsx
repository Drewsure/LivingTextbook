import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleBackendDecisionMatrix } from "@/data/sampleBackendDecisionMatrix";
import { sampleBackendMigrationPlan } from "@/data/sampleBackendMigrationCandidates";
import { sampleBackendSchemaDraft } from "@/data/sampleBackendSchemaDraft";
import {
  sampleClassRosterErrors,
  sampleClassRosterPlans,
  sampleClassRosterWarnings,
} from "@/data/sampleClassRosterPlans";
import { sampleContentIntakeRuns, samplePackageReleases } from "@/data/sampleContentIntakePlan";
import { sampleDeploymentProfiles } from "@/data/sampleDeploymentProfiles";
import { sampleEditionQrAliasPlan } from "@/data/sampleEditionQrAliasPlan";
import { sampleGamePrototypeAssignmentPlan } from "@/data/sampleGamePrototypeAssignmentPlan";
import { sampleLocalBundleManifests } from "@/data/sampleLocalBundlePlan";
import { samplePackageApprovalLedger } from "@/data/samplePackageApprovalLedger";
import { samplePackagePublishGate } from "@/data/samplePackagePublishGate";
import { samplePilotHandoffPackage } from "@/data/samplePilotHandoffPackage";
import {
  samplePersistenceAdapterErrors,
  samplePersistenceAdapterPlans,
  samplePersistenceAdapterWarnings,
} from "@/data/samplePersistenceAdapterPlan";
import {
  samplePilotPolicyErrors,
  samplePilotPolicyPlans,
  samplePilotPolicyWarnings,
} from "@/data/samplePilotPolicyPlan";
import { samplePublisherMaintenancePlan } from "@/data/samplePublisherMaintenancePlan";
import { sampleFrontDoorRouteRegistry } from "@/data/sampleTenantRouteRegistry";
import {
  sampleTeacherAssignmentErrors,
  sampleTeacherAssignmentPlans,
  sampleTeacherAssignmentWarnings,
} from "@/data/sampleTeacherAssignmentPlans";
import { sampleUnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import { sampleUnitPackageReadiness } from "@/data/sampleUnitPackageReadiness";
import { whiteLabelPilotReadiness } from "@/data/whiteLabelPilotReadiness";
import {
  sampleDurableRecordContracts,
  sampleDurableRecordErrors,
  sampleDurableRecordWarnings,
  samplePersistenceBoundaries,
  samplePersistenceStrategyOptions,
} from "@/data/samplePersistencePlan";
import { ContentIntakeReviewPanel } from "@/features/content-intake/ContentIntakeReviewPanel";
import { UnitPackageReadinessPanel } from "@/features/content-intake/UnitPackageReadinessPanel";
import { DeploymentProfilePanel } from "@/features/deployment/DeploymentProfilePanel";
import { LocalBundleManifestPanel } from "@/features/deployment/LocalBundleManifestPanel";
import { GamePrototypeAssignmentPanel } from "@/features/game-offers/GamePrototypeAssignmentPanel";
import { UnitGameOfferMapPanel } from "@/features/game-offers/UnitGameOfferMapPanel";
import { PilotPolicyReadinessPanel } from "@/features/policy/PilotPolicyReadinessPanel";
import { PackageApprovalLedgerPanel } from "@/features/pilot/PackageApprovalLedgerPanel";
import { PackagePublishGatePanel } from "@/features/pilot/PackagePublishGatePanel";
import { PilotHandoffPackagePanel } from "@/features/pilot/PilotHandoffPackagePanel";
import { PilotReadinessGatePanel } from "@/features/pilot/PilotReadinessGatePanel";
import { BackendDecisionMatrixPanel } from "@/features/persistence/BackendDecisionMatrixPanel";
import { BackendMigrationPlanPanel } from "@/features/persistence/BackendMigrationPlanPanel";
import { BackendSchemaDraftPanel } from "@/features/persistence/BackendSchemaDraftPanel";
import { PersistenceAdapterReadinessPanel } from "@/features/persistence/PersistenceAdapterReadinessPanel";
import { PersistenceBoundaryPanel } from "@/features/persistence/PersistenceBoundaryPanel";
import { PublisherMaintenancePlanPanel } from "@/features/publisher/PublisherMaintenancePlanPanel";
import { EditionQrAliasPanel } from "@/features/routes/EditionQrAliasPanel";
import { TenantRouteRegistryPanel } from "@/features/routes/TenantRouteRegistryPanel";
import { ClassRosterReadinessPanel } from "@/features/teacher/ClassRosterReadinessPanel";
import { TeacherAssignmentReadinessPanel } from "@/features/teacher/TeacherAssignmentReadinessPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default function TeacherIntakePage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher/admin review</p>
              <h2 className="mt-1 text-2xl font-bold">Content, routes, deployment, and persistence</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                This scaffold shows how a textbook or school partner moves from source files to a reviewed, audio-supported, route-ready Living Textbook package. It is intentionally review-first: no raw PDF or AI draft becomes student-facing automatically.
              </p>
            </div>
            <StatusPill label="Foundation scaffold" tone="success" />
          </div>
        </Card>
        <PilotReadinessGatePanel
          readiness={whiteLabelPilotReadiness}
          policyPlans={samplePilotPolicyPlans}
          persistencePlans={samplePersistenceAdapterPlans}
        />
        <PilotHandoffPackagePanel handoffPackage={samplePilotHandoffPackage} />
        <PackagePublishGatePanel gate={samplePackagePublishGate} />
        <PackageApprovalLedgerPanel ledger={samplePackageApprovalLedger} />
        <PublisherMaintenancePlanPanel plan={samplePublisherMaintenancePlan} />
        <UnitGameOfferMapPanel map={sampleUnitGameOfferMap} />
        <GamePrototypeAssignmentPanel plan={sampleGamePrototypeAssignmentPlan} />
        <UnitPackageReadinessPanel packages={sampleUnitPackageReadiness} />
        <TeacherAssignmentReadinessPanel
          plans={sampleTeacherAssignmentPlans}
          errors={sampleTeacherAssignmentErrors}
          warnings={sampleTeacherAssignmentWarnings}
        />
        <ClassRosterReadinessPanel
          plans={sampleClassRosterPlans}
          errors={sampleClassRosterErrors}
          warnings={sampleClassRosterWarnings}
        />
        <ContentIntakeReviewPanel runs={sampleContentIntakeRuns} releases={samplePackageReleases} />
        <TenantRouteRegistryPanel routes={sampleFrontDoorRouteRegistry} />
        <EditionQrAliasPanel plan={sampleEditionQrAliasPlan} />
        <DeploymentProfilePanel profiles={sampleDeploymentProfiles} />
        <LocalBundleManifestPanel manifests={sampleLocalBundleManifests} />
        <BackendDecisionMatrixPanel matrix={sampleBackendDecisionMatrix} />
        <BackendSchemaDraftPanel draft={sampleBackendSchemaDraft} />
        <BackendMigrationPlanPanel plan={sampleBackendMigrationPlan} />
        <PersistenceBoundaryPanel
          boundaries={samplePersistenceBoundaries}
          strategyOptions={samplePersistenceStrategyOptions}
          durableRecords={sampleDurableRecordContracts}
          durableRecordErrors={sampleDurableRecordErrors}
          durableRecordWarnings={sampleDurableRecordWarnings}
        />
        <PilotPolicyReadinessPanel
          plans={samplePilotPolicyPlans}
          errors={samplePilotPolicyErrors}
          warnings={samplePilotPolicyWarnings}
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
