import {
  validatePilotReviewDecision,
  type PilotReviewDecision,
} from "@living-textbook/content-model";
import {
  samplePublisherEvidencePacketHandoffPackage,
  samplePublisherEvidencePacketHandoffPackageErrors,
  type EvidencePacketHandoffPackage,
} from "@/data/sampleEvidencePacketHandoffPackage";
import { samplePilotHandoffPackage, type PilotHandoffPackage } from "@/data/samplePilotHandoffPackage";
import { samplePilotLineageValidationErrors } from "@/data/samplePilotLineageValidation";
import { validatePilotHandoffPackage } from "@living-textbook/content-model";

export type { PilotReviewDecision } from "@living-textbook/content-model";

export const samplePilotReviewDecision = createPilotReviewDecision(
  samplePilotHandoffPackage,
  samplePublisherEvidencePacketHandoffPackage,
  [
    ...validatePilotHandoffPackage(samplePilotHandoffPackage),
    ...samplePilotLineageValidationErrors,
    ...samplePublisherEvidencePacketHandoffPackageErrors,
  ],
);

export const samplePilotReviewDecisionErrors = validatePilotReviewDecision(samplePilotReviewDecision);

export function createPilotReviewDecision(
  handoffPackage: PilotHandoffPackage,
  evidencePackage: EvidencePacketHandoffPackage,
  packetValidationErrors: string[],
): PilotReviewDecision {
  const blockingReasons = [
    ...packetValidationErrors,
    ...handoffPackage.releaseControlEvidence.releaseBlockingReasons,
    ...handoffPackage.persistenceGateEvidence.blockedReasons,
    ...handoffPackage.activationPreflightEvidence.blockedReasons,
    ...evidencePackage.sections
      .filter((section) => section.status === "blocked")
      .map((section) => `${section.label} remains blocked before evidence export.`),
    ...(handoffPackage.approvalEvidence.status === "ready"
      ? []
      : [`Approval ledger remains ${handoffPackage.approvalEvidence.status}.`]),
    ...(handoffPackage.decisions
      .filter((decision) => decision.status !== "ready")
      .map((decision) => `${decision.label} remains ${decision.status}.`)),
  ];

  const requiredNextSteps = [
    "Resolve every release-control blocker before a pilot release decision.",
    "Complete required human approvals without enabling signature capture in this preview.",
    "Accept school privacy, retention, reporting, and persistence policy before real learner data.",
    "Run the teacher dry run and browser/mobile checks against the final reviewed package.",
  ];

  return {
    decisionId: `${handoffPackage.packageId}-review-decision`,
    tenantId: handoffPackage.tenantId,
    packageId: handoffPackage.packageId,
    handoffRouteKey: handoffPackage.routeKey,
    evidenceHandoffRouteKey: evidencePackage.routeKey,
    storageSelectionPreflightId: handoffPackage.storageSelectionPreflightId,
    storageSelectionGateId: handoffPackage.storageSelectionGateId,
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
    status: "demo-ready-pilot-blocked",
    mode: "review-only",
    demoAllowed: true,
    pilotLaunchAllowed: false,
    studentDataCollectionAllowed: false,
    reportExportAllowed: false,
    packagePromotionAllowed: false,
    blockingReasons: [...new Set(blockingReasons)],
    requiredNextSteps,
    evidenceBindings: [
      `pilot-handoff:${handoffPackage.routeKey}`,
      `evidence-handoff:${evidencePackage.packageId}:${evidencePackage.routeKey}`,
      `approval-ledger:${handoffPackage.approvalEvidence.ledgerId}`,
      `report-snapshot:${handoffPackage.reportSnapshotEvidence.snapshotId}`,
      `persistence-gate:${handoffPackage.persistenceGateEvidence.packageId}`,
      `activation-preflight:${handoffPackage.activationPreflightEvidence.packetId}`,
      `storage-selection-preflight:${handoffPackage.storageSelectionPreflightId}`,
      `storage-selection-gate:${handoffPackage.storageSelectionGateId}`,
    ],
  };
}
