import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleContentIntakeRuns } from "@/data/sampleContentIntakePlan";
import { sampleDeploymentProfiles } from "@/data/sampleDeploymentProfiles";
import { sampleFrontDoorRouteRegistry } from "@/data/sampleTenantRouteRegistry";
import {
  sampleDurableRecordContracts,
  sampleDurableRecordErrors,
  sampleDurableRecordWarnings,
  samplePersistenceBoundaries,
  samplePersistenceStrategyOptions,
} from "@/data/samplePersistencePlan";
import { ContentIntakeReviewPanel } from "@/features/content-intake/ContentIntakeReviewPanel";
import { DeploymentProfilePanel } from "@/features/deployment/DeploymentProfilePanel";
import { PersistenceBoundaryPanel } from "@/features/persistence/PersistenceBoundaryPanel";
import { TenantRouteRegistryPanel } from "@/features/routes/TenantRouteRegistryPanel";
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
        <ContentIntakeReviewPanel runs={sampleContentIntakeRuns} />
        <TenantRouteRegistryPanel routes={sampleFrontDoorRouteRegistry} />
        <DeploymentProfilePanel profiles={sampleDeploymentProfiles} />
        <PersistenceBoundaryPanel
          boundaries={samplePersistenceBoundaries}
          strategyOptions={samplePersistenceStrategyOptions}
          durableRecords={sampleDurableRecordContracts}
          durableRecordErrors={sampleDurableRecordErrors}
          durableRecordWarnings={sampleDurableRecordWarnings}
        />
      </div>
    </AppShell>
  );
}
