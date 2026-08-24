import { notFound } from "next/navigation";
import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import {
  filterAiExternalPrototypeTaskPacketsByTenant,
  sampleAiExternalPrototypeTaskPackets,
} from "@/data/sampleAiExternalPrototypeTaskPacket";
import {
  filterAiExternalPrototypeTaskExportReadinessGatesByTenant,
  sampleAiExternalPrototypeTaskExportReadinessGates,
} from "@/data/sampleAiExternalPrototypeTaskExportReadinessGate";
import {
  filterAiGeneratedGameBuildBriefPacketsByTenant,
  sampleAiGeneratedGameBuildBriefPackets,
} from "@/data/sampleAiGeneratedGameBuildBrief";
import { samplePrototypeIntakeEvidencePacketFlow } from "@/data/sampleEvidencePacketFlows";
import {
  filterAiPrototypeAppPatchProposalsByTenant,
  sampleAiPrototypeAppPatchProposals,
} from "@/data/sampleAiPrototypeAppPatchProposal";
import {
  filterAiPrototypeAudioCoverageReportsByTenant,
  sampleAiPrototypeAudioCoverageReports,
} from "@/data/sampleAiPrototypeAudioCoverageReport";
import {
  filterAiPrototypeCodexIntegrationDecisionsByTenant,
  sampleAiPrototypeCodexIntegrationDecisions,
} from "@/data/sampleAiPrototypeCodexIntegrationDecision";
import {
  filterAiPrototypeCodexPatchApprovalDecisionsByTenant,
  sampleAiPrototypeCodexPatchApprovalDecisions,
} from "@/data/sampleAiPrototypeCodexPatchApprovalDecision";
import {
  filterAiPrototypeEventReplayReportsByTenant,
  sampleAiPrototypeEventReplayReports,
} from "@/data/sampleAiPrototypeEventReplayReport";
import {
  filterAiPrototypeFixtureReplayReportsByTenant,
  sampleAiPrototypeFixtureReplayReports,
} from "@/data/sampleAiPrototypeFixtureReplayReport";
import {
  filterAiPrototypeIntegrationPlansByTenant,
  sampleAiPrototypeIntegrationPlans,
} from "@/data/sampleAiPrototypeIntegrationPlan";
import {
  filterAiPrototypeIntegrationReadinessGatesByTenant,
  sampleAiPrototypeIntegrationReadinessGates,
} from "@/data/sampleAiPrototypeIntegrationReadinessGate";
import {
  filterAiPrototypeMobileAccessibilityReportsByTenant,
  sampleAiPrototypeMobileAccessibilityReports,
} from "@/data/sampleAiPrototypeMobileAccessibilityReport";
import {
  filterAiPrototypePatchAuthorizationReleaseLocksByTenant,
  sampleAiPrototypePatchAuthorizationReleaseLocks,
} from "@/data/sampleAiPrototypePatchAuthorizationReleaseLock";
import {
  filterAiPrototypePatchChangeSetPreviewsByTenant,
  sampleAiPrototypePatchChangeSetPreviews,
} from "@/data/sampleAiPrototypePatchChangeSetPreview";
import {
  filterAiPrototypePatchHarnessImplementationProposalsByTenant,
  sampleAiPrototypePatchHarnessImplementationProposals,
} from "@/data/sampleAiPrototypePatchHarnessImplementationProposal";
import {
  filterAiPrototypePatchImplementationWorkOrdersByTenant,
  sampleAiPrototypePatchImplementationWorkOrders,
} from "@/data/sampleAiPrototypePatchImplementationWorkOrder";
import {
  filterAiPrototypePatchTestHarnessPlansByTenant,
  sampleAiPrototypePatchTestHarnessPlans,
} from "@/data/sampleAiPrototypePatchTestHarnessPlan";
import {
  filterAiPrototypePatchTestReadinessGatesByTenant,
  sampleAiPrototypePatchTestReadinessGates,
} from "@/data/sampleAiPrototypePatchTestReadinessGate";
import {
  filterAiPrototypeReturnReviewPacketsByTenant,
  sampleAiPrototypeReturnReviewPackets,
} from "@/data/sampleAiPrototypeReturnReview";
import {
  filterAiPrototypeScoringReplayReportsByTenant,
  sampleAiPrototypeScoringReplayReports,
} from "@/data/sampleAiPrototypeScoringReplayReport";
import {
  filterAiPrototypeSignedApprovalPreflightsByTenant,
  sampleAiPrototypeSignedApprovalPreflights,
} from "@/data/sampleAiPrototypeSignedApprovalPreflight";
import {
  filterAiPrototypeWrapperAdapterReviewsByTenant,
  sampleAiPrototypeWrapperAdapterReviews,
} from "@/data/sampleAiPrototypeWrapperAdapterReview";
import {
  filterPrototypeIntakeQueueByTenant,
  samplePrototypeIntakeQueue,
} from "@/data/samplePrototypeIntakeQueue";
import { samplePrototypeIntakeReadinessSummary } from "@/data/samplePrototypeIntakeReadinessSummary";
import { samplePrototypeIntakeStorageGuards } from "@/data/samplePrototypeIntakeStorageGuard";
import { samplePrototypeReturnReadinessSummary } from "@/data/samplePrototypeReturnReadinessSummary";
import {
  filterPrototypeReturnPackageChecklistsByTenant,
  samplePrototypeReturnPackageChecklists,
} from "@/data/samplePrototypeReturnPackageChecklist";
import { AiExternalPrototypeTaskExportReadinessGatePanel } from "@/features/content-intake/AiExternalPrototypeTaskExportReadinessGatePanel";
import { AiExternalPrototypeTaskPacketPanel } from "@/features/content-intake/AiExternalPrototypeTaskPacketPanel";
import { AiGeneratedGameBuildBriefPanel } from "@/features/content-intake/AiGeneratedGameBuildBriefPanel";
import { AiGeneratorSectionHeader } from "@/features/content-intake/AiGeneratorSectionNav";
import { AiPrototypeAppPatchProposalPanel } from "@/features/content-intake/AiPrototypeAppPatchProposalPanel";
import { AiPrototypeAudioCoverageReportPanel } from "@/features/content-intake/AiPrototypeAudioCoverageReportPanel";
import { AiPrototypeCodexIntegrationDecisionPanel } from "@/features/content-intake/AiPrototypeCodexIntegrationDecisionPanel";
import { AiPrototypeCodexPatchApprovalDecisionPanel } from "@/features/content-intake/AiPrototypeCodexPatchApprovalDecisionPanel";
import { AiPrototypeEventReplayReportPanel } from "@/features/content-intake/AiPrototypeEventReplayReportPanel";
import { AiPrototypeFixtureReplayReportPanel } from "@/features/content-intake/AiPrototypeFixtureReplayReportPanel";
import { AiPrototypeIntegrationPlanPanel } from "@/features/content-intake/AiPrototypeIntegrationPlanPanel";
import { AiPrototypeIntegrationReadinessGatePanel } from "@/features/content-intake/AiPrototypeIntegrationReadinessGatePanel";
import { AiPrototypeMobileAccessibilityReportPanel } from "@/features/content-intake/AiPrototypeMobileAccessibilityReportPanel";
import { AiPrototypePatchAuthorizationReleaseLockPanel } from "@/features/content-intake/AiPrototypePatchAuthorizationReleaseLockPanel";
import { AiPrototypePatchChangeSetPreviewPanel } from "@/features/content-intake/AiPrototypePatchChangeSetPreviewPanel";
import { AiPrototypePatchHarnessImplementationProposalPanel } from "@/features/content-intake/AiPrototypePatchHarnessImplementationProposalPanel";
import { AiPrototypePatchImplementationWorkOrderPanel } from "@/features/content-intake/AiPrototypePatchImplementationWorkOrderPanel";
import { AiPrototypePatchTestHarnessPlanPanel } from "@/features/content-intake/AiPrototypePatchTestHarnessPlanPanel";
import { AiPrototypePatchTestReadinessGatePanel } from "@/features/content-intake/AiPrototypePatchTestReadinessGatePanel";
import { AiPrototypeReturnReviewPanel } from "@/features/content-intake/AiPrototypeReturnReviewPanel";
import { AiPrototypeScoringReplayReportPanel } from "@/features/content-intake/AiPrototypeScoringReplayReportPanel";
import { AiPrototypeSignedApprovalPreflightPanel } from "@/features/content-intake/AiPrototypeSignedApprovalPreflightPanel";
import { AiPrototypeWrapperAdapterReviewPanel } from "@/features/content-intake/AiPrototypeWrapperAdapterReviewPanel";
import { EvidencePacketFlowPanel } from "@/features/evidence/EvidencePacketFlowPanel";
import { PrototypeIntakeQueuePanel } from "@/features/game-offers/PrototypeIntakeQueuePanel";
import { PrototypeIntakeReadinessSummaryPanel } from "@/features/game-offers/PrototypeIntakeReadinessSummaryPanel";
import { PrototypeIntakeStorageGuardPanel } from "@/features/game-offers/PrototypeIntakeStorageGuardPanel";
import { PrototypeReturnReadinessSummaryPanel } from "@/features/game-offers/PrototypeReturnReadinessSummaryPanel";
import { PrototypeReturnPackageChecklistPanel } from "@/features/game-offers/PrototypeReturnPackageChecklistPanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherPrototypeReviewPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant =
    tenantId === samplePublisherTenant.id ? samplePublisherTenant : tenantId === ministarTenant.id ? ministarTenant : null;

  if (!tenant) {
    notFound();
  }

  const generatorRoute = `/teacher/generator/${tenantId}#prototype-review`;
  const gameReadinessRoute = "/teacher/game-readiness";

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Prototype handoff review workbench</p>
              <h2 className="mt-1 text-2xl font-bold">Z.ai and outside prototype evidence before integration</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This tenant-scoped workbench gathers prototype task packets, return evidence, wrapper review, replay reports,
                Codex decisions, and patch locks. It is a review room only: no live handoff, no app file writes, no Phaser wrapper
                enablement, no route creation, no scoring mutation, no audio manifest mutation, no package promotion, and no student
                assignment.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="Review-only" tone="warning" />
              <StatusPill label="No app file writes" tone="warning" />
              <StatusPill label="No scoring mutation" tone="warning" />
              <StatusPill label={tenant.id} tone="neutral" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PrototypeLink href={gameReadinessRoute} label="Open game readiness workbench" />
            <PrototypeLink href={generatorRoute} label="Open generator prototype section" />
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Z.ai prototype intake waits for the Codex integration gate. Returned work must prove parent-engine wrapping,
              reviewed fixture replay, standard event replay, target-language audio coverage, deterministic scoring, mobile
              accessibility, white-label configuration, and tenant language boundaries before any patch plan is considered.
            </p>
          </section>
        </Card>

        <PrototypeIntakeReadinessSummaryPanel summary={samplePrototypeIntakeReadinessSummary} />
        <PrototypeIntakeQueuePanel items={filterPrototypeIntakeQueueByTenant(samplePrototypeIntakeQueue, tenantId)} />
        <PrototypeIntakeStorageGuardPanel guards={samplePrototypeIntakeStorageGuards} />
        <EvidencePacketFlowPanel flow={samplePrototypeIntakeEvidencePacketFlow} />
        <PrototypeReturnPackageChecklistPanel
          checklists={filterPrototypeReturnPackageChecklistsByTenant(samplePrototypeReturnPackageChecklists, tenantId)}
        />
        <PrototypeReturnReadinessSummaryPanel summary={samplePrototypeReturnReadinessSummary} />

        <section id="handoff-packets" className="grid scroll-mt-6 gap-5">
          <AiGeneratorSectionHeader
            eyebrow="Prototype section"
            title="External handoff packets"
            summary="Review copy-ready task instructions and export readiness without sending live tasks or accepting returned code."
            status="review-only"
          />
          <AiGeneratedGameBuildBriefPanel
            packets={filterAiGeneratedGameBuildBriefPacketsByTenant(sampleAiGeneratedGameBuildBriefPackets, tenantId)}
          />
          <AiExternalPrototypeTaskPacketPanel
            packets={filterAiExternalPrototypeTaskPacketsByTenant(sampleAiExternalPrototypeTaskPackets, tenantId)}
          />
          <AiExternalPrototypeTaskExportReadinessGatePanel
            gates={filterAiExternalPrototypeTaskExportReadinessGatesByTenant(
              sampleAiExternalPrototypeTaskExportReadinessGates,
              tenantId,
            )}
          />
        </section>

        <section id="return-evidence" className="grid scroll-mt-6 gap-5">
          <AiGeneratorSectionHeader
            eyebrow="Prototype section"
            title="Returned prototype evidence"
            summary="Check wrapper, fixture, event, audio, mobile, and scoring evidence before any integration discussion."
            status="review-only"
          />
          <AiPrototypeReturnReviewPanel
            packets={filterAiPrototypeReturnReviewPacketsByTenant(sampleAiPrototypeReturnReviewPackets, tenantId)}
          />
          <AiPrototypeIntegrationPlanPanel
            plans={filterAiPrototypeIntegrationPlansByTenant(sampleAiPrototypeIntegrationPlans, tenantId)}
          />
          <AiPrototypeWrapperAdapterReviewPanel
            reviews={filterAiPrototypeWrapperAdapterReviewsByTenant(sampleAiPrototypeWrapperAdapterReviews, tenantId)}
          />
          <AiPrototypeFixtureReplayReportPanel
            reports={filterAiPrototypeFixtureReplayReportsByTenant(sampleAiPrototypeFixtureReplayReports, tenantId)}
          />
          <AiPrototypeEventReplayReportPanel
            reports={filterAiPrototypeEventReplayReportsByTenant(sampleAiPrototypeEventReplayReports, tenantId)}
          />
          <AiPrototypeAudioCoverageReportPanel
            reports={filterAiPrototypeAudioCoverageReportsByTenant(sampleAiPrototypeAudioCoverageReports, tenantId)}
          />
          <AiPrototypeMobileAccessibilityReportPanel
            reports={filterAiPrototypeMobileAccessibilityReportsByTenant(
              sampleAiPrototypeMobileAccessibilityReports,
              tenantId,
            )}
          />
          <AiPrototypeScoringReplayReportPanel
            reports={filterAiPrototypeScoringReplayReportsByTenant(sampleAiPrototypeScoringReplayReports, tenantId)}
          />
        </section>

        <section id="patch-gates" className="grid scroll-mt-6 gap-5">
          <AiGeneratorSectionHeader
            eyebrow="Prototype section"
            title="Integration and patch gates"
            summary="Keep Codex decisions, patch proposals, test planning, signatures, release locks, and change-set previews blocked."
            status="blocked"
          />
          <AiPrototypeCodexIntegrationDecisionPanel
            decisions={filterAiPrototypeCodexIntegrationDecisionsByTenant(
              sampleAiPrototypeCodexIntegrationDecisions,
              tenantId,
            )}
          />
          <AiPrototypeIntegrationReadinessGatePanel
            gates={filterAiPrototypeIntegrationReadinessGatesByTenant(
              sampleAiPrototypeIntegrationReadinessGates,
              tenantId,
            )}
          />
          <AiPrototypeAppPatchProposalPanel
            proposals={filterAiPrototypeAppPatchProposalsByTenant(sampleAiPrototypeAppPatchProposals, tenantId)}
          />
          <AiPrototypePatchTestReadinessGatePanel
            gates={filterAiPrototypePatchTestReadinessGatesByTenant(sampleAiPrototypePatchTestReadinessGates, tenantId)}
          />
          <AiPrototypePatchTestHarnessPlanPanel
            plans={filterAiPrototypePatchTestHarnessPlansByTenant(sampleAiPrototypePatchTestHarnessPlans, tenantId)}
          />
          <AiPrototypePatchHarnessImplementationProposalPanel
            proposals={filterAiPrototypePatchHarnessImplementationProposalsByTenant(
              sampleAiPrototypePatchHarnessImplementationProposals,
              tenantId,
            )}
          />
          <AiPrototypeCodexPatchApprovalDecisionPanel
            decisions={filterAiPrototypeCodexPatchApprovalDecisionsByTenant(
              sampleAiPrototypeCodexPatchApprovalDecisions,
              tenantId,
            )}
          />
          <AiPrototypeSignedApprovalPreflightPanel
            preflights={filterAiPrototypeSignedApprovalPreflightsByTenant(sampleAiPrototypeSignedApprovalPreflights, tenantId)}
          />
          <AiPrototypePatchAuthorizationReleaseLockPanel
            locks={filterAiPrototypePatchAuthorizationReleaseLocksByTenant(
              sampleAiPrototypePatchAuthorizationReleaseLocks,
              tenantId,
            )}
          />
          <AiPrototypePatchImplementationWorkOrderPanel
            workOrders={filterAiPrototypePatchImplementationWorkOrdersByTenant(
              sampleAiPrototypePatchImplementationWorkOrders,
              tenantId,
            )}
          />
          <AiPrototypePatchChangeSetPreviewPanel
            previews={filterAiPrototypePatchChangeSetPreviewsByTenant(sampleAiPrototypePatchChangeSetPreviews, tenantId)}
          />
        </section>
      </div>
    </AppShell>
  );
}

function PrototypeLink({ href, label }: { href: string; label: string }) {
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
