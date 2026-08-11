import {
  sampleAiGeneratedPackageWriterTestHarnessPlans,
  type AiGeneratedPackageWriterTestHarnessPlan,
} from "@/data/sampleAiGeneratedPackageWriterTestHarnessPlan";
import {
  getAiGeneratedPackageWriterTestHarnessImplementationProposalCollectionWarnings,
  validateAiGeneratedPackageWriterTestHarnessImplementationProposals,
  type AiGeneratedPackageWriterTestHarnessImplementationProposal,
  type AiGeneratedPackageWriterTestHarnessImplementationProposalStatus,
} from "@living-textbook/content-model/src/aiPackageWriterTestHarnessImplementationProposal";

export type {
  AiGeneratedPackageWriterTestHarnessImplementationProposal,
  AiGeneratedPackageWriterTestHarnessImplementationProposalStatus,
};

export const sampleAiGeneratedPackageWriterTestHarnessImplementationProposals:
  AiGeneratedPackageWriterTestHarnessImplementationProposal[] = sampleAiGeneratedPackageWriterTestHarnessPlans.map(
  (plan) => createImplementationProposal(plan),
);

export const sampleAiGeneratedPackageWriterTestHarnessImplementationProposalErrors =
  validateAiGeneratedPackageWriterTestHarnessImplementationProposals(
    sampleAiGeneratedPackageWriterTestHarnessImplementationProposals,
  );

export const sampleAiGeneratedPackageWriterTestHarnessImplementationProposalWarnings =
  getAiGeneratedPackageWriterTestHarnessImplementationProposalCollectionWarnings(
    sampleAiGeneratedPackageWriterTestHarnessImplementationProposals,
  );

export function filterAiGeneratedPackageWriterTestHarnessImplementationProposalsByTenant(
  proposals: AiGeneratedPackageWriterTestHarnessImplementationProposal[],
  tenantId: string,
): AiGeneratedPackageWriterTestHarnessImplementationProposal[] {
  return proposals.filter((proposal) => proposal.tenantId === tenantId);
}

function createImplementationProposal(
  plan: AiGeneratedPackageWriterTestHarnessPlan,
): AiGeneratedPackageWriterTestHarnessImplementationProposal {
  const isMiniStar = plan.tenantId === "ministar";

  return {
    proposalId: `ai-generated-package-writer-test-harness-implementation-proposal-${plan.requestId}`,
    tenantId: plan.tenantId,
    requestId: plan.requestId,
    harnessPlanId: plan.harnessPlanId,
    evidencePacketId: plan.evidencePacketId,
    label: isMiniStar
      ? "MiniStar package writer test harness implementation proposal"
      : "AI package writer test harness implementation proposal",
    status: "blocked",
    summary: isMiniStar
      ? "MiniStar harness implementation remains blocked until Codex approves module scope, release rollback, storage verification, route and playlist guards, local bundle checks, assignment gates, QR policy, and hiragana support-only assertions."
      : "Package writer harness implementation remains blocked until Codex approves module scope, release rollback, storage verification, route and playlist guards, local bundle checks, assignment gates, and QR policy.",
    proposedModuleScope: [
      "Future package fixture replay adapter only",
      "Future route smoke adapter only",
      "Future media policy assertion adapter only",
      "Future local companion dry-run adapter only",
      "Future assignment shell assertion adapter only",
      "Future rollback guard assertion adapter only",
      "Future support-language boundary assertion adapter only",
      "Future read-only evidence report formatter only",
    ],
    implementationBoundaries: [
      "No test harness implementation from this proposal.",
      "No runtime test runner is proposed here.",
      "No mutation browser workflow is proposed here.",
      "No evidence upload or signed approval capture is proposed here.",
      "No app file patch, package JSON write, route write, playlist write, local bundle write, or assignment activation is proposed here.",
      "Support-language checks remain support-only and cannot unlock target-language progress.",
    ],
    requiredReviewGates: [
      "Codex test harness implementation decision",
      "Package writer test harness plan storage contract accepted",
      "Release rollback guard review accepted",
      "Route registry write guard accepted",
      "Media playlist write guard accepted",
      "Local companion package guard accepted",
      "Teacher assignment rollout gate accepted",
      "School policy acceptance preflight accepted",
    ],
    dryRunOnlyChecks: [
      "Reviewed package fixture assertion names",
      "Target-language audio coverage assertion names",
      "Route smoke assertion names",
      "Media policy assertion names",
      "Local companion manifest assertion names",
      "Assignment shell assertion names",
      "Rollback guard assertion names",
      ...(isMiniStar ? ["Hiragana support-language assertion names"] : []),
    ],
    blockedActions: [
      "No harness implementation from this proposal",
      "No automated writer test execution",
      "No writer mutation browser run",
      "No evidence upload",
      "No signed approval capture",
      "No app file patch",
      "No generated package JSON write",
      "No route registry write",
      "No media playlist write",
      "No local bundle packaging",
      "No assignment activation",
      "No production QR redirect mutation",
      "No support-language-only harness pass",
    ],
    nextRequiredRecords: [
      "Codex test harness implementation decision",
      "Harness implementation file-scope review",
      "Route and playlist write guard review",
      "Local companion package guard review",
      "Teacher assignment rollout gate",
      "School policy acceptance preflight",
    ],
    supportLanguageBoundary: plan.supportLanguageBoundary,
  };
}
