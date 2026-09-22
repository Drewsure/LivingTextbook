import {
  validateWhiteLabelReleaseReadiness,
  type WhiteLabelReleaseReadiness,
} from "@living-textbook/content-model";
import { samplePackageReadinessReconciliations } from "@/data/samplePackageReadinessReconciliation";
import { samplePackageApprovalLedger } from "@/data/samplePackageApprovalLedger";
import { samplePackagePublishGate } from "@/data/samplePackagePublishGate";
import { samplePilotReviewDecision } from "@/data/samplePilotReviewDecision";

const samplePackageReconciliation = samplePackageReadinessReconciliations.find(
  (reconciliation) => reconciliation.packageId === "sample-publisher-l1-u1-routines-package",
);
if (!samplePackageReconciliation) throw new Error("Sample publisher package readiness reconciliation is required.");
const unresolvedPackageLanes = samplePackageReconciliation.lanes.filter((lane) => lane.status !== "ready-preview");
const blockingReleaseGates = samplePackagePublishGate.items.filter((item) => item.blocksRelease && item.status !== "ready");
const requiredApprovals = samplePackageApprovalLedger.signoffs.filter((signoff) => signoff.requiredBeforePilot);
const openApprovals = requiredApprovals.filter((signoff) => signoff.status !== "signed");

export const sampleWhiteLabelReleaseReadiness: WhiteLabelReleaseReadiness = {
  readinessId: "sample-publisher-white-label-release-readiness-v1",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  label: "Sample Publisher white-label release readiness",
  status: "blocked",
  phases: [
    {
      phaseId: "foundation-hardening",
      label: "Foundation hardening",
      status: "ready",
      evidenceRecords: ["verify:foundation", "typecheck:web", "active-route-verification"],
      blockers: [],
      nextAction: "Keep the standing verification gate green as later phases advance.",
    },
    {
      phaseId: "canonical-game-integration",
      label: "Canonical game integration",
      status: "review-only",
      evidenceRecords: ["canonical-game-replay-evidence", "phaser-candidate-adjudication"],
      blockers: ["Frozen external candidates have not passed wrapper and integration review."],
      nextAction: "Review a complete external evidence packet before proposing a wrapper.",
    },
    {
      phaseId: "controlled-pilot",
      label: "Controlled pilot",
      status: "blocked",
      evidenceRecords: ["pilot-readiness-dashboard", "classroom-launch-gate", "school-policy-gate"],
      blockers: ["Real learner capture, live launch, and report export remain disabled."],
      nextAction: "Complete school policy, private assignment, persistence, and deployment rehearsal.",
    },
    {
      phaseId: "publisher-content-pipeline",
      label: "Publisher content pipeline",
      status: "review-only",
      evidenceRecords: ["source-review-queue", "upload-channel-readiness", "content-package-runtime"],
      blockers: ["PDF, text, image, audio, video, and font intake remains promotion-gated."],
      nextAction: "Review one complete tenant package through source, media, and release gates.",
    },
    {
      phaseId: "production-persistence-deployment",
      label: "Production persistence and deployment",
      status: "blocked",
      evidenceRecords: ["persistence-provider-selection-preflight", "local-bundle-readiness", "deployment-decision-workbench"],
      blockers: ["No provider is selected and no durable write or activation path is approved."],
      nextAction: "Accept policy and cost evidence before selecting a provider work order.",
    },
    {
      phaseId: "accessibility-localization",
      label: "Accessibility and localization",
      status: "review-only",
      evidenceRecords: ["audio-accessibility-runtime", "target-language-readiness", "japanese-target-tenant-preview"],
      blockers: ["Japanese and other target-language packages need tenant-reviewed evidence before release."],
      nextAction: "Complete target-language, script-policy, audio, and accessibility review per tenant.",
    },
    {
      phaseId: "optional-ai-services",
      label: "Optional AI services",
      status: "blocked",
      evidenceRecords: ["ai-service-boundary", "ai-tutor-entitlement-gate", "speech-cost-policy"],
      blockers: ["AI Tutor and paid speech services are not enabled for student use."],
      nextAction: "Keep optional AI behind teacher, school, privacy, and cost approvals.",
    },
    {
      phaseId: "release-readiness",
      label: "Release readiness",
      status: "blocked",
      evidenceRecords: ["release-control-readiness", "package-entitlements", "recovery-runtime"],
      blockers: ["Production approval, QR mutation, and student production launch remain blocked."],
      nextAction: "Close the phase blockers and rerun the full release gate before approval.",
    },
  ],
  qualityChecks: {
    typecheck: true,
    productionBuild: true,
    activeRoutes: true,
    runtime: true,
    browser: true,
    privacy: true,
    tenantIsolation: true,
  },
  qualityEvidence: [
    ["typecheck", "Web typecheck", "typecheck:web"],
    ["productionBuild", "Production build", "web-production-build"],
    ["activeRoutes", "Active route sweep", "active-route-verification"],
    ["runtime", "Runtime composition", "verify:foundation-composition"],
    ["browser", "Browser rehearsal", "browser-rehearsal-evidence"],
    ["privacy", "Privacy boundary", "privacy-boundary-verification"],
    ["tenantIsolation", "Tenant isolation", "tenant-isolation-verification"],
  ].map(([checkId, label, sourceRecord]) => ({
    checkId: checkId as keyof WhiteLabelReleaseReadiness["qualityChecks"],
    label,
    verified: true,
    sourceRecord,
    observedAt: "2026-09-22T00:00:00.000Z",
    notes: "Evidence observed in the review-only foundation gate; this does not authorize release.",
  })),
  packageEvidence: {
    reconciliationId: samplePackageReconciliation.reconciliationId,
    packageId: samplePackageReconciliation.packageId,
    sourceAssemblyChecksum: samplePackageReconciliation.sourceAssemblyChecksum,
    status: samplePackageReconciliation.status === "blocked" ? "blocked" : "review-only",
    totalLaneCount: samplePackageReconciliation.lanes.length,
    readyPreviewLaneCount: samplePackageReconciliation.lanes.filter((lane) => lane.status === "ready-preview").length,
    unresolvedLaneCount: unresolvedPackageLanes.length,
    unresolvedLaneIds: unresolvedPackageLanes.map((lane) => lane.laneId),
    promotionAllowed: false,
    studentFacingActivationAllowed: false,
  },
  pilotEvidence: {
    decisionId: samplePilotReviewDecision.decisionId,
    tenantId: samplePilotReviewDecision.tenantId,
    packageId: samplePilotReviewDecision.packageId,
    handoffRouteKey: samplePilotReviewDecision.handoffRouteKey,
    evidenceHandoffRouteKey: samplePilotReviewDecision.evidenceHandoffRouteKey,
    status: samplePilotReviewDecision.status,
    blockingReasons: samplePilotReviewDecision.blockingReasons,
    blockingReasonCount: samplePilotReviewDecision.blockingReasons.length,
    evidenceBindings: samplePilotReviewDecision.evidenceBindings,
    pilotLaunchAllowed: false,
    studentDataCollectionAllowed: false,
    reportExportAllowed: false,
  },
  releaseControlEvidence: {
    releaseGateId: samplePackagePublishGate.gateId,
    approvalLedgerId: samplePackageApprovalLedger.ledgerId,
    releaseCandidate: samplePackagePublishGate.releaseCandidate,
    packageId: samplePackagePublishGate.packageId,
    status: blockingReleaseGates.length > 0 ? "blocked" : openApprovals.length > 0 ? "review-only" : "pilot-ready",
    blockingGateCount: blockingReleaseGates.length,
    requiredApprovalCount: requiredApprovals.length,
    openApprovalCount: openApprovals.length,
    sourceRecords: [
      `package-publish-gate:${samplePackagePublishGate.gateId}`,
      `approval-ledger:${samplePackageApprovalLedger.ledgerId}`,
      `pilot-review:${samplePilotReviewDecision.decisionId}`,
    ],
    promotionAllowed: false,
    studentFacingActivationAllowed: false,
  },
  productionApprovalAllowed: false,
  studentProductionLaunchAllowed: false,
  blockedActions: [
    "No production approval",
    "No student production launch",
    "No real learner data collection",
    "No provider activation",
    "No package promotion",
    "No QR redirect mutation",
    "No public community publishing",
  ],
  nextAction: "Continue closing phase blockers; this dashboard is a readiness control surface, not a release button.",
  note: "MiniStar remains the flagship tenant, while this record is intentionally expressed as a reusable publisher-facing release contract.",
};

export const sampleWhiteLabelReleaseReadinessErrors = validateWhiteLabelReleaseReadiness(sampleWhiteLabelReleaseReadiness);
